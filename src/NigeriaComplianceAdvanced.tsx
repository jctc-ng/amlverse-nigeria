import {useState} from 'react';
import {nigeriaLessons,nigeriaQuestions,nigeriaCases,nigeriaReferences} from './NigeriaComplianceContent';
import type {NigeriaTier,NigeriaQuestion} from './NigeriaComplianceContent';
type Progress={visited:number[];quizBest:Record<NigeriaTier,number>;quizPass:Record<NigeriaTier,boolean>;simBest:Record<NigeriaTier,number>;simPass:Record<NigeriaTier,boolean>;attempts:Record<NigeriaTier,number>};
const tiers:NigeriaTier[]=['Foundations','Intermediate','Advanced'];
const key='amlverse-nigeria-compliance-advanced-v1';
const empty=():Progress=>({visited:[],quizBest:{Foundations:0,Intermediate:0,Advanced:0},quizPass:{Foundations:false,Intermediate:false,Advanced:false},simBest:{Foundations:0,Intermediate:0,Advanced:0},simPass:{Foundations:false,Intermediate:false,Advanced:false},attempts:{Foundations:0,Intermediate:0,Advanced:0}});
function getProgress():Progress{try{const v=JSON.parse(localStorage.getItem(key)||'null') as Partial<Progress>|null;if(!v)return empty();const e=empty();return {visited:Array.isArray(v.visited)?v.visited.filter(x=>Number.isInteger(x)&&x>=0&&x<nigeriaLessons.length):[],quizBest:{...e.quizBest,...v.quizBest},quizPass:{...e.quizPass,...v.quizPass},simBest:{...e.simBest,...v.simBest},simPass:{...e.simPass,...v.simPass},attempts:{...e.attempts,...v.attempts}}}catch{return empty()}}
export function readNigeriaAdvancedProgress(){return getProgress()}
export function nigeriaAdvancedMastered(p:Progress){return p.visited.length===nigeriaLessons.length&&tiers.every(t=>p.quizPass[t]&&p.simPass[t])}
type QuizItem={source:NigeriaQuestion;choices:{text:string;original:number}[]};
function arrange<T>(a:T[],seed:number){const r=[...a];let n=seed+237;for(let i=r.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[r[i],r[j]]=[r[j],r[i]]}return r}
function quizFor(tier:NigeriaTier,attempt:number):QuizItem[]{
 const source=nigeriaQuestions.filter(q=>q.level===tier);
 const chosen=arrange(source,attempt*19+tiers.indexOf(tier)*71).slice(0,10);
 return chosen.map((q,i)=>({source:q,choices:arrange(q.options.map((text,original)=>({text,original})),i*21+attempt*17+3)}));
}
type Mode='overview'|'lesson'|'quiz'|'simulation';
export default function NigeriaComplianceAdvanced({onBack,onClassic,onNextCourse}:{onBack:()=>void;onClassic:()=>void;onNextCourse:()=>void}){
 const [progress,setProgress]=useState<Progress>(getProgress);
 const [mode,setMode]=useState<Mode>('overview');
 const [tier,setTier]=useState<NigeriaTier>('Foundations');
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
 const [giftTier,setGiftTier]=useState<NigeriaTier|null>(null);
 const [giftOpened,setGiftOpened]=useState(false);
 function save(fn:(x:Progress)=>Progress){setProgress(old=>{const updated=fn(old);try{localStorage.setItem(key,JSON.stringify(updated))}catch{}return updated})}
 const lesson=nigeriaLessons[lessonIndex];
 const caseFile=nigeriaCases.find(c=>c.tier===tier)!;
 const caseQuestion=caseFile.tasks[simIndex];
 const caseChoices=arrange(caseQuestion.answers.map((text,original)=>({text,original})),simAttempt*37+simIndex*11+tiers.indexOf(tier)*17);
 const question=quiz[qIndex];
 const totalSteps=12+6;
 const completedSteps=progress.visited.length+tiers.filter(t=>progress.quizPass[t]).length+tiers.filter(t=>progress.simPass[t]).length;
 const percent=Math.round(100*completedSteps/totalSteps);
 const mastered=nigeriaAdvancedMastered(progress);
 function openLesson(index:number){setLessonIndex(index);setMode('lesson');setFinished(false);save(p=>({...p,visited:Array.from(new Set([...p.visited,index]))}));window.scrollTo(0,0)}
 function startQuiz(t:NigeriaTier){setTier(t);setQuiz(quizFor(t,progress.attempts[t]+1));setQIndex(0);setPicked(null);setChecked(false);setFinished(false);setCorrectCount(0);setReview([]);setMode('quiz');window.scrollTo(0,0)}
 function startSim(t:NigeriaTier){setTier(t);setSimAttempt(n=>n+1);setSimIndex(0);setSimScore(0);setPicked(null);setChecked(false);setFinished(false);setReview([]);setMode('simulation');window.scrollTo(0,0)}
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
  if(result>=67&&progress.visited.filter(i=>nigeriaLessons[i].tier===tier).length===4&&progress.quizPass[tier]){setGiftTier(tier);setGiftOpened(false)}
 }
 function nextQuiz(){const chosen=question.choices[picked!];const yes=chosen.original===question.source.correct;setReview(a=>[...a,{correct:yes,prompt:question.source.prompt,why:question.source.explanation}]);if(qIndex===quiz.length-1){finishQuiz();return}if(yes)setCorrectCount(n=>n+1);setQIndex(i=>i+1);setPicked(null);setChecked(false);window.scrollTo(0,0)}
 function nextSim(){const yes=picked!==null&&caseChoices[picked].original===0;setReview(a=>[...a,{correct:yes,prompt:caseQuestion.prompt,why:caseQuestion.why}]);if(simIndex===caseFile.tasks.length-1){finishSim();return}if(yes)setSimScore(n=>n+1);setSimIndex(i=>i+1);setPicked(null);setChecked(false);window.scrollTo(0,0)}
 function nextForTier(t:NigeriaTier){
  const indexes=nigeriaLessons.map((l,i)=>l.tier===t?i:-1).filter(i=>i>=0);
  const missing=indexes.find(i=>!progress.visited.includes(i));
  if(missing!==undefined){openLesson(missing);return}
  if(!progress.quizPass[t]){startQuiz(t);return}
  if(!progress.simPass[t]){startSim(t);return}
  const next=tiers[tiers.indexOf(t)+1];
  if(next){const first=nigeriaLessons.findIndex(l=>l.tier===next);const missingNext=nigeriaLessons.map((l,i)=>l.tier===next&&!progress.visited.includes(i)?i:-1).find(i=>i>=0);openLesson(missingNext===undefined?first:missingNext);return}
  onNextCourse();
 }
 function continueAfterGift(){const finishedTier=giftTier;setGiftTier(null);setGiftOpened(false);if(finishedTier)nextForTier(finishedTier)}
 function continueAfterLesson(){const current=lessonIndex;const next=tiers.indexOf(lesson.tier);const levelLast=(next+1)*4-1;if(current<levelLast){openLesson(current+1);return}startQuiz(lesson.tier)}
 const recommendedTier=tiers.find(t=>{const indexes=nigeriaLessons.map((l,i)=>l.tier===t?i:-1).filter(i=>i>=0);return indexes.some(i=>!progress.visited.includes(i))||!progress.quizPass[t]||!progress.simPass[t]})||null;
 return <main className="narrow riskadvanced">
 <button type="button" className="back" onClick={onBack}>← Nigeria Compliance learning room</button>
 <span className="eyebrow">AMLVERSE 0.22 • EXPANDED NIGERIAN COMPLIANCE LEARNING</span><h1 className="title">Nigeria Compliance Academy 2.0 🇳🇬</h1><p className="lead">Twelve Nigeria-focused lessons, sixty knowledge questions and three fictional AML/CFT/CPF compliance simulations. Your original Nigeria Compliance score and World Champion gift remain separate and unchanged.</p>
 <div className="riskadvancedtop"><div><small>ADVANCED CURRICULUM PROGRESS</small><strong>{completedSteps} / {totalSteps} milestones</strong></div><div className="riskadvancedprogress"><div style={{width:percent+'%'}}/></div><span>{percent}%</span></div>

 <div className="riskadvancednav"><button type="button" className={mode==='overview'?'active':''} onClick={()=>setMode('overview')}>Course Overview</button><button type="button" onClick={onClassic}>Classic Nigeria Compliance game →</button></div>
 {mode==='overview'?<>
 <div className="riskadvancedwelcome"><h2>{mastered?'🏅 Advanced Nigeria Compliance Mastery Unlocked':'Three progressive learning levels'}</h2><p>Complete the four lessons, pass a 10-question assessment with at least 80%, and complete the compliance case simulation in each level. You can review lessons and retry questions at any time.</p></div>
 {tiers.map(t=>{const indexes=nigeriaLessons.map((l,i)=>l.tier===t?i:-1).filter(i=>i>=0);const count=indexes.filter(i=>progress.visited.includes(i)).length;return <section key={t} className="riskadvancedtier">
 <div className="riskadvancedtierhead"><div><span className="eyebrow">{t.toUpperCase()} LEVEL</span><h2>{t==='Foundations'?'Understand obligations':t==='Intermediate'?'Apply compliance controls':'Analyse and report'}</h2><p>{count}/4 lessons explored · Quiz best {progress.quizBest[t]}% · Simulation best {progress.simBest[t]}%</p></div><span>{count===4&&progress.quizPass[t]&&progress.simPass[t]?'✓ Completed':'In progress'}</span></div>
 <div className="riskadvancedlessons">{indexes.map(i=><button type="button" key={i} onClick={()=>openLesson(i)}><span>{progress.visited.includes(i)?'✓':'📖'}</span><b>{nigeriaLessons[i].title}</b><small>Lesson {i+1}</small></button>)}</div>
 <div className="riskadvancedtieractions"><button type="button" className="secondary" onClick={()=>startQuiz(t)}>🧠 {progress.quizPass[t]?'Replay':'Take'} 10-question quiz</button><button type="button" className="secondary" onClick={()=>startSim(t)}>🎮 {progress.simPass[t]?'Replay':'Start'} case simulation</button></div>
 </section>})}
 <div className="notice"><b>Assessment rules:</b> Each tier draws ten questions from a bank of twenty. Question and answer order change between attempts, with detailed explanations. Passing the expanded curriculum is a separate educational milestone and does not revoke existing Nigeria Compliance completion.</div>
 <div className="mobilelessonfooter"><p className="mobilelessonfootnote">You have reached the end of the course overview. Select Continue to resume the next required lesson, knowledge check or simulation. Passing the relevant assessment is necessary to unlock the next level.</p> <div className="nextstepbar"><span>{recommendedTier?'Current level: '+recommendedTier+' level':'All expanded Nigeria Compliance milestones complete'}</span><button type="button" className="primary" onClick={()=>recommendedTier?nextForTier(recommendedTier):onNextCourse()}>{recommendedTier?'Resume next required activity →':'Continue to next world →'}</button></div></div>
 </>:mode==='lesson'?<section className="riskadvancedlesson"><div className="riskadvancedstep"><span>{lesson.tier} · Lesson {lessonIndex+1} / {nigeriaLessons.length}</span><button type="button" onClick={()=>setMode('overview')}>All lessons</button></div><h2>{lesson.title}</h2><p>{lesson.explanation}</p><div className="knowledgeexample"><b>Fictional example</b><p>{lesson.example}</p></div><div className="knowledgetakeaway"><b>Key takeaway:</b> {lesson.takeaway}</div><div className="actions">{lessonIndex>0?<button className="secondary" onClick={()=>openLesson(lessonIndex-1)}>← Previous</button>:null}{lessonIndex<nigeriaLessons.length-1?<button className="primary" onClick={continueAfterLesson}>Continue →</button>:<button className="primary" onClick={continueAfterLesson}>Continue to {lesson.tier} quiz →</button>}</div></section>
 :mode==='quiz'?<section className="riskadvancedassessment"><div className="riskadvancedstep"><span>{tier} · 10-question knowledge assessment</span><button type="button" onClick={()=>setMode('overview')}>Exit quiz</button></div>{finished?<><div className="arcadewin"><span aria-hidden="true">🏆</span><h2>{correctCount>=8?'Assessment passed!':'Review and try again'}</h2><strong>{Math.round(correctCount/quiz.length*100)}%</strong><p>{correctCount}/10 correct · Pass threshold 80% · Best {progress.quizBest[tier]}%</p></div><div className="riskadvancedreview"><h3>Your answer review</h3>{review.map((r,i)=><div key={i}><strong>{r.correct?'✓':'○'} {r.prompt}</strong><p>{r.why}</p></div>)}</div><div className="actions"><button className="primary" onClick={()=>startQuiz(tier)}>Try another question set ↻</button><button className="secondary" onClick={()=>setMode('overview')}>Back to course</button>{(correctCount>=8||progress.quizPass[tier])?<button className="primary" onClick={()=>nextForTier(tier)}>Continue to simulation →</button>:null}</div></>:<><div className="riskadvancedprogress"><div style={{width:((qIndex+1)/quiz.length*100)+'%'}}/></div><h2>Question {qIndex+1} / {quiz.length}</h2><p className="riskadvancedprompt">{question.source.prompt}</p><div className="choices">{question.choices.map((c,i)=><button key={i} className={'choice'+(picked===i?' picked':'')+(checked&&c.original===question.source.correct?' correct':'')} disabled={checked} type="button" onClick={()=>setPicked(i)}><span className="letter">{String.fromCharCode(65+i)}</span>{c.text}</button>)}</div>{checked?<div className="feedback" role="status"><strong>{question.choices[picked!].original===question.source.correct?'✓ Correct':'Learning opportunity'}</strong><p>{question.source.explanation}</p></div>:null}<div className="actions">{checked?<button className="primary" onClick={nextQuiz}>{qIndex===quiz.length-1?'View assessment result':'Next question'} →</button>:<button className="primary" disabled={picked===null} onClick={()=>setChecked(true)}>Check answer →</button>}</div></>}</section>
 :<section className="riskadvancedassessment"><div className="riskadvancedstep"><span>{tier} · Fictional case: {caseFile.id}</span><button type="button" onClick={()=>setMode('overview')}>Exit simulation</button></div>{finished?<><div className="arcadewin"><span aria-hidden="true">🎉</span><h2>{simScore>=2?'Simulation completed!':'Review the case and retry'}</h2><strong>{simScore} / {caseFile.tasks.length} decisions</strong><p>{simScore>=2?'Case milestone saved':'Two correct case decisions are required'}</p></div><div className="riskadvancedreview">{review.map((r,i)=><div key={i}><strong>{r.correct?'✓':'○'} {r.prompt}</strong><p>{r.why}</p></div>)}</div><div className="actions"><button className="primary" onClick={()=>startSim(tier)}>Replay case ↻</button><button className="secondary" onClick={()=>setMode('overview')}>Back to course</button>{(simScore>=2||progress.simPass[tier])?<button className="primary" onClick={()=>nextForTier(tier)}>Continue learning →</button>:null}</div></>:<><h2>{caseFile.title}</h2><div className="situation"><small>FICTIONAL CASE BRIEF</small><p>{caseFile.narrative}</p></div><h3 className="question">Decision {simIndex+1} of {caseFile.tasks.length}: {caseQuestion.prompt}</h3><div className="choices">{caseChoices.map((c,i)=><button key={i} type="button" disabled={checked} className={'choice'+(picked===i?' picked':'')+(checked&&c.original===0?' correct':'')} onClick={()=>setPicked(i)}><span className="letter">{String.fromCharCode(65+i)}</span >{c.text}</button>)}</div>{checked?<div className="feedback" role="status"><strong>{picked!==null&&caseChoices[picked].original===0?'✓ Evidence-based decision':'Review this response'}</strong><p>{caseQuestion.why}</p></div>:null}<div className="actions">{checked?<button className="primary" onClick={nextSim}>{simIndex===caseFile.tasks.length-1?'Finish simulation':'Next case decision'} →</button>:<button className="primary" disabled={picked===null} onClick={()=>setChecked(true)}>Check decision →</button>}</div></>}</section>}
 {giftTier?<div className="championshade" role="presentation"><section className="championmodal risklevelgift" role="dialog" aria-modal="true" aria-labelledby="risk-gift-title"><span className="championkicker">🎊 LEVEL COMPLETE!</span><h2 id="risk-gift-title">BOOM! {giftTier} mastered! 💥</h2><p>You've completed four lessons, passed the quiz and finished the case simulation.</p>{!giftOpened?<button type="button" className="championgift" onClick={()=>setGiftOpened(true)}><span aria-hidden="true">🎁</span><small>Open your learning gift</small></button>:<div className="championreward" role="status"><span aria-hidden="true">🏅</span><h3>{giftTier.toUpperCase()} SPECIALIST</h3><p>Your level achievement is ready. Continue to the next stage.</p></div>}<div className="championactions">{giftOpened?<button className="primary" type="button" onClick={continueAfterGift}>{giftTier==='Advanced'?'Continue to next world →':'Continue to next level →'}</button>:<button className="primary" type="button" onClick={()=>setGiftOpened(true)}>🎁 Open gift</button>}<button type="button" className="secondary" onClick={()=>{setGiftTier(null);setGiftOpened(false)}}>Review results</button></div></section></div>:null}
 <div className="notice"><b>Learning sources:</b> {nigeriaReferences.map((s,i)=><span key={s.url}>{i?' · ':''}<a href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a></span>)}. All examples and simulated records are fictional. Verify current guidance for actual professional practice.</div>
 </main>;
}
