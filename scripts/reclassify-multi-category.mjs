#!/usr/bin/env node
/**
 * scripts/reclassify-multi-category.mjs
 *
 * Re-classifies components whose category field contains multiple values (array or
 * comma-joined string) instead of a single primary category.
 *
 * Uses the same API config pattern as classify-components.mjs.
 *
 * Usage:
 *   node scripts/reclassify-multi-category.mjs                    # reclassify all, concurrency 10
 *   node scripts/reclassify-multi-category.mjs --dry-run         # list affected without API calls
 *   node scripts/reclassify-multi-category.mjs --concurrency=20 # faster
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LIBRARY_ROOT = path.join(ROOT, 'library')

// ------------------------------------------------------------------------------------------------
// CLI args
// ------------------------------------------------------------------------------------------------

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    if (a.startsWith('--')) {
      const eqIdx = a.indexOf('=')
      if (eqIdx === -1) return [a.slice(2), true]
      return [a.slice(2, eqIdx), a.slice(eqIdx + 1)]
    }
    return [a, true]
  })
)

const CONCURRENCY = parseInt(String(args['concurrency'] || '10'), 10)
const DRY_RUN = args['dry-run'] === true || args['dry-run'] === 'true' || args['dry-run'] === ''

// ------------------------------------------------------------------------------------------------
// API config (copied from classify-components.mjs)
// ------------------------------------------------------------------------------------------------

function getApiConfig() {
  const envKey = process.env.ANTHROPIC_API_KEY
  if (envKey) {
    return { authHeader: 'x-api-key', token: envKey, baseUrl: 'https://api.anthropic.com', model: 'claude-haiku-4-5-20251001' }
  }

  const authToken = process.env.ANTHROPIC_AUTH_TOKEN
  const baseUrl = process.env.ANTHROPIC_BASE_URL
  if (authToken && baseUrl) {
    const model = process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL || process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'
    return { authHeader: 'Authorization', token: `Bearer ${authToken}`, baseUrl, model }
  }

  const miniMaxKey = process.env.MINIMAX_API_KEY
  if (miniMaxKey) {
    return {
      authHeader: 'Authorization',
      token: `Bearer ${miniMaxKey}`,
      baseUrl: 'https://api.minimax.io/anthropic',
      model: 'MiniMax-M2-highspeed',
    }
  }

  const homeKeyPath = path.join(process.env.HOME || '', '.anthropic', 'api-key')
  try {
    const key = readFileSync(homeKeyPath, 'utf-8').trim()
    if (key) return { authHeader: 'x-api-key', token: key, baseUrl: 'https://api.anthropic.com', model: 'claude-haiku-4-5-20251001' }
  } catch {}

  console.error('[reclassify-multi-category] ERROR: no credentials found.')
  console.error('  Set one of: ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN+ANTHROPIC_BASE_URL, MINIMAX_API_KEY')
  process.exit(1)
}

// ------------------------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------------------------

const VALID_CATEGORIES = [
  'pricing', 'hero', 'card', 'form', 'navigation', 'overlay',
  'data-display', 'feedback', 'input', 'media', 'layout', 'other'
]

// ------------------------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------------------------

function readJSON(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch {
    return null
  }
}

function getComponentFolders() {
  const folders = []
  let sources = []
  try {
    sources = readdirSync(LIBRARY_ROOT)
  } catch {
    return folders
  }

  for (const source of sources) {
    if (source === 'manifest.json') continue
    const sourcePath = path.join(LIBRARY_ROOT, source)
    let slugs = []
    try {
      slugs = readdirSync(sourcePath)
    } catch {
      continue
    }

    for (const slug of slugs) {
      const cfPath = path.join(sourcePath, slug, 'classification.json')
      if (!existsSync(cfPath)) continue
      folders.push({ source, slug, folderPath: path.join(sourcePath, slug), cfPath })
    }
  }

  return folders
}

function getMainComponentFile(folderPath) {
  const item = readJSON(path.join(folderPath, 'registry-item.json'))
  if (!item?.files) return null

  const uiFile = item.files.find(f => f.type === 'registry:ui')
  if (!uiFile?.path) return null

  const fullPath = path.join(folderPath, uiFile.path)
  if (!existsSync(fullPath)) return null

  return { path: fullPath, name: uiFile.path }
}

function getDemoFile(folderPath) {
  const item = readJSON(path.join(folderPath, 'registry-item.json'))
  if (!item?.files) return null

  const demoFile = item.files.find(f =>
    f.type === 'registry:example' || f.path.includes('demo')
  )
  if (!demoFile?.path) return null

  const fullPath = path.join(folderPath, demoFile.path)
  if (!existsSync(fullPath)) return null

  return { path: fullPath, name: demoFile.path }
}

function readTextFile(filePath, maxBytes = 2048) {
  try {
    const raw = readFileSync(filePath, 'utf-8')
    return raw.slice(0, maxBytes)
  } catch {
    return ''
  }
}

function isMultiCategory(classification) {
  const cat = classification.category
  if (Array.isArray(cat)) return cat.length !== 1 || typeof cat[0] !== 'string'
  if (typeof cat === 'string') return cat.includes(',')
  return false
}

function buildPrompt(component) {
  const item = component.item
  const sourceSnippet = component.sourceCode
  const demoSnippet = component.demoCode

  const texts = []

  texts.push(`Component name: ${component.slug}`)
  texts.push(`Title: ${item.title || component.slug}`)
  texts.push(`Description: ${item.description || 'N/A'}`)
  texts.push(`Tags: ${(item.tags || []).join(', ')}`)
  texts.push(`Platform: ${item.platform || 'Mixed'}`)

  if (sourceSnippet) {
    texts.push('\n=== SOURCE ===\n' + sourceSnippet)
  }

  if (demoSnippet) {
    texts.push('\n=== DEMO ===\n' + demoSnippet)
  }

  return texts.join('\n')
}

// ------------------------------------------------------------------------------------------------
// Anthropic API call
// ------------------------------------------------------------------------------------------------

async function reclassifyComponent(apiConfig, component) {
  const item = component.item
  const prompt = buildPrompt(component)

  const content = [{
    type: 'text',
    text: prompt
  }]

  const body = {
    model: apiConfig.model,
    max_tokens: 50,
    system: `You are a UI component classifier. Pick exactly ONE primary category for this component.

If the component serves multiple purposes, choose the single most fundamental one.

Respond with ONLY ONE WORD — the category. No explanation, no punctuation, nothing else.
Choose from: ${VALID_CATEGORIES.join(' | ')}`,
    messages: [{
      role: 'user',
      content
    }]
  }

  const headers = {
    'Content-Type': 'application/json',
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  }
  headers[apiConfig.authHeader] = apiConfig.token

  const response = await fetch(`${apiConfig.baseUrl}/v1/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API error ${response.status}: ${text}`)
  }

  const data = await response.json()
  const textBlock = (data.content || []).find(c => c.type === 'text')
  const text = textBlock?.text

  if (!text) {
    throw new Error('Empty response from API')
  }

  return text.trim()
}

// ------------------------------------------------------------------------------------------------
// Parse model output
// ------------------------------------------------------------------------------------------------

function parseCategory(raw) {
  let cleaned = raw.trim().toLowerCase()

  // Remove any punctuation, quotes, or extra whitespace
  cleaned = cleaned.replace(/["'.,!?;:\s]/g, ' ').replace(/\s+/g, ' ').trim()

  // Try to find a valid category word
  for (const cat of VALID_CATEGORIES) {
    if (cleaned === cat) {
      return cat
    }
    // Also match if the word appears at the start (e.g., "hero component" -> "hero")
    if (cleaned.startsWith(cat + ' ') || cleaned.startsWith(cat + '\n')) {
      return cat
    }
    // Match if it's a standalone word anywhere
    const match = cleaned.match(new RegExp(`\\b(${cat})\\b`))
    if (match) {
      return match[1]
    }
  }

  throw new Error(`Could not extract valid category from response: "${raw.slice(0, 100)}"`)
}

// ------------------------------------------------------------------------------------------------
// Main
// ------------------------------------------------------------------------------------------------

async function main() {
  console.log(`[reclassify-multi-category] Starting...`)
  console.log(`  Concurrency: ${CONCURRENCY}`)
  console.log(`  Dry run: ${DRY_RUN}`)

  const apiConfig = DRY_RUN ? null : getApiConfig()
  if (apiConfig) {
    console.log(`  API: ${apiConfig.baseUrl} (model: ${apiConfig.model})`)
  }

  // Find all classification.json files
  const allFolders = getComponentFolders()

  // Filter to those with multi-category (array or comma-joined string)
  const toProcess = []

  for (const { source, slug, folderPath, cfPath } of allFolders) {
    const classification = readJSON(cfPath)
    if (!classification) continue

    if (isMultiCategory(classification)) {
      toProcess.push({ source, slug, folderPath, cfPath, classification })
    }
  }

  console.log(`  Total components: ${allFolders.length}`)
  console.log(`  Multi-category (needs fix): ${toProcess.length}`)
  console.log(`  Single-category (ok): ${allFolders.length - toProcess.length}`)

  if (toProcess.length === 0) {
    console.log('[reclassify-multi-category] Nothing to fix.')
    return
  }

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would reclassify:')
    for (const { source, slug, classification } of toProcess) {
      console.log(`  ${source}/${slug} [current: ${JSON.stringify(classification.category)}]`)
    }
    return
  }

  // Load full component data for each to-reclassify
  const components = []
  for (const { source, slug, folderPath, cfPath, classification } of toProcess) {
    const itemPath = path.join(folderPath, 'registry-item.json')
    const item = readJSON(itemPath)
    if (!item) continue

    const mainFile = getMainComponentFile(folderPath)
    const demoFile = getDemoFile(folderPath)

    components.push({
      source,
      slug,
      folderPath,
      cfPath,
      item,
      classification,
      sourceCode: mainFile ? readTextFile(mainFile.path, 2048) : '',
      demoCode: demoFile ? readTextFile(demoFile.path, 1024) : ''
    })
  }

  console.log(`\n[${new Date().toISOString()}] Starting reclassification...`)

  const total = components.length
  let done = 0
  let success = 0
  let failed = 0
  const failures = []

  async function processOne(comp) {
    const { source, slug, folderPath, cfPath, classification, sourceCode, demoCode } = comp

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const rawText = await reclassifyComponent(apiConfig, {
          item: comp.item,
          slug,
          sourceCode,
          demoCode
        })

        const newCategory = parseCategory(rawText)

        // Update classification in place (keep all other fields)
        classification.category = newCategory
        classification._reclassifiedAt = new Date().toISOString()
        classification._reclassifierModel = 'claude-haiku-4-5-20251001'

        // Write back
        writeFileSync(cfPath, JSON.stringify(classification, null, 2), 'utf-8')

        return { status: 'success', slug: `${source}/${slug}`, newCategory }
      } catch (err) {
        const msg = err.message || String(err)
        if (attempt === 0) {
          console.warn(`  [RETRY] ${source}/${slug}: ${msg}`)
          continue
        }
        failures.push({ source, slug, error: msg })
        return { status: 'failed', slug: `${source}/${slug}` }
      }
    }
  }

  const running = []
  let idx = 0

  function throttle() {
    while (running.length < CONCURRENCY && idx < components.length) {
      const comp = components[idx++]
      const p = processOne(comp).then(result => {
        done++
        if (result.status === 'success') {
          success++
          if (done % 20 === 0 || done === total) {
            const pct = ((done / total) * 100).toFixed(1)
            console.log(`  [${done}/${total}] ${pct}% done — success: ${success}, failed: ${failed}`)
          }
        } else {
          failed++
        }

        const pos = running.indexOf(p)
        if (pos !== -1) running.splice(pos, 1)

        throttle()
      })
      running.push(p)
    }
  }

  throttle()
  await Promise.all(running)

  console.log(`\n[reclassify-multi-category] Done.`)
  console.log(`  Reclassified: ${success}`)
  console.log(`  Failed: ${failed}`)

  if (failures.length > 0) {
    const failureLogPath = path.join(ROOT, '.claude', `reclassify-failures-${new Date().toISOString().slice(0, 10)}.json`)
    try {
      const feedbackDir = path.join(ROOT, '.claude')
      if (existsSync(feedbackDir)) {
        writeFileSync(failureLogPath, JSON.stringify(failures, null, 2), 'utf-8')
        console.log(`\n  Failure log: ${failureLogPath}`)
      }
    } catch {}
  }

  if (success > 0) {
    // Spot-check 3 samples
    const samples = components.filter(c => existsSync(c.cfPath)).slice(0, 3)
    console.log('\n  Spot-check (first 3):')
    for (const { source, slug, cfPath } of samples) {
      const updated = readJSON(cfPath)
      console.log(`    ${source}/${slug}: category = "${updated.category}"`)
    }
  }
}

main().catch(err => {
  console.error('[reclassify-multi-category] Fatal:', err)
  process.exit(1)
})
