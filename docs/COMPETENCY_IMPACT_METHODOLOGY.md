# AMLVERSE Nigeria — Competency & Learning Impact Lab (v0.38)

**Creator:** Muzammil Adamu. **Status:** formative educational prototype; no independent psychometric validation, institutional accreditation, external expert approval or demonstrated training effect.

**Public application:** https://jctc-ng.github.io/amlverse-nigeria/ — open **Competency & Impact Lab** in Academy navigation.

## Research question

Can a learner demonstrate changed performance on synthetic, standards-informed financial intelligence reasoning exercises after using AMLVERSE?

A comparison on one device can describe a score difference. **It cannot establish causation**, occupational competence, learning transfer, or institutional effectiveness. A publishable claim would require a suitable study design, independently reviewed instrument, adequate sample, validated measures and appropriate ethics/organisational approval.

## Instrument

Two separate **12-item forms** (baseline and follow-up) contain **two items each across six domains**:

1. Risk-based assessment — identify risk and select proportionate mitigation
2. Customer due diligence and beneficial ownership — recognise missing natural-person/control information
3. Evidence and uncertainty — distinguish documented facts from hypotheses, identity attribution and allegations
4. Lawful FIU cooperation — distinguish intelligence dissemination, originator conditions and authorised evidence channels
5. Virtual asset tracing — recognise change-output and bridge attribution uncertainty
6. Defensible intelligence reporting — separate documented findings, qualified inferences and lawful next steps

The forms are purpose-designed parallel exercises: comparable themes and learning objectives, **not statistically equated, independent or psychometrically validated**. Item keys, statements and rationales are source-controlled in `src/CompetencyAssessmentData.ts`.

## Transparent scoring rubric

- 12 objectively keyed questions per form; **1 point for a correct answer and 0 for an incorrect answer**.
- No partial credit; all questions must be answered. This is a formative multiple-choice judgement measure, not proof of field capability.
- Overall percent: (number correct ÷ 12) × 100, rounded to the nearest whole number.
- Domain percent: (domain correct ÷ 2) × 100, yielding possible 0%, 50%, 100%. **Do not overinterpret domain scores with two items.**
- Observed change: follow-up percentage minus baseline percentage, **in percentage points**. Negative and zero changes are retained without spin.
- Each answer includes a voluntary three-level self-confidence rating (low, medium or high), recorded separately from correctness and not added to the score.
- The baseline is intended **before additional learning**, followed by relevant practice, then the follow-up. Follow-up is made available once baseline is complete; training attendance is not verified and the interface warns if no additional milestones were recorded.
- Correct answers and explanations are withheld during both test forms, then displayed in the detailed review after follow-up to minimise immediate answer disclosure.

## Data governance and privacy

- All questions and scenarios are fictional. No uploads or real STRs, client identifiers, case documents or wallet investigation data.
- Individual answers and summary records remain in browser `localStorage` under `amlverse-competency-impact-v1`. They are **not** shared with a server or a connected organisation.
- JSON export includes the assessment version, scores, six domain percentages, timestamps, progression snapshots, methodology and explicit caveats. CSV export includes aggregate individual domain/overall values only. No name, email, contact information, browser IP address or real case data.
- A **Reset evaluation** button requires typing `RESET` and deletes only the evaluation key. Other world/FATF/Capstone records remain intact.
- Storage may be erased, altered, or unavailable. Device clock may be inaccurate. No identity verification, browser tamper protection or cross-device sync exists. Do not present exported results as an official certificate.

## Proposed institutional pilot — not yet conducted

1. Pre-register learning objectives, sampling, consent and analysis plans, with institutional and ethics approvals where necessary.
2. Recruit participants voluntarily. Separate role/jurisdiction cohorts and agree a minimum necessary data plan.
3. Require baseline before learning, deliver a documented intervention, then administer the alternate form with reasonable spacing.
4. Ask independent AML/CFT, FIU/investigative and educational reviewers to assess content, bias, accessibility and item difficulty.
5. Investigate reliability, test–retest characteristics, floor/ceiling effects, baseline imbalance and whether the two forms are comparable.
6. Consider a suitable comparison group and controls for prior experience, practice, time and concurrent training. **Do not infer causality from a paired increase alone.**
7. Aggregate only appropriately consented, de-identified individual reports. Report denominators, incomplete cases, missing data, subgroup limitations, uncertainty intervals and negative findings.
8. Publish a versioned report with methods, evidence, limitations and independent review status; never claim FATF, NFIU or Egmont endorsement without explicit permission.

## Existing product impact

The Academy Overview and My Progress include links to the separate evaluation. Results do **not** change World Champion badges, FATF mastery, individual learning-world locks or original completion percentages. Course milestone snapshots are for descriptive context only.

## Primary references

- FATF Recommendations and Interpretive Notes (as amended June 2026): https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html
- Egmont Group public overview: https://egmontgroup.org/about/
- International project review framework: [INTERNATIONAL_REVIEW_AND_PILOT.md](INTERNATIONAL_REVIEW_AND_PILOT.md)

**Methodology note:** This learning assessment is not an officially adopted FATF or Egmont measurement framework.
