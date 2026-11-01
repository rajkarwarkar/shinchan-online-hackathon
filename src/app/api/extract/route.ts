import { NextRequest, NextResponse } from 'next/server';
import { extractClaimsFromSource } from '@/lib/ai/extract';
import { Source, Aspect } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source, aspects } = body as { source?: Source; aspects?: Aspect[] };

    if (!source || !source.text) {
      return NextResponse.json(
        { success: false, error: 'A valid source document is required.' },
        { status: 400 }
      );
    }

    if (!aspects || !Array.isArray(aspects) || aspects.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one aspect is required to extract claims.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        {
          success: false,
          code: 'AI_KEY_NOT_CONFIGURED',
          error: 'AI key not configured. Add your GEMINI_API_KEY in .env.local to extract claims with AI, or explore Sample Mode without a key.',
          aiConfigured: false
        },
        { status: 400 }
      );
    }

    const claims = await extractClaimsFromSource(source, aspects);

    return NextResponse.json({
      success: true,
      data: claims
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: `Extraction failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      },
      { status: 500 }
    );
  }
}

