import {useState} from 'react';

/** Worked demonstrations use different fictional examples from the graded practice tasks. */
const examples={
 intro:{title:'Turn a vague lead into an investigation question',case:'A fictional training note says: “Harbourline Supplies may be connected to a delivery contract.”',steps:[
  {heading:'Start with a specific question',phrase:'What do',detail:'Ask what the publicly accessible records can actually establish.'},
  {heading:'Choose the record and subject',phrase:'public registration records establish',detail:'Name the type of evidence rather than relying on rumours.'},
  {heading:'Finish with a focused subject',phrase:'about Harbourline Supplies?',detail:'This is a bounded question; it does not presume a crime.'}
 ],result:'What do public registration records establish about Harbourline Supplies?',takeaway:'For your own task, investigate Meridian Aid Logistics instead. Build a question and a separate evidence requirement from the phrase cards.'},
 browser:{title:'Search for a fictional company accurately',case:'You need public information about the fictional business Harbourline Supplies.',steps:[
  {heading:'Identify the most specific name',phrase:'Harbourline Supplies',detail:'Avoid starting with broad terms such as supplies or company.'},
  {heading:'Enter it in the browser search field',phrase:'"Harbourline Supplies"',detail:'Quotation marks instruct many engines to seek an exact phrase.'},
  {heading:'Inspect the result before using it',phrase:'Source: fictional registry · registration date: recorded',detail:'Check the source, record date and relevant identifiers before relying on a snippet.'}
 ],result:'Search → "Harbourline Supplies" → inspect the registry record',takeaway:'In your task, apply the method to Meridian Aid Logistics in the simulated search tool.'},
 boolean:{title:'Build a targeted search query',case:'You need a fictional company record from the training registry, not unrelated news.',steps:[
  {heading:'Use an exact phrase',phrase:'"Harbourline Supplies"',detail:'Keep the business name together in the search.'},
  {heading:'Add a domain restriction',phrase:'site:registry.osint.lab',detail:'This restricts the search to the simulated registry. The operator’s behaviour varies across search engines.'},
  {heading:'Combine the parts',phrase:'"Harbourline Supplies" site:registry.osint.lab',detail:'Check that returned documents actually relate to the company.'}
 ],result:'"Harbourline Supplies" site:registry.osint.lab',takeaway:'Now make a different targeted query for Meridian Aid.'},
 regex:{title:'Extract a six-digit training registry identifier',case:'Example records: RC 654321, RC654322, RC 12 and REF654321.',steps:[
  {heading:'Identify the required prefix',phrase:'RC',detail:'The pattern must begin with the exact two-letter prefix.'},
  {heading:'Allow an optional separator',phrase:'[ -]?',detail:'A space or hyphen may occur once, but neither is compulsory.'},
  {heading:'Require exactly six digits',phrase:'\\d{6}\\b',detail:'Six digits followed by a word boundary avoids matching an incomplete reference.'}
 ],result:'RC[ -]?\\d{6}\\b',takeaway:'Practise against the different RC numbers in the live regex tester. A format match does not authenticate a record.'},
 username:{title:'Compare handles without assuming identity',case:'Two fictional platforms show @harbourlines and harbourlines.',steps:[
  {heading:'Record each displayed handle',phrase:'@harbourlines · harbourlines',detail:'The leading @ may be only a platform display convention.'},
  {heading:'Compare exact identifiers',phrase:'Possible username reuse',detail:'This is a reason to examine public bios, dates and cross-links.'},
  {heading:'State the limitation',phrase:'A matching handle does not prove a shared operator.',detail:'Avoid identifying a person from a handle alone.'}
 ],result:'Matching handles are leads, not verified identity.',takeaway:'Now compare the Meridian handles and construct a defensible attribution sentence.'},
 email:{title:'Understand a fictional email address',case:'The example address is support@harbourlines.example.',steps:[
  {heading:'Find the local part',phrase:'support',detail:'Everything before @ is the local part.'},
  {heading:'Find the domain',phrase:'harbourlines.example',detail:'Everything after @ identifies the email domain.'},
  {heading:'Qualify ownership',phrase:'Mailbox operator: unverified',detail:'An address does not independently identify the individual reading it.'}
 ],result:'support | @ | harbourlines.example',takeaway:'In your task, inspect enquiries@meridian-aid.example, then build a limitation sentence.'},
 phone:{title:'Normalise a fictional Nigerian number',case:'Training number: 0803 111 2222.',steps:[
  {heading:'Recognise the national format',phrase:'0803 111 2222',detail:'Record the original form as observed.'},
  {heading:'Apply country code +234',phrase:'+234',detail:'Drop the national trunk prefix 0 before the number.'},
  {heading:'Remove formatting spaces',phrase:'+2348031112222',detail:'E.164 formatting does not establish subscriber identity.'}
 ],result:'+2348031112222',takeaway:'Try a different fictional phone number in your own exercise.'},
 social:{title:'Detect circular reporting',case:'Harbourline posts an event announcement. A fictional blog republishes its text.',steps:[
  {heading:'Identify the original source',phrase:'Company announcement',detail:'The company made the initial statement.'},
  {heading:'Trace the second claim',phrase:'Blog repeats the announcement',detail:'The blog has not independently checked the event.'},
  {heading:'Assess corroboration',phrase:'One underlying source, two publications',detail:'Repetition is not independent confirmation.'}
 ],result:'Two posts repeating one source do not independently corroborate a claim.',takeaway:'Investigate the Meridian social and news sources in the practice task.'},
 image:{title:'Assess a photo with missing GPS metadata',case:'A synthetic photo has a “Harbourline Hub” sign but no GPS fields.',steps:[
  {heading:'Inspect original metadata',phrase:'GPS absent',detail:'Absent metadata is not proof of manipulation.'},
  {heading:'Examine visible clues',phrase:'A generic office sign',detail:'A sign may appear in more than one location.'},
  {heading:'Reach a bounded conclusion',phrase:'Location not verified',detail:'Independent geolocation evidence is needed.'}
 ],result:'The image alone does not establish its geographic location.',takeaway:'Inspect the Meridian image and simulated reverse-image results before making your finding.'},
 domain:{title:'Interpret a synthetic DNS record safely',case:'harbourlines.example has A record 198.51.100.27 and a privacy-protected registrant.',steps:[
  {heading:'Identify the DNS answer',phrase:'A → 198.51.100.27',detail:'The address is documentation-only, not a real target.'},
  {heading:'Read the registration record',phrase:'Registrant: privacy protected',detail:'No person is identified by the synthetic registration output.'},
  {heading:'Avoid over-attribution',phrase:'IP ≠ verified human owner',detail:'Shared infrastructure cannot conclusively establish control.'}
 ],result:'A domain-to-IP relationship does not prove who owns or operates it.',takeaway:'Now interpret the Meridian domain record.'},
 hash:{title:'Recognise why a tiny edit changes a hash',case:'Two synthetic note strings differ by one character.',steps:[
  {heading:'Identify the original bytes',phrase:'Note: Evidence A',detail:'Exact characters and encoding form the input.'},
  {heading:'Change the source text',phrase:'Note: Evidence B',detail:'The final letter differs, so the byte sequence is different.'},
  {heading:'Compare SHA-256 results',phrase:'Two different digests',detail:'Hashes assess integrity of the captured bytes, not truthfulness.'}
 ],result:'Different bytes → different SHA-256 digests (under normal conditions).',takeaway:'Now calculate digests for your own sample note.'},
 custody:{title:'Write a meaningful exhibit entry',case:'A fictional page at harbourlines.example was captured during a training investigation.',steps:[
  {heading:'Identify what was collected',phrase:'Captured a fictional web-page snapshot',detail:'Document the source URL and the specific material obtained.'},
  {heading:'Record when and how',phrase:'Recorded collector and UTC capture time',detail:'Keep a chronology and preserve the original where possible.'},
  {heading:'Limit the finding',phrase:'Content does not verify beneficial ownership',detail:'Describe evidence accurately without asserting what it cannot prove.'}
 ],result:'Source URL + capture time + exhibit identifier + source limitations',takeaway:'Build a separate exhibit entry for the fictional Meridian registry capture.'}
} as const;

