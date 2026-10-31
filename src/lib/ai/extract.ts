import { GoogleGenerativeAI } from '@google/generative-ai';
import { Source, Aspect, Claim } from '@/types';
import { verifyQuote } from '@/lib/verify/quoteVerifier';

interface RawClaimExtraction {
  aspectId: string;
  statement: string;
  value?: string;
  quote: string;
  confidence: number;
}

/**
 * Heuristic fallback claim extractor when Gemini API is unavailable.
 */
function extractHeuristicClaims(source: Source, aspects: Aspect[]): Claim[] {
  const claims: Claim[] = [];
  const text = source.text;
  const sentences = text.split(/(?<=[.!?])\s+/);

  aspects.forEach((asp) => {
    const keywords = asp.label.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    
    for (const sentence of sentences) {
      if (sentence.length < 25 || sentence.length > 300) continue;
      const lower = sentence.toLowerCase();
      
      const matchCount = keywords.filter((k) => lower.includes(k)).length;
      if (matchCount >= 2 || (keywords.length === 1 && matchCount === 1)) {
        const vResult = verifyQuote(text, sentence.trim());
        claims.push({
          id: `clm-${source.id}-${claims.length + 1}`,
          sourceId: source.id,
          aspectId: asp.id,
          statement: sentence.trim(),
          quote: sentence.trim(),
          quoteVerified: vResult.isVerified,
          quoteOffset: vResult.offsets,
          confidence: vResult.confidence
        });
        break; // One claim per aspect in heuristic mode
      }
    }
  });

  return claims;
}

/**
 * Extracts structured claims mapped to aspects from a source document.
 */
export async function extractClaimsFromSource(
  source: Source,
  aspects: Aspect[]
): Promise<Claim[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return extractHeuristicClaims(source, aspects);
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

    const aspectsBrief = aspects
      .map((a) => `- ID: ${a.id} | Aspect: ${a.label} (${a.importance})`)
      .join('\n');

    const prompt = `You are a strict, forensic research extraction engine.
Examine the following SOURCE DOCUMENT and map any verified factual statements to the listed aspects.

ASPECTS TO LOOK FOR:
${aspectsBrief}

SOURCE DOCUMENT (Title: ${source.title}):
"""
${source.text.slice(0, 8000)}
"""

CRITICAL EXTRACTION RULES:
1. Every claim MUST include a verbatim quote copied word-for-word from the text.
2. DO NOT paraphrase in the "quote" field. If an exact quote cannot be copied from the text, DO NOT emit the claim.
3. If an aspect is NOT addressed in the document, omit it entirely. Do not invent assumptions.
4. Extract normalized entities into "value" if applicable (e.g. "$12,500", "September 15, 2026", "3.8 GPA").

Respond in valid JSON adhering to:
[
  {
    "aspectId": "aspect-id",
    "statement": "Clear factual summary of what the source states",
    "value": "$50,000",
    "quote": "verbatim sentence copied from document",
    "confidence": 0.95
  }
]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed: RawClaimExtraction[] = JSON.parse(responseText);

    if (!Array.isArray(parsed)) {
      return extractHeuristicClaims(source, aspects);
    }

    const validatedClaims: Claim[] = [];

    parsed.forEach((item, idx) => {
      if (!item.aspectId || !item.quote || !item.statement) return;

      // Deterministic Server-Side Quote Verification
      const vResult = verifyQuote(source.text, item.quote);

      validatedClaims.push({
        id: `clm-${source.id}-${idx + 1}`,
        sourceId: source.id,
        aspectId: item.aspectId,
        statement: item.statement,
        value: item.value,
        quote: item.quote,
        quoteVerified: vResult.isVerified,
        quoteOffset: vResult.offsets,
        confidence: vResult.isVerified ? item.confidence || 0.95 : 0.35
      });
    });

    return validatedClaims.length > 0
      ? validatedClaims
      : extractHeuristicClaims(source, aspects);
  } catch {
    return extractHeuristicClaims(source, aspects);
  }
}
