import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {photoSelection} from '../data/photo-selection.mjs';
await mkdir('public/photos',{recursive:true});await mkdir('research/photos',{recursive:true});
const clean=value=>(value??'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/\s+/g,' ').trim();
const result={};
let previous={};try{previous=JSON.parse(await readFile('data/photos.json','utf8'));}catch{}
for(const [id,[file,caption]] of Object.entries(photoSelection)){
 const title='File:'+file;let page;try{const data=JSON.parse(await readFile(`research/photos/${id}.json`,'utf8'));page=Object.values(data.query?.pages??{}).find(p=>p.title===title);}catch{}
 if(!page){const url='https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',format:'json',titles:title,prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'640'});const response=await fetch(url,{headers:{'User-Agent':'JedemeSpolu/1.0 (https://github.com/MlsnaMalina/cestovani)'},signal:AbortSignal.timeout(25000)});if(!response.ok)throw Error(response.status);const data=await response.json();await writeFile(`research/photos/${id}.json`,JSON.stringify(data));page=Object.values(data.query?.pages??{})[0];}
 const info=page?.imageinfo?.[0];if(!info)throw Error('Missing image '+id);const meta=info.extmetadata,license=clean(meta.LicenseShortName?.value);if(!/CC BY|CC0|Public domain/.test(license))throw Error('Unapproved license '+license);
 const imageUrl=info.thumburl??info.url,path=`public/photos/${id}.jpg`;let exists=false;try{exists=(await readFile(path)).length>1000&&previous[id]?.title===file;}catch{}
 if(!exists){const response=await fetch(imageUrl,{headers:{'User-Agent':'JedemeSpolu/1.0 (https://github.com/MlsnaMalina/cestovani)'},signal:AbortSignal.timeout(30000)});if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw Error('Image '+id+' '+response.status);const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>4000000)throw Error('Image too large '+id);await writeFile(path,bytes);await new Promise(r=>setTimeout(r,1100));}
 result[id]={src:'/photos/'+id+'.jpg',alt:caption,caption,illustrative:id==='cad',author:clean(meta.Artist?.value),license,licenseUrl:meta.LicenseUrl?.value??'https://creativecommons.org/publicdomain/mark/1.0/',sourceUrl:info.descriptionurl,title:file};console.log(id,license,result[id].author);
}
// The original uploader identifies this as their own photograph in the file history.
result.gleinkersee.author='Acp~commonswiki';
await writeFile('data/photos.json',JSON.stringify(result,null,2)+'\n');
await writeFile('public/photos/CREDITS.md','# Fotografie zastávek\n\nSoubory jsou nezměněné zmenšeniny z Wikimedia Commons. Náhledy v aplikaci používají výřez CSS; detail ukazuje celý snímek.\n\n'+Object.values(result).map(p=>`- **${p.title}** — ${p.author || 'Autor uveden na stránce snímku'}. [Zdroj](${p.sourceUrl}), [${p.license}](${p.licenseUrl}). Soubor: ${p.src}.`).join('\n')+'\n');
