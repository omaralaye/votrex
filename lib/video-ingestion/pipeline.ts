import { chunkTranscript } from './chunker';
import { parseTimestampedChapters } from './parsers/chapter-parser';
import { parseSRT } from './parsers/srt-parser';
import { parseVTT } from './parsers/vtt-parser';
import { generateDeterministicVideoId, parseVideoUrl } from './providers';
import {
  IngestionResult,
  SanityVideoDocument,
  TranscriptCue,
  VideoChapter,
  VideoChunk,
  VideoIngestionInput,
} from './types';

/**
 * Detects the transcript format automatically from raw text content.
 */
export function detectTranscriptFormat(content: string): 'vtt' | 'srt' | 'json' | 'text' {
  const trimmed = (content || '').trim();
  if (trimmed.startsWith('WEBVTT') || trimmed.startsWith('NOTE') || /^\d+\n\d{2}:\d{2}/.test(trimmed)) {
    if (trimmed.startsWith('WEBVTT')) return 'vtt';
  }

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // not json
    }
  }

  if (/-->\s*\d{2}:\d{2}/.test(trimmed)) {
    if (trimmed.includes(',')) return 'srt';
    return 'vtt';
  }

  return 'text';
}

/**
 * Parses JSON transcript formats (e.g. Whisper segments, Sanity chunks array, or generic timestamp array).
 */
export function parseJsonTranscript(jsonContent: string): TranscriptCue[] {
  try {
    const data = JSON.parse(jsonContent);
    const cues: TranscriptCue[] = [];

    const items = Array.isArray(data)
      ? data
      : (data.segments || data.cues || data.chunks || data.transcripts || []);

    for (const item of items) {
      const start =
        typeof item.startSeconds === 'number'
          ? item.startSeconds
          : typeof item.start === 'number'
          ? item.start
          : typeof item.timestamp === 'number'
          ? item.timestamp
          : 0;

      const end =
        typeof item.endSeconds === 'number'
          ? item.endSeconds
          : typeof item.end === 'number'
          ? item.end
          : undefined;

      const text = (item.text || item.content || item.transcript || '').trim();
      if (text) {
        cues.push({
          startSeconds: start,
          endSeconds: end,
          text,
        });
      }
    }

    return cues;
  } catch {
    return [];
  }
}

/**
 * Parses plain text with timestamps like "00:15 Hello everyone" into cues.
 */
export function parsePlainTextTranscript(textContent: string): TranscriptCue[] {
  const lines = textContent.split('\n');
  const cues: TranscriptCue[] = [];
  const timeRegex = /(?:^\s*(?:\d+[\.\-\)]\s*)?[\[\(]?\s*)(\d{1,2}:\d{2}(?::\d{2})?|\d+s)\s*[\]\)]?\s*[-:\s]\s*(.+)$/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const match = trimmed.match(timeRegex);
    if (match) {
      const timeStr = match[1];
      const text = match[2].trim();
      const parts = timeStr.replace(/[()[\]]/g, '').split(':');
      let startSeconds = 0;
      if (parts.length === 3) {
        startSeconds = (parseFloat(parts[0]) || 0) * 3600 + (parseFloat(parts[1]) || 0) * 60 + (parseFloat(parts[2]) || 0);
      } else if (parts.length === 2) {
        startSeconds = (parseFloat(parts[0]) || 0) * 60 + (parseFloat(parts[1]) || 0);
      } else {
        startSeconds = parseFloat(parts[0]) || 0;
      }

      if (text) {
        cues.push({
          startSeconds,
          text,
        });
      }
    }
  }

  return cues;
}

/**
 * Executes the offline video ingestion pipeline to build a complete SanityVideoDocument.
 */
export async function ingestVideo(input: VideoIngestionInput): Promise<IngestionResult> {
  const warnings: string[] = [];
  const providerInfo = parseVideoUrl(input.url);

  // 1. Resolve / parse transcript cues
  let cues: TranscriptCue[] = [];

  if (input.transcriptCues && input.transcriptCues.length > 0) {
    cues = input.transcriptCues;
  } else if (input.transcriptContent) {
    const format = input.transcriptType && input.transcriptType !== 'auto'
      ? input.transcriptType
      : detectTranscriptFormat(input.transcriptContent);

    switch (format) {
      case 'vtt':
        cues = parseVTT(input.transcriptContent);
        break;
      case 'srt':
        cues = parseSRT(input.transcriptContent);
        break;
      case 'json':
        cues = parseJsonTranscript(input.transcriptContent);
        break;
      case 'text':
      default:
        cues = parsePlainTextTranscript(input.transcriptContent);
        break;
    }
  }

  // 2. Generate transcript chunks
  let chunks: VideoChunk[] = [];
  if (cues.length > 0) {
    chunks = chunkTranscript(cues, input.chunkingOptions);
  } else {
    warnings.push('No transcript cues provided or detected; video document will have empty chunks array.');
  }

  // 3. Resolve / parse chapters
  let chapters: VideoChapter[] = [];

  if (input.chapters && input.chapters.length > 0) {
    chapters = input.chapters;
  } else if (input.chaptersContent) {
    chapters = parseTimestampedChapters(input.chaptersContent);
  } else if (input.description) {
    // Attempt extracting chapters from video description text
    chapters = parseTimestampedChapters(input.description);
  }

  // Ensure there's at least an initial chapter marker at 0s if none exist
  if (chapters.length === 0) {
    chapters = [
      {
        _key: 'ch1',
        startSeconds: 0,
        label: 'Introduction & Overview',
      },
    ];
    warnings.push('No chapter markers provided; default introduction chapter marker generated at 0s.');
  }

  // 4. Build deterministic Sanity document
  const docId = generateDeterministicVideoId(input.url, input.customId);

  const document: SanityVideoDocument = {
    _id: docId,
    _type: 'video',
    videoId: providerInfo.videoId,
    url: providerInfo.canonicalUrl || input.url,
    chapters,
    chunks,
  };

  // 5. Calculate stats
  const totalDurationEstimatedSec = Math.max(
    chapters.length > 0 ? chapters[chapters.length - 1].startSeconds : 0,
    chunks.length > 0 ? chunks[chunks.length - 1].startSeconds + 30 : 0
  );

  const totalWords = chunks.reduce((acc, c) => acc + c.text.split(/\s+/).filter(Boolean).length, 0);

  return {
    success: true,
    document,
    providerInfo,
    stats: {
      totalChapters: chapters.length,
      totalChunks: chunks.length,
      totalDurationEstimatedSec,
      wordCount: totalWords,
    },
    warnings,
  };
}
