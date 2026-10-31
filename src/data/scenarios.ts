import { AnalysisReport, Source, Aspect, Claim } from '@/types';
import { SAMPLE_REPORT, SAMPLE_SOURCES, SAMPLE_ASPECTS, SAMPLE_CLAIMS } from './sample-scholarship';

export interface EvaluationScenario {
  id: string;
  name: string;
  badge: string;
  category: string;
  description: string;
  question: string;
  sources: Source[];
  aspects: Aspect[];
  claims: Claim[];
  report: AnalysisReport;
}

// ============================================================================
// SCENARIO 1: STEM Excellence Scholarship (Official PDF Use Case)
// ============================================================================
export const SCENARIO_STEM_SCHOLARSHIP: EvaluationScenario = {
  id: 'stem-scholarship',
  name: 'STEM Scholarship (PDF Official Use Case)',
  badge: 'Official PDF Scenario',
  category: 'Higher Education & Grants',
  description: 'Evaluates eligibility, renewal criteria gaps, conflicting family income ceilings, and stale 2024 academic cycle notices.',
  question: 'What are the complete eligibility criteria, deadlines, income ceilings, and renewal requirements for the Aurora National Merit STEM Scholarship 2026-2027?',
  sources: SAMPLE_SOURCES,
  aspects: SAMPLE_ASPECTS,
  claims: SAMPLE_CLAIMS,
  report: SAMPLE_REPORT
};

