import { describe, it, expect } from 'vitest';
import { calculateCompletenessIndex } from '@/lib/scoring/completeness';
import { Aspect, CoverageCell, Conflict, FreshnessFinding } from '@/types';

describe('Completeness Index Scorer', () => {
  const aspects: Aspect[] = [
    { id: 'asp-1', label: 'Eligibility', importance: 'critical', rationale: '', origin: 'ai-expected' },
    { id: 'asp-2', label: 'Deadlines', importance: 'critical', rationale: '', origin: 'ai-expected' },
    { id: 'asp-3', label: 'Fees', importance: 'high', rationale: '', origin: 'ai-expected' }
  ];

  it('calculates 100% when all aspects have full coverage without conflicts or staleness', () => {
    const coverage: CoverageCell[] = [
      { aspectId: 'asp-1', sourceId: 'src-1', status: 'full', claimIds: ['c1'] },
      { aspectId: 'asp-2', sourceId: 'src-1', status: 'full', claimIds: ['c2'] },
      { aspectId: 'asp-3', sourceId: 'src-1', status: 'full', claimIds: ['c3'] }
    ];

    const result = calculateCompletenessIndex(aspects, coverage, [], []);
    expect(result.index).toBe(100);
    expect(result.breakdown.conflictPenalty).toBe(0);
    expect(result.breakdown.stalePenalty).toBe(0);
  });

  it('penalizes critical conflicts appropriately', () => {
    const coverage: CoverageCell[] = [
      { aspectId: 'asp-1', sourceId: 'src-1', status: 'full', claimIds: ['c1'] },
      { aspectId: 'asp-2', sourceId: 'src-1', status: 'full', claimIds: ['c2'] },
      { aspectId: 'asp-3', sourceId: 'src-1', status: 'full', claimIds: ['c3'] }
    ];

    const dummyConflict: Conflict = {
      id: 'conf-1',
      aspectId: 'asp-1',
      claimA: {} as any,
      claimB: {} as any,
      type: 'value-mismatch',
      possibleExplanation: '',
      severity: 'CRITICAL',
      trust: 'SOURCED'
    };

    const result = calculateCompletenessIndex(aspects, coverage, [dummyConflict], []);
    expect(result.index).toBe(88); // 100 - 12 = 88
    expect(result.breakdown.conflictPenalty).toBe(12);
  });
});
