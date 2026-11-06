import {useEffect,useRef,useState} from 'react';
import {modules,readCourse,readScore} from './progress';
import type {CourseKey} from './progress';

const bursts=Array.from({length:26},(_,i)=>({left:((i*37+11)%100)+'%',delay:(i%9)*-0.18+'s',duration:(2.4+(i%5)*0.37)+'s',color:['#ffcc55','#8cf4cf','#f78cc4','#98b4ff','#ffffff'][i%5]}));
const flag=(game:CourseKey)=>'amlverse-world-champion-v1-'+game;
export function worldComplete(game:CourseKey){
 const course=readCourse(game);
 const module=modules.find(m=>m.id===game);
 return course.lessons.includes(0)&&course.lessons.includes(1)&&course.lessons.includes(2)&&course.checkPassed&&!!module&&readScore(module.scoreKey)>0;
}
export function hasCelebrated(game:CourseKey){try{return localStorage.getItem(flag(game))==='yes'}catch{return false}}
export default function WorldCompletion({game,trigger}:{game:CourseKey;trigger:boolean}){
 const [open,setOpen]=useState(false);
 const [unwrapped,setUnwrapped]=useState(false);
 const closeRef=useRef<HTMLButtonElement>(null);
 const title=modules.find(m=>m.id===game)?.title||'Learning World';
 useEffect(()=>{
  if(!trigger||!worldComplete(game)||hasCelebrated(game))return;
  try{localStorage.setItem(flag(game),'yes')}catch{}
  setUnwrapped(false);
  setOpen(true);
 },[game,trigger]);
 useEffect(()=>{
  if(!open)return;
  const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};
  document.addEventListener('keydown',onKey);
  closeRef.current?.focus();
  return ()=>document.removeEventListener('keydown',onKey);
 },[open]);
 if(!open)return null;
 return <div className="championshade" role="presentation">
  <section className="championmodal" role="dialog" aria-modal="true" aria-labelledby="champion-title" aria-describedby="champion-description">
   <div className="championconfetti" aria-hidden="true">{bursts.map((b,i)=><i key={i} style={{left:b.left,animationDelay:b.delay,animationDuration:b.duration,backgroundColor:b.color}}/>)}</div>
   <button ref={closeRef} className="championclose" type="button" aria-label="Close celebration" onClick={()=>setOpen(false)}>✕</button>
   <span className="championkicker">🎊 WORLD COMPLETE! 🎊</span>
   <h2 id="champion-title">BOOM! You did it! 💥</h2>
   <p id="champion-description">Congratulations! You have mastered the learning journey in <strong>{title}</strong>.</p>
   <div className="championsteps"><span>✓ 3 Lessons</span><span>✓ Quick Check</span><span>✓ Game Finished</span></div>
   {!unwrapped?<><button type="button" className="championgift" onClick={()=>setUnwrapped(true)} aria-label="Open your achievement gift"><span aria-hidden="true">🎁</span><small>Tap to open your gift</small></button><p className="championprompt">A special learning achievement is waiting inside.</p></>
   :<div className="championreward" role="status"><span aria-hidden="true">🏅</span><h3>WORLD CHAMPION</h3><p>{title} achievement unlocked!</p><small>Personal learning milestone — not an official qualification.</small></div>}
   <div className="championactions">{!unwrapped?<button type="button" className="primary" onClick={()=>setUnwrapped(true)}>🎁 Open my gift</button>:<button type="button" className="primary" onClick={()=>setOpen(false)}>Continue my adventure →</button>}<button type="button" className="secondary" onClick={()=>setOpen(false)}>Close</button></div>
  </section>
 </div>;
}
