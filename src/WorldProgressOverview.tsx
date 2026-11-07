import {CompletionMeter} from './CompletionMeter';
import {modules,readCourse,readScore} from './progress';
import type {CourseKey} from './progress';
import {readWorldInteractionProgress} from './InteractiveWorldChallenge';
import {readDecisionProgress} from './WorldDecisionLab';
import {readRiskAdvancedProgress} from './RiskLabAdvanced';
import {readNigeriaAdvancedProgress} from './NigeriaComplianceAdvanced';
import {readVirtualAdvancedProgress} from './VirtualAssetAdvanced';
import {readInteractiveTraceProgress} from './InteractiveTracingLab';

export type ProgressSection={id:string;name:string;done:number;total:number;detail:string};
const levels=['Foundations','Intermediate','Advanced'] as const;
const safe=(value:number,total:number)=>Math.min(total,Math.max(0,value));

/** Read legacy and new local save keys; no migration, deletion or score rewrites. */
export function readWorldSections(game:CourseKey):ProgressSection[]{
 const course=readCourse(game);
 const scoreKey=modules.find(m=>m.id===game)?.scoreKey;
 const classic=safe(course.lessons.length,3)+Number(course.checkPassed)+Number(!!scoreKey&&readScore(scoreKey)>0);
 const hands=readWorldInteractionProgress(game).completed.length;
 const decision=readDecisionProgress(game);
 const sections:ProgressSection[]=[
  {id:'classic',name:'Learning room & original game',done:classic,total:5,detail:`${safe(course.lessons.length,3)}/3 lessons · ${course.checkPassed?'Quick Check passed':'Quick Check pending'} · ${scoreKey&&readScore(scoreKey)>0?'Game played':'Game pending'}`},
 ];
 if(game==='risk'){
  const p=readRiskAdvancedProgress();
  const completed=safe(p.visited.length,12)+levels.filter(t=>p.quizPass[t]).length+levels.filter(t=>p.simPass[t]).length;
  sections.push({id:'expanded',name:'RiskLab Academy 2.0',done:completed,total:18,detail:`${safe(p.visited.length,12)}/12 lessons · ${levels.filter(t=>p.quizPass[t]).length}/3 quizzes · ${levels.filter(t=>p.simPass[t]).length}/3 simulations`});
 }
 if(game==='nigeria'){
  const p=readNigeriaAdvancedProgress();
  const completed=safe(p.visited.length,12)+levels.filter(t=>p.quizPass[t]).length+levels.filter(t=>p.simPass[t]).length;
  sections.push({id:'expanded',name:'Nigeria Compliance Academy 2.0',done:completed,total:18,detail:`${safe(p.visited.length,12)}/12 lessons · ${levels.filter(t=>p.quizPass[t]).length}/3 quizzes · ${levels.filter(t=>p.simPass[t]).length}/3 simulations`});
 }
 if(game==='virtualassets'){
  const p=readVirtualAdvancedProgress();
  const completed=safe(p.visited.length,12)+safe(p.lessonChecks.length,12)+levels.filter(t=>p.quizPass[t]).length+levels.filter(t=>p.simPass[t]).length;
  sections.push({id:'expanded',name:'Virtual Asset Academy 2.0',done:completed,total:30,detail:`${safe(p.visited.length,12)}/12 lessons · ${safe(p.lessonChecks.length,12)}/12 graph checks · ${levels.filter(t=>p.quizPass[t]).length}/3 quizzes · ${levels.filter(t=>p.simPass[t]).length}/3 simulations`});
 }
 sections.push({id:'hands',name:'Interactive evidence challenges',done:safe(hands,3),total:3,detail:`${safe(hands,3)}/3 hands-on cases completed`});
 sections.push({id:'decision',name:'Evidence dossier & three-stage decision lab',done:Number(decision.passed),total:1,detail:decision.passed?`Passed · best score ${decision.best}%`:decision.best>0?`Not passed · best score ${decision.best}%`:'Awaiting first case decision assessment'});
 if(game==='virtualassets'){
  const count=safe(readInteractiveTraceProgress().completed.length,6);
  sections.push({id:'trace',name:'Interactive tracing graph investigations',done:count,total:6,detail:`${count}/6 clickable tracing missions completed`});
 }
 return sections;
}

export default function WorldProgressOverview({game,onOpen}:{game:CourseKey;onOpen:(id:string)=>void}){
 const sections=readWorldSections(game);
 const done=sections.reduce((a,s)=>a+s.done,0),total=sections.reduce((a,s)=>a+s.total,0);
 return <section className="worldprogresspanel" aria-label="Learning world completion dashboard">
  <div className="worldprogressheading"><div><span className="eyebrow">MY LEARNING PROGRESS</span><h2>World completion tracker</h2><p>Every activity has its own saved completion record. Select a section to resume it.</p></div><div className="worldprogressnumber"><strong>{Math.round(done/total*100)}%</strong><small>Overall completion</small></div></div>
  <CompletionMeter done={done} total={total} caption="All activities in this world"/>
  <div className="worldprogresssections">{sections.map(section=><button key={section.id} type="button" onClick={()=>onOpen(section.id)} className="worldprogresssection">
    <div className="worldprogresssectionhead"><strong>{section.name}</strong><span>{section.done===section.total?'✓ Complete':`${Math.round(section.done/section.total*100)}%`}</span></div>
    <div className="worldmetertrack" role="progressbar" aria-label={section.name} aria-valuenow={section.done} aria-valuemin={0} aria-valuemax={section.total}><div style={{width:Math.round(section.done/section.total*100)+'%'}}/></div>
    <small>{section.detail}</small>
  </button>)}</div>
  <p className="worldprogressnote">Overall progress includes optional expanded and interactive activities. The original World Champion award still uses its separate five-milestone requirement. Progress is stored on this device.</p>
 </section>;
}
