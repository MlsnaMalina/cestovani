import type * as GeoJSON from 'geojson';
export type StageId='si'|'hr'|'home';
export type Country='AT'|'SI';
export type Point=[number,number];
export interface Source{id:string;title:string;url:string;note:string;checkedAt:string}
export interface Stage{id:StageId;date:string;departure:string;title:string;from:string;to:string;checkIn:string|null;note:string;start:Point;end:Point}
export interface StopVisit{id:string;coordinates:Point;geocodingUrl:string;geocodedName:string;fromKm:number;toKm:number;fromMinute:number;toMinute:number;atKm:number;atMinute:number;detourKm:number;detourMinutes:number;geometry:Point[];routingUrl:string;checkedAt:string}
export interface HealthAdvisory{id:string;hazard:string;summary:string;precautions:string;sources:{title:string;url:string}[];checkedAt:string}
export interface Place{id:string;name:string;category:string;duration:number;description:string;childAppeal:string;adultAppeal:string;risks:string[];cost:string;openingHours:string;hours?:number[];toilets:string;food:string;sources:string[];healthAdvisories?:string[]}
export interface Toll{name:string;eur:number;source:string}
export interface Route{tollAdjustments:{stopId:string;eur:number;source:string}[];id:string;stage:StageId;letter:string;name:string;via:string;color:string;risk:string;scenery:string;roads:string;pros:string[];cons:string[];stops:StopVisit[];tolls:Toll[];vignettes:Country[];driverEffort:string;dashed:boolean;distanceKm:number;drivingMinutes:number;highwayKm:number;routingUrls:string[];checkedAt:string;geometry:GeoJSON.LineString;countryWindows:{country:Country;start:number;end:number}[]}
export interface Dataset{routes:Route[];places:Place[];stages:Stage[];sources:Source[];healthAdvisories:HealthAdvisory[];checkedAt:string}
export interface Selection{routeId:string;stops:Record<string,number>;reserve:number}
export interface PaidPass{country:Country;from:string;to:string;eur:number;name:string}
export interface Settings{consumption:number;fuelPrice:number;exchangeRate:number;paidPasses:PaidPass[];departures:Record<StageId,string>;plan:Partial<Record<StageId,Selection>>}
export interface FacilityVisit{routeId:string;atKm:number;detourKm:number;detourMinutes:number;routingUrl:string}
export interface Facility{id:string;name:string;coordinates:Point;fuel:string[];toilets:boolean;toiletAccess:string;toiletFee:string;openingHours:string;sourceUrl:string;checkedAt:string;visits:FacilityVisit[]}
export interface FacilityFilter{toilets:boolean;fuel:boolean}
export type ExcursionBase='si'|'hr';
export interface ExcursionPlace{id:string;base:ExcursionBase;photoId:string;name:string;category:string;description:string;duration:string;walking:string;difficulty:string;family:string;openingHours:string;cost:string;parking:string;food:string;toilets:string;tip:string;risks:string[];sources:{title:string;url:string}[];checkedAt:string;healthAdvisories?:string[]}
export interface ExcursionRoute{id:string;base:ExcursionBase;origin:Point;coordinates:Point;accessCoordinates:Point;positionUrl:string;distanceKm:number;drivingMinutes:number;returnKm:number;returnMinutes:number;geometry:Point[];routingUrl:string;checkedAt:string;snapKm:number;paidAlternative:boolean}
export interface Excursion extends ExcursionPlace{drive:ExcursionRoute}
export interface TimedStop{visit:StopVisit;duration:number;arrivalMinute:number;leaveMinute:number;distanceKm:number}
