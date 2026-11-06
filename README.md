# AMLVERSE Nigeria

Gamified AML/CFT/CPF learning and simulation platform prototype for financial intelligence practitioners and partner agencies.

**Status:** Educational proof of concept, not an official NFIU publication or accreditation.

## Features
- Six learning worlds: FATF Quest, RiskLab, Mutual Evaluation Arena, Egmont Exchange, Typology Detective, Nigeria Compliance
- Interactive scenario missions with instant explanatory feedback, XP and progress
- Public-source reference links to FATF, Egmont and GIABA
- Responsive React + TypeScript app with GitHub Pages deployment

## Run locally
```bash
npm install
npm run dev
```
Build with `npm run build`.

## Deployment
GitHub Pages uses the workflow in `.github/workflows/deploy.yml`. In repository Settings → Pages → Build and deployment, select **GitHub Actions**.

## Security and content governance
All cases and data in this prototype are fictional. Do not upload STRs, real case material, personal data or restricted Egmont documents to this public repository. Learning content requires expert review and version-specific citations before institutional rollout. NFIU/FATF/Egmont marks must not be represented as official endorsements.

## Roadmap
- Learning modules and multi-step missions
- Source-controlled, reviewer-approved standards library
- Role-specific learning paths
- Instructors, evaluations, badges and accessible mobile UX
- Authenticated private deployment for institutional usage

## FATF Quest Chapter 1 (v0.2)

Ten guided lessons (Recommendations 1–10), with 20 interactive practice questions, immediate feedback in Learn & Play mode, a separate assessment mode, best scores and progress stored locally in the browser.

### Source and editorial control
- Primary standard: [FATF Recommendations, as amended June 2026](https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html).
- Content in `src/quest.ts` is educational paraphrase, not a reproduction or official FATF interpretation.
- Every scenario is fictional and must be reviewed before institutional rollout.
- Assessment results are browser-local, not synchronised across devices or appropriate for official certifications.
- Review changes in FATF Standards, Interpretive Notes and Nigerian legislation with designated subject-matter experts before each training release.

### Planned improvements
- Second question set per lesson and scenario branching
- Instructor-reviewed answer rationales at the paragraph/criterion level
- Accessible matching and sorting interactions
- 40-Recommendation curriculum, version tracking and optional approved learning management backend

## RiskLab 2.0 (v0.3)

An interactive, synthetic sectoral-risk simulator:
- Three fictional sectors: cross-border payments, property investment and charitable transfers.
- Clickable evidence collection; threats, vulnerabilities, context and existing controls.
- Adjustable threat, vulnerability and consequence dimensions; illustrated 5×5 heatmap.
- Proportionate control-selection challenge and written justification.
- Explanation-rich debrief, suggested mitigations and best-score saving in browser storage.

### Methodology caveat
The risk rating and training score in this game are **illustrative**, not a FATF-approved, national, or NFIU scoring formula. An actual national or sectoral assessment requires an agreed methodology, data quality review, contextual analysis, uncertainty disclosure and institutional validation. The module's scenarios do not concern actual entities.

Primary learning source: [FATF Money Laundering National Risk Assessment Guidance](https://www.fatf-gafi.org/en/publications/Methodsandtrends/Money-Laundering-National-Risk-Assessment-Guidance.html).

## Interagency Risk Room (v0.4)

Single-device facilitated simulation of a fictional cross-border payment sector. A learner or training group rotates through four roles: FIU, law enforcement, supervisor and prosecutor. Each role reviews separate evidence and records a 1–5 educational judgement, evidence-confidence score and justification.

After all four roles are completed, the group can compare positions, record an integrated consensus, and download or copy a plain-text exercise report. Draft role responses persist only in browser localStorage; the consensus is exported in the final report and is not remotely saved.

**Limitations:** This is not real-time collaboration or an official Nigerian National Risk Assessment. The different role ratings capture distinct considerations and must not be mathematically combined as if they measured the same risk factor. Use synthetic data only. Training evidence and ratings require expert review before NFIU or interagency institutional use.
