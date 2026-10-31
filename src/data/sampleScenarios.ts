import { SampleScenario } from '../types';

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'scholarship-2026',
    name: 'STEM Excellence Scholarship (PDF Use Case)',
    shortDesc: 'Official PDF scenario: Evaluates eligibility, renewal gaps, conflicting income ceilings, and stale 2024 notices.',
    category: 'Education & Grants',
    query: 'What should I verify before applying for the Global STEM Excellence Scholarship 2026?',
    sources: [
      {
        title: 'Global STEM Foundation: Official 2026 Candidate Guidelines',
        url: 'https://stemfoundation.org/scholarships/2026-guidelines',
        org: 'Global STEM Foundation',
        date: 'January 15, 2026',
        isOfficial: true,
        content: `The 2026 Global STEM Excellence Scholarship provides $15,000 per academic year for undergraduate students majoring in Computer Science, Mechanical Engineering, or Biotechnology. 
Eligibility: Minimum cumulative GPA of 3.8 on a 4.0 scale. Applicants must demonstrate financial need with an annual household income below $60,000. 
Application submission requires: Official academic transcript, a 1,000-word statement of research intent, and exactly 2 academic letters of recommendation from STEM faculty. 
Final deadline: March 31, 2026 at 11:59 PM EST. Late applications will not be evaluated.`
      },
      {
        title: 'EduStudent Forum: 2024 Application Archive & Tips',
        url: 'https://edustudenthub.com/threads/stem-excellence-application-archive',
        org: 'EduStudent Community Portal',
        date: 'October 12, 2024',
        isOfficial: false,
        content: `Heads up for everyone preparing for the STEM Excellence award: household income must not exceed $50,000 as per last year's form. 
Make sure you secure 3 letters of recommendation—last cycle two of my peers were disqualified because they only submitted two references! 
The portal usually closes on December 1, 2024. Double check with your dean before uploading.`
      },
      {
        title: 'State Higher Education Aid Bulletin (2025 Advisory)',
        url: 'https://state-highered.gov/bulletins/stem-grant-overview',
        org: 'Department of Higher Education Advisory',
        date: 'August 20, 2025',
        isOfficial: false,
        content: `Under state co-funding provisions, the Global STEM grant income threshold allows up to $65,000 household income for households with two or more dependents. 
Awardees are eligible for supplemental summer internship stipends of $3,500. Documentation must include IRS Form 1040 for the prior tax year. Notice: Renewal requirements and maintenance GPA are governed under individual university bylaws.`
      }
    ],
    precomputedResult: {
      id: 'result-scholarship-2026',
      topic: 'Global STEM Excellence Scholarship 2026: Application & Eligibility Requirements',
      timestamp: '2026-10-31T10:30:00.000Z',
      metrics: {
        completenessScore: 54, // 54% completeness means high dark spot density
        totalSources: 3,
        criticalGapsCount: 2,
        moderateGapsCount: 2,
        conflictsCount: 2,
        temporalWarningsCount: 2,
        summaryVerdict: 'Significant dark spots detected: Missing renewal criteria, conflicting income thresholds across 3 sources, and one stale (2024) guide.'
      },
      sources: [
        {
          id: 'src-1',
          title: 'Global STEM Foundation: Official 2026 Candidate Guidelines',
          url: 'https://stemfoundation.org/scholarships/2026-guidelines',
          domain: 'stemfoundation.org',
          authorOrOrg: 'Global STEM Foundation',
          publishedDate: 'January 15, 2026',
          cycleOrYear: '2026 Cycle',
          reliability: 'OFFICIAL_PRIMARY',
          isOfficial: true,
          contentSnippet: 'The 2026 Global STEM Excellence Scholarship provides $15,000 per academic year... Eligibility: GPA >= 3.8, income < $60,000, 2 recommendation letters. Deadline: March 31, 2026.'
        },
        {
          id: 'src-2',
          title: 'EduStudent Forum: 2024 Application Archive & Tips',
          url: 'https://edustudenthub.com/threads/stem-excellence-application-archive',
          domain: 'edustudenthub.com',
          authorOrOrg: 'EduStudent Community Portal',
          publishedDate: 'October 12, 2024',
          cycleOrYear: '2024 Cycle',
          reliability: 'COMMUNITY_UNVERIFIED',
          isOfficial: false,
          contentSnippet: 'Income must not exceed $50,000 as per last year. Make sure you secure 3 letters of recommendation... Portal closes December 1, 2024.'
        },
        {
          id: 'src-3',
          title: 'State Higher Education Aid Bulletin (2025 Advisory)',
          url: 'https://state-highered.gov/bulletins/stem-grant-overview',
          domain: 'state-highered.gov',
          authorOrOrg: 'Department of Higher Education Advisory',
          publishedDate: 'August 20, 2025',
          cycleOrYear: '2025 Cycle',
          reliability: 'SECONDARY_SOURCE',
          isOfficial: false,
          contentSnippet: 'Income threshold allows up to $65,000 for households with 2+ dependents. Documentation requires IRS Form 1040. Renewal criteria governed under individual university bylaws.'
        }
      ],
      facts: [
        {
          id: 'fact-1',
          category: 'Award Value',
          claim: 'Award amount is $15,000 per academic year for undergraduate STEM majors.',
          sourceId: 'src-1',
          exactQuote: 'The 2026 Global STEM Excellence Scholarship provides $15,000 per academic year for undergraduate students majoring in Computer Science, Mechanical Engineering, or Biotechnology.',
          confidence: 0.98
        },
        {
          id: 'fact-2',
          category: 'Academic Eligibility',
          claim: 'Minimum cumulative GPA required is 3.8 on a 4.0 scale.',
          sourceId: 'src-1',
          exactQuote: 'Eligibility: Minimum cumulative GPA of 3.8 on a 4.0 scale.',
          confidence: 0.99
        },
        {
          id: 'fact-3',
          category: 'Required Documents',
          claim: 'Official transcript, 1000-word statement of intent, and letters of recommendation required.',
          sourceId: 'src-1',
          exactQuote: 'Application submission requires: Official academic transcript, a 1,000-word statement of research intent, and exactly 2 academic letters of recommendation from STEM faculty.',
          confidence: 0.95
        },
        {
          id: 'fact-4',
          category: 'Official Deadline',
          claim: 'The official application deadline is March 31, 2026 at 11:59 PM EST.',
          sourceId: 'src-1',
          exactQuote: 'Final deadline: March 31, 2026 at 11:59 PM EST. Late applications will not be evaluated.',
          confidence: 0.99
        }
      ],
      gaps: [
        {
          id: 'gap-1',
          facet: 'Renewal & Multi-Year Continuation Terms',
          severity: 'CRITICAL',
          explanation: 'None of the reviewed sources clearly state the conditions required to retain the scholarship for years 2, 3, or 4 (e.g., minimum continuing GPA, credit load, or reapplication requirements).',
          impactOnDecision: 'A student may budget for a 4-year degree assuming $60,000 in total aid, only to lose funding unexpectedly after Year 1 if renewal thresholds are stricter than initial entry.',
          reasonMissing: 'The official guideline specifies entry criteria only; secondary sources vaguely defer to "individual university bylaws".',
          verificationQuestion: 'What are the exact GPA retention threshold and annual renewal application requirements for subsequent years?'
        },
        {
          id: 'gap-2',
          facet: 'Disbursement & Taxability Rules',
          severity: 'CRITICAL',
          explanation: 'No information is given on whether funds are paid directly to university tuition accounts, sent as a direct student stipend, or subject to taxable gross income.',
          impactOnDecision: 'Could create sudden out-of-pocket tax liabilities or unexpected delays in tuition credit registration.',
          reasonMissing: 'Financial aid disbursement mechanics are omitted across all candidate brochures.',
          verificationQuestion: 'Are funds disbursed directly to the bursar office, and is any portion reported on a 1098-T or 1099 form?'
        },
        {
          id: 'gap-3',
          facet: 'Appeal & Reconsideration Protocol',
          severity: 'MODERATE',
          explanation: 'Sources state "late applications will not be evaluated" but provide zero recourse or appeal procedure for technical portal submission failures or documented medical emergencies.',
          impactOnDecision: 'Leaves candidates with no contingency plan if institutional transcripts arrive late.',
          reasonMissing: 'Standard portal disclaimer with no ombudsman or appeal contact listed.',
          verificationQuestion: 'Is there an official appeals or review committee for disputed submissions or extenuating circumstances?'
        },
        {
          id: 'gap-4',
          facet: 'Concurrent Funding / Stacking Restrictions',
          severity: 'MODERATE',
          explanation: 'It is unstated whether recipients are permitted to hold other state grants, Pell grants, or external corporate scholarships alongside this award.',
          impactOnDecision: 'Recipient may face clawback or forfeiture of other financial aid packages.',
          reasonMissing: 'Stacking policy clauses absent from candidate literature.',
          verificationQuestion: 'Does this award allow stacking with federal/state aid and private departmental scholarships?'
        }
      ],
      conflicts: [
        {
          id: 'conf-1',
          topic: 'Household Income Cap Eligibility',
          severity: 'CRITICAL',
          divergenceSummary: 'Sources provide conflicting maximum household income eligibility ceilings ($60,000 vs. $50,000 vs. $65,000 with dependents).',
          claimA: {
            sourceId: 'src-1',
            statement: 'Official 2026 Guideline establishes a flat $60,000 household income limit.',
            exactQuote: 'Applicants must demonstrate financial need with an annual household income below $60,000.'
          },
          claimB: {
            sourceId: 'src-3',
            statement: 'State Aid Bulletin allows up to $65,000 for households with 2+ dependents.',
            exactQuote: 'Under state co-funding provisions, the Global STEM grant income threshold allows up to $65,000 household income for households with two or more dependents.'
          },
          rootCause: 'State bulletin applies a dependent-weighted formula, whereas the primary foundation flyer specifies a simplified gross figure.',
          verificationGuidance: 'Check whether your institution participates in the State Co-Funding tier, or default to the strictest $60,000 cap from the official 2026 foundation document.'
        },
        {
          id: 'conf-2',
          topic: 'Number of Required Letters of Recommendation',
          severity: 'CRITICAL',
          divergenceSummary: 'Official guideline requires exactly 2 recommendations, while community archive instructs candidates to provide 3 under threat of disqualification.',
          claimA: {
            sourceId: 'src-1',
            statement: 'Requires exactly 2 academic recommendation letters.',
            exactQuote: 'Application submission requires: ... and exactly 2 academic letters of recommendation from STEM faculty.'
          },
          claimB: {
            sourceId: 'src-2',
            statement: 'Claims 3 recommendation letters are required to avoid disqualification.',
            exactQuote: 'Make sure you secure 3 letters of recommendation—last cycle two of my peers were disqualified because they only submitted two references!'
          },
          rootCause: 'Source 2 reflects an obsolete 2024 application protocol that was streamlined to 2 letters for the 2026 cycle.',
          verificationGuidance: 'Follow the official 2026 portal requirement of 2 letters; submitting unrequested 3rd letters may lock the upload interface.'
        }
      ],
      temporalWarnings: [
        {
          id: 'temp-1',
          sourceId: 'src-2',
          detectedCycleOrDate: 'October 12, 2024 (2024 Cycle)',
          warningType: 'OUTDATED_CYCLE',
          message: 'Source 2 refers to the obsolete 2024 cycle. Its listed December 1 deadline and $50k income cap are outdated and misleading for 2026 applicants.',
          riskFactor: 'High risk of following expired deadlines or outdated submission forms.'
        },
        {
          id: 'temp-2',
          sourceId: 'src-3',
          detectedCycleOrDate: 'August 20, 2025 (2025 Cycle)',
          warningType: 'STALE_DATE',
          message: 'Source 3 was published in 2025 prior to the 2026 legislative budget adjustments. Dependent thresholds must be verified against current 2026 state tables.',
          riskFactor: 'Moderate risk of relying on pre-budget revision numbers.'
        }
      ],
      checklist: [
        {
          id: 'task-1',
          priority: 'IMMEDIATE',
          title: 'Confirm Official Multi-Year Renewal Policy',
          actionText: 'Contact Global STEM Foundation coordinator to verify if the $15,000 grant renews automatically and what minimum annual GPA is required to maintain funding.',
          targetEntityOrSource: 'Global STEM Foundation Aid Office (support@stemfoundation.org)',
          category: 'Financial Planning',
          completed: false
        },
        {
          id: 'task-2',
          priority: 'IMMEDIATE',
          title: 'Verify Dependent-Adjusted Income Cap',
          actionText: 'Clarify with university financial aid whether the $60,000 limit or the state $65,000 dependent-adjusted threshold applies to your application.',
          targetEntityOrSource: 'University Financial Aid Office',
          category: 'Eligibility Verification',
          completed: false
        },
        {
          id: 'task-3',
          priority: 'IMPORTANT',
          title: 'Request Exactly 2 STEM Faculty Letters',
          actionText: 'Secure commitments from two STEM faculty members. Disregard the obsolete 2024 claim demanding 3 letters.',
          targetEntityOrSource: 'Department Professors / Academic Advisors',
          category: 'Documentation',
          completed: false
        },
        {
          id: 'task-4',
          priority: 'IMPORTANT',
          title: 'Check Aid Stacking & Taxability Policy',
          actionText: 'Inquire whether this scholarship offsets existing institutional grants or qualifies as taxable income.',
          targetEntityOrSource: 'Bursar & Tax Compliance Desk',
          category: 'Compliance',
          completed: false
        },
        {
          id: 'task-5',
          priority: 'OPTIONAL',
          title: 'Submit 7 Days Prior to March 31 Deadline',
          actionText: 'Finalize and submit the application by March 24, 2026 to avoid portal traffic bottlenecks since no appeal procedure exists for late entries.',
          targetEntityOrSource: 'Official Online Application Portal',
          category: 'Submission Strategy',
          completed: false
        }
      ]
    }
  },
  {
    id: 'stem-opt-visa',
    name: 'STEM OPT 24-Month Extension Rules',
    shortDesc: 'Work authorization scenario: Evaluates unemployment caps, conflicting employer reporting windows, and stale SEVP rules.',
    category: 'Immigration & Law',
    query: 'What are the critical compliance rules and gap areas for applying to the 24-Month STEM OPT extension?',
    sources: [
      {
        title: 'USCIS STEM OPT Guidance Page (2026 Update)',
        url: 'https://uscis.gov/working-in-the-united-states/stem-opt-2026',
        org: 'US Citizenship and Immigration Services',
        date: 'February 2, 2026',
        isOfficial: true,
        content: `Eligible F-1 students with qualifying STEM degrees may apply for a 24-month extension of post-completion OPT. 
Filing window: Up to 90 days before the current 12-month OPT expires and within 60 days of the DSO entering the recommendation into SEVIS. 
Employer must be enrolled in E-Verify and have an active EIN. Form I-983 Training Plan must be signed prior to DSO recommendation.`
      },
      {
        title: 'International Student Guide Blog (2023)',
        url: 'https://f1studentblog.org/opt-stem-rules-2023',
        org: 'International Student Network',
        date: 'June 14, 2023',
        isOfficial: false,
        content: `Students are allowed a total of 150 cumulative days of unemployment across both 12-month and 24-month OPT periods. 
You must report any change in legal name, address, or employer within 10 calendar days directly to your school's DSO.`
      },
      {
        title: 'University DSO Portal Notice (2025)',
        url: 'https://univ-international.edu/dso-advising/opt-stem',
        org: 'University International Center',
        date: 'November 10, 2025',
        isOfficial: false,
        content: `Important: SEVIS allows up to 30 calendar days to report employer material changes or evaluations, but students should report earlier. 
Notice: International travel while STEM OPT is pending approval requires a valid I-20 endorsed within 6 months, an expired EAD card, and the I-797C receipt notice, though border re-entry is at CBP discretion.`
      }
    ],
    precomputedResult: {
      id: 'result-stem-opt-visa',
      topic: 'STEM OPT 24-Month Extension: Filing Windows, Reporting Obligations & Travel Risks',
      timestamp: '2026-10-31T10:35:00.000Z',
      metrics: {
        completenessScore: 61,
        totalSources: 3,
        criticalGapsCount: 2,
        moderateGapsCount: 1,
        conflictsCount: 1,
        temporalWarningsCount: 1,
        summaryVerdict: 'Critical dark spot detected regarding travel re-entry risks while pending, plus a conflicting 10-day vs 30-day reporting window.'
      },
      sources: [
        {
          id: 'src-opt-1',
          title: 'USCIS STEM OPT Guidance Page (2026 Update)',
          url: 'https://uscis.gov/working-in-the-united-states/stem-opt-2026',
          domain: 'uscis.gov',
          authorOrOrg: 'US Citizenship and Immigration Services',
          publishedDate: 'February 2, 2026',
          cycleOrYear: '2026 Edition',
          reliability: 'OFFICIAL_PRIMARY',
          isOfficial: true,
          contentSnippet: 'Filing window: Up to 90 days before current OPT expires and within 60 days of DSO SEVIS recommendation... Employer must be E-Verify enrolled.'
        },
        {
          id: 'src-opt-2',
          title: 'International Student Guide Blog (2023)',
          url: 'https://f1studentblog.org/opt-stem-rules-2023',
          domain: 'f1studentblog.org',
          authorOrOrg: 'International Student Network',
          publishedDate: 'June 14, 2023',
          cycleOrYear: '2023 Archive',
          reliability: 'COMMUNITY_UNVERIFIED',
          isOfficial: false,
          contentSnippet: 'Students allowed 150 cumulative days of unemployment... Report changes within 10 calendar days directly to DSO.'
        },
        {
          id: 'src-opt-3',
          title: 'University DSO Portal Notice (2025)',
          url: 'https://univ-international.edu/dso-advising/opt-stem',
          domain: 'univ-international.edu',
          authorOrOrg: 'University International Center',
          publishedDate: 'November 10, 2025',
          cycleOrYear: '2025 Edition',
          reliability: 'SECONDARY_SOURCE',
          isOfficial: false,
          contentSnippet: 'SEVIS allows up to 30 calendar days to report employer material changes... Travel while pending requires 6-month endorsed I-20, expired EAD, I-797C receipt.'
        }
      ],
      facts: [
        {
          id: 'fact-opt-1',
          category: 'Filing Window',
          claim: 'Application must be filed within 90 days before initial OPT expires and within 60 days of DSO recommendation.',
          sourceId: 'src-opt-1',
          exactQuote: 'Filing window: Up to 90 days before the current 12-month OPT expires and within 60 days of the DSO entering the recommendation into SEVIS.',
          confidence: 0.99
        },
        {
          id: 'fact-opt-2',
          category: 'Employer E-Verify Mandate',
          claim: 'Employer must be actively enrolled in E-Verify and possess a valid Federal EIN.',
          sourceId: 'src-opt-1',
          exactQuote: 'Employer must be enrolled in E-Verify and have an active EIN.',
          confidence: 0.98
        }
      ],
      gaps: [
        {
          id: 'gap-opt-1',
          facet: 'Automatic 180-Day Work Authorization Cap Rule',
          severity: 'CRITICAL',
          explanation: 'None of the sources explicitly mention the automatic 180-day employment authorization continuation rule when an initial EAD expires while a timely filed I-765 remains pending.',
          impactOnDecision: 'Employer HR may incorrectly suspend applicant from payroll on the exact date their 12-month EAD card expires.',
          reasonMissing: 'Regulatory bridging details under 8 CFR 274a.12(b)(6)(iv) are not covered in general student blogs.',
          verificationQuestion: 'Will employer HR accept the I-797C receipt notice to extend I-9 work authorization for the statutory 180-day grace period?'
        },
        {
          id: 'gap-opt-2',
          facet: 'Mandatory 12-Month & 24-Month Form I-983 Self-Evaluation Milestones',
          severity: 'MODERATE',
          explanation: 'Sources note the I-983 training plan submission at filing, but omit the statutory requirement to submit formal 12-month and final 24-month self-evaluations.',
          impactOnDecision: 'Failure to file evaluations results in SEVIS termination and status violation.',
          reasonMissing: 'Post-approval reporting milestones are frequently omitted from pre-application checklists.',
          verificationQuestion: 'What is the exact DSO procedure and calendar deadline for submitting the mandatory 12-month I-983 progress review?'
        }
      ],
      conflicts: [
        {
          id: 'conf-opt-1',
          topic: 'Mandatory Employer Change Reporting Timeline',
          severity: 'CRITICAL',
          divergenceSummary: 'Student blog insists on a 10-day reporting rule, while the University Portal mentions a 30-day window.',
          claimA: {
            sourceId: 'src-opt-2',
            statement: 'Mandates reporting within 10 calendar days.',
            exactQuote: 'You must report any change in legal name, address, or employer within 10 calendar days directly to your school\'s DSO.'
          },
          claimB: {
            sourceId: 'src-opt-3',
            statement: 'Mentions SEVIS allows up to 30 calendar days for material changes.',
            exactQuote: 'SEVIS allows up to 30 calendar days to report employer material changes or evaluations, but students should report earlier.'
          },
          rootCause: 'Federal regulation specifies 10 days for address and basic employment status changes, but allows 30 days for formal Form I-983 material plan modifications.',
          verificationGuidance: 'Always adhere to the stricter 10-day window to avoid unintentional status jeopardy.'
        }
      ],
      temporalWarnings: [
        {
          id: 'temp-opt-1',
          sourceId: 'src-opt-2',
          detectedCycleOrDate: 'June 14, 2023',
          warningType: 'STALE_DATE',
          message: 'Source 2 was published in 2023. Recent SEVP fee adjustments and portal automation updates are not reflected.',
          riskFactor: 'May contain expired filing fee information.'
        }
      ],
      checklist: [
        {
          id: 'task-opt-1',
          priority: 'IMMEDIATE',
          title: 'Confirm Employer E-Verify Number & EIN',
          actionText: 'Obtain the verified E-Verify company ID number and valid Employer Identification Number directly from HR.',
          targetEntityOrSource: 'Employer HR / Legal Counsel',
          category: 'Employer Compliance',
          completed: false
        },
        {
          id: 'task-opt-2',
          priority: 'IMMEDIATE',
          title: 'File Form I-765 Prior to 12-Month EAD Expiration',
          actionText: 'Ensure USCIS receives Form I-765 with DSO recommendation before current EAD expiration to trigger the 180-day work extension.',
          targetEntityOrSource: 'USCIS Electronic Filing Portal',
          category: 'Filing Protocol',
          completed: false
        },
        {
          id: 'task-opt-3',
          priority: 'IMPORTANT',
          title: 'Avoid International Travel While Pending',
          actionText: 'Refrain from departing the United States while the STEM OPT application is pending without consulting a DSO, due to high border re-entry scrutiny.',
          targetEntityOrSource: 'University Designated School Official (DSO)',
          category: 'Travel Risk',
          completed: false
        }
      ]
    }
  },
  {
    id: 'clean-energy-rebate',
    name: '2026 Residential Clean Energy & EV Tax Rebate',
    shortDesc: 'Federal & State grant scenario: Flags missing battery manufacturing rules, conflicting MSRP caps, and stale 2023 guidance.',
    category: 'Government & Tax',
    query: 'What are the eligibility gaps and conflicting criteria for claiming the 2026 clean vehicle credit?',
    sources: [
      {
        title: 'IRS Clean Vehicle Credit Factsheet (FS-2026-04)',
        url: 'https://irs.gov/credits-deductions/clean-vehicle-credit-2026',
        org: 'Internal Revenue Service',
        date: 'January 8, 2026',
        isOfficial: true,
        content: `Under Section 30D, eligible taxpayers purchasing a qualifying new clean vehicle may receive up to $7,500. 
Modified Adjusted Gross Income (MAGI) caps: $300,000 for married couples filing jointly, $225,000 for heads of household, $150,000 for all other filers. 
Vehicle MSRP limits: $80,000 for vans, sport utility vehicles, and pickup trucks; $55,000 for other vehicles. 
Dealer must submit seller report to IRS Energy Credits Online portal at the time of sale.`
      },
      {
        title: 'Automotive Consumer Guide (2023 IRA Baseline)',
        url: 'https://autoconsumerweekly.org/ev-tax-credits-guide',
        org: 'Automotive Consumer Weekly',
        date: 'May 18, 2023',
        isOfficial: false,
        content: `Buyers can claim the $7,500 tax credit exclusively when filing their annual Form 1040 the following April. 
Ensure the vehicle has final assembly in North America. SUVs and sedans both qualify up to a maximum MSRP of $80,000 under preliminary guidance.`
      },
      {
        title: 'State Clean Transportation Alliance Guide (2025)',
        url: 'https://cleanenergytransit.state.org/rebate-rules-2025',
        org: 'State Clean Energy Agency',
        date: 'October 30, 2025',
        isOfficial: false,
        content: `State rebate of $2,500 can be combined with federal credits. However, state rebate requires recipient to retain registration for at least 36 consecutive months, or face full clawback. 
Note: Vehicles leased rather than purchased are governed under Section 45W commercial rules with no income caps.`
      }
    ],
    precomputedResult: {
      id: 'result-clean-energy-rebate',
      topic: '2026 Clean Vehicle Tax Credit: Point-of-Sale Transfers, MSRP Caps & State Clawback Risks',
      timestamp: '2026-10-31T10:40:00.000Z',
      metrics: {
        completenessScore: 59,
        totalSources: 3,
        criticalGapsCount: 2,
        moderateGapsCount: 1,
        conflictsCount: 2,
        temporalWarningsCount: 1,
        summaryVerdict: 'Substantial dark spots: Point-of-sale dealer credit transfer omitted in secondary source; conflicting MSRP classifications between sedans and SUVs.'
      },
      sources: [
        {
          id: 'src-ev-1',
          title: 'IRS Clean Vehicle Credit Factsheet (FS-2026-04)',
          url: 'https://irs.gov/credits-deductions/clean-vehicle-credit-2026',
          domain: 'irs.gov',
          authorOrOrg: 'Internal Revenue Service',
          publishedDate: 'January 8, 2026',
          cycleOrYear: '2026 Tax Year',
          reliability: 'OFFICIAL_PRIMARY',
          isOfficial: true,
          contentSnippet: 'Under Section 30D, eligible buyers can receive up to $7,500... MSRP limits: $80,000 for SUVs/trucks, $55,000 for sedans. MAGI limits: $300k joint, $150k single.'
        },
        {
          id: 'src-ev-2',
          title: 'Automotive Consumer Guide (2023 IRA Baseline)',
          url: 'https://autoconsumerweekly.org/ev-tax-credits-guide',
          domain: 'autoconsumerweekly.org',
          authorOrOrg: 'Automotive Consumer Weekly',
          publishedDate: 'May 18, 2023',
          cycleOrYear: '2023 Archive',
          reliability: 'COMMUNITY_UNVERIFIED',
          isOfficial: false,
          contentSnippet: 'Buyers can claim credit exclusively when filing Form 1040 next April... SUVs and sedans both qualify up to $80,000.'
        },
        {
          id: 'src-ev-3',
          title: 'State Clean Transportation Alliance Guide (2025)',
          url: 'https://cleanenergytransit.state.org/rebate-rules-2025',
          domain: 'cleanenergytransit.state.org',
          authorOrOrg: 'State Clean Energy Agency',
          publishedDate: 'October 30, 2025',
          cycleOrYear: '2025 Edition',
          reliability: 'SECONDARY_SOURCE',
          isOfficial: false,
          contentSnippet: 'State rebate of $2,500 stackable with federal credit. Requires 36-month registration retention or full clawback. Commercial leases bypass income caps under Section 45W.'
        }
      ],
      facts: [
        {
          id: 'fact-ev-1',
          category: 'Maximum Federal Credit',
          claim: 'Federal Section 30D credit provides up to $7,500 for qualifying clean vehicles.',
          sourceId: 'src-ev-1',
          exactQuote: 'Under Section 30D, eligible taxpayers purchasing a qualifying new clean vehicle may receive up to $7,500.',
          confidence: 0.99
        },
        {
          id: 'fact-ev-2',
          category: 'Income Limitation Thresholds',
          claim: 'MAGI caps are $300,000 for joint filers and $150,000 for single filers.',
          sourceId: 'src-ev-1',
          exactQuote: 'Modified Adjusted Gross Income (MAGI) caps: $300,000 for married couples filing jointly, $225,000 for heads of household, $150,000 for all other filers.',
          confidence: 0.99
        }
      ],
      gaps: [
        {
          id: 'gap-ev-1',
          facet: 'Foreign Entity of Concern (FEOC) Battery Sourcing Exclusion',
          severity: 'CRITICAL',
          explanation: 'None of the secondary sources detail the strict FEOC rules disqualifying vehicles with battery components or critical minerals extracted by specific foreign entities.',
          impactOnDecision: 'A buyer might purchase an EV expecting $7,500 back, only to learn the specific battery variant made the car completely ineligible.',
          reasonMissing: 'Mineral and component tracing rules change frequently and are omitted in consumer blogs.',
          verificationQuestion: 'Has the specific VIN been certified by the manufacturer on fueleconomy.gov as meeting 2026 FEOC battery criteria?'
        },
        {
          id: 'gap-ev-2',
          facet: 'State 36-Month Ownership Clawback Penalty',
          severity: 'CRITICAL',
          explanation: 'Federal guidance omits state-level clawback mandates that require refunding the full $2,500 rebate if the vehicle is sold or moved out of state before 3 years.',
          impactOnDecision: 'Drivers relocating or trading in cars early face unexpected collection demands from the state tax bureau.',
          reasonMissing: 'Federal IRS publications do not track state-specific administrative recapture terms.',
          verificationQuestion: 'Are you planning to maintain state vehicle registration for the mandatory 36-month minimum window?'
        }
      ],
      conflicts: [
        {
          id: 'conf-ev-1',
          topic: 'Instant Point-of-Sale Dealer Discount vs. Tax Return Claim',
          severity: 'CRITICAL',
          divergenceSummary: '2023 guide states credit can only be claimed the following April on Form 1040, whereas current law permits immediate point-of-sale deduction.',
          claimA: {
            sourceId: 'src-ev-1',
            statement: 'Allows instant transfer to dealer via Energy Credits Online.',
            exactQuote: 'Dealer must submit seller report to IRS Energy Credits Online portal at the time of sale.'
          },
          claimB: {
            sourceId: 'src-ev-2',
            statement: 'Claims credit can only be claimed when filing annual Form 1040.',
            exactQuote: 'Buyers can claim the $7,500 tax credit exclusively when filing their annual Form 1040 the following April.'
          },
          rootCause: 'Point-of-sale credit transfer became effective in 2024; the 2023 guide represents obsolete tax procedure.',
          verificationGuidance: 'Ensure your participating dealer is registered on IRS Energy Credits Online to discount the $7,500 directly from the invoice.'
        },
        {
          id: 'conf-ev-2',
          topic: 'Sedan MSRP Ceiling ($55k vs $80k)',
          severity: 'CRITICAL',
          divergenceSummary: '2023 guide claims all passenger vehicles qualify up to $80,000, while official IRS limits sedans to $55,000.',
          claimA: {
            sourceId: 'src-ev-1',
            statement: 'Explicitly caps sedans and hatchbacks at $55,000 MSRP.',
            exactQuote: 'Vehicle MSRP limits: $80,000 for vans, sport utility vehicles, and pickup trucks; $55,000 for other vehicles.'
          },
          claimB: {
            sourceId: 'src-ev-2',
            statement: 'Claims SUVs and sedans both qualify up to $80,000.',
            exactQuote: 'SUVs and sedans both qualify up to a maximum MSRP of $80,000 under preliminary guidance.'
          },
          rootCause: 'Early 2023 EPA classification rules temporarily blurred sedan/crossover boundaries before being finalized strictly at $55k.',
          verificationGuidance: 'Check the window sticker MSRP without options; sedans exceeding $55,000 receive zero federal tax credit.'
        }
      ],
      temporalWarnings: [
        {
          id: 'temp-ev-1',
          sourceId: 'src-ev-2',
          detectedCycleOrDate: 'May 18, 2023',
          warningType: 'OUTDATED_CYCLE',
          message: 'Source 2 is over 2.5 years old. Point-of-sale discounts and revised battery sourcing requirements introduced since 2024 are absent.',
          riskFactor: 'High risk of misinformation regarding payment timing and vehicle qualification.'
        }
      ],
      checklist: [
        {
          id: 'task-ev-1',
          priority: 'IMMEDIATE',
          title: 'Verify VIN on FuelEconomy.gov 2026 Eligible List',
          actionText: 'Confirm the specific Vehicle Identification Number qualifies for either full $7,500 or partial $3,750 before signing dealer agreement.',
          targetEntityOrSource: 'fueleconomy.gov Clean Vehicle Search Tool',
          category: 'Vehicle Eligibility',
          completed: false
        },
        {
          id: 'task-ev-2',
          priority: 'IMMEDIATE',
          title: 'Verify Dealer Registration with IRS Energy Credits Online',
          actionText: 'Ensure dealership is registered to transfer the tax credit directly into your purchase contract as an upfront discount.',
          targetEntityOrSource: 'Dealership Finance Office',
          category: 'Dealer Process',
          completed: false
        },
        {
          id: 'task-ev-3',
          priority: 'IMPORTANT',
          title: 'Review 3-Year State Registration Retention Mandate',
          actionText: 'Verify commitment to maintain in-state vehicle registration for 36 months to avoid full state rebate clawback.',
          targetEntityOrSource: 'State Department of Revenue',
          category: 'State Compliance',
          completed: false
        }
      ]
    }
  }
];

