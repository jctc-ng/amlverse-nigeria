import {useMemo,useState} from 'react';
import type {DragEvent} from 'react';
import TutorialGuide from './TutorialGuide';
import WorldCompletion from './WorldCompletion';

type Category='verified'|'uncertain'|'action';
type Evidence={id:string;label:string;detail:string;category:Category;reason:string};
const evidence:Evidence[]=[
{id:'e1',label:'Transaction record',detail:'Synthetic bank statement lists five incoming transfers totalling ₦4,200,000 over four days.',category:'verified',reason:'The statement supports that these credits are recorded, not their ultimate origin or purpose.'},
{id:'e2',label:'Documented onward payment',detail:'The same account has a recorded ₦3,600,000 outward transfer to an unrelated company.',category:'verified',reason:'The transaction is recorded, but beneficial ownership and purpose still need checking.'},
{id:'e3',label:'Suspected hidden controller',detail:'An anonymous tip claims two companies are controlled by one person without supporting records.',category:'uncertain',reason:'An uncorroborated tip is a lead, not a substantiated beneficial ownership finding.'},
{id:'e4',label:'Fraud allegation',detail:'Social media comments allege the account holder committed a fraud, with no independently verified evidence.',category:'uncertain',reason:'Online allegations cannot be presented as established criminal findings.'},
{id:'e5',label:'Company record verification',detail:'Check applicable official corporate records and the supporting beneficial ownership information.',category:'action',reason:'This is a recommended verification step rather than an already established fact.'},
{id:'e6',label:'Authorised information request',detail:'Consider a documented and lawful request for relevant account and transaction records.',category:'action',reason:'Follow-up requests should rely on proper legal authority and documented case purpose.'}
];
const categories:{id:Category;title:string;icon:string;hint:string}[]=[
{id:'verified',title:'Documented finding',icon:'📑',hint:'Supported by the case file'},
{id:'uncertain',title:'Unverified lead',icon:'🔎',hint:'Requires corroboration'},
{id:'action',title:'Next-step recommendation',icon:'🛡️',hint:'Proposed lawful follow-up'}
];
const writing=[
{title:'ABSTRACT',question:'Which opening summary is supported by the file?',answers:['Records show unusual credit and debit activity requiring further analysis; ownership and purpose remain unverified.','The account holder has been proven to commit fraud.','Both companies are confirmed to share the same owner.'],right:0,reason:'The abstract should neutrally identify the scope, principal observations and limits.'},
{title:'FINDINGS',question:'Which finding is most defensible?',answers:['Five credits totalling ₦4,200,000 and one ₦3,600,000 debit are recorded in the fictional statement.','The entire ₦4,200,000 was necessarily proceeds of crime.','An anonymous allegation conclusively identifies the beneficial owner.'],right:0,reason:'Findings must distinguish documented transactional facts from unverified assertions.'},
{title:'INFERENCE',question:'Which analytical inference is appropriately qualified?',answers:['The transfer pattern may warrant further review, but the available evidence does not establish criminal intent or common ownership.','All activity was certainly fraudulent.','The debit automatically proves terrorist financing.'],right:0,reason:'An inference is a reasoned interpretation with uncertainty, not a declaration of guilt.'},
{title:'RECOMMENDATIONS',question:'What follow-up action fits an intelligence report?',answers:['Publicly identify the subject online.','Seek relevant records through authorised channels and verify the company relationships.','Freeze every related account without legal authority.'],right:1,reason:'Recommended actions should be proportionate, lawful and linked to identified information gaps.'}
] as const;
const source='https://www.fatf-gafi.org/en/topics/fatf-recommendations.html';
type Stage='brief'|'classify'|'compose'|'report';
export default function ReportWritingLab({onBack,onContinue}:{onBack:()=>void;onContinue:()=>void}){
 const [stage,setStage]=useState<Stage>('brief');
 const [placed,setPlaced]=useState<Record<string,Category>>({});
 const [selected,setSelected]=useState<string|null>(null);
 const [feedback,setFeedback]=useState('');
 const [errors,setErrors]=useState(0);
 const [part,setPart]=useState(0);
 const [choice,setChoice]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [correct,setCorrect]=useState(0);
 const [finished,setFinished]=useState(false);
 const [best,setBest]=useState(()=>{try{return Number(localStorage.getItem('amlverse-report-writing-best')||0)}catch{return 0}});
 const remaining=evidence.filter(e=>!placed[e.id]);
 const score=Math.max(1,60+correct*10-errors*2);
 const report=useMemo(()=>[
 'FINANCIAL INTELLIGENCE REPORT — EDUCATIONAL EXERCISE',
 'CASE REFERENCE: AMLVERSE-RPT-001 | ALL DATA SYNTHETIC',
 '',
 'ABSTRACT',
 'A fictional account statement shows five incoming transfers totalling NGN 4,200,000 over four days and a subsequent outgoing NGN 3,600,000 transfer to an unrelated company. The origin, purpose and beneficial ownership remain unverified.',
 '',
 'FINDINGS',
 '1. Five incoming credit entries total NGN 4,200,000 in the supplied synthetic statement.',
 '2. One debit entry of NGN 3,600,000 is recorded to an unrelated company.',
 '3. An anonymous tip and social media allegations were received but lack independent corroboration.',
 '4. No verified beneficial ownership or criminal-intent evidence is included in the exercise.',
 '',
 'INFERENCE',
 'The transaction pattern may warrant further review and verification. On its own, the available information does not establish common ownership, illicit origin, criminal intent or guilt.',
 '',
 'RECOMMENDATIONS',
 'Verify relevant corporate records and transaction context. Where appropriately authorised, request corroborating account and supporting information. Preserve case records and observe applicable dissemination and confidentiality requirements.',
 '',
 'LIMITATIONS',
 'This is a fictional educational example, not a real intelligence product. It deliberately contains incomplete records. Further investigation could support, refute or modify the preliminary assessment.'
 ].join('\n'),[]);
 function classify(id:string,category:Category){
  const card=evidence.find(e=>e.id===id);if(!card||placed[id])return;
  if(card.category!==category){setErrors(n=>n+1);setFeedback('Reconsider: '+card.reason);return;}
  setPlaced(p=>({...p,[id]:category}));setSelected(null);setFeedback('✓ Correct. '+card.reason);
 }
 function drop(e:DragEvent<HTMLButtonElement>,cat:Category){e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(id)classify(id,cat)}
 function check(){if(choice===null||checked)return;setChecked(true);if(choice===writing[part].right)setCorrect(n=>n+1);else setErrors(n=>n+1)}
 function next(){
  if(part<writing.length-1){setPart(n=>n+1);setChoice(null);setChecked(false);return;}
  setFinished(true);setStage('report');
  const high=Math.max(best,score);setBest(high);
  try{localStorage.setItem('amlverse-report-writing-best',String(high))}catch{}
 }
 function reset(){setStage('brief');setPlaced({});setSelected(null);setFeedback('');setErrors(0);setPart(0);setChoice(null);setChecked(false);setCorrect(0);setFinished(false)}
 function download(){const blob=new Blob([report],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='amlverse-fictional-intelligence-report.txt';link.click();URL.revokeObjectURL(url)}
 const current=writing[part];
 return <main className="narrow arcade reportlab">
 <button type="button" className="back" onClick={onBack}>← Back to learning room</button><span className="eyebrow">INTELLIGENCE REPORT-WRITING LAB • SYNTHETIC CASE</span><h1 className="title">Operation Clear Findings 📝</h1>
 <p className="lead">Separate verified facts, unconfirmed leads and recommendations. Then assemble a careful intelligence report without overclaiming.</p>
 <TutorialGuide game="reportwriting"/><WorldCompletion game="reportwriting" trigger={finished} onContinue={onContinue}/>
 <div className="arcadehud"><span>{stage==='classify'?Object.keys(placed).length+'/6 classified':stage==='compose'?'Report section '+(part+1)+'/4':stage==='report'?'Report complete':'Case briefing'}</span><span>🏆 Best {best}</span><button type="button" onClick={reset}>↻ Restart</button></div>
 {stage==='brief'?<section className="reportbrief"><span className="eyebrow">CASE FILE: AMLVERSE-RPT-001</span><h2>The facts are incomplete. Your wording matters.</h2><p>A fictional institution has supplied a small statement extract, an anonymous tip and unverified online claims. As an intelligence analyst, your task is to document what the evidence actually shows and propose appropriate verification.</p><div className="reportfacts"><div><small>Recorded incoming funds</small><strong>₦4,200,000</strong><span>Five credits / four days</span></div><div><small>Recorded outward transfer</small><strong>₦3,600,000</strong><span>One debit / unrelated company</span></div><div><small>Unverified allegations</small><strong>2 leads</strong><span>Identity and conduct not established</span></div></div><button className="primary" type="button" onClick={()=>setStage('classify')}>Open evidence board →</button></section>
 :stage==='classify'?<><div className="arcadeinstruction"><strong>ROUND 1 — EVIDENCE TRIAGE</strong><p>Tap a clue then choose its category, or drag-and-drop on a computer.</p><div className="arcadeprogress"><div style={{width:Object.keys(placed).length/evidence.length*100+'%'}}/></div></div><div className="arcadebins">{categories.map(c=><button type="button" key={c.id} className={'arcadebin'+(selected?' dropready':'')} onClick={()=>selected?classify(selected,c.id):setFeedback('Select an evidence card first.')} onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,c.id)}><span className="arcadeemoji">{c.icon}</span><b>{c.title}</b><small>{c.hint}</small><span className="arcadecount">{Object.values(placed).filter(v=>v===c.id).length} clues</span></button>)}</div>{feedback?<div className="arcadefeedback" role="status">{feedback}</div>:null}<div className="arcadepile"><h2>📂 Evidence cards <small>({remaining.length} remaining)</small></h2><div className="arcadecards">{remaining.map(e=><button type="button" draggable key={e.id} className={'arcadecard'+(selected===e.id?' selected':'')} onClick={()=>{setSelected(e.id);setFeedback('Choose a category above.')}} onDragStart={ev=>ev.dataTransfer.setData('text/plain',e.id)}><strong>{e.label}</strong><span>{e.detail}</span><small>{selected===e.id?'✓ SELECTED — CHOOSE CATEGORY':'⠿ DRAG OR TAP'}</small></button>)}</div></div>{!remaining.length?<div className="arcadefinish"><strong>✓ Evidence classified</strong><p>Now choose defensible wording for each section of your report.</p><button type="button" className="primary" onClick={()=>setStage('compose')}>Start report drafting →</button></div>:null}</>
 :stage==='compose'?<section className="reportdraft"><span className="eyebrow">ROUND 2 — ANALYTICAL WRITING</span><h2>{current.title}</h2><p>{current.question}</p><div className="choices">{current.answers.map((a,i)=><button key={i} type="button" disabled={checked} onClick={()=>setChoice(i)} className={'choice'+(choice===i?' picked':'')+(checked&&current.right===i?' correct':'')}><span className="letter">{String.fromCharCode(65+i)}</span>{a}</button>)}</div>{checked?<div className="feedback" role="status"><strong>{choice===current.right?'✓ Professional wording':'Review the stronger approach'}</strong><p>{current.reason}</p></div>:null}<div className="actions">{checked?<button type="button" className="primary" onClick={next}>{part===writing.length-1?'Generate report':'Next section'} →</button>:<button type="button" className="primary" disabled={choice===null} onClick={check}>Check wording →</button>}</div></section>
 :<section className="reportdraft"><div className="arcadewin"><span aria-hidden="true">🏅</span><h2>Report-writing mission complete!</h2><p>You classified six evidence items and selected {correct} of four strong report sections.</p><strong>{score}/100 points</strong></div><h2>Generated training intelligence note</h2><p className="chainnote">The note below is a standard educational model based on fictional facts. It does not assert that all chosen answers were correct and is not suitable for operational submission.</p><pre className="trace-report">{report}</pre><div className="actions"><button type="button" className="primary" onClick={download}>↓ Download fictional report (.txt)</button><button type="button" className="secondary" onClick={reset}>Play again ↻</button><button type="button" className="secondary" onClick={onBack}>Return to learning</button></div></section>}
 {finished?<div className="nextstepbar" role="navigation" aria-label="Continue learning"><span>✓ Mission finished. Your next learning world is ready.</span><button type="button" className="primary" onClick={onContinue}>Continue to next world →</button></div>:null}
 <div className="notice"><b>Training disclaimer:</b> Fictional data only. Financial intelligence is not a judicial finding and must not be treated as proof of guilt. This lab does not accept uploaded statements, personal data or real FIU records. <a href="https://www.fatf-gafi.org/en/topics/fatf-recommendations.html" target="_blank" rel="noopener noreferrer">FATF Recommendations ↗</a></div>
 </main>;
}
