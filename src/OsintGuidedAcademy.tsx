import {useEffect,useState} from 'react';
import OsintSentenceBuilder,{correctSentence} from './OsintSentenceBuilder';
import OsintWorkedExample from './OsintWorkedExample';
import OsintVirtualBrowser from './OsintVirtualBrowser';

const KEY='amlverse-osint-guided-v1';
export type GuidedProgress={completed:string[];attempts:Record<string,number>};
export const guidedLessons=[
 {id:'intro',level:'Beginner',title:'What OSINT actually is',skill:'Define a lawful question, identify sources, preserve findings, qualify conclusions.',demo:'Investigation question: What do public records establish about Meridian Aid Logistics? A corporate registry records a director, but a registry entry alone does not prove beneficial ownership.',task:'Prepare an investigation question and note what evidence is needed.'},
 {id:'browser',level:'Beginner',title:'Browser searching and source discovery',skill:'Build a precise keyword search and inspect search results before drawing conclusions.',demo:'Use the fictional company name “Meridian Aid Logistics”. Search results must be evaluated for source type, date, and independence.',task:'Type a search that contains the complete company name.'},
 {id:'boolean',level:'Beginner',title:'Boolean, quotation marks and search operators',skill:'Use quotes for exact phrases, OR for alternatives and a site: filter for a specific domain.',demo:'“Meridian Aid” site:registry.osint.lab restricts this synthetic search to the simulated company register. A search engine may implement operators differently.',task:'Construct a quoted company-name search restricted to the simulated registry domain.'},
 {id:'regex',level:'Intermediate',title:'Regular expressions (Regex)',skill:'Recognise character classes, anchors, repetition and capture groups; extract identifiers from text.',demo:'Example expression: RC[ -]?\d{6} matches fictional registry identifiers such as RC 802116 or RC802116. The lab executes your JavaScript-compatible pattern.',task:'Write a regex that finds RC 802116 and RC802117 but not incomplete RC 123.'},
 {id:'username',level:'Intermediate',title:'Username search and account pivots',skill:'Distinguish an exact handle match from verified identity or common account control.',demo:'The synthetic handle @meridianaid appears on a business profile and on a forum. Matching usernames are leads, not proof the accounts share an operator.',task:'Select the matching fictional accounts and explain the attribution gap.'},
 {id:'email',level:'Intermediate',title:'Email-address investigations',skill:'Split an address into local part/domain; assess what the domain connection does and does not show.',demo:'enquiries@meridian-aid.example contains local part enquiries and domain meridian-aid.example. It does not establish who reads the mailbox.',task:'Extract the domain and record the identity limitation.'},
 {id:'phone',level:'Intermediate',title:'Telephone number normalisation',skill:'Convert a supplied synthetic Nigerian-style number to E.164 and avoid treating a phone number as verified identity.',demo:'For a fictional Nigerian number 0802 000 0000, replace the initial 0 with +234 to obtain +2348020000000.',task:'Normalise the sample telephone number to E.164.'},
 {id:'social',level:'Intermediate',title:'Social media, timelines and corroboration',skill:'Compare social posts with other sources, distinguish shared provenance from independent corroboration.',demo:'A news article repeats the company event programme. Even if it repeats a claim, that does not make the claim independently verified.',task:'Identify why two matching sources may still be dependent.'},
 {id:'image',level:'Advanced',title:'Image metadata, visual clues and geolocation',skill:'Distinguish embedded metadata, visual content and geographic inference. Identify limits of location claims.',demo:'A synthetic image depicts an office sign and a clock. Its EXIF GPS field is absent. The sign alone is insufficient to establish where the photo was taken.',task:'Inspect the fictional image clues and select the defensible location finding.'},
 {id:'domain',level:'Advanced',title:'Domain, DNS, WHOIS and infrastructure',skill:'Read technical domain records and avoid equating hosting infrastructure with the registrant or website owner.',demo:'Synthetic RDAP shows a privacy-protected registrant; an A record points to 192.0.2.24 (documentation-only). Neither independently identifies a human controller.',task:'Identify the privacy-protected registrant and documentation-only IP without inventing an owner.'},
 {id:'hash',level:'Advanced',title:'SHA-256 hashing and integrity checks',skill:'Compute a digest of identical bytes and identify whether evidence changed between captures.',demo:'Hash values depend on the exact bytes and encoding. A different hash indicates different input bytes (or extremely unlikely collision); matching digests do not prove the original source was truthful.',task:'Calculate SHA-256 of a synthetic note and compare it with a modified version.'},
 {id:'custody',level:'Advanced',title:'Evidence capture, chain of custody and analytical conclusions',skill:'Preserve source identity, capture time, responsible analyst, digest and limitations before reporting.',demo:'An exhibit log needs a source address, collection timestamp, handling record and description of what was actually observed. Preserve originals and document changes.',task:'Write an evidence log entry identifying source, capture action and limitation.'}
] as const;
const walkthroughs:Record<string,{title:string;detail:string;pitfall:string}[]>={
 intro:[
 {title:'Define the intelligence requirement',detail:'Begin with one answerable question. Specify which fictional organisation or activity is in scope, the relevant period, and what a useful finding would establish.',pitfall:'Do not start collecting names and identifiers without a defined purpose.'},
 {title:'Write a research plan',detail:'List likely public sources, search identifiers and a verification sequence. Distinguish primary records, self-published claims and secondary reporting.',pitfall:'A lead is not an established fact merely because it appears on several websites.'},
 {title:'Create a case notebook',detail:'Record your tasking, investigator role, date, permissible sources and method for preserving source URLs and screenshots.',pitfall:'Research notes written after the fact may omit critical source context.'}
 ],
 browser:[
 {title:'Identify the strongest starting identifier',detail:'Use an exact fictional company name, domain, registration number or a unique phrase. Record spelling variants and country context.',pitfall:'Common names alone often produce unrelated results.'},
 {title:'Search and inspect the result',detail:'Read the result title, domain and snippet. Open its record and look for publisher, collection date, purpose and source limitations.',pitfall:'A search snippet is a pointer, not the original evidence.'},
 {title:'Cross-check using a second source type',detail:'Compare company web claims with a registry extract or archived snapshot. Record whether one source copied the other.',pitfall:'Repetition does not guarantee independent corroboration.'}
 ],
 boolean:[
 {title:'Start narrow',detail:'Quotation marks request a phrase, e.g. "public notice", instead of several unrelated words. Verify how the chosen engine interprets exact phrases.',pitfall:'Search operators vary between engines and can change.'},
 {title:'Add alternatives',detail:'Use OR to test spelling or brand variations and parentheses where the tool supports grouping. Keep a written record of the query.',pitfall:'Broad OR expressions can drown relevant results in noise.'},
 {title:'Restrict and refine',detail:'Use site:example.org to narrow to a domain, then remove restrictions to identify independent sources.',pitfall:'A site filter restricts where a result appears; it does not certify the page.'}
 ],
 regex:[
 {title:'Identify the shape of the identifier',detail:'Break RC 802116 into a fixed prefix, optional delimiter and six numeric characters.',pitfall:'Matching a few digits is not the same as validating a complete identifier.'},
 {title:'Translate the shape into tokens',detail:'Use character classes like [0-9], a quantifier like {6}, and optional groups or separators like [ -]?. Anchors ^ and $ apply to whole strings.',pitfall:'The period (.) matches almost any character unless escaped.'},
 {title:'Test both positive and negative examples',detail:'Run your pattern against correct forms and near misses. Check whether it accidentally matches an incomplete or longer number.',pitfall:'A regex match can establish formatting, not whether the identifier is authentic.'}
 ],
 username:[
 {title:'Standardise the observed handle',detail:'Record whether a service includes @, normalises case, allows dots or permits changes in usernames. Keep the exact original spelling.',pitfall:'Treating similar spellings as equivalent can connect unrelated profiles.'},
 {title:'Pivot only within permitted sources',detail:'Compare a fictional handle across public records, then inspect account biographies, timelines and cross-links.',pitfall:'Avoid assuming that a match reveals a natural person.'},
 {title:'Rate the confidence of the association',detail:'Separate exact handle reuse, self-declared links, platform-verified links and independent records.',pitfall:'A copied handle or profile picture can be impersonation.'}
 ],
 email:[
 {title:'Parse the address safely',detail:'Separate the local part before @ from the domain afterward. Preserve the original address including case in notes.',pitfall:'An email string may be malformed, disposable or no longer in use.'},
 {title:'Investigate the domain context',detail:'Compare the synthetic email domain with website, MX and registration records. Record discrepancies and privacy-protected details.',pitfall:'An MX record describes mail routing, not the person receiving messages.'},
 {title:'State the attribution limit',detail:'Differentiate a company contact mailbox, possible role account and independently verified individual account.',pitfall:'Do not claim an email address confirms the identity of its operator.'}
 ],
 phone:[
 {title:'Recognise the country context',detail:'Start from the number as observed. For a fictional Nigerian local mobile number, the trunk prefix 0 is not retained after +234.',pitfall:'A number can be ported or recycled; prefixes do not establish present ownership.'},
 {title:'Normalise into a consistent format',detail:'Use E.164 form with country code and no spaces, while retaining the original written format as evidence.',pitfall:'Formatting correctly does not verify that a number is active.'},
 {title:'Evaluate supporting records',detail:'Compare a hypothetical phone listing with independent public-source context; document what is and is not corroborated.',pitfall:'Never treat a phone match as proof of subscriber identity.'}
 ],
 social:[
 {title:'Preserve the post as published',detail:'Record the account handle, URL, date/time, content, embedded media and platform context.',pitfall:'Reposts and screenshots may omit editing history and context.'},
 {title:'Construct a claim timeline',detail:'Place the company announcement, later article and repost in chronological order. Note who originally made each claim.',pitfall:'Later reporting may be derivative rather than independent.'},
 {title:'Seek genuinely separate corroboration',detail:'An independently maintained registry, authorised statement or another primary record can support a claim; assess relevance and limitations.',pitfall:'Two accounts repeating one press release are still one underlying source.'}
 ],
 image:[
 {title:'Separate image bytes from visual claims',detail:'Collect the original fictional file where available. Record dimensions, format, digest and provenance before analysis.',pitfall:'A screenshot often strips metadata or changes the original image.'},
 {title:'Read metadata without overtrusting it',detail:'EXIF may contain camera, time or GPS details, but metadata may be absent, inaccurate or manipulated.',pitfall:'No EXIF GPS value does not mean the photograph is fake or locationless.'},
 {title:'Cross-check physical scene clues',detail:'Compare signs, landmarks, architecture, lighting and chronology against separate sources before assigning a location.',pitfall:'A generic office sign cannot conclusively geolocate a building.'}
 ],
 domain:[
 {title:'Distinguish the layers',detail:'The domain name, DNS resource records, registrar/registry data, hosting service and customer identity are different entities.',pitfall:'Shared cloud IPs can serve many unrelated organisations.'},
 {title:'Inspect synthetic records',detail:'Read A, MX and RDAP values and note creation/update dates, privacy-protected registration and documentation-only IP space.',pitfall:'WHOIS/RDAP disclosure restrictions are not evidence of criminal conduct.'},
 {title:'Write a proportionate finding',detail:'Describe exactly which DNS record mapped to which IP at the observed time and what remains unverified.',pitfall:'Infrastructure links do not establish website authorship or ownership.'}
 ],
 hash:[
 {title:'Define the evidence object',detail:'A digest is calculated from a precisely defined byte sequence, not the abstract meaning of the document.',pitfall:'Whitespace or encoding changes can alter hashes.'},
 {title:'Calculate and record',detail:'Select a known algorithm such as SHA-256 and save the full digest alongside file name, size, capture time and method.',pitfall:'A hash alone does not explain how the data was collected.'},
 {title:'Compare after a controlled change',detail:'Alter one character of the synthetic note and recompute. The new digest normally differs. Record both results and your interpretation.',pitfall:'Identical digests are not a guarantee the content is true or lawful.'}
 ],
 custody:[
 {title:'Collect with provenance',detail:'Record the exact source URL, retrieval date/time, the investigator performing collection and the method used.',pitfall:'A pasted quote without the original source can be difficult to verify.'},
 {title:'Log handling and integrity',detail:'Assign an exhibit identifier, create a digest where appropriate and record transfers, storage, transformations and access.',pitfall:'Training-browser logs are illustrative, not automatically court-admissible forensic records.'},
 {title:'Write a bounded intelligence assessment',detail:'Distinguish finding, inference, source limitations and lawful next steps. Avoid implying guilt from an indicator.',pitfall:'Inference must never masquerade as a verified fact.'}
 ]
};

