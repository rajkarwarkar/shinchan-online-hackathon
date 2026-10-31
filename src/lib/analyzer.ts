import * as cheerio from 'cheerio';
import { AnalysisResult, ExtractedFact, InformationGap, SourceConflict, TemporalWarning, VerificationTask, Source } from '../types';

interface RawInputSource {
  title?: string;
  url?: string;
  content: string;
}

export async function fetchUrlContent(url: string): Promise<{ title: string; content: string; domain: string }> {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove noisy elements
    $('script, style, nav, footer, header, noscript, svg, iframe, form').remove();

    const title = $('title').text().trim() || $('h1').first().text().trim() || domain;
    
    // Extract main text paragraphs
    const paragraphs: string[] = [];
    $('p, h1, h2, h3, li').each((_, el) => {
      const txt = $(el).text().trim();
      if (txt.length > 20) {
        paragraphs.push(txt);
      }
    });

    const content = paragraphs.slice(0, 30).join('\n\n');
    return { title, content: content || 'No structured textual content extracted.', domain };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Fetch failed';
    return {
      title: url,
      content: `Unable to dynamically scrape live URL (${msg}). Please paste source text directly.`,
      domain: 'external-source.org'
    };
  }
}

export async function analyzeTopicWithSources(
  topic: string,
  rawSources: RawInputSource[]
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Process sources into structured entities
  const structuredSources: Source[] = rawSources.map((src, index) => {
    let domain = 'pasted-text.org';
    const url = src.url || `source-${index + 1}`;
    try {
      if (src.url && src.url.startsWith('http')) {
        domain = new URL(src.url).hostname.replace('www.', '');
      }
    } catch {
      // fallback
    }

    const has2026 = src.content.includes('2026');
    const has2024 = src.content.includes('2024');
    const has2023 = src.content.includes('2023');
    const has2025 = src.content.includes('2025');

    let cycleOrYear = 'Current Context';
    if (has2026) cycleOrYear = '2026 Edition';
    else if (has2025) cycleOrYear = '2025 Edition';
    else if (has2024) cycleOrYear = '2024 Cycle (Prior)';
    else if (has2023) cycleOrYear = '2023 Archive (Stale)';

    const isOfficial = domain.endsWith('.gov') || domain.endsWith('.edu') || domain.includes('official') || (src.title?.toLowerCase().includes('official') ?? false);

    return {
      id: `src-${index + 1}`,
      title: src.title || `Source ${index + 1}: ${domain}`,
      url: url,
      domain: domain,
      authorOrOrg: isOfficial ? 'Official Authority' : 'External Publisher / Community',
      publishedDate: has2026 ? '2026' : (has2025 ? '2025' : (has2024 ? '2024' : 'Undated / Prior Cycle')),
      cycleOrYear,
      reliability: isOfficial ? 'OFFICIAL_PRIMARY' : (domain.includes('forum') || domain.includes('blog') ? 'COMMUNITY_UNVERIFIED' : 'SECONDARY_SOURCE'),
      isOfficial,
      contentSnippet: src.content.slice(0, 240) + '...'
    };
  });

  // If Gemini API Key is available, invoke AI synthesis
  if (apiKey) {
    try {
      const aiResult = await runGeminiGapAnalysis(topic, structuredSources, rawSources, apiKey);
      if (aiResult) {
        return aiResult;
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, using heuristic gap engine fallback:', err);
    }
  }

  // Fallback to intelligent heuristic gap engine
  return runHeuristicGapAnalysis(topic, structuredSources, rawSources);
}

async function runGeminiGapAnalysis(
  topic: string,
  sources: Source[],
  rawSources: RawInputSource[],
  apiKey: string
): Promise<AnalysisResult | null> {
  const prompt = `
You are the core intelligence of "DarkSpot AI", an AI platform that detects what is MISSING, CONFLICTING, or OUTDATED across research sources.
Topic: "${topic}"

Sources provided:
${rawSources.map((s, idx) => `[Source ID: src-${idx + 1}] Title: ${s.title || 'Untitled'} | Text: ${s.content.slice(0, 1500)}`).join('\n\n')}

Analyze these sources and output ONLY a valid JSON object matching this TypeScript structure:
{
  "completenessScore": number (0 to 100 representing how complete the information is),
  "summaryVerdict": string (1-2 sentence assessment of missing gaps, conflicts, and freshness),
  "facts": [
    {
      "id": "fact-1",
      "category": string,
      "claim": string,
      "sourceId": "src-1",
      "exactQuote": string (verbatim snippet from source),
      "confidence": number (between 0.8 and 1.0)
    }
  ],
  "gaps": [
    {
      "id": "gap-1",
      "facet": string (e.g. Renewal Policy, Appeal Process, Taxability, Deadlines),
      "severity": "CRITICAL" | "MODERATE" | "INFORMATIONAL",
      "explanation": string (why this omission is dangerous for a decision maker),
      "impactOnDecision": string,
      "reasonMissing": string,
      "verificationQuestion": string (precise question the user must ask)
    }
  ],
  "conflicts": [
    {
      "id": "conf-1",
      "topic": string,
      "severity": "CRITICAL" | "MODERATE",
      "divergenceSummary": string,
      "claimA": { "sourceId": "src-1", "statement": string, "exactQuote": string },
      "claimB": { "sourceId": "src-2", "statement": string, "exactQuote": string },
      "rootCause": string,
      "verificationGuidance": string
    }
  ],
  "temporalWarnings": [
    {
      "id": "temp-1",
      "sourceId": "src-1",
      "detectedCycleOrDate": string,
      "warningType": "OUTDATED_CYCLE" | "STALE_DATE" | "UNDATED",
      "message": string,
      "riskFactor": string
    }
  ],
  "checklist": [
    {
      "id": "task-1",
      "priority": "IMMEDIATE" | "IMPORTANT" | "OPTIONAL",
      "title": string,
      "actionText": string,
      "targetEntityOrSource": string,
      "category": string,
      "completed": false
    }
  ]
}
Do not wrap in markdown quotes if possible, output pure JSON. Label all gaps as potential gaps or signals.
`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP error ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  const parsed = JSON.parse(rawText);

  return {
    id: `result-${Date.now()}`,
    topic,
    timestamp: new Date().toISOString(),
    metrics: {
      completenessScore: parsed.completenessScore ?? 60,
      totalSources: sources.length,
      criticalGapsCount: (parsed.gaps || []).filter((g: InformationGap) => g.severity === 'CRITICAL').length,
      moderateGapsCount: (parsed.gaps || []).filter((g: InformationGap) => g.severity === 'MODERATE').length,
      conflictsCount: (parsed.conflicts || []).length,
      temporalWarningsCount: (parsed.temporalWarnings || []).length,
      summaryVerdict: parsed.summaryVerdict || 'Analysis completed with AI gap detection.'
    },
    sources,
    facts: parsed.facts || [],
    gaps: parsed.gaps || [],
    conflicts: parsed.conflicts || [],
    temporalWarnings: parsed.temporalWarnings || [],
    checklist: parsed.checklist || []
  };
}

function runHeuristicGapAnalysis(
  topic: string,
  sources: Source[],
  rawSources: RawInputSource[]
): AnalysisResult {
  const combinedText = rawSources.map(s => s.content).join(' ');

  // 1. Detect Outdated Temporal Warnings
  const temporalWarnings: TemporalWarning[] = [];
  sources.forEach((s, idx) => {
    const text = rawSources[idx]?.content || '';
    if (text.includes('2022') || text.includes('2023') || text.includes('2024')) {
      const year = text.includes('2024') ? '2024' : (text.includes('2023') ? '2023' : '2022');
      temporalWarnings.push({
        id: `temp-${idx + 1}`,
        sourceId: s.id,
        detectedCycleOrDate: `${year} Cycle Reference`,
        warningType: 'OUTDATED_CYCLE',
        message: `This source mentions ${year} cycle terms. In 2026, administrative deadlines, fees, and eligibility ceilings may have changed.`,
        riskFactor: 'High risk of making decisions based on stale guidelines.'
      });
    }
  });

  // 2. Identify Critical Decision Facets (Gaps)
  const gaps: InformationGap[] = [];

  const checkFacet = (
    facetName: string,
    keywords: string[],
    severity: 'CRITICAL' | 'MODERATE',
    explanation: string,
    impact: string,
    question: string
  ) => {
    const found = keywords.some(kw => combinedText.toLowerCase().includes(kw));
    if (!found) {
      gaps.push({
        id: `gap-${gaps.length + 1}`,
        facet: facetName,
        severity,
        explanation,
        impactOnDecision: impact,
        reasonMissing: 'None of the provided sources mention or define this critical parameter.',
        verificationQuestion: question
      });
    }
  };

  checkFacet(
    'Renewal & Maintenance Conditions',
    ['renewal', 'renew', 'maintain', 'continuation', 'subsequent year', 'retention'],
    'CRITICAL',
    'No information exists regarding whether terms/benefits renew automatically or require minimum performance benchmarks.',
    'User could unexpectedly lose funding or authorization after the first cycle.',
    'What specific benchmarks, credits, or applications are required to renew or continue this in future terms?'
  );

  checkFacet(
    'Dispute & Appeal Mechanism',
    ['appeal', 'dispute', 'petition', 'grievance', 'reconsideration'],
    'MODERATE',
    'No procedure is specified if an application is erroneously rejected, delayed, or subject to technical portal failure.',
    'Leaves the applicant with zero recourse if an administrative error occurs.',
    'Is there an ombudsman or appeal committee that reviews disputed eligibility determinations?'
  );

  checkFacet(
    'Financial Liability & Tax Consequences',
    ['tax', 'irs', '1099', '1098', 'deductible', 'withholding'],
    'CRITICAL',
    'Sources omit whether benefits or awards count as taxable gross income or trigger 1099/1098 reporting.',
    'Risk of unexpected end-of-year tax liabilities or penalties.',
    'Does this award or subsidy generate a taxable event, and what official tax forms will be issued?'
  );

  checkFacet(
    'Stacking & Concurrent Benefit Rules',
    ['stacking', 'concurrent', 'other aid', 'duplicate', 'exclusive'],
    'MODERATE',
    'No guidance is provided on whether this benefit can be combined with other departmental, state, or private programs.',
    'Could cause unexpected forfeiture or clawback of existing benefits.',
    'Can this benefit be stacked concurrently with other scholarships, grants, or federal programs?'
  );

  // 3. Identify Potential Numerical or Date Conflicts
  const conflicts: SourceConflict[] = [];
  const dollarMatches = Array.from(combinedText.matchAll(/\$[\d,]+/g)).map(m => m[0]);
  const uniqueDollars = Array.from(new Set(dollarMatches));

  if (uniqueDollars.length >= 2 && sources.length >= 2) {
    conflicts.push({
      id: 'conf-1',
      topic: 'Discrepancy in Monetary Thresholds / Caps',
      severity: 'CRITICAL',
      divergenceSummary: `Multiple different dollar amounts detected across sources (${uniqueDollars.slice(0, 3).join(', ')}).`,
      claimA: {
        sourceId: sources[0].id,
        statement: `Primary source references monetary figures around ${uniqueDollars[0]}.`,
        exactQuote: `Referenced amount: ${uniqueDollars[0]} within ${sources[0].title}.`
      },
      claimB: {
        sourceId: sources[1]?.id || sources[0].id,
        statement: `Secondary source references conflicting monetary figures (${uniqueDollars[1]}).`,
        exactQuote: `Referenced amount: ${uniqueDollars[1]} within ${sources[1]?.title || sources[0].title}.`
      },
      rootCause: 'Different budget years, dependent calculations, or tier classifications.',
      verificationGuidance: 'Check the official agency gazette for the definitive financial limit.'
    });
  }

  // 4. Extracted Facts
  const facts: ExtractedFact[] = [];
  rawSources.forEach((src, idx) => {
    const sentences = src.content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 25);
    sentences.slice(0, 2).forEach((sentence, sIdx) => {
      facts.push({
        id: `fact-${idx + 1}-${sIdx + 1}`,
        category: 'Documented Requirement',
        claim: sentence,
        sourceId: sources[idx]?.id || `src-${idx + 1}`,
        exactQuote: sentence,
        confidence: 0.95
      });
    });
  });

  // 5. Verification Checklist
  const checklist: VerificationTask[] = [
    {
      id: 'task-1',
      priority: 'IMMEDIATE',
      title: 'Verify Official Application Window & Cutoff',
      actionText: 'Confirm the final submission deadline with the primary administrative portal.',
      targetEntityOrSource: sources[0]?.title || 'Official Issuing Authority',
      category: 'Deadlines',
      completed: false
    },
    {
      id: 'task-2',
      priority: 'IMMEDIATE',
      title: 'Clarify Unresolved Gap Items',
      actionText: 'Submit an inquiry regarding renewal conditions and appeal procedures.',
      targetEntityOrSource: 'Helpdesk / Financial Aid Advisor',
      category: 'Information Gaps',
      completed: false
    },
    {
      id: 'task-3',
      priority: 'IMPORTANT',
      title: 'Resolve Source Discrepancies',
      actionText: 'Verify contradictory amounts or rules against the latest 2026 gazette.',
      targetEntityOrSource: 'Primary Regulatory Document',
      category: 'Conflict Resolution',
      completed: false
    }
  ];

  const completeness = Math.max(35, Math.min(85, 100 - (gaps.length * 12 + conflicts.length * 10 + temporalWarnings.length * 8)));

  return {
    id: `result-${Date.now()}`,
    topic,
    timestamp: new Date().toISOString(),
    metrics: {
      completenessScore: completeness,
      totalSources: sources.length,
      criticalGapsCount: gaps.filter(g => g.severity === 'CRITICAL').length,
      moderateGapsCount: gaps.filter(g => g.severity === 'MODERATE').length,
      conflictsCount: conflicts.length,
      temporalWarningsCount: temporalWarnings.length,
      summaryVerdict: `Completeness assessed at ${completeness}%. Detected ${gaps.length} information gaps and ${conflicts.length} cross-source conflicts that require human verification.`
    },
    sources,
    facts,
    gaps,
    conflicts,
    temporalWarnings,
    checklist
  };
}

