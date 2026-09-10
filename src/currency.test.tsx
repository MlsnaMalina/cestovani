import {describe,expect,it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';

import {currency,dualCurrencyText} from './currency';
import {ExchangeRateContext,Money} from './Money';
import {defaults,restore} from './planning';
import raw from '../public/data/trip.json';
import photos from '../data/photos.json';
import type {Dataset} from './types';
const data=raw as Dataset;
const plain=(s:string)=>s.replace(/[\u00a0\u202f]/g,' ');
describe('Dvě měny a fotografie',()=>{
 it('přepočítá ceny v popiscích včetně záporné částky a přesné ceny za litr',()=>{
  expect(plain(dualCurrencyText('Dospělý 4,50 €, dítě 2.50 €, benzín 1,912 €/l; rozdíl -12 €.',24.25))).toBe('Dospělý 4,50 € (109,13 Kč), dítě 2,50 € (60,63 Kč), benzín 1,912 €/l (46,37 Kč/l); rozdíl -12,00 € (-291,00 Kč).');
  expect(dualCurrencyText('Cenu se nepodařilo ověřit.',25)).toBe('Cenu se nepodařilo ověřit.');
  expect(plain(dualCurrencyText('1 200 €',25))).toBe('1 200,00 € (30 000,00 Kč)');
 });
 it('změna kurzu mění jen koruny, nulu zobrazuje v obou měnách',()=>{
  const markup=plain(renderToStaticMarkup(<ExchangeRateContext value={25}><Money eur={1.912} digits={3} unit="/l"/><Money eur={0}/></ExchangeRateContext>));
  expect(markup).toContain('47,80 Kč/l');expect(markup).toContain('1,912 €/l');expect(markup).toContain('0,00 Kč');expect(markup).toContain('0,00 €');expect(plain(currency(99.424*24.25,'CZK'))).toBe('2 411,03 Kč');
 });
 it('starý uložený plán dostane kurz bez ztráty trasy a vadný kurz se odmítne',()=>{
  const plan={si:{routeId:'si-a',stops:{gleinkersee:45},reserve:10}};
  const old=restore(JSON.stringify({plan}),data);expect(old.plan).toEqual(plan);expect(old.exchangeRate).toBe(defaults(data).exchangeRate);
  expect(restore(JSON.stringify({plan,exchangeRate:25}),data).exchangeRate).toBe(25);
  for(const rate of [0,-5,101,'25',null])expect(restore(JSON.stringify({exchangeRate:rate}),data).exchangeRate).toBe(defaults(data).exchangeRate);
 });
 it('každá výletní zastávka má existující fotografii a údaje o původu a licenci',()=>{
  for(const place of data.places){const p=photos[place.id as keyof typeof photos];expect(p).toBeDefined();expect(p.sourceUrl).toMatch(/^https:\/\/commons.wikimedia.org\/wiki\/File:/);expect(p.licenseUrl).toMatch(/^https?:\/\//);expect(p.author).toBeTruthy();expect(p.src).toBe('/photos/'+place.id+'.jpg');}
  expect(photos.cad.illustrative).toBe(true);expect(photos.cad.caption).toContain('nejde o fotografii podniku');
 });
});
