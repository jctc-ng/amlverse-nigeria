import type {CourseKey} from './progress';
import {osintMissions,readOsintProgress} from './OsintSimulationLab';
import {getLearningSequence,readLearningPath} from './progress';
import {readAcademyMetrics} from './AcademyMetrics';
import {worldAccessible} from './LearningTownProgress';

const scenery:Record<string,string>={risk:'🏫',team:'🤝',evaluation:'⚖️',egmont:'🌐',typologies:'🕵️',nigeria:'🏛️',virtualassets:'🔗',advancedtrace:'🕸️',reportwriting:'📝'};
const districts:Record<string,string>={risk:'Risk Academy',team:'Cooperation Hub',evaluation:'Evaluation Hall',egmont:'Egmont Gateway',typologies:'Typology Street',nigeria:'Nigeria Compliance Centre',virtualassets:'Blockchain Harbour',advancedtrace:'Tracing Laboratory',reportwriting:'Reporting Library'};
export default function LearningTownMap({openCourse,openOsint}:{openCourse:(game:CourseKey,section?:string)=>void;openOsint:()=>void}){
 const metrics=readAcademyMetrics();
 const sequence=getLearningSequence();
 const osintFirst=readLearningPath()==='osint';
 const count=readOsintProgress().completed.length;
 const first=osintFirst?'OSINT Investigation Laboratory':readLearningPath()==='blockchain'?'Blockchain Harbour':'Risk Academy';
 return <section className="learningtown" aria-labelledby="learningtown-title">
  <div className="learningtownhead"><div><span className="eyebrow">AMLVERSE LEARNING TOWN</span><h2 id="learningtown-title">Follow the pathway, unlock each district</h2><p>Begin at {first} and progress along the connected road. Future districts remain visible but locked until the previous world's activities are complete. Progress you've already earned is preserved.</p></div>
  </div>
  <div className="townroad" aria-label="Connected learning districts">
   {osintFirst?<article className="townstop available" aria-label={'District 1: OSINT Investigation & Digital Evidence, '+(count===osintMissions.length?'Completed':'Available')}><div className="townmarker"><span>◆</span></div><div className="townbuilding"><div className="townscenery" aria-hidden="true">🔎</div><div className="townbuildingbody"><small>DISTRICT 01 · {count===osintMissions.length?'COMPLETED':'AVAILABLE'}</small><h3>OSINT Investigation Laboratory</h3><p>OSINT Investigation & Digital Evidence</p><div className="townmeter"><div style={{width:count/osintMissions.length*100+'%'}}/></div><span>{count}/{osintMissions.length} practical missions · {Math.round(count/osintMissions.length*100)}% completed</span><div className="townactions"><button type="button" className="primary" onClick={openOsint}>{count===osintMissions.length?'Review OSINT missions →':count>0?'Resume OSINT →':'Start OSINT →'}</button></div></div></div></article>:null}
   {sequence.map((id,i)=>{
    const w=metrics.worlds.find(x=>x.id===id)!;
    const access=worldAccessible(id);
    const completed=w.done===w.total;
    const status=completed?'Completed':access?'Available':'Locked';
    return <article key={id} className={'townstop '+(access?'available':'locked')+(completed?' complete':'')} aria-label={'District '+(i+(osintFirst?2:1))+': '+w.title+', '+status}>
      <div className="townmarker"><span>{access?'◆':'🔒'}</span></div>
      <div className="townbuilding">
       <div className="townscenery" aria-hidden="true">{scenery[id]}</div>
       <div className="townbuildingbody"><small>DISTRICT {String(i+(osintFirst?2:1)).padStart(2,'0')} · {status.toUpperCase()}</small><h3>{districts[id]}</h3><p>{w.title}</p><div className="townmeter"><div style={{width:w.percent+'%'}}/></div><span>{w.done}/{w.total} activities · {w.percent}% completed</span>
       <div className="townactions">{access?<button type="button" className="primary" onClick={()=>openCourse(id,w.resume||undefined)}>{completed?'Review district →':w.done>0?'Resume journey →':'Enter district →'}</button>:<><p className="townlockreason">🔒 Complete the previous district to unlock automatically.</p></>}
       </div></div>
      </div>
    </article>;
   })}
  </div>
  <p className="townfootnote">Districts unlock automatically after all activities in the preceding district are complete. Use Reset Course inside a district to start again.</p>
 </section>;
}
