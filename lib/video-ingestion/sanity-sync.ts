import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';
import { SanityVideoDocument } from './types';

/**
 * Helper to load .env.local variables if not present in process.env
 */
function loadEnvLocal(): Record<string, string> {
  const env: Record<string, string> = {};
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [k, ...v] = trimmed.split('=');
      if (k && v.length > 0) {
        env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return env;
}

/**
 * Creates an authorized Sanity client for offline ingestion writes.
 */
export function getSanityWriteClient() {
  const localEnv = loadEnvLocal();
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    localEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    localEnv.NEXT_PUBLIC_SANITY_DATASET ||
    'production';
  const token =
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_AUTH_TOKEN ||
    process.env.SANITY_API_READ_TOKEN ||
    localEnv.SANITY_API_WRITE_TOKEN ||
    localEnv.SANITY_AUTH_TOKEN ||
    localEnv.SANITY_API_READ_TOKEN;

  if (!projectId || !dataset) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in environment.');
  }

  if (!token) {
    throw new Error(
      'Missing SANITY_API_WRITE_TOKEN in environment or .env.local. Write operations require an editor/write token.'
    );
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2026-08-27',
    token,
    useCdn: false,
  });
}

/**
 * Syncs a single video document to Sanity Content Lake using createOrReplace.
 */
export async function syncVideoDocumentToSanity(doc: SanityVideoDocument): Promise<void> {
  const client = getSanityWriteClient();
  await client.createOrReplace(doc);
}

/**
 * Syncs multiple video documents to Sanity in batched transactions.
 */
export async function syncVideoDocumentsToSanity(
  docs: SanityVideoDocument[],
  batchSize = 50
): Promise<{ totalCommitted: number }> {
  const client = getSanityWriteClient();
  let totalCommitted = 0;

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    const transaction = client.transaction();
    for (const doc of batch) {
      transaction.createOrReplace(doc);
    }
    await transaction.commit();
    totalCommitted += batch.length;
  }

  return { totalCommitted };
}

/**
 * Exports video documents to an NDJSON file.
 */
export function exportVideosToNdjson(
  docs: SanityVideoDocument[],
  filePath: string,
  append = false
): void {
  const resolved = path.resolve(process.cwd(), filePath);
  const ndjson = docs.map((d) => JSON.stringify(d)).join('\n') + '\n';
  if (append && fs.existsSync(resolved)) {
    fs.appendFileSync(resolved, ndjson, 'utf8');
  } else {
    const parentDir = path.dirname(resolved);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(resolved, ndjson, 'utf8');
  }
}

/**
 * Exports video documents to a JSON file.
 */
export function exportVideosToJson(docs: SanityVideoDocument[], filePath: string): void {
  const resolved = path.resolve(process.cwd(), filePath);
  const parentDir = path.dirname(resolved);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
  fs.writeFileSync(resolved, JSON.stringify(docs, null, 2), 'utf8');
}

/**
 * Fetches all unique video URLs from existing Sanity lesson documents.
 */
export async function scanSanityLessonsForVideos(): Promise<
  Array<{ lessonId: string; lessonTitle: string; videoUrl: string; slug?: string }>
> {
  const client = getSanityWriteClient();
  const query = `*[_type == "lesson" && defined(videoUrl)] {
    "_id": _id,
    "title": title,
    "videoUrl": videoUrl,
    "slug": slug.current
  }`;

  const lessons = await client.fetch<
    Array<{ _id: string; title: string; videoUrl: string; slug?: string }>
  >(query);
  return lessons.map((l) => ({
    lessonId: l._id,
    lessonTitle: l.title,
    videoUrl: l.videoUrl,
    slug: l.slug,
  }));
}

/**
 * Reads local seed dataset (sanity/seed-data.ndjson) to extract lessons and their video URLs.
 */
export function scanSeedDataForVideos(): Array<{ lessonId: string; lessonTitle: string; videoUrl: string; slug?: string }> {
  const seedPath = path.resolve(process.cwd(), 'sanity/seed-data.ndjson');
  if (!fs.existsSync(seedPath)) {
    return [];
  }

  const content = fs.readFileSync(seedPath, 'utf8');
  const lines = content.split('\n').filter(Boolean);
  const lessons: Array<{ lessonId: string; lessonTitle: string; videoUrl: string; slug?: string }> = [];

  for (const line of lines) {
    try {
      const doc = JSON.parse(line);
      if (doc._type === 'lesson' && doc.videoUrl) {
        lessons.push({
          lessonId: doc._id,
          lessonTitle: doc.title,
          videoUrl: doc.videoUrl,
          slug: doc.slug?.current,
        });
      }
    } catch {
      // ignore bad lines
    }
  }

  return lessons;
}
