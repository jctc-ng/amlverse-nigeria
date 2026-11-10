import {useMemo,useState} from 'react';
import OsintGuidedAcademy,{guidedComplete,readGuidedProgress,guidedLessons} from './OsintGuidedAcademy';

const STORAGE='amlverse-osint-lab-v1';
export type OsintProgress={completed:string[];captures:string[];notes:Record<string,string>;hashes:Record<string,string>;log:{action:string;time:string}[]};
const empty=():OsintProgress=>({completed:[],captures:[],notes:{},hashes:{},log:[]});
export function readOsintProgress():OsintProgress{
 try{const raw=JSON.parse(localStorage.getItem(STORAGE)||'null') as Partial<OsintProgress>|null;
  return raw?{completed:Array.isArray(raw.completed)?raw.completed.filter(x=>typeof x==='string'):[],captures:Array.isArray(raw.captures)?raw.captures.filter(x=>typeof x==='string'):[],notes:raw.notes&&typeof raw.notes==='object'?raw.notes:{},hashes:raw.hashes&&typeof raw.hashes==='object'?raw.hashes:{},log:Array.isArray(raw.log)?raw.log:[]}:empty()
 }catch{return empty()}
}
export const osintMissions=[
 {id:'workstation',title:'Prepare the investigation workstation',subtitle:'Operational security and lawful tasking',goal:'Select appropriate safeguards before beginning online enquiries.',type:'setup'},
 {id:'search',title:'Find the company connection',subtitle:'Search tradecraft and source selection',goal:'Locate the company record and corroborate its publicly stated director.',type:'browser'},
 {id:'social',title:'Corroborate the public profile',subtitle:'Social media and attribution limits',goal:'Connect the public business profile to company records without assuming personal identity.',type:'browser'},
 {id:'network',title:'Inspect domain and infrastructure records',subtitle:'Domain, DNS and technical intelligence',goal:'Interpret registry and DNS data without mistaking hosting infrastructure for proof of ownership.',type:'browser'},
 {id:'evidence',title:'Build an evidence notebook',subtitle:'Source preservation and chain of custody',goal:'Preserve at least three relevant sources with descriptions and timestamps.',type:'evidence'},
 {id:'report',title:'Write the intelligence assessment',subtitle:'Analytical reporting and uncertainty',goal:'Document supported findings, important limitations and lawful investigative next steps.',type:'report'}
] as const;
export function osintComplete(){return guidedComplete()&&osintMissions.every(m=>readOsintProgress().completed.includes(m.id))}

