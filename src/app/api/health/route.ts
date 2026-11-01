import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const aiConfigured = Boolean(apiKey && apiKey.trim() !== '');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  return NextResponse.json({
    aiConfigured,
    model
  });
}
