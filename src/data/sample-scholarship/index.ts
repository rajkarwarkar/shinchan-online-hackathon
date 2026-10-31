import { AnalysisReport, Source, Aspect, Claim, CoverageCell, Gap, Conflict, FreshnessFinding, ChecklistItem } from '@/types';

// ==========================================
// 1. Five Curated Fictional Sources
// ==========================================

export const SAMPLE_SOURCES: Source[] = [
  {
    id: 'src-1-official',
    url: 'https://aurora-foundation.org/merit-scholarship-2026',
    title: 'Aurora National Merit Scholarship: 2026 Guidelines & Application',
    publisher: 'Aurora Educational Foundation',
    kind: 'official',
    credibilityScore: 0.95,
    publishedDate: '2026-01-10T00:00:00.000Z',
    modifiedDate: '2026-02-01T00:00:00.000Z',
    detectedCycleLabel: 'Cycle 2026-2027',
    text: `Aurora National Merit Scholarship Guidelines — Cycle 2026-2027
Published: January 10, 2026 | Last Updated: February 01, 2026
Official Portal: https://aurora-foundation.org/merit-scholarship-2026

1. Purpose and Award:
The Aurora Educational Foundation awards $12,500 annually to undergraduate students demonstrating academic excellence in Science, Technology, and Public Policy.

2. Eligibility Criteria:
- Must be enrolled full-time in an accredited undergraduate university.
- Minimum cumulative Grade Point Average (GPA) of 3.8 on a 4.0 scale.
- Family adjusted gross annual income ceiling cannot exceed $55,000 as reported on federal tax return Schedule 1.
- Open to domestic and permanent resident applicants.

3. Key Application Deadlines:
- Final online application submission deadline is September 15, 2026 at 11:59 PM EST.
- Letters of recommendation must be submitted directly by faculty nominators before September 22, 2026.
- Incomplete applications submitted after September 15 will be rejected without review.

4. Application Process:
Applicants must register online at our portal, complete the statement of research intent, and attach verified institutional transcripts.

Contact Helpdesk:
For inquiries, contact registrar@aurora-foundation.org or call +1 (800) 555-0199.`,
    fetchedAt: '2026-10-31T12:00:00.000Z',
    status: 'ready'
  },
  {
    id: 'src-2-university-faq',
    url: 'https://state-university.edu/financial-aid/aurora-merit-faq',
    title: 'Aurora Merit Scholarship Institutional FAQs & Verification Checklist',
    publisher: 'State University Office of Financial Aid',
    kind: 'institutional',
    credibilityScore: 0.88,
    publishedDate: '2026-02-15T00:00:00.000Z',
    modifiedDate: '2026-02-15T00:00:00.000Z',
    detectedCycleLabel: 'Academic Year 2026-2027',
    text: `State University Financial Aid Office — Advisory on External Grants
Last Modified: February 15, 2026 | Aurora Merit Scholarship Guide

Document Verification Notice:
Students applying for the Aurora National Merit Award through State University must provide authenticated financial documentation.

Discrepancy Warning on Income Ceilings:
Under local state institutional co-sponsorship criteria, applicants must demonstrate a family income under $45,000 using IRS Form 1040 (not Schedule 1). Applicants with incomes exceeding $45,000 will be disqualified from university tuition matching.

Application Timeline:
Applications for the 2026 cycle close September 15, 2026. Submit your institutional endorsement papers to the Dean of Admissions 10 days before the foundation deadline.`,
    fetchedAt: '2026-10-31T12:00:00.000Z',
    status: 'ready'
  },
  {
    id: 'src-3-archived-blog',
    url: 'https://collegeprep-advising.com/blog/aurora-scholarship-deadlines',
    title: 'How to Win the Aurora Scholarship: Deadlines and Documents',
    publisher: 'College Prep Advising Blog',
    kind: 'news',
    credibilityScore: 0.52,
    publishedDate: '2024-05-12T00:00:00.000Z',
    detectedCycleLabel: 'Cycle 2024',
    text: `College Prep Advising Guide — Archived Post
Published: May 12, 2024

If you are aiming for the competitive Aurora Foundation Scholarship, be sure to file early!
The application deadline is July 31, 2024. Late submissions are strictly barred.
Eligible students receive an annual stipend of $10,000 per academic year.
Applicants need a 3.7 GPA and standard recommendation letters.`,
    fetchedAt: '2026-10-31T12:00:00.000Z',
    status: 'ready'
  },
  {
    id: 'src-4-aggregator',
    url: 'https://scholarship-database-hub.org/aurora-merit-award',
    title: 'Aurora National Merit Scholarship Quick Summary & Requirements',
    publisher: 'Scholarship Database Hub',
    kind: 'third-party',
    credibilityScore: 0.40,
    // Undated intentionally
    text: `Scholarship Database Hub — Quick Overview: Aurora Merit Award
Undated Publication | Author: Editorial Staff

Scholarship Overview:
Award: $12,500.
GPA Requirement: 3.8.
Field: STEM & Public Policy.
Deadline: September 15.

Renewal & Support Note:
Check with the Foundation for renewal details. No helpline phone number or contact email is provided on this summary page.`,
    fetchedAt: '2026-10-31T12:00:00.000Z',
    status: 'ready'
  },
  {
    id: 'src-5-news',
    url: 'https://education-gazette.com/aurora-foundation-expands-endowment',
    title: 'Aurora Foundation Expands Endowment for 2026 STEM Scholars',
    publisher: 'Education Gazette',
    kind: 'news',
    credibilityScore: 0.65,
    publishedDate: '2026-01-28T00:00:00.000Z',
    detectedCycleLabel: '2026 Expansion',
    text: `Education Gazette — January 28, 2026
The Aurora Educational Foundation recently announced a major endowment boost for its premier merit scholarship. The foundation reported an increased annual stipend of $12,500, up from the prior $10,000 grant in previous cycles. Foundation spokespersons reiterated that all candidates must file before September 15, 2026.`,
    fetchedAt: '2026-10-31T12:00:00.000Z',
    status: 'ready'
  }
];

