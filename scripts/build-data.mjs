import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {compileRoutes} from './compile-routes.mjs';
import {nearestIndex} from './geo.mjs';
import {stages} from '../data/routes.mjs';
import {places} from '../data/places.mjs';
import {sources,checkedAt} from '../data/sources.mjs';
import {tollAdjustments} from '../data/toll-adjustments.mjs';
await mkdir('public/data',{recursive:true});
const healthAdvisories=JSON.parse(await readFile('data/health-advisories.json','utf8'));
const output=[];
for(const route of await compileRoutes()){
 const {coordinates,timing,records,...meta}=route;
 const timeAt=p=>timing[nearestIndex(route,p)].minute;
 const vienna=route.id.startsWith('si-b')||route.id==='home-b';
 const czat=timeAt(vienna?[16.642,48.776]:[14.452,48.643]);
 const atsi=timeAt(route.id==='si-c'?[14.254516,46.437195]:route.id==='si-d'||route.id==='home-c'?[14.021033,46.504789]:[15.653,46.705]);
 const sihr=timeAt(route.id==='hr-b'?[14.280,45.487]:route.id==='hr-c'?[15.337,45.612]:route.id==='home-a'||route.id==='home-b'?[15.853,46.271]:[15.685,45.843]);
 const countryWindows=route.stage==='si'?[{country:'AT',start:czat,end:atsi},...(route.vignettes.includes('SI')?[{country:'SI',start:atsi,end:route.drivingMinutes}]:[])]:route.stage==='hr'?[{country:'SI',start:0,end:sihr}]:[{country:'SI',start:sihr,end:atsi},{country:'AT',start:atsi,end:czat}];
 for(const w of countryWindows)if(w.start>w.end)throw Error('Border order '+route.id);
 const stops=await Promise.all(route.stops.map(async id=>{const s=JSON.parse(await readFile(`research/stop-routing/${route.id}--${id}-compiled.json`,'utf8'));const {snapped,...rest}=s;return rest;}));
 const geometry={type:'LineString',coordinates};
 await writeFile(`public/data/${route.id}.geojson`,JSON.stringify({type:'Feature',properties:{id:route.id,distanceKm:route.distanceKm,drivingMinutes:route.drivingMinutes},geometry}));
 output.push({...meta,geometry,stops,countryWindows,tollAdjustments:tollAdjustments[route.id]??[]});
}
await writeFile('public/data/trip.json',JSON.stringify({routes:output,places:places.map(({query,...p})=>p),stages,sources,healthAdvisories,checkedAt}));
console.log('Saved',output.length,'routes,',places.length,'places.');
