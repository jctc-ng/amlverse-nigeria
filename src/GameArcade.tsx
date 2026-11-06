import {useState} from 'react';
import type {DragEvent} from 'react';
import TutorialGuide from './TutorialGuide';
import WorldCompletion from './WorldCompletion';

type Mode='risk'|'team';
type Item={id:string;title:string;detail:string;target:string;why:string};
type Level={title:string;story:string;instruction:string;bins:{id:string;label:string;hint:string;icon:string}[];items:Item[];finalQuestion:string;finalOptions:{label:string;right:boolean;explain:string}[]};
const levels:Record<Mode,Level>={
 risk:{
 title:'RiskLab Adventure',story:'You are a rookie risk detective. A fictional payment company is seeing strange money movements. Sort the clues to understand the risks!',instruction:'Drag each clue to the right box. On a phone, tap a card, then tap its box.',
 bins:[{id:'threat',label:'Threat',hint:'What could criminals do?',icon:'⚠'},{id:'weakness',label:'Weakness',hint:'What makes it easier?',icon:'🔓'},{id:'protection',label:'Protection',hint:'What helps prevent it?',icon:'🛡'}],
 items:[
 {id:'r1',title:'Fraud syndicate',detail:'Criminals attempt to move stolen funds.',target:'threat',why:'The criminal activity is a potential threat.'},
 {id:'r2',title:'Unknown owners',detail:'The real owners of some customer companies are not verified.',target:'weakness',why:'A beneficial ownership gap makes misuse easier.'},
 {id:'r3',title:'Monitoring alerts',detail:'Automated checks flag unusual transfers for review.',target:'protection',why:'Monitoring is a risk-mitigation control.'},
 {id:'r4',title:'Fake investment scam',detail:'Scammers target victims through a bogus investment platform.',target:'threat',why:'This is a possible source of criminal funds.'},
 {id:'r5',title:'Missing transaction checks',detail:'Payments are rarely reviewed for unusual patterns.',target:'weakness',why:'Insufficient monitoring creates vulnerability.'},
 {id:'r6',title:'Verified customers',detail:'The business verifies identity before establishing a relationship.',target:'protection',why:'Customer due diligence helps mitigate risks.'}
 ],
 finalQuestion:'You found criminal threats and weak checks. Which plan makes the most sense?',
 finalOptions:[
 {label:'Target the weak checks, verify owners, and strengthen monitoring',right:true,explain:'Correct! Focused, proportionate measures address identified weaknesses.'},
 {label:'Ignore the warnings until a crime is proven',right:false,explain:'Risk management is preventive. Warning signs merit proportionate assessment and action.'},
 {label:'Block every customer immediately, without assessing differences',right:false,explain:'A risk-based approach assesses exposure and uses proportionate measures rather than automatic blanket restrictions.'}]
 },
 team:{
 title:'Interagency Rescue Mission',story:'A fictional fraud case has landed in the national coordination room! Four agencies have different responsibilities. Help each team member find their mission.',instruction:'Drag each mission to the best agency role. On a phone, tap a mission, then tap an agency.',
 bins:[{id:'fiu',label:'FIU Analyst',hint:'Analyses financial information',icon:'📊'},{id:'police',label:'Investigator',hint:'Investigates suspected crimes',icon:'🔎'},{id:'supervisor',label:'Supervisor',hint:'Checks regulated-sector controls',icon:'🏦'},{id:'prosecutor',label:'Prosecutor',hint:'Handles criminal proceedings',icon:'⚖'}],
 items:[
 {id:'t1',title:'Follow transfer patterns',detail:'Analyse suspicious transaction information and identify financial links.',target:'fiu',why:'Financial intelligence analysis is a core FIU function.'},
 {id:'t2',title:'Interview witnesses',detail:'Gather admissible investigative evidence under applicable law.',target:'police',why:'Criminal investigations and evidence gathering belong to competent investigators.'},
 {id:'t3',title:'Inspect customer checks',detail:'Review whether a regulated firm applies appropriate due diligence.',target:'supervisor',why:'Risk-based supervision examines firms’ compliance controls.'},
 {id:'t4',title:'Prepare the prosecution',detail:'Present charges and evidence before a court under applicable law.',target:'prosecutor',why:'Prosecutors assess and present criminal cases according to law.'},
 {id:'t5',title:'Produce analytical leads',detail:'Identify possible linked accounts for authorised dissemination.',target:'fiu',why:'FIUs develop and disseminate financial intelligence according to their mandate.'},
 {id:'t6',title:'Trace suspected assets',detail:'Carry out authorised investigative asset-tracing steps.',target:'police',why:'Competent law enforcement bodies investigate criminal proceeds.'},
 {id:'t7',title:'Review firm monitoring',detail:'Assess whether alerts and controls match the firm’s risks.',target:'supervisor',why:'Supervisors evaluate compliance with relevant obligations.'},
 {id:'t8',title:'Argue the case',detail:'Explain the legal theory and evidence in court.',target:'prosecutor',why:'Court advocacy is a prosecution function.'}
 ],
 finalQuestion:'The teams each have part of the picture. What should they do next?',
 finalOptions:[
 {label:'Coordinate lawfully, share permitted information, and keep each role distinct',right:true,explain:'Exactly. Coordination works when mandates, confidentiality and relevant legal safeguards are respected.'},
 {label:'Make every agency perform the exact same duties',right:false,explain:'Coordination complements distinct legal mandates; it does not erase them.'},
 {label:'Keep all findings separate and avoid any cooperation',right:false,explain:'Appropriate interagency cooperation can help connect evidence and improve outcomes.'}]
 }
};
const sourceUrl='https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html';
function shuffle<T,>(data:T[]):T[]{return data.map((value,i)=>({value,sort:(i*7+3)%11})).sort((a,b)=>a.sort-b.sort).map(x=>x.value)}
export default function GameArcade({mode,onBack}:{mode:Mode;onBack:()=>void}){
 const level=levels[mode];
 const [round,setRound]=useState<'sort'|'final'|'won'>('sort');
 const [placed,setPlaced]=useState<Record<string,string>>({});
 const [selected,setSelected]=useState<string|null>(null);
 const [feedback,setFeedback]=useState('');
 const [mistakes,setMistakes]=useState(0);
 const [choice,setChoice]=useState<number|null>(null);
 const [finalFeedback,setFinalFeedback]=useState('');
 const [best,setBest]=useState<number>(()=>{try{return Number(localStorage.getItem('amlverse-arcade-'+mode)||0)}catch{return 0}});
 const done=Object.keys(placed).length;
 const cards=shuffle(level.items).filter(x=>!placed[x.id]);
 const fullScore=Math.max(0,100-mistakes*5);
 function place(id:string,target:string){
  if(placed[id])return;
  const item=level.items.find(c=>c.id===id);if(!item)return;
  if(item.target!==target){setMistakes(n=>n+1);setFeedback('Not quite! Look at the box hints and try again.');setSelected(null);return;}
  setPlaced(p=>({...p,[id]:target}));setSelected(null);setFeedback('Great match! '+item.why);
 }
 function chooseBox(target:string){if(selected)place(selected,target);else setFeedback('First tap a clue card below, then tap a box.')}
 function onDrop(e:DragEvent<HTMLButtonElement>,target:string){e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(id)place(id,target)}
 function finish(){if(choice===null)return;const answer=level.finalOptions[choice];setFinalFeedback(answer.explain);if(answer.right){setRound('won');const score=fullScore;setBest(previous=>{const next=Math.max(previous,score);try{localStorage.setItem('amlverse-arcade-'+mode,String(next))}catch{}return next})}}
 function reset(){setRound('sort');setPlaced({});setSelected(null);setFeedback('');setMistakes(0);setChoice(null);setFinalFeedback('')}
 return <main className="narrow arcade"><button className="back" onClick={onBack}>← Back to the academy</button>
 <span className="eyebrow">AMLVERSE ARCADE • {mode==='risk'?'RISK DETECTIVE':'TEAMWORK CHALLENGE'}</span>
 <h1 className="title">{level.title}</h1><p className="lead">{level.story}</p>
 <TutorialGuide key={mode} game={mode}/>
 <WorldCompletion game={mode} trigger={round==='won'}/>
 <div className="arcadehud"><span>⭐ {done}/{level.items.length} clues matched</span><span>🏆 Best: {best}/100</span><button onClick={reset} type="button">↻ Restart</button></div>
 {round==='sort'?<>
 <div className="arcadeinstruction"><strong>YOUR MISSION</strong><p>{level.instruction}</p><div className="arcadeprogress"><div style={{width:(done/level.items.length*100)+'%'}}/></div></div>
 <div className="arcadebins" style={{gridTemplateColumns:'repeat('+level.bins.length+',minmax(0,1fr))'}}>
 {level.bins.map(bin=><button key={bin.id} type="button" className={'arcadebin'+(selected?' dropready':'')} onDragOver={e=>e.preventDefault()} onDrop={e=>onDrop(e,bin.id)} onClick={()=>chooseBox(bin.id)}>
 <span className="arcadeemoji">{bin.icon}</span><b>{bin.label}</b><small>{bin.hint}</small><span className="arcadecount">{Object.values(placed).filter(v=>v===bin.id).length} cards</span>
 </button>)}</div>
 {feedback?<div className="arcadefeedback" role="status">{feedback}</div>:null}
 <div className="arcadepile"><h2>🎴 Clue cards <small>({cards.length} remaining)</small></h2>
 <div className="arcadecards">{cards.map(card=><button key={card.id} draggable type="button" className={'arcadecard'+(selected===card.id?' selected':'')} onDragStart={e=>e.dataTransfer.setData('text/plain',card.id)} onClick={()=>{setSelected(card.id);setFeedback('Now tap the box that fits this clue.')}}><strong>{card.title}</strong><span>{card.detail}</span><small>{selected===card.id?'✓ SELECTED — TAP A BOX':'⠿ DRAG OR TAP'}</small></button>)}</div></div>
 {done===level.items.length?<div className="arcadefinish"><strong>🎉 All clues sorted!</strong><p>You can now choose the best decision to complete this mission.</p><button className="primary" onClick={()=>{setRound('final');setFeedback('')}}>Unlock final challenge →</button></div>:null}
 </>:round==='final'?<>
 <div className="arcadeinstruction"><strong>FINAL CHALLENGE</strong><p>You organised the evidence. Now make the best decision.</p></div>
 <h2 className="question">{level.finalQuestion}</h2><div className="choices">{level.finalOptions.map((o,i)=><button key={i} className={'choice'+(choice===i?' picked':'')} onClick={()=>{setChoice(i);setFinalFeedback('')}}><span className="letter">{String.fromCharCode(65+i)}</span>{o.label}</button>)}</div>
 {finalFeedback?<div className="arcadefeedback">{finalFeedback}</div>:null}
 <div className="actions"><button className="primary" disabled={choice===null} onClick={finish}>Check decision →</button><button className="secondary" onClick={()=>setRound('sort')}>← Review cards</button></div>
 </>:<div className="arcadewin"><span>🏆</span><h2>Mission complete!</h2><p>{finalFeedback}</p><strong>{fullScore}/100 points</strong><div className="actions"><button className="primary" onClick={reset}>Play again ↻</button><button className="secondary" onClick={onBack}>Choose another world</button></div></div>}
 <div className="notice"><b>Learning note:</b> All clues are fictional. Categories and institution roles are simplified for teaching; real risk assessments and legal mandates require more detailed evidence and applicable law. <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Read the FATF Recommendations ↗</a></div>
 </main>;
}
