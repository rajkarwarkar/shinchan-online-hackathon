import { NextResponse } from 'next/server';
import { SAMPLE_REPORT, SAMPLE_SOURCES } from '@/data/sample-scholarship';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      report: SAMPLE_REPORT,
      sources: SAMPLE_SOURCES
    }
  });
}

