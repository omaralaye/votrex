/**
 * Comprehensive Automated Test Suite for Video Ingestion Pipeline
 * Run via: npx tsx scripts/test-video-ingestion.ts
 */

import assert from 'node:assert';
import {
  chunkTranscript,
  deduplicateRollingCues,
  generateDeterministicVideoId,
  ingestVideo,
  parseSRT,
  parseTimestampedChapters,
  parseVideoUrl,
  parseVTT,
  sanitizeSanityId,
  TranscriptCue,
} from '../lib/video-ingestion';

console.log('🧪 Starting Video Ingestion Pipeline Test Suite...\n');

let passedTests = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${errorMsg}`);
    throw err;
  }
}

// 1. Sanity ID Sanitization & Deterministic IDs
test('Sanitize Sanity Document IDs', () => {
  assert.strictEqual(sanitizeSanityId('valid_id-123.test'), 'valid_id-123-test');
  assert.strictEqual(sanitizeSanityId('https://example.com/video?v=123&t=45s'), 'https-example-com-video-v-123-t-45s');
  assert.strictEqual(sanitizeSanityId('---hello---world---'), 'hello-world');
  assert.strictEqual(sanitizeSanityId(''), 'video-unknown');
});

test('Parse Video Providers & Generate Deterministic IDs', () => {
  // YouTube
  const yt = parseVideoUrl('https://www.youtube.com/watch?v=gSSsZReIFRk');
  assert.strictEqual(yt.provider, 'youtube');
  assert.strictEqual(yt.videoId, 'gSSsZReIFRk');
  assert.strictEqual(generateDeterministicVideoId('https://www.youtube.com/watch?v=gSSsZReIFRk'), 'video-yt-gSSsZReIFRk');

  const ytShort = parseVideoUrl('https://youtu.be/gSSsZReIFRk');
  assert.strictEqual(ytShort.provider, 'youtube');
  assert.strictEqual(ytShort.videoId, 'gSSsZReIFRk');

  // Vimeo
  const vimeo = parseVideoUrl('https://vimeo.com/76979871');
  assert.strictEqual(vimeo.provider, 'vimeo');
  assert.strictEqual(vimeo.videoId, '76979871');
  assert.strictEqual(generateDeterministicVideoId('https://vimeo.com/76979871'), 'video-vimeo-76979871');

  // Bunny
  const bunny = parseVideoUrl('https://iframe.mediadelivery.net/embed/12345/67890-abcdef');
  assert.strictEqual(bunny.provider, 'bunny');
  assert.strictEqual(bunny.videoId, '12345-67890-abcdef');
  assert.strictEqual(
    generateDeterministicVideoId('https://iframe.mediadelivery.net/embed/12345/67890-abcdef'),
    'video-bunny-12345-67890-abcdef'
  );

  // Direct MP4
  const direct = parseVideoUrl('https://cdn.example.com/videos/nextjs-deep-dive.mp4');
  assert.strictEqual(direct.provider, 'direct');
  assert.strictEqual(direct.videoId, 'videos-nextjs-deep-dive-mp4');
});

// 2. WebVTT Parser
test('Parse WebVTT Content & Clean Tags', () => {
  const sampleVtt = `WEBVTT - Sample File

NOTE This is a comment

1
00:00:01.500 --> 00:00:04.200 align:start line:0%
<v Speaker 1>Welcome to <b>Next.js 15</b> architecture.</v>

2
00:00:04.500 --> 00:00:08.100
<c.color>We will explore <00:00:05.500>React Server Components</c> &amp; caching.
`;

  const cues = parseVTT(sampleVtt);
  assert.strictEqual(cues.length, 2);
  assert.strictEqual(cues[0].startSeconds, 1.5);
  assert.strictEqual(cues[0].endSeconds, 4.2);
  assert.strictEqual(cues[0].text, 'Welcome to Next.js 15 architecture.');

  assert.strictEqual(cues[1].startSeconds, 4.5);
  assert.strictEqual(cues[1].endSeconds, 8.1);
  assert.strictEqual(cues[1].text, 'We will explore React Server Components & caching.');
});

// 3. SubRip SRT Parser
test('Parse SubRip SRT Content', () => {
  const sampleSrt = `1
00:00:02,000 --> 00:00:05,500
First line of subtitles.

