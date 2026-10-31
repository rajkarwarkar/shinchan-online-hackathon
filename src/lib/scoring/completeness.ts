import { Aspect, CoverageCell, Conflict, FreshnessFinding, Gap, ChecklistItem, Source } from '@/types';

export interface CompletenessCalculation {
  index: number; // 0 - 100
  breakdown: {
    aspectCoverageScore: number;
    conflictPenalty: number;
    stalePenalty: number;
  };
}

/**
 * Calculates the Completeness Index (0 - 100) based on weighted aspect coverage and penalties.
 */
export function calculateCompletenessIndex(
  aspects: Aspect[],
  coverage: CoverageCell[],
  conflicts: Conflict[],
  freshness: FreshnessFinding[]
): CompletenessCalculation {
  if (aspects.length === 0) {
    return {
      index: 0,
      breakdown: { aspectCoverageScore: 0, conflictPenalty: 0, stalePenalty: 0 }
    };
  }

  // 1. Aspect Weighting
  const weights: Record<string, number> = {
    critical: 1.0,
    high: 0.75,
    medium: 0.5,
    low: 0.25
  };

  let totalPossibleWeight = 0;
  let earnedWeight = 0;

  aspects.forEach((asp) => {
    const w = weights[asp.importance] || 0.5;
    totalPossibleWeight += w;

    const aspCells = coverage.filter((c) => c.aspectId === asp.id);
    const hasFull = aspCells.some((c) => c.status === 'full');
    const hasPartial = aspCells.some((c) => c.status === 'partial');

    if (hasFull) {
      earnedWeight += w;
    } else if (hasPartial) {
      earnedWeight += w * 0.5;
    }
  });

  const baseScore = Math.round((earnedWeight / (totalPossibleWeight || 1)) * 100);

  // 2. Conflict Penalties (Critical: -12, Moderate: -6)
  let conflictPenalty = 0;
  conflicts.forEach((c) => {
    conflictPenalty += c.severity === 'CRITICAL' ? 12 : 6;
  });

  // 3. Stale / Undated Source Penalties (-8 points each)
  let stalePenalty = 0;
  freshness.forEach((f) => {
    if (f.status === 'older-cycle' || f.status === 'possibly-outdated') {
      stalePenalty += 8;
    } else if (f.status === 'undated') {
      stalePenalty += 6;
    }
  });

  const rawScore = baseScore - conflictPenalty - stalePenalty;
  const finalIndex = Math.max(0, Math.min(100, rawScore));

  return {
    index: finalIndex,
    breakdown: {
      aspectCoverageScore: baseScore,
      conflictPenalty,
      stalePenalty
    }
  };
}

/**
 * Synthesizes gaps, conflicts, and freshness findings into a prioritized verification checklist.
 */
export function generateVerificationChecklist(
  gaps: Gap[],
  conflicts: Conflict[],
  freshness: FreshnessFinding[],
  sources: Source[]
): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // Find official or highest-credibility source for verification
  const highestCredSource = [...sources].sort((a, b) => b.credibilityScore - a.credibilityScore)[0];
  const defaultVerifyUrl = highestCredSource?.url;

  // 1. Generate P0 tasks from Critical Conflicts
  conflicts.forEach((conf, idx) => {
    const isP0 = conf.severity === 'CRITICAL' || conf.type === 'value-mismatch' || conf.type === 'date-mismatch';
    items.push({
      id: `chk-conf-${idx + 1}`,
      priority: isP0 ? 'P0' : 'P1',
      action: `Resolve conflicting criteria between ${conf.claimA.value || 'Claim A'} and ${conf.claimB.value || 'Claim B'}`,
      why: `${conf.possibleExplanation} Unresolved discrepancy could invalidate the decision.`,
      linkedFindingIds: [conf.id],
      suggestedVerificationSource: defaultVerifyUrl,
      done: false
    });
  });

  // 2. Generate P0 / P1 tasks from Critical Gaps
  gaps.forEach((gap, idx) => {
    const isCritical = gap.severity === 'CRITICAL';
    items.push({
      id: `chk-gap-${idx + 1}`,
      priority: isCritical ? 'P0' : 'P1',
      action: `Request explicit written clarification on ${gap.title}`,
      why: gap.whyItMatters,
      linkedFindingIds: [gap.id],
      suggestedVerificationSource: defaultVerifyUrl,
      done: false
    });
  });

  // 3. Generate P1 / P2 tasks from Stale / Older Cycle Sources
  freshness.forEach((fresh, idx) => {
    if (fresh.status === 'older-cycle' || fresh.status === 'possibly-outdated') {
      const src = sources.find((s) => s.id === fresh.sourceId);
      items.push({
        id: `chk-fresh-${idx + 1}`,
        priority: 'P1',
        action: `Discard dated figures from ${src?.publisher || 'archived source'} and verify current active cycle`,
        why: fresh.reason,
        linkedFindingIds: [fresh.sourceId],
        suggestedVerificationSource: defaultVerifyUrl,
        done: false
      });
    }
  });

  return items;
}

