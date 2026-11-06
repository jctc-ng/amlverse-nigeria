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

## Arcade redesign (v0.5)
The beginner-friendly `src/GameArcade.tsx` replaces the previous RiskLab 2.0 and Interagency Risk Room screens (their older source files remain in the repository for reference but are not loaded).
- **RiskLab Arcade:** six fictional clues are placed into Threat, Weakness or Protection boxes.
- **Teamwork Arcade:** eight fictional mission cards are matched with FIU analyst, investigator, supervisor or prosecutor roles.
- Supports pointer drag-and-drop **and** accessible tap-a-card-then-tap-a-box controls on mobile.
- Immediate coaching on correct and incorrect placements, a short final decision, restart and best score in localStorage.
- No sign-in or backend; no official institutional training or risk score. Do not enter confidential information.

Future scope: optional illustrated tutorials, keyboard-driven placement, animated transitions, localization and subject-matter reviewed curricular content.

## Mutual Evaluation Arena 2.0 — v0.6
A beginner-focused, two-stage fictional evaluation game:
1. Sort six document cards by drag-and-drop or tap-to-place into **Technical compliance**, **Effectiveness**, and **Needs evidence**.
2. Answer three simulated assessor interview questions, with explanations after each decision.
3. Review a completion score and retry to improve the locally stored best result.

The game teaches the distinction between legal/institutional measures and verified results; it is **not** an official FATF/GIABA assessment, rating system or certification. The lesson content and simulated evidence should undergo institutional expert review before use for formal training. Never upload actual STRs, case files, or restricted FIU materials to this public project.

Official orientation: [FATF Mutual Evaluations](https://www.fatf-gafi.org/en/topics/mutual-evaluations.html).

## Egmont Exchange 2.0 (v0.7)
Interactive fictional FIU cooperation mission in `src/EgmontExchange.tsx`:
- Round one: drag or tap six action cards into **Safe to proceed**, **Check permission**, or **Stop & protect**.
- Round two: three decision challenges on approved purpose, onward dissemination, consent, security and confidentiality.
- Instant coaching, score, replay and locally saved personal best.
- Source: [Egmont Principles for Information Exchange Between FIUs, May 2022 revision](https://egmontgroup.org/wp-content/uploads/2013/10/2.-Principles-Information-Exchange-Revised-May-2022.pdf), particularly Principles 26, 28–36.
- Important nuance: Principle 26 provides for assumed consent for dissemination to competent authorities **identified in the original request**, unless explicitly refused. Other uses/dissemination beyond the originally approved scope are governed by Principle 32 and may require prior authorisation.
This public prototype never sends real FIU requests. Institutional operational rules, applicable law and any restricted Egmont requirements take precedence.

## Guided Game Tutorials (v0.8)
All four beginner arcade games (RiskLab, Teamwork, Mutual Evaluation and Egmont Exchange) now open a reusable, animated, three-step onboarding walkthrough when first visited:
1. Select a clue card (tap, or drag on a computer).
2. Choose the correct destination box.
3. Read feedback and unlock the mission challenge.

Each walkthrough has Back, Next, Skip and Play controls, respects reduced-motion preferences, and can be replayed through **How to play**. Completion preferences are stored locally in the browser; no accounts, tracking, or personal data collection are added. The walkthrough uses illustrative sample clues, not actual case information.
