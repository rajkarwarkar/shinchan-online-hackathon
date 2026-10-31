import * as cheerio from 'cheerio';

export interface ExtractedTemporalData {
  publishedDate?: string;
  modifiedDate?: string;
  detectedCycleLabel?: string;
  temporalConfidence: number; // 0.0 - 1.0
}

/**
 * Validates whether a date string produces a legitimate Date object.
 */
function isValidDate(dateStr: string): boolean {
  if (!dateStr || dateStr.trim().length === 0) return false;
  const timestamp = Date.parse(dateStr);
  if (isNaN(timestamp)) return false;
  const year = new Date(timestamp).getFullYear();
  return year >= 1990 && year <= 2035;
}

/**
 * Normalizes any recognized date string to an ISO 8601 string.
 */
function toIsoDate(dateStr: string): string | undefined {
  try {
    if (!isValidDate(dateStr)) return undefined;
    return new Date(dateStr).toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Extracts publishing dates, update timestamps, and academic/fiscal cycle labels.
 */
export function extractTemporalData(html: string, plainText: string): ExtractedTemporalData {
  const result: ExtractedTemporalData = {
    temporalConfidence: 0
  };

  const $ = cheerio.load(html);

  // 1. Check meta tags
  const metaPublished = 
    $('meta[property="article:published_time"]').attr('content') ||
    $('meta[name="article:published_time"]').attr('content') ||
    $('meta[name="publish-date"]').attr('content') ||
    $('meta[name="pubdate"]').attr('content') ||
    $('meta[property="og:published_time"]').attr('content') ||
    $('meta[name="date"]').attr('content');

  const metaModified =
    $('meta[property="article:modified_time"]').attr('content') ||
    $('meta[name="article:modified_time"]').attr('content') ||
    $('meta[name="last-modified"]').attr('content') ||
    $('meta[property="og:updated_time"]').attr('content');

  if (metaPublished && isValidDate(metaPublished)) {
    result.publishedDate = toIsoDate(metaPublished);
    result.temporalConfidence = Math.max(result.temporalConfidence, 0.9);
  }

  if (metaModified && isValidDate(metaModified)) {
    result.modifiedDate = toIsoDate(metaModified);
    result.temporalConfidence = Math.max(result.temporalConfidence, 0.95);
  }

  // 2. Check JSON-LD metadata
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).html();
      if (!raw) return;
      const data = JSON.parse(raw);
      
      const checkObject = (obj: Record<string, unknown>) => {
        if (!obj || typeof obj !== 'object') return;
        
        if (typeof obj.datePublished === 'string' && isValidDate(obj.datePublished) && !result.publishedDate) {
          result.publishedDate = toIsoDate(obj.datePublished);
          result.temporalConfidence = Math.max(result.temporalConfidence, 0.95);
        }
        if (typeof obj.dateModified === 'string' && isValidDate(obj.dateModified) && !result.modifiedDate) {
          result.modifiedDate = toIsoDate(obj.dateModified);
          result.temporalConfidence = Math.max(result.temporalConfidence, 0.98);
        }
      };

      if (Array.isArray(data)) {
        data.forEach(checkObject);
      } else {
        checkObject(data);
        if (Array.isArray(data['@graph'])) {
          data['@graph'].forEach(checkObject);
        }
      }
    } catch {
      // Ignore JSON parse anomalies
    }
  });

  // 3. Check HTML5 <time> tags
  if (!result.publishedDate && !result.modifiedDate) {
    const timeElem = $('time[datetime]').first();
    const dt = timeElem.attr('datetime');
    if (dt && isValidDate(dt)) {
      result.publishedDate = toIsoDate(dt);
      result.temporalConfidence = Math.max(result.temporalConfidence, 0.8);
    }
  }

  // 4. In-text Regex scanning for Update / Published notices
  if (!result.modifiedDate) {
    const updatedRegex = /(?:last\s+updated|last\s+modified|updated|revised)\s*[:—–-]?\s*([a-zA-Z]+\s+\d{1,2},?\s+20\d{2}|\d{1,2}[/-]\d{1,2}[/-]20\d{2}|20\d{2}[/-]\d{1,2}[/-]\d{1,2})/i;
    const match = plainText.match(updatedRegex);
    if (match && match[1] && isValidDate(match[1])) {
      result.modifiedDate = toIsoDate(match[1]);
      result.temporalConfidence = Math.max(result.temporalConfidence, 0.75);
    }
  }

  if (!result.publishedDate) {
    const publishedRegex = /(?:published|posted|date)\s*[:—–-]?\s*([a-zA-Z]+\s+\d{1,2},?\s+20\d{2}|\d{1,2}[/-]\d{1,2}[/-]20\d{2}|20\d{2}[/-]\d{1,2}[/-]\d{1,2})/i;
    const match = plainText.match(publishedRegex);
    if (match && match[1] && isValidDate(match[1])) {
      result.publishedDate = toIsoDate(match[1]);
      result.temporalConfidence = Math.max(result.temporalConfidence, 0.7);
    }
  }

  // 5. Detect explicit cycle labels (e.g., "Cycle 2026-2027", "Academic Year 2024")
  const cycleRegex = /(?:academic\s+year|cycle|application\s+cycle|cohort|session|fiscal\s+year|fy)\s*[:—–-]?\s*(20\d{2}(?:[-–/]\d{2,4})?)/i;
  const cycleMatch = plainText.match(cycleRegex);
  if (cycleMatch && cycleMatch[1]) {
    result.detectedCycleLabel = `Cycle ${cycleMatch[1].trim()}`;
    result.temporalConfidence = Math.max(result.temporalConfidence, 0.85);
  } else {
    // Check for standalone 4-digit years in titles or headers
    const yearMatch = plainText.slice(0, 500).match(/\b(202[0-9])\b/);
    if (yearMatch && yearMatch[1]) {
      result.detectedCycleLabel = `Cycle ${yearMatch[1]}`;
    }
  }

  return result;
}
