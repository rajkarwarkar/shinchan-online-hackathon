export type Severity = 'CRITICAL' | 'MODERATE' | 'INFORMATIONAL';
export type Reliability = 'OFFICIAL_PRIMARY' | 'SECONDARY_SOURCE' | 'COMMUNITY_UNVERIFIED';
export type WarningType = 'OUTDATED_CYCLE' | 'STALE_DATE' | 'UNDATED' | 'UNVERIFIED_AUTHORITY';
export type Priority = 'IMMEDIATE' | 'IMPORTANT' | 'OPTIONAL';

export interface Source {
  id: string;
  title: string;
  url: string;
  domain: string;
  authorOrOrg: string;
  publishedDate?: string;
  cycleOrYear?: string;
  reliability: Reliability;
  isOfficial: boolean;
  contentSnippet: string;
}

export interface ExtractedFact {
  id: string;
  category: string;
  claim: string;
  sourceId: string;
  exactQuote: string;
  confidence: number; // 0 to 1
}

export interface InformationGap {
  id: string;
  facet: string;
  severity: Severity;
  explanation: string;
  impactOnDecision: string;
  reasonMissing: string;
  verificationQuestion: string;
}

export interface SourceConflict {
  id: string;
  topic: string;
  severity: Severity;
  divergenceSummary: string;
  claimA: {
    sourceId: string;
    statement: string;
    exactQuote: string;
  };
  claimB: {
    sourceId: string;
    statement: string;
    exactQuote: string;
  };
  rootCause: string;
  verificationGuidance: string;
}

export interface TemporalWarning {
  id: string;
  sourceId: string;
  detectedCycleOrDate: string;
  warningType: WarningType;
  message: string;
  riskFactor: string;
}

export interface VerificationTask {
  id: string;
  priority: Priority;
  title: string;
  actionText: string;
  targetEntityOrSource: string;
  category: string;
  completed: boolean;
}

export interface DarkSpotMetrics {
  completenessScore: number; // 0 - 100
  totalSources: number;
  criticalGapsCount: number;
  moderateGapsCount: number;
  conflictsCount: number;
  temporalWarningsCount: number;
  summaryVerdict: string;
}

export interface AnalysisResult {
  id: string;
  topic: string;
  timestamp: string;
  metrics: DarkSpotMetrics;
  sources: Source[];
  facts: ExtractedFact[];
  gaps: InformationGap[];
  conflicts: SourceConflict[];
  temporalWarnings: TemporalWarning[];
  checklist: VerificationTask[];
}

export interface SampleScenario {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
  query: string;
  sources: Array<{
    title: string;
    url: string;
    org: string;
    date: string;
    isOfficial: boolean;
    content: string;
  }>;
  precomputedResult: AnalysisResult;
}

