export function currency(value:number,code:'EUR'|'CZK',digits=2){return new Intl.NumberFormat('cs-CZ',{style:'currency',currency:code,minimumFractionDigits:2,maximumFractionDigits:digits}).format(value);}
export function dualCurrencyText(text:string,rate:number){
 return text.replace(/(-?\d+(?:[ \u00a0\u202f]\d{3})*(?:[.,]\d+)?)\s*€(\/l)?/g,(_match,amount:string,unit:string|undefined)=>{
  const eur=Number(amount.replace(/[ \u00a0\u202f]/g,'').replace(',','.'));return `${currency(eur,'EUR',3)}${unit??''} (${currency(eur*rate,'CZK')}${unit??''})`;
 });
}
