import { Source, FreshnessFinding } from '@/types';

/**
 * Evaluates document freshness, temporal staleness, and cycle obsolescence relative to runtime date.
 */
export function evaluateFreshness(sources: Source[]): FreshnessFinding[] {
  const findings: FreshnessFinding[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();

  // Find the most recent cycle year across all sources
  let maxDetectedYear = currentYear;
  sources.forEach((s) => {
    if (s.detectedCycleLabel) {
      const match = s.detectedCycleLabel.match(/20\d{2}/);
      if (match) {
        const y = parseInt(match[0], 10);
        if (y > maxDetectedYear) maxDetectedYear = y;
      }
    }
  });

  sources.forEach((source) => {
    const hasDate = Boolean(source.publishedDate || source.modifiedDate);
    const dateStr = source.modifiedDate || source.publishedDate;

    // 1. Undated Source Warning
    if (!hasDate) {
      findings.push({
        sourceId: source.id,
        status: 'undated',
        reason: 'Document lacks machine-readable or explicit publishing timestamps.',
        evidence: 'No valid <meta> publish_time, JSON-LD datePublished, or in-text update header detected.'
      });
      return;
    }

    const docDate = new Date(dateStr!);
    const ageInDays = Math.floor((now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24));

    // 2. Older Cycle Detected (e.g. 2024 when current cycle is 2026)
    if (source.detectedCycleLabel) {
      const match = source.detectedCycleLabel.match(/20\d{2}/);
      if (match) {
        const docYear = parseInt(match[0], 10);
        if (docYear < maxDetectedYear) {
          findings.push({
            sourceId: source.id,
            status: 'older-cycle',
            reason: `Document references an earlier application cycle (${source.detectedCycleLabel}) while newer sources cite ${maxDetectedYear}.`,
            evidence: `Detected cycle label "${source.detectedCycleLabel}" is superseded by active cycle.`
          });
          return;
        }
      }
    }

    // 3. Stale Document (> 365 Days Relative to Today)
    if (ageInDays > 365) {
      const months = Math.floor(ageInDays / 30);
      findings.push({
        sourceId: source.id,
        status: 'possibly-outdated',
        reason: `Document is ${months} months old and may reflect deprecated policy guidelines or expired fees.`,
        evidence: `Last recorded date was ${docDate.toLocaleDateString()} (${ageInDays} days ago).`
      });
      return;
    }

    // 4. Current Document
    findings.push({
      sourceId: source.id,
      status: 'current',
      reason: 'Document was published or updated within the current annual cycle.',
      evidence: `Verified update date: ${docDate.toLocaleDateString()}.`
    });
  });

  return findings;
}
