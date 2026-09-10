import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {destination} from '../data/destination.mjs';
import {decodePolyline,distance} from './geo.mjs';
const headers={'User-Agent':'JedemeSpolu/1.0 (https://github.com/MlsnaMalina/cestovani)'};
await mkdir('research/excursions',{recursive:true});
const trip=JSON.parse(await readFile('public/data/trip.json','utf8'));
export const lodgings={si:trip.stages.find(s=>s.id==='si').end,hr:destination.coordinates};
const points={
 'trip-bistrica':['si',[14.5892373,46.3276484],'https://nominatim.openstreetmap.org/search?q=Dom+v+Kamni%C5%A1ki+Bistrici&format=json'],
 'trip-planina':['si',null,'https://www.openstreetmap.org/way/46677083'],
 'trip-kamnik':['si',[14.6118144,46.2263355],'https://nominatim.openstreetmap.org/search?q=Glavni+trg+Kamnik&format=json'],
 'trip-arboretum':['si',[14.606763,46.1843266],'https://www.openstreetmap.org/way/298798802'],
 'trip-snovik':['si',[14.7048177,46.2269279],'https://nominatim.openstreetmap.org/search?q=Terme+Snovik&format=json'],
 'trip-ljubljana':['si',[14.4972031,46.0596710],'https://nominatim.openstreetmap.org/search?q=Parkiri%C5%A1%C4%8De+Tivoli+Ljubljana&format=json'],
 'trip-zadar':['hr',[15.2280875,44.1162934],'https://nominatim.openstreetmap.org/search?q=Liburnska+obala+Zadar&format=json'],
 'trip-nin':['hr',[15.181904,44.2404548],'https://www.openstreetmap.org/way/464410575'],
 'trip-vrana':['hr',[15.511747,43.9331857],'https://nominatim.openstreetmap.org/search?q=Info+centar+Crkvine&format=json'],
 'trip-biograd':['hr',[15.443169,43.9363932],'https://www.openstreetmap.org/node/513472692'],
 'trip-novigrad':['hr',[15.5528688,44.1767304],'https://nominatim.openstreetmap.org/search?q=Novigrad+Zadarska+%C5%BEupanija&format=json'],
 'trip-paklenica':['hr',[15.4575437,44.2940785],'https://nominatim.openstreetmap.org/search?q=Velika+Paklenica+ulaz&format=json'],
};
async function cached(path,url){try{const record=JSON.parse(await readFile(path,'utf8'));if(record.url===url)return record;}catch{}const r=await fetch(url,{headers,signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error(r.status+' '+await r.text());const record={url,data:await r.json(),checkedAt:new Date().toISOString()};await writeFile(path,JSON.stringify(record));await new Promise(r=>setTimeout(r,1100));return record;}
const station=await cached('research/excursions/planina-line.json','https://maps.mail.ru/osm/tools/overpass/api/interpreter?data='+encodeURIComponent('[out:json];way(46677083);out geom;'));
const line=station.data.elements[0].geometry;const lower=[line[0],line.at(-1)].sort((a,b)=>a.lon-b.lon)[0];points['trip-planina'][1]=[lower.lon,lower.lat];
const access=await cached('research/excursions/planina-parking.json','https://maps.mail.ru/osm/tools/overpass/api/interpreter?data='+encodeURIComponent('[out:json];nwr(around:500,'+lower.lat+','+lower.lon+')[amenity=parking];out center tags;'));
const parking=access.data.elements.find(p=>p.id===214809784 && p.tags?.access==='yes');if(!parking)throw Error('Missing public cablecar parking');points['trip-planina'][1]=[parking.center.lon,parking.center.lat];points['trip-planina'][2]='https://www.openstreetmap.org/way/214809784';
const result=[];
for(const [id,[base,point,positionUrl]] of Object.entries(points)){
 const origin=lodgings[base];const payload={locations:[origin,point,origin].map(([lon,lat])=>({lon,lat,type:'break'})),costing:'auto',costing_options:{auto:{exclude_ferries:true,exclude_unpaved:true,exclude_tolls:true}},units:'kilometers'};
 let url='https://valhalla1.openstreetmap.de/route?json='+encodeURIComponent(JSON.stringify(payload));let record=await cached(`research/excursions/${id}-route.json`,url);let route=record.data.trip;if(!route||route.legs.length!==2)throw Error('Invalid round trip '+id);
 let paidAlternative=false;
 if(route.legs.some(leg=>leg.summary.time>3600)){payload.costing_options.auto.exclude_tolls=false;url='https://valhalla1.openstreetmap.de/route?json='+encodeURIComponent(JSON.stringify(payload));record=await cached(`research/excursions/${id}-fast-route.json`,url);route=record.data.trip;if(!route||route.legs.length!==2)throw Error('Invalid alternative '+id);paidAlternative=true;}
 const [out,back]=route.legs,geometry=decodePolyline(out.shape);const endpoint=geometry.at(-1);const snapKm=distance(point,endpoint);
 if(snapKm>.35 || distance(origin,geometry[0])>.2 || route.summary.has_ferry || (!paidAlternative&&route.summary.has_toll))throw Error('Unsuitable access '+id+' snap '+snapKm);
 const item={id,base,origin,coordinates:point,accessCoordinates:endpoint,positionUrl,distanceKm:out.summary.length,drivingMinutes:out.summary.time/60,returnKm:back.summary.length,returnMinutes:back.summary.time/60,geometry,routingUrl:url,checkedAt:record.checkedAt,snapKm,paidAlternative};
 console.log(id,JSON.stringify({minutes:item.drivingMinutes,back:item.returnMinutes,km:item.distanceKm,snapKm,point}));
 if(item.drivingMinutes>60||item.returnMinutes>60){console.log('Excluded: more than one hour',id);continue;}
 result.push(item);
}
await writeFile('data/excursion-routes.json',JSON.stringify(result,null,2)+'\n');
