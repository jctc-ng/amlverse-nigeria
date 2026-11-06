import {useEffect,useState} from 'react';

type Game='risk'|'team'|'evaluation'|'egmont';
type Guide={name:string;example:string;target:string;reason:string};
const guides:Record<Game,Guide>={
 risk:{name:'RiskLab Arcade',example:'Unknown company owners',target:'🔓 Weakness',reason:'Unverified ownership makes financial crime harder to detect.'},
 team:{name:'Teamwork Arcade',example:'Analyse suspicious transfers',target:'📊 FIU Analyst',reason:'Analysing suspicious transaction information is a core FIU task.'},
 evaluation:{name:'Mutual Evaluation Arena',example:'Approved AML/CFT law',target:'📜 Technical compliance',reason:'A law shows that a requirement exists; actual results show effectiveness.'},
 egmont:{name:'Egmont Exchange',example:'Private email forwarding',target:'⛔ Stop & protect',reason:'FIU information must be handled through approved secure channels.'}
};
function seen(id:Game){try{return localStorage.getItem('amlverse-guide-v1-'+id)==='yes'}catch{return false}}
export default function TutorialGuide({game}:{game:Game}){
 const [open,setOpen]=useState(()=>!seen(game));
 const [step,setStep]=useState(0);
 const g=guides[game];
 useEffect(()=>{
  if(!open)return;
  const esc=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};
  document.addEventListener('keydown',esc);
  return ()=>document.removeEventListener('keydown',esc);
 },[open]);
 function close(){try{localStorage.setItem('amlverse-guide-v1-'+game,'yes')}catch{}setOpen(false);setStep(0)}
 return <>
 <button type="button" className="guidehelp" onClick={()=>{setStep(0);setOpen(true)}} aria-label={'How to play '+g.name}>❔ How to play</button>
 {open?<div className="guideshade" role="presentation">
  <section className="guidepanel" role="dialog" aria-modal="true" aria-label={'How to play '+g.name}>
   <div className="guidehead"><span>🎮 QUICK TUTORIAL</span><button type="button" className="guideclose" onClick={close} aria-label="Skip tutorial">✕</button></div>
   <div className="guidedots" aria-label={'Tutorial step '+(step+1)+' of 3'}>{[0,1,2].map(n=><span key={n} className={n===step?'on':''}/>)}</div>
   {step===0?<><div className="guidestage"><div className="guidebig">🎴</div><div className="guidecard preview"><strong>{g.example}</strong><small>YOUR CLUE CARD</small></div></div><h2>Step 1 — Pick a clue</h2><p>Tap any clue card to select it. On a computer, you can also hold and drag the card.</p></>
   :step===1?<><div className="guidestage"><div className="guidemoving" aria-hidden="true"><div className="guidecard"><strong>{g.example}</strong><small>SELECTED ✓</small></div><span className="guidearrow">➜</span><div className="guidetarget">{g.target}</div></div></div><h2>Step 2 — Put it in a box</h2><p>Tap the category that best matches your clue. On desktop, you can drag the card directly into the box.</p></>
   :<><div className="guidestage"><div className="guidebig">🌟</div><div className="guidesuccess">✓ CORRECT MATCH!</div></div><h2>Step 3 — Learn and win</h2><p>{g.reason} Get an instant explanation after every move, then unlock the final challenge.</p></>}
   <div className="guideactions"><button type="button" className="secondary" onClick={close}>Skip tutorial</button><div>{step>0?<button type="button" className="secondary" onClick={()=>setStep(s=>s-1)}>Back</button>:null}<button type="button" className="primary" onClick={()=>step===2?close():setStep(s=>s+1)}>{step===2?'Play the game →':'Next →'}</button></div></div>
  </section>
 </div>:null}
 </>;
}
