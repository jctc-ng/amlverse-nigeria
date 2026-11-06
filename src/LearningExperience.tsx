import {useState} from 'react';
import GameArcade from './GameArcade';
import EvaluationArena from './EvaluationArena';
import EgmontExchange from './EgmontExchange';

type Game='risk'|'team'|'evaluation'|'egmont';
type Topic={title:string;explanation:string;example:string;takeaway:string};
type Course={name:string;subtitle:string;goal:string;topics:Topic[];question:string;answers:{text:string;correct:boolean;why:string}[];sourceName:string;source:string};
const courses:Record<Game,Course>={
 risk:{
 name:'Risk Assessment Basics',subtitle:'RiskLab Learning Room',goal:'Understand threats, vulnerabilities, and controls before sorting the clues.',
 topics:[
 {title:'Threat: what could go wrong?',explanation:'A threat is a person, group or activity that could cause money laundering or terrorist financing harm.',example:'A fraud network tries to move stolen money through payment accounts.',takeaway:'Think: Who or what might cause the harm?'},
 {title:'Vulnerability: what makes it easier?',explanation:'A vulnerability is a weakness criminals could exploit. Different sectors and institutions may face different weaknesses.',example:'A payment firm does not verify who really owns its corporate customers.',takeaway:'Think: Which gap could be exploited?'},
 {title:'Control: how do we reduce the risk?',explanation:'A control is a preventive or detective measure that helps manage identified risks. Its effectiveness should be tested, not assumed.',example:'Customer due diligence and transaction monitoring help identify unusual behaviour.',takeaway:'Think: What proportionate measure helps?'}],
 question:'A company does not verify its customers’ beneficial owners. What does this describe?',
 answers:[{text:'A vulnerability',correct:true,why:'Correct. Missing beneficial ownership checks create a weakness that criminals could exploit.'},{text:'A criminal threat',correct:false,why:'A threat is a potential source of harm. Here, the clue describes a weakness in the company.'},{text:'A strong control',correct:false,why:'A control would reduce risk; missing checks do the opposite.'}],
 sourceName:'FATF Recommendations — risk-based approach (Recommendation 1)',source:'https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html'
 },
 team:{
 name:'Who Does What?',subtitle:'Interagency Learning Room',goal:'Learn why different agencies cooperate without having identical jobs.',
 topics:[
 {title:'Financial Intelligence Units',explanation:'An FIU receives, analyses and disseminates financial information in accordance with its legal mandate.',example:'An analyst identifies suspicious patterns and sends financial intelligence to authorised recipients.',takeaway:'Think: Analyse and disseminate intelligence.'},
 {title:'Investigators and supervisors',explanation:'Law enforcement investigates suspected offences; financial supervisors assess whether regulated firms follow AML/CFT obligations.',example:'Investigators seek admissible evidence while supervisors test a bank’s customer checks.',takeaway:'Think: Investigate suspected crimes; supervise controls.'},
 {title:'Prosecutors and lawful cooperation',explanation:'Prosecutors assess and present cases in court. Agencies can work together through authorised channels while protecting confidential information.',example:'An investigation uses lawfully obtained intelligence, evidence and prosecutorial review.',takeaway:'Think: Different mandates, coordinated action.'}],
 question:'A regulated payment company has poor customer due diligence. Who typically examines its regulatory compliance?',
 answers:[{text:'A competent financial supervisor',correct:true,why:'Correct. Supervisors examine firms’ compliance with applicable requirements.'},{text:'A courtroom prosecutor as routine examiner',correct:false,why:'Prosecutors handle criminal proceedings, not routine financial-sector supervision.'},{text:'An FIU acting as the firm’s external auditor',correct:false,why:'An FIU analyses financial information; it does not automatically perform routine supervisory audits.'}],
 sourceName:'FATF Recommendations — FIU, supervision and cooperation',source:'https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html'
 },
 evaluation:{
 name:'Mutual Evaluations Made Simple',subtitle:'Mutual Evaluation Learning Room',goal:'Learn how technical compliance differs from effectiveness.',
 topics:[
 {title:'What is a mutual evaluation?',explanation:'FATF-style mutual evaluations examine a jurisdiction’s AML/CFT framework and how well it works in practice.',example:'Assessors review legal provisions and documented operational results.',takeaway:'Think: Rules plus demonstrated outcomes.'},
 {title:'Technical compliance',explanation:'Technical compliance examines the legal and institutional framework against FATF Recommendations.',example:'An enforceable law sets requirements for customer due diligence.',takeaway:'Think: Are the required rules and powers in place?'},
 {title:'Effectiveness',explanation:'Effectiveness asks whether measures achieve relevant outcomes, drawing on credible evidence. Activity counts alone may not demonstrate results.',example:'Documented cases show financial intelligence being used effectively in investigations.',takeaway:'Think: What actually changed or worked?'}],
 question:'Which item best supports a claim about effectiveness rather than technical compliance alone?',
 answers:[{text:'Verified examples showing financial intelligence was used in investigations',correct:true,why:'Correct. Documented use and results support an effectiveness assessment.'},{text:'A new law granting an agency powers',correct:false,why:'A law mainly demonstrates legal arrangements, not whether they are effective.'},{text:'An unverified statement that the system works',correct:false,why:'Unsupported claims do not substantiate outcomes.'}],
 sourceName:'FATF Mutual Evaluations',source:'https://www.fatf-gafi.org/en/topics/mutual-evaluations.html'
 },
 egmont:{
 name:'Secure FIU Cooperation',subtitle:'Egmont Learning Room',goal:'Understand purpose, confidentiality, consent and secure channels before handling a fictional request.',
 topics:[
 {title:'Why FIUs cooperate',explanation:'Financial flows can cross borders. FIUs exchange information through recognised cooperation arrangements and within applicable law.',example:'An FIU requests information to help analyse suspected cross-border laundering.',takeaway:'Think: Cooperation with a clear, lawful purpose.'},
 {title:'Use information for its authorised purpose',explanation:'Information obtained from another FIU is subject to conditions governing use and onward dissemination. New purposes may require prior authorisation.',example:'A request to use intelligence in court for a new purpose is checked with the providing FIU.',takeaway:'Think: Check scope and authorisation first.'},
 {title:'Protect confidentiality',explanation:'FIU exchanges require secure communications, access controls and respect for confidentiality obligations.',example:'Use approved secure channels rather than personal email or public platforms.',takeaway:'Think: Share only through approved, protected routes.'}],
 question:'You want to use foreign FIU intelligence for a new purpose not originally authorised. What should you do?',
 answers:[{text:'Seek prior authorisation from the providing FIU as required',correct:true,why:'Correct. A change in purpose requires the appropriate authorisation under the Egmont information-exchange principles.'},{text:'Upload it to a public website',correct:false,why:'Public disclosure would risk breaching confidentiality and use restrictions.'},{text:'Forward it from a private email account',correct:false,why:'Unapproved communication channels can compromise sensitive information.'}],
 sourceName:'Egmont Principles for Information Exchange (May 2022)',source:'https://egmontgroup.org/wp-content/uploads/2013/10/2.-Principles-Information-Exchange-Revised-May-2022.pdf'
 }
};
export default function LearningExperience({game,onBack}:{game:Game;onBack:()=>void}){
 const [playing,setPlaying]=useState(false);
 const [topic,setTopic]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const [showFeedback,setShowFeedback]=useState(false);
 const course=courses[game];
 const item=course.topics[topic];
 const mastered=showFeedback&&answer!==null&&course.answers[answer].correct;
 if(playing){
  if(game==='risk'||game==='team')return <GameArcade key={game} mode={game} onBack={()=>setPlaying(false)}/>;
  if(game==='evaluation')return <EvaluationArena onBack={()=>setPlaying(false)}/>;
  return <EgmontExchange onBack={()=>setPlaying(false)}/>;
 }
 return <main className="narrow knowledgepath">
 <button className="back" onClick={onBack}>← Academy overview</button>
 <span className="eyebrow">AMLVERSE LEARN • PRACTISE • PLAY</span>
 <h1 className="title">{course.name}</h1>
 <p className="lead">{course.goal}</p>
 <div className="knowledgeflow"><span className="active">① Learn</span><span>② Quick check</span><span>③ Play</span></div>
 <div className="knowledgeintro"><span className="knowledgeemoji" aria-hidden="true">📚</span><div><small>LEARNING ROOM</small><h2>{course.subtitle}</h2><p>Read three short lessons and try one practice question. You can explore at your own pace, or enter the game when you're ready.</p></div></div>
 <div className="knowledgetabs" role="group" aria-label="Learning topics">{course.topics.map((t,i)=><button key={i} className={topic===i?'on':''} onClick={()=>setTopic(i)} type="button"><span>Lesson {i+1}</span><b>{t.title}</b></button>)}</div>
 <section className="knowledgecard"><small>LESSON {topic+1} OF {course.topics.length}</small><h2>{item.title}</h2><p>{item.explanation}</p><div className="knowledgeexample"><b>Example</b><p>{item.example}</p></div><div className="knowledgetakeaway"><b>Remember:</b> {item.takeaway}</div><div className="actions">{topic>0?<button className="secondary" type="button" onClick={()=>setTopic(i=>i-1)}>← Previous</button>:null}{topic<course.topics.length-1?<button className="primary" type="button" onClick={()=>setTopic(i=>i+1)}>Next lesson →</button>:<button className="primary" type="button" onClick={()=>document.getElementById('knowledge-check')?.scrollIntoView({behavior:'smooth',block:'start'})}>Try a quick check ↓</button>}</div></section>
 <section id="knowledge-check" className="knowledgecheck"><span className="eyebrow">QUICK UNDERSTANDING CHECK</span><h2>{course.question}</h2><div className="knowledgeanswers">{course.answers.map((a,i)=><button key={i} type="button" className={answer===i?'selected':''} onClick={()=>{setAnswer(i);setShowFeedback(false)}}><span>{String.fromCharCode(65+i)}</span>{a.text}</button>)}</div>
 {showFeedback&&answer!==null?<div className="arcadefeedback" role="status">{course.answers[answer].why}</div>:null}
 <div className="actions"><button type="button" className="primary" disabled={answer===null} onClick={()=>setShowFeedback(true)}>Check understanding →</button></div>
 </section>
 <section className="knowledgeplay"><div><span className="eyebrow">READY FOR THE MISSION?</span><h2>{mastered?'Great work — let’s play!':'Turn knowledge into action'}</h2><p>{mastered?'You answered the practice question correctly.': 'You can practise the question again or start the game whenever you feel ready.'} The game provides feedback as you play.</p></div><button className="primary" type="button" onClick={()=>setPlaying(true)}>🎮 Start the game →</button></section>
 <div className="notice"><b>Learning source:</b> <a href={course.source} target="_blank" rel="noopener noreferrer">{course.sourceName} ↗</a>. Educational summaries only, with fictional examples. Check current authoritative publications before formal institutional use.</div>
 </main>;
}