// ============================================================================
// SCENARIO 2: STEM OPT 24-Month Extension Rules
// ============================================================================
export const SCENARIO_STEM_OPT: EvaluationScenario = {
  id: 'stem-opt',
  name: 'STEM OPT 24-Month Visa Extension Rules',
  badge: 'Work Authorization Scenario',
  category: 'Immigration & Compliance',
  description: 'Work authorization scenario: Evaluates unemployment caps, conflicting employer reporting windows, and stale SEVP rules.',
  question: 'What are the mandatory reporting deadlines, maximum unemployment day limits, employer E-Verify requirements, and wage criteria for the 24-Month STEM OPT extension?',
  sources: [
    {
      id: 'opt-src-1-dhs',
      url: 'https://studyinthestates.dhs.gov/stem-opt-hub-2026',
      title: 'DHS Study in the States: STEM OPT 24-Month Extension Guidelines',
      publisher: 'U.S. Department of Homeland Security (DHS)',
      kind: 'official',
      credibilityScore: 0.98,
      publishedDate: '2026-01-05T00:00:00.000Z',
      modifiedDate: '2026-02-12T00:00:00.000Z',
      detectedCycleLabel: 'Federal Rule 2026',
      text: `DHS Official Guidance on STEM OPT:
1. Unemployment Allowance:
Students granted a 24-month STEM OPT extension are permitted an additional 60 days of unemployment, for a total of 150 days maximum across the entire 36-month OPT period.

2. Reporting Obligations:
Students and employers must submit Form I-983 annual self-evaluations every 12 months. Any material change in employment must be reported to the DSO within 10 calendar days.

3. Employer Eligibility:
The employer must be actively registered and in good standing with the federal E-Verify system.`,
      fetchedAt: '2026-10-31T12:00:00.000Z',
      status: 'ready'
    },
    {
      id: 'opt-src-2-university',
      url: 'https://international.tech-institute.edu/stem-opt-handbook',
      title: 'Tech Institute International Office: STEM OPT Student Handbook',
      publisher: 'Tech Institute ISSO',
      kind: 'institutional',
      credibilityScore: 0.89,
      publishedDate: '2026-02-01T00:00:00.000Z',
      modifiedDate: '2026-02-01T00:00:00.000Z',
      detectedCycleLabel: 'Academic Year 2025-2026',
      text: `Tech Institute ISSO Advice:
Warning on Reporting Windows:
Students must submit their 6-month SEVIS validation to ISSO within 21 days of the due date, rather than the federal 10-day window, to avoid auto-termination of records.

E-Verify Company ID:
Ensure your employer provides a 6-digit E-Verify company ID number on page 1 of Form I-983.`,
      fetchedAt: '2026-10-31T12:00:00.000Z',
      status: 'ready'
    },
    {
      id: 'opt-src-3-outdated-forum',
      url: 'https://visa-forum.net/threads/stem-opt-rules-2022',
      title: 'Immigration Forum: 24-Month STEM OPT Rules & FAQ',
      publisher: 'Community Visa Forum',
      kind: 'third-party',
      credibilityScore: 0.42,
      publishedDate: '2022-04-10T00:00:00.000Z',
      modifiedDate: '2022-04-10T00:00:00.000Z',
      detectedCycleLabel: 'Historical 2022 Notice',
      text: `Archived Forum Discussion (2022):
Under SEVP rules, students can claim 90 days of unemployment during STEM extension.
Note: You can work for non-E-Verify employers if approved by DSO.`,
      fetchedAt: '2026-10-31T12:00:00.000Z',
      status: 'ready'
    }
  ],
  aspects: [
    { id: 'asp-opt-unemp', label: 'Maximum Unemployment Allowance', importance: 'critical', rationale: 'Exceeding this limit revokes legal F-1 status immediately.', origin: 'ai-expected' },
    { id: 'asp-opt-reporting', label: 'DSO / SEVIS Reporting Windows', importance: 'critical', rationale: 'Failure to report results in SEVIS termination.', origin: 'ai-expected' },
    { id: 'asp-opt-everify', label: 'Employer E-Verify Compliance', importance: 'high', rationale: 'Required for Form I-765 petition approval.', origin: 'ai-expected' },
    { id: 'asp-opt-wage', label: 'Commensurate Wage & Hours', importance: 'high', rationale: 'Minimum 20 hours/week and equal pay for U.S. workers.', origin: 'ai-expected' },
    { id: 'asp-opt-travel', label: 'Travel & Re-entry While Pending', importance: 'medium', rationale: 'Re-entry requires valid EAD or extension receipt.', origin: 'ai-expected' }
  ],
  claims: [
    {
      id: 'cl-opt-1',
      sourceId: 'opt-src-1-dhs',
      aspectId: 'asp-opt-unemp',
      statement: 'Students are granted 60 additional days of unemployment, reaching a 150-day cumulative limit.',
      value: '150 days total',
      quote: 'Students granted a 24-month STEM OPT extension are permitted an additional 60 days of unemployment, for a total of 150 days maximum across the entire 36-month OPT period.',
      quoteVerified: true,
      quoteOffset: { start: 57, end: 231 },
      confidence: 0.98
    },
    {
      id: 'cl-opt-2',
      sourceId: 'opt-src-1-dhs',
      aspectId: 'asp-opt-reporting',
      statement: 'Material changes in employment must be reported to the DSO within 10 calendar days.',
      value: '10 calendar days',
      quote: 'Any material change in employment must be reported to the DSO within 10 calendar days.',
      quoteVerified: true,
      quoteOffset: { start: 350, end: 436 },
      confidence: 0.95
    },
    {
      id: 'cl-opt-3',
      sourceId: 'opt-src-2-university',
      aspectId: 'asp-opt-reporting',
      statement: 'Tech Institute ISSO advises submitting 6-month validation within 21 days of the due date.',
      value: '21 calendar days',
      quote: 'Students must submit their 6-month SEVIS validation to ISSO within 21 days of the due date, rather than the federal 10-day window, to avoid auto-termination of records.',
      quoteVerified: true,
      quoteOffset: { start: 70, end: 242 },
      confidence: 0.88
    },
    {
      id: 'cl-opt-4',
      sourceId: 'opt-src-1-dhs',
      aspectId: 'asp-opt-everify',
      statement: 'Employer must be actively registered and in good standing with E-Verify.',
      quote: 'The employer must be actively registered and in good standing with the federal E-Verify system.',
      quoteVerified: true,
      quoteOffset: { start: 467, end: 563 },
      confidence: 0.97
    }
  ],
  report: {
    question: 'What are the mandatory reporting deadlines, maximum unemployment day limits, employer E-Verify requirements, and wage criteria for the 24-Month STEM OPT extension?',
    aspects: [
      { id: 'asp-opt-unemp', label: 'Maximum Unemployment Allowance', importance: 'critical', rationale: 'Exceeding limit revokes legal F-1 status.', origin: 'ai-expected' },
      { id: 'asp-opt-reporting', label: 'DSO / SEVIS Reporting Windows', importance: 'critical', rationale: 'Failure to report results in SEVIS termination.', origin: 'ai-expected' },
      { id: 'asp-opt-everify', label: 'Employer E-Verify Compliance', importance: 'high', rationale: 'Required for Form I-765 petition approval.', origin: 'ai-expected' },
      { id: 'asp-opt-wage', label: 'Commensurate Wage & Hours', importance: 'high', rationale: 'Minimum 20 hours/week and equal pay for U.S. workers.', origin: 'ai-expected' },
      { id: 'asp-opt-travel', label: 'Travel & Re-entry While Pending', importance: 'medium', rationale: 'Re-entry requires valid EAD or extension receipt.', origin: 'ai-expected' }
    ],
    sources: [], // populates dynamically
    claims: [],
    coverage: [
      { aspectId: 'asp-opt-unemp', sourceId: 'opt-src-1-dhs', status: 'full', claimIds: ['cl-opt-1'] },
      { aspectId: 'asp-opt-reporting', sourceId: 'opt-src-1-dhs', status: 'full', claimIds: ['cl-opt-2'] },
      { aspectId: 'asp-opt-reporting', sourceId: 'opt-src-2-university', status: 'partial', claimIds: ['cl-opt-3'] },
      { aspectId: 'asp-opt-everify', sourceId: 'opt-src-1-dhs', status: 'full', claimIds: ['cl-opt-4'] },
      { aspectId: 'asp-opt-wage', sourceId: 'opt-src-1-dhs', status: 'none', claimIds: [] },
      { aspectId: 'asp-opt-travel', sourceId: 'opt-src-1-dhs', status: 'none', claimIds: [] }
    ],
    gaps: [
      {
        id: 'gap-opt-wage',
        aspectId: 'asp-opt-wage',
        severity: 'CRITICAL',
        title: 'Missing Commensurate Wage & Hours Specifications',
        explanation: 'None of the reviewed sources detail specific hourly wage parity thresholds or non-compensation / stipend restrictions for Form I-983.',
        evidenceRefs: ['opt-src-1-dhs'],
        trust: 'AI_SUGGESTED',
        whyItMatters: 'Working without verified wage compensation violates federal STEM training plan regulations and risks deportation.'
      },
      {
        id: 'gap-opt-travel',
        aspectId: 'asp-opt-travel',
        severity: 'MODERATE',
        title: 'Unspecified International Travel Rules During Pending Cap-Gap',
        explanation: 'No reviewed source provides travel guidance while the STEM OPT petition remains pending past the initial 12-month EAD expiration.',
        evidenceRefs: ['opt-src-1-dhs', 'opt-src-2-university'],
        trust: 'AI_SUGGESTED',
        whyItMatters: 'Leaving the United States while the extension is pending without an unexpired EAD may forfeit entry permission.'
      }
    ],
    conflicts: [
      {
        id: 'conf-opt-window',
        aspectId: 'asp-opt-reporting',
        claimA: {
          id: 'cl-opt-2',
          sourceId: 'opt-src-1-dhs',
          aspectId: 'asp-opt-reporting',
          statement: 'Material changes in employment must be reported to the DSO within 10 calendar days.',
          value: '10 calendar days',
          quote: 'Any material change in employment must be reported to the DSO within 10 calendar days.',
          quoteVerified: true,
          quoteOffset: { start: 350, end: 436 },
          confidence: 0.95
        },
        claimB: {
          id: 'cl-opt-3',
          sourceId: 'opt-src-2-university',
          aspectId: 'asp-opt-reporting',
          statement: 'Tech Institute ISSO advises submitting 6-month validation within 21 days of the due date.',
          value: '21 calendar days',
          quote: 'Students must submit their 6-month SEVIS validation to ISSO within 21 days of the due date, rather than the federal 10-day window, to avoid auto-termination of records.',
          quoteVerified: true,
          quoteOffset: { start: 70, end: 242 },
          confidence: 0.88
        },
        type: 'date-mismatch',
        possibleExplanation: 'Federal regulation enforces a strict 10-day window for material employment changes, whereas the university handbook describes a 21-day internal portal grace period for routine validation reports.',
        severity: 'CRITICAL',
        trust: 'SOURCED'
      }
    ],
    freshness: [
      {
        sourceId: 'opt-src-3-outdated-forum',
        status: 'older-cycle',
        reason: 'Archived community forum from 2022 cites obsolete 90-day unemployment rules and incorrect E-Verify exemptions.',
        evidence: 'Published: April 10, 2022'
      }
    ],
    checklist: [
      {
        id: 'chk-opt-1',
        priority: 'P0',
        action: 'Reconcile 10-Day Federal vs 21-Day University Reporting Window with DSO',
        why: 'Relying on the 21-day internal timeline risks violating the federal 10-day statutory SEVIS deadline.',
        linkedFindingIds: ['conf-opt-window'],
        suggestedVerificationSource: 'https://studyinthestates.dhs.gov/stem-opt-hub-2026',
        done: false
      },
      {
        id: 'chk-opt-2',
        priority: 'P1',
        action: 'Obtain Official Minimum Wage Guidelines for Form I-983 Section 5',
        why: 'Unpaid internships or sub-minimum wage positions are strictly disallowed under STEM OPT.',
        linkedFindingIds: ['gap-opt-wage'],
        suggestedVerificationSource: 'https://studyinthestates.dhs.gov/stem-opt-hub-2026',
        done: false
      }
    ],
    completenessIndex: 62,
    completenessBreakdown: {
      aspectCoverageScore: 82,
      conflictPenalty: 12,
      stalePenalty: 8
    },
    generatedAt: '2026-10-31T12:00:00.000Z',
    modelInfo: 'Gemini 2.5 Flash (Deterministic Audit Pipeline)',
    limitations: ['Official DHS portal parsed; third-party immigration forums downgraded due to staleness.']
  }
};

