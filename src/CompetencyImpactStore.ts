import {IMPACT_ASSESSMENTS,IMPACT_ITEMS_PER_FORM,IMPACT_VERSION} from './CompetencyAssessmentData';
import type {ImpactPhase,CompetencyDomain} from './CompetencyAssessmentData';
export type ImpactAnswer={itemId:string;selected:number;confidence:1|2|3};
export type ImpactResult={phase:ImpactPhase;completedAt:string;answers:ImpactAnswer[];overall:number;domainScores:Record<CompetencyDomain,number>;correct:number;learningMilestones:number;learningMilestoneTotal:number};
export type ImpactRecord={version:string;baseline?:ImpactResult;followup?:ImpactResult};
export const IMPACT_STORE_KEY='amlverse-competency-impact-v1';
export const IMPACT_DOMAINS:CompetencyDomain[]=['risk','ownership','evidence','cooperation','virtualassets','reporting'];

export function impactItems(phase:ImpactPhase){return IMPACT_ASSESSMENTS.flatMap(domain=>domain.forms[phase].map(item=>({...item,domain:domain.id,domainName:domain.title})))}
export function scoreImpact(phase:ImpactPhase,answers:ImpactAnswer[],learningMilestones:number,learningMilestoneTotal:number):ImpactResult{
 const items=impactItems(phase);
 if(answers.length!==IMPACT_ITEMS_PER_FORM||items.some((item,index)=>answers[index].itemId!==item.id||!Number.isInteger(answers[index].selected)||answers[index].selected<0||answers[index].selected>=item.options.length||![1,2,3].includes(answers[index].confidence)))throw Error('Incomplete or invalid assessment answers');
 const domainScores={} as Record<CompetencyDomain,number>;
 for(const key of IMPACT_DOMAINS){
  const relevant=items.filter(item=>item.domain===key);
  domainScores[key]=Math.round(100*relevant.filter(item=>{const answer=answers.find(a=>a.itemId===item.id);return answer?.selected===item.answer}).length/relevant.length);
 }
 const correct=items.filter((item,index)=>answers[index].selected===item.answer).length;
 return {phase,completedAt:new Date().toISOString(),answers,overall:Math.round(correct/IMPACT_ITEMS_PER_FORM*100),domainScores,correct,learningMilestones,learningMilestoneTotal};
}
function validResult(x:unknown,phase:ImpactPhase):x is ImpactResult{
 if(!x||typeof x!=='object')return false;
 const p=x as Partial<ImpactResult>;
 if(p.phase!==phase||!Array.isArray(p.answers)||typeof p.overall!=='number'||!Number.isFinite(p.overall)||p.overall<0||p.overall>100||typeof p.completedAt!=='string'||!p.domainScores||typeof p.correct!=='number')return false;
 const expected=impactItems(phase);
 return p.answers.length===expected.length&&p.answers.every((a,i)=>a?.itemId===expected[i].id&&Number.isInteger(a.selected)&&a.selected>=0&&a.selected<expected[i].options.length&&[1,2,3].includes(a.confidence));
}
export function readImpact():ImpactRecord{
 try{
  const raw=JSON.parse(localStorage.getItem(IMPACT_STORE_KEY)||'null') as Partial<ImpactRecord>|null;
  if(raw?.version!==IMPACT_VERSION)return {version:IMPACT_VERSION};
  const baseline=validResult(raw.baseline,'baseline')?raw.baseline:undefined;
  const followup=baseline&&validResult(raw.followup,'followup')?raw.followup:undefined;
  return {version:IMPACT_VERSION,baseline,followup};
 }catch{return {version:IMPACT_VERSION}}
}
export function storeImpact(record:ImpactRecord){try{localStorage.setItem(IMPACT_STORE_KEY,JSON.stringify(record));return true}catch{return false}}
export function resetImpact(){try{localStorage.removeItem(IMPACT_STORE_KEY);return true}catch{return false}}
export function impactDelta(record:ImpactRecord){return record.baseline&&record.followup?record.followup.overall-record.baseline.overall:null}
export function impactReport(record:ImpactRecord){
 return {
  report_type:'AMLVERSE individual formative competency learning record',
  schema_version:IMPACT_VERSION,
  generated_at:new Date().toISOString(),
  source:'AMLVERSE Nigeria — independent educational prototype',
  method:'Two purpose-designed, non-equated parallel forms; 12 multiple-choice questions per form in six domains; one point per correct answer. Follow-up minus baseline is descriptive percentage-point change.',
  caveats:['Individual and device-local; not independently validated','No causal attribution to course completion','Not a professional qualification','No external cohort data or learner identity included','Device clock is unverified','Prior practice and repeated exposure may affect performance'],
  domains:IMPACT_ASSESSMENTS.map(d=>({id:d.id,title:d.title,source:d.source,baseline_percentage:record.baseline?.domainScores[d.id]??null,followup_percentage:record.followup?.domainScores[d.id]??null,change_percentage_points:record.baseline&&record.followup?record.followup.domainScores[d.id]-record.baseline.domainScores[d.id]:null})),
  overall:{baseline_percentage:record.baseline?.overall??null,followup_percentage:record.followup?.overall??null,change_percentage_points:impactDelta(record),baseline_correct:record.baseline?.correct??null,followup_correct:record.followup?.correct??null},
  activity_snapshot:{baseline_milestones:record.baseline?.learningMilestones??null,followup_milestones:record.followup?.learningMilestones??null,baseline_total:record.baseline?.learningMilestoneTotal??null,followup_total:record.followup?.learningMilestoneTotal??null},
  completed:{baseline:record.baseline?.completedAt??null,followup:record.followup?.completedAt??null}
 };
}
export function impactCsv(record:ImpactRecord){
 const report=impactReport(record);
 const rows:(string|number|null)[][]=[['Domain','Baseline percentage','Follow-up percentage','Change in percentage points','Standard or source'],...report.domains.map(d=>[d.title,d.baseline_percentage,d.followup_percentage,d.change_percentage_points,d.source]),['Overall',report.overall.baseline_percentage,report.overall.followup_percentage,report.overall.change_percentage_points,'12 items per form / six domains']];
 const esc=(v:string|number|null)=>'"'+String(v??'').replace(/"/g,'""')+'"';
 return '\uFEFF'+rows.map(r=>r.map(esc).join(',')).join('\r\n')+'\r\n'+esc('IMPORTANT: Formative individual learning record only; forms have not been psychometrically equated and observed differences do not establish training effectiveness.');
}
