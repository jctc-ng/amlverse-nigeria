import {useState} from 'react';
import {traceMissions} from './InteractiveTraceData';
import type {TraceMission,TraceEdge} from './InteractiveTraceData';

const KEY='amlverse-interactive-tracing-v1';
export type InteractiveTraceProgress={completed:string[];best:Record<string,number>};
const initial=():InteractiveTraceProgress=>({completed:[],best:{}});
export function readInteractiveTraceProgress():InteractiveTraceProgress{
 try{const x=JSON.parse(localStorage.getItem(KEY)||'null') as Partial<InteractiveTraceProgress>|null;
 return {completed:Array.isArray(x?.completed)?x.completed.filter((a):a is string=>typeof a==='string'&&traceMissions.some(m=>m.id===a)):[],best:x?.best&&typeof x.best==='object'?x.best:{}};}catch{return initial()}
}
function useProgress(){
 const [progress,setProgress]=useState<InteractiveTraceProgress>(readInteractiveTraceProgress);
 function save(fn:(old:InteractiveTraceProgress)=>InteractiveTraceProgress){setProgress(old=>{const next=fn(old);try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}return next})}
 return {progress,save};
}
function Graph({mission,selected,onPick}:{mission:TraceMission;selected:string[];onPick:(type:'node'|'edge',id:string)=>void}){
 const byId=new Map(mission.nodes.map(n=>[n.id,n]));
 return <div className="itracegraphpanel">
 <svg viewBox="0 0 710 345" className="itracesvg" role="group" aria-label={'Interactive transaction graph for '+mission.title}>
  <defs><marker id="itrace-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7Z" fill="#7fdcbf"/></marker></defs>
  {mission.edges.map(e=>{
   const a=byId.get(e.from)!,b=byId.get(e.to)!;
   const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1,nx=dx/length,ny=dy/length;
   const x1=a.x+nx*47,y1=a.y+ny*35,x2=b.x-nx*49,y2=b.y-ny*35;
   const mx=(x1+x2)/2,my=(y1+y2)/2;
   const chosen=selected.includes('edge:'+e.id);
   return <g key={e.id} tabIndex={0} role="button" aria-label={'Select transaction '+e.id+', '+e.from+' to '+e.to+', '+e.amount+', '+e.status} aria-pressed={chosen} className="itraceedgehit" onClick={()=>onPick('edge',e.id)} onKeyDown={ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();onPick('edge',e.id)}}}>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="25"/>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={chosen?'#f9da8b':e.status==='confirmed'?'#7fdcbf':'#d9a66c'} strokeDasharray={e.status==='provisional'?'7 5':undefined} strokeWidth={chosen?5:3} markerEnd={e.status==='confirmed'?'url(#itrace-arrow)':undefined} pointerEvents="none"/>
    <rect x={mx-42} y={my-15} width="84" height="28" rx="9" fill={chosen?'#58603b':'#1b4053'} stroke={chosen?'#f9da8b':'#4d7e81'} pointerEvents="none"/>
    <text x={mx} y={my+3} fontSize="12" fontWeight="bold" fill="#fff" textAnchor="middle" pointerEvents="none">{e.id} · {e.amount.length>8?e.amount.slice(0,7)+'…':e.amount}</text>
   </g>;
  })}
  {mission.nodes.map(n=>{
   const chosen=selected.includes('node:'+n.id);
   return <g key={n.id} tabIndex={0} role="button" aria-label={'Select node '+n.label+', '+n.kind+', '+n.detail} aria-pressed={chosen} className="itracenodehit" onClick={()=>onPick('node',n.id)} onKeyDown={ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();onPick('node',n.id)}}}>
    <rect x={n.x-49} y={n.y-34} width="98" height="68" rx="12" fill={chosen?'#4a684a':n.kind==='service'?'#276054':'#1d455c'} stroke={chosen?'#ffdd8f':'#77dcca'} strokeWidth={chosen?3:2}/>
    <text x={n.x} y={n.y-3} fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle" pointerEvents="none">{n.label.length>12?n.label.slice(0,11)+'…':n.label}</text>
    <text x={n.x} y={n.y+17} fontSize="10" fill="#d0ebe9" textAnchor="middle" pointerEvents="none">{n.kind.toUpperCase()}</text>
   </g>;
  })}
 </svg>
 <div className="itracelegend"><span>━ Confirmed transfer</span><span>┄ Provisional relationship</span><span>● Gold = selected evidence</span></div>
 </div>;
}
export default function InteractiveTracingLab({onBack,onAdvance}:{onBack:()=>void;onAdvance:()=>void}){
 const {progress,save}=useProgress();
 const [missionIndex,setMissionIndex]=useState(0);
 const [step,setStep]=useState(0);
 const [selected,setSelected]=useState<string[]>([]);
 const [last,setLast]=useState<{correct:boolean;message:string}|null>(null);
 const [mistakes,setMistakes]=useState(0);
 const [inspection,setInspection]=useState<string|null>(null);
 const [completedNow,setCompletedNow]=useState(false);
 const [awardOpen,setAwardOpen]=useState(false);
 const mission=traceMissions[missionIndex],action=mission.actions[step];
 const successRate=Math.max(0,Math.round(mission.actions.length/(mission.actions.length+mistakes)*100));
 const allCompleted=traceMissions.every(m=>progress.completed.includes(m.id));
 function begin(i:number){
  setMissionIndex(i);setStep(0);setSelected([]);setLast(null);setMistakes(0);setInspection(null);setCompletedNow(false);setAwardOpen(false);window.scrollTo(0,0);
 }
 function inspect(type:'node'|'edge',id:string){
  const item=type==='node'?mission.nodes.find(n=>n.id===id):mission.edges.find(e=>e.id===id);
  setInspection(item?type==='node'?(item as TraceMission['nodes'][number]).detail:(item as TraceEdge).detail:null);
  const ok=action.type===type&&action.target===id;
  if(ok){setSelected(a=>[...a,type+':'+id]);setLast({correct:true,message:action.explanation});}
  else{setMistakes(n=>n+1);setLast({correct:false,message:'This selection does not answer the current question. Inspect its evidence details and try again.'});}
 }
 function next(){
  if(!last?.correct)return;
  if(step<mission.actions.length-1){setStep(i=>i+1);setLast(null);setInspection(null);return;}
  const s=successRate;
  save(prev=>({...prev,completed:prev.completed.includes(mission.id)?prev.completed:[...prev.completed,mission.id],best:{...prev.best,[mission.id]:Math.max(prev.best[mission.id]||0,s)}}));
  setCompletedNow(true);setAwardOpen(false);
 }
 function advance(){
  if(missionIndex<traceMissions.length-1){begin(missionIndex+1);return;}
  onAdvance();
 }
 function reset(){begin(missionIndex)}
 return <main className="itracelab">
  <div className="itracetop"><button className="back" onClick={onBack}>← Virtual Asset Academy</button><span className="eyebrow">INTERACTIVE INVESTIGATION GRAPH LAB</span></div>
  <h1 className="title">Trace the Funds — Interactive Missions 🕸️</h1>
  <p className="lead">Select wallets and individual transaction edges yourself. Each case challenges your ability to follow evidence without assuming identities or inventing fund flows.</p>
  <div className="itracemissiontabs" role="group" aria-label="Choose an investigation case">
   {traceMissions.map((m,i)=><button key={m.id} type="button" className={missionIndex===i?'active':''} onClick={()=>begin(i)} aria-current={missionIndex===i?'step':undefined}><span>{progress.completed.includes(m.id)?'✓':'◈'} {i+1}</span><small>{m.level}</small></button>)}
  </div>
  <section className="itracebrief"><span className="eyebrow">{mission.id} · {mission.level}</span><h2>{mission.title}</h2><p>{mission.brief}</p><div className="itraceanalogy"><strong>💡 Analogy</strong><p>{mission.analogy}</p></div><div className="itraceobjective"><strong>Professional learning objective</strong><p>{mission.learningGoal}</p></div></section>
  <div className="itracehud"><span>{completedNow?'Mission complete':'Evidence action '+(step+1)+' / '+mission.actions.length}</span><span>Incorrect attempts: {mistakes}</span><button type="button" onClick={reset}>↻ Restart case</button></div>
  <div className="itraceprogress"><div style={{width:((completedNow?mission.actions.length:step)/mission.actions.length*100)+'%'}}/></div>
  <Graph mission={mission} selected={selected} onPick={inspect}/>
  <section className="itraceinspector"><h3>Evidence inspector — tap nodes or edges</h3><p>Graph selection also works through these larger touch-friendly controls.</p>
   <div className="itraceevidencegrid"><div><h4>Wallet and service nodes</h4>{mission.nodes.map(n=><button key={n.id} type="button" className={'itraceevidenceitem'+(selected.includes('node:'+n.id)?' selected':'')} onClick={()=>inspect('node',n.id)}><strong>{n.label}</strong><span>{n.kind}</span></button>)}</div>
   <div><h4>Transaction edges</h4>{mission.edges.map(e=><button key={e.id} type="button" className={'itraceevidenceitem'+(selected.includes('edge:'+e.id)?' selected':'')} onClick={()=>inspect('edge',e.id)}><strong>{e.id}: {e.from} → {e.to}</strong><span>{e.amount} · {e.status}</span></button>)}</div></div>
  </section>
  {inspection?<div className="itracedetail" role="status"><strong>Selected evidence:</strong> {inspection}</div>:null}
  {!completedNow?<section className="itracequestion"><span className="eyebrow">YOUR NEXT INVESTIGATIVE ACTION</span><h2>{action.instruction}</h2><p>Choose the correct {action.type==='edge'?'transaction edge':'wallet or service node'} above. Incorrect selections do not prevent you from trying again.</p>
   {last?<div className={'itracefeedback '+(last.correct?'right':'wrong')} role="status"><strong>{last.correct?'✓ Correct evidence selected':'Not the requested evidence'}</strong><p>{last.message}</p></div>:null}
   <details><summary>Need a hint?</summary><p>{action.hint}</p></details>
   {last?.correct?<div className="nextstepbar"><span>✓ Correct. Your next step is ready.</span><button type="button" className="primary" onClick={next}>{step===mission.actions.length-1?'Finish mission →':'Continue to next evidence →'}</button></div>:null}
  </section>:
  <section className="itracecompleted"><span aria-hidden="true">🏆</span><h2>Mission successfully traced!</h2><strong>Accuracy score: {successRate}%</strong><p>{mission.debrief}</p><p>{progress.completed.length} / {traceMissions.length} interactive cases completed. Personal best for this case: {Math.max(successRate,progress.best[mission.id]||0)}%.</p>
   <div className="itraceactions"><button className="secondary" onClick={reset}>Replay mission ↻</button><button className="primary" onClick={advance}>{missionIndex===traceMissions.length-1?'Continue to course →':'Continue to next graph →'}</button></div>
   {(allCompleted||progress.completed.length===traceMissions.length)&&<div className="itraceaward"><h3>🎁 Interactive Graph Investigator</h3>{!awardOpen?<button type="button" onClick={()=>setAwardOpen(true)} className="primary">Open your achievement gift 🎁</button>:<div role="status"><strong>🏅 Interactive Graph Investigator</strong><p>You completed all six fictional tracing missions. This is an educational achievement, not a professional certification.</p></div>}</div>}
  </section>}
  <div className="notice"><b>Educational and fictional.</b> Wallets, hashes, graph links and service labels are synthetic. Graph connections are not proof of common ownership, illicit purpose or an exchange customer's identity. Confirm network and chain context and use legally authorised processes for actual cases.</div>
 </main>;
}
