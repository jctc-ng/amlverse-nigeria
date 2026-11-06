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

## Learn before you play — v0.9

All four beginner arcade worlds now open an educational **Learning Room** before gameplay:
- RiskLab: threat, vulnerability, and preventive/detective controls.
- Teamwork: FIU analysts, investigators, supervisors, prosecutors, and lawful collaboration.
- Mutual Evaluation: what evaluations assess; technical compliance versus demonstrated effectiveness.
- Egmont Exchange: international FIU cooperation, purpose/consent, and confidentiality/security.

Each Learning Room has three brief illustrated-by-example topics, navigation between lessons, one multiple-choice understanding check with explanatory feedback, a source link to FATF/Egmont material, and a direct **Start the game** option. The brief practice check is non-blocking: players can practise as much as they wish or move to the game at their own pace. Games retain their optional animated how-to-play onboarding.

This is explanatory, fictional educational content, **not official institutional training or professional legal advice**. Content should be peer-reviewed and versioned against current FATF/Egmont standards before formal rollout.

## Interactive stage navigation and mini tutorial — v0.10
The three visible stages **① Learn**, **② Quick check**, and **③ Play** are now clickable navigation tabs in every Knowledge Room. Learn shows the short lessons, Quick check presents the practice question and feedback, and Play provides a short **hands-on tutorial** before the actual arcade game. The learner selects a sample clue, taps the correct category, sees coaching feedback, then launches the game. A skip option is available. The earlier in-game **How to play** help button remains available for replaying instructions. No user data is sent to a backend.

## Typology Detective — v0.11
A new evidence-based financial intelligence mission, **Operation Red Flag**, added to the Typology Detective learning world.

- Learning Room: three short lessons on typologies, red flags versus proof, contextual information, and lawful analytical escalation.
- Quick Check: one non-blocking knowledge check with detailed feedback.
- Hands-on Tutorial: select a sample clue and place it in a Red Flag box before the game.
- Game Round 1: sort six synthetic evidence cards among **Red flag**, **Check context**, and **Safeguard** with drag-and-drop or tap-to-place controls.
- Game Round 2: three branching-style analyst decisions with immediate feedback about uncertainty, alternative explanations and lawful procedures.
- Best-score storage on the local device; no account, backend or real data.

Important: transaction alerts are indicators requiring proportionate investigation, not proof of guilt. Never enter real account numbers, STRs, customer records, FIU intelligence or restricted case data into this public educational project.

## Nigeria Compliance Challenge 2.0 — v0.12
This new **Operation Compliance Shield** training module follows the full **Learn → Quick Check → Tutorial → Play** journey.

- Three beginner lessons: NFIU Act 2018, Money Laundering (Prevention and Prohibition) Act 2022, Terrorism (Prevention and Prohibition) Act 2022; reporting and analysis; sector supervision and controls.
- Quick Check: confidential suspicious transaction reporting and why suspicion is different from proof of guilt.
- Hands-on tutorial: place a supervisory work order on the correct desk.
- Game Round 1: sort six synthetic work orders into **NFIU / Intelligence**, **Sector supervision**, and **Entity controls**, using tap-to-place or desktop drag-and-drop.
- Game Round 2: three fictional decisions on reporting, DNFBP supervision, and responsible intelligence dissemination.
- Instant explanations, scores, replay, and locally stored personal best. No backend or real data.

