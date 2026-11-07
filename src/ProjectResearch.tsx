import {useState} from 'react';

const standards=[
 {title:'FATF Recommendations',topic:'AML/CFT/CPF global standards and interpretive notes',url:'https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html',note:'As amended June 2026; check subsequent updates before formal use.'},
 {title:'FATF Mutual Evaluation Methodology',topic:'Technical compliance and effectiveness assessment',url:'https://www.fatf-gafi.org/en/topics/fatf-recommendations.html',note:'Consult the current methodology and assessment procedures.'},
 {title:'Egmont Group',topic:'FIU information exchange, cooperation and confidentiality',url:'https://egmontgroup.org/about/',note:'Relevant to educational FIU scenarios; no access to restricted channels.'},
 {title:'UNODC Education for Justice',topic:'Active-learning and criminal justice education approaches',url:'https://www.unodc.org/dohadeclaration/en/topics/youth.html',note:'Pedagogical reference; no endorsement or affiliation.'}
] as const;

const citation='Adamu, M. (2026). AMLVERSE Nigeria: Interactive AML/CFT/CPF and Financial Intelligence Learning Town [Educational web application]. https://jctc-ng.github.io/amlverse-nigeria/';
const steps=[
 {number:'01',title:'Study an authoritative principle',description:'Identify the relevant published standard, definition and implementation context. Preserve the difference between international expectations and domestic law.'},
 {number:'02',title:'Make an evidence-led decision',description:'Use synthetic transactions, roles, reports and graph objects. Require learners to differentiate confirmed observations from hypotheses or unverified attribution.'},
 {number:'03',title:'Receive explained feedback',description:'Show why a choice is appropriate, what evidence would be needed, and how confidentiality, proportionality and due process affect a decision.'},
 {number:'04',title:'Demonstrate and review learning',description:'Record learning milestones locally and test interactive flows. For an institutional pilot, measure pre/post understanding using a disclosed research protocol.'}
] as const;

