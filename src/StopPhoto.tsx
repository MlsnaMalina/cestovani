import {useState} from 'react';
import photos from '../data/photos.json';
interface Photo{src:string;alt:string;caption:string;illustrative:boolean;author:string;license:string;licenseUrl:string;sourceUrl:string;title:string}
const catalogue:Record<string,Photo>=photos;
export function StopPhoto({id,detail=false}:{id:string;detail?:boolean}){
 const photo=catalogue[id], [failed,setFailed]=useState(false);if(!photo)return null;
 if(!detail)return <span className="stop-photo-thumb">{failed?<span>Fotografie není dostupná</span>:<img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>}{photo.illustrative&&<small>Ilustrační foto</small>}</span>;
 return <figure className="stop-photo-detail">{failed?<p>Fotografii se nepodařilo načíst.</p>:<img src={photo.src} alt={photo.alt} decoding="async" onError={()=>setFailed(true)}/>}<figcaption>{photo.caption}<span>Foto: {photo.author||'autor uveden na stránce snímku'} · <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a></span></figcaption></figure>;
}
