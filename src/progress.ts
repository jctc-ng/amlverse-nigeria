export type CourseKey='risk'|'team'|'evaluation'|'egmont'|'typologies'|'nigeria'|'virtualassets';
export type CourseProgress={lessons:number[];checkPassed:boolean;checkAttempts:number;lastVisited:string};
export const modules:{id:CourseKey;title:string;icon:string;scoreKey:string;maxScore:number}[]=[
{id:'risk',title:'RiskLab Arcade',icon:'◈',scoreKey:'amlverse-arcade-risk',maxScore:100},
{id:'team',title:'Teamwork Arcade',icon:'♧',scoreKey:'amlverse-arcade-team',maxScore:100},
{id:'evaluation',title:'Mutual Evaluation Arena',icon:'🏆',scoreKey:'amlverse-evaluation-arena-best',maxScore:105},
{id:'egmont',title:'Egmont Exchange',icon:'🌍',scoreKey:'amlverse-egmont-best',maxScore:105},
{id:'typologies',title:'Typology Detective',icon:'🔎',scoreKey:'amlverse-typology-best',maxScore:105},
{id:'nigeria',title:'Nigeria Compliance Challenge',icon:'🇳🇬',scoreKey:'amlverse-nigeria-compliance-best',maxScore:105},
{id:'virtualassets',title:'Virtual Asset Investigation',icon:'🔗',scoreKey:'amlverse-virtual-asset-best',maxScore:105}
];
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
 try{const obj=JSON.parse(localStorage.getItem('amlverse-fatf-ch1')||'{}') as Record<string,{score:number;total:number}>;const outcomes=Object.values(obj).filter(x=>x&&Number.isFinite(x.score)&&Number.isFinite(x.total)&&x.total>0);return {attempted:outcomes.length,perfect:outcomes.filter(x=>x.score===x.total).length,earned:outcomes.reduce((total,x)=>total+Math.max(0,x.score)*100,0)}}
 catch{return {attempted:0,perfect:0,earned:0}}
}
export function readLegacy(){
 try{const saved=JSON.parse(localStorage.getItem('amlverse-v1')||'{}') as Record<string,{xp:number;complete:boolean}>;const data=Object.values(saved).filter(x=>x&&typeof x==='object');return {complete:data.filter(x=>x.complete).length,xp:data.reduce((sum,x)=>sum+(Number.isFinite(x.xp)?Math.max(0,x.xp):0),0)}}
 catch{return {complete:0,xp:0}}
}
