import {useState} from 'react';
import type {DragEvent} from 'react';
import TutorialGuide from './TutorialGuide';
import WorldCompletion from './WorldCompletion';

type DocumentCard={id:string;title:string;detail:string;answer:'technical'|'effectiveness'|'insufficient';explanation:string};
type Question={prompt:string;options:string[];correct:number;explanation:string;source:string};
const docs:DocumentCard[]=[
{id:'law',title:'AML/CFT legislation',detail:'A fictional law establishes powers and obligations for competent authorities.',answer:'technical',explanation:'Laws and enforceable measures primarily help demonstrate technical compliance. They do not alone prove effective implementation.'},
{id:'results',title:'Financial intelligence outcomes',detail:'Verified examples show intelligence used in investigations, with documented follow-up.',answer:'effectiveness',explanation:'Verified operational outcomes can demonstrate effectiveness, including how financial intelligence was used.'},
{id:'policy',title:'Written cooperation procedure',detail:'An approved agreement describes how authorised agencies can share information.',answer:'technical',explanation:'An adopted procedure helps show legal and institutional arrangements; evidence that it works would also be needed.'},
{id:'activity',title:'Dissemination and use records',detail:'Quality-controlled statistics show products shared, feedback received and confirmed uses.',answer:'effectiveness',explanation:'Documented use of intelligence and reliable statistics help assess effectiveness.'},
{id:'poster',title:'Agency publicity poster',detail:'A colourful poster claims “We are 100% compliant” but provides no supporting records.',answer:'insufficient',explanation:'A claim without supporting evidence does not establish technical compliance or effectiveness.'},
{id:'uncited',title:'Unverified success story',detail:'An anonymous message claims that many investigations were solved without case references.',answer:'insufficient',explanation:'Unverifiable claims should not be treated as evidence of results.'}
];
const bins=[{id:'technical',icon:'📜',label:'Technical compliance',hint:'Rules, laws and formal measures'},{id:'effectiveness',icon:'🎯',label:'Effectiveness',hint:'Verified implementation and outcomes'},{id:'insufficient',icon:'❓',label:'Needs evidence',hint:'Unsupported claims or weak proof'}] as const;
const questions:Question[]=[
{prompt:'Assessor: “Your FIU has legal powers to receive and analyse reports. Does that alone prove Immediate Outcome 6 is achieved?”',options:['Yes. Passing a law automatically demonstrates effectiveness.','No. Show that financial intelligence is used effectively in investigations and related work.','Only the number of staff matters.'],correct:1,explanation:'Technical compliance and effectiveness are assessed separately. IO.6 focuses on use of financial intelligence and other relevant information.',source:'FATF Methodology — Immediate Outcome 6'},
{prompt:'Assessor: “Your agency says it sent 1,000 intelligence reports. What would improve the evidence?”',options:['Provide records of usefulness, feedback, quality, and documented investigative outcomes.','Add more decorative slides.','Avoid examining the results.'],correct:0,explanation:'Counts of activities are useful context, but verified outcomes and evidence of the contribution made by intelligence are more persuasive.',source:'FATF Methodology — effectiveness assessment'},
{prompt:'Assessor: “A partner agency supplied restricted information. Can you publish the case file in the training game?”',options:['Yes, if names are shortened.','Yes, because it arrived from another government agency.','No. Use fictional or approved sanitised material and follow applicable confidentiality rules.'],correct:2,explanation:'Training must respect data protection, confidentiality and consent restrictions. This public simulation uses fictional information only.',source:'Egmont principles — confidentiality and information exchange'}
];
const sourceUrl='https://www.fatf-gafi.org/en/topics/mutual-evaluations.html';
type Stage='intro'|'evidence'|'interview'|'result';
export default function EvaluationArena({onBack,onContinue}:{onBack:()=>void;onContinue:()=>void}){
 const [stage,setStage]=useState<Stage>('intro');
 const [assigned,setAssigned]=useState<Record<string,string>>({});
 const [selected,setSelected]=useState<string|null>(null);
 const [message,setMessage]=useState('');
 const [errors,setErrors]=useState(0);
 const [questionIndex,setQuestionIndex]=useState(0);
 const [picked,setPicked]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [interviewCorrect,setInterviewCorrect]=useState(0);
 const [best,setBest]=useState<number>(()=>{try{return Number(localStorage.getItem('amlverse-evaluation-arena-best')||0)}catch{return 0}});
 const sorted=Object.keys(assigned).length;
 const score=Math.max(0,Math.round((sorted*10+interviewCorrect*15)-errors*3));
 const remaining=docs.filter(d=>!assigned[d.id]);
 function place(cardId:string,binId:string){
  if(assigned[cardId])return;
  const card=docs.find(d=>d.id===cardId);
  if(!card)return;
  if(card.answer!==binId){setErrors(v=>v+1);setMessage('Try another box. '+card.explanation);return;}
  setAssigned(v=>({...v,[cardId]:binId}));setSelected(null);setMessage('✓ Nice work! '+card.explanation);
 }
 function drop(e:DragEvent<HTMLButtonElement>,binId:string){e.preventDefault();const cardId=e.dataTransfer.getData('text/plain');if(cardId)place(cardId,binId)}
 function reset(){setStage('intro');setAssigned({});setSelected(null);setMessage('');setErrors(0);setQuestionIndex(0);setPicked(null);setChecked(false);setInterviewCorrect(0)}
 function answer(){if(picked===null||checked)return;setChecked(true);if(picked===questions[questionIndex].correct)setInterviewCorrect(v=>v+1)}
 function advance(){if(questionIndex+1<questions.length){setQuestionIndex(v=>v+1);setPicked(null);setChecked(false)}else{const newBest=Math.max(best,score);setBest(newBest);try{localStorage.setItem('amlverse-evaluation-arena-best',String(newBest))}catch{}setStage('result')}}
 const q=questions[questionIndex];
 return <main className="narrow evaluationgame">
 <button className="back" onClick={onBack}>← Academy overview</button><span className="eyebrow">MUTUAL EVALUATION ARENA • BEGINNER MISSION</span>
 <h1 className="title">The Assessor's Challenge</h1>
 <p className="lead">Help a fictional team prepare for a mutual evaluation. Sort its evidence, then answer three questions from a simulated assessor.</p>
 <TutorialGuide game="evaluation"/>
 <WorldCompletion game={"evaluation"} trigger={stage==='result'} onContinue={onContinue}/>
 <div className="evalhud"><span>⭐ {stage==='intro'?'Ready':stage==='evidence'?'Evidence round':stage==='interview'?'Assessor interview':'Mission complete'}</span><span>🏆 Best score: {best}</span><button type="button" onClick={reset}>↻ Restart</button></div>
 <div className="evalstage" key={stage+'-'+(stage==='interview'?questionIndex:0)}>
 {stage==='intro'?<div className="evalscene"><div className="evalmascot" aria-hidden="true">🕵️</div><div><span className="eyebrow">YOUR MISSION</span><h2>Prepare for the assessor!</h2><p>A fictional FIU has a folder full of documents. Some show that rules exist, some demonstrate actual results, and some don't prove anything yet.</p><p><b>How to play:</b> Drag each document into the correct box—or tap a document and then its box. Get instant feedback, then unlock the assessor interview.</p><button className="primary" onClick={()=>setStage('evidence')}>Start sorting evidence →</button></div></div>
 :stage==='evidence'?<>
 <div className="arcadeinstruction"><strong>ROUND 1 — SORT THE EVIDENCE</strong><p>Drag or tap each document, then choose the box it belongs in.</p><div className="arcadeprogress"><div style={{width:(sorted/docs.length*100)+'%'}}/></div></div>
 <div className="evalbins">{bins.map(bin=><button key={bin.id} className={'arcadebin'+(selected?' dropready':'')} aria-label={'Assign to '+bin.label} type="button" onDragOver={e=>e.preventDefault()} onDrop={e=>drop(e,bin.id)} onClick={()=>selected?place(selected,bin.id):setMessage('Select a document card first.')}><span className="arcadeemoji">{bin.icon}</span><b>{bin.label}</b><small>{bin.hint}</small><span className="arcadecount">{Object.values(assigned).filter(v=>v===bin.id).length} documents</span></button>)}</div>
 {message?<div role="status" className="arcadefeedback">{message}</div>:null}
 <h2 className="question">📂 Evidence folder <small>({remaining.length} remaining)</small></h2>
 <div className="arcadecards">{remaining.map(card=><button key={card.id} type="button" draggable onDragStart={e=>e.dataTransfer.setData('text/plain',card.id)} aria-pressed={selected===card.id} className={'arcadecard'+(selected===card.id?' selected':'')} onClick={()=>{setSelected(card.id);setMessage('Now tap the correct evidence box.')}}><strong>{card.title}</strong><span>{card.detail}</span><small>{selected===card.id?'✓ SELECTED — PICK A BOX':'⠿ DRAG OR TAP'}</small></button>)}</div>
 {sorted===docs.length?<div className="arcadefinish"><strong>🎉 Evidence organised!</strong><p>Now prepare to answer the assessor's questions.</p><button className="primary" onClick={()=>{setStage('interview');setMessage('')}}>Enter assessor interview →</button></div>:null}
 </>:stage==='interview'?<>
 <div className="arcadeinstruction"><strong>ROUND 2 — ASSESSOR INTERVIEW</strong><p>Choose the strongest evidence-based response. Learn from each answer.</p><div className="arcadeprogress"><div style={{width:(questionIndex/questions.length*100)+'%'}}/></div></div>
 <div className="evaldialog" aria-live="polite"><span aria-hidden="true">🕵️</span><p>{q.prompt}</p></div>
 <div className="choices">{q.options.map((option,i)=><button type="button" key={i} disabled={checked} aria-pressed={picked===i} className={'choice'+(picked===i?' picked':'')+(checked&&q.correct===i?' correct':'')} onClick={()=>setPicked(i)}><span className="letter">{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
 {checked?<div className="feedback"><strong>{picked===q.correct?'Correct — excellent answer!':'Good try — here is the stronger approach.'}</strong><p>{q.explanation}</p><small>{q.source}</small></div>:null}
 <div className="actions">{!checked?<button className="primary" disabled={picked===null} onClick={answer}>Check my answer →</button>:<button className="primary" onClick={advance}>{questionIndex===questions.length-1?'See mission results':'Next assessor question'} →</button>}</div>
 </>:<div className="arcadewin"><span aria-hidden="true">🏆</span><h2>Evaluation mission completed!</h2><p>You sorted {sorted} evidence cards and answered {interviewCorrect} of {questions.length} assessor questions correctly.</p><strong>{score} points</strong><p>The most important lesson: written requirements and real-world results are different types of evidence. Effective evaluations consider both.</p><div className="actions"><button className="primary" onClick={reset}>Replay mission ↻</button><button className="secondary" onClick={onBack}>Return to academy</button></div></div>}
 </div>
 {stage==='result'?<div className="nextstepbar" role="navigation" aria-label="Continue learning"><span>✓ Mission finished. Your next learning world is ready.</span><button type="button" className="primary" onClick={onContinue}>Continue to next world →</button></div>:null}
 <div className="notice"><b>Training disclaimer:</b> All agencies, documents and events in this simulation are fictional. This game is not an official FATF or GIABA assessment tool, grading methodology or certification. <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Explore FATF mutual evaluations ↗</a></div>
 </main>;
}
