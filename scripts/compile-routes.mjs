import {readFile} from 'node:fs/promises';
import {routes} from '../data/routes.mjs';
import {compileTrip} from './geo.mjs';
export async function compileRoutes(){return Promise.all(routes.map(async meta=>{
 const ids=meta.id==='si-c'?['si-c-north','si-c-south']:[meta.id];
 const records=await Promise.all(ids.map(async id=>JSON.parse(await readFile(`research/valhalla/${id}.json`,'utf8'))));
 const parts=records.map(compileTrip);let km=0,minute=0;const coordinates=[],timing=[];
 for(const p of parts){coordinates.push(...p.coordinates);timing.push(...p.timing.map(t=>({km:t.km+km,minute:t.minute+minute})));km+=p.distanceKm;minute+=p.drivingMinutes;}
 return {...meta,coordinates,timing,distanceKm:km,drivingMinutes:minute,highwayKm:parts.reduce((n,p)=>n+p.highwayKm,0),routingUrls:records.map(r=>r.url),checkedAt:records[0].checkedAt,records};
}));}
