import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {places} from '../data/places.mjs';
import {compileRoutes} from './compile-routes.mjs';
import {nearestIndex,compileTrip} from './geo.mjs';
await mkdir('research/stop-routing',{recursive:true});
const routes=await compileRoutes();
for(const route of routes){for(const id of route.stops){
 const p=places.find(x=>x.id===id),geo=JSON.parse(await readFile(`research/geocoding/${id}.json`,'utf8'));
 if(!geo.data[0])throw Error('Missing geocode '+id);
 const match=geo.data[id==='gleinkersee'?1:0];const point=[+match.lon,+match.lat];
 const i=nearestIndex(route,point),at=route.timing[i];
 let a=i,b=i;while(a>0&&route.timing[a].km>at.km-12)a--;while(b<route.timing.length-1&&route.timing[b].km<at.km+12)b++;
 const payload={locations:[route.coordinates[a],point,route.coordinates[b]].map(([lon,lat])=>({lon,lat,type:'break'})),costing:'auto',costing_options:{auto:{exclude_ferries:true,exclude_unpaved:true,...(route.id==='si-c'&&at.km>500?{exclude_highways:true,exclude_tolls:true}:{})}},units:'kilometers'};
 const url='https://valhalla1.openstreetmap.de/route?json='+encodeURIComponent(JSON.stringify(payload));
 const path=`research/stop-routing/${route.id}--${id}.json`;let record;try{record=JSON.parse(await readFile(path,'utf8'));if(record.url!==url)record=null;}catch{}
 if(!record){const response=await fetch(url,{signal:AbortSignal.timeout(45000)});const data=await response.json();if(!data.trip)throw Error(id+JSON.stringify(data));record={url,data,checkedAt:new Date().toISOString()};await writeFile(path,JSON.stringify(record));await new Promise(r=>setTimeout(r,1100));}
 const detour=compileTrip(record),baseKm=route.timing[b].km-route.timing[a].km,baseMin=route.timing[b].minute-route.timing[a].minute;
 const result={id,coordinates:point,geocodingUrl:geo.url,geocodedName:geo.data[0].display_name,fromKm:route.timing[a].km,toKm:route.timing[b].km,fromMinute:route.timing[a].minute,toMinute:route.timing[b].minute,atKm:route.timing[a].km+record.data.trip.legs[0].summary.length,atMinute:route.timing[a].minute+record.data.trip.legs[0].summary.time/60,detourKm:Math.max(0,detour.distanceKm-baseKm),detourMinutes:Math.max(0,detour.drivingMinutes-baseMin),geometry:detour.coordinates,routingUrl:url,checkedAt:record.checkedAt,snapped:record.data.trip.locations[1]};
 await writeFile(`research/stop-routing/${route.id}--${id}-compiled.json`,JSON.stringify(result));
 console.log(route.id,id,Math.round(result.atKm)+' km', '+'+Math.round(result.detourKm)+' km', '+'+Math.round(result.detourMinutes)+' min');
}}
