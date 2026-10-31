import { GoogleGenerativeAI } from '@google/generative-ai';
import { Aspect, Claim, Conflict, Source } from '@/types';

/**
 * Deterministic fallback contradiction detector between verified claims.
 */
function detectHeuristicConflicts(aspects: Aspect[], claims: Claim[], sources: Source[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const verifiedClaims = claims.filter((c) => c.quoteVerified);

  aspects.forEach((asp) => {
    const aspClaims = verifiedClaims.filter((c) => c.aspectId === asp.id);
    if (aspClaims.length < 2) return;

    for (let i = 0; i < aspClaims.length; i++) {
      for (let j = i + 1; j < aspClaims.length; j++) {
        const a = aspClaims[i];
        const b = aspClaims[j];
        if (a.sourceId === b.sourceId) continue; // Same source

        const srcA = sources.find((s) => s.id === a.sourceId);
        const srcB = sources.find((s) => s.id === b.sourceId);

        // Check 1: Explicit differing values/numbers
        if (a.value && b.value && a.value.toLowerCase() !== b.value.toLowerCase()) {
          const isDate = a.value.match(/\d{4}/) || b.value.match(/\d{4}/);
          conflicts.push({
            id: `conf-${a.id}-${b.id}`,
            aspectId: asp.id,
            claimA: a,
            claimB: b,
            type: isDate ? 'date-mismatch' : 'value-mismatch',
            possibleExplanation: srcA?.detectedCycleLabel !== srcB?.detectedCycleLabel
              ? `Sources reflect differing application cycles (${srcA?.detectedCycleLabel || 'Unknown'} vs ${srcB?.detectedCycleLabel || 'Unknown'}).`
              : 'Different institutional jurisdictions or co-sponsorship tiers may enforce separate thresholds.',
            severity: asp.importance === 'critical' ? 'CRITICAL' : 'MODERATE',
            trust: 'SOURCED'
          });
          continue;
        }

        // Check 2: Numerical disparity in statements
        const numsA = a.statement.match(/\$?\d+(?:,\d+)*(?:\.\d+)?/g);
        const numsB = b.statement.match(/\$?\d+(?:,\d+)*(?:\.\d+)?/g);
        if (numsA && numsB && numsA[0] !== numsB[0]) {
          conflicts.push({
            id: `conf-${a.id}-${b.id}`,
            aspectId: asp.id,
            claimA: a,
            claimB: b,
            type: 'value-mismatch',
            possibleExplanation: 'Numbers may refer to different eligibility categories or separate disbursement stages.',
            severity: 'MODERATE',
            trust: 'SOURCED'
          });
        }
      }
    }
  });

  return conflicts;
}

/**
 * Semantic contradiction detection comparing verified claims.
 */
export async function detectConflicts(
  aspects: Aspect[],
  claims: Claim[],
  sources: Source[]
): Promise<Conflict[]> {
  const verifiedClaims = claims.filter((c) => c.quoteVerified);
  if (verifiedClaims.length < 2) return [];

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return detectHeuristicConflicts(aspects, claims, sources);
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

    const claimsPayload = verifiedClaims.map((c) => {
      const src = sources.find((s) => s.id === c.sourceId);
      return {
        id: c.id,
        aspectId: c.aspectId,
        sourceTitle: src?.title,
        statement: c.statement,
        value: c.value,
        quote: c.quote,
        cycle: src?.detectedCycleLabel
      };
    });

    const prompt = `You are a forensic legal and policy contradiction analyzer.
Examine the following verified factual claims extracted from different publications on the same topic.

CLAIMS DATA:
${JSON.stringify(claimsPayload, null, 2)}

TASK:
Identify pairs of claims that are mutually incompatible, state differing numbers/deadlines, or assert conflicting policy mandates.
RULE 1: ONLY compare claims where BOTH carry direct verified quotes.
RULE 2: For every conflict, formulate a realistic "possibleExplanation" (e.g. "One source refers to an expired 2024 cycle", "One source describes state-level matching while the other describes foundation rules").
RULE 3: If two claims complement each other without clashing, DO NOT flag them.

Respond in strict JSON:
[
  {
    "aspectId": "aspect-id",
    "claimAId": "claim-id-1",
    "claimBId": "claim-id-2",
    "type": "value-mismatch" | "date-mismatch" | "policy-contradiction",
    "possibleExplanation": "Clear plausible explanation of why they differ",
    "severity": "CRITICAL" | "MODERATE"
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed)) {
      return detectHeuristicConflicts(aspects, claims, sources);
    }

    const conflicts: Conflict[] = [];

    parsed.forEach((item, idx) => {
      const claimA = verifiedClaims.find((c) => c.id === item.claimAId);
      const claimB = verifiedClaims.find((c) => c.id === item.claimBId);

      // NON-NEGOTIABLE PRINCIPLE: Both must be quoteVerified!
      if (claimA && claimB && claimA.quoteVerified && claimB.quoteVerified) {
        conflicts.push({
          id: `conf-ai-${idx + 1}`,
          aspectId: item.aspectId || claimA.aspectId,
          claimA,
          claimB,
          type: ['value-mismatch', 'date-mismatch', 'policy-contradiction'].includes(item.type)
            ? item.type
            : 'policy-contradiction',
          possibleExplanation: item.possibleExplanation || 'Differing publication cycles or applicant tiers.',
          severity: item.severity === 'CRITICAL' ? 'CRITICAL' : 'MODERATE',
          trust: 'SOURCED'
        });
      }
    });

    return conflicts.length > 0 ? conflicts : detectHeuristicConflicts(aspects, claims, sources);
  } catch {
    return detectHeuristicConflicts(aspects, claims, sources);
  }
}

