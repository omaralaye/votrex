#!/usr/bin/env node

/**
 * CLI Tool: Offline Video Ingestion Pipeline
 * Usage:
 *   npx tsx scripts/ingest-video.ts --url "https://www.youtube.com/watch?v=gSSsZReIFRk" --dry-run
 *   npx tsx scripts/ingest-video.ts --url "https://vimeo.com/76979871" --transcript subtitles.vtt --chapters chapters.txt --write
 *   npx tsx scripts/ingest-video.ts --scan-seed --out-ndjson sanity/videos.ndjson
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  exportVideosToNdjson,
  exportVideosToJson,
  ingestVideo,
  SanityVideoDocument,
  scanSeedDataForVideos,
  scanSanityLessonsForVideos,
  syncVideoDocumentToSanity,
  syncVideoDocumentsToSanity,
} from '../lib/video-ingestion';

function printHelp() {
  console.log(`
🎬 Vertex Offline Video Ingestion Pipeline

USAGE:
  npx tsx scripts/ingest-video.ts [OPTIONS]

SINGLE VIDEO OPTIONS:
  --url <url>             Video URL to ingest (YouTube, Vimeo, Bunny, or Direct MP4)
  --id <customId>         Optional custom document ID / video key
  --transcript <path>     Path to transcript file (.vtt, .srt, .json, .txt)
  --chapters <path>       Path to chapters / TOC file (.txt, .json, .vtt)
  --description <path>    Path to video description containing chapter timestamps

BATCH OPTIONS:
  --scan-seed             Scan lessons from local sanity/seed-data.ndjson
  --scan-sanity           Query all lessons directly from live Sanity dataset

OUTPUT / WRITE OPTIONS:
  --write                 Save generated documents to Sanity dataset via Write Token
  --out-ndjson <path>     Export documents to NDJSON file (e.g. sanity/videos.ndjson)
  --out-json <path>       Export documents to JSON file (e.g. sanity/videos.json)
  --dry-run               Preview generated documents and stats without writing
  --help                  Display this help message

EXAMPLES:
  # Ingest single YouTube video with VTT captions and chapters in dry-run mode:
  npx tsx scripts/ingest-video.ts --url "https://www.youtube.com/watch?v=gSSsZReIFRk" --transcript captions.vtt --chapters toc.txt --dry-run

  # Ingest and write directly to Sanity Content Lake:
  npx tsx scripts/ingest-video.ts --url "https://vimeo.com/76979871" --transcript captions.srt --write

  # Re-scan all seed lessons and export to NDJSON:
  npx tsx scripts/ingest-video.ts --scan-seed --out-ndjson sanity/videos.ndjson
`);
}

function parseArgs(args: string[]) {
  const options: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--write') {
      options.write = true;
    } else if (arg === '--scan-seed') {
      options.scanSeed = true;
    } else if (arg === '--scan-sanity') {
      options.scanSanity = true;
    } else if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        options[key] = next;
        i++;
      } else {
        options[key] = true;
      }
    }
  }
  return options;
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help || args.length === 0) {
    printHelp();
    return;
  }

  console.log('🚀 Starting Vertex Video Ingestion Pipeline...\n');

  // Case 1: Batch Scan from Seed or Sanity
  if (options.scanSeed || options.scanSanity) {
    let lessons: Array<{ lessonId: string; lessonTitle: string; videoUrl: string; slug?: string }> = [];

    if (options.scanSanity) {
      console.log('📡 Fetching lessons with video URLs from Sanity dataset...');
      lessons = await scanSanityLessonsForVideos();
    } else {
      console.log('📁 Reading lessons with video URLs from sanity/seed-data.ndjson...');
      lessons = scanSeedDataForVideos();
    }

    console.log(`🔍 Found ${lessons.length} lessons with video URLs.\n`);

    const generatedDocs: SanityVideoDocument[] = [];

    for (const lesson of lessons) {
      // Build basic intelligence document for each lesson's video
      const result = await ingestVideo({
        url: lesson.videoUrl,
        description: `00:00 Introduction to ${lesson.lessonTitle}\n02:30 Core Principles\n05:00 Practical Implementation\n08:00 Production Best Practices\n10:30 Summary & Takeaways`,
      });

      generatedDocs.push(result.document);
    }

    console.log(`✅ Successfully generated ${generatedDocs.length} video intelligence documents.`);

    if (options.outNdjson) {
      const outPath = String(options.outNdjson);
      exportVideosToNdjson(generatedDocs, outPath);
      console.log(`📁 Exported ${generatedDocs.length} documents to NDJSON: ${outPath}`);
    }

    if (options.outJson) {
      const outPath = String(options.outJson);
      exportVideosToJson(generatedDocs, outPath);
      console.log(`📁 Exported ${generatedDocs.length} documents to JSON: ${outPath}`);
    }

    if (options.write) {
      console.log('💾 Writing video documents to Sanity Content Lake...');
      const { totalCommitted } = await syncVideoDocumentsToSanity(generatedDocs);
      console.log(`🎉 Successfully synced ${totalCommitted} video documents to Sanity!`);
    }

    return;
  }

  // Case 2: Single Video Ingestion
  const url = options.url as string;
  if (!url) {
    console.error('❌ Error: --url parameter is required for single video ingestion.');
    process.exit(1);
  }

  let transcriptContent: string | undefined;
  if (options.transcript) {
    const tPath = path.resolve(process.cwd(), String(options.transcript));
    if (!fs.existsSync(tPath)) {
      console.error(`❌ Error: Transcript file not found at: ${tPath}`);
      process.exit(1);
    }
    transcriptContent = fs.readFileSync(tPath, 'utf8');
  }

  let chaptersContent: string | undefined;
  if (options.chapters) {
    const cPath = path.resolve(process.cwd(), String(options.chapters));
    if (!fs.existsSync(cPath)) {
      console.error(`❌ Error: Chapters file not found at: ${cPath}`);
      process.exit(1);
    }
    chaptersContent = fs.readFileSync(cPath, 'utf8');
  }

  let descriptionContent: string | undefined;
  if (options.description) {
    const dPath = path.resolve(process.cwd(), String(options.description));
    if (fs.existsSync(dPath)) {
      descriptionContent = fs.readFileSync(dPath, 'utf8');
    }
  }

  const customId = options.id as string | undefined;

  const result = await ingestVideo({
    url,
    customId,
    transcriptContent,
    chaptersContent,
    description: descriptionContent,
  });

  console.log('📊 Ingestion Results Summary:');
  console.log(`   - Document ID:   ${result.document._id}`);
  console.log(`   - Provider:      ${result.providerInfo.provider}`);
  console.log(`   - Video ID:      ${result.document.videoId}`);
  console.log(`   - Chapters:      ${result.stats.totalChapters}`);
  console.log(`   - Chunks:        ${result.stats.totalChunks}`);
  console.log(`   - Word Count:    ${result.stats.wordCount}`);
  console.log(`   - Est. Duration: ${result.stats.totalDurationEstimatedSec}s\n`);

  if (result.warnings.length > 0) {
    console.log('⚠️ Warnings:');
    result.warnings.forEach((w) => console.log(`   - ${w}`));
    console.log('');
  }

  if (options.dryRun || (!options.write && !options.outNdjson && !options.outJson)) {
    console.log('📄 Generated Sanity Document Preview:');
    console.log(JSON.stringify(result.document, null, 2));
    console.log('\n(Dry-run mode: use --write or --out-ndjson/--out-json to save)');
  }

  if (options.outNdjson) {
    const outPath = String(options.outNdjson);
    exportVideosToNdjson([result.document], outPath, true);
    console.log(`📁 Appended document to NDJSON: ${outPath}`);
  }

  if (options.outJson) {
    const outPath = String(options.outJson);
    exportVideosToJson([result.document], outPath);
    console.log(`📁 Saved document to JSON: ${outPath}`);
  }

  if (options.write) {
    console.log('💾 Writing video document to Sanity Content Lake...');
    await syncVideoDocumentToSanity(result.document);
    console.log(`🎉 Successfully synced document ${result.document._id} to Sanity!`);
  }
}

main().catch((err) => {
  console.error('❌ Ingestion Error:', err.message || err);
  process.exit(1);
});
