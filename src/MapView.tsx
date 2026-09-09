import {useEffect,useRef,useState} from 'react';
import * as maplibregl from 'maplibre-gl';
import type {Map as MapInstance,Marker} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
maplibregl.setWorkerUrl(workerUrl);
import type {Place,Route,Selection,Stage} from './types';
interface Props{routes:Route[];places:Place[];stage:Stage;activeId:string|null;selection?:Selection;overview:boolean;onRoute:(id:string)=>void;onPlace:(id:string)=>void}
const symbols:Record<string,string>={park:'♧',lake:'≈',nature:'♧',food:'♨',town:'⌂',hike:'↟'};
function fitRoutes(map:MapInstance,routes:Route[]){const bounds=new maplibregl.LngLatBounds();routes.forEach(r=>r.geometry.coordinates.forEach(p=>bounds.extend([p[0],p[1]])));if(!bounds.isEmpty())map.fitBounds(bounds,{padding:{top:78,bottom:48,left:35,right:45},duration:0});}
export default function MapView(props:Props){
 const container=useRef<HTMLDivElement>(null),mapRef=useRef<MapInstance|null>(null),markers=useRef<Marker[]>([]),current=useRef(props);current.current=props;
 const [ready,setReady]=useState(false),[error,setError]=useState('');
 useEffect(()=>{
  setReady(false);let map:MapInstance;try{map=new maplibregl.Map({container:container.current!,style:{version:8,sources:{osm:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256,maxzoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}},layers:[{id:'base',type:'raster',source:'osm',paint:{'raster-saturation':-.7,'raster-opacity':.85}}]},center:[14.7,47.4],zoom:5.5,attributionControl:{compact:true}});mapRef.current=map;map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');
   map.on('load',()=>setReady(true));map.on('error',e=>{console.error(e.error);setError('Podklad mapy není dostupný. Trasy a plán zůstávají k dispozici.');});
  }catch{setError('Prohlížeč nemůže zobrazit mapu. Všechny trasy a zastávky najdete v přehledu níže.');return;}
  const resize=new ResizeObserver(()=>{map.resize();if(map.getStyle())fitRoutes(map,current.current.routes);});resize.observe(container.current!);
  return()=>{resize.disconnect();markers.current.forEach(m=>m.remove());map.remove();mapRef.current=null;};
 },[]);
 useEffect(()=>{
  const map=mapRef.current;if(!ready||!map||!map.getStyle())return;
  for(const layer of [...(map.getStyle().layers??[])].reverse())if(layer.id.startsWith('route-')||layer.id==='detours')map.removeLayer(layer.id);
  for(const id of Object.keys(map.getStyle().sources))if(id.startsWith('route-')||id==='detours')map.removeSource(id);
  const all=props.routes;all.forEach((r,index)=>{
   const source='route-'+r.id;map.addSource(source,{type:'geojson',data:{type:'Feature',properties:{id:r.id},geometry:r.geometry}});
   const offset=all.length<=3?(index-1)*5:(index-2.5)*4;
   map.addLayer({id:source+'-line',type:'line',source,layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':r.color,'line-width':4,'line-offset':offset,'line-opacity':.85,...(r.dashed?{'line-dasharray':[2,2]}:{})}});
  });
  // One handler queries only the currently existing route layers; no stale per-stage listeners.
  const click=(event:maplibregl.MapMouseEvent)=>{const hits=map.queryRenderedFeatures([[event.point.x-5,event.point.y-5],[event.point.x+5,event.point.y+5]],{layers:all.map(r=>'route-'+r.id+'-line')});const id=hits[0]?.properties?.id;if(typeof id==='string')current.current.onRoute(id);};
  const hover=(event:maplibregl.MapMouseEvent)=>{const hits=map.queryRenderedFeatures(event.point,{layers:all.map(r=>'route-'+r.id+'-line')});map.getCanvas().style.cursor=hits.length?'pointer':'';const id=hits[0]?.properties?.id;all.forEach(r=>{map.setPaintProperty('route-'+r.id+'-line','line-width',r.id===id?8:r.id===current.current.activeId?6:4);});};
  map.on('click',click);map.on('mousemove',hover);
  fitRoutes(map,all);
  return()=>{map.off('click',click);map.off('mousemove',hover);};
 },[ready,props.routes]);
 useEffect(()=>{
  const map=mapRef.current;if(!ready||!map||!map.getStyle())return;
  props.routes.forEach(r=>{const layer='route-'+r.id+'-line';if(map.getLayer(layer)){map.setPaintProperty(layer,'line-opacity',!props.activeId||props.activeId===r.id?.toString()?1:.25);map.setPaintProperty(layer,'line-width',props.activeId===r.id?6:4);}});
  markers.current.forEach(m=>m.remove());markers.current=[];
  const shown=props.activeId?props.routes.filter(r=>r.id===props.activeId):props.routes;
  const stops=new Map(shown.flatMap(r=>r.stops).map(s=>[s.id,s]));
  stops.forEach(s=>{const place=props.places.find(p=>p.id===s.id)!;const el=document.createElement('button');el.className='stop-marker'+(props.selection?.stops[s.id]!==undefined?' chosen':'');el.type='button';el.textContent=symbols[place.category]??'•';el.title=place.name;el.setAttribute('aria-label','Zastávka: '+place.name);el.addEventListener('click',e=>{e.stopPropagation();current.current.onPlace(s.id);});markers.current.push(new maplibregl.Marker({element:el}).setLngLat(s.coordinates).addTo(map));});
  for(const [label,position] of [[props.stage.from,props.stage.start],[props.stage.to,props.stage.end]] as const){const el=document.createElement('span');el.className='endpoint';el.textContent=label;markers.current.push(new maplibregl.Marker({element:el,anchor:'bottom'}).setLngLat(position).addTo(map));}
  if(map.getLayer('detours'))map.removeLayer('detours');if(map.getSource('detours'))map.removeSource('detours');
  const selected=props.routes.find(r=>r.id===props.selection?.routeId);if(selected){map.addSource('detours',{type:'geojson',data:{type:'FeatureCollection',features:selected.stops.filter(s=>props.selection?.stops[s.id]!==undefined).map(s=>({type:'Feature',properties:{},geometry:{type:'LineString',coordinates:s.geometry}}))}});map.addLayer({id:'detours',type:'line',source:'detours',paint:{'line-color':selected.color,'line-width':5,'line-dasharray':[1,1]}});}
 },[ready,props.activeId,props.routes,props.selection,props.places,props.stage]);
 return <div className="map-wrap"><div ref={container} className="map" aria-label="Interaktivní mapa tras a zastávek"/><div className="map-caption">{props.overview?'Všechny přesuny':props.activeId?'Detail trasy · klikněte na zastávku':'Všechny varianty · klikněte na trasu'}</div>{error&&<p className="map-error" role="status">{error}</p>}</div>;
}
