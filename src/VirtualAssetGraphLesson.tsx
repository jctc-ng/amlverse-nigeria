import {useId,useState} from 'react';
import {lessonGraphs} from './VirtualAssetLessonGraphs';

type GraphNode={id:string;label:string;note:string;x:number;y:number};
type Link={from:string;to:string;label:string;status:'confirmed'|'unverified'};
function layoutNodes(raw:[string,string,string][]):GraphNode[]{
 const n=raw.length;
 const coordinates=n===3?[[85,115],[310,115],[535,115]]:n===4?[[95,145],[290,75],[290,225],[530,145]]:[[70,150],[225,150],[390,55],[390,245],[575,150]];
 return raw.map((a,i)=>({id:a[0],label:a[1],note:a[2],x:coordinates[i][0],y:coordinates[i][1]}))
}
export function TransactionStudyGraph({nodes,links,caption}:{nodes:[string,string,string][];links:Link[];caption:string}){
 const markerId=useId().replace(/:/g,'');
 const graphNodes=layoutNodes(nodes);
 const map=new Map(graphNodes.map(x=>[x.id,x]));
 return <div className="graphstudyfigure">
 <div className="graphstudyhead"><strong>Annotated transaction graph</strong><div className="graphstudylegend"><span><i className="graphedgeconfirmed"/> Recorded observation</span><span><i className="graphedgeunverified"/> Unverified relationship</span></div></div>
 <svg className="graphstudysvg" role="img" aria-label={caption} viewBox="0 0 660 310">
  <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#82e4c7"/></marker></defs>
  {links.map((e,i)=>{const a=map.get(e.from),b=map.get(e.to);if(!a||!b)return null;const dx=b.x-a.x,dy=b.y-a.y,dist=Math.sqrt(dx*dx+dy*dy)||1;const ux=dx/dist,uy=dy/dist;const x1=a.x+ux*45,y1=a.y+uy*36,x2=b.x-ux*46,y2=b.y-uy*37;const mx=(x1+x2)/2,my=(y1+y2)/2;const offset=i%2===0?-11:12;return <g key={i}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={e.status==='confirmed'?'#82e4c7':'#e7bb77'} strokeWidth="3" strokeDasharray={e.status==='confirmed'?undefined:'7 6'} markerEnd={e.status==='confirmed'?('url(#'+markerId+')'):undefined}/><rect x={mx-52} y={my-11+offset} width="104" height="22" rx="8" fill="#11293c" stroke={e.status==='confirmed'?'#447d7b':'#a47f55'}/><text x={mx} y={my+4+offset} fontSize="10" fontWeight="600" fill="#e8f6f3" textAnchor="middle">{e.label.length>19?e.label.slice(0,18)+'…':e.label}</text></g>})}
  {graphNodes.map(n=><g key={n.id}><rect x={n.x-48} y={n.y-32} width="96" height="64" rx="12" fill="#1c4a59" stroke="#83e8d2" strokeWidth="2"/><text x={n.x} y={n.y-3} fill="#ffffff" fontSize="13" fontWeight="750" textAnchor="middle">{n.label.length>12?n.label.slice(0,11)+'…':n.label}</text><text x={n.x} y={n.y+15} fill="#c9e8e6" fontSize="10" textAnchor="middle">{n.note.length>15?n.note.slice(0,14)+'…':n.note}</text></g>)}
 </svg>
 <div className="graphstudyedges"><strong>Evidence ledger</strong>{links.map((e,i)=><div key={i}><b>{e.from} → {e.to}</b><span>{e.label}</span><small className={e.status==='confirmed'?'graphconfirmed':'graphunverified'}>{e.status==='confirmed'?'Recorded':'Unverified'}</small></div>)}</div>
 <p className="graphstudycaption">{caption}. This is a schematic fictional example, not a live blockchain record. Arrows illustrate reported relationships, not necessarily beneficial ownership.</p>
 </div>
}
export default function VirtualAssetGraphLesson({index,passed,onPass,onContinue}:{index:number;passed:boolean;onPass:()=>void;onContinue:()=>void}){
 const d=lessonGraphs[index];
 const [position,setPosition]=useState(0);
 const [answers,setAnswers]=useState<{correct:boolean}[]>([]);
 const [picked,setPicked]=useState<number|null>(null);
 const [checked,setChecked]=useState(false);
 const [finished,setFinished]=useState(false);
 const current=d.questions[position];
 const correct=answers.filter(x=>x.correct).length;
 function next(){
  const answer={correct:picked===current.correct};
  const all=[...answers,answer];setAnswers(all);
  if(position===4){setFinished(true);if(all.filter(x=>x.correct).length>=4)onPass();return}
  setPosition(x=>x+1);setPicked(null);setChecked(false);
  window.scrollTo(0,0);
 }
 function retry(){setPosition(0);setAnswers([]);setPicked(null);setChecked(false);setFinished(false)}
 return <div className="graphstudylesson">
  <section className="graphstudyexplainer"><div className="graphstudyanalogy"><span>💡</span><div><h3>Understand it through an analogy</h3><p>{d.analogy}</p></div></div><div className="graphstudyprofessional"><h3>Professional interpretation</h3><p>{d.professional}</p></div></section>
  <TransactionStudyGraph nodes={d.nodes} links={d.edges.map(e=>({from:e[0],to:e[1],label:e[2],status:e[3]}))} caption={'Lesson '+(index+1)+' transaction relationships'}/>
  <section className="graphstudyquiz"><span className="eyebrow">LESSON KNOWLEDGE CHECK · FIVE GRAPH QUESTIONS</span>
   {finished?<><h3>{correct>=4?'✓ Graph check passed':'Review this graph and try again'}</h3><p>You answered {correct} of 5 questions correctly. Four correct answers (80%) are required for the lesson check.</p><div className="riskadvancedreview">{d.questions.map((q,i)=><div key={i}><strong>{answers[i]?.correct?'✓':'○'} {q.prompt}</strong><p>{q.why}</p></div>)}</div><div className="actions"><button type="button" className="secondary" onClick={retry}>↻ Retry five questions</button>{correct>=4||passed?<button type="button" className="primary" onClick={onContinue}>Continue to next lesson →</button>:null}</div></>
   :<><div className="graphstudyquizhead"><h3>Graph question {position+1} of 5</h3><strong>{position+1}/5</strong></div><div className="riskadvancedprogress"><div style={{width:((position+1)*20)+'%'}}/></div><p className="riskadvancedprompt">{current.prompt}</p><div className="choices">{current.options.map((o,i)=><button key={i} className={'choice'+(picked===i?' picked':'')+(checked&&current.correct===i?' correct':'')} disabled={checked} type="button" onClick={()=>setPicked(i)}><span className="letter">{String.fromCharCode(65+i)}</span>{o}</button>)}</div>
   {checked?<div className="feedback" role="status"><b>{picked===current.correct?'✓ Correct':'Review this evidence'}</b><p>{current.why}</p></div>:null}<div className="actions">{checked?<button type="button" className="primary" onClick={next}>{position===4?'Finish lesson check →':'Continue to next question →'}</button>:<button type="button" className="primary" disabled={picked===null} onClick={()=>setChecked(true)}>Check answer →</button>}</div></>}
  </section>
 </div>;
}
