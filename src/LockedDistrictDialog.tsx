import {useEffect,useRef} from 'react';
import {learningSequence,modules} from './progress';
import type {CourseKey} from './progress';
import {worldAccessible,worldMilestones} from './LearningTownProgress';

export default function LockedDistrictDialog({target,onClose,onReview,onUnlock}:{target:CourseKey;onClose:()=>void;onReview:(id:CourseKey)=>void;onUnlock:(id:CourseKey)=>void}){
 const ref=useRef<HTMLButtonElement>(null);
 const index=learningSequence.indexOf(target);
 const previous=index>0?learningSequence[index-1]:null;
 const previousName=previous?modules.find(m=>m.id===previous)?.title||'Previous learning world':'Previous learning world';
 const targetName=modules.find(m=>m.id===target)?.title||'Learning district';
 const nextAvailable=learningSequence.slice(0,index).reverse().find(id=>worldAccessible(id))||learningSequence[0];
 const availableName=modules.find(m=>m.id===nextAvailable)?.title||'available learning world';
 const progress=previous?worldMilestones(previous):null;
 const count=progress?.done||0;
 const total=progress?.total||1;
 const percent=Math.round(count/total*100);
 useEffect(()=>{
  ref.current?.focus();
  const listener=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose()};
  document.addEventListener('keydown',listener);
  return ()=>document.removeEventListener('keydown',listener);
 },[onClose]);
 return <div className="districtdialogbackdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
  <section className="districtdialog" role="dialog" aria-modal="true" aria-labelledby="districtdialog-title" aria-describedby="districtdialog-description">
   <button ref={ref} type="button" className="districtdialogclose" aria-label="Close locked district message" onClick={onClose}>✕</button>
   <div className="districtdialogsymbol" aria-hidden="true">🔒</div>
   <span className="eyebrow">LEARNING TOWN · GUIDED PATH</span>
   <h2 id="districtdialog-title">{targetName} is locked</h2>
   <p id="districtdialog-description">To enter this district, complete the activities in <strong>{previousName}</strong>. Your progress is saved. You can continue along the guided path or unlock this district for free exploration.</p>
   {progress?<div className="districtdialogprogress">
    <div className="districtdialogprogressrow"><strong>{previousName}</strong><span>{percent}% complete</span></div>
    <div className="worldmetertrack" role="progressbar" aria-label={previousName+' completion'} aria-valuemin={0} aria-valuemax={total} aria-valuenow={count}><div style={{width:percent+'%'}}/></div>
    <small>{count} of {total} milestones completed · {Math.max(0,total-count)} remaining</small>
   </div>:null}
   <div className="districtdialogactions">
    {previous?<button type="button" className="primary" onClick={()=>onReview(nextAvailable)}>Continue {previous===nextAvailable?previousName:availableName} →</button>:null}
    <button type="button" className="secondary" onClick={()=>onUnlock(target)}>🔓 Unlock this course anyway</button>
    <button type="button" className="districtdialogcancel" onClick={onClose}>Not now</button>
   </div>
   <p className="districtdialogfooter">Unlocking a course lets you explore freely. It does not award completion, scores or achievements.</p>
  </section>
 </div>;
}