type ExampleId=keyof typeof examples;
export default function OsintWorkedExample({lessonId}:{lessonId:ExampleId}){
 const [step,setStep]=useState(0);
 const example=examples[lessonId];
 const atEnd=step===example.steps.length;
 return <section className="osintworked" aria-label="Worked example before practice">
  <div className="osintworkedtop"><div><span className="eyebrow">03 · WATCH A WORKED EXAMPLE</span><h3>{example.title}</h3></div><span className="osintworkedcounter">{atEnd?'Example complete':`Step ${step+1} of ${example.steps.length}`}</span></div>
  <p className="osintworkedcase"><strong>Example scenario:</strong> {example.case}</p>
  <div className="osintworkedsteps" aria-live="polite">
   {example.steps.slice(0,atEnd?example.steps.length:step+1).map((item,i)=><div key={i} className={'osintworkedstep'+(i===step?' current':'')}><span>{i+1}</span><div><strong>{item.heading}</strong><div className="osintworkedphrase">{item.phrase}</div><p>{item.detail}</p></div></div>)}
  </div>
  {atEnd?<div className="osintworkedresult"><strong>Completed example</strong><p>{example.result}</p><small>{example.takeaway}</small></div>:null}
  <div className="osintworkedcontrols"><button type="button" className="primary" onClick={()=>setStep(v=>v===example.steps.length?0:v+1)}>{atEnd?'↺ Replay example':'Reveal next step →'}</button>{step>0&&!atEnd?<button type="button" className="secondary" onClick={()=>setStep(v=>v-1)}>← Previous step</button>:null}</div>
  <p className="osintworkedfoot">The example uses different fictional records from your practice task. You will apply the same method independently below.</p>
 </section>;
}
