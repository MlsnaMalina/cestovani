import {describe,expect,it} from 'vitest';
import raw from '../public/data/trip.json';
import type {Dataset,PaidPass} from './types';
import {budget,comparisonCosts,countryEvents,defaults,restore,vignettePasses} from './planning';
const data=raw as Dataset;
const at:PaidPass={country:'AT',from:'2026-09-12',to:'2026-09-21',eur:12.8,name:'Rakousko · 10 dní'};
const si:PaidPass={country:'SI',from:'2026-09-12',to:'2026-09-18',eur:16,name:'Slovinsko · 7 dní'};
const route=(id:string)=>data.routes.find(r=>r.id===id)!;
describe('Schválený plán a už zakoupené známky',()=>{
 it('sdílí slovinskou známku a u nekoupené rakouské ukáže pouze změnu na 10 dní',()=>{
  const s=defaults(data);s.plan.si={routeId:'si-a',stops:{},reserve:0};
  const c=comparisonCosts(data,route('home-a'),s);
  expect(c.passCharges.find(p=>p.country==='SI')).toMatchObject({eur:0,shared:true,paid:false});
  expect(c.passCharges.find(p=>p.country==='AT')?.eur).toBeCloseTo(3.2);
  expect(c.change).toBeCloseTo(c.total);
 });
 it('při návratu neúčtuje už zaplacené platné známky, ale ponechá mýto za průjezd',()=>{
  const s=defaults(data);s.paidPasses=[at,si];const r=route('home-a'),c=comparisonCosts(data,r,s);
  expect(c.passTotal).toBe(0);expect(c.passCharges.every(p=>p.paid)).toBe(true);
  expect(c.toll).toBeCloseTo(43.9);expect(c.total).toBeCloseTo(c.eur+43.9);
  s.plan.home={routeId:r.id,stops:{},reserve:0};const b=budget(data,s);
  expect(b.paidTotal).toBeCloseTo(28.8);expect(b.remaining).toBeCloseTo(c.total);expect(b.total).toBeCloseTo(c.total+28.8);
 });
 it('zakoupenou jednodenní známku fiktivně nedoplácí na desetidenní',()=>{
  const s=defaults(data);s.paidPasses=[{...at,to:at.from,eur:9.6},si];s.plan.si={routeId:'si-a',stops:{},reserve:0};
  const c=comparisonCosts(data,route('home-a'),s);expect(c.passTotal).toBeCloseTo(9.6);
  expect(c.passCharges.find(p=>p.country==='AT')?.passes[0].from).toBe('2026-09-16');
 });
 it('platí včetně koncového dne, ne před začátkem, po konci nebo pro jinou zemi',()=>{
  expect(vignettePasses([{country:'SI',date:'2026-09-18'}],[si])).toEqual([]);
  expect(vignettePasses([{country:'SI',date:'2026-09-19'}],[si])[0].eur).toBe(16);
  expect(vignettePasses([{country:'SI',date:'2026-09-11'}],[si])[0].from).toBe('2026-09-11');
  expect(vignettePasses([{country:'AT',date:'2026-09-16'}],[si])[0].eur).toBe(9.6);
 });
 it('hlídá platnost při průjezdu přes půlnoc, včetně posunutého odjezdu',()=>{
  const r=route('si-a');const events=countryEvents(r,'2026-09-12T23:30');
  const passes=vignettePasses(events,[{...at,to:at.from,eur:9.6},si]);
  expect(passes.find(p=>p.country==='AT')?.from).toBe('2026-09-13');
  const across=vignettePasses([{country:'AT',date:'2026-09-12'},{country:'AT',date:'2026-09-13'}],[{...at,to:at.from,eur:9.6}]);
  expect(across).toHaveLength(1);expect(across[0].eur).toBe(9.6);
 });
 it('náhrada trasy odstraní původní požadavky etapy, ale zachová další schválené dny',()=>{
  const s=defaults(data);s.plan.si={routeId:'si-a',stops:{},reserve:0};s.plan.home={routeId:'home-a',stops:{},reserve:0};
  const candidate=route('si-c'),c=comparisonCosts(data,candidate,s);
  const changed={...s,plan:{...s.plan,si:{routeId:candidate.id,stops:{},reserve:0}}};
  expect(c.wholePlan).toBeCloseTo(budget(data,changed).total);expect(c.change).toBeCloseTo(c.wholePlan-budget(data,s).total);
  expect(c.passCharges.some(p=>p.country==='SI')).toBe(false);expect(budget(data,changed).passes.some(p=>p.country==='SI')).toBe(true);
 });
 it('skutečný nákup zůstane i po odebrání všech tras a po obnovení stránky',()=>{
  const s=defaults(data);s.paidPasses=[at,si];const restored=restore(JSON.stringify(s),data);
  expect(restored.paidPasses.map(p=>[p.country,p.from,p.to,p.eur])).toEqual(s.paidPasses.map(p=>[p.country,p.from,p.to,p.eur]));
  expect(budget(data,restored).total).toBeCloseTo(28.8);expect(budget(data,restored).remaining).toBe(0);
 });
 it('staré nastavení migruje a poškozené nebo duplicitní záznamy odmítne',()=>{
  expect(restore(JSON.stringify({plan:{si:{routeId:'si-a',stops:{},reserve:0}}}),data).paidPasses).toEqual([]);
  const s=restore(JSON.stringify({paidPasses:[at,at,{...si,to:'2026-02-30'},{...si,eur:-16},{...si,from:'2026-09-22'},null]}),data);
  expect(s.paidPasses).toHaveLength(1);
 });
});
