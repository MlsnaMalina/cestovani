import {readFile,writeFile,mkdir} from 'node:fs/promises';
const directory='research/services';
await mkdir(directory,{recursive:true});
const url='https://maps.mail.ru/osm/tools/overpass/api/interpreter';
const all=[];
for(const [index,box] of ['49,13.8,50.1,17.2','47,12.8,48,14.5','47,14.5,48,16.5','48,13.4,49,17.2','46,13.4,47,16.3','44,14,46,16.5'].entries()){
 const query=`[out:json][timeout:45];(nwr[amenity=fuel](${box});nwr[amenity=toilets](${box});nwr[highway~"^(services|rest_area)$"][toilets=yes](${box}););out center tags;`;
 const path=directory+'/osm-'+index+'.json';let record;try{record=JSON.parse(await readFile(path,'utf8'));if(record.url!==url||record.query!==query)record=null;}catch{}
 if(!record){const response=await fetch(url+'?data='+encodeURIComponent(query),{headers:{'User-Agent':'JedemeSpolu-TripPlanner/1.0 (private family route research; cached queries)'},signal:AbortSignal.timeout(60000)});if(!response.ok)throw Error('Overpass '+response.status+' '+(await response.text()).slice(0,800));const data=await response.json();if(data.remark||!data.elements?.length)throw Error(JSON.stringify(data));record={url,query,checkedAt:new Date().toISOString(),data};await writeFile(path,JSON.stringify(record));}
 all.push(...record.data.elements);console.log('Downloaded region',index,record.data.elements.length);
}
await writeFile(directory+'/osm.json',JSON.stringify({url,checkedAt:new Date().toISOString(),data:{elements:[...new Map(all.map(p=>[p.type+p.id,p])).values()]}}));
