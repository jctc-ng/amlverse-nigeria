import {useState} from 'react';
import {IMPACT_ASSESSMENTS,IMPACT_ITEMS_PER_FORM,IMPACT_RUBRIC} from './CompetencyAssessmentData';
import type {ImpactPhase} from './CompetencyAssessmentData';
import {impactCsv,impactDelta,impactItems,impactReport,readImpact,resetImpact,scoreImpact,storeImpact} from './CompetencyImpactStore';
import type {ImpactAnswer,ImpactRecord} from './CompetencyImpactStore';
import {readAcademyMetrics} from './AcademyMetrics';

function downloadFile(contents:string,name:string,type:string){
 const blob=new Blob([contents],{type});
 const url=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function signed(n:number){return (n>0?'+':'')+n}
function confidenceLabel(n:1|2|3){return n===1?'Low':n===2?'Medium':'High'}
export default function CompetencyImpact({onBack,onLearn}:{onBack:()=>void;onLearn:()=>void}){
 const [record,setRecord]=useState<ImpactRecord>(readImpact);
 const [phase,setPhase]=useState<ImpactPhase|null>(null);
 const [index,setIndex]=useState(0);
 const [draft,setDraft]=useState<ImpactAnswer[]>([]);
 const [selected,setSelected]=useState<number|null>(null);
 const [confidence,setConfidence]=useState<1|2|3|null>(null);
 const [storageError,setStorageError]=useState(false);
 const [resetOpen,setResetOpen]=useState(false);
 const [resetPhrase,setResetPhrase]=useState('');
 const [reviewOpen,setReviewOpen]=useState(false);
 const [reportReady,setReportReady]=useState(false);
 const activity=readAcademyMetrics();
 const delta=impactDelta(record);
 const items=phase?impactItems(phase):[];
 const item=items[index];
 function startAssessment(next:ImpactPhase){
  if(next==='followup'&&!record.baseline)return;
  if((next==='baseline'&&record.baseline)||(next==='followup'&&record.followup))return;
  setPhase(next);setIndex(0);setDraft([]);setSelected(null);setConfidence(null);setReportReady(false);window.scrollTo(0,0);
 }
 function submitAnswer(){
  if(!phase||selected===null||confidence===null)return;
  const response={itemId:item.id,selected,confidence};
  const nextDraft=[...draft,response];
  if(index<items.length-1){
   setDraft(nextDraft);setIndex(i=>i+1);setSelected(null);setConfidence(null);window.scrollTo(0,0);return;
  }
  const score=scoreImpact(phase,nextDraft,activity.done,activity.total);
  const updated=phase==='baseline'?{version:record.version,baseline:score}:{...record,followup:score};
  setStorageError(!storeImpact(updated));setRecord(updated);setPhase(null);setDraft([]);setSelected(null);setConfidence(null);window.scrollTo(0,0);
 }
 function reset(){
  if(resetPhrase!=='RESET')return;
  setStorageError(!resetImpact());setRecord({version:record.version});setPhase(null);setDraft([]);setResetOpen(false);setResetPhrase('');setReportReady(false);
 }
 function exportReport(as:'json'|'csv'){
  const filename='amlverse-competency-individual-'+(record.followup?'comparison':'baseline')+'.'+as;
  downloadFile(as==='json'?JSON.stringify(impactReport(record),null,2):impactCsv(record),filename,as==='json'?'application/json;charset=utf-8':'text/csv;charset=utf-8');
  setReportReady(true);
 }
 const measured=record.baseline&&record.followup;
 const newActivities=measured?record.followup!.learningMilestones-record.baseline!.learningMilestones:null;
 return <main className="impactpage" aria-label="Professional competency and impact evaluation">
  <button type="button" className="back" onClick={onBack}>← Academy overview</button>
  <div className="impacthero"><div><span className="eyebrow">AMLVERSE · PROFESSIONAL LEARNING EVALUATION</span><h1>Competency & Learning Impact Lab</h1><p>Explore six applied reasoning domains through comparable baseline and follow-up exercises. Understand what your answers show, where uncertainty remains, and how to describe learning changes without overstating evidence.</p><div className="impactherofoot"><span>12 decisions per form</span><span>6 competencies</span><span>Private browser-only record</span></div></div><span className="impactheroart" aria-hidden="true">◎</span></div>
  <div className="impactstatrow"><div><small>BASELINE</small><strong>{record.baseline?record.baseline.overall+'%':'Not started'}</strong><span>{record.baseline?record.baseline.correct+' / 12 correct':'First independent assessment'}</span></div><div><small>FOLLOW-UP</small><strong>{record.followup?record.followup.overall+'%':'Not started'}</strong><span>{record.followup?record.followup.correct+' / 12 correct':'After learning activities'}</span></div><div><small>OBSERVED CHANGE</small><strong>{delta===null?'Not available':signed(delta)+' pp'}</strong><span>Descriptive percentage-point difference</span></div></div>
  {storageError?<div className="impactwarning" role="alert">Your browser did not confirm that this assessment was saved. Export a copy and check that browser storage is available before closing the page.</div>:null}
  {phase&&item?<section className="impactassessment" aria-label={phase==='baseline'?'Baseline assessment':'Follow-up assessment'}>
   <div className="impactassessmenthead"><span className="eyebrow">{phase==='baseline'?'BASELINE · BEFORE ADDITIONAL PRACTICE':'FOLLOW-UP · AFTER LEARNING'}</span><strong>Question {index+1} of {items.length}</strong></div>
   <div className="impacttrack" role="progressbar" aria-valuenow={index} aria-valuemin={0} aria-valuemax={items.length} aria-label="Assessment questions completed"><div style={{width:(index/items.length*100)+'%'}}/></div>
   <div className="impactquestiondomain"><small>COMPETENCY</small><strong>{item.domainName}</strong></div>
   <h2>{item.prompt}</h2>
   <div className="impactoptions" role="group" aria-label="Select the best professional decision">{item.options.map((o,i)=><button key={i} type="button" aria-pressed={selected===i} className={selected===i?'selected':''} onClick={()=>setSelected(i)}><span>{String.fromCharCode(65+i)}</span><span>{o}</span></button>)}</div>
   <fieldset className="impactconfidence"><legend>How confident are you in this decision?</legend><div>{([1,2,3] as const).map(c=><label key={c} className={confidence===c?'chosen':''}><input type="radio" name="confidence" checked={confidence===c} onChange={()=>setConfidence(c)}/>{confidenceLabel(c)}</label>)}</div></fieldset>
   <p className="impactmethodnote">Your answers and confidence rating are recorded separately. Correct answers are intentionally not revealed during the baseline or follow-up test, to preserve the comparison.</p>
   <div className="impactquestionactions"><button type="button" className="primary" disabled={selected===null||confidence===null} onClick={submitAnswer}>{index===items.length-1?'Submit completed assessment →':'Save decision & continue →'}</button><button type="button" className="secondary" onClick={()=>{setPhase(null);setDraft([]);setSelected(null);setConfidence(null)}}>Leave assessment (discard unfinished answers)</button></div>
  </section>:<>
   <section className="impactjourney" aria-label="Evaluation sequence"><div className={'impactstep '+(record.baseline?'done':'active')}><div className="impactstepnumber">{record.baseline?'✓':'1'}</div><div><h2>Baseline evaluation</h2><p>Complete 12 fictional reasoning decisions <strong>before beginning additional AMLVERSE practice</strong>.</p><small>{record.baseline?'Completed · '+new Date(record.baseline.completedAt).toLocaleDateString(): 'Available now'}</small></div><button type="button" className="primary" disabled={!!record.baseline} onClick={()=>startAssessment('baseline')}>{record.baseline?'Baseline saved':'Start baseline →'}</button></div>
   <div className="impactpathline" aria-hidden="true"/>
   <div className={'impactstep '+(record.baseline?'active':'locked')}><div className="impactstepnumber">2</div><div><h2>Complete learning activities</h2><p>Study relevant learning towns, practise decisions and review the principles. Your saved world milestones are counted at both assessment points.</p><small>{activity.done}/{activity.total} world milestones currently recorded</small></div><button type="button" className="secondary" onClick={onLearn}>Explore learning town →</button></div>
   <div className="impactpathline" aria-hidden="true"/>
   <div className={'impactstep '+(record.followup?'done':record.baseline?'active':'locked')}><div className="impactstepnumber">{record.followup?'✓':'3'}</div><div><h2>Follow-up evaluation</h2><p>Answer 12 different but similarly scoped fictional decisions across the same six domains. Complete the baseline first.</p><small>{record.followup?'Completed · '+new Date(record.followup.completedAt).toLocaleDateString():record.baseline?'Available · use after learning activities':'Complete baseline to unlock'}</small></div><button type="button" className="primary" disabled={!record.baseline||!!record.followup} onClick={()=>startAssessment('followup')}>{record.followup?'Follow-up saved':record.baseline?'Start follow-up →':'🔒 Complete baseline first'}</button></div></section>
   {record.baseline&&!record.followup?<div className="impactnotice"><strong>Baseline recorded.</strong> Your baseline score is {record.baseline.overall}%. The follow-up is available, but for an interpretable learning comparison you should complete relevant training before taking it. Questions and correct answers are withheld until both forms are finished.</div>:null}
   {measured?<section className="impactcomparison" aria-label="Competency comparison"><div className="impactsectionheading"><span className="eyebrow">DESCRIPTIVE INDIVIDUAL COMPARISON</span><h2>Six-domain learning profile</h2><p>Scores are based on only two questions in each domain, so individual percentages are coarse and should not be treated as professional competence ratings.</p></div>
   <div className="impactdelta"><span>Observed score difference</span><strong>{signed(delta!)} percentage points</strong><p>{delta!>0?'The follow-up score is higher than baseline. This does not establish the training caused the change.':delta!<0?'The follow-up score is lower than baseline. This does not establish a loss of professional competence.':'No overall score change was observed between these forms.'}</p></div>
   <div className="impactdomains">{IMPACT_ASSESSMENTS.map(d=><article key={d.id}><div className="impactdomainheader"><h3>{d.title}</h3><strong>{signed(record.followup!.domainScores[d.id]-record.baseline!.domainScores[d.id])} pp</strong></div><p>{d.short}</p><div className="impactdomainmeter"><span>Baseline</span><div className="impacttrack"><div className="baseline" style={{width:record.baseline!.domainScores[d.id]+'%'}}/></div><small>{record.baseline!.domainScores[d.id]}%</small></div><div className="impactdomainmeter"><span>Follow-up</span><div className="impacttrack"><div style={{width:record.followup!.domainScores[d.id]+'%'}}/></div><small>{record.followup!.domainScores[d.id]}%</small></div></article>)}</div>
   <div className="impactactivity"><h3>Learning activity recorded between assessments</h3><p>Baseline: {record.baseline!.learningMilestones} milestones · Follow-up: {record.followup!.learningMilestones} milestones</p><strong>{newActivities!>0?signed(newActivities!)+' additional milestones recorded':newActivities===0?'No additional learning milestones recorded':'Milestone count decreased, possibly due to a course reset'}</strong><small>Milestone counts are a local activity proxy, not verified attendance, learning time or a controlled intervention.</small></div>
   <button type="button" className="secondary" onClick={()=>setReviewOpen(v=>!v)} aria-expanded={reviewOpen}>{reviewOpen?'Hide detailed reasoning review':'Review answers and rationale for each domain'} ↓</button>
   {reviewOpen?<div className="impactreview">{IMPACT_ASSESSMENTS.map(d=><article key={d.id}><h3>{d.title}</h3>{(['baseline','followup'] as const).map(p=>{const result=record[p]!;return <div key={p}><h4>{p==='baseline'?'Baseline':'Follow-up'}</h4>{d.forms[p].map(q=>{const ans=result.answers.find(a=>a.itemId===q.id)!;return <div className="impactreviewitem" key={q.id}><b>{ans.selected===q.answer?'✓ Correct':'○ Further review needed'} · {q.prompt}</b><p><strong>Selected:</strong> {q.options[ans.selected]}</p><p><strong>Best response:</strong> {q.options[q.answer]}</p><p>{q.rationale}</p><small>Confidence reported: {confidenceLabel(ans.confidence)}</small></div>})}</div>})}</article>)}</div>:null}
   </section>:null}
   <section className="impactrubric"><div className="impactsectionheading"><span className="eyebrow">PUBLISHED SCORING METHOD</span><h2>Transparent rubric and limitations</h2></div><div className="impactrubriclist">{IMPACT_RUBRIC.map((text,i)=><div key={i}><span>{i+1}</span><p>{text}</p></div>)}</div></section>
   <section className="impactprivacy"><div><span className="eyebrow">LOCAL RESULTS · VOLUNTARY EXPORT</span><h2>Download a research-ready individual record</h2><p>The reports include domain scores, overall percentages, assessment dates and measurement caveats. They do not include names, emails, IP addresses, real case content, organisation affiliations or a group-level effectiveness claim. Nothing is uploaded by this feature.</p><div className="impactexportactions"><button type="button" className="primary" disabled={!record.baseline} onClick={()=>exportReport('csv')}>Download summary CSV ↓</button><button type="button" className="secondary" disabled={!record.baseline} onClick={()=>exportReport('json')}>Download methodology JSON ↓</button></div>{reportReady?<small role="status">Your individual learning record was prepared for download. Review its limitations before sharing or aggregating.</small>:null}</div></section>
   <section className="impactreset"><h2>Reset competency evaluation</h2><p>This affects only this device's baseline and follow-up evaluation records. Your learning town, FATF Quest, Capstone and existing game progress will remain unchanged.</p><button className="secondary" type="button" onClick={()=>{setResetOpen(v=>!v);setResetPhrase('')}}>{resetOpen?'Cancel reset':'↻ Reset evaluation'}</button>{resetOpen?<div className="townresetconfirm"><h3>Confirm evaluation reset</h3><label htmlFor="impact-reset">Type <strong>RESET</strong> to remove both saved forms</label><input id="impact-reset" value={resetPhrase} onChange={e=>setResetPhrase(e.target.value)} placeholder="RESET" autoComplete="off"/><div className="townresetactions"><button type="button" className="townresetdanger" disabled={resetPhrase!=='RESET'} onClick={reset}>Delete evaluation results</button><button type="button" className="secondary" onClick={()=>setResetOpen(false)}>Keep my results</button></div></div>:null}</section>
  </>}
  <div className="impactdisclaimer"><strong>Research safeguard:</strong> This is an individual formative exercise and pilot-ready measurement framework—not an independently validated test, a law-enforcement qualification, a causal impact study or a source of institutional accreditation. A credible multi-person evaluation requires external expert review, sampling/consent procedures, reliable study controls and independent analysis.</div>
 </main>;
}
