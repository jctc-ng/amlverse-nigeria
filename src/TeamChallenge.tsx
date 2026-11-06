import {useEffect,useMemo,useState} from 'react';

type RoleId='fiu'|'investigator'|'supervisor'|'prosecutor';
type Role={id:RoleId;name:string;mission:string;brief:string;signal:string;prompt:string};
type Assessment={rating:number;confidence:number;reason:string};
type TeamRecord=Partial<Record<RoleId,Assessment>>;
const roles:Role[]=[
{id:'fiu',name:'Financial Intelligence Unit',mission:'Analyse financial flows',brief:'Synthetic STR analysis identifies repeated rapid transfers among unrelated payment accounts.',signal:'Evidence suggests ML threat exposure, but no crime is established by this indicator alone.',prompt:'How strongly does the available financial intelligence support a sector-level risk concern?'},
{id:'investigator',name:'Law Enforcement',mission:'Assess investigative patterns',brief:'Fictional investigative files show several suspected fraud-linked networks using payments intermediaries.',signal:'Intelligence leads do not prove guilt; investigate predicate crime and laundering indicators.',prompt:'How serious is the investigative threat pattern in this fictional sector?'},
{id:'supervisor',name:'Financial Supervisor',mission:'Evaluate preventive controls',brief:'A simulated supervisory review finds uneven beneficial ownership verification and delayed unusual-transaction alerts.',signal:'Weak controls may increase vulnerability, even when current offending cannot be directly measured.',prompt:'To what extent do these weaknesses increase sector vulnerability?'},
{id:'prosecutor',name:'Prosecution / Legal',mission:'Examine outcomes and safeguards',brief:'Fictional court records show limited asset recovery despite complex and high-value cross-border transfers.',signal:'Outcomes can help evaluate consequences and effectiveness, but must be interpreted in context.',prompt:'How consequential are these concerns, considering evidence limitations?'}
];
const instructions=['Select a role','Read its evidence','Record a rating and rationale','Rotate through all four roles','Agree a consensus and review feedback'];
const key='amlverse-nra-v1';
function load():TeamRecord{try{const v=JSON.parse(localStorage.getItem(key)||'{}');return v&&typeof v==='object'?v:{};}catch{return {};}}
function label(n:number){return ['','Very low','Low','Moderate','High','Very high'][n]||'Not rated';}
function getSummary(record:TeamRecord,finalScore:number,finalRationale:string){
 const vals=roles.map(r=>record[r.id]?.rating).filter((v):v is number=>typeof v==='number');
 const avg=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;
 const spread=vals.length?Math.max(...vals)-Math.min(...vals):0;
 const consensus=spread<=1?'Fairly aligned':spread===2?'Some disagreement':'Significant disagreement';
 const confidence=roles.reduce((a,r)=>a+(record[r.id]?.confidence||0),0)/(vals.length||1);
 return {avg,spread,consensus,confidence,text:[
'AMLVERSE NIGERIA — SIMULATED INTERAGENCY RISK ASSESSMENT','Fictional sector: Cross-border payment intermediaries',
'PURPOSE: Educational exercise only. Not an official NRA or NFIU risk assessment.','',
...roles.flatMap(r=>{const a=record[r.id];return [
r.name,'Evidence: '+r.brief,'Assessment: '+(a?label(a.rating)+' ('+a.rating+'/5)':'Not submitted'),
'Confidence: '+(a?a.confidence+'/5':'Not submitted'),'Reasoning: '+(a?.reason||'Not submitted'),''];}),
'DISCUSSION','Mean submitted assessment: '+avg.toFixed(1)+'/5','Rating difference (max - min): '+spread,
'Degree of agreement: '+consensus,'Average evidence confidence: '+confidence.toFixed(1)+'/5',
'CONSENSUS','Agreed training rating: '+label(finalScore)+' ('+finalScore+'/5)',
'Consensus justification: '+finalRationale,'',
'REVIEW NOTE: Ratings are simplified educational judgements for role-playing. Real risk assessments require validated data, clearly defined methodology, safeguards, uncertainty analysis, and documented institutional approval.',
'Source for further study: https://www.fatf-gafi.org/en/publications/Methodsandtrends/Money-Laundering-National-Risk-Assessment-Guidance.html'
].join('\n')};
}
export default function TeamChallenge({onBack}:{onBack:()=>void}){
 const [record,setRecord]=useState<TeamRecord>(load);
 const [current,setCurrent]=useState<RoleId>('fiu');
 const [rating,setRating]=useState(3);
 const [confidence,setConfidence]=useState(3);
 const [reason,setReason]=useState('');
 const [stage,setStage]=useState<'roles'|'consensus'|'debrief'>('roles');
 const [agreed,setAgreed]=useState(3);
 const [agreement,setAgreement]=useState('');
 const [copied,setCopied]=useState(false);
 const [notice,setNotice]=useState('');
 const active=roles.find(r=>r.id===current)!;
 const finished=roles.every(r=>record[r.id]&&record[r.id]!.reason.trim().length>=30);
 const result=useMemo(()=>getSummary(record,agreed,agreement),[record,agreed,agreement]);
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(record))}catch{}},[record]);
 function choose(id:RoleId){setCurrent(id);const old=record[id];setRating(old?.rating||3);setConfidence(old?.confidence||3);setReason(old?.reason||'');setStage('roles');setCopied(false);}
 function saveRole(){setRecord(prev=>({...prev,[current]:{rating,confidence,reason:reason.trim()}}));setNotice('Role assessment saved on this device.');const i=roles.findIndex(r=>r.id===current);const next=roles.slice(i+1).concat(roles.slice(0,i)).find(r=>!record[r.id]);if(next){choose(next.id)}else{setStage('roles')}}
 function reset(){if(!window.confirm('Clear this fictional team exercise on this device?'))return;setRecord({});setCurrent('fiu');setRating(3);setConfidence(3);setReason('');setAgreement('');setAgreed(3);setStage('roles');setNotice('Exercise reset.')}
 function exportReport(){const blob=new Blob([result.text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='amlverse-interagency-risk-challenge.txt';a.click();URL.revokeObjectURL(url)}
 async function copyReport(){try{await navigator.clipboard.writeText(result.text);setCopied(true)}catch{setNotice('Clipboard unavailable. Please use Download report instead.')}}
 return <main className="narrow teamchallenge">
 <button className="back" onClick={onBack}>← Academy overview</button>
 <span className="eyebrow">NATIONAL RISK ASSESSMENT CHALLENGE • SINGLE-DEVICE SIMULATION</span>
 <h1 className="title">The Interagency Risk Room</h1>
 <p className="lead">Take turns playing four institutional roles. Review separate evidence, record independent judgements, resolve differences and produce a simulated risk assessment report.</p>
 <div className="notice"><b>Training only.</b> All evidence is fictional. This is role rotation on one device—not real-time collaboration. No real institutional, personal or case information should be entered.</div>
 <div className="teamprogress">{roles.map(r=><button key={r.id} type="button" className={record[r.id]?'done':current===r.id&&stage==='roles'?'active':''} onClick={()=>choose(r.id)}><span>{record[r.id]?'✓':'○'}</span>{r.name}</button>)}</div>
 {stage==='roles'?<>
 <div className="situation"><small>{active.name.toUpperCase()} • {active.mission.toUpperCase()}</small><p>{active.brief}</p><p><b>Analytical caution:</b> {active.signal}</p></div>
 <h2 className="question">{active.prompt}</h2>
 <div className="teamrating"><label htmlFor="team-rating">Risk judgement: <strong>{rating}/5 — {label(rating)}</strong></label><input id="team-rating" type="range" min="1" max="5" value={rating} onChange={e=>setRating(Number(e.target.value))}/><div className="teamscale"><span>Very low</span><span>Very high</span></div></div>
 <div className="teamrating"><label htmlFor="team-confidence">Confidence in the evidence: <strong>{confidence}/5</strong></label><input id="team-confidence" type="range" min="1" max="5" value={confidence} onChange={e=>setConfidence(Number(e.target.value))}/><div className="teamscale"><span>Weak evidence</span><span>Strong evidence</span></div></div>
 <label className="riskreason"><b>Explain your judgement (minimum 30 characters)</b><textarea rows={5} maxLength={1200} value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reference the given fictional evidence, explain uncertainty and describe what additional evidence would help."/></label>
 <div className="actions"><button className="primary" disabled={reason.trim().length<30} onClick={saveRole}>Save role assessment →</button>{finished?<button className="secondary" onClick={()=>{setStage('consensus');setNotice('')}}>Open consensus room →</button>:null}</div>
 {notice?<p className="modehint" role="status">{notice}</p>:null}
 <div className="lessonbox"><small>FACILITATOR NOTES</small><p>Participants can rotate through the roles, or one learner can play all four. Each role is evaluated on different evidence dimensions, so numerical ratings alone are not directly comparable.</p></div>
 </>:stage==='consensus'?<>
 <h2 className="question">Compare evidence and negotiate a consensus</h2>
 <div className="teamcards">{roles.map(r=>{const a=record[r.id];return <div key={r.id} className="teamcard"><small>{r.name}</small><strong>{a?label(a.rating):'Pending'} {a?'('+a.rating+'/5)':''}</strong><p>{r.brief}</p><p><b>Reasoning:</b> {a?.reason||'Not submitted'}</p><span>Evidence confidence: {a?.confidence||0}/5</span></div>})}</div>
 <div className="situation"><small>DISCUSSION PROMPT</small><p>Ratings differ by {result.spread} points. {result.consensus}. Discuss what each role measures, where the evidence is insufficient and why the final integrated risk judgement may differ from any individual score.</p></div>
 <div className="teamrating"><label htmlFor="team-consensus">Agreed overall training rating <strong>{agreed}/5 — {label(agreed)}</strong></label><input id="team-consensus" type="range" min="1" max="5" value={agreed} onChange={e=>setAgreed(Number(e.target.value))}/></div>
 <label className="riskreason"><b>Record the team's consensus justification</b><textarea rows={5} maxLength={1500} value={agreement} onChange={e=>setAgreement(e.target.value)} placeholder="Summarise the threat, vulnerabilities, consequences, control effectiveness, uncertainty and reasons for the agreed assessment."/></label>
 <div className="actions"><button className="primary" disabled={!finished||agreement.trim().length<50} onClick={()=>setStage('debrief')}>Finalise training report →</button><button className="secondary" onClick={()=>setStage('roles')}>← Return to role assessments</button></div>
 </>:<>
 <div className="resultpanel"><span className="resultstar">★</span><span className="eyebrow">SIMULATED INTERAGENCY REVIEW</span><h2>{label(agreed)} risk judgement</h2><p>Four roles completed • Agreement: {result.consensus}</p><strong>Average evidence confidence: {result.confidence.toFixed(1)}/5</strong></div>
 <div className="lessonbox"><small>FACILITATOR DEBRIEF</small><h2>Learning outcomes</h2><p><b>Evidence:</b> Each institution supplied a different perspective. Assess whether each claim was properly supported and identify missing information.</p><p><b>Method:</b> These role scores cover different dimensions; averaging them is not an official risk methodology and the displayed mean is only a discussion aid.</p><p><b>Uncertainty:</b> Review whether the final narrative explains limitations and differences of opinion.</p><p><b>Mitigation:</b> Consider targeted monitoring, beneficial ownership checks and lawful information exchange.</p><p><b>Team rationale:</b> {agreement}</p><a href="https://www.fatf-gafi.org/en/publications/Methodsandtrends/Money-Laundering-National-Risk-Assessment-Guidance.html" target="_blank" rel="noopener noreferrer">FATF national risk assessment guidance ↗</a></div>
 <div className="actions"><button className="primary" onClick={exportReport}>Download training report (.txt) ↓</button><button className="secondary" onClick={()=>{void copyReport()}}>{copied?'Copied!':'Copy report'}</button><button className="secondary" onClick={()=>setStage('consensus')}>Edit consensus</button></div>
 {notice?<p className="modehint" role="status">{notice}</p>:null}
 </>}
 <div className="actions"><button className="secondary" onClick={reset}>Reset fictional exercise</button></div>
 <p className="modehint">Progress is stored only in this browser. No accounts, remote synchronisation or official scoring are included in this prototype.</p>
 </main>;
}
