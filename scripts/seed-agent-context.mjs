import { createClient } from '@sanity/client'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, '../.env.local')

let env = {}
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [k, ...v] = trimmed.split('=')
    if (k && v.length > 0) {
      env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '')
    }
  }
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token =
  env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN ||
  env.SANITY_API_READ_TOKEN ||
  process.env.SANITY_API_READ_TOKEN

if (!projectId || !dataset) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  process.exit(1)
}

if (!token) {
  console.error('❌ Missing SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-08-27',
  token,
  useCdn: false,
})

const agentContextDoc = {
  _id: 'agent-context-vertex-search',
  _type: 'sanity.agentContext',
  name: 'Vertex Search Agent Context',
  slug: { _type: 'slug', current: 'vertex-search' },
  groqFilter: '_type in ["course", "lesson", "video", "instructor", "category"] && !(_id in path("drafts.**"))',
  instructions: `### Content Relationships & Navigation
- Lessons do not store a parent course reference. To resolve a lesson's course and module, query courses where \`modules[].lessons[]._ref == lesson._id\`.
- Module numbers (e.g. "Module 5") and lesson labels (e.g. "Lesson 5.1") are derived from the 1-based order in \`course.modules[]\` and \`module.lessons[]\`.
- \`video\` documents are internal lookup records matched to lessons via \`lesson.videoUrl == video.url\` or videoId. Never return \`video\` documents directly as standalone search results.

### Two-Stage Timestamp Resolution
- Stage 1 (Chapters First): Search \`video.chapters[].label\` (Table of Contents) for direct topic matches. Use \`startSeconds\` as the moment timestamp.
- Stage 2 (Transcript Fallback): If no chapter matches, search \`video.chunks[].text\` for spoken phrases and resolve to that chunk's \`startSeconds\`.

### Query Patterns & Safety
- Plain text matching for lesson notes: use \`pt::text(content)\` — do not match Portable Text block objects directly.
- Context window protection: Never return entire \`chunks\` arrays in query projections. Project only matched slices: \`chunks[text match $query][0..2]\`.
- Specificity ranking: Exact title match > chapter label match > key points match > summary match > transcript chunk match.`,
}

async function run() {
  console.log(`🚀 Seeding/Updating Sanity Agent Context Document (${projectId}/${dataset})...`)
  const result = await client.createOrReplace(agentContextDoc)
  console.log('✅ Successfully created/updated Sanity Agent Context Document:')
  console.log(JSON.stringify(result, null, 2))
}

run().catch((err) => {
  console.error('❌ Error seeding agent context doc:', err)
  process.exit(1)
})
