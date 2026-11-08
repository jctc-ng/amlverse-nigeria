import {useState} from 'react';
import {modules,readFatf,readScore} from './progress';
import {readAcademyMetrics} from './AcademyMetrics';

type Award={id:string;title:string;kind:'Game'|'Course'|'Academy'|'Special';earned:boolean;detail:string};
const NAME_KEY='amlverse-certificate-name-v1';
function readName(){try{return localStorage.getItem(NAME_KEY)||''}catch{return ''}}
function readCapstone(){try{const p=JSON.parse(localStorage.getItem('amlverse-capstone-v1')||'{}') as {passed?:boolean};return p.passed===true}catch{return false}}

export function certificateAwards():Award[]{
 const metrics=readAcademyMetrics();
 const gameAwards:Award[]=modules.map(m=>({
  id:'game-'+m.id,title:m.title,kind:'Game',earned:readScore(m.scoreKey)>0,
  detail:'Completed the interactive learning game in '+m.title
 }));
 const courseAwards:Award[]=metrics.worlds.map(w=>({
  id:'course-'+w.id,title:w.title,kind:'Course',earned:w.done===w.total,
  detail:'Completed all '+w.total+' activities in the '+w.title+' learning world'
 }));
 const fatf=readFatf();
 const allWorlds=metrics.worlds.every(w=>w.done===w.total);
 const special:Award[]=[
  {id:'special-fatf',title:'FATF 40 Learning Quest',kind:'Special',earned:fatf.perfect===40,detail:'Mastered all 40 FATF Recommendation practice assessments'},
  {id:'special-capstone',title:'Integrated Capstone Challenge',kind:'Special',earned:readCapstone(),detail:'Passed the integrated fictional investigation assessment'},
  {id:'special-academy',title:'AMLVERSE Nigeria Complete Academy',kind:'Academy',earned:allWorlds,detail:'Completed all nine learning worlds and their required activities'}
 ];
 return [...gameAwards,...courseAwards,...special];
}

export default function CompletionCertificates({worldOnly,autoOpen=false}:{worldOnly?:import('./progress').CourseKey;autoOpen?:boolean}={}){
 const [name,setName]=useState(readName);
 const [selected,setSelected]=useState<string|null>(autoOpen&&worldOnly?'course-'+worldOnly:null);
 const awards=certificateAwards().filter(a=>!worldOnly||(a.id==='course-'+worldOnly));
 const earned=awards.filter(a=>a.earned);
 const award=earned.find(a=>a.id===selected)||null;
 const validName=name.trim().length>=2&&name.trim().length<=100;
 const date=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(new Date());
 const printCertificate=()=>{
  if(!award||!validName)return;
  try{localStorage.setItem(NAME_KEY,name.trim())}catch{}
  window.print();
 };
 return <section className="progresssection certificates" aria-labelledby="certificates-title">
  <div className="certificates-head"><div><span className="eyebrow">PERSONAL ACHIEVEMENTS</span><h2 id="certificates-title">{worldOnly?'Your course certificate':'Certificates of completion'}</h2>
   <p>{worldOnly?'Complete all required activities in this world to receive its own course certificate. You do not need to finish any other world.':'Earn separate certificates for finished games, fully completed learning worlds, FATF Quest and the integrated Capstone. Only earned certificates can be printed.'}</p></div>
   <strong>{earned.length} / {awards.length} earned</strong></div>
  <label className="certificate-name-label" htmlFor="certificate-learner-name">Learner name for your certificates</label>
  <input id="certificate-learner-name" className="certificate-name" value={name} onChange={e=>{setName(e.target.value);try{localStorage.setItem(NAME_KEY,e.target.value)}catch{}}} maxLength={100} autoComplete="name" placeholder="Enter your full name"/>
  <p className="certificate-privacy">The name and learning results stay in this browser. This is a self-reported name, not independently verified identity.</p>
  <div className="certificate-list">{awards.map(a=><article key={a.id} className={'certificate-tile'+(a.earned?' earned':' locked')}>
   <span className="certificate-tile-icon" aria-hidden="true">{a.earned?'🏅':'🔒'}</span>
   <div><small>{a.kind==='Game'?'GAME COMPLETION':a.kind==='Course'?'FULL COURSE COMPLETION':a.kind.toUpperCase()+' ACHIEVEMENT'}</small><h3>{a.title}</h3><p>{a.earned?'✓ Requirements met':a.kind==='Game'?'Finish this game to unlock':'Complete all required activities to unlock'}</p></div>
   <button type="button" className={a.earned?'primary':'secondary'} disabled={!a.earned} onClick={()=>setSelected(a.id)}>{a.earned?'View certificate':'Locked'}</button>
  </article>)}</div>
  <p className="certificate-privacy">Certificates recognize fictional, browser-based educational exercises. They are not professional certifications, official accreditation, or independently verifiable credentials. Clearing local data may remove earned progress.</p>
  {award?<div className="certificate-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}>
   <section className="certificate-dialog" role="dialog" aria-modal="true" aria-labelledby="certificate-dialog-title">
    <div className="certificate-dialog-controls"><h2 id="certificate-dialog-title">Certificate preview</h2><button type="button" className="secondary" onClick={()=>setSelected(null)} aria-label="Close certificate preview">✕ Close</button></div>
    <div className="certificate-paper" id="amlverse-print-certificate">
     <div className="certificate-paper-inner">
      <div className="certificate-mark" aria-hidden="true">✦</div>
      <p className="certificate-brand">AMLVERSE <span>NIGERIA</span></p>
      <p className="certificate-kicker">INDEPENDENT EDUCATIONAL ACHIEVEMENT</p>
      <h2>{award.kind==='Game'?'Certificate of Game Completion':award.kind==='Course'?'Certificate of Course Completion':'Certificate of Learning Completion'}</h2>
      <p className="certificate-presented">This certificate acknowledges that</p>
      <p className="certificate-recipient">{validName?name.trim():'Learner name required'}</p>
      <p className="certificate-presented">has successfully completed</p>
      <h3>{award.title}</h3>
      <p className="certificate-description">{award.detail}</p>
      <div className="certificate-bottom"><div><strong>Date generated</strong><span>{date}</span></div><div><strong>Issued by</strong><span>AMLVERSE Nigeria · Independent Learning Initiative</span></div></div>
      <p className="certificate-disclaimer">Informal educational completion record based on progress saved in this browser. Not an accredited qualification, professional certification, or identity-verified award. No government, NFIU, FATF, Egmont Group, TRM, or ACFE endorsement is implied.</p>
      <p className="certificate-site">m-analyst.github.io/amlverse-nigeria</p>
     </div>
    </div>
    {!validName?<p className="certificate-error" role="status">Enter your full name (at least 2 characters) above before printing.</p>:null}
    <div className="certificate-dialog-actions"><button type="button" className="primary" disabled={!validName} onClick={printCertificate}>Print / Save as PDF</button><button type="button" className="secondary" onClick={()=>setSelected(null)}>Back to my certificates</button></div>
    <p className="certificate-privacy">In the print dialog, choose “Save as PDF” to download a copy. Printing does not submit your information to AMLVERSE.</p>
   </section>
  </div>:null}
 </section>;
}
