import {Temporal} from '@js-temporal/polyfill';
import type {Country,Dataset,Route,Selection,Settings,StageId,TimedStop} from './types';
export const timezone='Europe/Prague';
export const money=(n:number)=>new Intl.NumberFormat('cs-CZ',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(n);
export const km=(n:number)=>Math.round(n).toLocaleString('cs-CZ');
export function duration(n:number){const m=Math.round(n);return `${Math.floor(m/60)} h ${String(m%60).padStart(2,'0')} min`;}
export function moment(local:string,minutes=0){return Temporal.PlainDateTime.from(local).toZonedDateTime(timezone,{disambiguation:'reject'}).add({seconds:Math.round(minutes*60)});}
export function clockAt(local:string,minutes=0){const t=moment(local,minutes);return `${t.hour.toString().padStart(2,'0')}:${t.minute.toString().padStart(2,'0')}`;}
export function dateAt(local:string,minutes=0){const t=moment(local,minutes);return `${t.day}. ${t.month}. ${t.year}`;}
export function dateTime(local:string,minutes=0){return `${dateAt(local,minutes)} · ${clockAt(local,minutes)}`;}
export function validLocal(value:string){try{moment(value);return true;}catch{return false;}}
export function itinerary(route:Route,selection?:Selection){
 let shift=0,extraKm=0;const stops:TimedStop[]=[];
 for(const visit of [...route.stops].sort((a,b)=>a.fromKm-b.fromKm)){
  const stay=selection?.stops[visit.id];if(stay===undefined)continue;
  stops.push({visit,duration:stay,arrivalMinute:visit.atMinute+shift,leaveMinute:visit.atMinute+shift+stay,distanceKm:visit.atKm+extraKm});
  shift+=visit.detourMinutes+stay;extraKm+=visit.detourKm;
 }
 return {stops,distanceKm:route.distanceKm+extraKm,minutes:route.drivingMinutes+shift+(selection?.reserve??0),pauseMinutes:stops.reduce((n,s)=>n+s.duration,0),detourMinutes:stops.reduce((n,s)=>n+s.visit.detourMinutes,0),reserve:selection?.reserve??0};
}
export function candidateTime(route:Route,id:string,selection?:Selection){const visit=route.stops.find(p=>p.id===id)!;let shift=0;for(const s of itinerary(route,selection).stops){if(s.visit.fromKm<visit.fromKm)shift+=s.duration+s.visit.detourMinutes;}return visit.atMinute+shift;}
export function overlapping(route:Route,selection:Selection,id:string){const visit=route.stops.find(s=>s.id===id)!;return route.stops.some(s=>s.id!==id&&selection.stops[s.id]!==undefined&&visit.fromKm<s.toKm&&visit.toKm>s.fromKm);}
export function fuel(distance:number,consumption:number,price:number){if(![distance,consumption,price].every(Number.isFinite)||distance<0||consumption<=0||price<0)throw Error('Neplatné hodnoty výpočtu benzínu');const liters=distance/100*consumption;return {liters,eur:liters*price};}
export interface Pass{country:Country;from:string;to:string;eur:number;name:string}
export function vignettePasses(events:{country:Country;date:string}[]):Pass[]{
 const result:Pass[]=[];
 for(const country of ['AT','SI'] as const){const dates=[...new Set(events.filter(e=>e.country===country).map(e=>e.date))].sort();
  for(let i=0;i<dates.length;){const start=Temporal.PlainDate.from(dates[i]);const days=country==='AT'?10:7;const end=start.add({days:days-1});let j=i+1;while(j<dates.length&&Temporal.PlainDate.compare(dates[j],end)<=0)j++;
   const single=country==='AT'&&j-i===1;result.push({country,from:start.toString(),to:single?start.toString():end.toString(),eur:country==='AT'?(single?9.6:12.8):16,name:country==='AT'?(single?'Rakousko · 1 den':'Rakousko · 10 dní'):'Slovinsko 2A · 7 dní'});i=j;
  }
 }return result;
}
export function countryEvents(route:Route,departure:string,selection?:Selection){
 const stops=itinerary(route,selection).stops;const shift=(minute:number)=>stops.filter(s=>s.visit.fromMinute<minute).reduce((n,s)=>n+s.duration+s.visit.detourMinutes,0);
 return route.countryWindows.flatMap(w=>{const start=moment(departure,w.start+shift(w.start)).toPlainDate(),end=moment(departure,w.end+shift(w.end)+(selection?.reserve??0)).toPlainDate();const out:{country:Country;date:string}[]=[];for(let d=start;Temporal.PlainDate.compare(d,end)<=0;d=d.add({days:1}))out.push({country:w.country,date:d.toString()});return out;});
}
export function costs(route:Route,settings:Settings,selection?:Selection){const trip=itinerary(route,selection),gas=fuel(trip.distanceKm,settings.consumption,settings.fuelPrice);const passes=vignettePasses(countryEvents(route,settings.departures[route.stage],selection));const toll=routeToll(route,selection);const passTotal=passes.reduce((n,t)=>n+t.eur,0);return {...gas,toll,passes,passTotal,total:gas.eur+toll+passTotal};}
export function routeToll(route:Route,selection?:Selection){return route.tolls.reduce((n,t)=>n+t.eur,0)+(route.tollAdjustments??[]).filter(t=>selection?.stops[t.stopId]!==undefined).reduce((n,t)=>n+t.eur,0);}
export function budget(data:Dataset,settings:Settings){let gas=0,toll=0,distanceKm=0;const events:{country:Country;date:string}[]=[];for(const stage of data.stages){const choice=settings.plan[stage.id];if(!choice)continue;const route=data.routes.find(r=>r.id===choice.routeId);if(!route)continue;const trip=itinerary(route,choice);gas+=fuel(trip.distanceKm,settings.consumption,settings.fuelPrice).eur;toll+=routeToll(route,choice);distanceKm+=trip.distanceKm;events.push(...countryEvents(route,settings.departures[stage.id],choice));}const passes=vignettePasses(events);return {gas,toll,passes,distanceKm,total:gas+toll+passes.reduce((n,p)=>n+p.eur,0)};}
export function defaults(data:Dataset):Settings{return {consumption:8,fuelPrice:1.912,departures:Object.fromEntries(data.stages.map(s=>[s.id,s.date+'T'+s.departure])) as Record<StageId,string>,plan:{}};}
const object=(x:unknown):x is Record<string,unknown>=>typeof x==='object'&&x!==null&&!Array.isArray(x);
export function restore(raw:string|null,data:Dataset):Settings{
 const settings=defaults(data);try{const stored:unknown=JSON.parse(raw??'null');if(!object(stored))return settings;
  if(typeof stored.consumption==='number'&&stored.consumption>=2&&stored.consumption<=30)settings.consumption=stored.consumption;
  if(typeof stored.fuelPrice==='number'&&stored.fuelPrice>=.1&&stored.fuelPrice<=10)settings.fuelPrice=stored.fuelPrice;
  for(const stage of data.stages){if(object(stored.departures)){const date=stored.departures[stage.id];if(typeof date==='string'&&date.startsWith(stage.date+'T')&&validLocal(date))settings.departures[stage.id]=date;}
   if(object(stored.plan)){const choice=stored.plan[stage.id];if(!object(choice))continue;const route=data.routes.find(r=>r.stage===stage.id&&r.id===choice.routeId);if(!route)continue;const stops:Record<string,number>={};if(object(choice.stops))for(const visit of route.stops){const n=choice.stops[visit.id];if(typeof n==='number'&&Number.isInteger(n)&&n>=5&&n<=360)stops[visit.id]=n;}settings.plan[stage.id]={routeId:route.id,stops,reserve:typeof choice.reserve==='number'&&Number.isFinite(choice.reserve)&&choice.reserve>=0&&choice.reserve<=360?choice.reserve:0};}
  }
 }catch{/* Poškozené lokální nastavení nesmí zablokovat aplikaci. */}return settings;
}
