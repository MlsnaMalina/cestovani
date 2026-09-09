import {readFile,writeFile,mkdir} from 'node:fs/promises';
await mkdir('research/crosscheck',{recursive:true});
const output=[];
for(const id of ['si-a','si-b','si-d']){
 const primary=JSON.parse(await readFile(`research/valhalla/${id}.json`,'utf8'));
 const coords=primary.payload.locations.map(p=>p.lon+','+p.lat).join(';');
 const url='https://routing.openstreetmap.de/routed-car/route/v1/driving/'+coords+'?overview=false&steps=false&continue_straight=true';
 let record;try{record=JSON.parse(await readFile(`research/crosscheck/${id}.json`,'utf8'));if(record.url!==url)record=null;}catch{}
 if(!record){const response=await fetch(url,{signal:AbortSignal.timeout(45000)});const data=await response.json();if(!data.routes)throw Error(JSON.stringify(data));record={url,data,checkedAt:new Date().toISOString()};await writeFile(`research/crosscheck/${id}.json`,JSON.stringify(record));await new Promise(r=>setTimeout(r,1100));}
 output.push({id,url,distanceKm:record.data.routes[0].distance/1000,drivingMinutes:record.data.routes[0].duration/60,primaryKm:primary.data.trip.summary.length,primaryMinutes:primary.data.trip.summary.time/60,checkedAt:record.checkedAt});
}
await writeFile('data/crosschecks.json',JSON.stringify(output,null,2));console.log(output);
