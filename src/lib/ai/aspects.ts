import { GoogleGenerativeAI } from '@google/generative-ai';
import { Aspect } from '@/types';

const DEFAULT_ASPECTS_MAP: Record<string, Aspect[]> = {
  scholarship: [
    {
      id: 'asp-eligibility',
      label: 'Eligibility & Academic Prerequisites',
      importance: 'critical',
      rationale: 'Minimum qualifications (GPA, major, residency, full-time enrollment).',
      origin: 'ai-expected'
    },
    {
      id: 'asp-income',
      label: 'Income Ceiling & Financial Documents',
      importance: 'critical',
      rationale: 'Income limits, tax forms (1040/Schedule 1), and need-based criteria.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-deadline',
      label: 'Application Deadline & Submission Windows',
      importance: 'critical',
      rationale: 'Final cutoff dates for student filing and recommendation letters.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-amount',
      label: 'Award Amount & Disbursement Terms',
      importance: 'high',
      rationale: 'Monetary grant value, tuition matching, and payment schedule.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-renewal',
      label: 'Renewal Conditions & Maintenance Criteria',
      importance: 'critical',
      rationale: 'Multi-year continuation rules, annual re-application, GPA retention.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-contact',
      label: 'Official Helpdesk & Contact Channel',
      importance: 'medium',
      rationale: 'Institutional contacts, email inquiries, and phone support.',
      origin: 'ai-expected'
    }
  ],
  visa: [
    {
      id: 'asp-qualifying-degree',
      label: 'Qualifying Degree & CIP Code Eligibility',
      importance: 'critical',
      rationale: 'STEM CIP code alignment and accredited US university criteria.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-employer-everify',
      label: 'Employer E-Verify & Form I-983 Obligations',
      importance: 'critical',
      rationale: 'Employer federal enrollment and formal training plan compliance.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-reporting-windows',
      label: 'Reporting Deadlines & Validation Windows',
      importance: 'critical',
      rationale: 'Mandatory 10-day vs 30-day reporting intervals to DSO/SEVP.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-unemployment-cap',
      label: 'Unemployment Day Limits & Grace Periods',
      importance: 'high',
      rationale: 'Accrued unemployment limit (60 additional days) and transition grace.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-application-timing',
      label: 'USCIS Filing Window & Cap-Gap Extension',
      importance: 'high',
      rationale: 'Earliest/latest filing dates relative to initial EAD expiration.',
      origin: 'ai-expected'
    }
  ],
  grant: [
    {
      id: 'asp-equipment-caps',
      label: 'Vehicle/Equipment MSRP & Technology Caps',
      importance: 'critical',
      rationale: 'Price ceilings defining grant or tax rebate eligibility.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-income-limits',
      label: 'Taxpayer AGI Limits & Filing Categories',
      importance: 'critical',
      rationale: 'Individual and joint income disqualification thresholds.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-manufacturing-origin',
      label: 'Domestic Assembly & Critical Mineral Sourcing',
      importance: 'critical',
      rationale: 'Mandated supply chain and North American assembly percentages.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-rebate-transfer',
      label: 'Point-of-Sale Transfer & Dealer Registration',
      importance: 'high',
      rationale: 'Instant dealer deduction requirements and IRS energy credits.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-sunset-dates',
      label: 'Effective Sunset Dates & Year-Over-Year Shifts',
      importance: 'high',
      rationale: 'Annual phaseouts and battery quota escalations.',
      origin: 'ai-expected'
    }
  ],
  general: [
    {
      id: 'asp-core-prereqs',
      label: 'Core Prerequisites & Eligibility Rules',
      importance: 'critical',
      rationale: 'Primary entry criteria required before taking action.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-dates-deadlines',
      label: 'Key Deadlines & Effective Timeframes',
      importance: 'critical',
      rationale: 'Critical dates for registration, expiration, or renewals.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-documents-fees',
      label: 'Required Documents & Financial Obligations',
      importance: 'high',
      rationale: 'Forms, certifications, fees, and identification paperwork.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-exceptions-limits',
      label: 'Exceptions, Exclusions & Limitations',
      importance: 'high',
      rationale: 'Hidden disqualifiers, special cases, and unstated restrictions.',
      origin: 'ai-expected'
    },
    {
      id: 'asp-official-authority',
      label: 'Jurisdiction & Official Oversight Body',
      importance: 'medium',
      rationale: 'Enforcing authority, regulatory contact, and official appeals.',
      origin: 'ai-expected'
    }
  ]
};

/**
 * Determines which fallback category matches the question.
 */
function getFallbackAspects(question: string): Aspect[] {
  const q = question.toLowerCase();
  if (q.includes('scholarship') || q.includes('fellowship') || q.includes('tuition') || q.includes('college')) {
    return DEFAULT_ASPECTS_MAP.scholarship;
  }
  if (q.includes('opt') || q.includes('visa') || q.includes('immigration') || q.includes('uscis') || q.includes('stem')) {
    return DEFAULT_ASPECTS_MAP.visa;
  }
  if (q.includes('rebate') || q.includes('grant') || q.includes('tax credit') || q.includes('ev') || q.includes('energy')) {
    return DEFAULT_ASPECTS_MAP.grant;
  }
  return DEFAULT_ASPECTS_MAP.general;
}

/**
 * Generates the expected aspect framework for a research question.
 */
export async function generateAspects(question: string): Promise<Aspect[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return getFallbackAspects(question);
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = ai.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const prompt = `You are a research decision architect.
A user is investigating the following topic: "${question}".

What are the 5 to 7 essential aspects that ANY complete, competent set of documentation MUST cover for a person to make a sound decision without encountering surprise omissions?
For each aspect, assign an importance level (critical, high, medium, or low) and a concise rationale.

Output strictly valid JSON conforming to this schema:
[
  {
    "id": "asp-slug",
    "label": "Short Aspect Name",
    "importance": "critical" | "high" | "medium" | "low",
    "rationale": "Why this facet is indispensable for decisions",
    "origin": "ai-expected"
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed) && parsed.length >= 3) {
      return parsed.map((item, idx) => ({
        id: item.id || `asp-${idx + 1}`,
        label: item.label || `Aspect ${idx + 1}`,
        importance: ['critical', 'high', 'medium', 'low'].includes(item.importance)
          ? item.importance
          : 'high',
        rationale: item.rationale || 'Crucial decision aspect',
        origin: 'ai-expected' as const
      }));
    }

    return getFallbackAspects(question);
  } catch {
    return getFallbackAspects(question);
  }
}
