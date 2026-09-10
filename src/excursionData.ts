import places from '../data/excursions.json';
import routes from '../data/excursion-routes.json';
import type {Excursion,ExcursionPlace,ExcursionRoute} from './types';
const candidates=places as ExcursionPlace[];
export const excursions:Excursion[]=(routes as ExcursionRoute[]).flatMap(drive=>{
 const place=candidates.find(p=>p.id===drive.id&&p.base===drive.base);
 return place&&drive.drivingMinutes<=60&&drive.returnMinutes<=60?[{...place,drive}]:[];
});
export const baseNames={si:'Kamniška Bistrica 8',hr:'Branimirova obala 12, Bibinje'};
