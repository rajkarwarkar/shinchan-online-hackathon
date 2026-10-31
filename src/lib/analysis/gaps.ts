import { Aspect, Source, Claim, Gap, CoverageCell } from '@/types';

/**
 * Detects information gaps (dark spots) based on aspect importance and source coverage.
 */
export function detectGaps(
  aspects: Aspect[],
  sources: Source[],
  claims: Claim[],
  coverage: CoverageCell[]
): Gap[] {
  const gaps: Gap[] = [];

  aspects.forEach((asp) => {
    const aspCells = coverage.filter((c) => c.aspectId === asp.id);
    const coveredCells = aspCells.filter((c) => c.status === 'full' || c.status === 'partial');
    const fullCells = aspCells.filter((c) => c.status === 'full');

    // Case 1: Total Dark Spot (No verified claims from any source)
    if (coveredCells.length === 0) {
      const severity = asp.importance === 'critical' ? 'CRITICAL' : asp.importance === 'high' ? 'MODERATE' : 'LOW';
      gaps.push({
        id: `gap-${asp.id}-omission`,
        aspectId: asp.id,
        severity,
        title: `Zero Coverage for ${asp.label}`,
        explanation: `None of the ${sources.length} reviewed documents provide verifiable rules or details regarding ${asp.label.toLowerCase()}.`,
        evidenceRefs: sources.map((s) => s.id),
        trust: 'AI_SUGGESTED',
        whyItMatters: asp.rationale
      });
      return;
    }

    // Case 2: Fragile Single-Source Dependency for Critical Aspect
    if (asp.importance === 'critical' && coveredCells.length === 1 && sources.length >= 2) {
      const singleSourceId = coveredCells[0].sourceId;
      const singleSource = sources.find((s) => s.id === singleSourceId);
      const isOfficial = singleSource?.kind === 'official' || (singleSource?.credibilityScore || 0) >= 0.85;

      if (!isOfficial) {
        gaps.push({
          id: `gap-${asp.id}-unverified-single`,
          aspectId: asp.id,
          severity: 'MODERATE',
          title: `Single Non-Official Source for ${asp.label}`,
          explanation: `Information for this critical aspect relies solely on a single third-party source (${singleSource?.publisher || 'Unknown'}). No independent confirmation found in the official channels reviewed.`,
          evidenceRefs: [singleSourceId],
          trust: 'AI_SUGGESTED',
          whyItMatters: `High-stakes decisions should not depend on uncorroborated third-party blogs without primary source confirmation.`
        });
      }
    }

    // Case 3: Partial or Vague Coverage
    if (fullCells.length === 0 && coveredCells.length > 0) {
      gaps.push({
        id: `gap-${asp.id}-partial`,
        aspectId: asp.id,
        severity: 'LOW',
        title: `Incomplete Information on ${asp.label}`,
        explanation: `Statements were found regarding ${asp.label.toLowerCase()}, but they lack specific quantifiable conditions, numerical thresholds, or explicit filing procedures.`,
        evidenceRefs: coveredCells.map((c) => c.sourceId),
        trust: 'AI_SUGGESTED',
        whyItMatters: `Ambiguous criteria can lead to filing delays or administrative rejection.`
      });
    }
  });

  return gaps;
}