type Page={id:string;url:string;title:string;source:string;category:string;body:string;tags:string[];links:string[]};
const pages:Page[]=[
 {id:'search',url:'search.osint.lab',title:'Investigation Search',source:'Simulation search engine',category:'tool',body:'Search a closed collection of synthetic websites, records and public posts. Use exact phrases, quoted names and targeted keywords.',tags:[],links:['registry','company','social','domain','news']},
 {id:'company',url:'meridian-aid.example',title:'Meridian Aid Logistics — Company website',source:'Fictional company website · archived snapshot',category:'web',body:'Meridian Aid Logistics Limited provides delivery and warehousing services. Public contact: enquiries@meridian-aid.example. Company statement: managing director is Amina Bello. Published: 16 February 2025. Website claims registration number RC 802116.',tags:['meridian','aid','logistics','amina','bello','company','director'],links:['registry','social','domain']},
 {id:'registry',url:'registry.osint.lab/RC802116',title:'Company registry extract: RC 802116',source:'Synthetic corporate registry · training record',category:'registry',body:'Entity: Meridian Aid Logistics Limited. Registered 12 January 2023. Director: Amina Bello. Service address: 24 Unity Crescent, Lagos (fictional). Status: Active in this simulated register. This extract does not establish ultimate beneficial ownership.',tags:['meridian','aid','logistics','amina','bello','RC802116','registry','director'],links:['company','news']},
 {id:'social',url:'social.osint.lab/meridianaid',title:'Meridian Aid Logistics public profile',source:'Synthetic public social network',category:'social',body:'@meridianaid — public business profile. Post dated 20 March 2025: “Our director Amina Bello attended the new delivery hub launch.” This statement is self-published and does not independently verify control or beneficial ownership.',tags:['meridian','aid','amina','bello','social','launch'],links:['company','news']},
 {id:'news',url:'dailyledger.osint.lab/meridian-hub',title:'Delivery hub launch attended by company representatives',source:'Independent-looking fictional news page · unverified',category:'news',body:'Report dated 22 March 2025. Photograph caption identifies Amina Bello as a speaker for Meridian Aid Logistics. The journalist relied on the company event programme. This is not independent identity verification; source dependence matters.',tags:['meridian','amina','bello','news','hub','launch','verification'],links:['social','registry']},
 {id:'domain',url:'whois.osint.lab/meridian-aid.example',title:'Domain registration and DNS lookup',source:'Synthetic RDAP/DNS tool',category:'domain',body:'Domain: meridian-aid.example. Created: 19 January 2023. Registrar: Example Registrar Ltd. Registrant: privacy protected. A record: 192.0.2.24 (documentation-only test address). MX: mail.meridian-aid.example. The registrant is not identified. Infrastructure does not establish the real-world controller.',tags:['meridian','domain','whois','rdap','dns','ip','registrant','example'],links:['company']}
];
const missionSources:Record<string,string[]>={search:['registry'],social:['social','news'],network:['domain']};
const setupChoices=[
 {id:'scope',label:'Record the legal authority, research scope and permitted data sources',safe:true},
 {id:'identity',label:'Use an approved training-only profile with no real personal credentials',safe:true},
 {id:'record',label:'Enable time-stamped investigation notes and evidence preservation',safe:true},
 {id:'personal',label:'Sign in with an investigator’s personal social-media account',safe:false},
 {id:'assume',label:'Assume private browsing makes online activity invisible',safe:false},
 {id:'publish',label:'Share live case details in a public discussion forum',safe:false}
];
function tokenize(search:string){const result=search.match(/"[^"]+"|\S+/g)||[];return result.filter(x=>x!=='AND'&&x!=='OR').map(x=>x.replace(/^"|"$/g,'').toLowerCase())}
function searchPages(input:string){const words=tokenize(input).filter(Boolean);
 return pages.filter(p=>p.id!=='search'&&words.length>0&&words.every(w=>(p.title+' '+p.body+' '+p.tags.join(' ')+' '+p.url).toLowerCase().includes(w))).slice(0,8)}
const date=()=>new Date().toISOString();
export default function OsintSimulationLab({onBack,onNext}:{onBack:()=>void;onNext:()=>void}){
 const [progress,setProgress]=useState(readOsintProgress);
 const [mode,setMode]=useState<'guided'|'missions'>('guided');
 const [mission,setMission]=useState(0);
 const [page,setPage]=useState('search');
 const [query,setQuery]=useState('');
 const [searched,setSearched]=useState('');
 const [history,setHistory]=useState<string[]>(['search']);
 const [tab,setTab]=useState<string[]>(['search']);
 const [setup,setSetup]=useState<string[]>([]);
 const [report,setReport]=useState({findings:'',limitations:'',steps:''});
 const [feedback,setFeedback]=useState('');
 const [captureNote,setCaptureNote]=useState('');
 const [capturePrompt,setCapturePrompt]=useState(false);
 const task=osintMissions[mission];
 const current=pages.find(p=>p.id===page)||pages[0];
 const results=useMemo(()=>searchPages(searched),[searched]);
 const captured=pages.filter(p=>progress.captures.includes(p.id));
 const done=progress.completed.includes(task.id);
 function store(next:OsintProgress){setProgress(next);try{localStorage.setItem(STORAGE,JSON.stringify(next))}catch{}}
 function log(action:string){store({...progress,log:[...progress.log,{action,time:date()}].slice(-150)})}
 function visit(id:string){if(!pages.some(p=>p.id===id))return;setPage(id);setCapturePrompt(false);setCaptureNote('');setHistory(h=>[...h,id].slice(-40));setTab(ts=>ts.includes(id)?ts:[...ts,id]);setFeedback('')}
 async function capture(){
  if(page==='search')return setFeedback('Open a source page before preserving evidence.');
  if(captureNote.trim().length<15)return setFeedback('Write a source-specific evidence description (at least 15 characters).');
  const content=JSON.stringify({url:current.url,title:current.title,source:current.source,body:current.body});
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(content));
  const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  store({...progress,captures:[...new Set([...progress.captures,page])],notes:{...progress.notes,[page]:captureNote.trim()},hashes:{...progress.hashes,[page]:hash},log:[...progress.log,{action:'Captured '+current.url+' — SHA-256 '+hash+' — '+captureNote.trim(),time:date()}].slice(-150)});
  setCapturePrompt(false);setCaptureNote('');setFeedback('Evidence captured with its URL, simulated-source SHA-256 digest and time recorded in the notebook.');
 }
 function complete(){
  if(done){if(mission<osintMissions.length-1)setMission(m=>m+1);else onNext();return}
  let why='';
  if(task.id==='workstation'&&!(setupChoices.filter(x=>x.safe).every(x=>setup.includes(x.id))&&!setupChoices.filter(x=>!x.safe).some(x=>setup.includes(x.id))))why='Select the three authorised safeguards and exclude the three unsafe actions.';
  if(task.id==='search'&&!progress.captures.includes('registry'))why='Find and preserve the fictional company registry record.';
  if(task.id==='social'&&!(progress.captures.includes('social')&&progress.captures.includes('news')))why='Preserve both the synthetic public profile and the related news source.';
  if(task.id==='network'&&!progress.captures.includes('domain'))why='Preserve the simulated domain registration and DNS result.';
  if(task.id==='evidence'&&(progress.captures.length<3||progress.captures.some(id=>(progress.notes[id]||'').length<15)))why='Preserve at least three sources, each with a meaningful evidence description.';
  if(task.id==='report'&&!(report.findings.trim().length>=75&&report.limitations.trim().length>=55&&report.steps.trim().length>=55))why='Write substantial findings (75+ characters), limitations and lawful next steps (55+ characters each).';
  if(why){setFeedback(why);return}
  store({...progress,completed:[...new Set([...progress.completed,task.id])],notes:{...progress.notes,...(task.id==='report'?{'final-findings':report.findings,'final-limitations':report.limitations,'final-steps':report.steps}: {})},log:[...progress.log,{action:'Completed OSINT mission '+task.id,time:date()}].slice(-150)});
  setFeedback('Mission completed. Your investigation progress was saved in this browser.');
 }
 function downloadDossier(){
  const bundle={notice:'Simulated training records only — not independently verified forensic evidence',exportedAt:date(),missions:progress.completed,evidence:captured.map(c=>({id:c.id,url:c.url,title:c.title,source:c.source,content:c.body,sha256:progress.hashes[c.id]||'not hashed',note:progress.notes[c.id]||''})),log:progress.log,report:{findings:progress.notes['final-findings']||report.findings,limitations:progress.notes['final-limitations']||report.limitations,nextSteps:progress.notes['final-steps']||report.steps}};
  const url=URL.createObjectURL(new Blob([JSON.stringify(bundle,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='AMLVERSE_OSINT_training_dossier.json';a.click();URL.revokeObjectURL(url);
 }
 function switchMission(i:number){if(i>0&&!progress.completed.includes(osintMissions[i-1].id)){setFeedback('Complete the previous mission to unlock this practical task.');return}setMission(i);setFeedback('')}
 const available=mission===0||progress.completed.includes(osintMissions[mission-1].id);
 return <main className="osintlab">
  <button type="button" className="back" onClick={onBack}>← Academy overview</button>
  <div className="osintheader"><div><span className="eyebrow">WORLD 01 · OSINT LEARNING SIMULATION</span><h1>OSINT Investigation & Digital Evidence Lab</h1><p>Start with guided beginner-to-advanced lessons, then apply the skills in a fictional browser-based investigation.</p></div><div className="osintscore"><strong>{readGuidedProgress().completed.length+progress.completed.length} / {guidedLessons.length+osintMissions.length}</strong><span>Learning activities complete</span></div></div>
  <div className="osintlearningtabs"><button type="button" className={mode==='guided'?'active':''} onClick={()=>setMode('guided')}>📖 Guided lessons · {readGuidedProgress().completed.length}/{guidedLessons.length}</button><button type="button" className={mode==='missions'?'active':''} disabled={!guidedComplete()&&progress.completed.length===0} onClick={()=>setMode('missions')}>🧭 Independent missions · {progress.completed.length}/{osintMissions.length}{!guidedComplete()&&progress.completed.length===0?' · Locked':''}</button></div>
  {mode==='guided'?<OsintGuidedAcademy onMissions={()=>setMode('missions')}/>:null}
  {mode==='missions'?<>
  
  <div className="osintbanner">SIMULATED NETWORK ONLY · Fictional people and entities · No live social-media accounts or external navigation · Progress stored locally</div>
  <div className="osintworkspace">
   <aside className="osinttasks"><h2>Investigation tasks</h2><p>Complete tasks in sequence. Return to earlier tasks at any time.</p>{osintMissions.map((m,i)=><button type="button" key={m.id} className={'osinttask'+(i===mission?' active':'')} disabled={i>0&&!progress.completed.includes(osintMissions[i-1].id)} onClick={()=>switchMission(i)}><span>{progress.completed.includes(m.id)?'✓':i>0&&!progress.completed.includes(osintMissions[i-1].id)?'🔒':i+1}</span><span><strong>{m.title}</strong><small>{m.subtitle}</small></span></button>)}<div className="osinttaskprogress"><div style={{width:progress.completed.length/osintMissions.length*100+'%'}}/></div><p>{progress.completed.length} of {osintMissions.length} missions completed</p></aside>
   <section className="osintmission"><span className="eyebrow">PRACTICAL MISSION {mission+1} / {osintMissions.length}</span><h2>{task.title}</h2><p className="osintgoal">{task.goal}</p>
   {task.type==='setup'?<div className="osintsetup"><p><strong>Workstation setup exercise.</strong> Select only the three appropriate safeguards for an authorised public-source investigation.</p>{setupChoices.map(ch=><label key={ch.id} className={'osintchoice'+(setup.includes(ch.id)?' chosen':'')}><input type="checkbox" checked={setup.includes(ch.id)} onChange={e=>setSetup(items=>e.target.checked?[...items,ch.id]:items.filter(x=>x!==ch.id))}/>{ch.label}</label>)}<p className="osinttip">Privacy mode alone does not prevent website-side logging or guarantee anonymity. Permissions, scope and evidence preservation must be deliberate.</p></div>:null}
   {(['browser','evidence'] as string[]).includes(task.type)?<div className="osintbrief"><strong>Investigation: Operation Meridian (fictional)</strong><p>Tasking: A publicly described logistics company may be associated with a disputed procurement delivery. Verify what publicly available records actually support. Distinguish statements, independent corroboration and attribution gaps.</p></div>:null}
   {task.type!=='setup'&&task.type!=='report'?<div className="osintbrowser">
    <div className="osintbrowsertop"><div className="osintbrowserdots" aria-hidden="true">● ● ●</div><strong>AMLVERSE Evidence Browser</strong><span>TRAINING SANDBOX</span></div>
    <div className="osinttabs">{tab.map(t=>{const p=pages.find(x=>x.id===t)!;return <button type="button" key={t} className={page===t?'active':''} onClick={()=>visit(t)}>{p.title.slice(0,20)}</button>})}</div>
    <div className="osintaddress"><button type="button" aria-label="Back to previous page" onClick={()=>{if(history.length>1){setPage(history[history.length-2]);setHistory(h=>h.slice(0,-1))}}}>←</button><button type="button" onClick={()=>visit('search')} aria-label="Open simulated search engine">⌂</button><span>🔒 https://{current.url}</span></div>
    <div className="osintpage">
     {page==='search'?<><h3>OSINT Search</h3><p>Search for fictional companies, directors, public posts and technical records. Results come from this closed training dataset.</p><form onSubmit={e=>{e.preventDefault();setSearched(query);setFeedback('');log('Search: '+query)}}><input aria-label="Search simulated web" placeholder='Try "Meridian Aid" or RC802116' value={query} onChange={e=>setQuery(e.target.value)}/><button className="primary" type="submit">Search</button></form>{searched?<div className="osintresults"><strong>{results.length} simulated results for “{searched}”</strong>{results.length?results.map(p=><button type="button" key={p.id} onClick={()=>visit(p.id)}><strong>{p.title}</strong><small>https://{p.url}</small><span>{p.body.slice(0,165)}…</span></button>):<p>No matching indexed documents. Try fewer keywords or a different spelling.</p>}</div>:null}</>:<><span className="eyebrow">{current.source}</span><h3>{current.title}</h3><p>{current.body}</p><div className="osintwebmeta"><span>TRAINING SOURCE</span><span>Captured content may be incomplete or self-reported</span></div><h4>Related records</h4><div className="osintlinks">{current.links.map(id=><button type="button" key={id} onClick={()=>visit(id)}>{pages.find(p=>p.id===id)?.title} →</button>)}</div><div className="osintcapture"><button className="primary" type="button" onClick={()=>setCapturePrompt(p=>!p)}>＋ Preserve this source in Evidence Vault</button>{progress.captures.includes(page)?<span>✓ Captured</span>:null}</div>{capturePrompt?<div className="osintcaptureform"><label htmlFor="osint-note">What does this source show, and what does it not establish?</label><textarea id="osint-note" value={captureNote} onChange={e=>setCaptureNote(e.target.value)} rows={3} placeholder="Record a specific observation, the source's limitations, and why it is relevant."/><button type="button" onClick={capture} className="primary">Save evidence with timestamp</button></div>:null}</>}
    </div></div>:null}
   {task.type==='evidence'||task.type==='report'?<section className="osintvault"><h3>Evidence Vault</h3><p>Each captured record contains its original fictional URL, your description and a timestamped action log. This is a training record, not a forensic-grade collection system.</p>{captured.length?<div className="osintevidence">{captured.map((c,i)=><article key={c.id}><strong>EXH-{String(i+1).padStart(3,'0')} · {c.title}</strong><small>https://{c.url}</small><p>{progress.notes[c.id]}</p><small>SHA-256 (synthetic source snapshot): {progress.hashes[c.id]||'Not available'}</small></article>)}</div>:<p>No evidence captured. Navigate to fictional sources and select Preserve.</p>}<button type="button" className="secondary" onClick={downloadDossier}>Download training evidence dossier (JSON) ↓</button><details><summary>Investigation action log ({progress.log.length})</summary><div className="osintlog">{progress.log.map((x,i)=><p key={i}><time>{x.time}</time> · {x.action}</p>)}</div></details></section>:null}
   {task.type==='report'?<div className="osintreport"><p>Write an intelligence assessment. Separate corroborated observations from inferences, note important limitations, and propose proportionate lawful follow-up. This exercise checks completion and length; it does not independently verify analytical accuracy.</p>{([{key:'findings',label:'Evidence-supported findings',hint:'Summarise which company, social and domain records were obtained, how they relate, and what each shows.'},{key:'limitations',label:'Alternative explanations and evidential limitations',hint:'Which sources are self-reported, and what cannot be inferred about ownership, wrongdoing or identity?'},{key:'steps',label:'Proportionate next investigative steps',hint:'Describe source verification, records preservation, and any lawful information requests.'}] as const).map(f=><label key={f.key}>{f.label}<small>{f.hint}</small><textarea value={report[f.key]} rows={5} onChange={e=>setReport(p=>({...p,[f.key]:e.target.value}))}/></label>)}<p className="osinttip">Preserve your findings before relying on them. Learner-generated drafts remain in this browser.</p></div>:null}
   {feedback?<p role="status" className="osintfeedback">{feedback}</p>:null}
   <div className="osintactions"><button type="button" className="primary" disabled={!available} onClick={complete}>{done?mission===osintMissions.length-1?'Continue to Virtual Assets →':'Next mission →':'Check task and complete →'}</button>{mission>0?<button type="button" className="secondary" onClick={()=>switchMission(mission-1)}>← Previous task</button>:null}</div>
   {progress.completed.length===osintMissions.length?<p className="osintsuccess">✓ All OSINT practical missions completed. Your next learning world is Virtual Assets & Blockchain Investigation.</p>:null}
   </section>
  </div></>:null}
 <p className="osintdisclaimer">AMLVERSE independently authored fictional educational exercises. No live browsing, private account access, real-person profiling or certified evidence preservation is performed here.</p>
 </main>;
}