### Primary official learning references
- [NFIU laws and regulations](https://www.nfiu.gov.ng/LawsAndRegulations)
- [NFIU suspicious transaction reporting FAQs](https://www.nfiu.gov.ng/Faqs)
- [SCUML laws and regulations](https://scuml.efcc.gov.ng/laws-regulations/)
- [Nigeria Sanctions Committee regulations](https://nigsac.gov.ng/Regulations)

Educational simplified examples only. Legal duties are sector-specific and subject to change. Verify laws and regulatory guidance before institutional use.

## My Progress dashboard — v0.13
The academy now includes a **My Progress** view with:
- all six beginner arcade worlds, explored lessons (0–3), passed Quick Checks, saved best game scores and per-world completion;
- existing FATF Quest chapter progress and previously saved arcade results (without clearing any prior results);
- a learning-level indicator, overall completion percentage and six informal achievement badges;
- links to resume each learning world and FATF Quest, plus a personal CSV export;
- browser-only storage: no authentication, server sync, leaderboard, or user profile submission.

Lesson visits and successful understanding checks are recorded from v0.13 onward. Historical lesson visits cannot be reconstructed, while historical scores that were already stored continue to appear. Badges are educational motivators, not certifications or institutional grades.

## Quick Check progress clarification — v0.13.1
A world’s completion measure is **three lessons explored + one correctly answered and submitted Quick Check + one completed game = five milestones**. Game scores do not imply that a separate Quick Check was completed. The Quick Check now visibly confirms its saved status, and My Progress distinguishes an **unrecorded** check from a known failed result. Historical Quick Check attempts before v0.13 were not stored, so learners must submit the correct answer in the current version to record a pass. Browser-local storage is used; no previous scores are erased.

## World Champion Completion Rewards — v0.14
A major celebration is displayed when a player has **explored all three lessons, passed the independent Quick Check, and completed the game** in any of the six arcade worlds. It works whether the game or the Quick Check is the last milestone.

- Full-screen, dismissible congratulations modal with animated confetti and a cheerful “BOOM! You did it!” message.
- A large interactive **🎁 gift** that opens to reveal a **🏅 World Champion** badge for that learning world.
- Respects reduced-motion accessibility preferences and supports keyboard Escape to dismiss.
- Awards are browser-local and appear only once per world, so normal repeated visits and game replays do not constantly interrupt players.
- The My Progress dashboard marks claimed world gifts and includes a World Champion achievement.

The celebration is a motivational learning feature, **not a formal training certificate**. As before, no real case data or sensitive information is used.

## Virtual Asset Investigation Academy — v0.15
The new **Operation Chain Trace** beginner learning world includes:
- Three plain-language lessons on addresses and transaction hashes; tracing synthetic flows and virtual asset service provider touchpoints; red flags, uncertainty and lawful investigative follow-up.
- A scored understanding check plus the established short interactive tutorial.
- A visual, fictional route: WAL-A → WAL-B → WAL-C with synthetic TX-A1 and TX-B2 references (not real identifiers).
- Six drag-or-tap evidence cards classified as **On-chain record**, **Exchange lead**, or **Interpret carefully**, each with explanatory feedback.
- Three analyst decisions about address attribution, provider records and privacy-service labels.
- Locally saved best result, **My Progress** milestones, and the celebratory **World Champion gift** when all five milestones are completed.

Official references: [FATF — Virtual Assets](https://www.fatf-gafi.org/en/topics/virtual-assets.html) and [FATF — Virtual Asset Red Flag Indicators](https://www.fatf-gafi.org/en/publications/Methodsandtrends/Virtual-assets-red-flag-indicators.html).

All route identifiers, amounts and characters are synthetic. This public lesson does **not** perform live tracing, submit information to any exchange, or determine who owns a wallet. No sensitive FIU or investigative data should be entered. Addresses, transaction identifiers, exchange labels and real-world attribution all require correct chain context and independent verification before use in an actual case.

## Advanced Cryptocurrency Tracing Simulator — v0.16
**Operation Multi-Hop** is a new, fully fictional training world:
- Learning Room with three lessons about multi-hop transfers, confidence in exchange/wallet attribution, and intelligence report writing.
- Quick Check and interactive tutorial before entering the mission.
- A clickable transaction-edge selector alongside a six-node synthetic graph (A→B→C→E, branching B→D→F), with hop-specific feedback and graph highlighting.
- Confidence Lab: classify evidence support as high, medium or low; review why an unverified label cannot establish customer identity.
- Analyst decision challenges about exchange data requests, value accounting and qualified conclusions.
- Generates and downloads a **fictional .txt intelligence note** structured **ABSTRACT / FINDINGS / INFERENCE / RECOMMENDED NEXT STEPS / LIMITATIONS**.
- Integrated best scores, lesson progress and one-time World Champion gift when all milestones are complete.
- Reference: [FATF Virtual Assets](https://www.fatf-gafi.org/en/topics/virtual-assets.html).

**Privacy and limitations:** All wallet IDs, amounts, hashes and timestamps are synthetic. The scenario is intentionally simplified and does not perform blockchain API calls or customer identity checks. It is not a live investigative tool or admissible forensic report. Do not submit sensitive financial intelligence or personal details to the public prototype.

## Financial Intelligence Report Writing Lab — v0.17
**Operation Clear Findings** is a fictional case-based training world covering the distinction between substantiated findings, provisional intelligence leads, analytical inference and lawful follow-up.

- Learn: three plain-language lessons explaining abstracts, findings and inferences, plus recommendations and confidentiality.
- Quick Check: assess a correct statement about unverified allegations.
- Tutorial: practise sorting a documented transaction into its evidence category.
- Game Round 1: sort six synthetic cards among **Documented finding**, **Unverified lead**, and **Next-step recommendation**, using tap-to-place or desktop drag-and-drop.
- Game Round 2: choose defensible wording for an **ABSTRACT, FINDINGS, INFERENCE and RECOMMENDATIONS** section, with answer feedback.
- Final product: an intentionally fictional **.txt financial intelligence note** including limits and source caveats. This is a standard teaching model, not an automatically verified real-world case report.
- Records a personal-best score locally and supports the **World Champion** reward upon completing the three lessons, Quick Check and game.

The learning examples are synthetic and intentionally incomplete. Never paste real STRs, bank statements, identities or restricted intelligence into the public training app. 

## Academy Overview Refresh — v0.18
The front page now represents the current AMLVERSE offering rather than the original six prototype world cards and a growing list of repeated promotional banners.

- **Nine** playable, tracked learning worlds arranged in three tracks: Foundations & Standards; Financial Intelligence & Cooperation; Blockchain Investigation & Reporting.
- **FATF Quest R.1–R.10** remains independently accessible and gets its own progress snapshot and featured entry.
- The progress overview reads the same locally saved course results and FATF scores as **My Progress**. Each world is counted as finished only when all **three lessons, the passed Quick Check, and the completed game** are recorded.
- Cards show actual 0–5 milestones, lessons visited, Quick Check status, best saved score, and gift/achievement status where applicable.
- A recommended next mission prioritises a partially completed world before an unstarted one; all cards are linked to their actual learning rooms.
- An updated introduction, clean featured learning sections and official resource links replace the duplicated old home content.
- Duplicate sidebar quick-case links have been removed from the primary menu. Existing browser progress and previously saved scores remain intact.

No network account or data upload is introduced. Progress is stored on the same browser, not synchronised across devices.

## Integrated Capstone Challenge — v0.19
**Operation Integrity Shield** is an optional final practice mission combining skills from the existing nine learning worlds without changing their independent progress, gifts or scores.

- Six fictional case decisions covering risk assessment, multi-hop tracing, provisional exchange attribution, confidential FIU information exchange, evidence-based findings and lawful recommendations.
- Immediate explanatory feedback after each selection and a final decision review.
- Practice score out of 100%, with an 80% threshold for the locally recorded **Integrity Challenger** educational achievement. Attempts and personal best are stored only in the current browser under `amlverse-capstone-v1`.
- A gift-opening experience on a passing attempt, plus an example note under ABSTRACT, FINDINGS, INFERENCE, RECOMMENDED ACTIONS and LIMITATIONS.
- Downloadable text-only educational debrief. A result appears separately on **My Progress**; the capstone is not a tenth 5-step course.
- No real data collection, backend, accreditation, or authoritative case determination.

The capstone is available to all learners for practice. Finishing the earlier nine worlds is recommended preparation, but not an enforced requirement. It does not award a professional qualification.

## Achievement audit and expansion — v0.19.1
The My Progress achievement gallery now covers the complete curriculum:
- General milestones: Curious Learner (lessons in three distinct worlds), Knowledge Seeker, First Mission, Case Detective, Global Collaborator, World Champion, Learning Champion (all **nine** games) and Academy Master (all nine complete 5-step worlds).
- Nine **individual World Champion** achievements, one for each learning world, require three visited lessons, a passed Quick Check and a completed game.
- Three **Learning Track Specialist** achievements: Foundations & Standards; Financial Intelligence & Cooperation; and Blockchain Investigation & Reporting.
- **FATF Quest Explorer** and **FATF Quest Master** (perfect results in all ten Recommendation lessons).
- **Integrity Challenger** awarded for a passing result in the Capstone Challenge.

The page includes All / Unlocked / To earn filters, an overall unlocked count and specific progress on each locked or unlocked badge. Achievement calculations reuse existing saved local browser data: no reset, server account or official certification is introduced. Older passes not previously recorded may need to be resubmitted.

## Arcade responsive layout fix — v0.20
All shared categorisation games now use a consistent responsive grid: three drop-zone columns and three evidence-card columns on wide displays, two columns on tablets (with a two-column card grid on narrower desktop widths), and a single column on small phones. This corrects the default one-column drop zones that unintentionally stacked vertically even on wide screens. The existing drag-and-drop and tap-to-place interactions remain available.

Before further curriculum expansion, prioritise usability tests, question bank variety, content citations/versioning, and accessible interactions across screen sizes.
