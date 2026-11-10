import {useEffect,useState} from 'react';

type SimTool='search'|'registry'|'hunter'|'username'|'phone'|'social'|'domain'|'archive'|'image'|'regex'|'hash'|'custody';
const tools:{id:SimTool;name:string;url:string;description:string}[]=[
 {id:'search',name:'Web Search',url:'search.training.osint.lab',description:'Indexed synthetic records and exact-phrase searches'},
 {id:'registry',name:'Company Registry',url:'registry.training.osint.lab',description:'Fictional records modelled on UK Companies House and Nigerian CAC'},
 {id:'hunter',name:'Email Discovery',url:'email.training.osint.lab',description:'Synthetic domain email records, similar to Hunter’s domain-search workflow'},
 {id:'username',name:'Username Lookup',url:'handles.training.osint.lab',description:'Compare synthetic public handles across services'},
 {id:'phone',name:'Phone Parser',url:'phone.training.osint.lab',description:'Normalise fictional numbers without accessing subscriber data'},
 {id:'social',name:'Social Research',url:'social.training.osint.lab',description:'Inspect source dependence in fictional public posts'},
 {id:'domain',name:'RDAP / DNS',url:'rdap.training.osint.lab',description:'Read safe example domain and IP records'},
 {id:'archive',name:'Web Archive',url:'archive.training.osint.lab',description:'Compare simulated historical website snapshots'},
 {id:'image',name:'Image Verification',url:'image.training.osint.lab',description:'Inspect synthetic image metadata and visual-search leads'},
 {id:'regex',name:'Regex Tester',url:'regex.training.osint.lab',description:'Test JavaScript-compatible expressions on fake identifiers'},
 {id:'hash',name:'SHA-256 Workbench',url:'hash.training.osint.lab',description:'Compute and compare digest of training text'},
 {id:'custody',name:'Evidence Locker',url:'vault.training.osint.lab',description:'Create synthetic exhibit notes with provenance'}
];
const samples=[
 {id:'company',title:'Meridian Aid Logistics Limited — company website',address:'meridian-aid.example',kind:'Self-published website',body:'The company claims director Amina Bello and fictional registration number RC 802116.'},
 {id:'registry',title:'Meridian Aid Logistics — registered company extract',address:'registry.training.osint.lab/RC802116',kind:'Simulated registry',body:'RC 802116 · Registered 2023 · Listed director Amina Bello · Beneficial ownership unverified.'},
 {id:'social',title:'@meridianaid public business account',address:'social.training.osint.lab/meridianaid',kind:'Simulated social post',body:'Business account announces a logistics hub launch and names Amina Bello.'},
 {id:'news',title:'Daily Ledger — logistics hub article',address:'dailyledger.training.osint.lab/meridian',kind:'Fictional article',body:'Journalist repeats an event programme supplied by the company. Not independent corroboration.'},
 {id:'domain',title:'Domain data meridian-aid.example',address:'rdap.training.osint.lab/meridian-aid.example',kind:'Synthetic domain record',body:'Privacy-protected registrant; A record 192.0.2.24; MX mail.meridian-aid.example.'}
];
const defaultTool:Record<string,SimTool>={
 intro:'registry',browser:'search',boolean:'search',regex:'regex',username:'username',email:'hunter',phone:'phone',
 social:'social',image:'image',domain:'domain',hash:'hash',custody:'custody'
};
type Note={tool:string;finding:string;time:string};
const filename='AMLVERSE_OSINT_SIM_BrowserNotes';
export default function OsintVirtualBrowser({lessonId,launchTool}:{lessonId?:string;launchTool?:string}){
 const [tool,setTool]=useState<SimTool>('search');
 const [tabs,setTabs]=useState<SimTool[]>(['search']);
 const [query,setQuery]=useState('');
 const [submitted,setSubmitted]=useState('');
 const [choice,setChoice]=useState('');
 const [message,setMessage]=useState('');
 const [notes,setNotes]=useState<Note[]>([]);
 const [compare,setCompare]=useState('');
 const [hash,setHash]=useState('');
 const [hashBefore,setHashBefore]=useState('');
 const [regex,setRegex]=useState('RC[ -]?\\d{6}\\b');
 const [result,setResult]=useState('');
 const [history,setHistory]=useState<SimTool[]>(['search']);
 useEffect(()=>{const selected=tools.some(t=>t.id===launchTool)?launchTool as SimTool:defaultTool[lessonId||'']||'search';setTool(selected);setTabs(prev=>prev.includes(selected)?prev:[...prev,selected]);setMessage('')},[lessonId,launchTool]);
 const info=tools.find(t=>t.id===tool)||tools[0];
 function open(id:SimTool){setTool(id);setTabs(old=>old.includes(id)?old:[...old,id]);setHistory(h=>[...h,id].slice(-30));setMessage('');setSubmitted('');setChoice('')}
 function record(){if(!message.trim()){setMessage('Select a record, search result or investigation observation before saving.');return}
  setNotes(n=>[...n,{tool:info.name,finding:message,time:new Date().toISOString()}]);setMessage('Saved this simulated observation with timestamp to the browser notebook.')}
 function download(){
  const file={warning:'Synthetic OSINT training notes only. Not verified forensic evidence.',exportedAt:new Date().toISOString(),notes};
  const blob=new Blob([JSON.stringify(file,null,2)],{type:'application/json'});
  const href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download=filename+'.json';a.click();URL.revokeObjectURL(href)
 }
 async function calculate(){const text=new TextEncoder().encode(query);const digest=await crypto.subtle.digest('SHA-256',text);const value=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');setHashBefore(hash);setHash(value);setMessage('SHA-256 calculated over '+text.length+' UTF-8 bytes. Exact-byte consistency is required.')}
 const results=samples.filter(s=>!submitted.trim()?false:submitted.replace(/["']/g,'').toLowerCase().split(/\s+/).filter(x=>x!=='and'&&x!=='or'&&!x.startsWith('site:')).every(x=>(s.title+' '+s.address+' '+s.body).toLowerCase().includes(x))&&(!submitted.includes('site:')||s.address.includes(submitted.match(/site:(\S+)/)?.[1]||'')));
 return <section className="osintvbrowser" aria-label="Interactive simulated OSINT web browser">
  <div className="osintvtop"><span className="osintvdots" aria-hidden="true">● ● ●</span><strong>AMLVERSE Investigation Browser</strong><span className="osintvsafe">OFFLINE TRAINING DATA</span></div>
  <div className="osintvtabs" role="tablist" aria-label="Simulated browser tabs">{tabs.map(id=><button role="tab" aria-selected={tool===id} className={tool===id?'active':''} type="button" key={id} onClick={()=>open(id)}>{tools.find(t=>t.id===id)?.name}</button>)}</div>
  <div className="osintvaddress"><button type="button" title="Previous tool" onClick={()=>{if(history.length>1){const h=history.slice(0,-1);setHistory(h);setTool(h[h.length-1])}}}>←</button><span aria-label="Simulated address bar">🔒 https://{info.url}/</span><button type="button" title="Open home search" onClick={()=>open('search')}>⌂</button></div>
  <div className="osintvbody">
   <div className="osintvsidebar"><strong>Research services</strong>{tools.map(t=><button key={t.id} type="button" className={t.id===tool?'active':''} onClick={()=>open(t.id)}>{t.name}</button>)}</div>
   <div className="osintvwork">
    <span className="osintvlabel">SIMULATED {info.name.toUpperCase()}</span><h3>{info.name}</h3><p>{info.description}</p>
    {tool==='search'?<><form onSubmit={e=>{e.preventDefault();setSubmitted(query);setMessage(query?'Query submitted: '+query:'Enter a search query.')}}><input aria-label="Simulation search query" value={query} onChange={e=>setQuery(e.target.value)} placeholder={'Try "Meridian Aid" or RC 802116'} /><button type="submit">Search</button></form>{submitted?<div className="osintvresults"><strong>{results.length} training search results</strong>{results.length?results.map(s=><button type="button" key={s.id} onClick={()=>{setChoice(s.id);setMessage('Selected '+s.kind+': '+s.title+'. '+s.body)}}><strong>{s.title}</strong><small>https://{s.address}</small><p>{s.body}</p></button>):<p>No matching training records. Try a less restrictive query.</p>}</div>:null}</>:null}
    {tool==='registry'?<><div className="osintvtip">Real-world examples: UK Companies House and Nigeria’s CAC Public Search. This panel contains entirely fictional records.</div><label>Find a fictional company by name or number<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Meridian Aid or RC802116"/></label><button type="button" onClick={()=>{setSubmitted(query);setMessage(query.toLowerCase().includes('meridian')||query.includes('802116')?'Registry match: Meridian Aid Logistics Limited, RC 802116, listed director Amina Bello. Control unverified.':'No matching company in this synthetic register.')}}>Search company register</button>{submitted?<div className="osintvrecord"><strong>{message}</strong><p>Registered office: fictional · Status: active in training snapshot · This is not an official government filing.</p><button type="button" onClick={()=>open('archive')}>Inspect earlier archived listing →</button></div>:null}</>:null}
    {tool==='hunter'?<><div className="osintvtip">Inspired by company-domain search workflows such as Hunter. No email is sent, checked or looked up online.</div><label>Company domain<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="meridian-aid.example"/></label><button type="button" onClick={()=>{setSubmitted(query);setMessage('Synthetic email discovery queried for '+query)}}>Find public email pattern</button>{submitted?<div className="osintvrecord"><strong>Possible company contact (fictional)</strong><p>enquiries@meridian-aid.example · Source: company website · Pattern: shared departmental mailbox · Person controlling it: unknown</p><button type="button" onClick={()=>setMessage('A mailbox found in a public source is not proof of who reads it, nor of personal identity.')}>Check attribution limitations</button></div>:null}</>:null}
    {tool==='username'?<><div className="osintvtip">Compare exact public handles; a username match is only an investigative lead.</div><label>Simulated handle<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="meridianaid"/></label><button type="button" onClick={()=>{setSubmitted(query);setMessage('Checked synthetic public accounts. Candidate matches require attribution analysis.')}}>Check training profiles</button>{submitted?<div className="osintvresults">{['@meridianaid — business account · public','meridianaid — forum alias · unverified','@meridiancare — unrelated company'].map((p,i)=><button key={p} type="button" onClick={()=>setMessage((i===2?'Different identifier: ':'Potential username match: ')+p+'. No verified common person or operator.')}>{p}</button>)}</div>:null}</>:null}
    {tool==='phone'?<><div className="osintvtip">For training purposes, normalise a synthetic Nigerian number; subscriber identity cannot be inferred.</div><label>Input fictional number<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="0802 000 0000"/></label><button type="button" onClick={()=>{const digits=query.replace(/\D/g,'');setMessage(digits.length===11&&digits.startsWith('0')?'E.164: +234'+digits.slice(1)+'. This only validates formatting.':'Enter an 11-digit Nigerian-style training number starting with 0.')}}>Normalise to E.164</button></>:null}
    {tool==='social'?<><div className="osintvrecord"><strong>20 March 2025 · @meridianaid (fictional)</strong><p>“Our director Amina Bello attended the delivery hub opening.”</p><strong>22 March 2025 · Daily Ledger (fictional)</strong><p>“According to Meridian Aid’s event programme, Amina Bello attended.”</p><button type="button" onClick={()=>setMessage('The news article relies on the company programme; the apparent corroboration comes from one primary claim.')}>Trace original information source</button></div></>:null}
    {tool==='domain'?<><div className="osintvtip">Simulated RDAP/DNS only. 192.0.2.24 belongs to documentation-only address space.</div><label>Training domain<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="meridian-aid.example"/></label><button type="button" onClick={()=>{setSubmitted(query);setMessage('DNS training record retrieved: A 192.0.2.24; MX mail.meridian-aid.example; registrant protected.')}}>Run simulated RDAP and DNS</button>{submitted?<div className="osintvrecord"><strong>A: 192.0.2.24</strong><p>MX: mail.meridian-aid.example</p><p>RDAP: registrant privacy protected · no known natural-person attribution</p></div>:null}</>:null}
    {tool==='archive'?<><div className="osintvtip">Wayback-style snapshots are simulated; absence from an archive does not prove a page never existed.</div><div className="osintvresults">{['2023 snapshot · company registration pending','2025 snapshot · Amina Bello listed as director','2026 snapshot · page unavailable'].map(s=><button key={s} type="button" onClick={()=>setMessage('Historical training snapshot: '+s+'. Verify time and original source before inference.')}>{s}</button>)}</div></>:null}
    {tool==='image'?<><div className="osintvphoto"><span>TRAINING PHOTO · FICTIONAL LOCATION</span><strong>MERIDIAN HUB</strong></div><div className="osintvresults">{['Read simulated EXIF metadata','Run simulated reverse-image search','Inspect geolocation limitations'].map((p,i)=><button key={p} type="button" onClick={()=>setMessage(['EXIF: GPS absent; recording device not recorded; metadata may be stripped.','Synthetic similar photo: earlier company press page; independent geolocation not established.','No verified coordinates or unique landmarks. Location cannot be confirmed from the training asset.'][i])}>{p}</button>)}</div></>:null}
    {tool==='regex'?<><label>Regex pattern<input aria-label="Simulation regex" value={regex} onChange={e=>setRegex(e.target.value)} spellCheck={false}/></label><div className="osintvrecord"><strong>Test records</strong>{['RC 802116','RC802117','RC 123','REF 802116'].map(s=>{let yes=false;try{yes=new RegExp(regex).test(s)}catch{}return <p key={s}>{yes?'✓ Match':'— No match'} · {s}</p>})}</div></>:null}
    {tool==='hash'?<><label>Training text<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Evidence note A"/></label><button type="button" disabled={!query.trim()} onClick={calculate}>Calculate SHA-256</button>{hash?<div className="osintvrecord"><strong>Digest of current text</strong><code>{hash}</code>{hashBefore?<p>Previous digest: {hashBefore}</p>:null}<p>Hashing requires the exact original bytes and does not establish the truth of a statement.</p></div>:null}</>:null}
    {tool==='custody'?<><div className="osintvrecord"><strong>Training exhibit fields</strong><p>Case: Operation Meridian · Analyst: training participant · Source: synthetic registry</p><p>Record original source, collection method, UTC timestamp, exhibit identifier and analytical limitations.</p></div></>:null}
    <div className="osintvfeedback" aria-live="polite">{message||'Choose a training action to see the findings and limitations here.'}</div>
    <div className="osintvsave"><button type="button" className="secondary" onClick={record}>＋ Save observation to notebook</button><button type="button" className="secondary" disabled={!notes.length} onClick={download}>Export notes ({notes.length}) ↓</button></div>
   </div>
  </div>
  </div>
  <p className="osintvdisclaimer">This virtual browser runs entirely on synthetic records inside AMLVERSE. References to actual tools describe investigative methodology; it does not contact Companies House, CAC, Hunter, social platforms or any other third-party provider.</p>
 </section>;
}
