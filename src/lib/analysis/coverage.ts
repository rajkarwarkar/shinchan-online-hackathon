import { Aspect, Source, Claim, CoverageCell } from '@/types';

/**
 * Computes the 2D Coverage Heatmap Matrix (Aspects × Sources).
 */
export function computeCoverageMatrix(
  aspects: Aspect[],
  sources: Source[],
  claims: Claim[]
): CoverageCell[] {
  const cells: CoverageCell[] = [];

  aspects.forEach((asp) => {
    sources.forEach((src) => {
      // Find verified claims for this aspect and source
      const matchingClaims = claims.filter(
        (c) => c.aspectId === asp.id && c.sourceId === src.id && c.quoteVerified
      );

      let status: 'none' | 'partial' | 'full' = 'none';

      if (matchingClaims.length > 0) {
        // If has high confidence verified claim, consider full; otherwise partial
        const maxConf = Math.max(...matchingClaims.map((c) => c.confidence));
        status = maxConf >= 0.85 ? 'full' : 'partial';
      }

      cells.push({
        aspectId: asp.id,
        sourceId: src.id,
        status,
        claimIds: matchingClaims.map((c) => c.id)
      });
    });
  });

  return cells;
}
