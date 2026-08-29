import { ChunkingOptions, TranscriptCue, VideoChunk } from './types';

const DEFAULT_OPTIONS: Required<ChunkingOptions> = {
  targetDurationSec: 30,
  minDurationSec: 15,
  maxDurationSec: 50,
  targetWordCount: 45,
  deduplicateRollingCaptions: true,
};

/**
 * Removes duplicate prefix or rolling caption overlap between consecutive cues.
 */
export function deduplicateRollingCues(cues: TranscriptCue[]): TranscriptCue[] {
  if (cues.length <= 1) return cues;

  const result: TranscriptCue[] = [];

  for (let i = 0; i < cues.length; i++) {
    const current = cues[i];
    const text = current.text.trim();
    if (!text) continue;

    if (result.length > 0) {
      const prev = result[result.length - 1];
      const prevWords = prev.text.split(/\s+/);
      const curWords = text.split(/\s+/);

      // Check if current text is fully contained or starts with previous text
      if (text === prev.text) {
        continue;
      }

      // Check rolling caption overlap: see if suffix of prev matches prefix of cur
      let overlapCount = 0;
      const maxCheck = Math.min(prevWords.length, curWords.length, 10);
      for (let len = maxCheck; len > 0; len--) {
        const prevSuffix = prevWords.slice(-len).join(' ').toLowerCase();
        const curPrefix = curWords.slice(0, len).join(' ').toLowerCase();
        if (prevSuffix === curPrefix) {
          overlapCount = len;
          break;
        }
      }

      if (overlapCount > 0) {
        const remainingWords = curWords.slice(overlapCount);
        if (remainingWords.length === 0) {
          continue;
        }
        result.push({
          startSeconds: current.startSeconds,
          endSeconds: current.endSeconds,
          text: remainingWords.join(' '),
        });
        continue;
      }
    }

    result.push(current);
  }

  return result;
}

/**
 * Checks if a string ends with a natural sentence-ending punctuation mark.
 */
function isSentenceBoundary(text: string): boolean {
  const trimmed = text.trim();
  return /[.!?:\n]$/.test(trimmed);
}

/**
 * Partitions transcript cues into search-optimized timestamped chunks.
 */
export function chunkTranscript(
  rawCues: TranscriptCue[],
  options?: ChunkingOptions
): VideoChunk[] {
  if (!rawCues || rawCues.length === 0) return [];

  const opts: Required<ChunkingOptions> = { ...DEFAULT_OPTIONS, ...options };

  // 1. Sort by startSeconds
  const sortedCues = [...rawCues].sort((a, b) => a.startSeconds - b.startSeconds);

  // 2. Deduplicate rolling captions if enabled
  const cues = opts.deduplicateRollingCaptions
    ? deduplicateRollingCues(sortedCues)
    : sortedCues;

  const chunks: VideoChunk[] = [];

  let currentChunkStart = cues[0]?.startSeconds ?? 0;
  let currentTexts: string[] = [];
  let currentWordCount = 0;
  let chunkIndex = 1;

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    const cueText = cue.text.trim();
    if (!cueText) continue;

    const words = cueText.split(/\s+/).filter(Boolean);
    const isLastCue = i === cues.length - 1;

    // Add current cue to accumulator
    if (currentTexts.length === 0) {
      currentChunkStart = cue.startSeconds;
    }
    currentTexts.push(cueText);
    currentWordCount += words.length;

    // Check boundary condition to split
    const accumulatedDuration = Math.max(0, (cue.endSeconds ?? cue.startSeconds) - currentChunkStart);
    const hasSentenceEnd = isSentenceBoundary(cueText);
    const isLongEnough = accumulatedDuration >= opts.minDurationSec || currentWordCount >= opts.targetWordCount;
    const isExceedingTarget = accumulatedDuration >= opts.targetDurationSec;
    const isForcedMax = accumulatedDuration >= opts.maxDurationSec;

    // Large time gap before next cue (silence / pause > 3 seconds)
    const nextCue = cues[i + 1];
    const hasGapToNext = nextCue && (nextCue.startSeconds - (cue.endSeconds ?? cue.startSeconds) > 3.0);

    const shouldCut =
      isLastCue ||
      isForcedMax ||
      (isLongEnough && (hasSentenceEnd || hasGapToNext || isExceedingTarget));

    if (shouldCut && currentTexts.length > 0) {
      const combinedText = currentTexts.join(' ').replace(/\s+/g, ' ').trim();
      if (combinedText) {
        chunks.push({
          _key: `c${chunkIndex++}`,
          startSeconds: Math.floor(currentChunkStart),
          text: combinedText,
        });
      }

      // Reset accumulator
      currentTexts = [];
      currentWordCount = 0;
      if (nextCue) {
        currentChunkStart = nextCue.startSeconds;
      }
    }
  }

  // Flush any leftover text
  if (currentTexts.length > 0) {
    const combinedText = currentTexts.join(' ').replace(/\s+/g, ' ').trim();
    if (combinedText) {
      chunks.push({
        _key: `c${chunkIndex++}`,
        startSeconds: Math.floor(currentChunkStart),
        text: combinedText,
      });
    }
  }

  return chunks;
}
