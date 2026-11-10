import {useState} from 'react';

export const osintSentenceExercises={
 introQuestion:{
  title:'Construct your investigation question',
  instruction:'Select the word groups in the correct order to create a focused investigative question.',
  hint:'Start with the question word. The sentence should identify the information being sought and the fictional company.',
  parts:['What','do','public company records','establish','about Meridian Aid Logistics?']
 },
 introEvidence:{
  title:'Construct your evidence requirement',
  instruction:'Build a sentence identifying which sources you need and the important uncertainty.',
  hint:'Start by identifying the evidence you need, then explain the limitation.',
  parts:['I need','a current registry extract','and an independent source','to verify the director claim','without assuming beneficial ownership.']
 },
 username:{
  title:'Describe the username-attribution limitation',
  instruction:'Connect the phrases into a defensible intelligence finding.',
  hint:'Begin with the observed matching usernames, then qualify what the match does not prove.',
  parts:['Matching usernames','are investigative leads','but do not prove','the accounts have','the same operator.']
 },
 email:{
  title:'Explain what an email address cannot establish',
  instruction:'Build a complete sentence separating organisational context from verified identity.',
  hint:'Begin with what an email domain can suggest, then state the attribution limitation.',
  parts:['An email domain','can indicate an organisational link','but does not identify','who operates the mailbox.']
 },
 social:{
  title:'Describe the dependence between sources',
  instruction:'Connect the source evidence to a defensible conclusion.',
  hint:'Identify the original source repeated by both accounts before qualifying corroboration.',
  parts:['Both accounts repeat','the company event programme,','so the claim','is not independently corroborated.']
 },
 image:{
  title:'Write a defensible location finding',
  instruction:'Connect the observed clues and state the remaining uncertainty.',
  hint:'Begin with the absent evidence and end with a qualified finding.',
  parts:['No verified GPS metadata','or independent landmarks','are available,','so the photograph’s location','remains unconfirmed.']
 },
 custodyRecord:{
  title:'Construct the evidence capture record',
  instruction:'Build an exhibit-log sentence containing the source, capture action and recorded time.',
  hint:'Begin with the capture action, then name the source, time and exhibit ID.',
  parts:['I captured','the fictional registry page','from its source URL','at the recorded UTC time','and assigned exhibit EXH-001.']
 },
 custodyLimit:{
  title:'Record the evidential limitation',
  instruction:'Build a sentence that distinguishes a registry record from proof of control or criminal conduct.',
  hint:'Begin with what was observed and then state what the record does not establish.',
  parts:['The captured record','identifies a listed director','but does not independently prove','beneficial ownership or wrongdoing.']
 }
} as const;

export type SentenceExerciseKey=keyof typeof osintSentenceExercises;
export function correctSentence(key:SentenceExerciseKey):string{
 return osintSentenceExercises[key].parts.join(' ');
}
const shuffled=(n:number)=>Array.from({length:n},(_,i)=>(i*3+1)%n);
// Deterministic offset order, with fallback reverse for sets where the multiplier repeats.
function wordOrder(n:number){const order=shuffled(n);return new Set(order).size===n?order:Array.from({length:n},(_,i)=>n-1-i)}

export default function OsintSentenceBuilder({exercise,onChange}:{exercise:SentenceExerciseKey;onChange:(value:string)=>void}){
 const config=osintSentenceExercises[exercise];
 const [chosen,setChosen]=useState<number[]>([]);
 const [showHint,setShowHint]=useState(false);
 const complete=chosen.length===config.parts.length;
 const correct=complete&&chosen.every((v,i)=>v===i);
 function change(next:number[]){
  setChosen(next);
  onChange(next.map(i=>config.parts[i]).join(' '));
 }
 return <div className="osintsentence" aria-label={config.title}>
  <div className="osintsentencehead"><strong>{config.title}</strong><span>{chosen.length}/{config.parts.length} word groups</span></div>
  <p>{config.instruction}</p>
  <div className="osintsentencearea" aria-live="polite" aria-label="Sentence being assembled">
   {chosen.length===0?<span className="osintsentenceplaceholder">Your sentence appears here as you select the word groups below.</span>:chosen.map((id,i)=><button type="button" key={id} className="osintsentencechosen" aria-label={'Remove '+config.parts[id]} title="Remove this phrase" onClick={()=>change(chosen.filter((_,j)=>j!==i))}>{config.parts[id]} <span aria-hidden="true">×</span></button>)}
  </div>
  <div className="osintsentencebank" aria-label="Available words and phrases">
   {wordOrder(config.parts.length).filter(i=>!chosen.includes(i)).map(i=><button type="button" key={i} className="osintsentenceword" aria-label={'Add '+config.parts[i]} onClick={()=>change([...chosen,i])}>＋ {config.parts[i]}</button>)}
  </div>
  {complete?<p className={correct?'osintsentencesuccess':'osintsentencehelp'} role="status">{correct?'✓ Complete, correctly ordered sentence.':'All word groups are placed. Review their order, or remove and reselect a phrase.'}</p>:null}
  <div className="osintsentencecontrols">
   <button type="button" className="secondary" disabled={chosen.length===0} onClick={()=>change(chosen.slice(0,-1))}>↶ Undo last</button>
   <button type="button" className="secondary" disabled={chosen.length===0} onClick={()=>change([])}>↺ Start again</button>
   <button type="button" className="secondary" onClick={()=>setShowHint(h=>!h)} aria-expanded={showHint}>{showHint?'Hide hint':'Show a hint'}</button>
  </div>
  {showHint?<p className="osintsentencehint">{config.hint}</p>:null}
 </div>;
}
