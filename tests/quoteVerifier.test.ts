import { describe, it, expect } from 'vitest';
import { verifyQuote, normalizeText, calculateJaccardSimilarity } from '@/lib/verify/quoteVerifier';

describe('Deterministic Quote Verifier', () => {
  const sampleDocument = `
    The State Educational Grant program provides up to $5,000 for qualifying applicants.
    All applications must be submitted by September 15, 2026.
    Late submissions will be rejected without exception.
  `;

  it('verifies exact substring matches with 1.0 confidence', () => {
    const quote = 'All applications must be submitted by September 15, 2026.';
    const result = verifyQuote(sampleDocument, quote);

    expect(result.isVerified).toBe(true);
    expect(result.confidence).toBe(1.0);
    expect(result.matchType).toBe('exact');
    expect(result.offsets).toBeDefined();
    expect(sampleDocument.slice(result.offsets!.start, result.offsets!.end)).toBe(quote);
  });

  it('verifies normalized quotes with punctuation differences or whitespace shifts', () => {
    const quote = 'The State Educational Grant program provides up to $5,000 for qualifying applicants.';
    const result = verifyQuote(sampleDocument, quote);

    expect(result.isVerified).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.95);
  });

  it('rejects completely fabricated quotes', () => {
    const fabricatedQuote = 'Students receive a guaranteed Tesla vehicle and free housing.';
    const result = verifyQuote(sampleDocument, fabricatedQuote);

    expect(result.isVerified).toBe(false);
    expect(result.confidence).toBeLessThan(0.5);
    expect(result.matchType).toBe('failed');
  });

  it('computes word-level Jaccard similarity accurately', () => {
    const a = 'All applications must be submitted on time';
    const b = 'All applications must be submitted by midnight';
    const sim = calculateJaccardSimilarity(a, b);

    expect(sim).toBeGreaterThan(0.5);
  });
});

