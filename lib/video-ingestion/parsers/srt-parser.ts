import { TranscriptCue } from '../types';
import { cleanVttText } from './vtt-parser';

/**
 * Parses SRT timestamp string (e.g. "00:01:23,456" or "01:23,456") to seconds.
 */
export function parseSrtTimestamp(timestamp: string): number {
  if (!timestamp) return 0;
  const normalized = timestamp.trim().replace(',', '.');
  const parts = normalized.split(':');

  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const mins = parseFloat(parts[1]) || 0;
    const secs = parseFloat(parts[2]) || 0;
    return hours * 3600 + mins * 60 + secs;
  } else if (parts.length === 2) {
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins * 60 + secs;
  }
  return parseFloat(parts[0]) || 0;
}

/**
 * Parses SubRip (.srt) subtitle content into an array of TranscriptCue objects.
 */
export function parseSRT(srtContent: string): TranscriptCue[] {
  if (!srtContent) return [];

  const cues: TranscriptCue[] = [];
  const normalized = srtContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = normalized.split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // Find the line containing '-->'
    const timeIndex = lines.findIndex((l) => l.includes('-->'));
    if (timeIndex === -1) continue;

    const timeLine = lines[timeIndex];
    const [startStr, endStr] = timeLine.split('-->');
    if (!startStr || !endStr) continue;

    const startSeconds = parseSrtTimestamp(startStr);
    const endSeconds = parseSrtTimestamp(endStr);

    const textLines = lines.slice(timeIndex + 1);
    const rawText = textLines.join(' ');
    const cleaned = cleanVttText(rawText);

    if (cleaned) {
      cues.push({
        startSeconds: Math.round(startSeconds * 100) / 100,
        endSeconds: Math.round(endSeconds * 100) / 100,
        text: cleaned,
      });
    }
  }

  return cues;
}
