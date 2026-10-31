import { NextRequest, NextResponse } from 'next/server';
import { generateAspects } from '@/lib/ai/aspects';
import { extractClaimsFromSource } from '@/lib/ai/extract';
import { computeCoverageMatrix } from '@/lib/analysis/coverage';
import { detectGaps } from '@/lib/analysis/gaps';
import { detectConflicts } from '@/lib/analysis/conflicts';
import { evaluateFreshness } from '@/lib/analysis/freshness';
import { calculateCompletenessIndex, generateVerificationChecklist } from '@/lib/scoring/completeness';
import { Source, Aspect, Claim, AnalysisReport } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, sources, aspects: clientAspects } = body as {
      question?: string;
      sources?: Source[];
      aspects?: Aspect[];
    };

    if (!question || !question.trim()) {
      return NextResponse.json(
        { success: false, error: 'A research question or decision goal is required.' },
        { status: 400 }
      );
    }

    if (!sources || !Array.isArray(sources) || sources.length < 2) {
      return NextResponse.json(
        { success: false, error: 'At least 2 sources are required to run cross-examination.' },
        { status: 400 }
      );
    }

    // 1. Generate or Adopt Aspects Framework
    const aspects: Aspect[] =
      clientAspects && clientAspects.length > 0
        ? clientAspects
        : await generateAspects(question);

    // 2. Parallel Extraction across all sources
    const extractionPromises = sources.map((source) =>
      extractClaimsFromSource(source, aspects)
    );
    const claimArrays = await Promise.all(extractionPromises);
    const allClaims: Claim[] = claimArrays.flat();

    // 3. Compute 2D Coverage Heatmap Matrix
    const coverage = computeCoverageMatrix(aspects, sources, allClaims);

    // 4. Detect Information Gaps (Dark Spots)
    const gaps = detectGaps(aspects, sources, allClaims, coverage);

    // 5. Detect Policy Contradictions (Dual-Quote Verified Only)
    const conflicts = await detectConflicts(aspects, allClaims, sources);

    // 6. Temporal Freshness Sentinel
    const freshness = evaluateFreshness(sources);

    // 7. Calculate Completeness Index & Penalties
    const { index: completenessIndex, breakdown: completenessBreakdown } =
      calculateCompletenessIndex(aspects, coverage, conflicts, freshness);

    // 8. Compile Prioritized Verification Checklist (P0, P1, P2)
    const checklist = generateVerificationChecklist(gaps, conflicts, freshness, sources);

    // 9. Assemble Final Report
    const report: AnalysisReport = {
      question,
      aspects,
      sources,
      claims: allClaims,
      coverage,
      gaps,
      conflicts,
      freshness,
      checklist,
      completenessIndex,
      completenessBreakdown,
      generatedAt: new Date().toISOString(),
      modelInfo: process.env.GEMINI_API_KEY
        ? `Gemini ${process.env.GEMINI_MODEL || '2.5 Flash'} (Deterministic Evidence Verification)`
        : 'Rule-Based Deterministic Engine (Zero Network Fallback)',
      limitations: [
        `Analysis is scoped strictly to the ${sources.length} provided document(s).`,
        'Findings represent potential gaps and signals; verify with official authorities before acting.'
      ]
    };

    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: `Analysis pipeline failed: ${err instanceof Error ? err.message : 'Unknown server error'}`
      },
      { status: 500 }
    );
  }
}
