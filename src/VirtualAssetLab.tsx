import {useState} from 'react';
import type {DragEvent} from 'react';
import TutorialGuide from './TutorialGuide';
import WorldCompletion from './WorldCompletion';

type Type='onchain'|'exchange'|'caution';
type Evidence={id:string;title:string;detail:string;type:Type;why:string};
const pieces:Evidence[]=[
{id:'a',title:'Transaction hash TX-A1',detail:'A synthetic confirmed transaction records a transfer of 12 units from WAL-A to WAL-B.',type:'onchain',why:'A transaction identifier locates a specific recorded blockchain transaction; it does not identify the human sender.'},
{id:'b',title:'Second transfer TX-B2',detail:'A later synthetic confirmed transaction records 9 units leaving WAL-B for WAL-C.',type:'onchain',why:'The transaction record shows a transfer along the observed route, not proof of who controls the address.'},
{id:'c',title:'VASP deposit reference',detail:'An authorised inquiry identifies WAL-C as a deposit address associated with a fictional exchange.',type:'exchange',why:'A service-provider deposit attribution is a useful lead, but the customer behind it requires corroboration.'},
{id:'d',title:'Exchange customer records',detail:'Investigators consider a lawful request for KYC, deposit identifiers and account records from the exchange.',type:'exchange',why:'A properly authorised request may help relate a deposit to an identified customer; disclosure remains subject to law.'},
{id:'e',title:'Shared-address misconception',detail:'A report claims all transfers to an exchange-controlled deposit address belong to the same person.',type:'caution',why:'Hosted addresses, omnibus wallets and service workflows can break simplistic address-to-person assumptions.'},
{id:'f',title:'A mixing-service indicator',detail:'A label suggests a privacy service was used, with no corroborating context.',type:'caution',why:'A service label or privacy pattern is a lead, not conclusive evidence of an offence or user identity.'}
];
const types:{id:Type;title:string;emoji:string;hint:string}[]=[
{id:'onchain',title:'On-chain record',emoji:'🔗',hint:'Transaction history visible on a ledger'},
{id:'exchange',title:'Exchange lead',emoji:'🏦',hint:'Provider attribution or lawful inquiry'},
{id:'caution',title:'Interpret carefully',emoji:'⚠️',hint:'Uncertainty and attribution limits'}
];
const questions=[
{prompt:'Transaction TX-A1 moves 12 units from WAL-A to WAL-B. What is established?',options:['A ledger record shows a transfer between these synthetic addresses.','The identity and criminal guilt of the owner of WAL-B are proven.','Every later transfer belongs to the same person.'],right:0,why:'Public ledger records can show flows; identifying people requires independent, reliable evidence.'},
{prompt:'WAL-B later sends 9 units to WAL-C. WAL-C is associated with an exchange. What is the sensible next step?',options:['Publish a customer accusation immediately.','Document the transactions and consider authorised exchange data requests.','Assume the entire exchange treasury belongs to the subject.'],right:1,why:'Document hash, asset, network, time and address attribution; seek account records through lawful processes.'},
{prompt:'An analyst sees a privacy-service label. What conclusion is appropriate?',options:['The label proves terrorist financing.','Tracing is impossible and the investigation must end.','Treat the label as a lead and evaluate limitations, alternative explanations and corroboration.'],right:2,why:'Indicators and labels must be interpreted in context. A privacy feature alone does not establish misconduct.'}
];
const path=[{id:'WAL-A',label:'Origin wallet',amount:'12 units',explanation:'Synthetic point of origin'},{id:'WAL-B',label:'Intermediary wallet',amount:'9 units onward',explanation:'Additional activity may exist'},{id:'WAL-C',label:'Exchange deposit lead',amount:'Provider inquiry',explanation:'Customer link unverified'}];
type Stage='intro'|'map'|'sort'|'decide'|'win';
export default function VirtualAssetLab({onBack,onContinue}:{onBack:()=>void;onContinue:()=>void}){
 const [stage,setStage]=useState<Stage>('intro');
 const [inspectedWallet,setInspectedWallet]=useState<string|null>(null);
 const [placed,setPlaced]=useState<Record<string,Type>>({});
 const [selected,setSelected]=useState<string|null>(null);
 const [message,setMessage]=useState('');
 const [errors,setErrors]=useState(0);
 const [question,setQuestion]=useState(0);
 const [choice,setChoice]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [correct,setCorrect]=useState(0);
 const [best,setBest]=useState(()=>{try{return Number(localStorage.getItem('amlverse-virtual-asset-best')||0)}catch{return 0}});
 const score=Math.max(1,pieces.length*10+correct*15-errors*3);
 const current=questions[question];
 const remaining=pieces.filter(x=>!placed[x.id]);
 function put(id:string,target:Type){const piece=pieces.find(x=>x.id===id);if(!piece||placed[id])return;
  if(piece.type!==target){setErrors(n=>n+1);setMessage('Review this clue: '+piece.why);setSelected(null);return;}
  setPlaced(prev=>({...prev,[id]:target}));setSelected(null);setMessage('✓ Good classification. '+piece.why);
 }
 function drop(e:DragEvent<HTMLButtonElement>,target:Type){e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(id)put(id,target)}
 function check(){if(choice===null||checked)return;setChecked(true);if(choice===current.right)setCorrect(n=>n+1)}
 function next(){
  if(question<questions.length-1){setQuestion(n=>n+1);setChoice(null);setChecked(false);return;}
  const high=Math.max(best,score);setBest(high);
  try{localStorage.setItem('amlverse-virtual-asset-best',String(high))}catch{}
  setStage('win');
 }
 function restart(){setInspectedWallet(null);setStage('intro');setPlaced({});setSelected(null);setMessage('');setErrors(0);setQuestion(0);setChoice(null);setChecked(false);setCorrect(0)}
 return <main className="narrow arcade virtualassetgame">
 <button className="back" onClick={onBack}>← Back to learning room</button><span className="eyebrow">VIRTUAL ASSET INVESTIGATION ACADEMY • FICTIONAL CASE</span>
 <h1 className="title">Operation Chain Trace 🔗</h1>
 <p className="lead">Explore a simple, entirely fictional blockchain transfer route, evaluate evidence, and make careful attribution decisions.</p>
 <TutorialGuide game="virtualassets"/>
 <WorldCompletion game="virtualassets" trigger={stage==='win'} onContinue={onContinue}/>
 <div className="arcadehud"><span>🧩 {stage==='sort'?Object.keys(placed).length+'/6 evidence cards':stage==='decide'?'Decision '+(question+1)+'/3':stage==='win'?'Mission complete':stage==='map'?'Map the route':'Case briefing'}</span><span>🏆 Best {best}</span><button type="button" onClick={restart}>↻ Restart</button></div>
 {stage==='intro'?<div className="evalscene"><div className="evalmascot" aria-hidden="true">🔎</div><div><span className="eyebrow">TRAINING BRIEFING</span><h2>Follow the funds, not assumptions</h2><p>Three fictional wallet labels show how a value-transfer route may be reconstructed. No identifiers here exist on a real blockchain.</p><p>First inspect the transaction route, then sort six clues into evidence categories and answer three analyst decisions.</p><button className="primary" type="button" onClick={()=>setStage('map')}>View fictional transfer route →</button></div></div>
 :stage==='map'?<section className="chaincase"><span className="eyebrow">CASE MAP — DEMONSTRATION ONLY</span><h2>Two linked transactions</h2><p className="chaininstruction">Select each wallet to inspect what the fictional transactions establish and what still requires corroboration.</p><div className="chainroute">{path.map((point,i)=><div className="chainstop" key={point.id}><button type="button" aria-pressed={inspectedWallet===point.id} className={'chainnode'+(inspectedWallet===point.id?' inspected':'')} onClick={()=>setInspectedWallet(point.id)}><small>{point.label}</small><strong>{point.id}</strong><span>{point.explanation}</span><em>{inspectedWallet===point.id?'✓ Inspecting wallet':'Tap to inspect'}</em></button>{i<path.length-1?<div className="chainarrow"><b aria-hidden="true">→</b><small>{i===0?'TX-A1 · 12 units':'TX-B2 · 9 units'}</small></div>:null}</div>)}</div>{inspectedWallet?<div className="chaininspector" role="status"><strong>Inspection: {inspectedWallet}</strong><p>{inspectedWallet==='WAL-A'?'The fictional source label is linked to a recorded transfer of 12 units. Address attribution and the origin of funds remain unverified.':inspectedWallet==='WAL-B'?'The intermediary received 12 units and subsequently sent 9 units onward. The difference cannot be attributed to a fee, balance or third party without further transaction records.':'The receiving label is a potential exchange deposit lead, not verified proof of a particular customer or an offence. A lawful provider inquiry and corroborating records would be needed.'}</p></div>:null}<p className="chainnote">This is a simplified, account-style fictional model. The difference between 12 units received and 9 sent onward is not assumed to be a fee or remaining balance without further records. Real networks and transaction models differ.</p><button className="primary" onClick={()=>setStage('sort')}>Inspect the evidence cards →</button></section>
 :stage==='sort'?<><div className="arcadeinstruction"><strong>ROUND 1 — WHAT DOES THE EVIDENCE SHOW?</strong><p>Select a card, then tap the matching evidence box. Drag and drop also works on desktop.</p><div className="arcadeprogress"><div style={{width:Object.keys(placed).length/pieces.length*100+'%'}}/></div></div>
 <div className="arcadebins">{types.map(t=><button key={t.id} type="button" className={'arcadebin'+(selected?' dropready':'')} onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,t.id)} onClick={()=>selected?put(selected,t.id):setMessage('Choose an evidence card first.')}><span className="arcadeemoji">{t.emoji}</span><b>{t.title}</b><small>{t.hint}</small><span className="arcadecount">{Object.values(placed).filter(x=>x===t.id).length} cards</span></button>)}</div>
 {message?<div className="arcadefeedback" role="status">{message}</div>:null}
 <div className="arcadepile"><h2>🗂️ Evidence cards <small>({remaining.length} remaining)</small></h2><div className="arcadecards">{remaining.map(c=><button key={c.id} type="button" draggable onDragStart={e=>e.dataTransfer.setData('text/plain',c.id)} onClick={()=>{setSelected(c.id);setMessage('Now select an evidence category above.')}} className={'arcadecard'+(selected===c.id?' selected':'')}><strong>{c.title}</strong><span>{c.detail}</span><small>{selected===c.id?'✓ SELECTED — CHOOSE A BOX':'⠿ DRAG OR TAP'}</small></button>)}</div></div>
 {remaining.length===0?<div className="arcadefinish"><strong>🎉 Evidence classified!</strong><p>Now decide what can be concluded and where further evidence is needed.</p><button className="primary" onClick={()=>{setStage('decide');setMessage('')}}>Unlock analyst decisions →</button></div>:null}</>
 :stage==='decide'?<><div className="arcadeinstruction"><strong>ROUND 2 — ATTRIBUTION DECISIONS</strong><p>Choose the most defensible statement. Learn from each answer.</p><div className="arcadeprogress"><div style={{width:question/questions.length*100+'%'}}/></div></div><div className="evaldialog"><span aria-hidden="true">🕵️</span><p>{current.prompt}</p></div><div className="choices">{current.options.map((o,i)=><button key={i} type="button" disabled={checked} onClick={()=>setChoice(i)} className={'choice'+(choice===i?' picked':'')+(checked&&current.right===i?' correct':'')}><span className="letter">{String.fromCharCode(65+i)}</span>{o}</button>)}</div>
 {checked?<div className="feedback" role="status"><strong>{choice===current.right?'✓ Sound reasoning!':'Review this conclusion'}</strong><p>{current.why}</p></div>:null}<div className="actions">{checked?<button className="primary" onClick={next}>{question===questions.length-1?'Complete investigation':'Next decision'} →</button>:<button className="primary" disabled={choice===null} onClick={check}>Check decision →</button>}</div></>
 :<div className="arcadewin"><span aria-hidden="true">🏆</span><h2>Chain Trace completed!</h2><p>You organised six evidence cards and made {correct} of three strong analytical decisions.</p><strong>{score} points</strong><p>On-chain observations establish transfers, not personal identities or criminal guilt. Corroborate attribution before reaching conclusions.</p><div className="actions"><button className="primary" onClick={restart}>Play again ↻</button><button className="secondary" onClick={onBack}>Return to learning</button></div></div>}
 {stage==='win'?<div className="nextstepbar" role="navigation" aria-label="Continue learning"><span>✓ Mission finished. Your next learning world is ready.</span><button type="button" className="primary" onClick={onContinue}>Continue to next world →</button></div>:null}
 <div className="notice"><b>Educational exercise only.</b> Wallet names, amounts, transfers and exchange records are synthetic. No actual blockchain or customer data is requested. <a href="https://www.fatf-gafi.org/en/topics/virtual-assets.html" target="_blank" rel="noopener noreferrer">FATF virtual assets guidance ↗</a> · <a href="https://www.fatf-gafi.org/en/publications/Methodsandtrends/Virtual-assets-red-flag-indicators.html" target="_blank" rel="noopener noreferrer">FATF red-flag indicators ↗</a></div>
 </main>;
}
