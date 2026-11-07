import type {CourseKey} from './progress';
export type DecisionStage={question:string;options:[string,string,string];correct:number;why:string};
export type DecisionFile={title:string;analogy:string;brief:string;evidence:[string,string,string];stages:DecisionStage[]};
export const decisionFiles:Record<CourseKey,DecisionFile>={
 "risk": {
  "title": "Risk Committee: New Payment Product",
  "analogy": "A risk assessment resembles diagnosing a patient: a symptom prompts tests, and treatment depends on evidence rather than suspicion alone.",
  "brief": "A fictional instant-payment provider launches rapid outbound transfers. Ownership information is incomplete and the monitoring rule has not been validated.",
  "evidence": [
   "Customer profile: expected domestic merchant sales; significant cross-border payouts observed.",
   "CDD record: corporate beneficial owner unverified.",
   "Control record: alert review queue exists, but operational testing absent."
  ],
  "stages": [
   {
    "question": "Select the most defensible initial risk finding.",
    "options": [
     "Elevated exposure with CDD and control-effectiveness gaps",
     "Every customer is laundering money",
     "The product is risk-free because monitoring exists"
    ],
    "correct": 0,
    "why": "The evidence identifies control gaps and exposure, not criminal guilt."
   },
   {
    "question": "Choose the next assessment action.",
    "options": [
     "Sample alerts and verify ownership records",
     "Close all alerts without review",
     "Publicly list alleged suspicious customers"
    ],
    "correct": 0,
    "why": "Testing and corroboration provide a defensible basis for residual risk."
   },
   {
    "question": "Choose the committee recommendation.",
    "options": [
     "Apply proportionate enhanced controls and a dated reassessment",
     "Declare residual risk zero immediately",
     "Ban all international customers permanently"
    ],
    "correct": 0,
    "why": "Controls should reflect verified risk and be reviewed for operating effectiveness."
   }
  ]
 },
 "team": {
  "title": "Joint Investigation: Assign Competent Roles",
  "analogy": "A coordinated response resembles an emergency team: intelligence analysts, investigators and prosecutors contribute differently.",
  "brief": "A fictional fraud network may have transferred funds across several accounts. The FIU identifies a pattern, investigators seek corroboration and prosecutors will assess evidence.",
  "evidence": [
   "FIU product: suspicious flow analysis; identity link unverified.",
   "Investigation request: requires lawful account records and witness corroboration.",
   "Prosecution note: proof and admissibility must be assessed independently."
  ],
  "stages": [
   {
    "question": "Which institution should characterise and lawfully disseminate the financial intelligence?",
    "options": [
     "FIU acting within its statutory mandate",
     "A trial court as routine transaction analyst",
     "An unrelated media outlet"
    ],
    "correct": 0,
    "why": "An FIU analyses financial information and shares it with competent recipients."
   },
   {
    "question": "Who should obtain corroborating evidence using relevant powers?",
    "options": [
     "Competent investigators via authorised procedures",
     "The social-media team",
     "Any private citizen"
    ],
    "correct": 0,
    "why": "Law-enforcement investigators pursue evidence within their lawful mandate."
   },
   {
    "question": "What must prosecutors evaluate before a court case?",
    "options": [
     "Admissibility, sufficiency and applicable legal requirements",
     "Only intelligence suspicion without corroboration",
     "Online popularity of the allegation"
    ],
    "correct": 0,
    "why": "Intelligence and admissible evidence are not interchangeable."
   }
  ]
 },
 "evaluation": {
  "title": "Mutual Evaluation: Framework versus Outcomes",
  "analogy": "A safety rulebook is not the same as a functioning safety system: inspectors test both the policy and real outcomes.",
  "brief": "A fictional jurisdiction has enacted a CDD law and produced 90 suspicious reports, but has limited documentation of the reports' investigative use.",
  "evidence": [
   "Technical file: CDD obligations are included in legislation.",
   "Operational statistic: 90 suspicious reports received.",
   "Outcome evidence: no verified examples of intelligence advancing an investigation were provided."
  ],
  "stages": [
   {
    "question": "What does the CDD law primarily demonstrate?",
    "options": [
     "Technical compliance arrangements",
     "Proven effectiveness in every case",
     "A completed criminal prosecution"
    ],
    "correct": 0,
    "why": "Legal provisions contribute to technical-compliance assessment."
   },
   {
    "question": "What does the raw count of 90 reports establish?",
    "options": [
     "Activity volume, not necessarily effective use",
     "A fully effective AML system",
     "A minimum conviction count"
    ],
    "correct": 0,
    "why": "Output counts alone do not show that outcomes were achieved."
   },
   {
    "question": "Which evaluation evidence should be requested?",
    "options": [
     "Verified case examples and operational outcome records",
     "Only a new policy logo",
     "Another unverified success statement"
    ],
    "correct": 0,
    "why": "Assessors require reliable evidence of actual implementation and results."
   }
  ]
 },
 "egmont": {
  "title": "FIU Exchange: Purpose and Consent Decision",
  "analogy": "A protected intelligence exchange is like a sealed professional referral: the reason, recipient, and permission to forward matter.",
  "brief": "A foreign FIU shares restricted information for a defined analytical purpose. A domestic investigator requests onward disclosure for a different case.",
  "evidence": [
   "Originator message: use restricted to original investigation.",
   "Domestic request: separate purpose, no consent attached.",
   "Channel: approved encrypted FIU system available."
  ],
  "stages": [
   {
    "question": "How should the domestic request be treated?",
    "options": [
     "Check restrictions and legal authority before disclosure",
     "Forward it automatically",
     "Publish it for transparency"
    ],
    "correct": 0,
    "why": "Use restrictions must be considered even when the requesting agency is competent."
   },
   {
    "question": "What should happen before repurposing foreign-FIU material?",
    "options": [
     "Seek any required originator consent through authorised channels",
     "Send it using personal email",
     "Remove the originator warning"
    ],
    "correct": 0,
    "why": "Originator controls and lawful purpose govern onward use."
   },
   {
    "question": "What must the FIU record after an authorised exchange?",
    "options": [
     "Purpose, recipient, basis and secure dissemination log",
     "Only a screenshot of the email",
     "Nothing because all sharing is unlimited"
    ],
    "correct": 0,
    "why": "Documented controls support accountability and information security."
   }
  ]
 },
 "typologies": {
  "title": "Typology Investigation: Rapid Movement Network",
  "analogy": "Smoke detectors are indicators, not judicial findings; a pattern prompts a search for the source.",
  "brief": "A small business receives numerous unrelated credits followed by rapid transfers. Some invoices are supplied, but several transactions remain unexplained.",
  "evidence": [
   "Transactions: 32 unrelated inbound credits in one day.",
   "Outflows: 88% moved onward within two hours.",
   "Invoices: verified for only six credits; remaining explanations pending."
  ],
  "stages": [
   {
    "question": "Which conclusion is supported?",
    "options": [
     "The activity pattern warrants contextual investigation",
     "All counterparties are proven criminals",
     "Rapid transfers are always harmless"
    ],
    "correct": 0,
    "why": "A pattern can be suspicious without proving illicit purpose."
   },
   {
    "question": "How should the invoices be handled?",
    "options": [
     "Verify coverage and investigate the unexplained remainder",
     "Assume invoices explain every credit",
     "Ignore all customer-provided evidence"
    ],
    "correct": 0,
    "why": "Corroboration should test both supportive and adverse explanations."
   },
   {
    "question": "Which report wording is defensible?",
    "options": [
     "Rapid movement and incomplete invoice coverage create a qualified concern",
     "The business has conclusively committed laundering",
     "Every transfer is a criminal act"
    ],
    "correct": 0,
    "why": "Observations and qualified inference should be separated."
   }
  ]
 },
 "nigeria": {
  "title": "Nigeria Compliance: Confidential Reporting Review",
  "analogy": "An STR is a confidential safety alert: it directs professional attention, rather than announcing someone has been found guilty.",
  "brief": "A fictional Nigerian regulated entity flags a customer after unusually large transactions. Staff debate which authority receives the STR and whether they should alert the customer.",
  "evidence": [
   "Monitoring: unexplained transfer pattern relative to verified profile.",
   "Review: credible reasonable suspicion remains after contextual analysis.",
   "Control: internal policy requires confidential escalation under applicable law."
  ],
  "stages": [
   {
    "question": "What should the entity do with a documented suspicion?",
    "options": [
     "Follow applicable STR reporting requirements through authorised channels",
     "Post the case to social media",
     "Wait for a criminal conviction before any internal assessment"
    ],
    "correct": 0,
    "why": "Confidential reporting obligations are distinct from criminal adjudication."
   },
   {
    "question": "What is the NFIU's relevant role?",
    "options": [
     "Receive and analyse disclosures and disseminate intelligence lawfully",
     "Deliver all criminal verdicts",
     "Replace the bank's customer due diligence"
    ],
    "correct": 0,
    "why": "The NFIU serves a financial intelligence function, not a court function."
   },
   {
    "question": "How should staff treat customer disclosure of a confidential report?",
    "options": [
     "Apply confidentiality and applicable anti-tipping-off safeguards",
     "Publicly identify the customer as guilty",
     "Send the report to unrelated contacts"
    ],
    "correct": 0,
    "why": "The handling of confidential suspicious reports requires legally appropriate controls."
   }
  ]
 },
 "virtualassets": {
  "title": "Exchange Deposit: Find the Attribution Gap",
  "analogy": "A parcel reaching a warehouse shows arrival at a building, not the tenant who received it.",
  "brief": "A synthetic ledger records A → B (10 SIM), B → C (7 SIM), and C → EX-D (6 SIM). EX-D is labelled as an exchange deposit by one vendor.",
  "evidence": [
   "Ledger: three distinct confirmed transfers in sequence.",
   "Graph: B → SIDE-E branch of 2 SIM is unrelated to EX-D.",
   "Attribution: exchange label uncorroborated; customer name unknown."
  ],
  "stages": [
   {
    "question": "How much is shown reaching EX-D on the recorded final hop?",
    "options": [
     "6 SIM",
     "10 SIM",
     "9 SIM"
    ],
    "correct": 0,
    "why": "The last observed transfer is six units; upstream values should not be double counted."
   },
   {
    "question": "What does an unverified exchange label establish?",
    "options": [
     "A service-related lead requiring confirmation",
     "A verified customer identity",
     "Definitive criminal ownership"
    ],
    "correct": 0,
    "why": "Service-level labels and customer identity require different evidence."
   },
   {
    "question": "Which follow-up is appropriate?",
    "options": [
     "Preserve hashes and request corroboration under lawful authority",
     "Publish a suspected customer name",
     "Allocate all branch values to EX-D"
    ],
    "correct": 0,
    "why": "Reproducibility, reconciliation and lawful requests underpin defensible tracing."
   }
  ]
 },
 "advancedtrace": {
  "title": "Multi-Chain Review: Verify a Bridge Route",
  "analogy": "A departure stamp does not prove a passenger reached another airport: arrival evidence is independently required.",
  "brief": "A Chain-X deposit to BRIDGE-X is confirmed. A vendor says a matching Chain-Y mint reached WAL-Y, but no Chain-Y transaction or bridge log is available.",
  "evidence": [
   "Confirmed: X-TX-01 shows four tokens deposited to BRIDGE-X.",
   "Unverified: Y-MINT-02 is a vendor claim, with no chain record provided.",
   "Attribution: WAL-Y beneficial controller not independently established."
  ],
  "stages": [
   {
    "question": "What may be stated as an observed fact?",
    "options": [
     "Four units were deposited on Chain-X",
     "The Chain-Y mint is fully verified",
     "WAL-Y is a known criminal"
    ],
    "correct": 0,
    "why": "Only the source-chain transfer has reliable evidence in the provided synthetic file."
   },
   {
    "question": "Which evidence would test the asserted bridge completion?",
    "options": [
     "Corresponding Chain-Y transaction and bridge events",
     "An unrelated price chart",
     "A social-media username match alone"
    ],
    "correct": 0,
    "why": "Cross-chain correlation needs independent destination evidence and bridge mechanics."
   },
   {
    "question": "How should the analytical inference be written?",
    "options": [
     "Cross-chain linkage is a lead, with destination and ownership unverified",
     "Both wallets are indisputably controlled by one person",
     "Bridge activity proves laundering"
    ],
    "correct": 0,
    "why": "Evidence quality and explicit uncertainty are essential."
   }
  ]
 },
 "reportwriting": {
  "title": "Intelligence Note: Build a Defensible Conclusion",
  "analogy": "Like scientific reporting, raw measurements, interpretations and proposed tests belong in different sections.",
  "brief": "A fictional account receives five credits totalling ₦4.2m, then makes a ₦3.5m debit to an entity whose beneficial owner is unknown.",
  "evidence": [
   "Account statement: five dated credits and one subsequent debit.",
   "Entity registry: ownership documentation unavailable.",
   "Analytical lead: transaction timing appears unusual compared with the declared business."
  ],
  "stages": [
   {
    "question": "Which sentence belongs in FINDINGS?",
    "options": [
     "Records show five credits totalling ₦4.2m and a ₦3.5m debit",
     "The account holder is guilty of money laundering",
     "The unknown owner controls the sender"
    ],
    "correct": 0,
    "why": "Supported entries and amounts are factual findings."
   },
   {
    "question": "Which sentence is a qualified INFERENCE?",
    "options": [
     "The timing may warrant further investigation; purpose remains unverified",
     "Every transaction was criminal",
     "All credited funds were stolen"
    ],
    "correct": 0,
    "why": "Infer cautiously, with a stated basis and limitations."
   },
   {
    "question": "Which recommendation is defensible?",
    "options": [
     "Seek relevant ownership and transfer records through authorised procedures",
     "Publish unverified allegations",
     "Remove the evidence gaps from the report"
    ],
    "correct": 0,
    "why": "Scope recommendations to genuine gaps and lawful investigative authority."
   }
  ]
 }
};