// ==========================================
// 2. Expected Aspects Framework
// ==========================================

export const SAMPLE_ASPECTS: Aspect[] = [
  {
    id: 'asp-eligibility',
    label: 'Eligibility & Academic Prerequisite',
    importance: 'critical',
    rationale: 'Core qualifying gate for applicant consideration (GPA, enrollment status).',
    origin: 'ai-expected'
  },
  {
    id: 'asp-income',
    label: 'Income Ceiling & Financial Documentation',
    importance: 'critical',
    rationale: 'Financial cap determining whether applicant qualifies for need-based tier.',
    origin: 'ai-expected'
  },
  {
    id: 'asp-deadline',
    label: 'Application Deadline & Submission Window',
    importance: 'critical',
    rationale: 'Final cutoff timestamp after which applications are disqualified.',
    origin: 'ai-expected'
  },
  {
    id: 'asp-amount',
    label: 'Award Amount & Benefits',
    importance: 'high',
    rationale: 'Monetary grant value and stipend terms.',
    origin: 'ai-expected'
  },
  {
    id: 'asp-renewal',
    label: 'Renewal Conditions & Maintenance Criteria',
    importance: 'critical',
    rationale: 'Multi-year continuation rules: minimum credits, ongoing GPA, reapplication.',
    origin: 'ai-expected'
  },
  {
    id: 'asp-contact',
    label: 'Official Helpdesk & Contact Channel',
    importance: 'medium',
    rationale: 'Direct institutional contact for resolving anomalies and appeals.',
    origin: 'ai-expected'
  }
];

// ==========================================
// 3. Extracted & Verified Claims
// ==========================================

export const SAMPLE_CLAIMS: Claim[] = [
  {
    id: 'clm-1',
    sourceId: 'src-1-official',
    aspectId: 'asp-eligibility',
    statement: 'Minimum cumulative GPA of 3.8 on a 4.0 scale with full-time enrollment.',
    value: '3.8 GPA',
    quote: 'Minimum cumulative Grade Point Average (GPA) of 3.8 on a 4.0 scale.',
    quoteVerified: true,
    quoteOffset: { start: 422, end: 494 },
    confidence: 0.98
  },
  {
    id: 'clm-2',
    sourceId: 'src-1-official',
    aspectId: 'asp-income',
    statement: 'Family adjusted gross annual income ceiling cannot exceed $55,000 (Schedule 1).',
    value: '$55,000 (Schedule 1)',
    quote: 'Family adjusted gross annual income ceiling cannot exceed $55,000 as reported on federal tax return Schedule 1.',
    quoteVerified: true,
    quoteOffset: { start: 497, end: 609 },
    confidence: 0.97
  },
  {
    id: 'clm-3',
    sourceId: 'src-2-university-faq',
    aspectId: 'asp-income',
    statement: 'Institutional ceiling is $45,000 documented via IRS Form 1040.',
    value: '$45,000 (Form 1040)',
    quote: 'Under local state institutional co-sponsorship criteria, applicants must demonstrate a family income under $45,000 using IRS Form 1040 (not Schedule 1).',
    quoteVerified: true,
    quoteOffset: { start: 301, end: 456 },
    confidence: 0.95
  },
  {
    id: 'clm-4',
    sourceId: 'src-1-official',
    aspectId: 'asp-deadline',
    statement: 'Final online application deadline is September 15, 2026 at 11:59 PM EST.',
    value: 'September 15, 2026',
    quote: 'Final online application submission deadline is September 15, 2026 at 11:59 PM EST.',
    quoteVerified: true,
    quoteOffset: { start: 695, end: 779 },
    confidence: 0.99
  },
  {
    id: 'clm-5',
    sourceId: 'src-3-archived-blog',
    aspectId: 'asp-deadline',
    statement: 'Outdated blog claims deadline is July 31, 2024.',
    value: 'July 31, 2024 (Outdated)',
    quote: 'The application deadline is July 31, 2024. Late submissions are strictly barred.',
    quoteVerified: true,
    quoteOffset: { start: 162, end: 242 },
    confidence: 0.65
  },
  {
    id: 'clm-6',
    sourceId: 'src-1-official',
    aspectId: 'asp-amount',
    statement: 'Awards $12,500 annually to undergraduate STEM and policy students.',
    value: '$12,500 annually',
    quote: 'The Aurora Educational Foundation awards $12,500 annually to undergraduate students demonstrating academic excellence in Science, Technology, and Public Policy.',
    quoteVerified: true,
    quoteOffset: { start: 202, end: 364 },
    confidence: 0.98
  },
  {
    id: 'clm-7',
    sourceId: 'src-1-official',
    aspectId: 'asp-contact',
    statement: 'Official inquiries routed to registrar@aurora-foundation.org or +1 (800) 555-0199.',
    value: 'registrar@aurora-foundation.org',
    quote: 'For inquiries, contact registrar@aurora-foundation.org or call +1 (800) 555-0199.',
    quoteVerified: true,
    quoteOffset: { start: 1042, end: 1123 },
    confidence: 0.96
  }
];

