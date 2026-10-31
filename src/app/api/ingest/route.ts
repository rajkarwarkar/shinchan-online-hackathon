import { NextRequest, NextResponse } from 'next/server';
import { validateUrlForSSRF } from '@/lib/security/ssrf';
import { extractTemporalData } from '@/lib/dates/dateParser';
import { evaluateDomainCredibility } from '@/lib/scoring/credibility';
import { Source } from '@/types';
import * as cheerio from 'cheerio';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

const MAX_PAYLOAD_BYTES = 2 * 1024 * 1024; // 2MB
const FETCH_TIMEOUT_MS = 8000; // 8s

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, text, title: userTitle } = body;

    if (!url && !text) {
      return NextResponse.json(
        { success: false, error: 'Either a valid URL or text content must be provided.' },
        { status: 400 }
      );
    }

    // ==========================================
    // Flow 1: Pasted Text Direct Ingestion
    // ==========================================
    if (text && !url) {
      const cleanText = text.trim();
      if (cleanText.length < 20) {
        return NextResponse.json(
          { success: false, error: 'Pasted text is too brief (minimum 20 characters required).' },
          { status: 400 }
        );
      }

      const wordCount = cleanText.split(/\s+/).length;
      const detectedTitle =
        userTitle ||
        cleanText.split('\n')[0].replace(/[#*_-]/g, '').trim().slice(0, 80) ||
        'Pasted Document';

      const temporal = extractTemporalData('', cleanText);
      const credibility = evaluateDomainCredibility({
        hasDate: Boolean(temporal.publishedDate || temporal.modifiedDate),
        wordCount,
        isUserPasted: true
      });

      const source: Source = {
        id: `src-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: detectedTitle,
        publisher: 'User Upload',
        kind: credibility.kind,
        credibilityScore: credibility.score,
        publishedDate: temporal.publishedDate,
        modifiedDate: temporal.modifiedDate,
        detectedCycleLabel: temporal.detectedCycleLabel,
        text: cleanText,
        fetchedAt: new Date().toISOString(),
        status: 'ready'
      };

      return NextResponse.json({ success: true, data: source });
    }

    // ==========================================
    // Flow 2: Live URL Fetch with SSRF Guard
    // ==========================================
    const ssrfCheck = await validateUrlForSSRF(url);
    if (!ssrfCheck.isValid) {
      return NextResponse.json(
        { success: false, error: ssrfCheck.error || 'URL failed security validation.' },
        { status: 403 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 DigitalDarkSpot/1.0',
          Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8'
        }
      });
    } catch (fetchErr: unknown) {
      clearTimeout(timeout);
      const isAbort = fetchErr instanceof Error && fetchErr.name === 'AbortError';
      return NextResponse.json(
        {
          success: false,
          error: isAbort
            ? 'Request timed out after 8 seconds. The server took too long to respond.'
            : `Failed to fetch URL: ${fetchErr instanceof Error ? fetchErr.message : 'Network error'}`
        },
        { status: 504 }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `HTTP ${response.status}: Failed to retrieve target document from server.`
        },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (
      !contentType.includes('text/html') &&
      !contentType.includes('text/plain') &&
      !contentType.includes('application/xhtml+xml')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported content-type '${contentType}'. Only HTML and text documents can be parsed.`
        },
        { status: 415 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document payload exceeds the maximum 2MB size cap.'
        },
        { status: 413 }
      );
    }

    const rawHtml = new TextDecoder('utf-8').decode(arrayBuffer);

    // ==========================================
    // Content Extraction via JSDOM & Readability
    // ==========================================
    let cleanText = '';
    let extractedTitle = userTitle || '';
    let publisher = new URL(url).hostname.replace(/^www\./, '');
    let author = '';

    try {
      const dom = new JSDOM(rawHtml, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (article && article.textContent && article.textContent.trim().length > 100) {
        cleanText = article.textContent.trim();
        if (!extractedTitle && article.title) extractedTitle = article.title;
        if (article.byline) author = article.byline;
        if (article.siteName) publisher = article.siteName;
      }
    } catch {
      // Fallback to Cheerio if Readability fails
    }

    // Cheerio Fallback if JSDOM yielded sparse text
    if (!cleanText || cleanText.length < 100) {
      const $ = cheerio.load(rawHtml);
      $('script, style, nav, footer, noscript, svg, iframe').remove();

      if (!extractedTitle) {
        extractedTitle =
          $('meta[property="og:title"]').attr('content') ||
          $('title').text().trim() ||
          $('h1').first().text().trim();
      }

      const metaPublisher =
        $('meta[property="og:site_name"]').attr('content') ||
        $('meta[name="publisher"]').attr('content');
      if (metaPublisher) publisher = metaPublisher;

      cleanText = $('body').text().replace(/\s+/g, ' ').trim();
    }

    if (!cleanText || cleanText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not extract substantive readable text from this document. The site may require JavaScript or authentication.'
        },
        { status: 422 }
      );
    }

    const wordCount = cleanText.split(/\s+/).length;
    const temporal = extractTemporalData(rawHtml, cleanText);
    const credibility = evaluateDomainCredibility({
      url,
      publisher,
      author,
      hasDate: Boolean(temporal.publishedDate || temporal.modifiedDate),
      wordCount
    });

    const source: Source = {
      id: `src-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url,
      title: extractedTitle || publisher || 'Web Document',
      publisher,
      kind: credibility.kind,
      credibilityScore: credibility.score,
      publishedDate: temporal.publishedDate,
      modifiedDate: temporal.modifiedDate,
      detectedCycleLabel: temporal.detectedCycleLabel,
      text: cleanText,
      fetchedAt: new Date().toISOString(),
      status: 'ready'
    };

    return NextResponse.json({ success: true, data: source });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: `Unexpected ingestion failure: ${err instanceof Error ? err.message : 'Unknown server error'}`
      },
      { status: 500 }
    );
  }
}

