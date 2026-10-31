import { z } from 'zod';

// ==========================================
// 1. Core Trust & Classification Enums
// ==========================================

export const TrustLabelSchema = z.enum(['SOURCED', 'AI_SUGGESTED', 'UNCERTAIN']);
export type TrustLabel = z.infer<typeof TrustLabelSchema>;

export const SourceKindSchema = z.enum([
  'official',
  'institutional',
  'news',
  'third-party',
  'user-text'
]);
export type SourceKind = z.infer<typeof SourceKindSchema>;

export const AspectImportanceSchema = z.enum(['critical', 'high', 'medium', 'low']);
export type AspectImportance = z.infer<typeof AspectImportanceSchema>;

export const ConflictTypeSchema = z.enum([
  'value-mismatch',
  'date-mismatch',
  'policy-contradiction'
]);
export type ConflictType = z.infer<typeof ConflictTypeSchema>;

export const PriorityLevelSchema = z.enum(['P0', 'P1', 'P2']);
export type PriorityLevel = z.infer<typeof PriorityLevelSchema>;

// ==========================================
// 2. Source & Ingestion Schemas
// ==========================================

export const SourceSchema = z.object({
  id: z.string(),
  url: z.string().url().optional(),
  title: z.string(),
  publisher: z.string(),
  kind: SourceKindSchema,
  credibilityScore: z.number().min(0).max(1),
  publishedDate: z.string().optional(),
  modifiedDate: z.string().optional(),
  detectedCycleLabel: z.string().optional(), // e.g. "2024-2025" or "Cycle 2026"
  text: z.string(),
  fetchedAt: z.string(),
  status: z.enum(['ready', 'error', 'pending']),
  errorMessage: z.string().optional()
});
export type Source = z.infer<typeof SourceSchema>;

// ==========================================
// 3. Claims & Evidence Schemas
// ==========================================

export const ClaimSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  aspectId: z.string(),
  statement: z.string(),
  value: z.string().optional(), // Normalized entity: e.g. "₹2,50,000", "31 Aug 2026"
  quote: z.string(),
  quoteVerified: z.boolean(),
  quoteOffset: z
    .object({
      start: z.number(),
      end: z.number()
    })
    .optional(),
  confidence: z.number().min(0).max(1)
});
export type Claim = z.infer<typeof ClaimSchema>;

// ==========================================
// 4. Expected Aspects Schemas
// ==========================================

export const AspectSchema = z.object({
  id: z.string(),
  label: z.string(),
  importance: AspectImportanceSchema,
  rationale: z.string(),
  origin: z.enum(['ai-expected', 'user-added'])
});
export type Aspect = z.infer<typeof AspectSchema>;

// ==========================================
// 5. Coverage Matrix Schemas
// ==========================================

export const CoverageCellSchema = z.object({
  aspectId: z.string(),
  sourceId: z.string(),
  status: z.enum(['none', 'partial', 'full']),
  claimIds: z.array(z.string())
});
export type CoverageCell = z.infer<typeof CoverageCellSchema>;

// ==========================================
// 6. Gaps (Dark Spots) Schemas
// ==========================================

export const GapSchema = z.object({
  id: z.string(),
  aspectId: z.string(),
  severity: z.enum(['CRITICAL', 'MODERATE', 'LOW']),
  title: z.string(),
  explanation: z.string(),
  evidenceRefs: z.array(z.string()),
  trust: TrustLabelSchema,
  whyItMatters: z.string()
});
export type Gap = z.infer<typeof GapSchema>;

// ==========================================
// 7. Policy Conflicts & Contradictions
// ==========================================

export const ConflictSchema = z.object({
  id: z.string(),
  aspectId: z.string(),
  claimA: ClaimSchema,
  claimB: ClaimSchema,
  type: ConflictTypeSchema,
  possibleExplanation: z.string(), // benign explanation e.g. "may refer to different categories"
  severity: z.enum(['CRITICAL', 'MODERATE']),
  trust: TrustLabelSchema
});
export type Conflict = z.infer<typeof ConflictSchema>;

// ==========================================
// 8. Temporal Freshness Sentinel
// ==========================================

export const FreshnessFindingSchema = z.object({
  sourceId: z.string(),
  status: z.enum(['current', 'possibly-outdated', 'undated', 'older-cycle']),
  reason: z.string(),
  evidence: z.string()
});
export type FreshnessFinding = z.infer<typeof FreshnessFindingSchema>;

// ==========================================
// 9. Prioritized Verification Checklist
// ==========================================

export const ChecklistItemSchema = z.object({
  id: z.string(),
  priority: PriorityLevelSchema,
  action: z.string(),
  why: z.string(),
  linkedFindingIds: z.array(z.string()),
  suggestedVerificationSource: z.string().optional(),
  done: z.boolean()
});
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

// ==========================================
// 10. Complete Analysis Report Schema
// ==========================================

export const AnalysisReportSchema = z.object({
  question: z.string(),
  aspects: z.array(AspectSchema),
  sources: z.array(SourceSchema),
  claims: z.array(ClaimSchema),
  coverage: z.array(CoverageCellSchema),
  gaps: z.array(GapSchema),
  conflicts: z.array(ConflictSchema),
  freshness: z.array(FreshnessFindingSchema),
  checklist: z.array(ChecklistItemSchema),
  completenessIndex: z.number().min(0).max(100),
  completenessBreakdown: z.object({
    aspectCoverageScore: z.number(),
    conflictPenalty: z.number(),
    stalePenalty: z.number()
  }),
  generatedAt: z.string(),
  modelInfo: z.string(),
  limitations: z.array(z.string())
});
export type AnalysisReport = z.infer<typeof AnalysisReportSchema>;