// ==========================================
// 4. Coverage Matrix Cells
// ==========================================

export const SAMPLE_COVERAGE: CoverageCell[] = [
  { aspectId: 'asp-eligibility', sourceId: 'src-1-official', status: 'full', claimIds: ['clm-1'] },
  { aspectId: 'asp-income', sourceId: 'src-1-official', status: 'full', claimIds: ['clm-2'] },
  { aspectId: 'asp-income', sourceId: 'src-2-university-faq', status: 'full', claimIds: ['clm-3'] },
  { aspectId: 'asp-deadline', sourceId: 'src-1-official', status: 'full', claimIds: ['clm-4'] },
  { aspectId: 'asp-deadline', sourceId: 'src-3-archived-blog', status: 'partial', claimIds: ['clm-5'] },
  { aspectId: 'asp-amount', sourceId: 'src-1-official', status: 'full', claimIds: ['clm-6'] },
  { aspectId: 'asp-renewal', sourceId: 'src-1-official', status: 'none', claimIds: [] },
  { aspectId: 'asp-renewal', sourceId: 'src-2-university-faq', status: 'none', claimIds: [] },
  { aspectId: 'asp-renewal', sourceId: 'src-3-archived-blog', status: 'none', claimIds: [] },
  { aspectId: 'asp-renewal', sourceId: 'src-4-aggregator', status: 'none', claimIds: [] },
  { aspectId: 'asp-contact', sourceId: 'src-1-official', status: 'full', claimIds: ['clm-7'] }
];

// ==========================================
// 5. Seeded Information Gaps (Dark Spots)
// ==========================================

export const SAMPLE_GAPS: Gap[] = [
  {
    id: 'gap-renewal-omission',
    aspectId: 'asp-renewal',
    severity: 'CRITICAL',
    title: 'Zero Multi-Year Renewal Guidelines Stated Across Official Sources',
    explanation: 'Neither the official foundation guidelines nor the university advisory documents specify whether the $12,500 scholarship renews automatically, requires an annual re-application, or mandates credit-hour and GPA benchmarks to maintain funding for sophomore through senior years.',
    evidenceRefs: ['src-1-official', 'src-2-university-faq'],
    trust: 'AI_SUGGESTED',
    whyItMatters: 'A student planning their multi-year college budget could face sudden loss of funding after year one if annual renewal requirements are unfulfilled.'
  },
  {
    id: 'gap-single-source-tax-doc',
    aspectId: 'asp-income',
    severity: 'MODERATE',
    title: 'IRS Form 1040 vs Schedule 1 Dependency Unresolved in Main Portal',
    explanation: 'The official Foundation portal only cites Schedule 1, whereas the University Financial Aid Office mandates Form 1040. Third-party aggregators fail to clarify this discrepancy.',
    evidenceRefs: ['src-1-official', 'src-2-university-faq'],
    trust: 'AI_SUGGESTED',
    whyItMatters: 'Submitting the wrong tax return schedule can result in summary administrative rejection.'
  }
];

// ==========================================
// 6. Seeded Policy Conflicts
// ==========================================

