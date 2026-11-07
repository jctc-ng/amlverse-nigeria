export function CompletionMeter({done,total,caption,compact=false}:{done:number;total:number;caption?:string;compact?:boolean}){
 const pct=total>0?Math.min(100,Math.max(0,Math.round(100*done/total))):0;
 return <div className={'worldmetermini'+(compact?' compact':'')} aria-label={`${caption||'Progress'}: ${done} of ${total}, ${pct}% complete`}>
  <div className="worldmeterline"><span>{caption||'Completion progress'}</span><strong>{done}/{total} · {pct}%</strong></div>
  <div className="worldmetertrack" role="progressbar" aria-label={caption||'Completion progress'} aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}><div style={{width:pct+'%'}}/></div>
 </div>;
}
