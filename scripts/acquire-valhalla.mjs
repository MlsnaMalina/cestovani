import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {destination} from '../data/destination.mjs';
const home=[14.5604,50.0017],si=[14.585544,46.32924],hr=destination.coordinates;
const linz=[14.297402,48.243222],graz=[15.50602,46.857862],mikulov=[16.641198,48.776644],tuhinj=[14.751764,46.218318],ljubelj=[14.254516,46.437195];
// Body na správném směru vozovky, ověřené z OSRM 8. 9. 2026.
const northGraz=[15.506124,46.857949],northLinz=[14.297586,48.243226],macelj=[15.847016,46.237829];
const westBregana=[15.657217,45.872045];
const jobs=[
 ['si-a',[home,linz,graz,tuhinj,si]],
 ['si-b',[home,mikulov,graz,tuhinj,si]],
 ['si-c-north',[home,linz,[14.463665,47.42657],[14.449515,46.871792],ljubelj]],
 ['si-c-south',[ljubelj,[14.42657,46.287185],[14.542684,46.195252],si]],
 ['si-d',[home,[13.124005,47.676423],[14.021033,46.504789],si]],
 ['si-a-smooth',[home,linz,graz,[14.624035,46.138302],si]],
 ['si-b-smooth',[home,mikulov,graz,[14.624035,46.138302],si]],
 ['hr-a',[si,[15.656931,45.872014],[15.795954,45.790411],hr]],
 ['hr-b',[si,[14.249859,45.526621],[14.822465,45.39375],hr]],
 ['hr-c',[si,[15.321929,45.637943],hr]],
 ['home-a',[hr,macelj,northGraz,northLinz,home]],
 ['home-b',[hr,macelj,northGraz,mikulov,home]],
 ['home-c',[hr,westBregana,[14.021033,46.504789],[13.124005,47.676423],home]],
];
await mkdir('research/valhalla',{recursive:true});
for(const [id,points] of jobs){
  const payload={locations:points.map(([lon,lat],i)=>({lon,lat,type:i===0||i===points.length-1?'break':'through',...((points[i]===linz||points[i]===graz)?{heading:180,heading_tolerance:80}:{} )})),costing:'auto',costing_options:{auto:{exclude_ferries:true,exclude_unpaved:true,...(id==='si-c-south'?{exclude_highways:true,exclude_tolls:true}:{})}},units:'kilometers'};
  const url='https://valhalla1.openstreetmap.de/route?json='+encodeURIComponent(JSON.stringify(payload));
  let record;try{record=JSON.parse(await readFile(`research/valhalla/${id}.json`,'utf8'));if(record.url!==url)record=null;}catch{}
  if(!record){const response=await fetch(url,{signal:AbortSignal.timeout(45000)});const data=await response.json();if(!data.trip)throw Error(id+JSON.stringify(data));record={url,payload,checkedAt:new Date().toISOString(),data};await writeFile(`research/valhalla/${id}.json`,JSON.stringify(record));await new Promise(r=>setTimeout(r,1100));}
  const t=record.data.trip,m=t.legs.flatMap(l=>l.maneuvers);
  console.log(JSON.stringify({id,km:t.summary.length,hours:Math.round(t.summary.time/360)/10,highway:t.summary.has_highway,toll:t.summary.has_toll,rough:m.filter(x=>x.rough).map(x=>({names:x.street_names,km:x.length})),turns:m.filter(x=>[9,10].includes(x.type)).map(x=>x.instruction),roads:m.filter(x=>x.length>8).map(x=>({name:x.street_names?.join('/'),km:x.length,highway:x.highway}))}));
}