export const SAMPLE_CONFLICTS: Conflict[] = [
  {
    id: 'conf-income-ceiling',
    aspectId: 'asp-income',
    claimA: SAMPLE_CLAIMS[1], // $55,000 Schedule 1
    claimB: SAMPLE_CLAIMS[2], // $45,000 Form 1040
    type: 'value-mismatch',
    possibleExplanation: 'The $45,000 ceiling applies specifically to university tuition-matching co-sponsorship, whereas the foundation itself permits incomes up to $55,000.',
    severity: 'CRITICAL',
    trust: 'SOURCED'
  },
  {
    id: 'conf-deadline-cycle',
    aspectId: 'asp-deadline',
    claimA: SAMPLE_CLAIMS[3], // Sept 15, 2026
    claimB: SAMPLE_CLAIMS[4], // July 31, 2024
    type: 'date-mismatch',
    possibleExplanation: 'The July 31 date originates from an archived 2024 advising blog post referring to an expired scholarship cycle.',
    severity: 'MODERATE',
    trust: 'SOURCED'
  }
];

// ==========================================
// 7. Seeded Temporal Freshness Warnings
// ==========================================

export const SAMPLE_FRESHNESS: FreshnessFinding[] = [
  {
    sourceId: 'src-3-archived-blog',
    status: 'older-cycle',
    reason: 'Archived blog references Cycle 2024 with defunct July 31 deadline (over 24 months outdated).',
    evidence: 'Published: May 12, 2024. Refers to past cycle.'
  },
  {
    sourceId: 'src-4-aggregator',
    status: 'undated',
    reason: 'Aggregator page contains no machine-readable publish or update timestamp.',
    evidence: 'Missing <meta> published_time, JSON-LD datePublished, and in-text update notice.'
  }
];

// ==========================================
// 8. Seeded Prioritized Verification Checklist
// ==========================================

export const SAMPLE_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk-1',
    priority: 'P0',
    action: 'Verify family income ceiling with Financial Aid Office (IRS Form 1040 vs Schedule 1)',
    why: 'Official portal permits $55k, but university advisory enforces $45k cap for tuition co-matching.',
    linkedFindingIds: ['conf-income-ceiling'],
    suggestedVerificationSource: 'https://state-university.edu/financial-aid/aurora-merit-faq',
    done: false
  },
  {
    id: 'chk-2',
    priority: 'P0',
    action: 'Request written clarification on annual renewal criteria from foundation registrar',
    why: 'Zero official sources document multi-year continuation criteria, GPA maintenance, or reapplication rules.',
    linkedFindingIds: ['gap-renewal-omission'],
    suggestedVerificationSource: 'https://aurora-foundation.org/merit-scholarship-2026',
    done: false
  },
  {
    id: 'chk-3',
    priority: 'P1',
    action: 'Ignore expired July 31 deadline from archived 2024 advising blog',
    why: 'The 2026 cycle officially closes September 15, 2026 at 11:59 PM EST.',
    linkedFindingIds: ['conf-deadline-cycle', 'src-3-archived-blog'],
    suggestedVerificationSource: 'https://aurora-foundation.org/merit-scholarship-2026',
    done: true
  },
  {
    id: 'chk-4',
    priority: 'P2',
    action: 'Confirm faculty nominator recommendation submission window (Sept 22 deadline)',
    why: 'Letters of recommendation carry a separate 7-day grace window following student application close.',
    linkedFindingIds: [],
    suggestedVerificationSource: 'https://aurora-foundation.org/merit-scholarship-2026',
    done: false
  }
];

// ==========================================
// 9. Complete Precomputed Sample Report
// ==========================================

export const SAMPLE_REPORT: AnalysisReport = {
  question: 'What are the complete eligibility rules, income limits, deadlines, and renewal conditions for the 2026 Aurora National Merit Scholarship?',
  aspects: SAMPLE_ASPECTS,
  sources: SAMPLE_SOURCES,
  claims: SAMPLE_CLAIMS,
  coverage: SAMPLE_COVERAGE,
  gaps: SAMPLE_GAPS,
  conflicts: SAMPLE_CONFLICTS,
  freshness: SAMPLE_FRESHNESS,
  checklist: SAMPLE_CHECKLIST,
  completenessIndex: 68,
  completenessBreakdown: {
    aspectCoverageScore: 88,
    conflictPenalty: 12,
    stalePenalty: 8
  },
  generatedAt: '2026-10-31T12:00:00.000Z',
  modelInfo: 'Gemini 2.5 Flash (Structured Extraction + Deterministic Verification)',
  limitations: [
    'Reviewed 5 web sources; internal institutional guidelines may contain supplementary rules.',
    'Scoring is strictly relative to reviewed publications and does not guarantee legal admissibility.'
  ]
};
