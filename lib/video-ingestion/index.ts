/**
 * Offline Video Ingestion Pipeline for Vertex.
 *
 * Ingests transcripts and chapter markers from video providers (YouTube, Vimeo, Bunny, Direct)
 * and subtitle formats (WebVTT, SRT, JSON, plaintext), partitions them into search-optimized
 * timestamped chunks, and produces grounded Sanity video documents with deterministic IDs.
 */

export * from './types';
export * from './providers';
export * from './parsers/vtt-parser';
export * from './parsers/srt-parser';
export * from './parsers/chapter-parser';
export * from './chunker';
export * from './pipeline';
export * from './sanity-sync';
