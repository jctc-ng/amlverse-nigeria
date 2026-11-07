import {useState} from 'react';
import {decisionFiles} from './WorldDecisionFiles';
import {CompletionMeter} from './CompletionMeter';
import type {CourseKey} from './progress';

const PREFIX='amlverse-world-decisions-v1-';
export function readDecisionProgress(game:CourseKey):{passed:boolean;best:number}{
 try{const v=JSON.parse(localStorage.getItem(PREFIX+game)||'{}') as {passed?:boolean;best?:number};
 return {passed:v.passed===true,best:typeof v.best==='number'&&Number.isFinite(v.best)?Math.max(0,Math.min(100,v.best)):0}}catch{return {passed:false,best:0}}
}
const titles:Record<CourseKey,string>={risk:'Risk Assessment',team:'Interagency Cooperation',evaluation:'Mutual Evaluation',egmont:'FIU Information Exchange',typologies:'Financial Crime Typologies',nigeria:'Nigeria Compliance',virtualassets:'Virtual Asset Investigation',advancedtrace:'Advanced Cryptocurrency Tracing',reportwriting:'Intelligence Report Writing'};
export default function WorldDecisionLab({game,onBack,onContinue}:{game:CourseKey;onBack:()=>void;onContinue:()=>void}){
 const data=decisionFiles[game];
 const [step,setStep]=useState(0);
 const [choice,setChoice]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [results,setResults]=useState<{correct:boolean;why:string;selected:string}[]>([]);
 const [finished,setFinished]=useState(false);
 const [gift,setGift]=useState(false);
 const [saved,setSaved]=useState(()=>readDecisionProgress(game));
 const item=data.stages[step];
 const score=Math.round(results.filter(x=>x.correct).length/3*100);
 function advance(){
  if(choice===null||!checked)return;
  const output=[...results,{correct:choice===item.correct,why:item.why,selected:item.options[choice]}];
  setResults(output);
  if(step===2){
   const accuracy=Math.round(output.filter(x=>x.correct).length/3*100);
   const next={passed:saved.passed||accuracy>=67,best:Math.max(saved.best,accuracy)};
   try{localStorage.setItem(PREFIX+game,JSON.stringify(next))}catch{}
   setSaved(next);setFinished(true);window.scrollTo(0,0);
   return;
  }
  setStep(n=>n+1);setChoice(null);setChecked(false);window.scrollTo(0,0);
 }
 function retry(){setStep(0);setChoice(null);setChecked(false);setResults([]);setFinished(false);setGift(false);window.scrollTo(0,0)}
 return <main className="narrow worlddecision">
 <button className="back" type="button" onClick={onBack}>← {titles[game]}</button>
 <span className="eyebrow">AMLVERSE • PRACTICAL PROFESSIONAL INVESTIGATION</span>
 <h1 className="title">{data.title}</h1>
 <p className="lead">A three-stage fictional investigation. Examine the evidence, choose a defensible decision and see the analytical explanation before continuing.</p>
 <CompletionMeter done={Number(saved.passed)} total={1} caption="Decision lab · saved completion"/>
 <CompletionMeter done={finished?3:step} total={3} caption="Current investigation · decision stages" compact/>
 <div className="worlddecisionbrief">
  <h2>Case briefing</h2><p>{data.brief}</p>
  <div className="worlddecisionanalogy"><strong>💡 Understand the situation</strong><p>{data.analogy}</p></div>
 </div>
 <div className="worlddecisionfile"><h2>Evidence file</h2><div className="worlddecisionrecords">{data.evidence.map((record,i)=><article key={i}><span>EVIDENCE {i+1}</span><p>{record}</p></article>)}</div><p className="worlddecisiondisclaimer">All evidence is fictional. An investigative indicator is not proof of criminality or identity.</p></div>
 <div className="worlddecisionstages" aria-label="Case investigation stages">{data.stages.map((s,i)=><div key={i} className={(i<step||finished?'done':i===step?'active':'')}><span>{i<step||finished?'✓':i+1}</span><small>{i===0?'Identify':i===1?'Corroborate':'Respond'}</small></div>)}</div>
 {!finished?<section className="worlddecisionquestion"><span className="eyebrow">INVESTIGATION STAGE {step+1} / 3</span><h2>{item.question}</h2><div className="worlddecisionoptions">{item.options.map((option,i)=><button key={i} type="button" disabled={checked} className={(choice===i?'picked ':'')+(checked&&i===item.correct?'right':'')} onClick={()=>setChoice(i)}><b>{String.fromCharCode(65+i)}</b><span>{option}</span></button>)}</div>
 {checked?<div className={'itracefeedback '+(choice===item.correct?'right':'wrong')} role="status"><strong>{choice===item.correct?'✓ Correct professional decision':'Review this analytical decision'}</strong><p>{item.why}</p></div>:null}
 <div className="nextstepbar"><span>{checked?'Review the explanation, then continue.':'Select a decision using the evidence file above.'}</span>{checked?<button type="button" className="primary" onClick={advance}>{step===2?'Complete case →':'Continue to next stage →'}</button>:<button type="button" className="primary" disabled={choice===null} onClick={()=>setChecked(true)}>Evaluate decision →</button>}</div>
 </section>:<section className="worlddecisionresult"><span aria-hidden="true">🏅</span><h2>{score>=67?'Investigation decision exercise passed':'Review and strengthen your decisions'}</h2><strong>{score}% accuracy · {results.filter(x=>x.correct).length}/3</strong><p>Best recorded score: {saved.best}%. Pass requirement: at least two correct decisions.</p><div className="worlddecisionreview">{results.map((r,i)=><article key={i}><b>{r.correct?'✓':'○'} Stage {i+1}: {data.stages[i].question}</b><p>Your decision: {r.selected}</p><p>{r.why}</p></article>)}</div>
 {saved.passed?<div className="worlddecisionaward"><strong>🎁 Professional Decision Investigator</strong>{!gift?<button type="button" className="secondary" onClick={()=>setGift(true)}>Open achievement gift →</button>:<p>🏅 Case competency achieved. This is an educational badge, not professional certification.</p>}</div>:null}
 <div className="nextstepbar"><span>{saved.passed?'Your next learning activity is ready.':'Review the case and try another attempt.'}</span><button className="primary" type="button" onClick={saved.passed?onContinue:retry}>{saved.passed?'Continue learning →':'Retry investigation →'}</button></div><button type="button" className="secondary" onClick={retry}>↻ Replay this decision case</button>
 </section>}
 </main>;
}
