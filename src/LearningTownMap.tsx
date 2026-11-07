import {useState} from 'react';
import type {CourseKey} from './progress';
import {learningSequence} from './progress';
import {readAcademyMetrics} from './AcademyMetrics';
import {allCoursesUnlocked,isCourseUnlocked,setAllCoursesUnlocked,setCourseUnlocked,worldAccessible} from './LearningTownProgress';

const scenery=['🏫','🤝','⚖️','🌐','🕵️','🏛️','🔗','🕸️','📝'];
const districts=['Risk Academy','Cooperation Hub','Evaluation Hall','Egmont Gateway','Typology Street','Nigeria Compliance Centre','Blockchain Harbour','Tracing Laboratory','Reporting Library'];
export default function LearningTownMap({openCourse}:{openCourse:(game:CourseKey,section?:string)=>void}){
 const [version,setVersion]=useState(0);
 const metrics=readAcademyMetrics();
 const unlocked=allCoursesUnlocked();
 function flipAll(){setAllCoursesUnlocked(!unlocked);setVersion(v=>v+1)}
 function openOne(id:CourseKey){setCourseUnlocked(id,true);setVersion(v=>v+1)}
 return <section className="learningtown" aria-labelledby="learningtown-title" data-version={version}>
  <div className="learningtownhead"><div><span className="eyebrow">AMLVERSE LEARNING TOWN</span><h2 id="learningtown-title">Follow the pathway, unlock each district</h2><p>Begin at Risk Academy and progress along the connected road. Future districts remain visible but locked until the previous world's activities are complete. Progress you've already earned is preserved.</p></div>
  <button type="button" className="townunlockall" onClick={flipAll}>{unlocked?'🔒 Restore guided course locks':'🔓 Unlock all courses (free exploration)'}</button></div>
  {unlocked?<div className="townnotice" role="status">Free exploration enabled. All worlds and their activities can be opened; your achievements are unchanged. Select Restore guided course locks to resume the standard pathway.</div>:null}
  <div className="townroad" aria-label="Connected learning districts">
   {learningSequence.map((id,i)=>{
    const w=metrics.worlds.find(x=>x.id===id)!;
    const access=worldAccessible(id);
    const bypass=isCourseUnlocked(id);
    const completed=w.done===w.total;
    const status=completed?'Completed':bypass?'Unlocked by learner':access?'Available':'Locked';
    return <article key={id} className={'townstop '+(access?'available':'locked')+(completed?' complete':'')} aria-label={'District '+(i+1)+': '+w.title+', '+status}>
      <div className="townmarker"><span>{access?'◆':'🔒'}</span></div>
      <div className="townbuilding">
       <div className="townscenery" aria-hidden="true">{scenery[i]}</div>
       <div className="townbuildingbody"><small>DISTRICT {String(i+1).padStart(2,'0')} · {status.toUpperCase()}</small><h3>{districts[i]}</h3><p>{w.title}</p><div className="townmeter"><div style={{width:w.percent+'%'}}/></div><span>{w.done}/{w.total} activities · {w.percent}% completed</span>
       <div className="townactions">{access?<button type="button" className="primary" onClick={()=>openCourse(id,w.resume||undefined)}>{completed?'Review district →':w.done>0?'Resume journey →':'Enter district →'}</button>:<><p className="townlockreason">Finish the previous district or unlock this course manually.</p><button type="button" className="secondary" onClick={()=>openOne(id)}>🔓 Unlock this course</button></>}
       </div></div>
      </div>
    </article>;
   })}
  </div>
  <p className="townfootnote">Guided mode locks unfinished future districts by default; individual and all-course unlock options only change navigation access, not completion scores. Use Reset Course within a district to start it over.</p>
 </section>;
}
