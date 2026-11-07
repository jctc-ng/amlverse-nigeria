import {useState} from 'react';
import {modules,readCourse,readScore} from './progress';
import type {CourseKey} from './progress';

export type MenuScreen='home'|'progress'|'chapter'|'risklab'|'team'|'evaluation'|'egmont'|'typologies'|'nigeria'|'virtualassets'|'advancedtrace'|'reportwriting'|'capstone'|'resources'|'mission'|'about'|'impact';
type MenuEntry={id:MenuScreen;title:string;symbol:string;course?:CourseKey};
type MenuGroup={id:string;title:string;short:string;entries:MenuEntry[]};
const groups:MenuGroup[]=[
{id:'foundation',title:'Foundations & Standards',short:'Foundation',entries:[
{id:'risklab',title:'RiskLab Arcade',symbol:'◈',course:'risk'},
{id:'team',title:'Teamwork Arcade',symbol:'♧',course:'team'},
{id:'evaluation',title:'Mutual Evaluation',symbol:'🏆',course:'evaluation'}]},
{id:'intelligence',title:'Financial Intelligence',short:'Intelligence',entries:[
{id:'egmont',title:'Egmont Exchange',symbol:'🌍',course:'egmont'},
{id:'typologies',title:'Typology Detective',symbol:'🔎',course:'typologies'},
{id:'nigeria',title:'Nigeria Compliance',symbol:'🇳🇬',course:'nigeria'}]},
{id:'virtual',title:'Virtual Assets & Blockchain',short:'Virtual Assets',entries:[
{id:'virtualassets',title:'Virtual Asset Academy',symbol:'🔗',course:'virtualassets'},
{id:'advancedtrace',title:'Advanced Tracing Simulator',symbol:'🕸️',course:'advancedtrace'}]},
{id:'report',title:'Reporting & Assessment',short:'Reporting',entries:[
{id:'reportwriting',title:'Intelligence Reporting Lab',symbol:'📝',course:'reportwriting'},
{id:'capstone',title:'Capstone Challenge',symbol:'🏅'}]}
];
const shortcuts:MenuEntry[]=[
{id:'home',title:'Academy Overview',symbol:'◫'},
{id:'progress',title:'My Progress',symbol:'📈'},
{id:'chapter',title:'FATF Quest R.1–R.40',symbol:'★'},
{id:'resources',title:'Resource Library',symbol:'▤'},
{id:'about',title:'Project & Research',symbol:'◎'},
{id:'impact',title:'Competency & Impact Lab',symbol:'◉'}
];
export default function AcademyNavigation({screen,onNavigate}:{screen:MenuScreen;onNavigate:(screen:MenuScreen)=>void}){
 const [expanded,setExpanded]=useState<string[]>(()=>groups.map(g=>g.id));
 const [mobileOpen,setMobileOpen]=useState(false);
 const [search,setSearch]=useState('');
 const query=search.trim().toLowerCase();
 function go(id:MenuScreen){onNavigate(id);setMobileOpen(false);setSearch('')}
 function flip(id:string){setExpanded(g=>g.includes(id)?g.filter(x=>x!==id):[...g,id])}
 function item(entry:MenuEntry){
  const active=screen===entry.id;
  const course=entry.course?modules.find(m=>m.id===entry.course):undefined;
  const p=entry.course?readCourse(entry.course):undefined;
  const steps=p?(p.lessons.length+(p.checkPassed?1:0)+(course&&readScore(course.scoreKey)>0?1:0)):0;
  return <button key={entry.id} type="button" className={'anavitem'+(active?' active':'')} aria-current={active?'page':undefined} onClick={()=>go(entry.id)}><span className="anavicon" aria-hidden="true">{entry.symbol}</span><span className="anavname">{entry.title}</span>{p&&steps===5?<span className="anavdone" aria-label="World complete">✓</span>:null}</button>;
 }
 const visibleGroups=groups.map(g=>({...g,entries:g.entries.filter(e=>e.title.toLowerCase().includes(query)||g.title.toLowerCase().includes(query))})).filter(g=>g.entries.length>0);
 const visibleShortcuts=shortcuts.filter(e=>e.title.toLowerCase().includes(query));
 return <>
 <button className={'anavmobiletoggle'+(mobileOpen?' open':'')} type="button" aria-expanded={mobileOpen} aria-controls="amlverse-primary-navigation" onClick={()=>setMobileOpen(v=>!v)}><span aria-hidden="true">{mobileOpen?'✕':'☰'}</span><span>{mobileOpen?'Close menu':'Explore academy'}</span><span aria-hidden="true">⌄</span></button>
 <aside id="amlverse-primary-navigation" className={'sidebar academynavigation'+(mobileOpen?' mobile-open':'')}>
  <div className="brand"><div className="brandmark">✦</div><div><b>AML<span>VERSE</span></b><small>NIGERIA • LEARNING LAB</small></div></div>
  <div className="anavscroll">
   <label className="anavsearchlabel" htmlFor="academy-nav-search">Find a learning world</label><input id="academy-nav-search" type="search" className="anavsearch" placeholder="Search modules…" value={search} onChange={e=>setSearch(e.target.value)}/>
   {visibleShortcuts.length>0?<nav className="anavgroup" aria-label="Academy shortcuts"><div className="anavgrouplabel">WORKSPACE</div>{visibleShortcuts.map(item)}</nav>:null}
   <div className="anavdivider"/>
   {visibleGroups.map(g=><div key={g.id} className="anavgroup">
    <button type="button" className="anavgroupbutton" aria-expanded={query?true:expanded.includes(g.id)} onClick={()=>flip(g.id)}><span>{g.title}</span><span aria-hidden="true">{query||expanded.includes(g.id)?'⌄':'›'}</span></button>
    {(query||expanded.includes(g.id))?<nav aria-label={g.title}>{g.entries.map(item)}</nav>:null}
   </div>)}
   {visibleGroups.length===0&&visibleShortcuts.length===0?<p className="anavempty">No modules match your search.</p>:null}
  </div>
  <div className="sidenote">🔒 Fictional training cases only</div>
 </aside>
 </>;
}