export function readGuidedProgress():GuidedProgress{
 try{const v=JSON.parse(localStorage.getItem(KEY)||'{}') as Partial<GuidedProgress>;
 return {completed:Array.isArray(v.completed)?v.completed.filter((x):x is string=>typeof x==='string'):[],attempts:v.attempts&&typeof v.attempts==='object'?v.attempts:{}}}
 catch{return {completed:[],attempts:{}}}
}
export function guidedComplete(){return guidedLessons.every(x=>readGuidedProgress().completed.includes(x.id))}
const samples=['RC 802116','RC802117','RC 123','REF 802116'];
const mockProfiles=[
 {id:'business',handle:'@meridianaid',site:'Simulated social network',detail:'Company profile: logistics updates'},
 {id:'forum',handle:'meridianaid',site:'Fictional public forum',detail:'Similar handle; operator not established'},
 {id:'different',handle:'@meridiancare',site:'Simulated social network',detail:'Different name and organisation'}
];
function hex(buf:ArrayBuffer){return Array.from(new Uint8Array(buf),b=>b.toString(16).padStart(2,'0')).join('')}
async function digest(input:string){return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(input)))}
export default function OsintGuidedAcademy({onMissions}:{onMissions:()=>void}){
 const [progress,setProgress]=useState(readGuidedProgress);
 const [index,setIndex]=useState(()=>{const p=readGuidedProgress();return Math.max(0,guidedLessons.findIndex(x=>!p.completed.includes(x.id)))});
 const [response,setResponse]=useState('');
 const [support,setSupport]=useState('');
 const [checked,setChecked]=useState(false);
 const [notice,setNotice]=useState('');
 const [selected,setSelected]=useState<string[]>([]);
 const [hashes,setHashes]=useState<{a:string;b:string}|null>(null);
 const [regexError,setRegexError]=useState('');
 const [walkStep,setWalkStep]=useState(0);
 const [imageInspections,setImageInspections]=useState<string[]>([]);
 const lesson=guidedLessons[index]||guidedLessons[0];
 const completed=progress.completed.includes(lesson.id);
 function persist(p:GuidedProgress){setProgress(p);try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}}
 function switchTo(i:number){if(i>0&&!progress.completed.includes(guidedLessons[i-1].id)){setNotice('Finish the previous guided lesson first.');return}setIndex(i);setResponse('');setSupport('');setSelected([]);setChecked(false);setNotice('');setRegexError('');setHashes(null);setWalkStep(0);setImageInspections([])}
 useEffect(()=>{if(lesson.id!=='regex')return;try{if(response.trim())new RegExp(response,'g');setRegexError('')}catch(e){setRegexError(e instanceof Error?e.message:'Invalid regular expression')}},[response,lesson.id]);
 async function computeHash(){const a=await digest(response);const b=await digest(response+' (edited)');setHashes({a,b})}
 function assess(){
  let success=false,explanation='';
  const a=response.trim(),b=support.trim();
  switch(lesson.id){
   case 'intro':success=a===correctSentence('introQuestion')&&b===correctSentence('introEvidence');explanation='Complete both sentence builders in a logical order: the investigation question and the evidence requirement. Choose word groups and arrange them into complete statements.';break;
   case 'browser':success=a.toLowerCase().includes('meridian aid logistics');explanation='Include the complete fictional company name to narrow the search; inspect source provenance before inferring identity.';break;
   case 'boolean':success=/["“]meridian aid(?: logistics)?["”]/i.test(a)&&/site:registry\.osint\.lab/i.test(a);explanation='Use quotes around the company name and site:registry.osint.lab. Quotation and site syntax can differ across real engines.';break;
   case 'regex':try{const re=new RegExp(a,'g');success=samples.filter(x=>new RegExp(re.source).test(x)).join('|')===samples.slice(0,2).join('|');explanation='Your pattern should match both six-digit registry references and reject incomplete or different-prefix identifiers. Example: RC[ -]?\\d{6}\\b.'}catch{explanation='Enter a valid JavaScript regular expression; test it against the four samples.'}break;
   case 'username':success=selected.includes('business')&&selected.includes('forum')&&!selected.includes('different')&&b===correctSentence('username');explanation='Select both meridianaid handles, not meridiancare. Explain that common handles alone cannot establish a common operator.';break;
   case 'email':success=a.toLowerCase()==='meridian-aid.example'&&b===correctSentence('email');explanation='The email domain is meridian-aid.example. State that domain affiliation does not identify who controls the mailbox.';break;
   case 'phone':success=a.replace(/[\s()-]/g,'')==='+2348020000000';explanation='The hypothetical Nigerian number 0802 000 0000 becomes +2348020000000, but this does not identify the subscriber.';break;
   case 'social':success=selected.includes('dependent')&&!selected.includes('independent')&&b===correctSentence('social');explanation='The news copied a company programme, so the accounts do not represent independent corroboration. Describe the shared source.';break;
   case 'image':success=imageInspections.includes('metadata')&&imageInspections.includes('reverse')&&selected.includes('unknown')&&!selected.includes('verified')&&b===correctSentence('image');explanation='Inspect both metadata and simulated reverse-image results, then qualify your location finding. A sign without corroboration cannot establish a location.';break;
   case 'domain':success=a==='192.0.2.24'&&selected.includes('protected')&&!selected.includes('identified');explanation='The IP is a reserved documentation address and the registrant is protected; neither identifies the person controlling the service.';break;
   case 'hash':success=!!hashes&&hashes.a!==hashes.b&&a.length>=8;explanation='Compute both digests. A changed byte sequence gives a different SHA-256 result; this checks integrity, not truthfulness.';break;
   case 'custody':success=a===correctSentence('custodyRecord')&&b===correctSentence('custodyLimit');explanation='Log the URL/source, capture action and time, then separately document what the exhibit cannot establish.';break;
  }
  persist({...progress,attempts:{...progress.attempts,[lesson.id]:(progress.attempts[lesson.id]||0)+1},completed:success?[...new Set([...progress.completed,lesson.id])]:progress.completed});
  setChecked(true);
  setNotice(success?'Skill demonstrated. '+(explanation.startsWith('Write')?'Your work has been saved.':explanation):explanation);
 }
 const tool=lesson.id;
 return <section className="osintguided">
  <div className="osintguidedhero"><div><span className="eyebrow">STRUCTURED OSINT ACADEMY · BEGINNER → ADVANCED</span><h2>Learn the technique. Practise it. Then investigate.</h2><p>Guided demonstrations and simulated workbenches precede the independent investigation. This course uses fictional identifiers; knowledge and work quality are assessed in the browser, not on live people.</p></div><div className="osintguidedtotal"><strong>{progress.completed.length}/{guidedLessons.length}</strong><small>Skills demonstrated</small></div></div>
  <div className="osintguidedlayout">
  <nav className="osintguidedtoc" aria-label="Guided OSINT lessons"><h3>Learning pathway</h3>{guidedLessons.map((l,i)=><button type="button" key={l.id} className={index===i?'active':''} disabled={i>0&&!progress.completed.includes(guidedLessons[i-1].id)} onClick={()=>switchTo(i)}><span>{progress.completed.includes(l.id)?'✓':i+1}</span><span><small>{l.level}</small><strong>{l.title}</strong></span></button>)}</nav>
  <div className="osintguidedcontent"><div className="osintguidedlessonhead"><span className="eyebrow">{lesson.level.toUpperCase()} · LESSON {index+1} OF {guidedLessons.length}</span><h3>{lesson.title}</h3><p>{lesson.skill}</p></div>
  <div className="osintguidedtheory"><strong>01 · Learn the concept</strong><p>{lesson.demo}</p></div><section className="osintwalkthrough" aria-label="Guided investigation walkthrough"><div className="osintwalkhead"><strong>02 · Learn the investigation workflow</strong><span>Step {walkStep+1} of {walkthroughs[lesson.id].length}</span></div><div className="osintwalkdots" aria-hidden="true">{walkthroughs[lesson.id].map((_,i)=><i key={i} className={i<=walkStep?"active":""}/>)}</div><div className="osintwalkcontent" key={lesson.id+"-"+walkStep}><h4>{walkthroughs[lesson.id][walkStep].title}</h4><p>{walkthroughs[lesson.id][walkStep].detail}</p><div className="osintwalkpitfall"><strong>Professional caution</strong><p>{walkthroughs[lesson.id][walkStep].pitfall}</p></div></div><div className="osintwalkactions"><button type="button" className="secondary" disabled={walkStep===0} onClick={()=>setWalkStep(n=>Math.max(0,n-1))}>← Previous technique</button><button type="button" className="primary" disabled={walkStep===walkthroughs[lesson.id].length-1} onClick={()=>setWalkStep(n=>Math.min(walkthroughs[lesson.id].length-1,n+1))}>Next technique →</button></div></section>
  <OsintWorkedExample key={lesson.id} lessonId={lesson.id}/>
  <div className="osintguidedbrowserlesson"><div><span className="eyebrow">04 · LEARN BY DOING</span><h3>Investigate using the virtual OSINT browser</h3><p>Use the training tools below to examine fictional records. Compare the example with the simulated findings before you complete your own skill task.</p></div><OsintVirtualBrowser lessonId={lesson.id}/></div>
  <div className="osintguidedpractice"><strong>05 · Your interactive practice task</strong><p>{lesson.task}</p>
  {tool==='intro'?<div className="osintsentencepair"><OsintSentenceBuilder key="introQuestion" exercise="introQuestion" onChange={setResponse}/><OsintSentenceBuilder key="introEvidence" exercise="introEvidence" onChange={setSupport}/></div>:null}
  {tool==='browser'||tool==='boolean'?<><label>Simulated search query<input aria-label="Guided search query" value={response} onChange={e=>setResponse(e.target.value)} placeholder={tool==='boolean'?'"Meridian Aid" site:registry.osint.lab':'Meridian Aid Logistics'}/></label><div className="osintguidedsim"><span>🔎 TRAINING SEARCH ENGINE</span>{response.trim()?<div><strong>{response.toLowerCase().includes('meridian')?'Meridian Aid Logistics — Registry result':'No precise results yet'}</strong><p>{response.toLowerCase().includes('meridian')?'registry.osint.lab/RC802116 · Check whether the result is official within this fictional dataset.':'Try a name from the case brief. Search operators refine what appears.'}</p></div>:<p>Search results will appear here as you type.</p>}</div></>:null}
  {tool==='regex'?<><div className="osintguidedsamples">{samples.map((s,i)=><code key={i}>{s}</code>)}</div><label>Write a JavaScript regular expression (without slashes)<input aria-label="Regex expression" spellCheck={false} value={response} onChange={e=>setResponse(e.target.value)} placeholder={'RC[ -]?\\d{6}\\b'}/></label>{regexError?<p role="status" className="osintguidedwarning">{regexError}</p>:null}<div className="osintguidedsim"><strong>Live matches</strong>{samples.map(s=><p key={s}>{(()=>{try{return response&&new RegExp(response).test(s)?'✓ MATCH':'— NO MATCH'}catch{return 'INVALID REGEX'}})()} · {s}</p>)}</div></>:null}
  {tool==='username'?<><div className="osintguidedoptions">{mockProfiles.map(p=><button key={p.id} className={selected.includes(p.id)?'selected':''} onClick={()=>setSelected(v=>v.includes(p.id)?v.filter(x=>x!==p.id):[...v,p.id])} aria-pressed={selected.includes(p.id)} type="button"><strong>{p.handle}</strong><small>{p.site}</small><span>{p.detail}</span></button>)}</div><OsintSentenceBuilder key="username" exercise="username" onChange={setSupport}/></>:null}
  {tool==='email'?<><div className="osintguidedsim">✉️ <strong>enquiries@meridian-aid.example</strong><p>Local part: <b>enquiries</b> · Domain: ? · Mailbox owner: unknown</p></div><label>Enter the email domain<input aria-label="Email domain" value={response} onChange={e=>setResponse(e.target.value)}/></label><OsintSentenceBuilder key="email" exercise="email" onChange={setSupport}/></>:null}
  {tool==='phone'?<><div className="osintguidedsim">☎️ Fictional sample: <strong>0802 000 0000</strong><p>Country code +234 · E.164 uses a leading + and no formatting spaces.</p></div><label>E.164 result<input aria-label="Phone E.164" value={response} onChange={e=>setResponse(e.target.value)} placeholder="+234…"/></label></>:null}
  {tool==='social'?<><div className="osintguidedsim"><strong>Source A · Company event programme</strong><p>“Amina Bello attended the logistics hub launch.”</p><strong>Source B · News story</strong><p>“According to the company event programme, Amina Bello attended.”</p></div><div className="osintguidedoptions">{[{id:'dependent',label:'Both sources depend on the same original claim'},{id:'independent',label:'The article independently verified the attendee'}].map(p=><button type="button" aria-pressed={selected.includes(p.id)} className={selected.includes(p.id)?'selected':''} key={p.id} onClick={()=>setSelected([p.id])}>{p.label}</button>)}</div><OsintSentenceBuilder key="social" exercise="social" onChange={setSupport}/></>:null}
  {tool==='image'?<><div className="osintguidedphoto" aria-label="Simulated photograph of a building and office sign, with no verifiable GPS coordinates"><div className="osintguidedsky">ILLUSTRATIVE IMAGE · EXIF GPS: NOT PRESENT</div><div className="osintguidedbuilding"><div className="osintguidedsign">MERIDIAN HUB</div><div className="osintguidedwindows">▦ ▦ ▦</div></div></div><div className="osintimageforensics"><h4>Virtual image investigation tools</h4><div className="osintimagebuttons"><button type="button" className="secondary" onClick={()=>setImageInspections(v=>[...new Set([...v,'metadata'])])}>🔍 Inspect metadata</button><button type="button" className="secondary" onClick={()=>setImageInspections(v=>[...new Set([...v,'reverse'])])}>🖼️ Run simulated reverse-image lookup</button></div>{imageInspections.includes('metadata')?<div className="osintguidedsim"><strong>EXIF / file metadata inspection</strong><p>Filename: meridian_hub_training.png · Format: PNG · GPS: not present · Camera make: not available · Created: synthetic training asset</p><p>Metadata is absent. Do not interpret absence as evidence of manipulation or location.</p></div>:null}{imageInspections.includes('reverse')?<div className="osintguidedsim"><strong>Simulated visual search results</strong><p>Result 1 — Meridian Aid company press page: the same illustration, published after the reported launch.</p><p>Result 2 — Unrelated architecture portfolio: a visually similar generic building facade.</p><p>Neither result independently verifies geographic coordinates or the original photographer.</p></div>:null}</div><div className="osintguidedoptions">{[{id:'unknown',label:'Location is unverified — additional evidence needed'},{id:'verified',label:'Building and operator location are conclusively established'}].map(p=><button type="button" className={selected.includes(p.id)?'selected':''} aria-pressed={selected.includes(p.id)} onClick={()=>setSelected([p.id])} key={p.id}>{p.label}</button>)}</div><OsintSentenceBuilder key="image" exercise="image" onChange={setSupport}/></>:null}
  {tool==='domain'?<><div className="osintguidedsim"><strong>Simulated RDAP / DNS</strong><p>meridian-aid.example · Registrant: PRIVACY PROTECTED · A: 192.0.2.24 · MX: mail.meridian-aid.example</p></div><label>Enter the A-record IP<input aria-label="DNS A record" value={response} onChange={e=>setResponse(e.target.value)}/></label><div className="osintguidedoptions">{[{id:'protected',label:'Registrant identity is hidden and cannot be inferred from the A record'},{id:'identified',label:'The hosting IP confirms Amina Bello owns the domain'}].map(p=><button key={p.id} type="button" className={selected.includes(p.id)?'selected':''} aria-pressed={selected.includes(p.id)} onClick={()=>setSelected([p.id])}>{p.label}</button>)}</div></>:null}
  {tool==='hash'?<><label>Enter a fictional evidence note<input aria-label="Hash input text" value={response} onChange={e=>{setResponse(e.target.value);setHashes(null)}} placeholder="A fictional transaction was documented"/></label><button type="button" className="secondary" disabled={response.length<8} onClick={computeHash}>Calculate both SHA-256 digests</button>{hashes?<div className="osintguidedsim"><strong>SHA-256 of original bytes</strong><code>{hashes.a}</code><strong>SHA-256 of edited bytes</strong><code>{hashes.b}</code><p>✓ The hashes differ. Exact input bytes matter. SHA-256 does not prove the source's claims are true.</p></div>:null}</>:null}
  {tool==='custody'?<><div className="osintguidedsim"><strong>EXH-001 · Simulated capture</strong><p>Source: https://registry.osint.lab/RC802116 · Captured using an approved browser on a fictional case · Record time in UTC and avoid claiming more than the source shows.</p></div><OsintSentenceBuilder key="custodyRecord" exercise="custodyRecord" onChange={setResponse}/><OsintSentenceBuilder key="custodyLimit" exercise="custodyLimit" onChange={setSupport}/></>:null}
  </div>
  <div className="osintguidedactions"><button type="button" className="primary" onClick={completed?()=>index===guidedLessons.length-1?onMissions():switchTo(index+1):assess}>{completed?index===guidedLessons.length-1?'Enter independent investigation →':'Continue to next lesson →':'Check my practical work →'}</button>{index>0?<button type="button" className="secondary" onClick={()=>switchTo(index-1)}>← Previous lesson</button>:null}</div>
  {notice?<p className={checked&&completed?'osintguidedpositive':'osintguidedwarning'} role="status">{notice}</p>:null}
  {completed?<p className="osintguidedpositive">✓ Competency recorded. Your evidence and investigation missions are separate from these guided lessons.</p>:null}
  </div>
  </div>
 </section>
}
