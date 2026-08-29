import { TranscriptCue } from '../types';

/**
 * Parses timestamp string (e.g. "00:01:23.456" or "01:23.456" or "23.456") to seconds.
 */
export function parseVttTimestamp(timestamp: string): number {
  if (!timestamp) return 0;
  const parts = timestamp.trim().replace(',', '.').split(':');
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const mins = parseFloat(parts[1]) || 0;
    const secs = parseFloat(parts[2]) || 0;
    return hours * 3600 + mins * 60 + secs;
  } else if (parts.length === 2) {
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins * 60 + secs;
  } else if (parts.length === 1) {
    return parseFloat(parts[0]) || 0;
  }
  return 0;
}

/**
 * Strips WebVTT formatting tags, intra-cue timestamps, and decodes common HTML entities.
 */
export function cleanVttText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    // Remove inline timestamp tags like <00:00:01.234>
    .replace(/<\d{2}:\d{2}(?::\d{2})?(?:\.\d{3})?>/g, ' ')
    // Remove voice tags like <v Speaker Name>
    .replace(/<v[^>]*>/g, '')
    // Remove any remaining HTML/VTT tags like <b>, </i>, <c.color>
    .replace(/<[^>]+>/g, '')
    // Decode HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse multi-spaces & trim
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses WebVTT file content into an array of normalized TranscriptCue objects.
 */
export function parseVTT(vttContent: string): TranscriptCue[] {
  if (!vttContent) return [];

  const cues: TranscriptCue[] = [];
  const lines = vttContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  let i = 0;
  // Skip WEBVTT header and any leading comments/metadata
  while (i < lines.length && !lines[i].includes('-->')) {
    i++;
  }

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.includes('-->')) {
      const [startStr, ...rest] = line.split('-->');
      const restJoined = rest.join('-->').trim();
      // Second part might contain settings like "00:00:05.000 align:start size:50%"
      const endStr = restJoined.split(/\s+/)[0];

      const startSeconds = parseVttTimestamp(startStr.trim());
      const endSeconds = parseVttTimestamp(endStr.trim());

      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('-->')) {
        // If line is just a numeric cue identifier, skip if followed immediately by '-->'
        const peekNext = i + 1 < lines.length ? lines[i + 1].trim() : '';
        if (/^\d+$/.test(lines[i].trim()) && peekNext.includes('-->')) {
          break;
        }
        textLines.push(lines[i]);
        i++;
      }

      const rawText = textLines.join(' ');
      const cleaned = cleanVttText(rawText);
      if (cleaned) {
        cues.push({
          startSeconds: Math.round(startSeconds * 100) / 100,
          endSeconds: Math.round(endSeconds * 100) / 100,
          text: cleaned,
        });
      }
    } else {
      i++;
    }
  }

  return cues;
}
