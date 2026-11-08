import type {CourseKey} from './progress';
import {learningSequence} from './progress';
import {readAcademyMetrics} from './AcademyMetrics';
import {worldAccessible} from './LearningTownProgress';

const scenery=['🏫','🤝','⚖️','🌐','🕵️','🏛️','🔗','🕸️','📝'];
const districts=['Risk Academy','Cooperation Hub','Evaluation Hall','Egmont Gateway','Typology Street','Nigeria Compliance Centre','Blockchain Harbour','Tracing Laboratory','Reporting Library'];
export default function LearningTownMap({openCourse}:{openCourse:(game:CourseKey,section?:string)=>void}){
 const metrics=readAcademyMetrics();
 return <section className="learningtown" aria-labelledby="learningtown-title">
  <div className="learningtownhead"><div><span className="eyebrow">AMLVERSE LEARNING TOWN</span><h2 id="learningtown-title">Follow the pathway, unlock each district</h2><p>Begin at Risk Academy and progress along the connected road. Future districts remain visible but locked until the previous world's activities are complete. Progress you've already earned is preserved.</p></div>
  </div>
  <div className="townroad" aria-label="Connected learning districts">
   {learningSequence.map((id,i)=>{
    const w=metrics.worlds.find(x=>x.id===id)!;
    const access=worldAccessible(id);
    const completed=w.done===w.total;
    const status=completed?'Completed':access?'Available':'Locked';
    return <article key={id} className={'townstop '+(access?'available':'locked')+(completed?' complete':'')} aria-label={'District '+(i+1)+': '+w.title+', '+status}>
      <div className="townmarker"><span>{access?'◆':'🔒'}</span></div>
      <div className="townbuilding">
       <div className="townscenery" aria-hidden="true">{scenery[i]}</div>
       <div className="townbuildingbody"><small>DISTRICT {String(i+1).padStart(2,'0')} · {status.toUpperCase()}</small><h3>{districts[i]}</h3><p>{w.title}</p><div className="townmeter"><div style={{width:w.percent+'%'}}/></div><span>{w.done}/{w.total} activities · {w.percent}% completed</span>
       <div className="townactions">{access?<button type="button" className="primary" onClick={()=>openCourse(id,w.resume||undefined)}>{completed?'Review district →':w.done>0?'Resume journey →':'Enter district →'}</button>:<><p className="townlockreason">🔒 Complete the previous district to unlock automatically.</p></>}
       </div></div>
      </div>
    </article>;
   })}
  </div>
  <p className="townfootnote">Districts unlock automatically after all activities in the preceding district are complete. Use Reset Course inside a district to start again.</p>
 </section>;
}
