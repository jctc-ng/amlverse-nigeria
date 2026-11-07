import {isCourseUnlocked} from './LearningTownProgress';
import {useEffect,useState} from 'react';
import {virtualLessons,virtualQuestions,virtualCases,virtualReferences} from './VirtualAssetContent';
import type {VirtualTier,VirtualQuestion} from './VirtualAssetContent';
import VirtualAssetGraphLesson,{TransactionStudyGraph} from './VirtualAssetGraphLesson';
import InteractiveTracingLab from './InteractiveTracingLab';
import {readInteractiveTraceProgress} from './InteractiveTracingLab';
type Progress={lessonChecks:number[];visited:number[];quizBest:Record<VirtualTier,number>;quizPass:Record<VirtualTier,boolean>;simBest:Record<VirtualTier,number>;simPass:Record<VirtualTier,boolean>;attempts:Record<VirtualTier,number>};
const tiers:VirtualTier[]=['Foundations','Intermediate','Advanced'];
const key='amlverse-virtual-asset-advanced-v1';
const empty=():Progress=>({lessonChecks:[],visited:[],quizBest:{Foundations:0,Intermediate:0,Advanced:0},quizPass:{Foundations:false,Intermediate:false,Advanced:false},simBest:{Foundations:0,Intermediate:0,Advanced:0},simPass:{Foundations:false,Intermediate:false,Advanced:false},attempts:{Foundations:0,Intermediate:0,Advanced:0}});
function getProgress():Progress{try{const v=JSON.parse(localStorage.getItem(key)||'null') as Partial<Progress>|null;if(!v)return empty();const e=empty();return {lessonChecks:Array.isArray(v.lessonChecks)?v.lessonChecks.filter(x=>Number.isInteger(x)&&x>=0&&x<virtualLessons.length):[],visited:Array.isArray(v.visited)?v.visited.filter(x=>Number.isInteger(x)&&x>=0&&x<virtualLessons.length):[],quizBest:{...e.quizBest,...v.quizBest},quizPass:{...e.quizPass,...v.quizPass},simBest:{...e.simBest,...v.simBest},simPass:{...e.simPass,...v.simPass},attempts:{...e.attempts,...v.attempts}}}catch{return empty()}}
export function readVirtualAdvancedProgress(){return getProgress()}
export function virtualGraphScholar(p:Progress){return p.lessonChecks.length===virtualLessons.length}
export function virtualAdvancedMastered(p:Progress){return p.visited.length===virtualLessons.length&&tiers.every(t=>p.quizPass[t]&&p.simPass[t])}
type QuizItem={source:VirtualQuestion;choices:{text:string;original:number}[]};
function arrange<T>(a:T[],seed:number){const r=[...a];let n=seed+237;for(let i=r.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[r[i],r[j]]=[r[j],r[i]]}return r}
function quizFor(tier:VirtualTier,attempt:number):QuizItem[]{
 const source=virtualQuestions.filter(q=>q.level===tier);
 const chosen=arrange(source,attempt*19+tiers.indexOf(tier)*71).slice(0,10);
 return chosen.map((q,i)=>({source:q,choices:arrange(q.options.map((text,original)=>({text,original})),i*21+attempt*17+3)}));
}
type Mode='overview'|'lesson'|'quiz'|'simulation'|'interactive';
export default function VirtualAssetAdvanced({onBack,onClassic,onNextCourse,initialMode}:{onBack:()=>void;onClassic:()=>void;onNextCourse:()=>void;initialMode?:'interactive'}){
 const [progress,setProgress]=useState<Progress>(getProgress);
 const [mode,setMode]=useState<Mode>(initialMode||'overview');

 const interactiveCount=readInteractiveTraceProgress().completed.length;
 const [tier,setTier]=useState<VirtualTier>('Foundations');
 const [lessonIndex,setLessonIndex]=useState(0);
 const [quiz,setQuiz]=useState<QuizItem[]>([]);
 const [qIndex,setQIndex]=useState(0);
 const [picked,setPicked]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [correctCount,setCorrectCount]=useState(0);
 const [finished,setFinished]=useState(false);
 const [simIndex,setSimIndex]=useState(0);
 const [simScore,setSimScore]=useState(0);
 const [simAttempt,setSimAttempt]=useState(0);
 const [review,setReview]=useState<{correct:boolean;prompt:string;why:string}[]>([]);
 const [giftTier,setGiftTier]=useState<VirtualTier|null>(null);
 const [giftOpened,setGiftOpened]=useState(false);
 useEffect(()=>{
  if(typeof window==='undefined'||!window.matchMedia('(max-width:760px)').matches)return;
  if(mode!=='lesson'&&mode!=='quiz'&&mode!=='simulation')return;
  const frame=window.requestAnimationFrame(()=>{
   const target=document.querySelector(mode==='lesson'?'.riskadvancedlesson':'.riskadvancedassessment');
   if(target)target.scrollIntoView({block:'start',behavior:'auto'});
  });
  return ()=>window.cancelAnimationFrame(frame);
 },[mode,lessonIndex,qIndex,simIndex,finished]);
 function save(fn:(x:Progress)=>Progress){setProgress(old=>{const updated=fn(old);try{localStorage.setItem(key,JSON.stringify(updated))}catch{}return updated})}
 const lesson=virtualLessons[lessonIndex];
 const caseFile=virtualCases.find(c=>c.tier===tier)!;
 const caseQuestion=caseFile.tasks[simIndex];
 const caseChoices=arrange(caseQuestion.answers.map((text,original)=>({text,original})),simAttempt*37+simIndex*11+tiers.indexOf(tier)*17);
 const question=quiz[qIndex];
 const totalSteps=12+12+6;
 const completedSteps=progress.visited.length+progress.lessonChecks.length+tiers.filter(t=>progress.quizPass[t]).length+tiers.filter(t=>progress.simPass[t]).length;
 const percent=Math.round(100*completedSteps/totalSteps);
 const mastered=virtualAdvancedMastered(progress);
 const freeLearning=isCourseUnlocked('virtualassets');
 function tierAvailable(t:VirtualTier){
  if(freeLearning)return true;
  const rank=tiers.indexOf(t);
  if(rank===0)return true;
  const prior=tiers[rank-1];
  return virtualLessons.filter(l=>l.tier===prior).every((_,offset)=>progress.lessonChecks.includes((rank-1)*4+offset))&&progress.quizPass[prior]&&progress.simPass[prior];
 }
 function lessonAvailable(index:number){
  if(freeLearning)return true;
  if(!tierAvailable(virtualLessons[index].tier))return false;
  return index%4===0||progress.lessonChecks.includes(index-1);
 }
 function quizAvailable(t:VirtualTier){
  if(freeLearning)return true;
  return tierAvailable(t)&&virtualLessons.map((l,i)=>l.tier===t?i:-1).filter(i=>i>=0).every(i=>progress.lessonChecks.includes(i));
 }
 function simulationAvailable(t:VirtualTier){
  return freeLearning||(quizAvailable(t)&&progress.quizPass[t]);
 }
 function openLesson(index:number){if(!lessonAvailable(index))return;setLessonIndex(index);setMode('lesson');setFinished(false);save(p=>({...p,visited:Array.from(new Set([...p.visited,index]))}));window.scrollTo(0,0)}
 function startQuiz(t:VirtualTier){if(!quizAvailable(t))return;setTier(t);setQuiz(quizFor(t,progress.attempts[t]+1));setQIndex(0);setPicked(null);setChecked(false);setFinished(false);setCorrectCount(0);setReview([]);setMode('quiz');window.scrollTo(0,0)}
 function startSim(t:VirtualTier){if(!simulationAvailable(t))return;setTier(t);setSimAttempt(n=>n+1);setSimIndex(0);setSimScore(0);setPicked(null);setChecked(false);setFinished(false);setReview([]);setMode('simulation');window.scrollTo(0,0)}
 function finishQuiz(){
  const n=correctCount+(picked===question.choices.findIndex(c=>c.original===question.source.correct)?1:0);
  const result=Math.round(n/quiz.length*100);
  save(p=>({...p,quizBest:{...p.quizBest,[tier]:Math.max(p.quizBest[tier],result)},quizPass:{...p.quizPass,[tier]:p.quizPass[tier]||result>=80},attempts:{...p.attempts,[tier]:p.attempts[tier]+1}}));
  setCorrectCount(n);setFinished(true);window.scrollTo(0,0);
 }
 function finishSim(){
  const n=simScore+(picked!==null&&caseChoices[picked].original===0?1:0);
  const result=Math.round(n/caseFile.tasks.length*100);
  save(p=>({...p,simBest:{...p.simBest,[tier]:Math.max(p.simBest[tier],result)},simPass:{...p.simPass,[tier]:p.simPass[tier]||result>=67}}));
  setSimScore(n);setFinished(true);window.scrollTo(0,0);
  if(result>=67&&progress.visited.filter(i=>virtualLessons[i].tier===tier).length===4&&progress.quizPass[tier]){setGiftTier(tier);setGiftOpened(false)}
 }
 function nextQuiz(){const chosen=question.choices[picked!];const yes=chosen.original===question.source.correct;setReview(a=>[...a,{correct:yes,prompt:question.source.prompt,why:question.source.explanation}]);if(qIndex===quiz.length-1){finishQuiz();return}if(yes)setCorrectCount(n=>n+1);setQIndex(i=>i+1);setPicked(null);setChecked(false);window.scrollTo(0,0)}
 function nextSim(){const yes=picked!==null&&caseChoices[picked].original===0;setReview(a=>[...a,{correct:yes,prompt:caseQuestion.prompt,why:caseQuestion.why}]);if(simIndex===caseFile.tasks.length-1){finishSim();return}if(yes)setSimScore(n=>n+1);setSimIndex(i=>i+1);setPicked(null);setChecked(false);window.scrollTo(0,0)}
 function nextForTier(t:VirtualTier){
  const indexes=virtualLessons.map((l,i)=>l.tier===t?i:-1).filter(i=>i>=0);
  const missing=indexes.find(i=>!progress.lessonChecks.includes(i));
  if(missing!==undefined){openLesson(missing);return}
  if(!progress.quizPass[t]){startQuiz(t);return}
  if(!progress.simPass[t]){startSim(t);return}
  const next=tiers[tiers.indexOf(t)+1];
  if(next){const first=virtualLessons.findIndex(l=>l.tier===next);const missingNext=virtualLessons.map((l,i)=>l.tier===next&&!progress.lessonChecks.includes(i)?i:-1).find(i=>i>=0);openLesson(missingNext===undefined?first:missingNext);return}
  onNextCourse();
 }
 function continueAfterGift(){const finishedTier=giftTier;setGiftTier(null);setGiftOpened(false);if(finishedTier)nextForTier(finishedTier)}
 function continueAfterLesson(){if(!progress.lessonChecks.includes(lessonIndex))return;const current=lessonIndex;const next=tiers.indexOf(lesson.tier);const levelLast=(next+1)*4-1;if(current<levelLast){openLesson(current+1);return}startQuiz(lesson.tier)}
 const recommendedTier=tiers.find(t=>{const indexes=virtualLessons.map((l,i)=>l.tier===t?i:-1).filter(i=>i>=0);return indexes.some(i=>!progress.lessonChecks.includes(i))||!progress.quizPass[t]||!progress.simPass[t]})||null;
 return <main className="narrow riskadvanced">
 <button type="button" className="back" onClick={onBack}>← Virtual Asset learning room</button>
 <span className="eyebrow">AMLVERSE 0.22 • EXPANDED VIRTUAL ASSET INVESTIGATION LEARNING</span><h1 className="title">Virtual Asset Academy 2.0 🔗</h1><p className="lead">Twelve professionally annotated graph lessons, five graph questions in every lesson, sixty tier questions and three expanded tracing simulations. Your original Virtual Asset game score and World Champion gift remain separate and unchanged.</p>
 <div className="riskadvancedtop"><div><small>ADVANCED CURRICULUM PROGRESS</small><strong>{completedSteps} / {totalSteps} milestones</strong></div><div className="riskadvancedprogress"><div style={{width:percent+'%'}}/></div><span>{percent}%</span></div>

 <div className="riskadvancedpromo"><div><span className="eyebrow">NEW • CLICKABLE TRANSACTION INVESTIGATION</span><h2>Interactive Tracing Lab — 6 graph missions</h2><p>Select nodes and transaction paths directly, inspect evidence and build an accurate tracing conclusion. {interactiveCount}/6 missions completed. Progress and gifts are saved in this browser.</p></div><button type="button" className="primary" onClick={()=>{setMode('interactive');window.scrollTo(0,0)}}>Open interactive graph missions →</button></div>
 <div className="riskadvancednav"><button type="button" className={mode==='overview'?'active':''} onClick={()=>setMode('overview')}>Course Overview</button><button type="button" onClick={onClassic}>Classic Virtual Asset game →</button></div>
 {mode==='interactive'?<InteractiveTracingLab onBack={()=>{setMode('overview');window.scrollTo(0,0)}} onAdvance={()=>{setMode('overview');window.scrollTo(0,0)}}/>:mode==='overview'?<>
 <div className="riskadvancedwelcome"><h2>{mastered?'🏅 Advanced Virtual Asset Mastery Unlocked':'Three progressive learning levels'}</h2><p>Study four analogy-and-graph lessons and answer five graph questions in each (four correct to pass), then pass a 10-question assessment with at least 80%, and complete the tracing investigation simulation in each level. You can review lessons and retry questions at any time.</p></div>
 {tiers.map(t=>{const indexes=virtualLessons.map((l,i)=>l.tier===t?i:-1).filter(i=>i>=0);const count=indexes.filter(i=>progress.visited.includes(i)).length;return <section key={t} className={"riskadvancedtier"+(!tierAvailable(t)?" riskadvancedtierlocked":"") }>
 <div className="riskadvancedtierhead"><div><span className="eyebrow">{t.toUpperCase()} LEVEL</span><h2>{t==='Foundations'?'Understand blockchains':t==='Intermediate'?'Trace and evaluate':'Investigate and report'}</h2><p>{count}/4 lessons explored · {indexes.filter(i=>progress.lessonChecks.includes(i)).length}/4 graph checks · Quiz best {progress.quizBest[t]}% · Simulation best {progress.simBest[t]}%</p></div><span>{count===4&&indexes.every(i=>progress.lessonChecks.includes(i))&&progress.quizPass[t]&&progress.simPass[t]?'✓ Completed':!tierAvailable(t)?'🔒 Locked':'In progress'}</span></div>
 <div className="riskadvancedlessons">{indexes.map(i=><button type="button" key={i} onClick={()=>openLesson(i)} disabled={!lessonAvailable(i)} title={!lessonAvailable(i)?"Finish the previous lesson and level first":undefined}><span>{progress.lessonChecks.includes(i)?'✓':progress.visited.includes(i)?'◉':'📖'}</span><b>{virtualLessons[i].title}</b><small>Lesson {i+1}</small></button>)}</div>
 <div className="riskadvancedtieractions"><button type="button" className="secondary" onClick={()=>startQuiz(t)} disabled={!quizAvailable(t)} title={!quizAvailable(t)?"Finish this level’s four lessons first":undefined}>🧠 {progress.quizPass[t]?'Replay':'Take'} 10-question quiz</button><button type="button" className="secondary" onClick={()=>startSim(t)} disabled={!simulationAvailable(t)} title={!simulationAvailable(t)?"Pass this level’s knowledge check first":undefined}>🎮 {progress.simPass[t]?'Replay':'Start'} case simulation</button></div>
 </section>})}
 <div className="notice"><b>Assessment rules:</b> Each lesson adds five assessed graph questions; each tier also draws ten questions from a bank of twenty. Question and answer order change between attempts, with detailed explanations. Passing the expanded curriculum is a separate educational milestone and does not revoke existing Virtual Asset completion.</div>
 <div className="mobilelessonfooter"><p className="mobilelessonfootnote">You have reached the end of the course overview. Select Continue to resume the next required lesson, knowledge check or simulation. Passing the relevant assessment is necessary to unlock the next level.</p> <div className="nextstepbar"><span>{recommendedTier?'Current level: '+recommendedTier+' level':'All expanded Virtual Asset milestones complete'}</span><button type="button" className="primary" onClick={()=>recommendedTier?nextForTier(recommendedTier):onNextCourse()}>{recommendedTier?'Resume next required activity →':'Continue to next world →'}</button></div></div>
 </>:mode==='lesson'?<section className="riskadvancedlesson"><div className="riskadvancedstep"><span>{lesson.tier} · Lesson {lessonIndex+1} / {virtualLessons.length}</span><button type="button" onClick={()=>setMode('overview')}>All lessons</button></div><h2>{lesson.title}</h2><p>{lesson.explanation}</p><div className="knowledgeexample"><b>Fictional example</b><p>{lesson.example}</p></div><div className="knowledgetakeaway"><b>Key takeaway:</b> {lesson.takeaway}</div><VirtualAssetGraphLesson key={lessonIndex} index={lessonIndex} passed={progress.lessonChecks.includes(lessonIndex)} onPass={()=>save(p=>({...p,lessonChecks:Array.from(new Set([...p.lessonChecks,lessonIndex]))}))} onContinue={continueAfterLesson}/><div className="actions">{lessonIndex>0?<button className="secondary" onClick={()=>openLesson(lessonIndex-1)}>← Previous lesson</button>:null}{progress.lessonChecks.includes(lessonIndex)?<button className="primary" onClick={continueAfterLesson}>{(lessonIndex+1)%4===0?"Continue to "+lesson.tier+" knowledge check →":"Continue to next lesson →"}</button>:<span className="graphstudyreminder">Pass four of the five graph questions to unlock the next lesson.</span>}</div></section>
 :mode==='quiz'?<section className="riskadvancedassessment"><div className="riskadvancedstep"><span>{tier} · 10-question knowledge assessment</span><button type="button" onClick={()=>setMode('overview')}>Exit quiz</button></div><p className="mobilequizhelp">Knowledge check: choose your answer, tap <strong>Check answer</strong>, read the explanation, then tap <strong>Next question</strong>. Answer at least 8 of 10 questions correctly to unlock the simulation. You can retry if needed.</p>{finished?<><div className="arcadewin"><span aria-hidden="true">🏆</span><h2>{correctCount>=8?'Assessment passed!':'Review and try again'}</h2><strong>{Math.round(correctCount/quiz.length*100)}%</strong><p>{correctCount}/10 correct · Pass threshold 80% · Best {progress.quizBest[tier]}%</p></div><div className="riskadvancedreview"><h3>Your answer review</h3>{review.map((r,i)=><div key={i}><strong>{r.correct?'✓':'○'} {r.prompt}</strong><p>{r.why}</p></div>)}</div><div className="actions"><button className="primary" onClick={()=>startQuiz(tier)}>Try another question set ↻</button><button className="secondary" onClick={()=>setMode('overview')}>Back to course</button>{(correctCount>=8||progress.quizPass[tier])?<button className="primary" onClick={()=>nextForTier(tier)}>Continue to simulation →</button>:null}</div></>:<><div className="riskadvancedprogress"><div style={{width:((qIndex+1)/quiz.length*100)+'%'}}/></div><h2>Question {qIndex+1} / {quiz.length}</h2><p className="riskadvancedprompt">{question.source.prompt}</p><div className="choices">{question.choices.map((c,i)=><button key={i} className={'choice'+(picked===i?' picked':'')+(checked&&c.original===question.source.correct?' correct':'')} disabled={checked} type="button" onClick={()=>setPicked(i)}><span className="letter">{String.fromCharCode(65+i)}</span>{c.text}</button>)}</div>{checked?<div className="feedback" role="status"><strong>{question.choices[picked!].original===question.source.correct?'✓ Correct':'Learning opportunity'}</strong><p>{question.source.explanation}</p></div>:null}<div className="actions">{checked?<button className="primary" onClick={nextQuiz}>{qIndex===quiz.length-1?'View assessment result':'Next question'} →</button>:<button className="primary" disabled={picked===null} onClick={()=>setChecked(true)}>Check answer →</button>}</div></>}</section>
 :<section className="riskadvancedassessment"><div className="riskadvancedstep"><span>{tier} · Fictional case: {caseFile.id}</span><button type="button" onClick={()=>setMode('overview')}>Exit simulation</button></div>{finished?<><div className="arcadewin"><span aria-hidden="true">🎉</span><h2>{simScore>=Math.ceil(caseFile.tasks.length*0.67)?'Simulation completed!':'Review the case and retry'}</h2><strong>{simScore} / {caseFile.tasks.length} decisions</strong><p>{simScore>=Math.ceil(caseFile.tasks.length*0.67)?'Case milestone saved':'At least five of seven correct case decisions are required'}</p></div><div className="riskadvancedreview">{review.map((r,i)=><div key={i}><strong>{r.correct?'✓':'○'} {r.prompt}</strong><p>{r.why}</p></div>)}</div><div className="actions"><button className="primary" onClick={()=>startSim(tier)}>Replay case ↻</button><button className="secondary" onClick={()=>setMode('overview')}>Back to course</button>{(simScore>=Math.ceil(caseFile.tasks.length*0.67)||progress.simPass[tier])?<button className="primary" onClick={()=>nextForTier(tier)}>Continue learning →</button>:null}</div></>:<><h2>{caseFile.title}</h2><div className="situation"><small>FICTIONAL CASE BRIEF</small><p>{caseFile.narrative}</p></div>
 <TransactionStudyGraph nodes={Array.from(new Set(caseFile.flow.flatMap(e=>[e[0],e[1]]))).map(id=>[id,id,"Synthetic"] as [string,string,string])} links={caseFile.flow.map(edge=>({from:edge[0],to:edge[1],label:edge[2],status:(/unverified|claimed/i.test(edge[2])?"unverified":"confirmed") as "confirmed"|"unverified"}))} caption={"Simulation case "+caseFile.id+" — follow each recorded edge and test unsupported attributions"}/><h3 className="question">Decision {simIndex+1} of {caseFile.tasks.length}: {caseQuestion.prompt}</h3><div className="choices">{caseChoices.map((c,i)=><button key={i} type="button" disabled={checked} className={'choice'+(picked===i?' picked':'')+(checked&&c.original===0?' correct':'')} onClick={()=>setPicked(i)}><span className="letter">{String.fromCharCode(65+i)}</span >{c.text}</button>)}</div>{checked?<div className="feedback" role="status"><strong>{picked!==null&&caseChoices[picked].original===0?'✓ Evidence-based decision':'Review this response'}</strong><p>{caseQuestion.why}</p></div>:null}<div className="actions">{checked?<button className="primary" onClick={nextSim}>{simIndex===caseFile.tasks.length-1?'Finish simulation':'Next case decision'} →</button>:<button className="primary" disabled={picked===null} onClick={()=>setChecked(true)}>Check decision →</button>}</div></>}</section>}
 {giftTier?<div className="championshade" role="presentation"><section className="championmodal risklevelgift" role="dialog" aria-modal="true" aria-labelledby="risk-gift-title"><span className="championkicker">🎊 LEVEL COMPLETE!</span><h2 id="risk-gift-title">BOOM! {giftTier} mastered! 💥</h2><p>You've completed four lessons, passed the quiz and finished the case simulation.</p>{!giftOpened?<button type="button" className="championgift" onClick={()=>setGiftOpened(true)}><span aria-hidden="true">🎁</span><small>Open your learning gift</small></button>:<div className="championreward" role="status"><span aria-hidden="true">🏅</span><h3>{giftTier.toUpperCase()} SPECIALIST</h3><p>Your level achievement is ready. Continue to the next stage.</p></div>}<div className="championactions">{giftOpened?<button className="primary" type="button" onClick={continueAfterGift}>{giftTier==='Advanced'?'Continue to next world →':'Continue to next level →'}</button>:<button className="primary" type="button" onClick={()=>setGiftOpened(true)}>🎁 Open gift</button>}<button type="button" className="secondary" onClick={()=>{setGiftTier(null);setGiftOpened(false)}}>Review results</button></div></section></div>:null}
 <div className="notice"><b>Learning sources:</b> {virtualReferences.map((s,i)=><span key={s.url}>{i?' · ':''}<a href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a></span>)}. All examples and simulated records are fictional. Verify current guidance for actual professional practice.</div>
 </main>;
}
