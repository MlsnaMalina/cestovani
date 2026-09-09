import {writeFile} from 'node:fs/promises';
const payload={locations:[{lon:14.5604,lat:50.0017},{lon:14.585544,lat:46.32924}],costing:'auto',units:'kilometers'};
const url='https://valhalla1.openstreetmap.de/route?json='+encodeURIComponent(JSON.stringify(payload));
const response=await fetch(url,{signal:AbortSignal.timeout(45000)});const data=await response.json();
await writeFile('research/raw/valhalla-default.json',JSON.stringify({url,checkedAt:new Date().toISOString(),data}));
console.log(JSON.stringify({status:response.status,summary:data.trip?.summary,error:data.error,sample:data.trip?.legs?.[0]?.maneuvers?.slice(0,3),roads:data.trip?.legs?.[0]?.maneuvers?.filter(m=>m.length>15).map(m=>({names:m.street_names,length:m.length,time:m.time,highway:m.highway}))}));
