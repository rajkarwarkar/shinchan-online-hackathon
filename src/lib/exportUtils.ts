import { AnalysisResult } from '@/types';

export function generateMarkdownReport(result: AnalysisResult): string {
  const dateStr = new Date(result.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `# DIGITAL DARK SPOT AUDIT REPORT
**Topic:** ${result.topic}  
**Date of Audit:** ${dateStr}  
**Completeness Score (Dark Spot Index):** ${result.metrics.completenessScore}%  
**Identified Gaps:** ${result.gaps.length} | **Conflicts:** ${result.conflicts.length} | **Temporal Warnings:** ${result.temporalWarnings.length}

---

## 1. Executive Summary & Verdict
${result.metrics.summaryVerdict}

> **AI Transparency Notice:** Findings are categorized into **[SOURCE FACT]** (ground truth quoted from primary/secondary documents) and **[POTENTIAL GAP / SIGNAL]** (inferred omissions that warrant direct human verification).

---

## 2. Information Dark Spots (Missing Critical Facets)
${result.gaps.map((g, i) => `
### ${i + 1}. [${g.severity}] ${g.facet}
- **Why this omission matters:** ${g.explanation}
- **Impact on Decision:** ${g.impactOnDecision}
- **Verification Question to Ask:** \`${g.verificationQuestion}\`
`).join('\n')}

---

## 3. Cross-Source Contradiction Radar
${result.conflicts.length === 0 ? '_No direct contradictions detected among reviewed sources._' : result.conflicts.map((c, i) => `
### ${i + 1}. ${c.topic}
- **Divergence:** ${c.divergenceSummary}
- **Claim A (${c.claimA.sourceId}):** "${c.claimA.exactQuote}"
- **Claim B (${c.claimB.sourceId}):** "${c.claimB.exactQuote}"
- **Root Cause Analysis:** ${c.rootCause}
- **Recommended Action:** ${c.verificationGuidance}
`).join('\n')}

---

## 4. Temporal & Freshness Warnings
${result.temporalWarnings.length === 0 ? '_All reviewed sources appear temporally aligned._' : result.temporalWarnings.map((t) => `
- **${t.sourceId} (${t.detectedCycleOrDate})**: ${t.message}
  *Risk Factor:* ${t.riskFactor}
`).join('\n')}

---

## 5. Prioritized Verification Action Plan
${result.checklist.map((item) => `
- [${item.completed ? 'x' : ' '}] **[${item.priority}]** ${item.title}  
  *Action:* ${item.actionText}  
  *Target Authority:* ${item.targetEntityOrSource}
`).join('\n')}

---

## 6. Reviewed Sources Bibliography
${result.sources.map((s) => `
- **${s.title}** (${s.domain})  
  Type: ${s.isOfficial ? 'Official / Primary' : 'Secondary'} | Cycle: ${s.cycleOrYear || 'Unspecified'}  
  URL: ${s.url}
`).join('\n')}

_Generated with DarkSpot AI • Shinchan Online Hackathon 2026_
`;
}

