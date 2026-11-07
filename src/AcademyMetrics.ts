import {modules,readCourse,readScore,readFatf,readLegacy} from './progress';
import type {CourseKey} from './progress';
import {readWorldSections} from './WorldProgressOverview';

export type WorldMetric={id:CourseKey;title:string;icon:string;score:number;done:number;total:number;percent:number;classicDone:boolean;sections:ReturnType<typeof readWorldSections>;resume:string|null};
export function readAcademyMetrics(){
 const worlds:WorldMetric[]=modules.map(m=>{
  const sections=readWorldSections(m.id);
  const done=sections.reduce((n,s)=>n+s.done,0);
  const total=sections.reduce((n,s)=>n+s.total,0);
  const classic=sections.find(s=>s.id==='classic');
  const resume=sections.find(s=>s.done<s.total)?.id||null;
  return {id:m.id,title:m.title,icon:m.icon,score:readScore(m.scoreKey),done,total,percent:Math.round(done/total*100),classicDone:classic?.done===classic?.total,sections,resume};
 });
 const done=worlds.reduce((n,w)=>n+w.done,0),total=worlds.reduce((n,w)=>n+w.total,0);
 const fatf=readFatf(),legacy=readLegacy();
 const learningPoints=legacy.xp+fatf.earned+worlds.reduce((n,w)=>n+w.score,0);
 const resume=worlds.find(w=>w.done>0&&w.resume)||worlds.find(w=>w.resume)||null;
 return {worlds,done,total,percent:Math.round(done/total*100),fullWorlds:worlds.filter(w=>w.done===w.total).length,classicWorlds:worlds.filter(w=>w.classicDone).length,resume,learningPoints,fatf};
}
export function csvProgress(){
 const a=readAcademyMetrics();
 const header=['World','Activity','Completed milestones','Total milestones','Completion percent','Status','Best game score','Classic world complete'];
 const rows=[header,...a.worlds.flatMap(w=>[
  [w.title,'OVERALL',w.done,w.total,w.percent,w.done===w.total?'Complete':'In progress',w.score,w.classicDone?'Yes':'No'],
  ...w.sections.map(s=>[w.title,s.name,s.done,s.total,Math.round(s.done/s.total*100),s.done===s.total?'Complete':s.detail,w.score,w.classicDone?'Yes':'No'])
 ])];
 const esc=(v:string|number)=>'"'+String(v).replace(/"/g,'""')+'"';
 return '\uFEFF'+rows.map(row=>row.map(esc).join(',')).join('\r\n');
}
