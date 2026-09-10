import {writeFile,mkdir} from 'node:fs/promises';
const url='https://api.cnb.cz/cnbapi/exrates/daily?date=2026-09-09';
const response=await fetch(url,{signal:AbortSignal.timeout(25000)});if(!response.ok)throw Error(response.status);const data=await response.json();
const eur=data.rates?.find(r=>r.currencyCode==='EUR');
if(!eur || !Number.isFinite(eur.rate) || eur.rate<=0 || eur.amount!==1)throw Error('Invalid EUR exchange rate');
const snapshot={rate:eur.rate,date:eur.validFor,source:url};
await mkdir('research/exchange',{recursive:true});await writeFile('research/exchange/cnb.json',JSON.stringify({url,data,checkedAt:new Date().toISOString()},null,2));
await writeFile('data/exchange-rate.json',JSON.stringify(snapshot,null,2)+'\n');console.log(snapshot);
