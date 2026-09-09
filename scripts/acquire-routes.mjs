import {readFile,writeFile,mkdir} from 'node:fs/promises';
const HOME=[14.5604,50.0017], SI=[14.585544,46.32924], HR=[15.2782346,44.0770376];
const LINZ=[14.297402,48.243222], GRAZ=[15.50602,46.857862], MIKULOV=[16.618,48.81], LJUBELJ=[14.260,46.431];
const jobs=[
 ['si-a',[HOME,LINZ,GRAZ,[15.69,46.531],[15.283,46.247],SI]],
 ['si-b',[HOME,MIKULOV,GRAZ,[15.69,46.531],[15.283,46.247],SI]],
 ['si-c-north',[HOME,LINZ,[14.484,47.434],[14.449515,46.871792],LJUBELJ]],
 ['si-c-south',[LJUBELJ,[14.291,46.357],[14.385,46.307],[14.423,46.274],[14.489,46.255],[14.54,46.212],SI]],
 ['si-d',[HOME,[13.124005,47.676423],[14.021033,46.504789],SI]],
 ['si-a-smooth',[HOME,LINZ,GRAZ,[15.69,46.531],[15.283,46.247],[14.632,46.122],SI]],
 ['si-b-smooth',[HOME,MIKULOV,GRAZ,[15.69,46.531],[15.283,46.247],[14.632,46.122],SI]],
 ['hr-a',[SI,[15.443,45.841],[15.908,45.740],HR]],
 ['hr-b',[SI,[14.248,45.571],[14.530,45.359],HR]],
 ['hr-c',[SI,[15.189,45.655],[15.568,45.485],HR]],
 ['home-a',[HR,[15.909,45.740],[15.866,46.236],GRAZ,LINZ,HOME]],
 ['home-b',[HR,[15.909,45.740],[15.866,46.236],GRAZ,MIKULOV,HOME]],
 ['home-c',[HR,[15.909,45.740],[15.443,45.841],[14.021033,46.504789],[13.124005,47.676423],HOME]],
];
await mkdir('research/raw',{recursive:true});
for (const [id,coordinates] of jobs) {
  const bearings=coordinates.map(p=>(p===LINZ||p===GRAZ)?(id.startsWith('home')?'0,80':'180,80'):'').join(';');
  const url='https://routing.openstreetmap.de/routed-car/route/v1/driving/'+coordinates.map(p=>p.join(',')).join(';')+'?overview=full&geometries=geojson&steps=true&annotations=distance,duration&bearings='+bearings;
  let record;
  try {record=JSON.parse(await readFile(`research/raw/${id}.json`,'utf8'));if(record.url!==url)record=null;}catch{}
  if(!record){const response=await fetch(url,{headers:{'User-Agent':'FamilyTripPlanner/1.0 development'},signal:AbortSignal.timeout(45000)});const data=await response.json();if(data.code!=='Ok')throw Error(id+': '+JSON.stringify(data));record={url,checkedAt:new Date().toISOString(),data};await writeFile(`research/raw/${id}.json`,JSON.stringify(record));await new Promise(r=>setTimeout(r,1100));}
  const r=record.data.routes[0],steps=r.legs.flatMap(l=>l.steps);
  console.log(JSON.stringify({id,km:Math.round(r.distance/1000),hours:Math.round(r.duration/360)/10,snaps:record.data.waypoints.map(w=>Math.round(w.distance)),roads:steps.filter(s=>s.distance>7000).map(s=>`${s.ref||s.name} ${Math.round(s.distance/1000)}km`),uTurns:steps.filter(s=>s.maneuver.modifier==='uturn').map(s=>({name:s.name,at:s.maneuver.location}))}));
}
