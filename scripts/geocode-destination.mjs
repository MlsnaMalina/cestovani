import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('research/geocoding',{recursive:true});
const url='https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q='+encodeURIComponent('Branimirova obala 12, Bibinje, Croatia');
const response=await fetch(url,{headers:{'User-Agent':'JedemeSpolu-trip-planner/1.0 (personal trip research)'},signal:AbortSignal.timeout(30000)});
if(!response.ok)throw Error(response.status);
const data=await response.json();
await writeFile('research/geocoding/bibinje-destination.json',JSON.stringify({url,data,checkedAt:new Date().toISOString()}));
console.log(JSON.stringify(data.map(r=>({name:r.display_name,coordinates:[+r.lon,+r.lat],address:r.address})),null,2));
const listingUrl='https://www.booking.com/hotel/hr/apartmani-nenci-bibinje.it.html';
try{const page=await fetch(listingUrl,{signal:AbortSignal.timeout(20000)});const html=await page.text();await writeFile('research/geocoding/bibinje-listing.html',html);console.log('Listing',page.status,html.match(/.{0,60}(?:latitude|longitude|data-atlas-latlng|b_map_center_latitude|b_map_center_longitude).{0,100}/gi)?.slice(0,8)??'No coordinates returned');}catch(error){console.log('Listing unavailable:',error.message);}