2
00:00:06,120 --> 00:00:09,800
Second subtitle segment with <i>italics</i> &amp; formatting.
`;

  const cues = parseSRT(sampleSrt);
  assert.strictEqual(cues.length, 2);
  assert.strictEqual(cues[0].startSeconds, 2.0);
  assert.strictEqual(cues[0].endSeconds, 5.5);
  assert.strictEqual(cues[0].text, 'First line of subtitles.');

  assert.strictEqual(cues[1].startSeconds, 6.12);
  assert.strictEqual(cues[1].endSeconds, 9.8);
  assert.strictEqual(cues[1].text, 'Second subtitle segment with italics & formatting.');
});

// 4. Chapter Marker Parsing
test('Parse Timestamped Chapters across Formats', () => {
  const descriptionText = `
In this video we cover:
00:00 Introduction & Overview
02:15 - Server Component Boundaries
[05:45] Client Hydration Mechanics
1. 08:30 Data Fetching Strategies
Chapter 5: 12:00 Advanced Caching
1:15:30 Production Deployment
`;

  const chapters = parseTimestampedChapters(descriptionText);
  assert.strictEqual(chapters.length, 6);
  assert.strictEqual(chapters[0].startSeconds, 0);
  assert.strictEqual(chapters[0].label, 'Introduction & Overview');

  assert.strictEqual(chapters[1].startSeconds, 135); // 2m15s
  assert.strictEqual(chapters[1].label, 'Server Component Boundaries');

  assert.strictEqual(chapters[2].startSeconds, 345); // 5m45s
  assert.strictEqual(chapters[2].label, 'Client Hydration Mechanics');

  assert.strictEqual(chapters[3].startSeconds, 510); // 8m30s
  assert.strictEqual(chapters[3].label, 'Data Fetching Strategies');

  assert.strictEqual(chapters[4].startSeconds, 720); // 12m
  assert.strictEqual(chapters[4].label, 'Advanced Caching');

  assert.strictEqual(chapters[5].startSeconds, 4530); // 1h15m30s
  assert.strictEqual(chapters[5].label, 'Production Deployment');
});

// 5. Deduplicate Rolling Captions & Chunker
test('Deduplicate Rolling Captions and Generate Chunks', () => {
  const rollingCues: TranscriptCue[] = [
    { startSeconds: 0, endSeconds: 3, text: 'Next.js 15 is' },
    { startSeconds: 3, endSeconds: 6, text: 'Next.js 15 is a powerful' },
    { startSeconds: 6, endSeconds: 9, text: 'a powerful framework for React.' },
    { startSeconds: 10, endSeconds: 15, text: 'It introduces async request APIs and enhanced caching.' },
    { startSeconds: 16, endSeconds: 22, text: 'You can use Server Actions for secure mutations.' },
    { startSeconds: 23, endSeconds: 30, text: 'Everything is built for high performance and scale.' },
  ];

  const deduped = deduplicateRollingCues(rollingCues);
  assert.ok(deduped.length > 0);

  const chunks = chunkTranscript(rollingCues, {
    targetDurationSec: 25,
    minDurationSec: 10,
  });

  assert.ok(chunks.length >= 1);
  assert.strictEqual(chunks[0]._key, 'c1');
  assert.strictEqual(chunks[0].startSeconds, 0);
  assert.ok(chunks[0].text.includes('Next.js 15'));
});

// 6. Complete Ingestion Pipeline
test('End-to-End Video Ingestion Pipeline', async () => {
  const sampleVtt = `WEBVTT

1
00:00:00.000 --> 00:00:05.000
Welcome to Next.js 15 Full Course.

2
00:00:05.500 --> 00:00:12.000
In this comprehensive lesson we discuss React Server Components.

3
00:00:12.500 --> 00:00:20.000
Server Components render exclusively on the server without shipping JavaScript.

4
00:00:20.500 --> 00:00:30.000
This drastically improves Largest Contentful Paint and overall bundle size.
`;

  const sampleChapters = `
00:00 Course Intro
00:15 Server Components Overview
`;

  const result = await ingestVideo({
    url: 'https://www.youtube.com/watch?v=gSSsZReIFRk',
    transcriptContent: sampleVtt,
    chaptersContent: sampleChapters,
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(result.document._id, 'video-yt-gSSsZReIFRk');
  assert.strictEqual(result.document._type, 'video');
  assert.strictEqual(result.document.videoId, 'gSSsZReIFRk');
  assert.strictEqual(result.document.chapters.length, 2);
  assert.ok(result.document.chunks.length >= 1);
  assert.strictEqual(result.stats.totalChapters, 2);
  assert.ok(result.stats.wordCount > 10);
});

console.log(`\n🎉 All ${passedTests} automated tests passed successfully!\n`);
