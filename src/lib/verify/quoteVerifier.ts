export interface QuoteVerificationResult {
  isVerified: boolean;
  confidence: number;
  offsets?: {
    start: number;
    end: number;
  };
  matchedSnippet?: string;
  matchType?: 'exact' | 'normalized' | 'fuzzy' | 'failed';
}

/**
 * Normalizes punctuation and whitespace sequences.
 */
export function normalizeText(str: string): string {
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates word-level Jaccard similarity between two strings.
 */
export function calculateJaccardSimilarity(strA: string, strB: string): number {
  const wordsA = new Set(normalizeText(strA).toLowerCase().split(' '));
  const wordsB = new Set(normalizeText(strB).toLowerCase().split(' '));

  let intersection = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) {
      intersection++;
    }
  }

  const union = wordsA.size + wordsB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Verifies that a purported quote actually exists in the source text.
 */
export function verifyQuote(sourceText: string, quote: string): QuoteVerificationResult {
  if (!quote || quote.trim().length === 0 || !sourceText || sourceText.trim().length === 0) {
    return { isVerified: false, confidence: 0, matchType: 'failed' };
  }

  const cleanQuote = quote.trim();

  // ----------------------------------------------------
  // Stage 1: Exact Substring Search
  // ----------------------------------------------------
  const exactIndex = sourceText.indexOf(cleanQuote);
  if (exactIndex !== -1) {
    return {
      isVerified: true,
      confidence: 1.0,
      offsets: {
        start: exactIndex,
        end: exactIndex + cleanQuote.length
      },
      matchedSnippet: cleanQuote,
      matchType: 'exact'
    };
  }

  // ----------------------------------------------------
  // Stage 2: Normalized Substring Search (Punctuation & Case)
  // ----------------------------------------------------
  const normSource = normalizeText(sourceText).toLowerCase();
  const normQuote = normalizeText(cleanQuote).toLowerCase();

  const normIndex = normSource.indexOf(normQuote);
  if (normIndex !== -1) {
    // Estimate original raw text offset
    const approxRatio = sourceText.length / (normSource.length || 1);
    const estStart = Math.min(Math.floor(normIndex * approxRatio), sourceText.length - 1);
    const estEnd = Math.min(estStart + cleanQuote.length, sourceText.length);

    return {
      isVerified: true,
      confidence: 0.95,
      offsets: {
        start: estStart,
        end: estEnd
      },
      matchedSnippet: sourceText.slice(estStart, estEnd) || cleanQuote,
      matchType: 'normalized'
    };
  }

  // ----------------------------------------------------
  // Stage 3: Sliding Window Fuzzy Match
  // ----------------------------------------------------
  const quoteWords = normQuote.split(' ');
  if (quoteWords.length >= 4) {
    const sourceWords = normSource.split(' ');
    const windowSize = quoteWords.length;
    let bestSim = 0;
    let bestIdx = -1;

    for (let i = 0; i <= sourceWords.length - windowSize; i++) {
      const windowStr = sourceWords.slice(i, i + windowSize).join(' ');
      const sim = calculateJaccardSimilarity(normQuote, windowStr);
      if (sim > bestSim) {
        bestSim = sim;
        bestIdx = i;
      }
    }

    if (bestSim >= 0.82 && bestIdx !== -1) {
      const charEst = Math.floor((bestIdx / (sourceWords.length || 1)) * sourceText.length);
      return {
        isVerified: true,
        confidence: Math.round(bestSim * 100) / 100,
        offsets: {
          start: Math.max(0, charEst),
          end: Math.min(sourceText.length, charEst + cleanQuote.length)
        },
        matchedSnippet: cleanQuote,
        matchType: 'fuzzy'
      };
    }
  }

  // Verification failed
  return {
    isVerified: false,
    confidence: 0.2,
    matchType: 'failed'
  };
}
