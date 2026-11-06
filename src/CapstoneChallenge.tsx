import {useState} from 'react';
import {modules,readCourse,readScore} from './progress';
const KEY='amlverse-capstone-v1';
type Answer={option:number;correct:boolean};
type Question={section:string;heading:string;scenario:string;prompt:string;choices:string[];correct:number;explanation:string};
const questions:Question[]=[
{section:'RISK ASSESSMENT',heading:'Assess the exposure',scenario:'A fictional payments firm observes rapid outward transfers from a recently opened business account. Customer due-diligence information is incomplete.',prompt:'What is the most defensible immediate assessment?',choices:['The account is proven to be used for laundering.','Document the vulnerability and unusual activity, then apply proportionate review.','Ignore the activity until a criminal conviction.'],correct:1,explanation:'A risk-based approach examines the identified vulnerability and transaction context; unusual patterns are not proof of crime.'},
{section:'TRANSACTION ANALYSIS',heading:'Follow the funds',scenario:'Confirmed synthetic ledger records show WAL-A transferred 10 units to WAL-B; WAL-B subsequently sent 6 units to WAL-C and 3 units to WAL-D.',prompt:'Which finding is supported?',choices:['Exactly 10 units reached WAL-C.','WAL-A, WAL-B, WAL-C and WAL-D share one verified controller.','A 6-unit recorded branch reaches WAL-C; other funds require separate accounting.'],correct:2,explanation:'A confirmed transaction edge documents only the observed transfer. Shared control and ultimate destinations require further corroboration.'},
{section:'EXCHANGE ATTRIBUTION',heading:'Verify a service lead',scenario:'WAL-C is tagged as an exchange deposit address by a single unverified analytics label. There is no verified customer information.',prompt:'What should the analyst state?',choices:['The exchange attribution is a provisional lead; consider independent corroboration and an authorised request.','The suspect is conclusively the exchange account holder.','The label proves a criminal offence.'],correct:0,explanation:'A third-party address label is not verified customer attribution or proof of an offence.'},
{section:'FIU COOPERATION',heading:'Protect restricted information',scenario:'A partner FIU supplies confidential information for a specified purpose. An investigator requests onward sharing for a different purpose.',prompt:'Which response is appropriate?',choices:['Publish the records for transparency.','Check the relevant restrictions and obtain necessary prior consent before onward use.','Share immediately because the recipient is domestic.'],correct:1,explanation:'Confidentiality, purpose restrictions and applicable consent requirements govern FIU information exchange.'},
{section:'INTELLIGENCE WRITING',heading:'Write the finding',scenario:'The file contains an authentic transaction statement and an anonymous accusation that two beneficiary companies share a controller. Ownership has not been verified.',prompt:'Which wording belongs in the FINDINGS section?',choices:['The two companies are definitely operated by a criminal network.','The anonymous tip proves common beneficial ownership.','The supplied statement records the payments; common ownership remains unverified.'],correct:2,explanation:'Findings identify documented facts and separate unverified allegations from established evidence.'},
{section:'RECOMMENDATIONS',heading:'Choose the next action',scenario:'The team has outstanding questions about customer profiles, company ownership and a virtual asset service-provider account.',prompt:'What should the case note recommend?',choices:['Record gaps and seek corroborating records through authorised procedures.','Treat all connected parties as guilty.','Disclose the raw case file on social media.'],correct:0,explanation:'Recommendations must be specific, proportionate and consistent with lawful access, confidentiality and agency mandates.'}
];
function readBest(){try{const s=JSON.parse(localStorage.getItem(KEY)||'{}') as {best?:number;passed?:boolean};return {best:typeof s.best==='number'?s.best:0,passed:s.passed===true}}catch{return {best:0,passed:false}}}
function priorProgress(){return modules.filter(m=>{const p=readCourse(m.id);return p.lessons.length===3&&p.checkPassed&&readScore(m.scoreKey)>0}).length}
export default function CapstoneChallenge({onBack,onProgress}:{onBack:()=>void;onProgress:()=>void}){
 const [phase,setPhase]=useState<'intro'|'exam'|'results'>('intro');
 const [index,setIndex]=useState(0);
 const [selected,setSelected]=useState<number|null>(null);
 const [confirmed,setConfirmed]=useState(false);
 const [answers,setAnswers]=useState<Answer[]>([]);
 const [best,setBest]=useState(readBest);
 const [giftOpen,setGiftOpen]=useState(false);
 const [notice,setNotice]=useState('');
 const q=questions[index];
 const correct=answers.filter(a=>a.correct).length;
 const score=Math.round(correct/questions.length*100);
 const passed=score>=80;
 const completedWorlds=priorProgress();
 const analysis=['ABSTRACT','This fictional case combines unusual account activity, synthetic wallet movements, an unconfirmed exchange label and a restricted FIU information-sharing request.',
 '','FINDINGS',
 'The case presents a customer due-diligence gap, recorded synthetic ledger transfers and a transaction-statement extract. The exchange association and alleged common beneficial ownership are not independently verified.',
 '','INFERENCE',
 'The patterns justify contextual examination and lawful information gathering but do not establish the identity of all wallet controllers, illicit origin of funds or criminal guilt.',
 '','RECOMMENDED ACTIONS',
 'Document transaction identifiers and methodology; verify company records and customer profiles; seek appropriately authorised service-provider information; respect FIU confidentiality and consent obligations.',
 '','LIMITATIONS',
 'All data, identifiers, allegations and scenarios are fictional. This example is a teaching model, not an operational intelligence product.'].join('\n');
 function finish(){
  const completed=[...answers,{option:selected as number,correct:selected===q.correct}];
  setAnswers(completed);
  const current=Math.round(completed.filter(a=>a.correct).length/questions.length*100);
  const p=current>=80;
  const next={best:Math.max(best.best,current),passed:best.passed||p};
  setBest(next);
  try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}
  setPhase('results');
 }
 function next(){
  if(index===questions.length-1){finish();return;}
  setAnswers(a=>[...a,{option:selected as number,correct:selected===q.correct}]);
  setIndex(i=>i+1);setSelected(null);setConfirmed(false);
 }
 function restart(){setPhase('intro');setIndex(0);setSelected(null);setConfirmed(false);setAnswers([]);setGiftOpen(false);setNotice('')}
 function saveText(){
  const body='AMLVERSE NIGERIA — CAPSTONE EDUCATIONAL REVIEW\n'+
  'Score: '+score+'% · '+correct+'/'+questions.length+' correct · '+(passed?'Practice pass':'Practice incomplete')+'\n\n'+
  analysis+'\n\nEducational prototype. Not an accredited certification or actual case report.';
  const blob=new Blob([body],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='amlverse-capstone-practice-review.txt';link.click();URL.revokeObjectURL(url);
  setNotice('Your practice review has been prepared for download.');
 }
 return <main className="narrow capstonepage">
 <button type="button" className="back" onClick={onBack}>← Academy overview</button>
 <span className="eyebrow">AMLVERSE NIGERIA • INTEGRATED PRACTICE MISSION</span>
 <h1 className="title">The Capstone Challenge 🏅</h1>
 <p className="lead">One fictional case, six connected decisions. Apply risk assessment, tracing, attribution, FIU cooperation and intelligence reporting together.</p>
 <div className="capstoneheader"><span>🧭 {phase==='intro'?'Mission briefing':phase==='exam'?'Decision '+(index+1)+' of '+questions.length:'Mission debrief'}</span><span>🏆 Personal best: {best.best}%</span><button type="button" onClick={restart}>↻ Restart</button></div>
 {phase==='intro'?<section className="capstoneintro">
  <div className="capstoneheroicon" aria-hidden="true">🛡️</div>
  <h2>Operation Integrity Shield</h2>
  <p>Investigate linked fictional financial activity and choose defensible next steps. There are six multiple-choice decisions, with explanations after each answer and a final case review.</p>
  <div className="capstonemetrics"><div><strong>{completedWorlds}/9</strong><small>Other worlds mastered</small></div><div><strong>6</strong><small>Scenario decisions</small></div><div><strong>80%</strong><small>Practice pass threshold</small></div></div>
  <p className="capstonehint">Earlier worlds are recommended preparation, not mandatory prerequisites. This exercise uses no real customer or case information and is not an official certification examination.</p>
  <button className="primary" type="button" onClick={()=>setPhase('exam')}>Begin capstone mission →</button>
 </section>:phase==='exam'?<section className="capstonequestion">
  <div className="capstoneprogress"><div style={{width:((index+1)/questions.length*100)+'%'}}/></div>
  <span className="eyebrow">{q.section} · DECISION {index+1}/{questions.length}</span>
  <h2>{q.heading}</h2><div className="situation"><small>CASE FILE UPDATE</small><p>{q.scenario}</p></div>
  <h3 className="question">{q.prompt}</h3>
  <div className="choices">{q.choices.map((c,i)=><button type="button" key={i} disabled={confirmed} className={'choice'+(selected===i?' picked':'')+(confirmed&&i===q.correct?' correct':'')+(confirmed&&selected===i&&i!==q.correct?' incorrect':'')} onClick={()=>setSelected(i)}><span className="letter">{String.fromCharCode(65+i)}</span>{c}</button>)}</div>
  {confirmed?<div className="feedback" role="status"><strong>{selected===q.correct?'✓ Sound decision':'Review the stronger response'}</strong><p>{q.explanation}</p></div>:null}
  <div className="actions">{confirmed?<button type="button" className="primary" onClick={next}>{index===questions.length-1?'Complete capstone':'Next decision'} →</button>:<button type="button" className="primary" disabled={selected===null} onClick={()=>setConfirmed(true)}>Check decision →</button>}</div>
 </section>:<section className="capstoneresults">
  <div className="capstoneverdict"><span aria-hidden="true">{passed?'🎉':'📚'}</span><span className="eyebrow">MISSION COMPLETE</span><h2>{passed?'Capstone practice passed!':'Practice completed — keep building'}</h2><strong>{score}%</strong><p>{correct} correct responses out of {questions.length}. Your personal best is {best.best}%.</p></div>
  {passed?<div className="capstonegift"><h3>🎁 Your capstone achievement</h3>{!giftOpen?<button className="capstonegiftbutton" type="button" onClick={()=>setGiftOpen(true)}><span aria-hidden="true">🎁</span> Open your reward</button>:<div className="capstonebadge" role="status"><span aria-hidden="true">🏅</span><b>INTEGRITY CHALLENGER</b><p>AMLVERSE Capstone Practice Achievement</p><small>Informal educational achievement — not accreditation or professional certification.</small></div>}</div>:<div className="chainnote">A score of at least 80% unlocks the practice achievement. Review the explanations and replay to improve your result.</div>}
  <div className="capstonereview"><h3>Decision review</h3>{questions.map((item,i)=><div className="capstonereviewitem" key={i}><strong>{answers[i]?.correct?'✓':'○'} {item.section}</strong><p>{item.explanation}</p></div>)}</div>
  <div className="capstonereview"><h3>Example intelligence case note</h3><pre className="trace-report">{analysis}</pre></div>
  <div className="actions"><button type="button" className="primary" onClick={saveText}>↓ Download practice review</button><button type="button" className="secondary" onClick={restart}>↻ Replay capstone</button><button type="button" className="secondary" onClick={onProgress}>View My Progress →</button></div>
  {notice?<p className="arcadefeedback" role="status">{notice}</p>:null}
 </section>}
 <div className="notice"><b>Educational simulation.</b> No real case data is processed. An 80% practice pass or achievement badge is not a regulated qualification, a professional certification or an endorsement by any authority. Consult official FATF and applicable Nigerian rules before operational use. <a href="https://www.fatf-gafi.org/en/topics/fatf-recommendations.html" target="_blank" rel="noopener noreferrer">FATF Recommendations ↗</a></div>
 </main>;
}
