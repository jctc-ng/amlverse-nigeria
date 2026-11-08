import CompetencyImpact from './CompetencyImpact';
import ProjectResearch from './ProjectResearch';
import LockedDistrictDialog from './LockedDistrictDialog';
import LockedCapstoneDialog from './LockedCapstoneDialog';
import {worldAccessible,worldMilestones} from './LearningTownProgress';
import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {worlds,references} from './data';
import type {World} from './data';
import './style.css';
import './institutional-theme.css';
import './readability-fixes.css';
import './interactive-polish.css';
import './accessibility-final.css';
import FatfChapter from './FatfChapter';
import LearningExperience from './LearningExperience';
import ProgressDashboard from './ProgressDashboard';
import AcademyOverview from './AcademyOverview';
import CapstoneChallenge from './CapstoneChallenge';
import AcademyNavigation from './AcademyNavigation';
import {nextLearningWorld} from './progress';
import type {CourseKey} from './progress';


type Screen='home'|'mission'|'resources'|'chapter'|'risklab'|'team'|'evaluation'|'egmont'|'typologies'|'nigeria'|'progress'|'virtualassets'|'advancedtrace'|'reportwriting'|'capstone'|'about'|'impact';
type Saved=Record<string,{xp:number;complete:boolean}>;
function App(){
 const [screen,setScreen]=useState<Screen>('home');
 const [lockedTarget,setLockedTarget]=useState<CourseKey|null>(null);
 const [capstoneLocked,setCapstoneLocked]=useState(false);
 const [resumeTarget,setResumeTarget]=useState<{id:CourseKey;section:string}|null>(null);
 const [active,setActive]=useState<World>(worlds[0]);
 const [index,setIndex]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const [submitted,setSubmitted]=useState(false);
 const [earned,setEarned]=useState(0);
 const [saved,setSaved]=useState<Saved>(()=>{try{return JSON.parse(localStorage.getItem('amlverse-v1')||'{}') as Saved}catch{return {}}});
 useEffect(()=>{try{localStorage.setItem('amlverse-v1',JSON.stringify(saved))}catch{}},[saved]);
 const completed=Object.values(saved).filter(x=>x.complete).length;
 const xp=Object.values(saved).reduce((sum,x)=>sum+x.xp,0);
 const scenario=active.scenarios[index];
 function canStartCapstone(){return (['risk','team','evaluation','egmont','typologies','nigeria','virtualassets','advancedtrace','reportwriting'] as CourseKey[]).every(id=>{const w=worldMilestones(id);return w.done===w.total})}
 function navigateScreen(next:Screen){
  const courseId=(next==='risklab'?'risk':['risk','team','evaluation','egmont','typologies','nigeria','virtualassets','advancedtrace','reportwriting'].includes(next)?next:null) as CourseKey|null;
  if(courseId){openCourse(courseId);return}
  if(next==='capstone'&&!canStartCapstone()){setCapstoneLocked(true);return}
  setResumeTarget(null);setScreen(next);window.scrollTo(0,0);
 }
 function openCourse(id:CourseKey,section?:string){if(!worldAccessible(id)){setLockedTarget(id);return}setLockedTarget(null);setResumeTarget(section?{id,section}:null);setScreen(id==='risk'?'risklab':id);window.scrollTo(0,0)}
 function advanceCourse(id:CourseKey){const next=nextLearningWorld(id);if(next){if(worldAccessible(next))openCourse(next);else{setLockedTarget(next)}}else{navigateScreen('capstone')}}
 function openWorld(w:World){setActive(w);setIndex(0);setAnswer(null);setSubmitted(false);setEarned(0);setScreen('mission');window.scrollTo(0,0)}
 function next(){if(index<active.scenarios.length-1){setIndex(index+1);setAnswer(null);setSubmitted(false)}else{setSaved(prev=>({...prev,[active.id]:{complete:true,xp:Math.max(earned,prev[active.id]?.xp||0)}}));setScreen('home')}window.scrollTo(0,0)}
 function submit(){if(answer===null)return;setSubmitted(true);if(scenario.choices[answer].correct)setEarned(p=>p+100)}
 return <div className="shell">
 <AcademyNavigation screen={screen} onNavigate={navigateScreen}/>
 <div className="page"><header><div className="mobilebrand">✦ AMLVERSE <span>NIGERIA</span></div><div className="headeritems"><span className="demo">● PUBLIC DEMO</span><div className="avatar">LE</div></div></header>
 {screen==='home'?<AcademyOverview openCourse={openCourse} openFatf={()=>setScreen('chapter')} openProgress={()=>setScreen('progress')} openResources={()=>setScreen('resources')} openCapstone={()=>navigateScreen('capstone')} openResearch={()=>navigateScreen('about')} openImpact={()=>navigateScreen('impact')}/>
 :screen==='impact'?<CompetencyImpact onBack={()=>{setScreen('home');window.scrollTo(0,0)}} onLearn={()=>{setScreen('home');window.scrollTo(0,0)}}/>
 :screen==='about'?<ProjectResearch onBack={()=>{setScreen('home');window.scrollTo(0,0)}} onStart={()=>{setScreen('home');window.scrollTo(0,0)}}/>
 :screen==='progress'?<ProgressDashboard onBack={()=>setScreen('home')} onOpen={openCourse} onFatf={()=>setScreen('chapter')} onCapstone={()=>navigateScreen('capstone')} onImpact={()=>navigateScreen('impact')}/>
 :screen==='chapter'?<FatfChapter onBack={()=>setScreen('home')}/>
 :screen==='risklab'?<LearningExperience key={"risk"+(resumeTarget?.id==="risk"?resumeTarget.section:'')} game="risk" initialSection={resumeTarget?.id==="risk"?resumeTarget.section:undefined} onBack={()=>setScreen('home')} onNextCourse={()=>advanceCourse('risk')}/>
 :screen==='team'?<LearningExperience key={"team"+(resumeTarget?.id==="team"?resumeTarget.section:'')} game="team" initialSection={resumeTarget?.id==="team"?resumeTarget.section:undefined} onBack={()=>setScreen('home')} onNextCourse={()=>advanceCourse('team')}/>
 :screen==='evaluation'?<LearningExperience key={"evaluation"+(resumeTarget?.id==="evaluation"?resumeTarget.section:'')} game="evaluation" initialSection={resumeTarget?.id==="evaluation"?resumeTarget.section:undefined} onBack={()=>setScreen('home')} onNextCourse={()=>advanceCourse('evaluation')}/>
 :screen==='egmont'?<LearningExperience key={"egmont"+(resumeTarget?.id==="egmont"?resumeTarget.section:'')} game="egmont" initialSection={resumeTarget?.id==="egmont"?resumeTarget.section:undefined} onBack={()=>setScreen('home')} onNextCourse={()=>advanceCourse('egmont')}/>
 :screen==='typologies'?<LearningExperience key={"typologies"+(resumeTarget?.id==="typologies"?resumeTarget.section:'')} game="typologies" initialSection={resumeTarget?.id==="typologies"?resumeTarget.section:undefined} onBack={()=>setScreen('home')} onNextCourse={()=>advanceCourse('typologies')}/>
 :screen==='nigeria'?<LearningExperience key={"nigeria"+(resumeTarget?.id==="nigeria"?resumeTarget.section:'')} game="nigeria" initialSection={resumeTarget?.id==="nigeria"?resumeTarget.section:undefined} onBack={()=>setScreen('home')} onNextCourse={()=>advanceCourse('nigeria')}/>
 :screen==='virtualassets'?<LearningExperience key={"virtualassets"+(resumeTarget?.id==="virtualassets"?resumeTarget.section:'')} game="virtualassets" initialSection={resumeTarget?.id==="virtualassets"?resumeTarget.section:undefined} onBack={()=>setScreen('home')} onNextCourse={()=>advanceCourse('virtualassets')}/>
 :screen==='advancedtrace'?<LearningExperience key={"advancedtrace"+(resumeTarget?.id==="advancedtrace"?resumeTarget.section:'')} game="advancedtrace" initialSection={resumeTarget?.id==="advancedtrace"?resumeTarget.section:undefined} onBack={()=>setScreen('home')} onNextCourse={()=>advanceCourse('advancedtrace')}/>
 :screen==='reportwriting'?<LearningExperience key={"reportwriting"+(resumeTarget?.id==="reportwriting"?resumeTarget.section:'')} game="reportwriting" initialSection={resumeTarget?.id==="reportwriting"?resumeTarget.section:undefined} onBack={()=>setScreen('home')} onNextCourse={()=>advanceCourse('reportwriting')}/>
 :screen==='capstone'?<CapstoneChallenge onBack={()=>setScreen('home')} onProgress={()=>setScreen('progress')}/>
 :screen==='resources'?<main className="narrow"><button className="back" onClick={()=>setScreen('home')}>← Academy overview</button><span className="eyebrow">OFFICIAL SOURCES</span><h1 className="title">Resource library</h1><p className="lead">Explore original publications. Future releases will add versioned, section-linked explanations and approval workflows.</p><div className="resourcegrid">{references.map(r=><a className="resource" target="_blank" rel="noopener noreferrer" href={r.url} key={r.url}><div>▤</div><span><strong>{r.title}</strong><small>{r.org} • Official website</small></span><b>↗</b></a>)}</div></main>
 :<main className="narrow"><button className="back" onClick={()=>setScreen('home')}>← Learning worlds</button><div className="missionmeta"><span className="eyebrow">{active.title.toUpperCase()} • MISSION {index+1}/{active.scenarios.length}</span><strong>{earned} XP</strong></div><h1 className="title">{scenario.title}</h1><div className="track"><div style={{width:((index+1)/active.scenarios.length*100)+'%',background:active.color}}/></div><div className="situation"><small>YOUR SCENARIO</small><p>{scenario.context}</p></div><h2 className="question">{scenario.question}</h2><div className="choices">{scenario.choices.map((c,i)=><button key={i} disabled={submitted} onClick={()=>setAnswer(i)} className={'choice'+(answer===i?' picked':'')+(submitted&&c.correct?' correct':'')+(submitted&&answer===i&&!c.correct?' incorrect':'')}><span className="letter">{String.fromCharCode(65+i)}</span>{c.text}{submitted&&c.correct?<span className="indicator">✓</span>:null}</button>)}</div>{submitted&&answer!==null?<div className="feedback"><strong>{scenario.choices[answer].correct?'Excellent! +100 XP':'Learning opportunity'}</strong><p>{scenario.explanation}</p><a href={scenario.url} target="_blank" rel="noopener noreferrer">Read source: {scenario.reference} ↗</a></div>:null}<div className="actions">{!submitted?<button className="primary" disabled={answer===null} onClick={submit}>Submit decision →</button>:<button className="primary" onClick={next}>{index===active.scenarios.length-1?'Complete world':'Next mission'} →</button>}<button className="secondary" onClick={()=>openWorld(active)}>↻ Restart world</button></div><div className="notice">Synthetic educational exercises only. Guidance and explanations require subject-matter review.</div></main>}
 {capstoneLocked?<LockedCapstoneDialog onClose={()=>setCapstoneLocked(false)} onContinue={(id,section)=>{setCapstoneLocked(false);openCourse(id,section)}}/>:null}
 {lockedTarget?<LockedDistrictDialog target={lockedTarget} onClose={()=>setLockedTarget(null)} onReview={id=>{setLockedTarget(null);openCourse(id)}}/>:null}
 <footer>AMLVERSE Nigeria — independent educational prototype <span>Learn • Play • Apply • Master</span></footer></div></div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
