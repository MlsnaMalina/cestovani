import {describe,expect,it} from 'vitest';
import {excursions} from './excursionData';
import photos from '../data/photos.json';
import raw from '../public/data/trip.json';
import {defaults,fuel} from './planning';
import type {Dataset} from './types';
describe('Výlety do hodiny od ubytování',()=>{
 it('nabízí obě ubytování a jen silniční dojezdy do 60 minut v obou směrech',()=>{
  expect(excursions.filter(p=>p.base==='si')).toHaveLength(5);expect(excursions.filter(p=>p.base==='hr')).toHaveLength(6);
  expect(new Set(excursions.map(p=>p.id)).size).toBe(excursions.length);
  expect(excursions.some(p=>p.id==='trip-ljubljana')).toBe(false);
  for(const p of excursions){expect(p.drive.drivingMinutes).toBeGreaterThan(0);expect(p.drive.drivingMinutes).toBeLessThanOrEqual(60);expect(p.drive.returnMinutes).toBeGreaterThan(0);expect(p.drive.returnMinutes).toBeLessThanOrEqual(60);}
 });
 it('počítá od skutečného ubytování a příjezdový bod leží u konce geometrie',()=>{
  for(const p of excursions){const stage=raw.stages.find(s=>s.id===p.base)!;expect(p.drive.origin).toEqual(stage.end);expect(p.drive.geometry.length).toBeGreaterThan(2);expect(p.drive.accessCoordinates).toEqual(p.drive.geometry.at(-1));expect(p.drive.snapKm).toBeLessThan(.35);const start=p.drive.geometry[0];expect(Math.abs(start[0]-p.drive.origin[0])).toBeLessThan(.002);expect(Math.abs(start[1]-p.drive.origin[1])).toBeLessThan(.002);}
  expect(excursions.find(p=>p.id==='trip-planina')!.drive.positionUrl).toContain('/way/214809784');
 });
 it('každý nabízený výlet má fotku s kredity, praktické informace a zdroje',()=>{
  for(const p of excursions){const photo=photos[p.photoId as keyof typeof photos];expect(photo).toBeDefined();expect(photo.author).toBeTruthy();expect(photo.licenseUrl).toMatch(/^https?:\/\//);expect(p.sources.length).toBeGreaterThan(0);for(const s of p.sources)expect(s.url).toMatch(/^https:\/\//);for(const key of ['cost','walking','duration','openingHours','parking','family','toilets','food'] as const)expect(p[key].trim()).not.toBe('');}
 });
 it('odděluje placenou dálniční alternativu a počítá benzín z obou různých směrů',()=>{
  expect(excursions.filter(p=>p.drive.paidAlternative).map(p=>p.id)).toEqual(['trip-paklenica']);
  const p=excursions.find(p=>p.id==='trip-biograd')!,settings=defaults(raw as Dataset);
  expect(p.drive.returnKm).not.toBe(p.drive.distanceKm);
  expect(fuel(p.drive.distanceKm+p.drive.returnKm,settings.consumption,settings.fuelPrice).eur).toBeCloseTo((p.drive.distanceKm+p.drive.returnKm)*.08*1.912);
 });
});
