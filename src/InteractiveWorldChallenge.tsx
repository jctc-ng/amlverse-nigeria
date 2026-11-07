import {useState} from 'react';
import type {CourseKey} from './progress';
import {interactiveWorldCases} from './InteractiveWorldCases';

const STORE='amlverse-world-interactions-v1-';
export type WorldInteractionProgress={completed:number[];best:number};
export function readWorldInteractionProgress(game:CourseKey):WorldInteractionProgress{
 try{const x=JSON.parse(localStorage.getItem(STORE+game)||'null') as Partial<WorldInteractionProgress>|null;
  return {completed:Array.isArray(x?.completed)?x.completed.filter((n):n is number=>Number.isInteger(n)&&n>=0&&n<3):[],best:typeof x?.best==='number'&&Number.isFinite(x.best)?Math.min(100,Math.max(0,x.best)):0};
 }catch{return {completed:[],best:0}}
}
function store(game:CourseKey,progress:WorldInteractionProgress){try{localStorage.setItem(STORE+game,JSON.stringify(progress))}catch{}}
function shuffle<T>(arr:T[],seed:number){let state=seed+132;const x=[...arr];for(let i=x.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[x[i],x[j]]=[x[j],x[i]]}return x}
const worldNames:Record<CourseKey,string>={
 risk:'RiskLab',team:'Interagency Cooperation',evaluation:'Mutual Evaluation',egmont:'Egmont Exchange',
 typologies:'Typology Detective',nigeria:'Nigeria Compliance',virtualassets:'Virtual Asset Academy',
 advancedtrace:'Advanced Tracing',reportwriting:'Financial Intelligence Reporting'
};
export default function InteractiveWorldChallenge({game,onBack,onPass,onNext}:{game:CourseKey;onBack:()=>void;onPass:()=>void;onNext:()=>void}){
 const [progress,setProgress]=useState(()=>readWorldInteractionProgress(game));
 const [caseIndex,setCaseIndex]=useState(()=>{const p=readWorldInteractionProgress(game);return [0,1,2].find(i=>!p.completed.includes(i))??0});
 const [selected,setSelected]=useState<number|null>(null);
 const [timeline,setTimeline]=useState<number[]>([]);
 const [placed,setPlaced]=useState<Record<number,string>>({});
 const [mistakes,setMistakes]=useState(0);
 const [feedback,setFeedback]=useState<{correct:boolean;message:string}|null>(null);
 const [finished,setFinished]=useState(false);
 const [giftOpen,setGiftOpen]=useState(false);
 const c=interactiveWorldCases[game][caseIndex];
 const distinctTargets=Array.from(new Set(c.targets));
 const targets=shuffle(distinctTargets,caseIndex*53+game.length*7);
 const isTimeline=caseIndex===2;
 const done=isTimeline?timeline.length:Object.keys(placed).length;
 const timelineIndices=shuffle([0,1,2],game.length*15+17);
 function pickTimeline(i:number){if(timeline.includes(i)||finished)return;const expected=c.targets[timeline.length];if(c.correct[i]!==expected){setMistakes(n=>n+1);setFeedback({correct:false,message:'This is not the next step in the investigation. Check the stage order and try another evidence card.'});return}setTimeline(old=>[...old,i]);setFeedback({correct:true,message:'Correct sequencing: '+c.clues[i]+' belongs at '+expected+'.'});}
 const score=Math.max(0,Math.round(100*3/(3+mistakes)));
 const allDone=progress.completed.length===3;
 function choose(i:number){if(finished||placed[i])return;setSelected(i);setFeedback(null)}
 function put(target:string){
  if(selected===null||finished)return;
  const correct=c.correct[selected]===target;
  if(!correct){setMistakes(x=>x+1);setFeedback({correct:false,message:'This pairing is not supported by the scenario. Review the explanation and choose the relevant category.'});return}
  setPlaced(old=>({...old,[selected]:target}));
  setFeedback({correct:true,message:'Correct. '+c.clues[selected]+' is appropriately classified as '+target+'.'});
  setSelected(null);
 }
 function completeCase(){
  if(done!==3)return;
  const next={completed:Array.from(new Set([...progress.completed,caseIndex])),best:Math.max(progress.best,score)};
  store(game,next);setProgress(next);setFinished(true);setGiftOpen(false);
  if(next.completed.length===3)onPass();
 }
 function nextCase(){
  const id=[0,1,2].find(i=>!progress.completed.includes(i));
  if(id===undefined){onNext();return}
  setCaseIndex(id);setSelected(null);setPlaced({});setTimeline([]);setMistakes(0);setFeedback(null);setFinished(false);setGiftOpen(false);window.scrollTo(0,0);
 }
 function replay(){setSelected(null);setPlaced({});setTimeline([]);setMistakes(0);setFeedback(null);setFinished(false);setGiftOpen(false)}
 return <main className="narrow wcinteractive">
  <button className="back" type="button" onClick={onBack}>← Back to {worldNames[game]}</button>
  <span className="eyebrow">AMLVERSE • HANDS-ON EVIDENCE CHALLENGE</span>
  <h1 className="title">{worldNames[game]} — Interactive Cases</h1>
  <p className="lead">Study the fictional evidence, select a clue and assign it to the appropriate decision point. Every response requires an evidence-based classification, not a guess at a multiple-choice answer.</p>
  <div className="wcinteractiveprogress"><div><strong>{progress.completed.length}/3 cases completed</strong><span>Saved in this browser</span></div><div className="riskadvancedprogress"><div style={{width:(progress.completed.length/3*100)+'%'}}/></div></div>
  <div className="wcinteractivetabs" role="group" aria-label="Interactive case selector">{interactiveWorldCases[game].map((x,i)=><button key={i} type="button" className={caseIndex===i?'active':''} aria-current={caseIndex===i?'step':undefined} onClick={()=>{setCaseIndex(i);replay()}}><span>{progress.completed.includes(i)?'✓ ':'◈ '}{i+1}. {x.title}</span></button>)}</div>
  <section className="wcinteractivebrief"><div className="eyebrow">CASE {caseIndex+1} / 3</div><h2>{c.title}</h2><div className="wcinteractiveanalogy"><strong>💡 Understand the concept</strong><p>{c.analogy}</p></div><p>{c.instruction}</p></section>
  {!finished?<>
  {isTimeline?<div className="wcinteractivetimeline"><section><h3>Construct the investigation timeline</h3><p>Tap the evidence cards in their correct professional order. The cards are intentionally shuffled and each selection is checked before it is added.</p><div className="wcinteractivetimelinecards">{timelineIndices.map(i=><button key={i} type="button" disabled={timeline.includes(i)} onClick={()=>pickTimeline(i)} className={timeline.includes(i)?'assigned':''}><span>{timeline.includes(i)?'✓':'◈'}</span>{c.clues[i]}</button>)}</div></section><section><h3>Your investigation sequence · {timeline.length}/3</h3><div className="wcinteractivetimelinesteps">{c.targets.map((t,i)=><div key={i} className={timeline[i]!==undefined?'complete':''}><strong>{t}</strong><p>{timeline[i]!==undefined?c.clues[timeline[i]]:'Select the next evidence card'}</p></div>)}</div></section></div>:
  <div className="wcinteractiveworkshop">
    <section><h3>Step 1 — Select evidence</h3><p>Tap one card to examine its proper classification.</p>
      <div className="wcinteractiveclues">{c.clues.map((clue,i)=><button key={i} type="button" disabled={!!placed[i]} className={'wcinteractiveclue'+(selected===i?' selected':'')+(placed[i]?' assigned':'')} onClick={()=>choose(i)}><span className="wcinteractivecluenum">{placed[i]?'✓':'E'+(i+1)}</span><span>{clue}</span></button>)}</div>
    </section>
    <section><h3>Step 2 — Assign to a decision point</h3><p>Tap the correct category for your selected evidence card.</p>
      <div className="wcinteractivetargets">{targets.map(t=><button type="button" key={t} disabled={selected===null} onClick={()=>put(t)}><span>◈</span><strong>{t}</strong><small>{Object.values(placed).filter(x=>x===t).length} assigned</small></button>)}</div>
    </section>
  </div>}
  <div className="wcinteractivelog"><strong>Evidence notebook · {done}/3 assigned</strong>{isTimeline?timeline.map((i,order)=><div key={i}><span>{c.clues[i]}</span><b>→ {c.targets[order]}</b></div>):Object.entries(placed).map(([i,t])=><div key={i}><span>{c.clues[Number(i)]}</span><b>→ {t}</b></div>)}{done===0?<p>Select a clue and assign it to begin the case.</p>:null}</div>
  {feedback?<div role="status" className={'itracefeedback '+(feedback.correct?'right':'wrong')}><strong>{feedback.correct?'✓ Defensible classification':'Check the evidence'}</strong><p>{feedback.message}</p></div>:null}
  {done===3?<div className="nextstepbar"><span>✓ All three pieces of evidence have been classified.</span><button type="button" className="primary" onClick={completeCase}>Complete this case →</button></div>:<p className="wcinteractivehint">{isTimeline?"Tap the next event in the appropriate investigative order.":"Select the next evidence card above, then tap its destination."} Incorrect attempts do not block learning.</p>}
  </>:<section className="wcinteractivecomplete"><span aria-hidden="true">🏆</span><h2>Case completed!</h2><p>You classified all three evidence items. Your accuracy score for this run is {score}%.</p>
    {allDone?<><h3>🎊 All three interactive cases complete!</h3>{!giftOpen?<button className="primary" onClick={()=>setGiftOpen(true)}>🎁 Open interactive-learning gift</button>:<div className="wcinteractivegift"><strong>🏅 Applied Learning Investigator</strong><p>You have completed all three hands-on case exercises in {worldNames[game]}. This is an informal educational award.</p></div>}</>:null}
    <div className="nextstepbar"><span>{allDone?'Continue to the tutorial and game.':'The next interactive case is ready.'}</span><button type="button" className="primary" onClick={nextCase}>{allDone?'Continue to tutorial →':'Continue to next case →'}</button></div>
    <button className="secondary" onClick={replay}>Replay this case ↻</button>
  </section>}
  <div className="notice"><b>Fictional educational data only.</b> These classifications demonstrate analytical reasoning rather than prove guilt, regulatory breach, attribution or legal admissibility. Confirm current legal requirements and authoritative standards before professional use.</div>
 </main>;
}
