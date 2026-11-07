import type {CourseKey} from './progress';
export type InteractionCase={title:string;analogy:string;clues:[string,string,string];targets:[string,string,string];correct:[string,string,string];instruction:string};
export const interactiveWorldCases:Record<CourseKey,InteractionCase[]>={
 "risk": [
  {
   "title": "Threat–vulnerability–control",
   "analogy": "Like identifying a fire hazard, an open door and the fire alarm, distinguish sources of harm from weaknesses and safeguards.",
   "clues": [
    "A fraud network attempts to use accounts",
    "The firm skips beneficial ownership checks",
    "An analyst tests transaction monitoring alerts"
   ],
   "targets": [
    "Threat",
    "Vulnerability",
    "Control"
   ],
   "correct": [
    "Threat",
    "Vulnerability",
    "Control"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Rate a customer-file concern",
   "analogy": "The company has unusual incoming funds, incomplete identity records and a documented review process. Inspect each clue rather than calling the customer guilty.",
   "clues": [
    "Observed payments inconsistent with the declared business",
    "Beneficial owner has not been verified",
    "Monitoring alerts were reviewed and recorded"
   ],
   "targets": [
    "Observed indicator",
    "CDD gap",
    "Risk mitigation evidence"
   ],
   "correct": [
    "Observed indicator",
    "CDD gap",
    "Risk mitigation evidence"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Build a risk-response sequence",
   "analogy": "Like checking a leaking pipe before repairing it: identify exposure, verify records, then apply and test controls.",
   "clues": [
    "Identify the unusual transfer pattern",
    "Verify source records and customer explanations",
    "Document proportionate controls and review"
   ],
   "targets": [
    "1 · Identify",
    "2 · Corroborate",
    "3 · Respond"
   ],
   "correct": [
    "1 · Identify",
    "2 · Corroborate",
    "3 · Respond"
   ],
   "instruction": "Investigate the evidence cards in the order you would perform the actions."
  }
 ],
 "team": [
  {
   "title": "Route tasks to the proper agency function",
   "analogy": "Like a hospital team, different specialists have distinct roles even when treating one case together.",
   "clues": [
    "Analyse financial disclosures and disseminate authorised intelligence",
    "Examine whether a regulated bank follows AML rules",
    "Present an evidence-supported criminal case in court"
   ],
   "targets": [
    "Financial Intelligence Unit",
    "Financial supervisor",
    "Prosecutor"
   ],
   "correct": [
    "Financial Intelligence Unit",
    "Financial supervisor",
    "Prosecutor"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Separate intelligence, evidence and judgment",
   "analogy": "Like a newsroom, a lead, a verified record and a final published conclusion are different stages.",
   "clues": [
    "A financial intelligence pattern indicates a possible link",
    "Certified transaction records are lawfully obtained",
    "A court reaches a verdict after proceedings"
   ],
   "targets": [
    "Intelligence lead",
    "Potential evidentiary material",
    "Judicial finding"
   ],
   "correct": [
    "Intelligence lead",
    "Potential evidentiary material",
    "Judicial finding"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Coordinate the lawful response",
   "analogy": "Map the steps required for proportionate cooperation.",
   "clues": [
    "FIU analyses relevant reports",
    "Investigators pursue corroboration under their authority",
    "Prosecutors assess admissible case material"
   ],
   "targets": [
    "1 · Analyse",
    "2 · Investigate",
    "3 · Review for prosecution"
   ],
   "correct": [
    "1 · Analyse",
    "2 · Investigate",
    "3 · Review for prosecution"
   ],
   "instruction": "Investigate the evidence cards in the order you would perform the actions."
  }
 ],
 "evaluation": [
  {
   "title": "Technical compliance versus effectiveness",
   "analogy": "A rulebook is not the same as a well-played match. Sort written arrangements from demonstrated operational outcomes.",
   "clues": [
    "A law defines customer due diligence duties",
    "Records show disclosures informing investigations",
    "A regulation sets supervisory powers"
   ],
   "targets": [
    "Technical compliance",
    "Demonstrated effectiveness",
    "Technical compliance"
   ],
   "correct": [
    "Technical compliance",
    "Demonstrated effectiveness"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Assess evidence quality",
   "analogy": "Distinguish a claim, a policy and corroborated evidence of results.",
   "clues": [
    "An agency says its system works well without proof",
    "A documented operational case shows intelligence use",
    "A published policy establishes an obligation"
   ],
   "targets": [
    "Unsupported assertion",
    "Outcome evidence",
    "Formal framework"
   ],
   "correct": [
    "Unsupported assertion",
    "Outcome evidence",
    "Formal framework"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Structure an evaluation review",
   "analogy": "Plan the stages like an independent audit, from requirements to documented outcomes.",
   "clues": [
    "Identify the relevant FATF standards",
    "Check documented legal and institutional provisions",
    "Examine verified operational outcomes"
   ],
   "targets": [
    "1 · Identify standards",
    "2 · Review framework",
    "3 · Test outcomes"
   ],
   "correct": [
    "1 · Identify standards",
    "2 · Review framework",
    "3 · Test outcomes"
   ],
   "instruction": "Investigate the evidence cards in the order you would perform the actions."
  }
 ],
 "egmont": [
  {
   "title": "Choose appropriate information-sharing channels",
   "analogy": "Like a sealed diplomatic pouch, the recipient, purpose and protection all matter.",
   "clues": [
    "An FIU sends sensitive material via personal email",
    "A designated FIU contact uses an approved secure channel",
    "A request asks to republish restricted material"
   ],
   "targets": [
    "Stop: insecure channel",
    "Approved secure channel",
    "Seek consent / review restrictions"
   ],
   "correct": [
    "Stop: insecure channel",
    "Approved secure channel",
    "Seek consent / review restrictions"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Identify sharing safeguards",
   "analogy": "Determine which document represents authority, an operational restriction or a useful disclosure record.",
   "clues": [
    "A valid legal basis supports an exchange",
    "Originator limits onward disclosure",
    "A dated log records purpose and recipient"
   ],
   "targets": [
    "Legal authority",
    "Originator control",
    "Audit trail"
   ],
   "correct": [
    "Legal authority",
    "Originator control",
    "Audit trail"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Prepare an authorised FIU request",
   "analogy": "Use the proper order before transmitting sensitive intelligence.",
   "clues": [
    "Establish lawful purpose and competent recipient",
    "Check confidentiality and originator consent",
    "Share securely and record dissemination"
   ],
   "targets": [
    "1 · Verify basis",
    "2 · Verify controls",
    "3 · Transmit and log"
   ],
   "correct": [
    "1 · Verify basis",
    "2 · Verify controls",
    "3 · Transmit and log"
   ],
   "instruction": "Investigate the evidence cards in the order you would perform the actions."
  }
 ],
 "typologies": [
  {
   "title": "Detect transaction patterns without presuming guilt",
   "analogy": "Red flags are like smoke detectors: they call for inquiry, not an automatic verdict.",
   "clues": [
    "Many unrelated deposits followed by rapid withdrawals",
    "A customer supplies verifiable invoices explaining part of activity",
    "An anonymous allegation identifies a purported ring leader"
   ],
   "targets": [
    "Pattern indicator",
    "Evidence to verify",
    "Uncorroborated allegation"
   ],
   "correct": [
    "Pattern indicator",
    "Evidence to verify",
    "Uncorroborated allegation"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Sort the fictional case evidence",
   "analogy": "Separate ledger facts, analytical hypotheses and unresolved gaps.",
   "clues": [
    "A statement records five transfers on the same date",
    "The timing may indicate coordination",
    "Who ultimately controls the recipient address is unknown"
   ],
   "targets": [
    "Documented finding",
    "Qualified inference",
    "Information gap"
   ],
   "correct": [
    "Documented finding",
    "Qualified inference",
    "Information gap"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Build a typology investigation",
   "analogy": "Organise a defensible enquiry before escalation.",
   "clues": [
    "Record the observed transaction pattern",
    "Test customer context and alternative explanations",
    "Document confidence and lawful follow-up"
   ],
   "targets": [
    "1 · Observe",
    "2 · Corroborate",
    "3 · Report responsibly"
   ],
   "correct": [
    "1 · Observe",
    "2 · Corroborate",
    "3 · Report responsibly"
   ],
   "instruction": "Investigate the evidence cards in the order you would perform the actions."
  }
 ],
 "nigeria": [
  {
   "title": "Route Nigerian AML/CFT responsibilities",
   "analogy": "Separate FIU analysis, sector supervision and reporting-entity controls.",
   "clues": [
    "Receive and analyse suspicious financial reports",
    "Inspect AML controls of a regulated banking institution",
    "Verify a customer's beneficial owner"
   ],
   "targets": [
    "NFIU intelligence functions",
    "CBN sector supervision",
    "Reporting entity CDD"
   ],
   "correct": [
    "NFIU intelligence functions",
    "CBN sector supervision",
    "Reporting entity CDD"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Distinguish reporting channels and confidentiality",
   "analogy": "A confidential STR is not a public accusation.",
   "clues": [
    "A reporting entity sends a substantiated suspicious report through an authorised channel",
    "A journalist asks to publish the named subject",
    "A compliance team checks the current applicable reporting rule"
   ],
   "targets": [
    "Confidential reporting",
    "Do not disclose restricted material",
    "Verify applicable requirements"
   ],
   "correct": [
    "Confidential reporting",
    "Do not disclose restricted material",
    "Verify applicable requirements"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Complete a defensible compliance review",
   "analogy": "Like a quality assurance review, assess, verify and document before drawing conclusions.",
   "clues": [
    "Identify the regulatory obligation and supervisor",
    "Inspect actual controls and evidence",
    "Record gaps and proportionate remedial actions"
   ],
   "targets": [
    "1 · Identify obligation",
    "2 · Examine evidence",
    "3 · Recommend remediation"
   ],
   "correct": [
    "1 · Identify obligation",
    "2 · Examine evidence",
    "3 · Recommend remediation"
   ],
   "instruction": "Investigate the evidence cards in the order you would perform the actions."
  }
 ],
 "virtualassets": [
  {
   "title": "Identify blockchain observations and attribution gaps",
   "analogy": "A parcel delivery trail shows a route, not the personal identity of everyone who touched it.",
   "clues": [
    "A recorded hash documents a transfer between addresses",
    "A vendor tags the destination as an exchange deposit",
    "The exchange customer name is unavailable"
   ],
   "targets": [
    "Recorded chain fact",
    "Provisional service label",
    "Identity gap"
   ],
   "correct": [
    "Recorded chain fact",
    "Provisional service label",
    "Identity gap"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Account for branching flows",
   "analogy": "Avoid counting separate transaction hops as new wealth.",
   "clues": [
    "WAL-A sends 10 units to WAL-B",
    "WAL-B sends 6 units to WAL-C",
    "WAL-B separately sends 3 units to WAL-D"
   ],
   "targets": [
    "First recorded hop",
    "Main branch",
    "Separate branch"
   ],
   "correct": [
    "First recorded hop",
    "Main branch",
    "Separate branch"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Preserve a tracing case",
   "analogy": "Build a chain-specific investigative record before attributing a wallet.",
   "clues": [
    "Record network, token contract, hash and block",
    "Reconcile confirmed outputs and competing paths",
    "Describe attribution uncertainty and lawful next steps"
   ],
   "targets": [
    "1 · Capture provenance",
    "2 · Trace and reconcile",
    "3 · Qualify findings"
   ],
   "correct": [
    "1 · Capture provenance",
    "2 · Trace and reconcile",
    "3 · Qualify findings"
   ],
   "instruction": "Investigate the evidence cards in the order you would perform the actions."
  }
 ],
 "advancedtrace": [
  {
   "title": "Reconstruct the path to a deposit lead",
   "analogy": "Only the branch with a documented onward transfer supports a destination conclusion.",
   "clues": [
    "TX-01 sends 12 from A to B",
    "TX-02 sends 8 from B to C",
    "TX-04 sends 7 from C to EX-E"
   ],
   "targets": [
    "1 · Origin hop",
    "2 · Intermediate hop",
    "3 · Deposit hop"
   ],
   "correct": [
    "1 · Origin hop",
    "2 · Intermediate hop",
    "3 · Deposit hop"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Assess graph attribution confidence",
   "analogy": "Keep confirmed ledger edges distinct from third-party labels and unverified customer identities.",
   "clues": [
    "A confirmed hash links C to EX-E",
    "A vendor describes EX-E as a service deposit",
    "No account KYC record is yet available"
   ],
   "targets": [
    "Confirmed transaction",
    "Tentative service attribution",
    "Customer attribution gap"
   ],
   "correct": [
    "Confirmed transaction",
    "Tentative service attribution",
    "Customer attribution gap"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Package a lawful exchange enquiry",
   "analogy": "Trace and preserve first, then request records through proper authority.",
   "clues": [
    "Preserve hashes, chains, asset, times and sources",
    "Document service attribution method and uncertainty",
    "Prepare scoped authorised records request"
   ],
   "targets": [
    "1 · Preserve",
    "2 · Assess",
    "3 · Request lawfully"
   ],
   "correct": [
    "1 · Preserve",
    "2 · Assess",
    "3 · Request lawfully"
   ],
   "instruction": "Investigate the evidence cards in the order you would perform the actions."
  }
 ],
 "reportwriting": [
  {
   "title": "Place intelligence content in the right report section",
   "analogy": "An intelligence report is like a laboratory report: observations, interpretations and recommended tests are distinct.",
   "clues": [
    "Five bank credits appear in the supplied statement",
    "The payment timing may indicate coordination",
    "Request authorised counterparty records to test the hypothesis"
   ],
   "targets": [
    "FINDINGS",
    "INFERENCE",
    "RECOMMENDATION"
   ],
   "correct": [
    "FINDINGS",
    "INFERENCE",
    "RECOMMENDATION"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Separate corroboration and allegation",
   "analogy": "A name match is a lead, not proof that two accounts share an owner.",
   "clues": [
    "An authenticated transfer record shows ₦2m",
    "A social post alleges the account belongs to a suspect",
    "Provider account documentation has not been obtained"
   ],
   "targets": [
    "Corroborated record",
    "Unverified allegation",
    "Evidence gap"
   ],
   "correct": [
    "Corroborated record",
    "Unverified allegation",
    "Evidence gap"
   ],
   "instruction": "Select an evidence card, then assign it to the most defensible category."
  },
  {
   "title": "Assemble the intelligence note",
   "analogy": "Follow an evidence-driven reporting sequence without reversing facts and interpretation.",
   "clues": [
    "Summarise case scope and principal limitations",
    "Present dated transactions and source references",
    "State qualified inference and lawful follow-up"
   ],
   "targets": [
    "1 · ABSTRACT",
    "2 · FINDINGS",
    "3 · INFERENCE / next steps"
   ],
   "correct": [
    "1 · ABSTRACT",
    "2 · FINDINGS",
    "3 · INFERENCE / next steps"
   ],
   "instruction": "Investigate the evidence cards in the order you would perform the actions."
  }
 ]
};
