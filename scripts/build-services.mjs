import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {compileRoutes} from './compile-routes.mjs';
import {decodePolyline,distance} from './geo.mjs';

const raw=JSON.parse(await readFile('research/services/osm.json','utf8'));
const routes=await compileRoutes();
const fuelTypes={'fuel:octane_95':'Natural 95','fuel:gasoline_95':'Natural 95','fuel:octane_98':'Benzín 98','fuel:octane_100':'Benzín 100','fuel:e10':'Benzín E10'};
const excluded=new Set(['no','private','permit','agricultural','forestry']);
const candidates=raw.data.elements.flatMap(p=>{
 const t=p.tags??{},point=p.center??p;if(!Number.isFinite(point.lon)||excluded.has(t.access)||excluded.has(t.motor_vehicle)||t.disused==='yes'||t.abandoned==='yes')return [];
 const fuel=t.amenity==='fuel'?[...new Set(Object.entries(fuelTypes).filter(([key])=>t[key]==='yes').map(([,label])=>label))]:[];
 const toilets=(t.amenity==='toilets'||t.toilets==='yes')&&!excluded.has(t['toilets:access']);
 if(!fuel.length&&!toilets)return [];
 const toiletAccess=(t['toilets:access']??t.access)==='customers'?'Pro zákazníky provozovny.':'Podmínky vstupu ověřte na místě.';
 const fee=t.amenity==='toilets'?t.fee:t['toilets:fee'];
 return [{id:p.type+'-'+p.id,name:t.name??t.brand??(fuel.length?'Čerpací stanice':'Toalety / odpočívka'),coordinates:[point.lon,point.lat],fuel,toilets,toiletAccess,toiletFee:fee==='no'?'V mapě označeno jako bezplatné.':fee==='yes'?'Placené; částka není ověřená.':'Aktuální údaj se nepodařilo spolehlivě ověřit.',openingHours:t.opening_hours??'Aktuální údaj se nepodařilo spolehlivě ověřit.',sourceUrl:`https://www.openstreetmap.org/${p.type}/${p.id}`,checkedAt:raw.checkedAt,visits:[]}];
});
await mkdir('research/services/routing',{recursive:true});
const result=new Map();const audit=[];
function cell(point){return [Math.floor(point[0]*100),Math.floor(point[1]*100)];}
function heading(a,b){return (Math.atan2((b[0]-a[0])*Math.cos(a[1]*Math.PI/180),b[1]-a[1])*180/Math.PI+360)%360;}
for(const route of routes){
 const grid=new Map();route.coordinates.forEach((p,i)=>{const key=cell(p).join(',');if(!grid.has(key))grid.set(key,[]);grid.get(key).push(i);});
 const near=candidates.flatMap(p=>{const [x,y]=cell(p.coordinates);let best=Infinity,index=-1;for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const i of grid.get([x+dx,y+dy].join(','))??[]){const d=distance(p.coordinates,route.coordinates[i]);if(d<best){best=d;index=i;}}if(best>.45||index<0)return [];const at=route.timing[index];if(at.km<8||route.distanceKm-at.km<8)return [];return [{p,index,at,proximity:best}];});
 const selected=[];
 for(const kind of ['toilets','fuel'])for(let bin=0;bin<Math.ceil(route.distanceKm/65);bin++){
  if(selected.some(s=>Math.floor(s.at.km/65)===bin&&(kind==='toilets'?s.p.toilets:s.p.fuel.length)))continue;
  const options=near.filter(s=>Math.floor(s.at.km/65)===bin&&(kind==='toilets'?s.p.toilets:s.p.fuel.length)).sort((a,b)=>((a.p.toilets&&a.p.fuel.length?-1:0)+a.proximity)-((b.p.toilets&&b.p.fuel.length?-1:0)+b.proximity));
  for(const candidate of options.slice(0,4)){
   if(selected.some(s=>s.p.id===candidate.p.id))break;
   const {p,index,at}=candidate;let a=index,b=index;while(a>0&&route.timing[a].km>at.km-3)a--;while(b<route.timing.length-1&&route.timing[b].km<at.km+3)b++;
   const loc=(i)=>({lon:route.coordinates[i][0],lat:route.coordinates[i][1],type:'break',heading:Math.round(heading(route.coordinates[i],route.coordinates[Math.min(i+1,route.coordinates.length-1)])),heading_tolerance:45});
   const payload={locations:[loc(a),{lon:p.coordinates[0],lat:p.coordinates[1],type:'break',radius:80},loc(b)],costing:'auto',costing_options:{auto:{exclude_ferries:true,exclude_unpaved:true,...(route.id==='si-c'&&at.km>500?{exclude_highways:true,exclude_tolls:true}:{})}},units:'kilometers'};
   const url='https://valhalla1.openstreetmap.de/route?json='+encodeURIComponent(JSON.stringify(payload));
   const key=createHash('sha256').update(url).digest('hex').slice(0,20),path=`research/services/routing/${key}.json`;let record;try{record=JSON.parse(await readFile(path,'utf8'));}catch{}
   if(!record){const response=await fetch(url,{headers:{'User-Agent':'JedemeSpolu-trip-planner/1.0 (personal trip research)'},signal:AbortSignal.timeout(35000)});if(!response.ok)throw Error('Routing '+response.status);record={url,data:await response.json()};await writeFile(path,JSON.stringify(record));await new Promise(resolve=>setTimeout(resolve,1100));}
   const trip=record.data.trip;if(!trip){audit.push({route:route.id,id:p.id,rejected:'no route'});continue;}
   const detourKm=Math.max(0,trip.summary.length-(route.timing[b].km-route.timing[a].km)),detourMinutes=Math.max(0,trip.summary.time/60-(route.timing[b].minute-route.timing[a].minute));
   const roadEnd=decodePolyline(trip.legs[0].shape).at(-1);const gap=distance(p.coordinates,roadEnd);
   if(detourKm>5||detourMinutes>10||gap>.09){audit.push({route:route.id,id:p.id,rejected:'long detour or distant road',detourKm,detourMinutes,gap});continue;}
   if(!result.has(p.id))result.set(p.id,{...p,visits:[]});
   result.get(p.id).visits.push({routeId:route.id,atKm:route.timing[a].km+trip.legs[0].summary.length,detourKm,detourMinutes,routingUrl:url});selected.push(candidate);break;
  }
 }
 console.log(route.id,selected.length,'facilities; WC',selected.filter(s=>s.p.toilets).length,'fuel',selected.filter(s=>s.p.fuel.length).length);
 await writeFile('research/services/audit.json',JSON.stringify(audit));

}
await writeFile('data/services.json',JSON.stringify([...result.values()],null,2)+'\n');
console.log('Total',result.size,'places;', [...result.values()].reduce((sum,p)=>sum+p.visits.length,0),'route visits');
