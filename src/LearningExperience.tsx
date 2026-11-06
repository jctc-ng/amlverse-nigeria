import {useEffect,useState} from 'react';
import GameArcade from './GameArcade';
import EvaluationArena from './EvaluationArena';
import EgmontExchange from './EgmontExchange';
import TypologyDetective from './TypologyDetective';
import NigeriaCompliance from './NigeriaCompliance';
import VirtualAssetLab from './VirtualAssetLab';
import AdvancedTracingLab from './AdvancedTracingLab';
import ReportWritingLab from './ReportWritingLab';
import RiskLabAdvanced from './RiskLabAdvanced';
import {readCourse,saveCourse} from './progress';
import WorldCompletion from './WorldCompletion';

type Game='risk'|'team'|'evaluation'|'egmont'|'typologies'|'nigeria'|'virtualassets'|'advancedtrace'|'reportwriting';
type Topic={title:string;explanation:string;example:string;takeaway:string};
type Course={name:string;subtitle:string;goal:string;topics:Topic[];question:string;answers:{text:string;correct:boolean;why:string}[];sourceName:string;source:string};
const courses:Record<Game,Course>={
 reportwriting:{
 name:'Financial Intelligence Report Writing',subtitle:'FIU Analytical Reporting Learning Room',goal:'Learn to distinguish documented findings, cautious inferences and lawful next steps before drafting a fictional intelligence report.',
 topics:[
 {title:'What belongs in an abstract?',explanation:'An abstract briefly and neutrally states the purpose, the main supported observations and important limitations of an intelligence product. It should not presume criminal guilt.',example:'Records show five credits and one significant debit, while the purpose and beneficial ownership are not established.',takeaway:'Summarise the case and major gaps without introducing unsupported accusations.'},
 {title:'Findings versus inference',explanation:'Findings describe evidence-supported facts, sources and chronology. Inference explains a reasoned interpretation and should identify alternatives, uncertainty and the need for corroboration.',example:'Finding: the statement contains a recorded debit. Inference: unusual payment timing may warrant further review, not a conclusion that the payment is illicit.',takeaway:'Separate observations from interpretation and keep the language proportionate to the evidence.'},
 {title:'Recommendations and safe handling',explanation:'Recommendations identify lawful, proportionate follow-up such as validating records or seeking information under the appropriate authority. Financial intelligence is not itself a judicial determination.',example:'Request additional transaction records through authorised procedures and verify relevant company information, while retaining confidentiality.',takeaway:'Explain information gaps and propose permissible steps to close them.'}],
 question:'Which of these statements is appropriate for an intelligence report based on unverified allegations?',
 answers:[{text:'The allegations remain unverified and require corroboration',correct:true,why:'Correct. An intelligence report should distinguish source allegations from facts supported by independent records.'},{text:'The allegations conclusively prove guilt',correct:false,why:'An allegation, even if serious, does not by itself establish wrongdoing.'},{text:'The subject must be publicly named as a criminal',correct:false,why:'Unverified assertions do not justify a public accusation; confidentiality and applicable law still apply.'}],
 sourceName:'FATF Recommendations — financial intelligence functions',source:'https://www.fatf-gafi.org/en/topics/fatf-recommendations.html'
 },
 advancedtrace:{
 name:'Advanced Cryptocurrency Tracing',subtitle:'Multi-Hop Tracing & Evidence Room',goal:'Learn graph-based tracing, attribution confidence and evidence-based intelligence reporting before investigating a fictional case.',
 topics:[
 {title:'Follow transactions across multiple hops',explanation:'Blockchain investigation often involves reconstructing a sequence of transactions, checking chain, asset, hash, timestamp and direction. Branches or split transactions mean that one observed flow may not represent every related transfer.',example:'An illustrative route connects A → B → C → E while an independent branch connects B → D → F. Each hop must be evidenced rather than assumed.',takeaway:'Trace documented edges and keep uncertain branches separate.'},
 {title:'Distinguish data from attribution',explanation:'A confirmed ledger transfer may be strongly supported, while a third-party exchange label is tentative. Linking a service deposit to a customer normally requires verified evidence, potentially obtained from a provider through appropriate lawful channels.',example:'A wallet labelled as an exchange deposit can justify additional verification, but the label does not prove the real-world identity of a user.',takeaway:'State exactly what the evidence supports, with limitations and confidence.'},
 {title:'Turn a trace into an intelligence note',explanation:'A clear report separates observed transactions, corroborated findings, qualified inference and recommended next steps. Preserve identifiers and methodology, and avoid declaring guilt from transaction patterns alone.',example:'Write ABSTRACT, FINDINGS and INFERENCE, then identify lawful avenues for independent verification of any exchange association.',takeaway:'Explain facts, uncertainty, provenance and authorised follow-up.'}],
 question:'A trace shows A → B → C → E, but another branch leads B → D → F. What is the most defensible finding?',
 answers:[{text:'The recorded path to E is supported; the separate branch requires its own analysis',correct:true,why:'Correct. Each confirmed transfer supports its observed flow, not automatic attribution or an assumption that all branches reach E.'},{text:'All six addresses necessarily belong to one person',correct:false,why:'Graph connectivity is not proof of common control or ownership.'},{text:'The full origin amount must have arrived at E',correct:false,why:'Amounts can split or be affected by other activity; verify value flows before claiming full arrival.'}],
 sourceName:'FATF guidance on Virtual Assets',source:'https://www.fatf-gafi.org/en/topics/virtual-assets.html'
 },
 virtualassets:{
 name:'Virtual Asset Investigation Basics',subtitle:'Blockchain Intelligence Learning Room',goal:'Understand blockchain records, transaction tracing, exchange touchpoints and the limits of wallet attribution.',
 topics:[
 {title:'Wallets, addresses and transaction hashes',explanation:'A blockchain address is a destination or account identifier used by a network. A transaction hash identifies a recorded transaction. Neither is automatically the real-world identity of the person who controlled the funds.',example:'A synthetic transaction TX-A1 records 12 units transferred from WAL-A to WAL-B. The ledger record does not name either human owner.',takeaway:'Keep transaction records distinct from personal identity and account ownership.'},
 {title:'Trace a route and recognise exchange leads',explanation:'Analysts can inspect transactions and record a plausible asset flow. A deposit address associated with a virtual asset service provider may create a lawful avenue to request additional customer data. Network type, timestamps, fees and different transaction models matter.',example:'WAL-B sends 9 units to WAL-C, which has a verified fictional exchange attribution. The customer associated with that deposit still needs corroboration.',takeaway:'Trace the visible flow; verify exchange labels and seek records through authorised processes.'},
 {title:'Red flags, uncertainty and reporting',explanation:'Unusual transaction patterns, privacy services or rapid transfers can warrant more examination, but a red flag alone does not prove criminal activity. Record uncertainty and assess contextual information before escalation.',example:'A mixing-service label is an analytical lead. Further independent evidence is needed before inferring an illicit purpose or individual attribution.',takeaway:'Describe what the data shows, what it does not show, and what additional evidence is needed.'}],
 question:'A blockchain explorer shows a transfer from wallet WAL-A to wallet WAL-B. What can the analyst reliably conclude from this record alone?',
 answers:[{text:'The specified transaction was recorded between the addresses on that network',correct:true,why:'Correct. The ledger record establishes the observed transfer; independent evidence is needed to attribute control or identity.'},{text:'The person controlling WAL-B is conclusively guilty of laundering',correct:false,why:'Blockchain transfers do not automatically establish an offence or identify an owner.'},{text:'Both addresses necessarily belong to the same person',correct:false,why:'Address clustering requires additional evidence and methodological caution, especially across hosted services.'}],
 sourceName:'FATF — Virtual Assets and Red Flag Indicators',source:'https://www.fatf-gafi.org/en/topics/virtual-assets.html'
 },
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
 nigeria:{
 name:'Nigeria AML/CFT/CPF Compliance',subtitle:'Nigeria Compliance Learning Room',goal:'Learn how reporting businesses, the NFIU and sector supervisors cooperate under Nigeria’s AML/CFT/CPF framework.',
 topics:[
 {title:'Core Nigerian laws and mandates',explanation:'The NFIU Act 2018 and the Money Laundering (Prevention and Prohibition) Act 2022 are among the important legal instruments in Nigeria. The Terrorism (Prevention and Prohibition) Act 2022 also forms part of the CFT framework.',example:'A compliance officer checks the applicable law and current sector-specific regulations before deciding what the institution must do.',takeaway:'Identify the legal obligation and the institution responsible.'},
 {title:'Reporting and financial intelligence',explanation:'Reporting entities carry out due diligence, review suspicious activity and submit suspicious transaction reports to the NFIU where applicable. The NFIU receives, analyses and disseminates intelligence through lawful channels.',example:'A reporting institution reviews unusual payments, forms suspicion based on relevant facts, and makes the required confidential report.',takeaway:'A suspicious report is not an allegation of proven guilt.'},
 {title:'Supervision and internal controls',explanation:'Competent supervisors oversee institutions within their remit. This includes the CBN for relevant financial institutions and SCUML for designated non-financial businesses and professions, subject to applicable law.',example:'A bank verifies beneficial owners and monitors transactions; the competent supervisor can examine whether its controls comply with applicable obligations.',takeaway:'Understand the difference between internal checks, supervision and FIU analysis.'}],
 question:'A reporting institution has established suspicion after examining unusual transactions. Which action best reflects its reporting responsibility?',
 answers:[{text:'Make the required confidential suspicious transaction report to the NFIU',correct:true,why:'Correct. Nigeria’s STR requirements provide for reporting suspicion to the NFIU in accordance with applicable law and guidance.'},{text:'Publish the customer’s identity to warn the public',correct:false,why:'Public disclosure can breach confidentiality and does not substitute for an STR.'},{text:'Wait until a court has convicted the customer',correct:false,why:'Suspicious transaction reporting concerns suspicion; a prior conviction is not a prerequisite.'}],
 sourceName:'NFIU Laws and Regulations / STR reporting guidance',source:'https://www.nfiu.gov.ng/LawsAndRegulations'
 },
 typologies:{
 name:'Follow the Money — Typology Basics',subtitle:'Typology Detective Learning Room',goal:'Learn how to spot patterns, check context and avoid treating indicators as proof of crime.',
 topics:[
 {title:'What is a financial crime typology?',explanation:'A typology describes a recurring method or pattern associated with financial crime. Typologies help analysts recognise behaviours worth examining.',example:'An account receives transfers from many unrelated senders and quickly forwards the money.',takeaway:'A pattern can be a warning sign, not a final conclusion.'},
 {title:'Look beyond the red flag',explanation:'An indicator is a reason to look closer. Analysts compare activity with customer information, legitimate explanations and corroborating evidence.',example:'A verified fundraising campaign may explain some deposits, but other unusual activity could remain unexplained.',takeaway:'Test alternative explanations and check the records.'},
 {title:'Document findings and act lawfully',explanation:'When concerns persist, analysts document their reasoning, preserve evidence and follow applicable internal escalation or reporting procedures.',example:'An analyst records what is known, what remains uncertain and what additional information is needed.',takeaway:'Evidence, uncertainty and lawful process matter.'}],
 question:'Several unrelated people send funds into one account, followed by rapid outward transfers. What can be concluded?',
 answers:[{text:'The pattern warrants further contextual analysis',correct:true,why:'Correct. This may indicate mule activity, but additional evidence is needed before drawing conclusions.'},{text:'The customer is conclusively guilty of money laundering',correct:false,why:'A pattern alone does not establish guilt.'},{text:'Nothing can be reviewed unless a court has already convicted someone',correct:false,why:'Risk monitoring and financial intelligence analysis can assess unusual activity before any conviction.'}],
 sourceName:'FATF publications and typologies guidance',source:'https://www.fatf-gafi.org/en/publications.html'
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
type Stage='learn'|'check'|'play';
const demonstrations:Record<Game,{card:string;destination:string;explanation:string}>={
 risk:{card:'Unknown company owners',destination:'🔓 Weakness',explanation:'Unverified owners create a weakness criminals could exploit.'},
 team:{card:'Analyse suspicious transfers',destination:'📊 FIU Analyst',explanation:'Financial intelligence analysis is an FIU function.'},
 evaluation:{card:'AML/CFT legislation',destination:'📜 Technical compliance',explanation:'Legislation helps establish formal compliance; results demonstrate effectiveness.'},
 egmont:{card:'Unsecured personal email',destination:'⛔ Stop & protect',explanation:'Sensitive FIU information belongs on approved secure channels.'},
 typologies:{card:'Many unrelated senders',destination:'🚩 Red flag',explanation:'A suspicious pattern is worth investigating but does not prove a crime.'},
 nigeria:{card:'Inspect a bank’s AML programme',destination:'🏛️ Sector supervision',explanation:'Competent supervisors oversee compliance in the regulated sectors within their mandates.'},
 virtualassets:{card:'Synthetic transaction TX-A1',destination:'🔗 On-chain record',explanation:'A hash identifies a transaction record, not a person or proof of criminality.'},
 advancedtrace:{card:'SIM-TX-001: A → B',destination:'🔗 First traced hop',explanation:'Document the first transfer before exploring downstream flows.'},
 reportwriting:{card:'Five recorded credit transfers',destination:'📑 Documented finding',explanation:'Transaction records support observations; uncertainty and allegations belong in a separate category.'}
};
export default function LearningExperience({game,onBack}:{game:Game;onBack:()=>void}){
 const [stage,setStage]=useState<Stage>('learn');
 const [playing,setPlaying]=useState(false);
 const [advancedOpen,setAdvancedOpen]=useState(false);
 const [topic,setTopic]=useState(0);
 const [answer,setAnswer]=useState<number|null>(null);
 const [showFeedback,setShowFeedback]=useState(false);
 const [confirmedPass,setConfirmedPass]=useState(()=>readCourse(game).checkPassed);
 const [tutorialStep,setTutorialStep]=useState(0);
 const [demoSelected,setDemoSelected]=useState(false);
 const [demoMatched,setDemoMatched]=useState(false);
 useEffect(()=>{saveCourse(game,old=>({...old,lessons:Array.from(new Set([...old.lessons,0]))}))},[game]);
 useEffect(()=>{if(stage==='learn')saveCourse(game,old=>({...old,lessons:Array.from(new Set([...old.lessons,topic]))}))},[game,stage,topic]);
 const course=courses[game];
 const item=course.topics[topic];
 const demo=demonstrations[game];
 const mastered=confirmedPass||(showFeedback&&answer!==null&&course.answers[answer].correct);
 function submitCheck(){
  if(answer===null)return;
  const isCorrect=course.answers[answer].correct;
  saveCourse(game,old=>({...old,checkAttempts:old.checkAttempts+1,checkPassed:old.checkPassed||isCorrect}));
  if(isCorrect)setConfirmedPass(true);
  setShowFeedback(true);
 }
 function navigate(next:Stage){
  setStage(next);
  if(next==='play'){setTutorialStep(0);setDemoSelected(false);setDemoMatched(false)}
  window.scrollTo(0,0);
 }
 function launch(){
  try{localStorage.setItem('amlverse-guide-v1-'+game,'yes')}catch{}
  setPlaying(true);
  window.scrollTo(0,0);
 }
 if(game==='risk'&&advancedOpen)return <RiskLabAdvanced onBack={()=>setAdvancedOpen(false)} onClassic={()=>{setAdvancedOpen(false);navigate('play')}}/>;
 if(playing){
  if(game==='risk'||game==='team')return <GameArcade key={game} mode={game} onBack={()=>setPlaying(false)}/>;
  if(game==='evaluation')return <EvaluationArena onBack={()=>setPlaying(false)}/>;
  if(game==='typologies')return <TypologyDetective onBack={()=>setPlaying(false)}/>;
  if(game==='nigeria')return <NigeriaCompliance onBack={()=>setPlaying(false)}/>;
  if(game==='virtualassets')return <VirtualAssetLab onBack={()=>setPlaying(false)}/>;
  if(game==='advancedtrace')return <AdvancedTracingLab onBack={()=>setPlaying(false)}/>;
  if(game==='reportwriting')return <ReportWritingLab onBack={()=>setPlaying(false)}/>;
  return <EgmontExchange onBack={()=>setPlaying(false)}/>;
 }
 return <main className="narrow knowledgepath">
 <button className="back" onClick={onBack}>← Academy overview</button>
 <span className="eyebrow">AMLVERSE • LEARN • QUICK CHECK • PLAY</span>
 <h1 className="title">{course.name}</h1><p className="lead">{course.goal}</p>
 <WorldCompletion game={game} trigger={true}/>
 {game==='risk'?<section className="riskadvancedpromo"><div><span className="eyebrow">NEW • RISKLAB EXPANDED CURRICULUM</span><h2>RiskLab Academy 2.0</h2><p>12 lessons · 60 varied questions · 3 case simulations · Foundation to Advanced. Classic RiskLab progress remains unchanged.</p></div><button type="button" className="primary" onClick={()=>setAdvancedOpen(true)}>Enter expanded RiskLab →</button></section>:null}
 <nav className="knowledgeflow" aria-label="Learning stages">
  <button type="button" className={stage==='learn'?'active':''} aria-current={stage==='learn'?'step':undefined} onClick={()=>navigate('learn')}>① Learn</button>
  <button type="button" className={stage==='check'?'active':''} aria-current={stage==='check'?'step':undefined} onClick={()=>navigate('check')}>② Quick check</button>
  <button type="button" className={stage==='play'?'active':''} aria-current={stage==='play'?'step':undefined} onClick={()=>navigate('play')}>③ Play</button>
 </nav>
 {stage==='learn'?<>
  <div className="knowledgeintro"><span className="knowledgeemoji" aria-hidden="true">📚</span><div><small>LEARNING ROOM</small><h2>{course.subtitle}</h2><p>Read three short lessons and see examples before trying a game.</p></div></div>
  <div className="knowledgetabs" role="group" aria-label="Learning topics">{course.topics.map((t,i)=><button key={i} className={topic===i?'on':''} onClick={()=>setTopic(i)} type="button"><span>Lesson {i+1}</span><b>{t.title}</b></button>)}</div>
  <section className="knowledgecard"><small>LESSON {topic+1} OF {course.topics.length}</small><h2>{item.title}</h2><p>{item.explanation}</p><div className="knowledgeexample"><b>Example</b><p>{item.example}</p></div><div className="knowledgetakeaway"><b>Remember:</b> {item.takeaway}</div><div className="actions">{topic>0?<button className="secondary" type="button" onClick={()=>setTopic(i=>i-1)}>← Previous</button>:null}{topic<course.topics.length-1?<button className="primary" type="button" onClick={()=>setTopic(i=>i+1)}>Next lesson →</button>:<button className="primary" type="button" onClick={()=>navigate('check')}>Go to quick check →</button>}</div></section>
 </>:stage==='check'?<>
  <section className="knowledgecheck"><span className="eyebrow">STEP 2 • QUICK UNDERSTANDING CHECK</span><h2>{course.question}</h2>
  <p className="checkstatus" role="status">{confirmedPass?'✓ Quick Check passed and saved in this browser':'Quick Check not yet recorded as passed. Choose an answer and press Check understanding to save a correct result.'}</p><div className="knowledgeanswers">{course.answers.map((a,i)=><button key={i} type="button" className={answer===i?'selected':''} onClick={()=>{setAnswer(i);setShowFeedback(false)}}><span>{String.fromCharCode(65+i)}</span>{a.text}</button>)}</div>
  {showFeedback&&answer!==null?<div className="arcadefeedback" role="status">{course.answers[answer].why} {course.answers[answer].correct?'✓ Pass recorded — your dashboard will show Quick Check: Passed.':'Try again whenever you are ready. Your previous passes are preserved.'}</div>:null}
  <div className="actions"><button type="button" className="primary" disabled={answer===null} onClick={submitCheck}>Check understanding →</button><button className="secondary" type="button" onClick={()=>navigate('learn')}>← Review lessons</button></div></section>
  <section className="knowledgeplay"><div><span className="eyebrow">NEXT UP</span><h2>{mastered?'Excellent — ready to play!':'Try the mini tutorial'}</h2><p>{mastered?'You got the practice answer right.':'The check is for practice, not a compulsory exam.'} Learn the card controls in a short hands-on demonstration before your mission.</p></div><button className="primary" type="button" onClick={()=>navigate('play')}>Continue to tutorial →</button></section>
 </>:<>
  <section className="knowledgecard minitutorial"><span className="eyebrow">STEP 3 • HOW TO PLAY</span><h2>Practice a move before your mission</h2><p>Try a sample card. This tutorial does not affect your score.</p>
  <div className="ministeps"><span className={tutorialStep===0?'on':''}>1. Select</span><span className={tutorialStep===1?'on':''}>2. Match</span><span className={tutorialStep===2?'on':''}>3. Start</span></div>
  {tutorialStep===0?<div className="miniarea">
   <p><b>Tap the clue card</b> below to select it.</p>
   <button type="button" className={'arcadecard miniclue'+(demoSelected?' selected':'')} onClick={()=>setDemoSelected(v=>!v)}><strong>{demo.card}</strong><small>{demoSelected?'✓ SELECTED':'TAP TO SELECT'}</small></button>
   <div className="actions"><button className="primary" disabled={!demoSelected} onClick={()=>setTutorialStep(1)}>Next: place the card →</button></div>
  </div>:tutorialStep===1?<div className="miniarea">
   <p><b>Tap the matching box</b> to drop your selected card. On desktop you can also drag game cards.</p>
   <button type="button" className={'minidrop'+(demoMatched?' matched':'')} onClick={()=>setDemoMatched(true)}>{demo.destination}</button>
   {demoMatched?<div className="arcadefeedback" role="status">✓ Correct! {demo.explanation}</div>:null}
   <div className="actions"><button className="secondary" onClick={()=>setTutorialStep(0)}>← Back</button><button className="primary" disabled={!demoMatched} onClick={()=>setTutorialStep(2)}>Next: launch mission →</button></div>
  </div>:<div className="miniarea miniready"><span aria-hidden="true">🏆</span><h2>You know how to play!</h2><p>Select a clue, place it in a category, read the feedback, and continue to the final challenge.</p><div className="actions"><button className="secondary" onClick={()=>{setTutorialStep(0);setDemoSelected(false);setDemoMatched(false)}}>↻ Replay tutorial</button><button className="primary" onClick={launch}>🎮 Start the game →</button></div></div>}
  <div className="actions"><button className="secondary" onClick={()=>navigate('check')}>← Back to quick check</button><button className="secondary" onClick={launch}>Skip tutorial and play →</button></div>
  </section>
 </>}
 <div className="notice"><b>Learning source:</b> <a href={course.source} target="_blank" rel="noopener noreferrer">{course.sourceName} ↗</a>. Educational summaries only, with fictional examples. Check current authoritative publications before formal institutional use.</div>
 </main>;
}
