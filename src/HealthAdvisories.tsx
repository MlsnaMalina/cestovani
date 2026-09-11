import {AlertTriangle,ArrowUpRight} from 'lucide-react';
import {dateAt} from './planning';
import type {HealthAdvisory} from './types';
export function HazardTag({advisories}:{advisories:HealthAdvisory[]}){
 if(!advisories.length)return null;
 return <small className="hazard-tag"><AlertTriangle size={12}/> {advisories.length>1?'Zdravotní rizika':advisories[0].hazard}</small>;
}
export function HazardNotes({advisories}:{advisories:HealthAdvisory[]}){
 if(!advisories.length)return null;
 return <>{advisories.map(a=><div className="hazard-note" key={a.id}><h4><AlertTriangle size={16}/> {a.hazard}</h4><p>{a.summary}</p><p><strong>Doporučení:</strong> {a.precautions}</p><div className="source-links">{a.sources.map(s=><a href={s.url} key={s.url} target="_blank" rel="noopener noreferrer">{s.title} <ArrowUpRight size={14}/></a>)}</div><small>Ověřeno {dateAt(a.checkedAt+'T00:00')}.</small></div>)}</>;
}
