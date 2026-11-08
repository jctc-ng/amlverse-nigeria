import {useState} from 'react';
import {FATF40,FATF_GROUPS,FATF_STANDARD_URL,FATF_IMPLEMENTATION_NOTE} from './Fatf40Content';
import type {FatfDeepLesson} from './Fatf40Content';
import {fatfPractice} from './Fatf40Assessment';
import {readFatf} from './progress';

type Outcome={score:number;total:number};
type FatfLearningRecord={studied:number[];outcomes:Record<string,Outcome>};
const NEW_KEY='amlverse-fatf-40-v2';
function stored():FatfLearningRecord{
 try{
  const r=JSON.parse(localStorage.getItem(NEW_KEY)||'null') as Partial<FatfLearningRecord>|null;
  return {studied:Array.isArray(r?.studied)?Array.from(new Set(r.studied.filter((x):x is number=>Number.isInteger(x)&&x>=1&&x<=40))):[],
  outcomes:r?.outcomes&&typeof r.outcomes==='object'?r.outcomes:{}};
 }catch{return {studied:[],outcomes:{}}}
}
function legacyOutcomes():Record<string,Outcome>{
 try{return JSON.parse(localStorage.getItem('amlverse-fatf-ch1')||'{}') as Record<string,Outcome>}catch{return {}}
}
function best(number:number,record:FatfLearningRecord):Outcome|undefined{
 const old=legacyOutcomes()[String(number)];
 const newer=record.outcomes[String(number)];
 if(!old)return newer;
 if(!newer)return old;
 return old.score/old.total>newer.score/newer.total?old:newer;
}
function saved(record:FatfLearningRecord){try{localStorage.setItem(NEW_KEY,JSON.stringify(record))}catch{}}
export default function FatfChapter({onBack}:{onBack:()=>void}){
 const [record,setRecord]=useState<FatfLearningRecord>(stored);
 const [fatfFree,setFatfFree]=useState(()=>{try{return localStorage.getItem('amlverse-fatf-free-v1')==='yes'}catch{return false}});
 const [resetOpen,setResetOpen]=useState(false);
 const [resetPhrase,setResetPhrase]=useState('');
 const [active,setActive]=useState<number|null>(null);
 const [group,setGroup]=useState('All 40');
 const [query,setQuery]=useState('');
 const [view,setView]=useState<'study'|'quiz'|'result'>('study');
 const [reviewed,setReviewed]=useState<number[]>([]);
 const [index,setIndex]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const [revealed,setRevealed]=useState(false);
 const [correctCount,setCorrectCount]=useState(0);
 const [attemptAnswers,setAttemptAnswers]=useState<{correct:boolean;selected:number}[]>([]);
 const [assessmentMode,setAssessmentMode]=useState<'practice'|'assessment'>('practice');
 const current=active?FATF40[active-1]:null;
 const questions=current?fatfPractice(current.number):[];
 const currentQuestion=questions[index];
 const combined=readFatf();
 const completed=Array.from({length:40},(_,i)=>i+1).filter(n=>{const o=best(n,record);return !!o&&o.total>0&&o.score===o.total}).length;
 const attempted=Array.from({length:40},(_,i)=>i+1).filter(n=>!!best(n,record)).length;
 const studied=new Set(record.studied);
 function canOpen(n:number){if(n===1)return true;const preceding=best(n-1,record);return !!preceding&&preceding.total>0&&preceding.score===preceding.total}
 function resetFatf(){if(resetPhrase!=='RESET')return;try{localStorage.removeItem('amlverse-fatf-ch1');localStorage.removeItem(NEW_KEY)}catch{}setRecord({studied:[],outcomes:{}});setActive(null);setView('study');setResetOpen(false);setResetPhrase('');window.scrollTo(0,0)}
 const shown=FATF40.filter(x=>(group==='All 40'||x.group===group)&&(!query.trim()||('r.'+x.number+' '+x.title+' '+x.group+' '+x.explanation).toLowerCase().includes(query.trim().toLowerCase())));
 function start(n:number){
  if(!canOpen(n))return;
  setActive(n);setView('study');setReviewed([]);setAnswer(null);setIndex(0);setRevealed(false);setCorrectCount(0);setAttemptAnswers([]);
  window.scrollTo(0,0);
 }
 function markStudied(){
  if(!current)return;
  const next={...record,studied:Array.from(new Set([...record.studied,current.number]))};
  setRecord(next);saved(next);
 }
 function begin(mode:'practice'|'assessment'){
  markStudied();setAssessmentMode(mode);setIndex(0);setAnswer(null);setRevealed(false);setCorrectCount(0);setAttemptAnswers([]);setView('quiz');window.scrollTo(0,0);
 }
 function check(){if(answer===null||revealed)return;setRevealed(true)}
 function advance(){
  if(!current||answer===null||!revealed)return;
  const passed=answer===currentQuestion.answer;
  const nextAnswers=[...attemptAnswers,{correct:passed,selected:answer}];
  const score=correctCount+Number(passed);
  setAttemptAnswers(nextAnswers);
  setCorrectCount(score);
  if(index<questions.length-1){setIndex(i=>i+1);setAnswer(null);setRevealed(false);window.scrollTo(0,0);return}
  const key=String(current.number);
  const prior=record.outcomes[key];
  const newOutcome={score,total:questions.length};
  const keepPrior=prior&&prior.total>0&&prior.score/prior.total>score/questions.length;
  const nextRecord={...record,outcomes:{...record.outcomes,[key]:keepPrior?prior:newOutcome}};
  setRecord(nextRecord);saved(nextRecord);setView('result');window.scrollTo(0,0);
 }
 function goNext(){
  if(!current)return;
  if(current.number===40){setActive(null);setView('study');window.scrollTo(0,0)}else start(current.number+1)
 }
 function returnToMap(){setActive(null);setView('study');window.scrollTo(0,0)}
 return <main className="narrow questpage fatf40page">
  <button type="button" className="back" onClick={current?returnToMap:onBack}>← {current?'All forty Recommendations':'Academy overview'}</button>
  {!current?<><span className="eyebrow">FATF QUEST · COMPLETE LEARNING CURRICULUM</span><h1 className="title">All 40 FATF Recommendations</h1>
   <p className="lead">A professionally structured guide across seven policy areas. Each Recommendation includes an explanatory study, everyday analogy, four implementation actions, a fictional case and three application questions.</p>
   <section className="fatftowncontrols"><div><strong>🔐 Guided FATF learning path</strong><p>R.1 is open by default. Master each Recommendation to unlock the next automatically. Manual unlocking is disabled. Existing R.1–R.10 results remain saved unless you reset.</p></div><div className="towncontrolsbuttons"><button type="button" className="townresetopen" onClick={()=>{setResetOpen(v=>!v);setResetPhrase('')}}>{resetOpen?'Cancel reset':'↻ Reset FATF course'}</button></div>
{resetOpen?<div className="townresetconfirm"><h3>Reset all FATF Quest progress?</h3><p>This deletes saved study records and assessments for Recommendations R.1–R.40, including results from the original R.1–R.10 pilot, on this browser only. Other worlds and the Capstone are unaffected.</p><label htmlFor="fatf-reset-confirm">Type <strong>RESET</strong> to confirm</label><input id="fatf-reset-confirm" value={resetPhrase} onChange={e=>setResetPhrase(e.target.value)} placeholder="RESET" autoComplete="off"/><div className="townresetactions"><button type="button" className="townresetdanger" disabled={resetPhrase!=='RESET'} onClick={resetFatf}>Delete FATF course progress</button><button type="button" className="secondary" onClick={()=>{setResetOpen(false);setResetPhrase('')}}>Keep my progress</button></div></div>:null}</section>
   <div className="fatf40stats"><div><small>RECOMMENDATIONS MASTERED</small><strong>{completed} / 40</strong></div><div><small>LEARNING CONTENT STUDIED</small><strong>{studied.size} / 40</strong></div><div><small>ASSESSMENTS ATTEMPTED</small><strong>{attempted} / 40</strong></div><div><small>LEARNING POINTS</small><strong>{combined.earned.toLocaleString()}</strong></div></div>
   <div className="fatf40progress"><div style={{width:(completed/40*100)+'%'}}/></div>
   <div className="fatf40summary"><strong>{Math.round(completed/40*100)}% mastered</strong><span>Existing R.1–R.10 best scores are preserved.</span></div>
   {completed===40?<div className="fatf40finish"><h2>🏆 FATF 40 Scholar</h2><p>All forty recommendations mastered in practice assessments. An educational achievement, not official accreditation.</p></div>:<button type="button" className="primary" onClick={()=>start(FATF40.find(x=>!best(x.number,record)||best(x.number,record)?.score!==best(x.number,record)?.total)?.number||1)}>Continue next unmastered recommendation →</button>}
   <div className="fatf40filters"><label htmlFor="fatfsearch">Find a recommendation</label><input id="fatfsearch" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search number, theme, or topic…" type="search"/><div className="fatf40groupbuttons" role="group" aria-label="Recommendation categories"><button type="button" className={group==='All 40'?'active':''} onClick={()=>setGroup('All 40')}>All 40</button>{FATF_GROUPS.map(g=><button key={g.name} type="button" className={group===g.name?'active':''} onClick={()=>setGroup(g.name)}>{g.name} ({g.end-g.start+1})</button>)}</div></div>
   <div className="fatf40tiles">{shown.map(l=>{const outcome=best(l.number,record);const mastered=outcome&&outcome.score===outcome.total;return <button className="fatf40tile" key={l.number} type="button" disabled={!canOpen(l.number)} aria-label={canOpen(l.number)?`Open Recommendation ${l.number}`:`Recommendation ${l.number} locked. Master Recommendation ${l.number-1} first.`} onClick={()=>start(l.number)}><span className="fatf40number">R.{l.number}</span><span className="fatf40tilebody"><small>{l.group}</small><strong>{l.title}</strong><span>{mastered?'★ Mastered':outcome?'Best: '+outcome.score+'/'+outcome.total:studied.has(l.number)?'Study completed · assessment pending':!canOpen(l.number)?'🔒 Master R.'+(l.number-1)+' first':'Not started'}</span></span><span className="fatf40arrow" aria-hidden="true">→</span></button>})}{!shown.length?<p>No matching recommendation found.</p>:null}</div>
   <div className="notice"><b>Authoritative reference:</b> <a href={FATF_STANDARD_URL} target="_blank" rel="noopener noreferrer">FATF Recommendations, consolidated June 2026 ↗</a>. Refer to the Interpretive Notes, Glossary and applicable national law. Content here is independent educational paraphrase.</div>
  </>:
  <><div className="fatf40header"><span className="eyebrow">FATF STANDARD • R.{current.number} OF 40</span><span>{current.group}</span></div><h1 className="title">R.{current.number} — {current.title}</h1>
   <div className="fatf40lessonmeter"><span>{studied.has(current.number)?'✓ Study recorded':'Study not yet recorded'}</span><span>{best(current.number,record)?'Best: '+best(current.number,record)!.score+'/'+best(current.number,record)!.total:'Assessment pending'}</span></div>
   {view==='study'?<>
    <section className="fatf40study"><div className="fatf40studyheading"><span>01</span><h2>What this Recommendation means</h2></div><p>{current.explanation}</p><div className="fatf40why"><strong>Professional relevance</strong><p>Financial intelligence, compliance, supervision and law-enforcement teams should translate this principle into documented processes, accountable roles and measurable safeguards. The exact obligations depend on the Recommendation's Interpretive Note and national implementation.</p></div></section>
    <section className="fatf40analogy"><div className="fatf40studyheading"><span>02</span><h2>Understand through an analogy</h2></div><p>{current.analogy}</p><small>Analogies simplify the concept; they do not replace technical definitions or legal tests.</small></section>
    <section className="fatf40study"><div className="fatf40studyheading"><span>03</span><h2>Implementation process</h2></div><p>Work through the four actions in a logical sequence. Select each action as you review it, then complete the short applied assessment.</p>
     <div className="fatf40steps">{current.steps.map((s,i)=><button key={i} type="button" className={reviewed.includes(i)?'checked':''} onClick={()=>setReviewed(old=>old.includes(i)?old:[...old,i])}><span>{reviewed.includes(i)?'✓':i+1}</span><div><strong>{['Establish scope','Operationalise controls','Document and supervise','Test and improve'][i]}</strong><p>{s}</p></div></button>)}</div>
     <div className="fatf40stepprogress">{reviewed.length} / 4 implementation steps reviewed</div>
    </section>
    <section className="fatf40scenario"><div className="fatf40studyheading"><span>04</span><h2>Apply it to a fictional case</h2></div><p>{current.scenario}</p><div className="fatf40caution"><strong>Analytical or implementation safeguard</strong><p>{current.caution}</p></div></section>
    <div className="fatf40actions"><button type="button" className="primary" onClick={()=>begin('practice')}>Complete study & start 3-question practice →</button><button type="button" className="secondary" onClick={()=>begin('assessment')}>Assessment mode (review at end)</button></div>
    <p className="modehint">{FATF_IMPLEMENTATION_NOTE}</p>
   </>:view==='quiz'?<>
    <section className="fatf40quiz"><div className="fatf40quizhead"><span className="eyebrow">{assessmentMode==='practice'?'GUIDED PRACTICE':'INDEPENDENT ASSESSMENT'}</span><strong>Question {index+1} / {questions.length}</strong></div><div className="fatf40progress"><div style={{width:((index+Number(revealed))/questions.length*100)+'%'}}/></div>
    <div className="situation"><small>FICTIONAL CASE</small><p>{current.scenario}</p></div><h2 className="question">{currentQuestion.prompt}</h2>
    <div className="choices">{currentQuestion.options.map((o,i)=><button key={i} type="button" disabled={revealed} className={'choice'+(answer===i?' picked':'')+(revealed&&assessmentMode==='practice'&&i===currentQuestion.answer?' correct':'')} onClick={()=>setAnswer(i)}><span className="letter">{String.fromCharCode(65+i)}</span>{o}</button>)}</div>
    {revealed&&assessmentMode==='practice'?<div className="feedback" role="status"><strong>{answer===currentQuestion.answer?'✓ Correct reasoning':'Review the governing principle'}</strong><p>{currentQuestion.feedback}</p></div>:null}
    <div className="actions">{revealed?<button type="button" className="primary" onClick={advance}>{index===questions.length-1?'Finish assessment →':'Continue to next question →'}</button>:<button type="button" className="primary" disabled={answer===null} onClick={check}>Check decision →</button>}</div>
    </section>
   </>:<section className="fatf40result"><span aria-hidden="true">🏅</span><h2>{correctCount===questions.length?'Recommendation mastered!':'Assessment completed'}</h2><p>You answered {correctCount} of {questions.length} questions correctly. Mastery requires 3/3; repeat the practice as needed.</p><strong>{correctCount*100} points from this attempt</strong>
    <div className="fatf40review"><h3>Detailed assessment review</h3>{questions.map((q,i)=><div key={i}><strong>{attemptAnswers[i]?.correct?'✓':'○'} {q.prompt}</strong><p>{q.feedback}</p></div>)}</div><div className="fatf40actions"><button type="button" className="primary" disabled={current.number<40&&!canOpen(current.number+1)} onClick={goNext}>{current.number<40&&!canOpen(current.number+1)?'Master R.'+current.number+' to unlock the next →':current.number===40?'Return to all 40 →':'Continue to R.'+(current.number+1)+' →'}</button><button className="secondary" type="button" onClick={()=>{setView('study');window.scrollTo(0,0)}}>Review explanation and retry →</button></div>
   </section>}
   <div className="fatf40footer"><a href={FATF_STANDARD_URL} target="_blank" rel="noopener noreferrer">Verify Recommendation {current.number}, its Interpretive Note and Glossary in the official FATF publication ↗</a><p>Educational scenario only. Check current domestic rules, including transitional arrangements and statutory safeguards.</p></div>
  </>}
 </main>;
}
