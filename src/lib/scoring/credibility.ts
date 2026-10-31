import { SourceKind } from '@/types';

export interface CredibilityEvaluation {
  score: number; // 0.00 - 1.00
  kind: SourceKind;
  reasons: string[];
}

/**
 * Computes deterministic credibility score based on domain TLD, transport, provenance, and structure.
 */
export function evaluateDomainCredibility(params: {
  url?: string;
  publisher?: string;
  author?: string;
  hasDate: boolean;
  wordCount: number;
  isUserPasted?: boolean;
}): CredibilityEvaluation {
  const { url, publisher, author, hasDate, wordCount, isUserPasted } = params;

  if (isUserPasted || !url) {
    return {
      score: 0.55,
      kind: 'user-text',
      reasons: ['User-pasted direct content without verified web domain provenance']
    };
  }

  let score = 0.20; // Baseline for reachable web document
  const reasons: string[] = ['Reachable public web document'];
  let kind: SourceKind = 'third-party';

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    // 1. HTTPS Protocol
    if (parsed.protocol === 'https:') {
      score += 0.10;
      reasons.push('Encrypted HTTPS transport verified');
    }

    // 2. TLD & Domain Authority
    if (
      host.endsWith('.gov') || 
      host.endsWith('.gov.in') || 
      host.endsWith('.mil') || 
      host.includes('.nic.in')
    ) {
      score += 0.40;
      kind = 'official';
      reasons.push('Accredited sovereign government/public authority domain (.gov/.nic)');
    } else if (
      host.endsWith('.edu') || 
      host.endsWith('.ac.in') || 
      host.endsWith('.edu.in') ||
      host.endsWith('.ac.uk')
    ) {
      score += 0.35;
      kind = 'institutional';
      reasons.push('Accredited higher-education institutional domain (.edu/.ac)');
    } else if (host.endsWith('.org')) {
      score += 0.15;
      kind = 'third-party';
      reasons.push('Non-profit or foundation registry (.org)');
    } else {
      // News domains heuristic
      const newsKeywords = ['news', 'times', 'post', 'herald', 'gazette', 'tribune', 'reuters', 'bloomberg'];
      if (newsKeywords.some((k) => host.includes(k))) {
        score += 0.15;
        kind = 'news';
        reasons.push('Recognized news publication domain');
      }
    }

    // 3. Provenance & Attribution (Author or Established Publisher)
    if (author && author.trim().length > 2) {
      score += 0.10;
      reasons.push(`Explicit byline attribution: ${author}`);
    } else if (publisher && publisher.trim().length > 2) {
      score += 0.08;
      reasons.push(`Identified publisher: ${publisher}`);
    }

    // 4. Temporal Anchor
    if (hasDate) {
      score += 0.15;
      reasons.push('Document contains machine-readable or explicit update timestamp');
    } else {
      reasons.push('Warning: No verified publication date detected');
    }

    // 5. Content Substantiality
    if (wordCount >= 300) {
      score += 0.08;
      reasons.push(`Substantial document body (${wordCount} words)`);
    } else if (wordCount < 100) {
      score -= 0.10;
      reasons.push(`Sparse or abbreviated page content (${wordCount} words)`);
    }

    const finalScore = Math.max(0.1, Math.min(1.0, Math.round(score * 100) / 100));

    return {
      score: finalScore,
      kind,
      reasons
    };
  } catch {
    return {
      score: 0.30,
      kind: 'third-party',
      reasons: ['Malformed URL structure']
    };
  }
}