export default function ProjectResearch({onBack,onStart}:{onBack:()=>void;onStart:()=>void}){
 const [copied,setCopied]=useState(false);
 const [open,setOpen]=useState<'method'|'review'|'pilot'>('method');
 async function copyCitation(){
  try{await navigator.clipboard.writeText(citation);setCopied(true)}
  catch{setCopied(false)}
 }
 return <main className="researchpage" aria-label="About AMLVERSE Nigeria and research methodology">
  <button type="button" className="back" onClick={onBack}>← Academy overview</button>
  <div className="researchhero">
   <div><span className="eyebrow">INDEPENDENT PROFESSIONAL LEARNING INITIATIVE</span>
   <h1>Building better financial investigations through <em>practical learning.</em></h1>
   <p>AMLVERSE Nigeria is an open-access, scenario-based learning initiative for financial intelligence, AML/CFT/CPF compliance, financial investigations and virtual-asset analysis. Created in Nigeria with international professional learning in mind.</p>
   <div className="researchheroactions"><button type="button" className="primary" onClick={onStart}>Explore the learning town →</button><a className="researchactionsecondary" href="https://github.com/jctc-ng/amlverse-nigeria" target="_blank" rel="noopener noreferrer">View project repository ↗</a></div></div>
   <div className="researchidentity"><span className="researchidentityicon" aria-hidden="true">◈</span><small>PROJECT CREATOR & LEAD</small><h2>Muzammil Adamu</h2><p>Financial intelligence, AML/CFT/CPF and cryptocurrency investigation practitioner</p><div className="researchidentityrule"/><strong>Independent educational initiative</strong><span>Not an official training, publication or certification of an agency or standards-setting body.</span></div>
  </div>
  <div className="researchmetricrow"><article><strong>9</strong><span>Learning worlds</span></article><article><strong>40</strong><span>FATF Recommendation lessons</span></article><article><strong>3</strong><span>Expanded specialist academies</span></article><article><strong>0</strong><span>Real investigation records required</span></article></div>
  <section className="researchstatement">
   <span className="eyebrow">WHY AMLVERSE EXISTS</span><h2>From reading standards to applying judgement</h2>
   <p>Knowing a rule is not the same as applying it in an investigation. AMLVERSE brings risk analysis, information-sharing safeguards, virtual-asset tracing and defensible intelligence reporting into fictional decision exercises. The goal is to help learners recognise uncertainty, ask for the right evidence and communicate conclusions carefully.</p>
   <p>The platform is designed to be useful to FIU analysts, financial investigators, prosecutors, supervisors, compliance professionals, instructors and students. Users must adapt any learning to their own jurisdiction and authorised role.</p>
  </section>
  <section className="researchtabs" aria-label="Project research sections">
   <div className="researchtabbar" role="tablist" aria-label="Research topics">
    <button type="button" role="tab" aria-selected={open==='method'} onClick={()=>setOpen('method')}>Learning methodology</button>
    <button type="button" role="tab" aria-selected={open==='review'} onClick={()=>setOpen('review')}>Evidence & review policy</button>
    <button type="button" role="tab" aria-selected={open==='pilot'} onClick={()=>setOpen('pilot')}>International pilot protocol</button>
   </div>
   <div role="tabpanel" className="researchtabpanel">
    {open==='method'?<><h2>Four stages of an applied-learning experience</h2><div className="researchprocess">{steps.map(s=><article key={s.number}><span>{s.number}</span><div><h3>{s.title}</h3><p>{s.description}</p></div></article>)}</div><p className="researchfineprint">Exercises are simulated. A browser-based score is not an assessment of an individual's legal powers, operational competence or professional accreditation.</p></>:
    open==='review'?<><h2>What is verified—and what still needs review?</h2><div className="researchreviewlist"><article><strong>Content basis</strong><p>Primary public standards and official guidance are cited where relevant. A linked source supports a learning topic; it does not imply that its publisher approved this adaptation.</p></article><article><strong>Case data</strong><p>Wallets, transactions, identities and investigation materials in the learning exercises are synthetic. No sensitive law-enforcement information should be entered or shared in public issues.</p></article><article><strong>Testing</strong><p>Automated checks cover selected desktop/mobile interactions, progress and deployment. Passing them does not establish educational effectiveness, security certification or independent expert approval.</p></article><article><strong>Independent validation status</strong><p>The public curriculum is <strong>open for external subject-matter and pedagogical review</strong>. No agency endorsement, peer review, formal impact study or institutional accreditation is claimed.</p></article></div></>:
    <><h2>Proposed evidence-based international pilot</h2><p>Before making claims about effectiveness, AMLVERSE invites educators and organisations to evaluate it using a transparent, consent-based pilot:</p>
     <ol className="researchpilotlist"><li>Define the participating audience, teaching goals and jurisdictions; obtain institutional approvals where applicable.</li><li>Record a voluntary baseline knowledge assessment before the course.</li><li>Run a bounded guided-learning session using only synthetic scenarios, with consistent instructions.</li><li>Conduct a comparable post-learning assessment and collect accessibility, relevance and usability feedback.</li><li>Summarise aggregate improvements, uncertainties and limitations, without publishing personal or operational records.</li><li>Invite independent reviewers to inspect findings before describing outcomes in public talks or publications.</li></ol>
     <p className="researchfineprint">This is a proposed evaluation protocol, not a completed study. No participant recruitment, data collection or impact claims are represented here.</p>
    </>}
   </div>
  </section>
  <section className="researchsources"><div className="researchsectionhead"><span className="eyebrow">REFERENCES AND SOURCE GOVERNANCE</span><h2>Public standards that inform the learning</h2><p>International principles guide the curriculum, while actual powers, offences and reporting duties depend on national laws.</p></div><div className="researchsourcesgrid">{standards.map(x=><article key={x.title}><h3>{x.title}</h3><p>{x.topic}</p><small>{x.note}</small><a href={x.url} target="_blank" rel="noopener noreferrer">Official source ↗</a></article>)}</div></section>
  <section className="researchengage"><div><span className="eyebrow">OPEN INVITATION FOR PROFESSIONAL REVIEW</span><h2>Help make AMLVERSE useful across jurisdictions</h2><p>Subject-matter reviewers, law-enforcement educators, FIU training teams, compliance trainers and researchers can propose corrections, accessible learning improvements or carefully scoped pilot collaborations through public GitHub issues. Do not submit real cases, STRs, personal data or classified information.</p></div><div className="researchengageactions"><a href="https://github.com/jctc-ng/amlverse-nigeria/issues/new/choose" target="_blank" rel="noopener noreferrer">Propose a review or pilot ↗</a><a href="https://github.com/jctc-ng/amlverse-nigeria" target="_blank" rel="noopener noreferrer">Inspect source code ↗</a></div></section>
  <section className="researchcitation"><div><span className="eyebrow">ACADEMIC AND PROFESSIONAL ATTRIBUTION</span><h2>How to reference the project</h2><p className="researchcite">{citation}</p></div><button type="button" className="secondary" onClick={copyCitation}>{copied?'✓ Citation copied':'Copy citation'}</button></section>
  <p className="researchdisclaimer"><strong>Independence and responsible use:</strong> AMLVERSE Nigeria is an independently developed educational prototype, not an official NFIU, FATF, Egmont Group, UNODC, government or law-enforcement product. No organisation is presented as a sponsor, partner or validator. All learners should verify current legal and operational requirements and protect information entrusted to their agencies.</p>
 </main>;
}
