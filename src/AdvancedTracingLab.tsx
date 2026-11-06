import {useMemo,useState} from 'react';
import TutorialGuide from './TutorialGuide';
import WorldCompletion from './WorldCompletion';

type NodeId='A'|'B'|'C'|'D'|'E'|'F';
type Edge={id:string;from:NodeId;to:NodeId;units:number;hash:string;time:string;note:string};
const nodes:{id:NodeId;label:string;x:number;y:number;type:string}[]=[
{id:'A',label:'Origin A',x:80,y:158,type:'Source'},
{id:'B',label:'Wallet B',x:242,y:158,type:'Intermediary'},
{id:'C',label:'Wallet C',x:405,y:88,type:'Intermediary'},
{id:'D',label:'Wallet D',x:405,y:255,type:'Side branch'},
{id:'E',label:'Deposit E',x:580,y:88,type:'Exchange lead'},
{id:'F',label:'Wallet F',x:580,y:255,type:'Unrelated lead'}
];
const edges:Edge[]=[
{id:'T1',from:'A',to:'B',units:12,hash:'SIM-TX-001',time:'09:00',note:'Recorded transfer. No identity established.'},
{id:'T2',from:'B',to:'C',units:8,hash:'SIM-TX-002',time:'09:16',note:'Second confirmed transfer in the target route.'},
{id:'T3',from:'B',to:'D',units:3,hash:'SIM-TX-003',time:'09:18',note:'Separate branch; not automatically part of the target route.'},
{id:'T4',from:'C',to:'E',units:7.5,hash:'SIM-TX-004',time:'09:28',note:'Exchange-associated deposit lead, subject to attribution checks.'},
{id:'T5',from:'D',to:'F',units:2.5,hash:'SIM-TX-005',time:'09:41',note:'Another branch with no verified link to the exchange.'}
];
const route=['T1','T2','T4'];
const confidenceItems=[
{prompt:'The synthetic ledger shows a transfer from Wallet B to Wallet C.',answer:'high',why:'High confidence in the recorded transfer itself within the fictional, confirmed data.'},
{prompt:'Deposit E is labelled exchange-associated by one unverified third-party source.',answer:'medium',why:'An unverified service label is a provisional lead requiring independent corroboration, not a high-confidence identity finding.'},
{prompt:'The account owner at the exchange is the suspect named in a report, without provider records.',answer:'low',why:'No reliable customer attribution is present; the personal identification claim is unsupported.'}
] as const;
const decisions=[
{prompt:'Which evidence package would best support an authorised inquiry to the exchange?',options:['Wallet label alone','Documented chain/network, transaction hashes, times, asset and rationale','A screenshot without source information'],right:1,why:'A documented, reproducible trace and lawful basis make a stronger request; the service provider must verify any customer association.'},
{prompt:'Can the analyst state the complete 12-unit origin amount arrived at Deposit E?',options:['Yes, because it started at A','No: this path shows 7.5 units at E; other activity and transaction models need accounting','Yes, because an exchange label proves all upstream ownership'],right:1,why:'The depicted path shows 12 to B, 8 to C and 7.5 to E. Values not shown on that path cannot be assigned without evidence.'},
{prompt:'What is a suitable intelligence-report inference?',options:['The observed path supports a lead for further authorised verification, with attribution limitations','All wallet owners are the same person','The exchange client is conclusively guilty'],right:0,why:'A reasoned, qualified inference documents observations, attribution uncertainty and recommended verification.'}
] as const;
const nMap=Object.fromEntries(nodes.map(n=>[n.id,n])) as Record<NodeId,(typeof nodes)[number]>;
type Phase='brief'|'trace'|'confidence'|'decisions'|'report';
type Confidence='high'|'medium'|'low';
const source='https://www.fatf-gafi.org/en/topics/virtual-assets.html';
export default function AdvancedTracingLab({onBack,onContinue}:{onBack:()=>void;onContinue:()=>void}){
 const [phase,setPhase]=useState<Phase>('brief');
 const [chosen,setChosen]=useState<string[]>([]);
 const [focused,setFocused]=useState<string|null>(null);
 const [message,setMessage]=useState('');
 const [errors,setErrors]=useState(0);
 const [confidence,setConfidence]=useState<Record<number,Confidence>>({});
 const [decisionIndex,setDecisionIndex]=useState(0);
 const [picked,setPicked]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [rightCount,setRightCount]=useState(0);
 const [reportReady,setReportReady]=useState(false);
 const [best,setBest]=useState(()=>{try{return Number(localStorage.getItem('amlverse-advanced-trace-best')||0)}catch{return 0}});
 const selectedEdge=edges.find(e=>e.id===focused);
 const score=Math.max(1,30+Object.entries(confidence).filter(([key,v])=>confidenceItems[Number(key)]?.answer===v).length*10+rightCount*15-errors*3);
 const complete=chosen.length===route.length;
 const report=useMemo(()=>[
 'TRAINING INTELLIGENCE NOTE — FICTIONAL EXERCISE',
 'Case: Operation Multi-Hop | Network: synthetic demonstration ledger',
 '',
 'ABSTRACT',
 'A review of a fictional transaction graph identified a sequence of three recorded transfers from Origin A through Wallets B and C to exchange-associated Deposit E.',
 '',
 'FINDINGS',
 '1. SIM-TX-001: A → B, 12 units at 09:00.',
 '2. SIM-TX-002: B → C, 8 units at 09:16.',
 '3. SIM-TX-004: C → E, 7.5 units at 09:28.',
 '4. SIM-TX-003 and SIM-TX-005 illustrate a separate branch; no evidence establishes that it reached Deposit E.',
 '5. Exchange association is a preliminary service attribution. No underlying customer identity is verified in this synthetic case.',
 '',
 'INFERENCE',
 'The recorded route supports a potential exchange-touchpoint lead, not a conclusion about beneficial ownership, the identity of a wallet controller, or criminal conduct.',
 '',
 'RECOMMENDED NEXT STEPS',
 'Preserve transaction identifiers, network, asset, timestamps and attribution sources; seek further data through authorised channels as permitted by law; assess alternative explanations and any additional transactions.',
 '',
 'LIMITATIONS',
 'Synthetic training data only. The numerical values do not reconcile all possible fees, balances or transaction models, and should not be interpreted as real-world blockchain evidence.'
 ].join('\n'),[]);
 function pickEdge(id:string){
  setFocused(id);
  if(complete)return;
  if(chosen.includes(id)){setMessage('Already selected. Follow the remaining route to Deposit E.');return;}
  const expected=route[chosen.length];
  if(id!==expected){setErrors(n=>n+1);setMessage('This edge does not continue the target route. Check the source, destination and next hop.');return;}
  const edge=edges.find(x=>x.id===id)!;
  setChosen(p=>[...p,id]);
  setMessage('✓ '+edge.hash+' recorded: '+edge.from+' → '+edge.to+' · '+edge.units+' units. '+edge.note);
 }
 function nextDecision(){
  if(decisionIndex<decisions.length-1){setDecisionIndex(n=>n+1);setPicked(null);setChecked(false);return;}
  setReportReady(true);setPhase('report');
  const highest=Math.max(best,score);setBest(highest);
  try{localStorage.setItem('amlverse-advanced-trace-best',String(highest))}catch{}
 }
 function reset(){setPhase('brief');setChosen([]);setFocused(null);setMessage('');setErrors(0);setConfidence({});setDecisionIndex(0);setPicked(null);setChecked(false);setRightCount(0);setReportReady(false)}
 function copyReport(){if(navigator.clipboard?.writeText){void navigator.clipboard.writeText(report).then(()=>setMessage('Report copied to clipboard.')).catch(()=>setMessage('Copy unavailable: select and copy the report manually.'));}else{setMessage('Select and copy the report manually.');}}
 function downloadReport(){const blob=new Blob([report],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='amlverse-fictional-tracing-report.txt';link.click();URL.revokeObjectURL(url)}
 const current=decisions[decisionIndex];
 return <main className="narrow advancedtrace">
 <button type="button" className="back" onClick={onBack}>← Back to learning room</button>
 <span className="eyebrow">ADVANCED CRYPTOCURRENCY TRACING SIMULATOR</span><h1 className="title">Operation Multi-Hop 🕸️</h1><p className="lead">Follow a fictional transaction network, grade attribution evidence and compile a responsible financial intelligence note.</p>
 <TutorialGuide game="advancedtrace"/>
 <WorldCompletion game="advancedtrace" trigger={reportReady} onContinue={onContinue}/>
 <div className="arcadehud"><span>{phase==='trace'?'🔎 '+chosen.length+'/3 target hops':phase==='confidence'?'🧠 '+Object.keys(confidence).length+'/3 confidence calls':phase==='decisions'?'📋 Decision '+(decisionIndex+1)+'/3':phase==='report'?'📄 Case report ready':'📂 Case briefing'}</span><span>🏆 Best {best}</span><button type="button" onClick={reset}>↻ Restart</button></div>
 {phase==='brief'?<section className="chaincase"><span className="eyebrow">CASE BRIEFING</span><h2>Can you trace a multi-hop route without overclaiming?</h2><p>This case presents a synthetic ledger with a fork: one branch approaches an exchange deposit lead and the other does not. Click the correct edges in order, beginning at Origin A, then assess the evidence and write a careful inference.</p><p className="chainnote">These wallet IDs, times, transaction references and amounts are fabricated solely for training. No real blockchain or exchange is contacted.</p><button type="button" className="primary" onClick={()=>setPhase('trace')}>Start interactive graph →</button></section>:
 phase==='trace'?<><section className="advancedgraph"><span className="eyebrow">ROUND 1 — FOLLOW THE TARGET FLOW</span><h2>Select each transaction in order from Origin A to Deposit E</h2><p>Tap a transaction arrow on the graph or its button below. The graph contains an unrelated branch.</p>
 <svg viewBox="0 0 665 340" role="img" aria-label="Interactive fictional graph. Nodes A to B, B to C, B to D, C to E, D to F. Use transaction buttons below to select edges." className="trace-svg">
 <defs><marker id="trace-arrow" markerWidth="6" markerHeight="6" refX="5.5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="#88dfcb"/></marker></defs>
 {edges.map(e=>{const a=nMap[e.from],b=nMap[e.to];const marked=chosen.includes(e.id);const x1=a.x+34,x2=b.x-36,y1=a.y,y2=b.y;return <g key={e.id} role="button" tabIndex={0} aria-label={"Select "+e.id+" from "+e.from+" to "+e.to} onClick={()=>pickEdge(e.id)} onKeyDown={ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();pickEdge(e.id)}}} style={{cursor:"pointer"}}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={marked?'#f7ce72':'#88dfcb'} strokeWidth={marked?5:3} markerEnd="url(#trace-arrow)"/><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth="23"/><circle cx={(x1+x2)/2} cy={(y1+y2)/2} r="14" fill={marked?'#a9752c':'#22506a'}/><text x={(x1+x2)/2} y={(y1+y2)/2+4} textAnchor="middle" fontSize="11" fill="#fff">{e.id}</text></g>})}
 {nodes.map(n=><g key={n.id}><circle cx={n.x} cy={n.y} r="35" fill={n.id==='E'?'#326b62':'#243d60'} stroke="#91e8d4" strokeWidth="2"/><text x={n.x} y={n.y+5} textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="17">{n.id}</text><text x={n.x} y={n.y+53} textAnchor="middle" fill="#b3e3dc" fontSize="12">{n.label}</text></g>)}</svg>
 <div className="traceedges">{edges.map(e=><button key={e.id} type="button" aria-pressed={chosen.includes(e.id)} className={'traceedge'+(chosen.includes(e.id)?' traced':'')} onClick={()=>pickEdge(e.id)}><strong>{e.id}</strong><span>{e.from} → {e.to}</span><small>{e.units} units · {e.time}</small></button>)}</div>
 {selectedEdge?<div className="chainnote"><b>Inspect {selectedEdge.hash}:</b> {selectedEdge.note}</div>:null}
 {message?<div className="arcadefeedback" role="status">{message}</div>:null}
 {complete?<div className="arcadefinish"><strong>✓ Target route traced: A → B → C → E</strong><p>You followed three transfers, while recognising the unrelated branch.</p><button type="button" className="primary" onClick={()=>setPhase('confidence')}>Assess attribution evidence →</button></div>:null}
 </section></>:
 phase==='confidence'?<section className="advancedgraph"><span className="eyebrow">ROUND 2 — CONFIDENCE LAB</span><h2>How strongly does the evidence support each claim?</h2><p>High, medium or low describes support for the exact statement, not the seriousness of an allegation.</p>
 {confidenceItems.map((c,i)=><div className="confidenceitem" key={i}><h3>{i+1}. {c.prompt}</h3><div className="confchoices">{(['high','medium','low'] as const).map(v=><button key={v} type="button" disabled={confidence[i]!==undefined} className={confidence[i]===v?'active':''} onClick={()=>{setConfidence(prev=>({...prev,[i]:v}));if(v!==c.answer)setErrors(n=>n+1)}}>{v[0].toUpperCase()+v.slice(1)} confidence</button>)}</div>{confidence[i]!==undefined?<p className="chainnote" role="status">{confidence[i]===c.answer?'✓ Reasonable assessment. ':'Review this distinction. '}{c.why}</p>:null}</div>)}
 {Object.keys(confidence).length===confidenceItems.length?<div className="actions"><button type="button" className="primary" onClick={()=>setPhase('decisions')}>Continue to analyst decisions →</button></div>:null}
 </section>:
 phase==='decisions'?<section className="advancedgraph"><span className="eyebrow">ROUND 3 — ANALYST DECISIONS</span><h2>{current.prompt}</h2><div className="choices">{current.options.map((o,i)=><button key={i} type="button" disabled={checked} onClick={()=>setPicked(i)} className={'choice'+(picked===i?' picked':'')+(checked&&current.right===i?' correct':'')}><span className="letter">{String.fromCharCode(65+i)}</span>{o}</button>)}</div>{checked?<div className="feedback" role="status"><strong>{picked===current.right?'✓ Evidence-based decision!':'Learning opportunity'}</strong><p>{current.why}</p></div>:null}<div className="actions">{checked?<button className="primary" onClick={nextDecision}>{decisionIndex===decisions.length-1?'Generate report →':'Next decision →'}</button>:<button className="primary" disabled={picked===null} onClick={()=>{setChecked(true);if(picked===current.right)setRightCount(n=>n+1);else setErrors(n=>n+1)}}>Check decision →</button>}</div></section>:
 <section className="advancedgraph"><span className="eyebrow">MISSION COMPLETE</span><div className="arcadewin"><span aria-hidden="true">🏆</span><h2>Analyst report ready!</h2><strong>{score}/105 points</strong><p>You traced three connected transactions, examined attribution confidence and completed the intelligence decision round.</p></div><h2>Your fictional intelligence note</h2><pre className="trace-report">{report}</pre>{message?<div className="arcadefeedback" role="status">{message}</div>:null}<div className="actions"><button type="button" className="primary" onClick={downloadReport}>↓ Download report (.txt)</button><button type="button" className="secondary" onClick={copyReport}>Copy report</button><button type="button" className="secondary" onClick={reset}>Replay mission</button></div></section>}
 {reportReady?<div className="nextstepbar" role="navigation" aria-label="Continue learning"><span>✓ Mission finished. Your next learning world is ready.</span><button type="button" className="primary" onClick={onContinue}>Continue to next world →</button></div>:null}
 <div className="notice"><b>Training only.</b> No real wallets, transaction hashes, case files or intelligence data are processed. This example uses an intentionally simplified account-style graph; amounts are not a full reconciliation, nor proof of common ownership. <a href={source} target="_blank" rel="noopener noreferrer">FATF Virtual Assets ↗</a></div>
 </main>;
}
