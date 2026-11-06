import {useState} from 'react';
import type {DragEvent} from 'react';
import TutorialGuide from './TutorialGuide';
import WorldCompletion from './WorldCompletion';

type Lane='fiu'|'supervisor'|'controls';
type Card={id:string;title:string;detail:string;lane:Lane;why:string};
const cards:Card[]=[
{id:'a',title:'Send a substantiated STR',detail:'A reporting entity has established reasonable suspicion after reviewing unusual activity. Submit through the applicable authorised reporting channel.',lane:'fiu',why:'Suspicious transaction reports are submitted to the NFIU under the applicable law and guidance; reporting is not a public accusation.'},
{id:'b',title:'Analyse a financial intelligence lead',detail:'Combine received disclosures with relevant information and disseminate intelligence to authorised competent agencies.',lane:'fiu',why:'Receipt, analysis and authorised dissemination are core NFIU functions.'},
{id:'c',title:'Inspect a bank’s AML programme',detail:'Assess a regulated bank’s AML/CFT/CPF compliance controls in a supervisory examination.',lane:'supervisor',why:'The CBN has supervisory responsibilities for regulated banking institutions.'},
{id:'d',title:'Check a DNFBP programme',detail:'Examine AML/CFT/CPF compliance obligations of a designated non-financial business or profession, within the applicable mandate.',lane:'supervisor',why:'SCUML carries out designated non-financial sector AML/CFT/CPF supervisory functions under relevant laws and regulations.'},
{id:'e',title:'Verify the real owner',detail:'A reporting business checks the beneficial owner of a customer company under customer due diligence requirements.',lane:'controls',why:'Customer due diligence helps the reporting entity understand ownership and assess risks.'},
{id:'f',title:'Review monitoring alerts',detail:'A firm examines unusual payments, documents the context and decides whether further action or reporting is warranted.',lane:'controls',why:'Monitoring, case review and documented escalation are compliance activities within a reporting entity.'}
];
const lanes:{id:Lane;emoji:string;title:string;hint:string}[]=[
{id:'fiu',emoji:'📊',title:'NFIU / Intelligence',hint:'Suspicious reports and intelligence work'},
{id:'supervisor',emoji:'🏛️',title:'Sector supervision',hint:'Regulatory compliance oversight'},
{id:'controls',emoji:'🛡️',title:'Entity controls',hint:'Checks inside a reporting business'}
];
const questions=[
{prompt:'A compliance officer detects unusual payments but the facts are incomplete. What should happen next?',answers:['Publish the customer’s identity online','Review and document the activity, then report suspicion when the applicable requirements are met','Ignore the alerts until a criminal conviction'],correct:1,why:'Unusual activity calls for examination. Where suspicion arises, the reporting entity should follow the statutory STR reporting process and preserve confidentiality.'},
{prompt:'A DNFBP needs to check applicable anti-money laundering supervision requirements. Which institution is especially relevant?',answers:['SCUML, for DNFBP AML/CFT/CPF supervisory obligations','The NFIU as the routine supervisor of every business','A foreign FIU as its domestic licensing authority'],correct:0,why:'SCUML has supervisory responsibilities for designated non-financial businesses and professions, subject to the relevant legal framework.'},
{prompt:'A financial intelligence product identifies possible linked accounts. What is its proper use?',answers:['Treat it as an automatic criminal conviction','Post it publicly to invite speculation','Disseminate appropriately to authorised agencies for further lawful action'],correct:2,why:'Financial intelligence supports investigations and decisions by competent agencies; it is not itself a finding of guilt.'}
];
const sources=[
{name:'NFIU — Laws and Regulations',url:'https://www.nfiu.gov.ng/LawsAndRegulations'},
{name:'NFIU — Suspicious Transaction Reporting FAQs',url:'https://www.nfiu.gov.ng/Faqs'},
{name:'SCUML — Laws and Regulations',url:'https://scuml.efcc.gov.ng/laws-regulations/'}
];
type Phase='intro'|'sort'|'quiz'|'win';
export default function NigeriaCompliance({onBack,onContinue}:{onBack:()=>void;onContinue:()=>void}){
 const [phase,setPhase]=useState<Phase>('intro');
 const [selected,setSelected]=useState<string|null>(null);
 const [placed,setPlaced]=useState<Record<string,Lane>>({});
 const [message,setMessage]=useState('');
 const [mistakes,setMistakes]=useState(0);
 const [index,setIndex]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [correct,setCorrect]=useState(0);
 const [best,setBest]=useState(()=>{try{return Number(localStorage.getItem('amlverse-nigeria-compliance-best')||0)}catch{return 0}});
 const remaining=cards.filter(c=>!placed[c.id]);
 const score=Math.max(0,cards.length*10+correct*15-mistakes*3);
 const current=questions[index];
 function place(id:string,lane:Lane){const card=cards.find(c=>c.id===id);if(!card||placed[id])return;
  if(card.lane!==lane){setMistakes(n=>n+1);setMessage('Try again. '+card.why);return;}
  setPlaced(p=>({...p,[id]:lane}));setSelected(null);setMessage('✓ Correct! '+card.why);
 }
 function drop(e:DragEvent<HTMLButtonElement>,lane:Lane){e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(id)place(id,lane)}
 function check(){if(checked||answer===null)return;setChecked(true);if(answer===current.correct)setCorrect(n=>n+1)}
 function next(){if(index<questions.length-1){setIndex(n=>n+1);setAnswer(null);setChecked(false)}
 else{const b=Math.max(best,score);setBest(b);try{localStorage.setItem('amlverse-nigeria-compliance-best',String(b))}catch{}setPhase('win')}}
 function reset(){setPhase('intro');setSelected(null);setPlaced({});setMessage('');setMistakes(0);setIndex(0);setAnswer(null);setChecked(false);setCorrect(0)}
 return <main className="narrow arcade nigeriacompliance">
 <button className="back" onClick={onBack}>← Back to learning room</button>
 <span className="eyebrow">NIGERIA COMPLIANCE CHALLENGE 2.0 • TRAINING GAME</span>
 <h1 className="title">Operation Compliance Shield 🇳🇬</h1>
 <p className="lead">A fictional Nigerian compliance team needs your help. Match the duties to the right function, then make three careful decisions.</p>
 <TutorialGuide game="nigeria"/>
 <WorldCompletion game={"nigeria"} trigger={phase==='win'} onContinue={onContinue}/>
 <div className="arcadehud"><span>⭐ {phase==='sort'?Object.keys(placed).length+'/6 cards matched':phase==='quiz'?'Question '+(index+1)+'/3':phase==='win'?'Mission complete':'Ready'}</span><span>🏆 Best {best}</span><button type="button" onClick={reset}>↻ Restart</button></div>
 {phase==='intro'?<div className="evalscene"><div className="evalmascot" aria-hidden="true">🇳🇬</div><div><span className="eyebrow">MISSION BRIEFING</span><h2>Who handles what?</h2><p>Reporting entities, supervisors and the NFIU have different responsibilities. You will sort six fictional work orders to the right desks.</p><p><b>How to play:</b> Select a card and tap its box, or drag and drop on desktop. Complete the board and unlock a decision round.</p><button className="primary" type="button" onClick={()=>setPhase('sort')}>Start the compliance mission →</button></div></div>
 :phase==='sort'?<>
 <div className="arcadeinstruction"><strong>ROUND 1 — MATCH THE RESPONSIBILITIES</strong><p>Drag a work order into the right desk, or tap the card and then its desk.</p><div className="arcadeprogress"><div style={{width:Object.keys(placed).length/cards.length*100+'%'}}/></div></div>
 <div className="arcadebins">{lanes.map(l=><button key={l.id} type="button" className={'arcadebin'+(selected?' dropready':'')} onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,l.id)} onClick={()=>selected?place(selected,l.id):setMessage('Select a work order card first.')}><span className="arcadeemoji">{l.emoji}</span><b>{l.title}</b><small>{l.hint}</small><span className="arcadecount">{Object.values(placed).filter(x=>x===l.id).length} cards</span></button>)}</div>
 {message?<div className="arcadefeedback" role="status">{message}</div>:null}
 <div className="arcadepile"><h2>🗂️ Work orders <small>({remaining.length} remaining)</small></h2><div className="arcadecards">{remaining.map(c=><button key={c.id} type="button" draggable onDragStart={e=>e.dataTransfer.setData('text/plain',c.id)} className={'arcadecard'+(selected===c.id?' selected':'')} onClick={()=>{setSelected(c.id);setMessage('Now choose the best desk above.')}}><strong>{c.title}</strong><span>{c.detail}</span><small>{selected===c.id?'✓ SELECTED — PICK A DESK':'⠿ DRAG OR TAP'}</small></button>)}</div></div>
 {remaining.length===0?<div className="arcadefinish"><strong>🎉 Responsibilities matched!</strong><p>Now show that you can apply the principles.</p><button className="primary" type="button" onClick={()=>{setPhase('quiz');setMessage('')}}>Unlock the decision round →</button></div>:null}
 </>
 :phase==='quiz'?<><div className="arcadeinstruction"><strong>ROUND 2 — COMPLIANCE DECISIONS</strong><p>Choose the strongest lawful response. Each decision has an explanation.</p><div className="arcadeprogress"><div style={{width:index/questions.length*100+'%'}}/></div></div>
 <div className="evaldialog"><span aria-hidden="true">👩‍💼</span><p>{current.prompt}</p></div>
 <div className="choices">{current.answers.map((a,i)=><button key={i} type="button" disabled={checked} onClick={()=>setAnswer(i)} className={'choice'+(answer===i?' picked':'')+(checked&&current.correct===i?' correct':'')}><span className="letter">{String.fromCharCode(65+i)}</span>{a}</button>)}</div>
 {checked?<div className="feedback" role="status"><strong>{answer===current.correct?'✓ Excellent compliance judgement!':'Learning opportunity'}</strong><p>{current.why}</p></div>:null}
 <div className="actions">{checked?<button className="primary" onClick={next}>{index===questions.length-1?'Complete mission':'Next decision'} →</button>:<button className="primary" disabled={answer===null} onClick={check}>Check decision →</button>}</div></>
 :<div className="arcadewin"><span aria-hidden="true">🏆</span><h2>Compliance Shield complete!</h2><p>You matched six duties and answered {correct} of three compliance decisions correctly.</p><strong>{score} points</strong><p>Good compliance means appropriate due diligence, justified reporting, competent supervision and lawful use of intelligence.</p><div className="actions"><button className="primary" onClick={reset}>Play again ↻</button><button className="secondary" onClick={onBack}>Return to learning</button></div></div>}
 {phase==='win'?<div className="nextstepbar" role="navigation" aria-label="Continue learning"><span>✓ Mission finished. Your next learning world is ready.</span><button type="button" className="primary" onClick={onContinue}>Continue to next world →</button></div>:null}
 <div className="notice"><b>Legal learning disclaimer:</b> All scenarios are fictional and simplify complex mandates. Nigeria’s laws, regulations and agency guidance can change; verify current texts and sector-specific rules before operational use. {sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.name} ↗ </a>)}</div>
 </main>;
}
