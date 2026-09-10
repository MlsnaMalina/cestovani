import {createContext,useContext} from 'react';
import exchange from '../data/exchange-rate.json';
import {currency,dualCurrencyText} from './currency';
export const ExchangeRateContext=createContext(exchange.rate);
export function Money({eur,unit='',digits=2}:{eur:number;unit?:string;digits?:number}){const rate=useContext(ExchangeRateContext);return <span className="money"><span className="money-czk">{currency(eur*rate,'CZK')}{unit}</span><span className="money-eur">{currency(eur,'EUR',digits)}{unit}</span></span>;}
export function CurrencyText({text}:{text:string}){return <>{dualCurrencyText(text,useContext(ExchangeRateContext))}</>;}