// ============================================================================
// SCENARIO 3: 2026 Residential Clean Energy & EV Tax Rebate
// ============================================================================
export const SCENARIO_CLEAN_ENERGY: EvaluationScenario = {
  id: 'clean-energy',
  name: '2026 Clean Energy EV Tax Credit & Rebates',
  badge: 'Federal Grant Scenario',
  category: 'Clean Energy & Federal Tax',
  description: 'Federal & State grant scenario: Flags missing battery manufacturing rules, conflicting MSRP caps, and stale 2023 IRS guidance.',
  question: 'What are the critical vehicle price ceilings, critical mineral sourcing percentages, battery component rules, and income phaseouts for the 2026 Clean Vehicle Tax Credit (IRC Section 30D)?',
  sources: [
    {
      id: 'ev-src-1-irs',
      url: 'https://www.irs.gov/clean-vehicle-credits-2026',
      title: 'IRS Fact Sheet FS-2026-08: Clean Vehicle Credit (IRC 30D)',
      publisher: 'Internal Revenue Service (IRS)',
      kind: 'official',
      credibilityScore: 0.99,
      publishedDate: '2026-01-15T00:00:00.000Z',
      modifiedDate: '2026-02-10T00:00:00.000Z',
      detectedCycleLabel: 'Tax Year 2026',
      text: `IRS Section 30D Clean Vehicle Credits (2026):
1. Maximum MSRP Limitations:
The Manufacturer Suggested Retail Price (MSRP) cannot exceed $80,000 for vans, sport utility vehicles (SUVs), and pickup trucks. For all other passenger vehicles, the MSRP cap is strictly $55,000.

2. Modified AGI Thresholds:
Credit is disallowed if modified AGI exceeds $300,000 for married couples filing jointly, $225,000 for heads of households, or $150,000 for all other filers.

3. Point of Sale Transfer:
Buyers may elect to transfer the full credit amount directly to registered dealers at point of sale to lower vehicle purchase price.`,
      fetchedAt: '2026-10-31T12:00:00.000Z',
      status: 'ready'
    },
    {
      id: 'ev-src-2-auto-dealer',
      url: 'https://state-autodealer-association.org/2026-ev-rebates',
      title: 'State Auto Dealers Association: 2026 EV Rebate Consumer Guide',
      publisher: 'State Automobile Dealers Association',
      kind: 'institutional',
      credibilityScore: 0.78,
      publishedDate: '2026-02-05T00:00:00.000Z',
      modifiedDate: '2026-02-05T00:00:00.000Z',
      detectedCycleLabel: 'Model Year 2026 Guide',
      text: `State Dealers Association Notice:
Warning on Sedan MSRP Caps:
Under newly updated regional state clean air incentives combined with federal programs, crossovers and sedans qualify up to $65,000 MSRP if built with local state battery assembly.`,
      fetchedAt: '2026-10-31T12:00:00.000Z',
      status: 'ready'
    },
    {
      id: 'ev-src-3-stale-blog',
      url: 'https://ev-enthusiast-blog.com/2023-tax-rules',
      title: 'EV Buyer Guide: Maximizing Your 2023 Tax Credit',
      publisher: 'EV Enthusiast Magazine',
      kind: 'third-party',
      credibilityScore: 0.45,
      publishedDate: '2023-03-20T00:00:00.000Z',
      modifiedDate: '2023-03-20T00:00:00.000Z',
      detectedCycleLabel: 'Tax Year 2023',
      text: `2023 Buyer Guide:
Remember that you must claim the EV tax credit when filing your annual taxes the following year. Dealers cannot deduct the credit directly at purchase time.`,
      fetchedAt: '2026-10-31T12:00:00.000Z',
      status: 'ready'
    }
  ],
  aspects: [
    { id: 'asp-ev-msrp', label: 'MSRP Price Ceilings by Vehicle Class', importance: 'critical', rationale: 'Exceeding MSRP invalidates eligibility entirely.', origin: 'ai-expected' },
    { id: 'asp-ev-agi', label: 'Modified AGI Income Caps', importance: 'critical', rationale: 'Strict federal statutory income ceilings apply.', origin: 'ai-expected' },
    { id: 'asp-ev-pos', label: 'Point of Sale Dealership Transfer', importance: 'high', rationale: 'Allows instant savings vs tax-return deduction.', origin: 'ai-expected' },
    { id: 'asp-ev-minerals', label: 'Critical Mineral Sourcing Quotas (2026)', importance: 'critical', rationale: 'Requires 70% critical minerals extracted in US/FTA countries in 2026.', origin: 'ai-expected' },
    { id: 'asp-ev-battery', label: 'Foreign Entity of Concern (FEOC) Exclusion', importance: 'high', rationale: 'Disqualifies vehicles containing battery parts from prohibited nations.', origin: 'ai-expected' }
  ],
  claims: [
    {
      id: 'cl-ev-1',
      sourceId: 'ev-src-1-irs',
      aspectId: 'asp-ev-msrp',
      statement: 'MSRP cannot exceed $80,000 for SUVs/trucks and $55,000 for passenger sedans.',
      value: '$55,000 / $80,000',
      quote: 'The Manufacturer Suggested Retail Price (MSRP) cannot exceed $80,000 for vans, sport utility vehicles (SUVs), and pickup trucks. For all other passenger vehicles, the MSRP cap is strictly $55,000.',
      quoteVerified: true,
      quoteOffset: { start: 78, end: 279 },
      confidence: 0.99
    },
    {
      id: 'cl-ev-2',
      sourceId: 'ev-src-2-auto-dealer',
      aspectId: 'asp-ev-msrp',
      statement: 'State dealers report sedans and crossovers qualify up to $65,000 with local battery assembly.',
      value: '$65,000',
      quote: 'crossovers and sedans qualify up to $65,000 MSRP if built with local state battery assembly.',
      quoteVerified: true,
      quoteOffset: { start: 153, end: 247 },
      confidence: 0.82
    },
    {
      id: 'cl-ev-3',
      sourceId: 'ev-src-1-irs',
      aspectId: 'asp-ev-agi',
      statement: 'Credit disallowed if modified AGI exceeds $300,000 married, $225,000 head of household, or $150,000 single.',
      quote: 'Credit is disallowed if modified AGI exceeds $300,000 for married couples filing jointly, $225,000 for heads of households, or $150,000 for all other filers.',
      quoteVerified: true,
      quoteOffset: { start: 313, end: 472 },
      confidence: 0.98
    },
    {
      id: 'cl-ev-4',
      sourceId: 'ev-src-1-irs',
      aspectId: 'asp-ev-pos',
      statement: 'Buyers may transfer the full credit amount directly to registered dealers at point of sale.',
      quote: 'Buyers may elect to transfer the full credit amount directly to registered dealers at point of sale to lower vehicle purchase price.',
      quoteVerified: true,
      quoteOffset: { start: 506, end: 639 },
      confidence: 0.97
    }
  ],
  report: {
    question: 'What are the critical vehicle price ceilings, critical mineral sourcing percentages, battery component rules, and income phaseouts for the 2026 Clean Vehicle Tax Credit (IRC Section 30D)?',
    aspects: [
      { id: 'asp-ev-msrp', label: 'MSRP Price Ceilings by Vehicle Class', importance: 'critical', rationale: 'Exceeding MSRP invalidates eligibility entirely.', origin: 'ai-expected' },
      { id: 'asp-ev-agi', label: 'Modified AGI Income Caps', importance: 'critical', rationale: 'Strict federal statutory income ceilings apply.', origin: 'ai-expected' },
      { id: 'asp-ev-pos', label: 'Point of Sale Dealership Transfer', importance: 'high', rationale: 'Allows instant savings vs tax-return deduction.', origin: 'ai-expected' },
      { id: 'asp-ev-minerals', label: 'Critical Mineral Sourcing Quotas (2026)', importance: 'critical', rationale: 'Requires 70% critical minerals extracted in US/FTA countries in 2026.', origin: 'ai-expected' },
      { id: 'asp-ev-battery', label: 'Foreign Entity of Concern (FEOC) Exclusion', importance: 'high', rationale: 'Disqualifies vehicles containing battery parts from prohibited nations.', origin: 'ai-expected' }
    ],
    sources: [],
    claims: [],
    coverage: [
      { aspectId: 'asp-ev-msrp', sourceId: 'ev-src-1-irs', status: 'full', claimIds: ['cl-ev-1'] },
      { aspectId: 'asp-ev-msrp', sourceId: 'ev-src-2-auto-dealer', status: 'partial', claimIds: ['cl-ev-2'] },
      { aspectId: 'asp-ev-agi', sourceId: 'ev-src-1-irs', status: 'full', claimIds: ['cl-ev-3'] },
      { aspectId: 'asp-ev-pos', sourceId: 'ev-src-1-irs', status: 'full', claimIds: ['cl-ev-4'] },
      { aspectId: 'asp-ev-minerals', sourceId: 'ev-src-1-irs', status: 'none', claimIds: [] },
      { aspectId: 'asp-ev-battery', sourceId: 'ev-src-1-irs', status: 'none', claimIds: [] }
    ],
    gaps: [
      {
        id: 'gap-ev-minerals',
        aspectId: 'asp-ev-minerals',
        severity: 'CRITICAL',
        title: 'Dark Spot: Missing 2026 Critical Mineral 70% Certification List',
        explanation: 'None of the provided sources list which 2026 vehicle models satisfy the updated 70% critical mineral extraction requirement needed for the $3,750 mineral portion.',
        evidenceRefs: ['ev-src-1-irs'],
        trust: 'AI_SUGGESTED',
        whyItMatters: 'A vehicle may pass the MSRP and income test but forfeit half the tax credit ($3,750) if battery supply chain certification is missing.'
      },
      {
        id: 'gap-ev-feoc',
        aspectId: 'asp-ev-battery',
        severity: 'CRITICAL',
        title: 'Unverified Foreign Entity of Concern (FEOC) Battery Inclusions',
        explanation: 'Reviewed materials omit the official manufacturer exclusion lists regarding battery cells sourced from FEOC entities for model year 2026.',
        evidenceRefs: ['ev-src-1-irs'],
        trust: 'AI_SUGGESTED',
        whyItMatters: 'Vehicles containing any FEOC-manufactured battery component are disqualified from the entire $7,500 credit under Section 30D(d)(7).'
      }
    ],
    conflicts: [
      {
        id: 'conf-ev-msrp',
        aspectId: 'asp-ev-msrp',
        claimA: {
          id: 'cl-ev-1',
          sourceId: 'ev-src-1-irs',
          aspectId: 'asp-ev-msrp',
          statement: 'MSRP cannot exceed $80,000 for SUVs/trucks and $55,000 for passenger sedans.',
          value: '$55,000 / $80,000',
          quote: 'The Manufacturer Suggested Retail Price (MSRP) cannot exceed $80,000 for vans, sport utility vehicles (SUVs), and pickup trucks. For all other passenger vehicles, the MSRP cap is strictly $55,000.',
          quoteVerified: true,
          quoteOffset: { start: 78, end: 279 },
          confidence: 0.99
        },
        claimB: {
          id: 'cl-ev-2',
          sourceId: 'ev-src-2-auto-dealer',
          aspectId: 'asp-ev-msrp',
          statement: 'State dealers report sedans and crossovers qualify up to $65,000 with local battery assembly.',
          value: '$65,000',
          quote: 'crossovers and sedans qualify up to $65,000 MSRP if built with local state battery assembly.',
          quoteVerified: true,
          quoteOffset: { start: 153, end: 247 },
          confidence: 0.82
        },
        type: 'value-mismatch',
        possibleExplanation: 'The IRS enforces a strict $55,000 federal statutory ceiling for sedans; the $65,000 figure is a state-level supplementary subsidy that does not override federal IRC Section 30D caps.',
        severity: 'CRITICAL',
        trust: 'SOURCED'
      }
    ],
    freshness: [
      {
        sourceId: 'ev-src-3-stale-blog',
        status: 'older-cycle',
        reason: 'Archived 2023 guide incorrectly claims dealers cannot transfer credit at point of sale (superseded by 2024+ IRS POS transfer regulations).',
        evidence: 'Published: March 20, 2023'
      }
    ],
    checklist: [
      {
        id: 'chk-ev-1',
        priority: 'P0',
        action: 'Verify Vehicle VIN on FuelEconomy.gov for 2026 Mineral & FEOC Certification',
        why: 'Dealers may advertise full $7,500 credit on models that were disqualified after the latest FEOC audit.',
        linkedFindingIds: ['gap-ev-minerals', 'gap-ev-feoc'],
        suggestedVerificationSource: 'https://www.irs.gov/clean-vehicle-credits-2026',
        done: false
      },
      {
        id: 'chk-ev-2',
        priority: 'P1',
        action: 'Confirm Sedan MSRP Does Not Exceed Federal $55,000 Threshold',
        why: 'Optional trim packages pushing a sedan above $55,000 completely invalidate federal eligibility regardless of state dealer claims.',
        linkedFindingIds: ['conf-ev-msrp'],
        suggestedVerificationSource: 'https://www.irs.gov/clean-vehicle-credits-2026',
        done: false
      }
    ],
    completenessIndex: 48,
    completenessBreakdown: {
      aspectCoverageScore: 74,
      conflictPenalty: 16,
      stalePenalty: 10
    },
    generatedAt: '2026-10-31T12:00:00.000Z',
    modelInfo: 'Gemini 2.5 Flash (Deterministic Audit Pipeline)',
    limitations: ['Verified against official IRS Section 30D bulletins; local state dealership promotional claims cross-checked.']
  }
};

export const ALL_EVALUATION_SCENARIOS = [
  SCENARIO_STEM_SCHOLARSHIP,
  SCENARIO_STEM_OPT,
  SCENARIO_CLEAN_ENERGY
];
