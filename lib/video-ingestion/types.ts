/**
 * Type definitions for the offline video ingestion pipeline.
 */

export type VideoProvider = 'youtube' | 'vimeo' | 'bunny' | 'direct' | 'unknown';

export interface VideoProviderInfo {
  provider: VideoProvider;
  rawUrl: string;
  videoId: string;
  embedUrl?: string;
  canonicalUrl: string;
}

export interface TranscriptCue {
  startSeconds: number;
  endSeconds?: number;
  text: string;
}

export interface VideoChapter {
  _key: string;
  startSeconds: number;
  label: string;
}

export interface VideoChunk {
  _key: string;
  startSeconds: number;
  text: string;
}

export interface SanityVideoDocument {
  _id: string;
  _type: 'video';
  videoId: string;
  url: string;
  chapters: VideoChapter[];
  chunks: VideoChunk[];
}

export interface ChunkingOptions {
  /** Target duration for a chunk in seconds (default: 30s) */
  targetDurationSec?: number;
  /** Minimum duration before splitting at sentence boundary (default: 15s) */
  minDurationSec?: number;
  /** Maximum duration before forcing a chunk cut (default: 50s) */
  maxDurationSec?: number;
  /** Target word count per chunk (default: 40) */
  targetWordCount?: number;
  /** Strip repeated rolling caption lines (default: true) */
  deduplicateRollingCaptions?: boolean;
}

export interface VideoIngestionInput {
  url: string;
  customId?: string;
  transcriptContent?: string;
  transcriptType?: 'vtt' | 'srt' | 'json' | 'text' | 'auto';
  transcriptCues?: TranscriptCue[];
  chaptersContent?: string;
  chapters?: VideoChapter[];
  description?: string;
  chunkingOptions?: ChunkingOptions;
}

export interface IngestionResult {
  success: boolean;
  document: SanityVideoDocument;
  providerInfo: VideoProviderInfo;
  stats: {
    totalChapters: number;
    totalChunks: number;
    totalDurationEstimatedSec: number;
    wordCount: number;
  };
  warnings: string[];
}
