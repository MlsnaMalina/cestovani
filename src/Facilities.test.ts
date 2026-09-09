import {describe,it,expect} from 'vitest';
import raw from '../data/services.json';
import trip from '../public/data/trip.json';
import type {Facility} from './types';
import {visibleFacilities} from './Facilities';
const facilities=raw as Facility[];
describe('WC a benzín na trase',()=>{
 it('má obě služby pro každou etapu a skutečné příjezdy pro každý koridor',()=>{
  for(const route of trip.routes){const points=facilities.filter(p=>p.visits.some(v=>v.routeId===route.id));expect(points.some(p=>p.toilets),route.id+' WC').toBe(true);expect(points.some(p=>p.fuel.length),route.id+' benzín').toBe(true);}
  for(const point of facilities){expect(point.sourceUrl).toMatch(/^https:\/\/www.openstreetmap.org\/(node|way|relation)\/\d+$/);expect(point.toilets||point.fuel.length>0).toBe(true);expect(point.coordinates.every(Number.isFinite)).toBe(true);for(const visit of point.visits){expect(visit.detourKm).toBeGreaterThanOrEqual(0);expect(visit.detourKm).toBeLessThanOrEqual(5);expect(visit.detourMinutes).toBeLessThanOrEqual(10);expect(visit.routingUrl).toContain('valhalla1.openstreetmap.de/route?json=');}}
 });
 it('filtruje nezávisle oba druhy a správný směr bez duplicit',()=>{
  const both=visibleFacilities(facilities,['hr-a'],{fuel:true,toilets:true});
  expect(both.length).toBeGreaterThan(0);
  expect(visibleFacilities(facilities,['hr-a'],{fuel:false,toilets:false})).toEqual([]);
  expect(visibleFacilities(facilities,['hr-a'],{fuel:false,toilets:true}).every(p=>p.toilets)).toBe(true);
  expect(visibleFacilities(facilities,['home-a'],{fuel:true,toilets:false}).every(p=>p.fuel.length&&p.visits.some(v=>v.routeId==='home-a'))).toBe(true);
  const all=visibleFacilities(facilities,trip.routes.map(r=>r.id),{fuel:true,toilets:true});expect(new Set(all.map(p=>p.id)).size).toBe(all.length);
 });
});
