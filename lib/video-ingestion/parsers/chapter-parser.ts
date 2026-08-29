import { VideoChapter } from '../types';

/**
 * Converts a raw timestamp string (e.g. "01:23", "1:15:30", "45s", "00:02:15.000") to integer/float seconds.
 */
export function timestampToSeconds(raw: string): number {
  if (!raw) return 0;
  const clean = raw.trim().toLowerCase().replace(/[()[\]]/g, '');

  // Format: "45s" or "45sec" or "45 seconds"
  const secMatch = clean.match(/^(\d+(?:\.\d+)?)\s*(?:s|sec|seconds)$/);
  if (secMatch) {
    return parseFloat(secMatch[1]);
  }

  const parts = clean.split(':');
  if (parts.length === 3) {
    const h = parseFloat(parts[0]) || 0;
    const m = parseFloat(parts[1]) || 0;
    const s = parseFloat(parts[2]) || 0;
    return Math.floor(h * 3600 + m * 60 + s);
  } else if (parts.length === 2) {
    const m = parseFloat(parts[0]) || 0;
    const s = parseFloat(parts[1]) || 0;
    return Math.floor(m * 60 + s);
  } else if (parts.length === 1) {
    return Math.floor(parseFloat(parts[0]) || 0);
  }
  return 0;
}

/**
 * Cleans a chapter heading/label by removing leading track numbers, dashes, colons, or brackets.
 */
export function cleanChapterLabel(rawLabel: string): string {
  if (!rawLabel) return 'Untitled Chapter';
  return rawLabel
    // Remove leading numbering like "1. ", "01 - ", "Chapter 1: "
    .replace(/^(?:chapter\s*\d+[:\-]?\s*|\d+[\.\-\)]\s*)/i, '')
    // Remove leading punctuation/separators
    .replace(/^[\s\-_:\|\>]+/, '')
    // Remove trailing punctuation/separators
    .replace(/[\s\-_:\|\<]+$/, '')
    // Collapse multi-spaces & trim
    .replace(/\s+/g, ' ')
    .trim() || 'Untitled Chapter';
}

/**
 * Parses chapter markers and table of contents from raw text (e.g. YouTube description, markdown list, or text file).
 */
export function parseTimestampedChapters(text: string): VideoChapter[] {
  if (!text) return [];

  const rawChapters: Array<{ startSeconds: number; label: string }> = [];
  const lines = text.split('\n');

  // Pattern 1: Direct timestamp at start: "01:23 Intro", "1:15:30 Deployment", "[05:45] Hydration"
  const directTimestampRegex = /^\s*[\[\(]?\s*(\d{1,2}:\d{2}(?::\d{2})?|\d+s)\s*[\]\)]?\s*[-:\s]?\s*(.+)$/i;

  // Pattern 2: Prefixed timestamp: "1. 01:23 Intro", "Chapter 5: 12:00 Advanced Caching", "01 - 04:30 RSC"
  const prefixedTimestampRegex = /^\s*(?:(?:chapter|section|part|track)?\s*\d+[\.\-\)]|\b(?:chapter|section|part|track)\s*\d+[:\.\-]?)\s*[\[\(]?\s*(\d{1,2}:\d{2}(?::\d{2})?|\d+s)\s*[\]\)]?\s*[-:\s]?\s*(.+)$/i;

  // Pattern 3: Timestamp at end: "Introduction - 01:23" or "Introduction (01:23)"
  const endTimestampRegex = /^\s*(.+?)\s*[-:\s]\s*[\[\(]?\s*(\d{1,2}:\d{2}(?::\d{2})?|\d+s)\s*[\]\)]?$/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Try direct timestamp first
    const directMatch = trimmed.match(directTimestampRegex);
    if (directMatch) {
      const startSeconds = timestampToSeconds(directMatch[1]);
      const label = cleanChapterLabel(directMatch[2]);
      if (label) {
        rawChapters.push({ startSeconds, label });
        continue;
      }
    }

    // Try prefixed timestamp
    const prefixedMatch = trimmed.match(prefixedTimestampRegex);
    if (prefixedMatch) {
      const startSeconds = timestampToSeconds(prefixedMatch[1]);
      const label = cleanChapterLabel(prefixedMatch[2]);
      if (label) {
        rawChapters.push({ startSeconds, label });
        continue;
      }
    }

    // Try timestamp at end
    const endMatch = trimmed.match(endTimestampRegex);
    if (endMatch) {
      const label = cleanChapterLabel(endMatch[1]);
      const startSeconds = timestampToSeconds(endMatch[2]);
      if (label) {
        rawChapters.push({ startSeconds, label });
        continue;
      }
    }
  }

  // Sort chronologically by startSeconds
  rawChapters.sort((a, b) => a.startSeconds - b.startSeconds);

  // Deduplicate timestamps (keep the last label for that second)
  const uniqueMap = new Map<number, string>();
  for (const ch of rawChapters) {
    uniqueMap.set(ch.startSeconds, ch.label);
  }

  const result: VideoChapter[] = [];
  let index = 1;
  for (const [startSeconds, label] of uniqueMap.entries()) {
    result.push({
      _key: `ch${index++}`,
      startSeconds,
      label,
    });
  }

  // If no chapter at 0s and we have chapters, ensure first chapter starts at 0 or is preserved
  if (result.length > 0 && result[0].startSeconds > 0) {
    result.unshift({
      _key: 'ch0',
      startSeconds: 0,
      label: 'Introduction',
    });
    // Re-index keys
    result.forEach((ch, idx) => {
      ch._key = `ch${idx + 1}`;
    });
  }

  return result;
}
