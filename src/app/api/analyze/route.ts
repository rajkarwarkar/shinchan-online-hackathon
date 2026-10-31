import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_SCENARIOS } from '@/data/sampleScenarios';
import { analyzeTopicWithSources, fetchUrlContent } from '@/lib/analyzer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenarioId, topic, sources } = body;

    // 1. If requesting a pre-computed demo scenario
    if (scenarioId) {
      const scenario = SAMPLE_SCENARIOS.find(s => s.id === scenarioId);
      if (scenario) {
        return NextResponse.json({
          success: true,
          data: scenario.precomputedResult
        });
      }
    }

    // 2. Dynamic custom analysis
    if (!topic || !sources || !Array.isArray(sources) || sources.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Topic and at least one source are required.' },
        { status: 400 }
      );
    }

    // Process sources: if url provided without content, fetch it
    const processedSources = await Promise.all(
      sources.map(async (s: { title?: string; url?: string; content?: string }) => {
        if (s.url && (!s.content || s.content.trim().length === 0)) {
          const fetched = await fetchUrlContent(s.url);
          return {
            title: s.title || fetched.title,
            url: s.url,
            content: fetched.content
          };
        }
        return {
          title: s.title || 'Custom Source Text',
          url: s.url || '',
          content: s.content || ''
        };
      })
    );

    const result = await analyzeTopicWithSources(topic, processedSources);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Analysis failed';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}

