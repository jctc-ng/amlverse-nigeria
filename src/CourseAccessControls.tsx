import {useState} from 'react';
import type {CourseKey} from './progress';
import {allCoursesUnlocked,isCourseUnlocked,resetCourseProgress,setCourseUnlocked} from './LearningTownProgress';
export default function CourseAccessControls({game,onChange}:{game:CourseKey;onChange:()=>void}){
 const [confirm,setConfirm]=useState(false);
 const [typed,setTyped]=useState('');
 const [resetting,setResetting]=useState(false);
 const global=allCoursesUnlocked(),opened=isCourseUnlocked(game);
 function toggle(){setCourseUnlocked(game,!opened);onChange()}
 function reset(){
  if(typed!=='RESET'||resetting)return;
  setResetting(true);
  resetCourseProgress(game);
  // Reload to discard old in-memory React scores and show a consistent zero-progress course.
  window.location.reload();
 }
 return <section className="towncontrols" aria-label="Course access and reset controls">
  <div className="towncontrolstitle"><div><span className="eyebrow">YOUR COURSE SETTINGS</span><h2>Access and progress controls</h2><p>Guided mode unlocks activities as you complete them. Free exploration opens all activities without awarding their completion automatically.</p></div></div>
  <div className="towncontrolsbuttons">
   <button type="button" className="secondary" onClick={toggle} disabled={global}>
    {opened?'🔒 Restore guided course locks':'🔓 Unlock this entire course'}
   </button>
   <button type="button" className="townresetopen" onClick={()=>{setConfirm(x=>!x);setTyped('')}}>{confirm?'Cancel reset':'↻ Reset course progress'}</button>
  </div>
  {global?<p className="towncontrolnote">All-world free exploration is enabled in Learning Town. Restore guided locks there to lock this course individually.</p>:opened?<p className="towncontrolnote" role="status">This course is unlocked for free exploration. Activity progress and achievements must still be earned.</p>:null}
  {confirm?<div className="townresetconfirm" role="group" aria-label="Confirm course progress reset"><h3>Reset this course?</h3>
    <p>This permanently clears only this learning world's saved lessons, checks, activity results, expanded-course progress, game best score and achievement gift on this device. Other worlds, FATF Quest and Capstone remain unchanged. This action cannot be undone.</p>
    <label htmlFor="town-reset-phrase">Type <strong>RESET</strong> to confirm</label>
    <input id="town-reset-phrase" autoComplete="off" spellCheck={false} value={typed} onChange={e=>setTyped(e.target.value)} placeholder="RESET"/>
    <div className="townresetactions"><button className="townresetdanger" type="button" disabled={typed!=='RESET'||resetting} onClick={reset}>Delete this course progress</button><button type="button" className="secondary" onClick={()=>{setConfirm(false);setTyped('')}}>Keep my progress</button></div>
   </div>:null}
 </section>;
}
