import {useState} from 'react';
import type {CourseKey} from './progress';
import {resetCourseProgress} from './LearningTownProgress';
export default function CourseAccessControls({game,onChange}:{game:CourseKey;onChange:()=>void}){
 const [confirm,setConfirm]=useState(false);
 const [typed,setTyped]=useState('');
 const [resetting,setResetting]=useState(false);
 function reset(){
  if(typed!=='RESET'||resetting)return;
  setResetting(true);
  resetCourseProgress(game);
  // Reload to discard old in-memory React scores and show a consistent zero-progress course.
  window.location.reload();
 }
 return <section className="towncontrols" aria-label="Course access and reset controls">
  <div className="towncontrolstitle"><div><span className="eyebrow">COURSE PROGRESS</span><h2>Reset your learning progress</h2><p>Each activity unlocks automatically when you complete its prerequisite. Manual unlocking is disabled.</p></div></div>
  <div className="towncontrolsbuttons">
   <button type="button" className="townresetopen" onClick={()=>{setConfirm(x=>!x);setTyped('')}}>{confirm?'Cancel reset':'↻ Reset course progress'}</button>
  </div>
  {confirm?<div className="townresetconfirm" role="group" aria-label="Confirm course progress reset"><h3>Reset this course?</h3>
    <p>This permanently clears only this learning world's saved lessons, checks, activity results, expanded-course progress, game best score and achievement gift on this device. Other worlds, FATF Quest and Capstone remain unchanged. This action cannot be undone.</p>
    <label htmlFor="town-reset-phrase">Type <strong>RESET</strong> to confirm</label>
    <input id="town-reset-phrase" autoComplete="off" spellCheck={false} value={typed} onChange={e=>setTyped(e.target.value)} placeholder="RESET"/>
    <div className="townresetactions"><button className="townresetdanger" type="button" disabled={typed!=='RESET'||resetting} onClick={reset}>Delete this course progress</button><button type="button" className="secondary" onClick={()=>{setConfirm(false);setTyped('')}}>Keep my progress</button></div>
   </div>:null}
 </section>;
}
