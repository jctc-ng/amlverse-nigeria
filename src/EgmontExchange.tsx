import {useState} from 'react';
import type {DragEvent} from 'react';
import TutorialGuide from './TutorialGuide';
import WorldCompletion from './WorldCompletion';

type Bin='safe'|'check'|'stop';
type Item={id:string;title:string;detail:string;bin:Bin;reason:string};
type Question={prompt:string;answers:string[];correct:number;why:string;principles:string};
const source='https://egmontgroup.org/wp-content/uploads/2013/10/2.-Principles-Information-Exchange-Revised-May-2022.pdf';
const cards:Item[]=[
{id:'1',title:'Approved secure network',detail:'An authorised officer sends an FIU request via a recognised secure information-exchange system.',bin:'safe',reason:'Egmont Principles 34–36 call for secure, reliable channels and authorised users.'},
{id:'2',title:'Request for a new purpose',detail:'A partner wants to use information for a purpose not covered by the original approval.',bin:'check',reason:'Principle 32 requires prior authorisation for a purpose beyond that originally approved.'},
{id:'3',title:'Public social media post',detail:'An officer plans to publish a foreign FIU intelligence response online.',bin:'stop',reason:'Intelligence exchanges require confidentiality and appropriate limitations on dissemination.'},
{id:'4',title:'Approved restricted storage',detail:'Received intelligence is stored securely with access limited to authorised staff.',bin:'safe',reason:'Principles 28–31 require protection, confidentiality and controlled access.'},
{id:'5',title:'New onward recipient',detail:'A different agency, not identified in the original request or permission, asks for the information.',bin:'check',reason:'Verify the scope of any original authorisation; additional onward dissemination may require prior authorisation under Principles 26 and 32.'},
{id:'6',title:'Unsecured personal email',detail:'A staff member wants to forward a counterpart FIU response to a private mailbox.',bin:'stop',reason:'Sensitive FIU information must be exchanged and protected through approved secure channels.'}
];
const bins:{id:Bin;label:string;hint:string;emoji:string}[]=[
{id:'safe',label:'Safe to proceed',hint:'Approved and secure',emoji:'🛡️'},
{id:'check',label:'Check permission',hint:'Confirm purpose or consent',emoji:'🔐'},
{id:'stop',label:'Stop & protect',hint:'Unsecure or improper',emoji:'⛔'}
];
const questions:Question[]=[
{prompt:'A foreign FIU has supplied information for financial analysis. A prosecutor now seeks to use it in court, but that use was not originally authorised. What should you do?',answers:['Send it to court immediately','Seek the providing FIU’s prior authorisation through approved channels','Post a summary publicly'],correct:1,why:'Use beyond the original authorised purpose requires prior authorisation. Assess consent and applicable law before proceeding.',principles:'Principle 32'},
{prompt:'The requesting FIU named a domestic investigative authority in its original request. The providing FIU replied without explicitly refusing dissemination. What is the best interpretation?',answers:['Assume sharing is always forbidden','The 2022 principles may permit assumed consent for the authority identified in the request, unless expressly refused; verify scope and applicable conditions','Share with all authorities without restriction'],correct:1,why:'Principle 26 has a specific rule for authorities identified in the request. That rule does not allow unrestricted onward sharing or use for new purposes.',principles:'Principles 26 and 32'},
{prompt:'A counterpart requests assistance but the available identifiers are unclear. What is the best response?',answers:['Seek clarification securely and process the request under applicable rules','Forward the entire domestic intelligence database','Publish the unanswered request'],correct:0,why:'Appropriate secure clarification supports timely and meaningful cooperation while protecting sensitive information.',principles:'Principles 28–36'}
];
type Stage='intro'|'sort'|'quiz'|'done';
function readBest(){try{return Number(localStorage.getItem('amlverse-egmont-best')||'0')||0}catch{return 0}}
export default function EgmontExchange({onBack,onContinue}:{onBack:()=>void;onContinue:()=>void}){
 const [stage,setStage]=useState<Stage>('intro');
 const [selected,setSelected]=useState<string|null>(null);
 const [placed,setPlaced]=useState<Record<string,Bin>>({});
 const [message,setMessage]=useState('');
 const [errors,setErrors]=useState(0);
 const [question,setQuestion]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [correct,setCorrect]=useState(0);
 const [best,setBest]=useState(readBest);
 const sorted=Object.keys(placed).length;
 const remaining=cards.filter(c=>!placed[c.id]);
 const points=Math.max(0,sorted*10+correct*15-errors*3);
 function place(id:string,bin:Bin){
  const card=cards.find(c=>c.id===id);
  if(!card||placed[id])return;
  if(card.bin!==bin){setErrors(n=>n+1);setMessage('Try another box. Hint: '+card.reason);return;}
  setPlaced(p=>({...p,[id]:bin}));setSelected(null);setMessage('✓ Correct! '+card.reason);
 }
 function drop(e:DragEvent<HTMLButtonElement>,bin:Bin){e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(id)place(id,bin)}
 function check(){if(answer===null||checked)return;setChecked(true);if(answer===questions[question].correct)setCorrect(n=>n+1)}
 function advance(){
  if(question<questions.length-1){setQuestion(n=>n+1);setAnswer(null);setChecked(false);return;}
  const final=Math.max(0,sorted*10+correct*15-errors*3);
  const next=Math.max(best,final);setBest(next);
  try{localStorage.setItem('amlverse-egmont-best',String(next))}catch{}
  setStage('done');
 }
 function restart(){setStage('intro');setPlaced({});setSelected(null);setMessage('');setErrors(0);setQuestion(0);setAnswer(null);setChecked(false);setCorrect(0)}
 const q=questions[question];
 return <main className="narrow arcade egmontgame">
 <button className="back" onClick={onBack}>← Academy overview</button>
 <span className="eyebrow">EGMONT EXCHANGE 2.0 • FIU COOPERATION GAME</span>
 <h1 className="title">Operation Secure Exchange 🌍</h1>
 <p className="lead">You are an FIU cooperation officer on a fictional international assignment. Protect information, follow authorisations and complete the mission!</p>
 <TutorialGuide game="egmont"/>
 <WorldCompletion game={"egmont"} trigger={stage==='done'} onContinue={onContinue}/>
 <div className="arcadehud"><span>🧩 {stage==='sort'?sorted+'/6 cards sorted':stage==='quiz'?'Question '+(question+1)+'/3':stage==='done'?'Mission complete':'Ready to play'}</span><span>🏆 Best {best} points</span><button type="button" onClick={restart}>↻ Restart</button></div>
 {stage==='intro'?<div className="evalscene"><div className="evalmascot" aria-hidden="true">🌐</div><div><span className="eyebrow">INCOMING INTERNATIONAL REQUEST</span><h2>Protect the intelligence!</h2><p>A fictional foreign FIU has shared financial information. Some actions are safe, some need permission, and some must be stopped.</p><p><b>How to play:</b> Drag each card into a box—or tap a card and then tap its box. Complete all six to unlock three short decision challenges.</p><button className="primary" onClick={()=>setStage('sort')}>Start mission →</button></div></div>
 :stage==='sort'?<><div className="arcadeinstruction"><strong>ROUND 1 — THE SECURITY DESK</strong><p>Where should each action go? Drag a card or tap it, then tap a box.</p><div className="arcadeprogress"><div style={{width:sorted/cards.length*100+'%'}}/></div></div>
 <div className="arcadebins egmontbins">{bins.map(b=><button key={b.id} type="button" className={'arcadebin'+(selected?' dropready':'')} onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,b.id)} onClick={()=>selected?place(selected,b.id):setMessage('Tap a card first, then choose this box.')}><span className="arcadeemoji">{b.emoji}</span><b>{b.label}</b><small>{b.hint}</small><span className="arcadecount">{Object.values(placed).filter(x=>x===b.id).length} cards</span></button>)}</div>
 {message?<div className="arcadefeedback" role="status">{message}</div>:null}
 <div className="arcadepile"><h2>📨 Action cards <small>({remaining.length} remaining)</small></h2><div className="arcadecards">{remaining.map(c=><button type="button" key={c.id} draggable onDragStart={e=>e.dataTransfer.setData('text/plain',c.id)} onClick={()=>{setSelected(c.id);setMessage('Now tap the matching box.')}} className={'arcadecard'+(selected===c.id?' selected':'')}><strong>{c.title}</strong><span>{c.detail}</span><small>{selected===c.id?'✓ SELECTED — CHOOSE A BOX':'⠿ DRAG OR TAP'}</small></button>)}</div></div>
 {sorted===cards.length?<div className="arcadefinish"><strong>🎉 All actions sorted!</strong><p>The foreign FIU is ready for your final decisions.</p><button className="primary" onClick={()=>{setStage('quiz');setMessage('')}}>Unlock international mission →</button></div>:null}
 </>
 :stage==='quiz'?<><div className="arcadeinstruction"><strong>ROUND 2 — THE COOPERATION DESK</strong><p>Choose the safest lawful response. Learn from every decision.</p><div className="arcadeprogress"><div style={{width:question/questions.length*100+'%'}}/></div></div>
 <div className="evaldialog"><span aria-hidden="true">🕵️</span><p>{q.prompt}</p></div>
 <div className="choices">{q.answers.map((a,i)=><button key={i} type="button" disabled={checked} onClick={()=>setAnswer(i)} className={'choice'+(answer===i?' picked':'')+(checked&&q.correct===i?' correct':'')}><span className="letter">{String.fromCharCode(65+i)}</span>{a}</button>)}</div>
 {checked?<div className="feedback"><strong>{answer===q.correct?'✓ Excellent decision!':'Review this principle'}</strong><p>{q.why}</p><small>Egmont Principles for Information Exchange (revised May 2022): {q.principles}</small></div>:null}
 <div className="actions">{!checked?<button className="primary" disabled={answer===null} onClick={check}>Check my decision →</button>:<button className="primary" onClick={advance}>{question===questions.length-1?'Complete mission':'Next decision'} →</button>}</div>
 </>
 :<div className="arcadewin"><span aria-hidden="true">🏆</span><h2>International mission accomplished!</h2><p>You correctly sorted six decisions and answered {correct} of three cooperation challenges.</p><strong>{points} points</strong><p>Remember: authorised purposes, secure channels, confidentiality and consent make trustworthy FIU cooperation possible.</p><div className="actions"><button className="primary" onClick={restart}>Play again ↻</button><button className="secondary" onClick={onBack}>Return to academy</button></div></div>}
 {stage==='done'?<div className="nextstepbar" role="navigation" aria-label="Continue learning"><span>✓ Mission finished. Your next learning world is ready.</span><button type="button" className="primary" onClick={onContinue}>Continue to next world →</button></div>:null}
 <div className="notice"><b>Educational simulation only.</b> No real FIU messages, accounts or restricted Egmont information are used or collected. Details are simplified and must be checked against applicable law and operational guidance. <a href={source} target="_blank" rel="noopener noreferrer">Egmont Principles for Information Exchange (May 2022) ↗</a></div>
 </main>;
}
