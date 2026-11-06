import {useState} from 'react';
import type {DragEvent} from 'react';
import TutorialGuide from './TutorialGuide';
import WorldCompletion from './WorldCompletion';

type Bucket='pattern'|'context'|'control';
type Clue={id:string;title:string;detail:string;bucket:Bucket;lesson:string};
const clues:Clue[]=[
{id:'c1',title:'Rapid pass-through transfers',detail:'A fictional account receives many deposits then moves most funds onward within minutes.',bucket:'pattern',lesson:'Rapid movement can be a money-mule indicator, but requires contextual assessment.'},
{id:'c2',title:'Many unrelated senders',detail:'Numerous people with no apparent relationship send similarly sized payments.',bucket:'pattern',lesson:'A network of apparently unrelated senders is a red flag, not proof of laundering.'},
{id:'c3',title:'Verified charity drive',detail:'The account holder provides verifiable fundraising records explaining some incoming payments.',bucket:'context',lesson:'A credible alternative explanation needs to be checked, not automatically accepted or rejected.'},
{id:'c4',title:'Expected activity profile',detail:'The customer’s recorded occupation and usual account activity help evaluate whether transfers are unusual.',bucket:'context',lesson:'Compare transaction patterns with the customer’s known profile and expected activity.'},
{id:'c5',title:'Beneficial ownership checks',detail:'Identify and verify the natural persons who ultimately own or control relevant entities.',bucket:'control',lesson:'Risk-based identification and verification can mitigate misuse of opaque corporate structures.'},
{id:'c6',title:'Alert review and escalation',detail:'Analysts review unusual activity and refer concerns through approved reporting procedures.',bucket:'control',lesson:'Monitoring and appropriate escalation are controls, not evidence of guilt.'}
];
const buckets:{id:Bucket;title:string;hint:string;emoji:string}[]=[
{id:'pattern',title:'Red flag',hint:'Something unusual to investigate',emoji:'🚩'},
{id:'context',title:'Check context',hint:'Information that explains activity',emoji:'🧩'},
{id:'control',title:'Safeguard',hint:'A measure that manages risk',emoji:'🛡️'}
];
const decisions=[
{question:'What is the best interpretation of the rapid transfers and unrelated senders?',answers:['The person is definitely laundering money.','The activity warrants contextual analysis and verification.','The transfers cannot be suspicious without a confession.'],correct:1,why:'Indicators support further examination, not a conclusive finding of criminal conduct.'},
{question:'Some transactions match a documented charity drive. What is a sound next step?',answers:['Ignore all other indicators.','Treat the charity claim as conclusive innocence.','Verify the records and assess whether all activity fits the explanation.'],correct:2,why:'Evidence-based assessment examines alternative explanations and any remaining unexplained activity.'},
{question:'After reasonable checks, concerns remain. What should the analyst do?',answers:['Document reasoning and follow applicable escalation or reporting procedures.','Publish the account holder’s identity online.','Freeze all connected accounts without lawful authority.'],correct:0,why:'Record the analysis and follow the authorised reporting, investigative or escalation process.'}
];
type Stage='intro'|'sort'|'decision'|'end';
export default function TypologyDetective({onBack,onContinue}:{onBack:()=>void;onContinue:()=>void}){
 const [stage,setStage]=useState<Stage>('intro');
 const [selected,setSelected]=useState<string|null>(null);
 const [placed,setPlaced]=useState<Record<string,Bucket>>({});
 const [message,setMessage]=useState('');
 const [errors,setErrors]=useState(0);
 const [qIndex,setQIndex]=useState(0);
 const [choice,setChoice]=useState<number|null>(null);
 const [revealed,setRevealed]=useState(false);
 const [correct,setCorrect]=useState(0);
 const [best,setBest]=useState(()=>{try{return Number(localStorage.getItem('amlverse-typology-best')||0)}catch{return 0}});
 const remaining=clues.filter(c=>!placed[c.id]);
 const score=Math.max(0,clues.length*10+correct*15-errors*3);
 function put(id:string,destination:Bucket){
  const card=clues.find(c=>c.id===id);if(!card||placed[id])return;
  if(card.bucket!==destination){setErrors(n=>n+1);setMessage('Try another box. Hint: '+card.lesson);return;}
  setPlaced(old=>({...old,[id]:destination}));setSelected(null);setMessage('✓ Good detective work. '+card.lesson);
 }
 function drop(e:DragEvent<HTMLButtonElement>,target:Bucket){e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(id)put(id,target)}
 function check(){if(choice===null||revealed)return;setRevealed(true);if(choice===decisions[qIndex].correct)setCorrect(n=>n+1)}
 function next(){
  if(qIndex<decisions.length-1){setQIndex(n=>n+1);setChoice(null);setRevealed(false);}
  else{const highest=Math.max(best,score);setBest(highest);try{localStorage.setItem('amlverse-typology-best',String(highest))}catch{}setStage('end');}
 }
 function reset(){setStage('intro');setSelected(null);setPlaced({});setMessage('');setErrors(0);setQIndex(0);setChoice(null);setRevealed(false);setCorrect(0)}
 const q=decisions[qIndex];
 return <main className="narrow arcade typologygame">
 <button className="back" onClick={onBack}>← Back to learning room</button>
 <span className="eyebrow">TYPOLOGY DETECTIVE • FICTIONAL CASE FILE</span>
 <h1 className="title">Operation Red Flag 🔎</h1>
 <p className="lead">Inspect a fictional payment account. Sort the clues, consider alternative explanations and make careful analytical decisions.</p>
 <TutorialGuide game="typologies"/>
 <WorldCompletion game={"typologies"} trigger={stage==='end'} onContinue={onContinue}/>
 <div className="arcadehud"><span>🧩 {stage==='sort'?Object.keys(placed).length+'/6 clues sorted':stage==='decision'?'Decision '+(qIndex+1)+'/3':stage==='end'?'Case completed':'Case briefing'}</span><span>🏆 Best: {best} points</span><button type="button" onClick={reset}>↻ Restart</button></div>
 {stage==='intro'?<div className="evalscene"><div className="evalmascot" aria-hidden="true">🕵️</div><div><span className="eyebrow">MISSION BRIEFING</span><h2>A suspicious pattern is not a verdict.</h2><p>Some incoming transfers and rapid outward payments have triggered fictional monitoring alerts. Your job is to distinguish warning signs from contextual evidence and safeguards.</p><p><b>How to play:</b> Tap a clue then its category—or drag and drop on desktop. Complete the evidence board to unlock the analyst decisions.</p><button className="primary" onClick={()=>setStage('sort')}>Open case file →</button></div></div>
 :stage==='sort'?<>
 <div className="arcadeinstruction"><strong>ROUND 1 — BUILD THE EVIDENCE BOARD</strong><p>Drag a clue into its category or tap the clue and then its box.</p><div className="arcadeprogress"><div style={{width:Object.keys(placed).length/clues.length*100+'%'}}/></div></div>
 <div className="arcadebins">{buckets.map(b=><button key={b.id} type="button" className={'arcadebin'+(selected?' dropready':'')} onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,b.id)} onClick={()=>selected?put(selected,b.id):setMessage('Select a clue card first.')}><span className="arcadeemoji">{b.emoji}</span><b>{b.title}</b><small>{b.hint}</small><span className="arcadecount">{Object.values(placed).filter(v=>v===b.id).length} clues</span></button>)}</div>
 {message?<div className="arcadefeedback" role="status">{message}</div>:null}
 <div className="arcadepile"><h2>📂 Evidence cards <small>({remaining.length} remaining)</small></h2><div className="arcadecards">{remaining.map(c=><button key={c.id} type="button" draggable className={'arcadecard'+(selected===c.id?' selected':'')} onDragStart={e=>e.dataTransfer.setData('text/plain',c.id)} onClick={()=>{setSelected(c.id);setMessage('Now tap the best category above.')}}><strong>{c.title}</strong><span>{c.detail}</span><small>{selected===c.id?'✓ SELECTED — CHOOSE A BOX':'⠿ DRAG OR TAP'}</small></button>)}</div></div>
 {!remaining.length?<div className="arcadefinish"><strong>🎉 Evidence board complete!</strong><p>You have identified warning signs, context and safeguards. Now defend your conclusions.</p><button className="primary" onClick={()=>{setStage('decision');setMessage('')}}>Unlock analyst decisions →</button></div>:null}
 </>
 :stage==='decision'?<><div className="arcadeinstruction"><strong>ROUND 2 — ANALYST DECISIONS</strong><p>Choose the most defensible action. Every decision comes with feedback.</p><div className="arcadeprogress"><div style={{width:qIndex/decisions.length*100+'%'}}/></div></div>
 <div className="evaldialog"><span aria-hidden="true">🔎</span><p>{q.question}</p></div><div className="choices">{q.answers.map((a,i)=><button key={i} type="button" disabled={revealed} className={'choice'+(choice===i?' picked':'')+(revealed&&q.correct===i?' correct':'')} onClick={()=>setChoice(i)}><span className="letter">{String.fromCharCode(65+i)}</span>{a}</button>)}</div>
 {revealed?<div className="feedback" role="status"><strong>{choice===q.correct?'✓ Well reasoned!':'Review this finding'}</strong><p>{q.why}</p></div>:null}<div className="actions">{revealed?<button className="primary" onClick={next}>{qIndex===decisions.length-1?'Close the case':'Next decision'} →</button>:<button className="primary" disabled={choice===null} onClick={check}>Check decision →</button>}</div>
 </>
 :<div className="arcadewin"><span aria-hidden="true">🏆</span><h2>Case complete!</h2><p>You classified six clues and made {correct} out of three sound analytical decisions.</p><strong>{score} points</strong><p>Remember: red flags lead to questions, evidence-based analysis and lawful action—not automatic allegations of guilt.</p><div className="actions"><button className="primary" onClick={reset}>Play again ↻</button><button className="secondary" onClick={onBack}>Return to learning</button></div></div>}
 {stage==='end'?<div className="nextstepbar" role="navigation" aria-label="Continue learning"><span>✓ Mission finished. Your next learning world is ready.</span><button type="button" className="primary" onClick={onContinue}>Continue to next world →</button></div>:null}
 <div className="notice"><b>Public educational simulation.</b> All activity, entities and transactions are fictional. Red flags are not proof of wrongdoing. <a href="https://www.fatf-gafi.org/en/publications.html" target="_blank" rel="noopener noreferrer">FATF publications ↗</a></div>
 </main>;
}
