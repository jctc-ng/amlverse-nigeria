import {useState} from 'react';
import {modules,readCourse,readScore,readFatf,readLegacy} from './progress';
import type {CourseKey} from './progress';
import {hasCelebrated,worldComplete} from './WorldCompletion';
import {readRiskAdvancedProgress,riskAdvancedMastered} from './RiskLabAdvanced';
import {readNigeriaAdvancedProgress,nigeriaAdvancedMastered} from './NigeriaComplianceAdvanced';
import {readVirtualAdvancedProgress,virtualAdvancedMastered,virtualGraphScholar} from './VirtualAssetAdvanced';
import {readInteractiveTraceProgress} from './InteractiveTracingLab';
import {readWorldInteractionProgress} from './InteractiveWorldChallenge';
import {readDecisionProgress} from './WorldDecisionLab';
import {readAcademyMetrics,csvProgress} from './AcademyMetrics';

type Props={onBack:()=>void;onOpen:(id:CourseKey,section?:string)=>void;onFatf:()=>void;onCapstone:()=>void};
export default function ProgressDashboard({onBack,onOpen,onFatf,onCapstone}:Props){
 const [refresh,setRefresh]=useState(0);
 const metrics=readAcademyMetrics();
 const courses=modules.map(m=>({...m,learning:readCourse(m.id),score:readScore(m.scoreKey)}));
 const fatf=readFatf();
 const legacy=readLegacy();
 const seen=courses.reduce((s,m)=>s+m.learning.lessons.length,0);
 const passed=courses.filter(m=>m.learning.checkPassed).length;
 const played=courses.filter(m=>m.score>0).length;
 const totalLessons=modules.length*3;
 const percent=metrics.percent;
 const totalScore=courses.reduce((sum,m)=>sum+m.score,0);
 const earned=legacy.xp+fatf.earned+totalScore;
 const level=earned>=2200?'Master Explorer':earned>=1200?'Advanced Explorer':earned>=500?'Rising Investigator':'Rookie Analyst';
 const championCount=modules.filter(m=>worldComplete(m.id)).length;
 const riskAdvanced=readRiskAdvancedProgress();
 const riskAdvancedDone=riskAdvancedMastered(riskAdvanced);
 const riskAdvancedSteps=riskAdvanced.visited.length+(['Foundations','Intermediate','Advanced'] as const).filter(t=>riskAdvanced.quizPass[t]).length+(['Foundations','Intermediate','Advanced'] as const).filter(t=>riskAdvanced.simPass[t]).length;
 const nigeriaExpanded=readNigeriaAdvancedProgress();
 const nigeriaExpandedDone=nigeriaAdvancedMastered(nigeriaExpanded);
 const nigeriaExpandedSteps=nigeriaExpanded.visited.length+(['Foundations','Intermediate','Advanced'] as const).filter(t=>nigeriaExpanded.quizPass[t]).length+(['Foundations','Intermediate','Advanced'] as const).filter(t=>nigeriaExpanded.simPass[t]).length;
 const virtualExpanded=readVirtualAdvancedProgress();
 const virtualExpandedDone=virtualAdvancedMastered(virtualExpanded);
 const virtualGraphDone=virtualGraphScholar(virtualExpanded);
 const interactiveTraces=readInteractiveTraceProgress();
 const interactiveTraceDone=interactiveTraces.completed.length===6;
 const worldInteractiveTotals=modules.map(m=>({id:m.id,title:m.title,done:readWorldInteractionProgress(m.id).completed.length}));
 const worldInteractiveComplete=worldInteractiveTotals.filter(x=>x.done===3).length;
 const totalInteractiveCases=worldInteractiveTotals.reduce((n,x)=>n+x.done,0);
 const decisionTotals=modules.map(m=>({id:m.id,title:m.title,passed:readDecisionProgress(m.id).passed,best:readDecisionProgress(m.id).best}));
 const decisionsPassed=decisionTotals.filter(x=>x.passed).length;
 const virtualExpandedSteps=virtualExpanded.visited.length+virtualExpanded.lessonChecks.length+(['Foundations','Intermediate','Advanced'] as const).filter(t=>virtualExpanded.quizPass[t]).length+(['Foundations','Intermediate','Advanced'] as const).filter(t=>virtualExpanded.simPass[t]).length;
 const capstone=(()=>{try{const x=JSON.parse(localStorage.getItem('amlverse-capstone-v1')||'{}') as {best?:number;passed?:boolean};return {best:typeof x.best==='number'?x.best:0,passed:x.passed===true}}catch{return {best:0,passed:false}}})();
 const achievedWorlds=courses.filter(m=>m.learning.lessons.length===3&&m.learning.checkPassed&&m.score>0);
 const trackSets=[
  {name:'Foundations & Standards',icon:'📚',worlds:['risk','team','evaluation']},
  {name:'Financial Intelligence & Cooperation',icon:'🌐',worlds:['egmont','typologies','nigeria']},
  {name:'Blockchain Investigation & Reporting',icon:'🔗',worlds:['virtualassets','advancedtrace','reportwriting']}
 ];
 type Achievement={icon:string;title:string;earned:boolean;hint:string;category:'milestone'|'world'|'track'|'special';progress:string};
 const badges:Achievement[]=[
 {icon:'🗂️',title:'Decision Lab Master',earned:decisionsPassed===modules.length,hint:'Complete evidence-based decision investigations in all nine worlds',category:'special',progress:decisionsPassed+'/9 decision labs passed'},
  {icon:'🧩',title:'Interactive Academy Investigator',earned:worldInteractiveComplete===modules.length,hint:'Finish all three interactive investigations in every learning world',category:'special',progress:totalInteractiveCases+'/27 case investigations'},
  {icon:'🧭',title:'Interactive Graph Investigator',earned:interactiveTraceDone,hint:'Complete all six interactive wallet-and-transaction graph missions',category:'special',progress:interactiveTraces.completed.length+'/6 missions'},
  {icon:'🕸️',title:'Graph Tracing Scholar',earned:virtualGraphDone,hint:'Pass all twelve five-question visual tracing lesson checks',category:'special',progress:virtualExpanded.lessonChecks.length+'/12 graph checks'},
  {icon:'🔗',title:'Virtual Asset Advanced Master',earned:virtualExpandedDone,hint:'Complete all twelve virtual asset lessons, pass three tier quizzes and finish three tracing simulations',category:'special',progress:virtualExpandedSteps+'/30 expanded milestones'},
  {icon:'🇳🇬',title:'Nigeria Compliance Advanced Master',earned:nigeriaExpandedDone,hint:'Explore all 12 Nigeria lessons, pass all three tier quizzes and complete all three case simulations',category:'special',progress:nigeriaExpandedSteps+'/18 expanded milestones'},
  {icon:'🧪',title:'RiskLab Advanced Master',earned:riskAdvancedDone,hint:'Explore all 12 lessons, pass three tier quizzes and complete all three case simulations',category:'special',progress:riskAdvancedSteps+'/18 expanded milestones'},
  {icon:'📖',title:'Curious Learner',earned:courses.filter(m=>m.learning.lessons.length>0).length>=3,hint:'Explore lessons in three different learning worlds',category:'milestone',progress:courses.filter(m=>m.learning.lessons.length>0).length+'/3 worlds'},
  {icon:'🧠',title:'Knowledge Seeker',earned:passed>=2,hint:'Pass two different world Quick Checks',category:'milestone',progress:passed+'/2 checks'},
  {icon:'🎮',title:'First Mission',earned:played>=1,hint:'Complete your first arcade game',category:'milestone',progress:played>=1?'1/1 game':'0/1 game'},
  {icon:'🕵️',title:'Case Detective',earned:readScore('amlverse-typology-best')>0,hint:'Finish the Typology Detective game',category:'milestone',progress:readScore('amlverse-typology-best')>0?'1/1 game':'0/1 game'},
  {icon:'🌍',title:'Global Collaborator',earned:readScore('amlverse-egmont-best')>0,hint:'Finish the Egmont Exchange game',category:'milestone',progress:readScore('amlverse-egmont-best')>0?'1/1 game':'0/1 game'},
  {icon:'🎁',title:'World Champion',earned:championCount>=1,hint:'Complete three lessons, a Quick Check and a game in one world',category:'milestone',progress:championCount+'/1 world'},
  {icon:'🏆',title:'Learning Champion',earned:played===modules.length,hint:'Complete all nine academy arcade games',category:'milestone',progress:played+'/'+modules.length+' games'},
  {icon:'🌟',title:'Academy Master',earned:achievedWorlds.length===modules.length,hint:'Complete all five milestones across all nine learning worlds',category:'milestone',progress:achievedWorlds.length+'/'+modules.length+' worlds'},
  ...courses.map(m=>({icon:m.icon,title:m.title+' Champion',earned:m.learning.lessons.length===3&&m.learning.checkPassed&&m.score>0,hint:'Finish all five milestones in '+m.title,category:'world' as const,progress:(m.learning.lessons.length+(m.learning.checkPassed?1:0)+(m.score>0?1:0))+'/5 milestones'})),
  ...trackSets.map(t=>({icon:t.icon,title:t.name+' Specialist',earned:t.worlds.every(id=>achievedWorlds.some(m=>m.id===id)),hint:'Complete all three worlds in this learning track',category:'track' as const,progress:t.worlds.filter(id=>achievedWorlds.some(m=>m.id===id)).length+'/3 worlds'})),
  {icon:'⭐',title:'FATF Quest Explorer',earned:fatf.attempted>=1,hint:'Attempt a FATF Quest Recommendation lesson',category:'special',progress:fatf.attempted+'/1 attempted'},
  {icon:'🏅',title:'FATF Quest Master',earned:fatf.perfect>=10,hint:'Earn a perfect result in all ten FATF Quest lessons',category:'special',progress:fatf.perfect+'/10 perfect'},
  {icon:'🛡️',title:'Integrity Challenger',earned:capstone.passed,hint:'Pass the integrated capstone with at least 80%',category:'special',progress:capstone.best+'% best'}
 ];
 const unlocked=badges.filter(b=>b.earned).length;
 const [achievementFilter,setAchievementFilter]=useState<'all'|'earned'|'locked'>('all');
 const visibleBadges=badges.filter(b=>achievementFilter==='all'||(achievementFilter==='earned'?b.earned:!b.earned));
 return <main className="narrow progressdash">
 <button className="back" onClick={onBack}>← Academy overview</button><span className="eyebrow">YOUR PERSONAL LEARNING RECORD</span>
 <h1 className="title">My Progress 🏅</h1><p className="lead">See what you've learned, the missions you've completed and what to explore next. Your records stay in this browser.</p>
 <div className="progresshero"><div><span className="eyebrow">COMPLETE LEARNING RECORD · V0.31</span><h2>{level}</h2><p>{earned.toLocaleString()} learning points · {metrics.fullWorlds}/9 worlds fully complete · {metrics.classicWorlds}/9 World Champion requirements met</p></div><div className="progressring" style={{background:'conic-gradient(#64e9c7 '+percent+'%,#254d57 '+percent+'%)'}}><span>{percent}%<small>overall</small></span></div></div>
 <div className="academy31headline"><strong>{metrics.done} / {metrics.total} learning activities completed</strong><p>Includes classic lessons and games, interactive cases, expanded academies, decision labs and cryptocurrency graph missions. FATF Quest and the Capstone are tracked separately.</p>{metrics.resume?<button type="button" className="primary" onClick={()=>onOpen(metrics.resume!.id,metrics.resume!.resume||undefined)}>Resume next: {metrics.resume.title} →</button>:<button type="button" className="primary" onClick={()=>onOpen('risk')}>Review completed worlds →</button>}</div>
 <div className="progressstats"><div><small>LESSONS EXPLORED</small><strong>{seen}<span> / {totalLessons}</span></strong></div><div><small>QUICK CHECKS PASSED</small><strong>{passed}<span> / {modules.length}</span></strong></div><div><small>GAMES COMPLETED</small><strong>{played}<span> / {modules.length}</span></strong></div><div><small>FATF QUEST PERFECT</small><strong>{fatf.perfect}<span> / 10</span></strong></div></div>
 <section className="progresssection"><h2>Learning worlds — complete activity tracking</h2><p>Every row uses the same milestone calculation as Academy Overview and the individual world completion tracker. Expand a world to review sections, or resume the next unfinished activity.</p><div className="progressworlds">{metrics.worlds.map(w=><article className="progressworld" key={w.id}>
  <div className="progressworldhead"><div className="progressworldname"><span>{w.icon}</span><div><b>{w.title}</b><small>{w.classicDone?'✓ Original World Champion requirements met':'Original course still in progress'}</small></div></div><strong>{w.percent}%</strong></div>
  <div className="arcadeprogress" role="progressbar" aria-label={w.title+' completion'} aria-valuenow={w.done} aria-valuemin={0} aria-valuemax={w.total}><div style={{width:w.percent+'%'}}/></div>
  <div className="progressmarks"><span>✓ {w.done}/{w.total} milestones</span><span>🏆 Best game score: {w.score||'—'}</span><span>📂 {w.sections.length} learning activities</span>{hasCelebrated(w.id)?<span>🎁 Champion gift claimed</span>:null}</div>
  <details className="progress31details"><summary>View individual activity progress</summary><div className="progress31sections">{w.sections.map(section=><div key={section.id}><div className="worldprogresssectionhead"><strong>{section.name}</strong><span>{section.done}/{section.total}</span></div><div className="worldmetertrack"><div style={{width:Math.round(100*section.done/section.total)+'%'}}/></div><small>{section.detail}</small></div>)}</div></details>
  <button type="button" className="secondary" onClick={()=>onOpen(w.id,w.resume||undefined)}>{w.resume?'Resume next activity →':'Review completed world →'}</button>
 </article>)}</div></section>
 <section className="progresssection"><h2>RiskLab Advanced Curriculum</h2><div className="progressworld"><div className="progressworldhead"><div><b>RiskLab Academy 2.0</b><p>12 lessons · 60-question bank · three tier quizzes · three fictional case simulations</p></div><strong>{riskAdvancedSteps}/18</strong></div><div className="arcadeprogress"><div style={{width:(riskAdvancedSteps/18*100)+"%"}}/></div><div className="progressmarks"><span>📚 {riskAdvanced.visited.length}/12 lessons</span><span>🧠 {(["Foundations","Intermediate","Advanced"] as const).filter(t=>riskAdvanced.quizPass[t]).length}/3 quizzes passed</span><span>🎮 {(["Foundations","Intermediate","Advanced"] as const).filter(t=>riskAdvanced.simPass[t]).length}/3 simulations passed</span></div><p>{riskAdvancedDone?"✓ Advanced RiskLab Master achievement unlocked.":"Your classic RiskLab score and World Champion achievement remain unaffected."}</p><button type="button" className="secondary" onClick={()=>onOpen("risk")}>Open RiskLab →</button></div></section>
 <section className="progresssection"><h2>Nigeria Compliance Advanced Curriculum</h2><div className="progressworld"><div className="progressworldhead"><div><b>Nigeria Compliance Academy 2.0</b><p>12 lessons · 60-question bank · three tier quizzes · three fictional compliance simulations</p></div><strong>{nigeriaExpandedSteps}/18</strong></div><div className="arcadeprogress"><div style={{width:(nigeriaExpandedSteps/18*100)+'%'}}/></div><div className="progressmarks"><span>📚 {nigeriaExpanded.visited.length}/12 lessons</span><span>🧠 {(['Foundations','Intermediate','Advanced'] as const).filter(t=>nigeriaExpanded.quizPass[t]).length}/3 quizzes passed</span><span>🎮 {(['Foundations','Intermediate','Advanced'] as const).filter(t=>nigeriaExpanded.simPass[t]).length}/3 simulations passed</span></div><p>{nigeriaExpandedDone?'✓ Nigeria Compliance Advanced Master achievement unlocked.':'Existing Nigeria Compliance achievements are preserved separately.'}</p><button type="button" className="secondary" onClick={()=>onOpen('nigeria')}>Open Nigeria Compliance →</button></div></section>
 <section className="progresssection"><h2>Virtual Asset Academy 2.0</h2><div className="progressworld"><div className="progressworldhead"><div><b>Virtual Asset Advanced Investigation</b><p>12 analogy-and-graph lessons · 120 study questions · 3 case simulations · 6 clickable graph missions</p></div><strong>{virtualExpandedSteps}/30</strong></div><div className="arcadeprogress"><div style={{width:(virtualExpandedSteps/30*100)+'%'}}/></div><div className="progressmarks"><span>📚 {virtualExpanded.visited.length}/12 lessons</span><span>🕸️ {virtualExpanded.lessonChecks.length}/12 graph checks</span><span>🧭 {interactiveTraces.completed.length}/6 interactive missions (separate award)</span><span>🧠 {(['Foundations','Intermediate','Advanced'] as const).filter(t=>virtualExpanded.quizPass[t]).length}/3 quizzes passed</span><span>🔗 {(['Foundations','Intermediate','Advanced'] as const).filter(t=>virtualExpanded.simPass[t]).length}/3 simulations passed</span></div><p>{virtualExpandedDone?'✓ Virtual Asset Advanced Master achievement unlocked.':'Existing Virtual Asset Academy game scores and World Champion achievements remain intact.'}</p><button type="button" className="secondary" onClick={()=>onOpen('virtualassets')}>Open Virtual Asset Academy →</button></div></section>
 <section className="progresssection"><h2>Interactive World Investigations</h2><div className="progressworld"><div className="progressworldhead"><div><b>Hands-on decision challenges</b><p>Three evidence-matching or investigative-sequencing cases in each of the nine worlds. These are separate from the original arcade scores.</p></div><strong>{totalInteractiveCases}/27</strong></div><div className="arcadeprogress"><div style={{width:(totalInteractiveCases/27*100)+'%'}}/></div><div className="progressmarks"><span>🧩 {worldInteractiveComplete}/9 worlds fully explored</span><span>🏅 {totalInteractiveCases}/27 cases completed</span></div><div className="wcinteractiveprogresslist">{worldInteractiveTotals.map(w=><button key={w.id} className="secondary" type="button" onClick={()=>onOpen(w.id)}>{w.title}: {w.done}/3 →</button>)}</div></div></section>
 <section className="progresssection"><h2>World-Specific Investigation Decision Labs</h2><div className="progressworld"><div className="progressworldhead"><div><b>Professional decision practice</b><p>Nine subject-specific evidence dossiers, three branching investigation decisions per dossier, with feedback and saved scores.</p></div><strong>{decisionsPassed}/9</strong></div><div className="arcadeprogress"><div style={{width:(decisionsPassed/9*100)+'%'}}/></div><div className="wcinteractiveprogresslist">{decisionTotals.map(d=><button type="button" className="secondary" key={d.id} onClick={()=>onOpen(d.id)}>{d.title}: {d.passed?'✓ Passed':'Not passed'} · Best {d.best}% →</button>)}</div></div></section>
 <section className="progresssection"><h2>FATF Quest</h2><div className="progressworld"><div className="progressworldhead"><div><b>Recommendations 1–10</b><p>{fatf.attempted} lessons attempted · {fatf.perfect} perfect lessons</p></div><strong>{fatf.earned} XP</strong></div><div className="arcadeprogress"><div style={{width:(fatf.perfect/10*100)+'%'}}/></div><button type="button" className="secondary" onClick={onFatf}>Open FATF Quest →</button></div></section>
 <section className="progresssection"><h2>Integrated Capstone Challenge</h2><div className="progressworld"><div className="progressworldhead"><div><b>Operation Integrity Shield</b><p>Apply risk, tracing, cooperation and report writing in one fictional case.</p></div><strong>{capstone.best}% best</strong></div><p>{capstone.passed?"✓ Practice passed — Integrity Challenger achievement unlocked.":"Practice pass threshold: 80%. No prior world completion is required."}</p><button type="button" className="secondary" onClick={onCapstone}>{capstone.passed?"Replay Capstone →":"Open Capstone →"}</button></div></section>
 <section className="progresssection" aria-labelledby="achievements-title">
  <div className="progressachievementhead"><div><h2 id="achievements-title">Achievements</h2><p>Earn milestone, world, track and special practice awards as you learn.</p></div><strong>{unlocked} / {badges.length} unlocked</strong></div>
  <div className="achievementfilters" role="group" aria-label="Filter achievements">
   <button type="button" className={achievementFilter==='all'?'active':''} onClick={()=>setAchievementFilter('all')}>All ({badges.length})</button>
   <button type="button" className={achievementFilter==='earned'?'active':''} onClick={()=>setAchievementFilter('earned')}>Unlocked ({unlocked})</button>
   <button type="button" className={achievementFilter==='locked'?'active':''} onClick={()=>setAchievementFilter('locked')}>To earn ({badges.length-unlocked})</button>
  </div>
  <div className="badgegrid">{visibleBadges.map(b=><div key={b.title} className={'achievement'+(b.earned?' unlocked':'')}><span aria-hidden="true">{b.icon}</span><b>{b.title}</b><small>{b.earned?'✓ Achievement unlocked':b.hint}</small><small className="achievementprogress">{b.progress}</small></div>)}</div>
  {!visibleBadges.length?<p className="chainnote">No achievements match this filter.</p>:null}
  <p className="achievementnote">World Champion awards require all five learning milestones; finishing the game alone does not unlock them. Achievements are based on locally saved progress and are not professional certifications.</p>
 </section>
 <div className="progressactions"><button className="secondary" type="button" onClick={()=>setRefresh(refresh+1)}>↻ Refresh progress</button><button className="secondary" type="button" onClick={()=>{const blob=new Blob([csvProgress()],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='amlverse-complete-learning-record.csv';link.click();URL.revokeObjectURL(url)}}>↓ Export all activities (CSV)</button></div>
 <div className="notice"><b>Local progress only.</b> Scores and activities are saved to this device's browser storage and may disappear when browser data is cleared. These achievements are informal learning milestones, not professional qualifications. Game completion is recorded after a game result; world completion also requires all lessons and the Quick Check. Older lesson visits and Quick Check passes were not previously tracked, but earlier saved game and FATF scores are included. If your game score is complete but Quick Check says Not recorded, open that learning room, select Quick Check, answer correctly and press Check understanding.</div>
 </main>;
}
