export type CourseKey='risk'|'team'|'evaluation'|'egmont'|'typologies'|'nigeria'|'virtualassets'|'advancedtrace'|'reportwriting';
export type CourseProgress={lessons:number[];checkPassed:boolean;checkAttempts:number;lastVisited:string};
export const modules:{id:CourseKey;title:string;icon:string;scoreKey:string;maxScore:number}[]=[
{id:'risk',title:'RiskLab Arcade',icon:'◈',scoreKey:'amlverse-arcade-risk',maxScore:100},
{id:'team',title:'Teamwork Arcade',icon:'♧',scoreKey:'amlverse-arcade-team',maxScore:100},
{id:'evaluation',title:'Mutual Evaluation Arena',icon:'🏆',scoreKey:'amlverse-evaluation-arena-best',maxScore:105},
{id:'egmont',title:'Egmont Exchange',icon:'🌍',scoreKey:'amlverse-egmont-best',maxScore:105},
{id:'typologies',title:'Typology Detective',icon:'🔎',scoreKey:'amlverse-typology-best',maxScore:105},
{id:'nigeria',title:'Nigeria Compliance Challenge',icon:'🇳🇬',scoreKey:'amlverse-nigeria-compliance-best',maxScore:105},
{id:'virtualassets',title:'Virtual Asset Investigation',icon:'🔗',scoreKey:'amlverse-virtual-asset-best',maxScore:105},
{id:'advancedtrace',title:'Advanced Crypto Tracing',icon:'🕸️',scoreKey:'amlverse-advanced-trace-best',maxScore:105},
{id:'reportwriting',title:'Financial Intelligence Reporting',icon:'📝',scoreKey:'amlverse-report-writing-best',maxScore:100}
];
export const learningSequence:CourseKey[]=['risk','team','evaluation','egmont','typologies','nigeria','virtualassets','advancedtrace','reportwriting'];
export function nextLearningWorld(game:CourseKey):CourseKey|null {return learningSequence[learningSequence.indexOf(game)+1]||null}
const prefix='amlverse-course-v1-';
const empty=():CourseProgress=>({lessons:[],checkPassed:false,checkAttempts:0,lastVisited:''});
export function readCourse(id:CourseKey):CourseProgress{
 try{
  const value=JSON.parse(localStorage.getItem(prefix+id)||'null') as Partial<CourseProgress>|null;
  if(!value||typeof value!=='object')return empty();
  return {lessons:Array.isArray(value.lessons)?value.lessons.filter(x=>Number.isInteger(x)&&x>=0&&x<3):[],checkPassed:value.checkPassed===true,checkAttempts:Number.isFinite(value.checkAttempts)?Math.max(0,Number(value.checkAttempts)):0,lastVisited:typeof value.lastVisited==='string'?value.lastVisited:''};
 }catch{return empty()}
}
export function saveCourse(id:CourseKey,patch:(old:CourseProgress)=>CourseProgress){
 const result=patch(readCourse(id));
 try{localStorage.setItem(prefix+id,JSON.stringify({...result,lastVisited:new Date().toISOString()}))}catch{}
}
export function readScore(key:string):number{try{const n=Number(localStorage.getItem(key)||0);return Number.isFinite(n)?Math.max(0,n):0}catch{return 0}}
export function readFatf(){
 try{
  type Outcome={score:number;total:number};
  const old=JSON.parse(localStorage.getItem('amlverse-fatf-ch1')||'{}') as Record<string,Outcome>;
  const extended=JSON.parse(localStorage.getItem('amlverse-fatf-40-v2')||'{}') as {studied?:number[];outcomes?:Record<string,Outcome>};
  const merged:Record<string,Outcome>={};
  for(let n=1;n<=40;n++){
   const k=String(n),a=old?.[k],b=extended.outcomes?.[k];
   const valid=(x:Outcome|undefined)=>!!x&&Number.isFinite(x.score)&&Number.isFinite(x.total)&&x.total>0&&x.score>=0&&x.score<=x.total;
   if(valid(a)&&valid(b))merged[k]=a.score/a.total>=b.score/b.total?a:b;
   else if(valid(a))merged[k]=a;
   else if(valid(b))merged[k]=b;
  }
  const outcomes=Object.values(merged);
  const studied=Array.isArray(extended.studied)?new Set(extended.studied.filter(x=>Number.isInteger(x)&&x>=1&&x<=40)).size:0;
  return {attempted:outcomes.length,perfect:outcomes.filter(x=>x.score===x.total).length,earned:outcomes.reduce((total,x)=>total+x.score*100,0),studied,total:40};
 }catch{return {attempted:0,perfect:0,earned:0,studied:0,total:40}}
}
export function readLegacy(){
 try{const saved=JSON.parse(localStorage.getItem('amlverse-v1')||'{}') as Record<string,{xp:number;complete:boolean}>;const data=Object.values(saved).filter(x=>x&&typeof x==='object');return {complete:data.filter(x=>x.complete).length,xp:data.reduce((sum,x)=>sum+(Number.isFinite(x.xp)?Math.max(0,x.xp):0),0)}}
 catch{return {complete:0,xp:0}}
}
