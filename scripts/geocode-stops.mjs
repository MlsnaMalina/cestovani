import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {places} from '../data/places.mjs';
await mkdir('research/geocoding',{recursive:true});
for(const p of places){
 const query=({gleinkersee:'Seebauer',fuzine:'Dr. Franje Račkog 26, Fužine, Croatia',trakoscan:'parking',maribor:'Mladinska ulica 9, Maribor, Slovenia',bled:'Cesta svobode 4, Bled, Slovenia'}[p.id]??p.query);
 const bounds={gleinkersee:'14.25,47.75,14.35,47.65',trakoscan:'15.93,46.27,15.96,46.24'}[p.id];
 const url='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&q='+encodeURIComponent(query)+(bounds?'&bounded=1&viewbox='+bounds:'');
 let record;try{record=JSON.parse(await readFile(`research/geocoding/${p.id}.json`,'utf8'));if(record.url!==url)record=null;}catch{}
 if(!record){const response=await fetch(url,{headers:{'User-Agent':'JedemeSpolu-trip-planner/1.0 (personal trip research)'},signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(response.status);record={url,checkedAt:new Date().toISOString(),data:await response.json()};await writeFile(`research/geocoding/${p.id}.json`,JSON.stringify(record));await new Promise(r=>setTimeout(r,1200));}
 console.log(p.id,record.data.map(r=>({name:r.display_name,coordinates:[+r.lon,+r.lat]})));
}
