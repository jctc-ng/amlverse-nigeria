import {useEffect,useState} from 'react';

type Game='risk'|'team'|'evaluation'|'egmont'|'typologies'|'nigeria'|'virtualassets'|'advancedtrace'|'reportwriting';
type Guide={name:string;example:string;target:string;reason:string};
const guides:Record<Game,Guide>={
 risk:{name:'RiskLab Arcade',example:'Unknown company owners',target:'🔓 Weakness',reason:'Unverified ownership makes financial crime harder to detect.'},
 team:{name:'Teamwork Arcade',example:'Analyse suspicious transfers',target:'📊 FIU Analyst',reason:'Analysing suspicious transaction information is a core FIU task.'},
 evaluation:{name:'Mutual Evaluation Arena',example:'Approved AML/CFT law',target:'📜 Technical compliance',reason:'A law shows that a requirement exists; actual results show effectiveness.'},
 egmont:{name:'Egmont Exchange',example:'Private email forwarding',target:'⛔ Stop & protect',reason:'FIU information must be handled through approved secure channels.'},
 typologies:{name:'Typology Detective',example:'Many unrelated senders',target:'🚩 Red flag',reason:'Unusual patterns invite further analysis but do not establish wrongdoing.'},
 nigeria:{name:'Nigeria Compliance Challenge',example:'Review a bank’s AML programme',target:'🏛️ Sector supervision',reason:'The competent financial supervisor examines a bank’s regulatory compliance controls.'},
 virtualassets:{name:'Virtual Asset Investigation Academy',example:'Synthetic transaction hash TX-A1',target:'🔗 On-chain record',reason:'A transaction identifier supports tracing ledger movements, but does not itself identify a person.'},
 advancedtrace:{name:'Advanced Crypto Tracing',example:'SIM-TX-001: A → B',target:'🔗 First traced hop',reason:'Follow confirmed transactions in order and distinguish observed flows from personal attribution.'},
 reportwriting:{name:'Financial Intelligence Reporting',example:'Five recorded credit transfers',target:'📑 Documented finding',reason:'Verified transaction records can support factual findings; allegations need independent corroboration.'}
};
function seen(id:Game){try{return localStorage.getItem('amlverse-guide-v1-'+id)==='yes'}catch{return false}}
export default function TutorialGuide({game}:{game:Game}){
 const [open,setOpen]=useState(()=>!seen(game));
 const [step,setStep]=useState(0);
 const [selected,setSelected]=useState(false);
 const [matched,setMatched]=useState(false);
 const [feedback,setFeedback]=useState('');
 const g=guides[game];
 function resetPractice(){setStep(0);setSelected(false);setMatched(false);setFeedback('')}
 function close(){try{localStorage.setItem('amlverse-guide-v1-'+game,'yes')}catch{}setOpen(false);resetPractice()}
 useEffect(()=>{
  if(!open)return;
  const esc=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};
  document.addEventListener('keydown',esc);
  return ()=>document.removeEventListener('keydown',esc);
 },[open,game]);
 function advance(){
  if(step===0&&selected){setStep(1);setFeedback('')}
  else if(step===1&&matched){setStep(2);setFeedback('')}
  else if(step===2)close();
 }
 function chooseTarget(target:string){
  if(target===g.target){setMatched(true);setFeedback('Correct match. '+g.reason)}
  else{setMatched(false);setFeedback('Try again. The right category is the one that matches the evidence, not an unsupported assumption.')}
 }
 return <>
 <button type="button" className="guidehelp" onClick={()=>{resetPractice();setOpen(true)}} aria-label={'How to play '+g.name}>❔ How to play</button>
 {open?<div className="guideshade" role="presentation">
  <section className="guidepanel" role="dialog" aria-modal="true" aria-label={'How to play '+g.name}>
   <div className="guidehead"><span>🎮 INTERACTIVE QUICK TUTORIAL</span><button type="button" className="guideclose" onClick={close} aria-label="Skip tutorial">✕</button></div>
   <div className="guidedots" aria-label={'Tutorial step '+(step+1)+' of 3'}>{[0,1,2].map(n=><span key={n} className={n===step?'on':''}/>)}</div>
   {step===0?<><div className="guidestage"><div className="guidebig" aria-hidden="true">🎴</div><button type="button" className={'guidecard guidepracticecard'+(selected?' is-selected':'')} onClick={()=>setSelected(true)} aria-pressed={selected}><strong>{g.example}</strong><small>{selected?'✓ SELECTED — READY TO MATCH':'TAP TO SELECT THIS CLUE'}</small></button></div><h2>Step 1 — Pick a clue</h2><p>Tap the sample evidence card. Its selection state changes, exactly as it will during your real mission.</p></>
   :step===1?<><div className="guidestage"><div className="guidemoving"><div className="guidecard"><strong>{g.example}</strong><small>SELECTED ✓</small></div><span className="guidearrow" aria-hidden="true">➜</span><div className="guidetarget">{g.target}</div></div></div><h2>Step 2 — Match the evidence</h2><p>Choose the most appropriate category for your clue. A wrong answer is safe to retry.</p><div className="guidematchoptions" role="group" aria-label="Practice evidence classification">{[g.target,'Ignore this evidence','Assume an identity without proof'].map(value=><button key={value} type="button" className={matched&&value===g.target?'correct':''} onClick={()=>chooseTarget(value)} aria-pressed={matched&&value===g.target}>{value}</button>)}</div></>
   :<><div className="guidestage"><div className="guidebig" aria-hidden="true">🌟</div><div className="guidesuccess">✓ PRACTICE COMPLETED!</div></div><h2>Step 3 — Ready for the mission</h2><p>{g.reason} In the real game, each selection provides feedback. These tutorial steps do not change your score or progress.</p></>}
   {feedback&&step===1?<p className={'guidefeedback'+(matched?' correct':'')} role="status">{feedback}</p>:null}
   <div className="guideactions"><button type="button" className="secondary" onClick={close}>Skip tutorial</button><div>{step>0?<button type="button" className="secondary" onClick={()=>{setStep(s=>s-1);setFeedback('')}}>Back</button>:null}<button type="button" className="primary" disabled={step===0?!selected:step===1?!matched:false} onClick={advance}>{step===2?'Play the game →':step===0?'Next: match the clue →':'Next: finish practice →'}</button></div></div>
  </section>
 </div>:null}
 </>;
}
