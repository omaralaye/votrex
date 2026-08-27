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
const token = env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN

if (!projectId || !dataset) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
  process.exit(1)
}

if (!token) {
  console.log(`
ℹ️  To import sample data via API token:
1. Generate an Editor/Write token at https://www.sanity.io/manage/project/${projectId}/api#tokens
2. Add SANITY_API_WRITE_TOKEN=your_token to your .env.local
3. Run: npm run seed

Alternatively, with Sanity CLI logged in:
npx sanity dataset import sanity/seed-data.ndjson ${dataset} --replace
`)
  process.exit(0)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-08-27',
  token,
  useCdn: false,
})

async function seed() {
  console.log(`🚀 Seeding sample courses into Sanity (${projectId}/${dataset})...`)
  const filePath = path.resolve(__dirname, 'seed-data.ndjson')
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n').filter(Boolean)

  const transaction = client.transaction()
  for (const line of lines) {
    const doc = JSON.parse(line)
    transaction.createOrReplace(doc)
  }

  await transaction.commit()
  console.log(`✅ Successfully seeded ${lines.length} documents into Sanity Content Lake!`)
}

seed().catch((err) => {
  console.error('❌ Error seeding data:', err.message || err)
  process.exit(1)
})
