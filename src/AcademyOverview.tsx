import {modules,readCourse,readFatf,readLegacy,readScore} from './progress';
import type {CourseKey} from './progress';
import {hasCelebrated} from './WorldCompletion';

type Props={openCourse:(id:CourseKey)=>void;openFatf:()=>void;openProgress:()=>void;openResources:()=>void;openCapstone:()=>void};
const descriptions:Record<CourseKey,{subtitle:string;description:string;color:string;label:string}>={
 risk:{subtitle:'Risk Assessment',description:'Identify threats, vulnerabilities and safeguards with a risk-based approach.',color:'#e4bd72',label:'FOUNDATIONS'},
 team:{subtitle:'Interagency Cooperation',description:'Match FIU analysts, supervisors, investigators and prosecutors to their roles.',color:'#72dcc2',label:'FOUNDATIONS'},
 evaluation:{subtitle:'Mutual Evaluation',description:'Distinguish technical compliance from demonstrated effectiveness.',color:'#b3a3ff',label:'STANDARDS'},
 egmont:{subtitle:'FIU Information Exchange',description:'Practise confidentiality, purpose limitations and consent.',color:'#74bffd',label:'COOPERATION'},
 typologies:{subtitle:'Follow the Money',description:'Recognise red flags while separating evidence from assumptions.',color:'#ff9bb0',label:'FINANCIAL INTELLIGENCE'},
 nigeria:{subtitle:'Nigeria AML/CFT/CPF',description:'Explore compliance duties, intelligence reporting and sector oversight.',color:'#a1dda0',label:'NIGERIAN FRAMEWORK'},
 virtualassets:{subtitle:'Virtual Asset Basics',description:'Follow a fictional wallet route and examine exchange leads.',color:'#70d9e2',label:'BLOCKCHAIN'},
 advancedtrace:{subtitle:'Advanced Crypto Tracing',description:'Navigate a multi-hop graph, judge confidence and prepare an intelligence note.',color:'#e3b0ff',label:'BLOCKCHAIN'},
 reportwriting:{subtitle:'Intelligence Report Writing',description:'Classify evidence and build a careful abstract, findings and inference.',color:'#ffd581',label:'ANALYTICAL WRITING'}
};
const tracks:{id:string;label:string;description:string;keys:CourseKey[]}[]=[
{id:'foundations',label:'Foundations & Standards',description:'Build core AML/CFT/CPF concepts and interagency awareness.',keys:['risk','team','evaluation']},
{id:'intelligence',label:'Financial Intelligence & Cooperation',description:'Understand red flags, authorised sharing and Nigerian compliance responsibilities.',keys:['egmont','typologies','nigeria']},
{id:'investigations',label:'Blockchain Investigation & Reporting',description:'Trace synthetic transactions and communicate evidence-based findings.',keys:['virtualassets','advancedtrace','reportwriting']}
];
export default function AcademyOverview({openCourse,openFatf,openProgress,openResources,openCapstone}:Props){
 const courseCards=modules.map(m=>{const learning=readCourse(m.id);const score=readScore(m.scoreKey);const lessons=learning.lessons.length;const steps=lessons+(learning.checkPassed?1:0)+(score>0?1:0);return {...m,...descriptions[m.id],steps,score,lessons,passed:learning.checkPassed,done:steps===5,celebrated:hasCelebrated(m.id)}}); 
 const finished=courseCards.filter(m=>m.done).length;
 const fatf=readFatf();
 const legacy=readLegacy();
 const totalPoints=legacy.xp+fatf.earned+courseCards.reduce((sum,m)=>sum+m.score,0);
 const completedMilestones=courseCards.reduce((sum,m)=>sum+m.steps,0);
 const totalMilestones=modules.length*5;
 const percentage=Math.round(completedMilestones/totalMilestones*100);
 const underway=courseCards.filter(m=>m.steps>0&&!m.done);
 const next=underway[0]||courseCards.find(m=>!m.done)||courseCards[0];
 const latest=courseCards.find(m=>m.id==='reportwriting')!;
 return <main className="academyhome">
 <section className="academyhero">
  <div><span className="eyebrow gold">✦ AMLVERSE NIGERIA • LEARN • PLAY • APPLY</span><h1>Learn financial intelligence by <em>doing.</em></h1><p>Explore AML/CFT/CPF fundamentals, Nigerian compliance, FIU cooperation, cryptocurrency tracing and report writing through fictional interactive missions.</p><div className="academyheroactions"><button className="primary" type="button" onClick={()=>openCourse(next.id)}>{next.steps>0?'Continue learning →':'Start your learning journey →'}</button><button className="secondary" type="button" onClick={openProgress}>My Progress →</button></div><small className="academyheronote">9 interactive worlds · FATF Quest R.1–R.10 · No account required</small></div>
  <div className="academyheroillustration" aria-hidden="true"><div className="academyorb">✦</div><div className="academyorbitword one">LEARN</div><div className="academyorbitword two">ANALYSE</div><div className="academyorbitword three">MASTER</div></div>
 </section>
 <section aria-labelledby="academy-progress-title"><div className="sectionhead"><div><span className="eyebrow">PERSONAL LEARNING SNAPSHOT</span><h2 id="academy-progress-title">Academy overview</h2></div><span className="muted">Version 0.19 · Capstone Challenge</span></div><div className="academystats">
 <div className="academystat"><small>LEARNING WORLDS</small><strong>{finished}<span> / {modules.length}</span></strong><p>Fully completed (5/5 milestones)</p></div>
 <div className="academystat"><small>YOUR MILESTONES</small><strong>{completedMilestones}<span> / {totalMilestones}</span></strong><p>{percentage}% of world learning journey</p><div className="academyprogressbar" aria-label={percentage+' percent completed'}><div style={{width:percentage+'%'}}/></div></div>
 <div className="academystat"><small>LEARNING POINTS</small><strong>{totalPoints.toLocaleString()}</strong><p>Saved scores plus FATF and legacy XP</p></div>
 <div className="academystat"><small>FATF QUEST</small><strong>{fatf.perfect}<span> / 10</span></strong><p>Perfect Recommendation lessons</p></div></div>
 <div className="academynext"><span className="academynexticon" aria-hidden="true">🚀</span><div><b>{finished===modules.length?'All arcade worlds completed!':'Your next recommended mission'}</b><p>{next.title} · {next.done?'Completed':next.steps+'/5 milestones earned'}</p></div><button type="button" className="secondary" onClick={()=>openCourse(next.id)}>{next.done?'Replay world':'Continue world'} →</button></div>
 </section>
 <section aria-labelledby="academy-worlds-title"><div className="sectionhead"><div><span className="eyebrow">THE COMPLETE ACADEMY</span><h2 id="academy-worlds-title">Explore learning worlds</h2></div><span className="muted">{modules.length} playable worlds · 3 learning tracks</span></div>
 {tracks.map(track=><div key={track.id} className="academytrack"><div className="academytrackhead"><div><h3>{track.label}</h3><p>{track.description}</p></div><span>{track.keys.filter(id=>courseCards.some(m=>m.id===id&&m.done)).length}/{track.keys.length} completed</span></div><div className="academyworldgrid">{track.keys.map(id=>{const m=courseCards.find(c=>c.id===id)!;return <button key={id} type="button" className="academyworldcard" onClick={()=>openCourse(id)}><div className="academyworldvisual" style={{background:'radial-gradient(circle at 82% 15%,'+m.color+'45,transparent 65%),#152a42'}}><span className="academyworldicon" aria-hidden="true">{m.icon}</span><span className="academyworldtag">{m.celebrated?'🎁 CHAMPION':m.done?'✓ WORLD COMPLETE':m.steps>0?'IN PROGRESS':'READY TO BEGIN'}</span></div><div className="academyworldbody"><small style={{color:m.color}}>{m.label}</small><h4>{m.title}</h4><p>{m.description}</p><div className="academyworldmeta"><span>{m.lessons}/3 lessons</span><span>{m.passed?'✓ Quick Check':'Quick Check open'}</span><span>{m.score>0?'🏆 Best '+m.score:'Game ready'}</span></div><div className="academyworldprogress"><div style={{width:(m.steps/5*100)+'%',background:m.color}}/></div><div className="academyworldbottom"><strong>{m.steps}/5 milestones</strong><span>{m.done?'Replay →':m.steps>0?'Continue →':'Start mission →'}</span></div></div></button>})}</div></div>)}
 </section>
 <section className="academyfeatures" aria-labelledby="academy-feature-title"><div className="academyfeaturemain"><span className="eyebrow">LATEST LEARNING EXPERIENCE</span><h2 id="academy-feature-title">Operation Clear Findings 📝</h2><p>Practise writing professional financial intelligence findings from a fictional statement, distinguishing documented transactions from unverified allegations.</p><button className="primary" type="button" onClick={()=>openCourse(latest.id)}>Explore Reporting Lab →</button></div><div className="academyfeaturesecondary"><span aria-hidden="true">★</span><h3>FATF Quest</h3><p>Recommendations R.1–R.10 — learn the standards, answer scenarios and track mastery.</p><button className="secondary" type="button" onClick={openFatf}>Continue FATF Quest →</button></div></section>
 <section className="capstonefeature"><div><span className="eyebrow">NEW • INTEGRATED PRACTICE MISSION</span><h2>🏅 The AMLVERSE Capstone Challenge</h2><p>Put your skills together in one fictional multi-agency investigation: assess risks, trace transactions, evaluate attribution, protect information and draft defensible intelligence findings.</p><div className="capstonefeaturefacts"><span>6 decisions</span><span>Integrated case</span><span>Practice badge</span></div><button className="primary" type="button" onClick={openCapstone}>Launch Capstone Challenge →</button></div><span className="capstonefeatureart" aria-hidden="true">🛡️</span></section>
 <section className="academyresources"><div><span className="eyebrow">GROUNDED LEARNING</span><h2>From concepts to responsible decisions</h2><p>Lessons reference authoritative AML/CFT/CPF resources. Practice cases are entirely synthetic, and badges are educational achievements rather than professional certifications.</p></div><button className="secondary" type="button" onClick={openResources}>Explore official resources →</button></section>
 <div className="notice"><b>Independent educational prototype.</b> No real financial intelligence, customer records, wallet investigations or restricted agency data should be entered. Review legal and technical material against current authoritative guidance before institutional use. Progress is saved in this browser.</div>
 </main>;
}
