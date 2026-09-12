import {readFile,writeFile} from 'node:fs/promises';
import {decodePolyline} from './geo.mjs';
const trip=JSON.parse(await readFile('public/data/trip.json','utf8'));
const directions={north:'sever',northeast:'severovýchod',east:'východ',southeast:'jihovýchod',south:'jih',southwest:'jihozápad',west:'západ',northwest:'severozápad'};
function translate(text){
 return text.replace(/Drive (northwest|northeast|southwest|southeast|north|south|east|west)/g,(_,d)=>'Vyjeďte směrem na '+directions[d])
 .replace(/You have arrived at your destination\./g,'Příjezd k cílovému bodu.').replace(/Your destination is on the right\./g,'Cílový bod je vpravo.').replace(/Your destination is on the left\./g,'Cílový bod je vlevo.')
 .replace(/Enter the roundabout and take the (\d+)(?:st|nd|rd|th) exit/g,'Na kruhovém objezdu použijte $1. výjezd').replace(/Exit the roundabout/g,'Vyjeďte z kruhového objezdu')
 .replace(/Enter (.*?) and take the (\d+)(?:st|nd|rd|th) exit/g,'Na kruhovém objezdu $1 použijte $2. výjezd').replace(/Take the (.*?) exit/g,'Použijte sjezd $1').replace(/Take the ramp/g,'Použijte nájezd')
 .replace(/Take exit /g,'Použijte sjezd ').replace(/Take the exit/g,'Použijte sjezd').replace(/Take the (.*?) ramp/g,'Použijte nájezd $1').replace(/Stay straight/g,'Pokračujte rovně').replace(/Keep straight/g,'Držte se rovně').replace(/Keep right/g,'Držte se vpravo').replace(/Keep left/g,'Držte se vlevo')
 .replace(/Make a sharp left/g,'Odbočte ostře vlevo').replace(/Make a sharp right/g,'Odbočte ostře vpravo').replace(/Make a left U-turn/g,'Otočte se vlevo').replace(/Make a right U-turn/g,'Otočte se vpravo').replace(/Turn right/g,'Odbočte vpravo').replace(/Turn left/g,'Odbočte vlevo').replace(/Bear right/g,'Odbočte mírně vpravo').replace(/Bear left/g,'Odbočte mírně vlevo').replace(/Continue/g,'Pokračujte')
 .replace(/exit (\d+)/g,'sjezd $1').replace(/ to take the ramp/g,' na nájezd').replace(/ to take /g,' na ').replace(/ to stay on /g,' a pokračujte po ').replace(/ on the left/g,' vlevo').replace(/ on the right/g,' vpravo').replace(/ at the fork/g,' na rozvětvení').replace(/ toward /g,' směr ').replace(/ onto /g,' na ').replace(/ on /g,' po ').replace(/ to /g,' k ');
}
async function read(path){return JSON.parse(await readFile(path,'utf8'));}
function steps(record){let at=0;return record.data.trip.legs.map(leg=>{const shape=decodePolyline(leg.shape);return leg.maneuvers.map(m=>{const row={atKm:at,lengthKm:m.length,text:translate(m.instruction),original:m.instruction,roads:[...new Set([...(m.begin_street_names??[]),...(m.street_names??[])])],point:shape[m.begin_shape_index],type:m.type,rough:!!m.rough};at+=m.length;return row;});});}
const output={};
for(const route of trip.routes){const ids=route.id==='si-c'?['si-c-north','si-c-south']:[route.id];let offset=0;const base=[];
 for(let i=0;i<ids.length;i++){const record=await read('research/valhalla/'+ids[i]+'.json');if(record.url!==route.routingUrls[i])throw Error('Stale route cache '+route.id);const rows=steps(record).flat();for(const row of rows){if(i<ids.length-1&&[4,5,6].includes(row.type))continue;base.push({...row,atKm:row.atKm+offset});}offset+=record.data.trip.summary.length;}
 const detours={};for(const visit of route.stops){const record=await read('research/stop-routing/'+route.id+'--'+visit.id+'.json');if(record.url!==visit.routingUrl)throw Error('Stale stop cache '+route.id+visit.id);const legs=steps(record);if(legs.length!==2)throw Error('Expected round trip '+visit.id);detours[visit.id]={legs,checkedAt:record.checkedAt};}
 if(Math.abs(offset-route.distanceKm)>.03)throw Error('Route length mismatch '+route.id);
 output[route.id]={steps:base,detours,checkedAt:route.checkedAt};
}
await writeFile('data/roadbooks.json',JSON.stringify(output)+'\n');
console.log('Prepared',Object.keys(output).length,'routes;',Object.values(output).reduce((n,r)=>n+r.steps.length,0),'base instructions with detour legs.');
