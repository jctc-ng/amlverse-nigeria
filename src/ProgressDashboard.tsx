import {useState} from 'react';
import {modules,readCourse,readScore,readFatf,readLegacy} from './progress';
import type {CourseKey} from './progress';
import {hasCelebrated,worldComplete} from './WorldCompletion';

type Props={onBack:()=>void;onOpen:(id:CourseKey)=>void;onFatf:()=>void;onCapstone:()=>void};
export default function ProgressDashboard({onBack,onOpen,onFatf,onCapstone}:Props){
 const [refresh,setRefresh]=useState(0);
 const courses=modules.map(m=>({...m,learning:readCourse(m.id),score:readScore(m.scoreKey)}));
 const fatf=readFatf();
 const legacy=readLegacy();
 const seen=courses.reduce((s,m)=>s+m.learning.lessons.length,0);
 const passed=courses.filter(m=>m.learning.checkPassed).length;
 const played=courses.filter(m=>m.score>0).length;
 const totalLessons=modules.length*3;
 const journeySteps=totalLessons+modules.length*2;
 const doneSteps=seen+passed+played;
 const percent=Math.round(doneSteps/journeySteps*100);
 const totalScore=courses.reduce((sum,m)=>sum+m.score,0);
 const earned=legacy.xp+fatf.earned+totalScore;
 const level=earned>=2200?'Master Explorer':earned>=1200?'Advanced Explorer':earned>=500?'Rising Investigator':'Rookie Analyst';
 const championCount=modules.filter(m=>worldComplete(m.id)).length;
 const capstone=(()=>{try{const x=JSON.parse(localStorage.getItem('amlverse-capstone-v1')||'{}') as {best?:number;passed?:boolean};return {best:typeof x.best==='number'?x.best:0,passed:x.passed===true}}catch{return {best:0,passed:false}}})();
 const badges=[
 {icon:'🛡️',title:'Integrity Challenger',earned:capstone.passed,hint:'Pass the integrated capstone at 80% or above'},
 {icon:'📚',title:'Curious Learner',earned:seen>=3,hint:'Explore three different lessons'},
 {icon:'🧠',title:'Knowledge Seeker',earned:passed>=2,hint:'Pass two quick checks'},
 {icon:'🎮',title:'First Mission',earned:played>=1,hint:'Complete an arcade mission'},
 {icon:'🕵️',title:'Case Detective',earned:readScore('amlverse-typology-best')>0,hint:'Complete Typology Detective'},
 {icon:'🌍',title:'Global Collaborator',earned:readScore('amlverse-egmont-best')>0,hint:'Complete Egmont Exchange'},
 {icon:'🏆',title:'Learning Champion',earned:played===modules.length,hint:'Finish all six arcade games'},
 {icon:'🎁',title:'World Champion',earned:championCount>=1,hint:'Complete all five milestones in a learning world'}
 ];
 return <main className="narrow progressdash">
 <button className="back" onClick={onBack}>← Academy overview</button><span className="eyebrow">YOUR PERSONAL LEARNING RECORD</span>
 <h1 className="title">My Progress 🏅</h1><p className="lead">See what you've learned, the missions you've completed and what to explore next. Your records stay in this browser.</p>
 <div className="progresshero"><div><span className="eyebrow">CURRENT LEARNING LEVEL</span><h2>{level}</h2><p>{earned.toLocaleString()} learning points (combined local results)</p></div><div className="progressring" style={{background:'conic-gradient(#64e9c7 '+percent+'%,#254d57 '+percent+'%)'}}><span>{percent}%<small>overall</small></span></div></div>
 <div className="progressstats"><div><small>LESSONS EXPLORED</small><strong>{seen}<span> / {totalLessons}</span></strong></div><div><small>QUICK CHECKS PASSED</small><strong>{passed}<span> / {modules.length}</span></strong></div><div><small>GAMES COMPLETED</small><strong>{played}<span> / {modules.length}</span></strong></div><div><small>FATF QUEST PERFECT</small><strong>{fatf.perfect}<span> / 10</span></strong></div></div>
 <section className="progresssection"><h2>Learning worlds</h2><p>Each world has three short lessons, a quick check and a game. Explore each step in any order.</p><div className="progressworlds">{courses.map(m=>{
 const total=m.learning.lessons.length+(m.learning.checkPassed?1:0)+(m.score>0?1:0);
 return <article className="progressworld" key={m.id}><div className="progressworldhead"><div className="progressworldname"><span>{m.icon}</span><div><b>{m.title}</b><small>{m.score>0?'Mission complete':'Ready to explore'}</small></div></div><strong>{total}/5</strong></div><div className="arcadeprogress"><div style={{width:(total/5*100)+'%'}}/></div><div className="progressmarks"><span>📚 {m.learning.lessons.length}/3 lessons</span><span>🧠 {m.learning.checkPassed?'Passed':'Not recorded'}</span><span>🏆 Best: {m.score||'—'}{m.score>0?'/'+m.maxScore:''}</span>{hasCelebrated(m.id)?<span>🎁 World Champion gift claimed</span>:null}</div><button type="button" className="secondary" onClick={()=>onOpen(m.id)}>{total===5?'Replay / review world →':m.learning.lessons.length===3&&!m.learning.checkPassed?'Complete Quick Check →':'Continue learning →'}</button></article>
 })}</div></section>
 <section className="progresssection"><h2>FATF Quest</h2><div className="progressworld"><div className="progressworldhead"><div><b>Recommendations 1–10</b><p>{fatf.attempted} lessons attempted · {fatf.perfect} perfect lessons</p></div><strong>{fatf.earned} XP</strong></div><div className="arcadeprogress"><div style={{width:(fatf.perfect/10*100)+'%'}}/></div><button type="button" className="secondary" onClick={onFatf}>Open FATF Quest →</button></div></section>
 <section className="progresssection"><h2>Integrated Capstone Challenge</h2><div className="progressworld"><div className="progressworldhead"><div><b>Operation Integrity Shield</b><p>Apply risk, tracing, cooperation and report writing in one fictional case.</p></div><strong>{capstone.best}% best</strong></div><p>{capstone.passed?"✓ Practice passed — Integrity Challenger achievement unlocked.":"Practice pass threshold: 80%. No prior world completion is required."}</p><button type="button" className="secondary" onClick={onCapstone}>{capstone.passed?"Replay Capstone →":"Open Capstone →"}</button></div></section>
 <section className="progresssection"><h2>Achievements</h2><div className="badgegrid">{badges.map(b=><div key={b.title} className={'achievement'+(b.earned?' unlocked':'')}><span aria-hidden="true">{b.icon}</span><b>{b.title}</b><small>{b.earned?'✓ Unlocked':b.hint}</small></div>)}</div></section>
 <div className="progressactions"><button className="secondary" type="button" onClick={()=>setRefresh(refresh+1)}>↻ Refresh progress</button><button className="secondary" type="button" onClick={()=>{const rows=['World,Lessons,Quick Check Passed,Best Game Score',...courses.map(m=>[m.title,m.learning.lessons.length,m.learning.checkPassed?'Yes':'No',m.score].join(','))];const blob=new Blob([rows.join('\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='amlverse-personal-progress.csv';link.click();URL.revokeObjectURL(url)}}>↓ Export CSV</button></div>
 <div className="notice"><b>Local progress only.</b> Scores and activities are saved to this device's browser storage and may disappear when browser data is cleared. These achievements are informal learning milestones, not professional qualifications. Completion is counted only after a game records a result. Older lesson visits and Quick Check passes were not previously tracked, but earlier saved game and FATF scores are included. If your game score is complete but Quick Check says Not recorded, open that learning room, select Quick Check, answer correctly and press Check understanding.</div>
 </main>;
}
