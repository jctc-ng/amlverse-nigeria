import {useEffect,useRef} from 'react';
import {readAcademyMetrics} from './AcademyMetrics';
import type {CourseKey} from './progress';

export default function LockedCapstoneDialog({onClose,onContinue}:{onClose:()=>void;onContinue:(id:CourseKey,section?:string)=>void}){
 const closeButton=useRef<HTMLButtonElement>(null);
 const metrics=readAcademyMetrics();
 const complete=metrics.worlds.filter(w=>w.done===w.total).length;
 const remaining=metrics.worlds.length-complete;
 const next=metrics.resume||metrics.worlds.find(w=>w.done<w.total)||metrics.worlds[0];
 const percentage=Math.round(complete/metrics.worlds.length*100);
 useEffect(()=>{
  closeButton.current?.focus();
  const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose()};
  document.addEventListener('keydown',onKey);
  return ()=>document.removeEventListener('keydown',onKey);
 },[onClose]);
 return <div className="districtdialogbackdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
  <section className="districtdialog capstonelockdialog" role="dialog" aria-modal="true" aria-labelledby="capstonelock-title" aria-describedby="capstonelock-description">
   <button ref={closeButton} type="button" className="districtdialogclose" aria-label="Close Capstone locked message" onClick={onClose}>✕</button>
   <div className="districtdialogsymbol" aria-hidden="true">🏆</div>
   <span className="eyebrow">AMLVERSE NIGERIA · FINAL CHALLENGE</span>
   <h2 id="capstonelock-title">Capstone Challenge is locked</h2>
   <p id="capstonelock-description">The Capstone is the final assessment of your AML/CFT/CPF and financial intelligence learning journey. Complete all nine learning districts to unlock it automatically. Your existing progress is saved.</p>
   <div className="districtdialogprogress">
    <div className="districtdialogprogressrow"><strong>Learning Town completion</strong><span>{complete} of {metrics.worlds.length} worlds</span></div>
    <div className="worldmetertrack" role="progressbar" aria-label="Completed learning worlds" aria-valuemin={0} aria-valuemax={metrics.worlds.length} aria-valuenow={complete}><div style={{width:percentage+'%'}}/></div>
    <small>{remaining} {remaining===1?'district':'districts'} remaining before the Capstone unlocks.</small>
   </div>
   <div className="districtdialogactions">
    <button type="button" className="primary" onClick={()=>onContinue(next.id,next.resume||undefined)}>Continue learning: {next.title} →</button>
    <button type="button" className="districtdialogcancel" onClick={onClose}>Return to Learning Town</button>
   </div>
   <p className="districtdialogfooter">No manual unlock is needed. The Capstone becomes available automatically once every district reaches 100% completion.</p>
  </section>
 </div>;
}
