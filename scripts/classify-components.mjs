#!/usr/bin/env node
/**
 * scripts/classify-components.mjs
 *
 * AI-classifies every component in library/{source}/{slug}/ that lacks a classification.json.
 * Uses Anthropic Messages API with claude-haiku-4-5-20251001.
 *
 * Usage:
 *   node scripts/classify-components.mjs                    # classify all, concurrency 10
 *   node scripts/classify-components.mjs --limit=5          # test with 5 components
 *   node scripts/classify-components.mjs --limit=5 --dry-run  # no API calls
 *   node scripts/classify-components.mjs --concurrency=20  # faster
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

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
const LIMIT = args['limit'] != null ? parseInt(String(args['limit']), 10) : null
const DRY_RUN = args['dry-run'] === true || args['dry-run'] === 'true' || args['dry-run'] === ''

// ------------------------------------------------------------------------------------------------
// API key
// ------------------------------------------------------------------------------------------------

function getApiConfig() {
  // Priority order:
  // 1. ANTHROPIC_API_KEY  — real Anthropic API
  // 2. ANTHROPIC_AUTH_TOKEN + ANTHROPIC_BASE_URL — proxied (e.g. MiniMax, GLM, LiteLLM)
  // 3. MINIMAX_API_KEY — auto-configured for MiniMax Anthropic-compat endpoint
  // 4. ~/.anthropic/api-key file
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
      model: 'MiniMax-M2.7-highspeed',
    }
  }

  const homeKeyPath = path.join(process.env.HOME || '', '.anthropic', 'api-key')
  try {
    const key = readFileSync(homeKeyPath, 'utf-8').trim()
    if (key) return { authHeader: 'x-api-key', token: key, baseUrl: 'https://api.anthropic.com', model: 'claude-haiku-4-5-20251001' }
  } catch {}

  console.error('[classify-components] ERROR: no credentials found.')
  console.error('  Set one of: ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN+ANTHROPIC_BASE_URL, MINIMAX_API_KEY')
  process.exit(1)
}

// ------------------------------------------------------------------------------------------------
// Classification schema (what the model must return)
// ------------------------------------------------------------------------------------------------

const VALID_CATEGORIES = [
  'pricing', 'hero', 'card', 'form', 'navigation', 'overlay',
  'data-display', 'feedback', 'input', 'media', 'layout', 'other'
]

const VALID_INTERACTIONS = [
  'hover-glow', 'scroll-animate', 'drag', 'click-reveal',
  'keyboard-nav', 'parallax', 'morph', 'none'
]

const VALID_INDUSTRIES = [
  'saas', 'fintech', 'e-commerce', 'creator-tools', 'dev-tools',
  'healthcare', 'media', 'education', 'real-estate', 'other'
]

const VALID_PLATFORM_FIT = [['desktop'], ['mobile'], ['desktop', 'mobile']]

const VALID_COMPLEXITY = ['atomic', 'composite', 'system']

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
      const itemPath = path.join(sourcePath, slug, 'registry-item.json')
      if (!existsSync(itemPath)) continue
      folders.push({ source, slug, folderPath: path.join(sourcePath, slug) })
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
    // Truncate to maxBytes
    return raw.slice(0, maxBytes)
  } catch {
    return ''
  }
}

function buildPrompt(component) {
  const item = component.item
  const sourceSnippet = component.sourceCode
  const demoSnippet = component.demoCode
  const hasPreview = component.hasPreview

  const texts = []

  // Metadata block
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

async function classifyComponent(apiConfig, component) {
  const item = component.item
  const prompt = buildPrompt(component)

  const content = []

  // Add preview image if available
  if (component.hasPreview) {
    try {
      const imageData = readFileSync(component.previewPath).toString('base64')
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: 'image/png',
          data: imageData
        }
      })
    } catch (e) {
      // Image read failed — continue without it
    }
  }

  // Add text prompt
  content.push({
    type: 'text',
    text: prompt
  })

  const body = {
    model: apiConfig.model,
    // Generous budget — reasoning models (MiniMax, GLM) need headroom for thinking
    // before emitting JSON. Haiku/Sonnet don't use it unless thinking mode is on.
    max_tokens: 2000,
    system: `You are a UI component classifier. Given a React component's source, demo, and metadata, classify it with structured JSON. Return ONLY valid JSON matching the schema below. No prose, no markdown fences, no explanation — just the JSON object. All fields required. Use empty arrays [] for lists with no matches, never null.

Schema:
${JSON.stringify({
  category: VALID_CATEGORIES,
  subcategory: 'string (free-form, specific descriptor)',
  visual_style: ['glass-morphism', 'dark', 'gradient-border', 'neobrutalism', 'minimalist', 'skeuomorphic', 'gradient', 'flat', '3d', 'illustration', 'mono', 'colorful'],
  interactions: VALID_INTERACTIONS,
  best_for_industries: VALID_INDUSTRIES,
  platform_fit: ['desktop', 'mobile', 'desktop, mobile'],
  complexity: VALID_COMPLEXITY,
  use_cases: ['string (1 sentence each, up to 5)'],
  ai_summary: 'string (2-3 sentences, LLM-optimized retrieval description)'
}, null, 2)}`,
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
  // Some providers (e.g. MiniMax reasoning models) return multiple content blocks —
  // a "thinking" block followed by a "text" block. Find the first text block.
  const textBlock = (data.content || []).find(c => c.type === 'text')
  const text = textBlock?.text

  if (!text) {
    throw new Error('Empty response from API (content: ' + JSON.stringify(data.content || data).slice(0, 200) + ')')
  }

  return text.trim()
}

// ------------------------------------------------------------------------------------------------
// Parse & validate model output
// ------------------------------------------------------------------------------------------------

function parseClassification(raw) {
  // Strip markdown fences if present
  let cleaned = raw.trim()
  if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7)
  if (cleaned.startsWith('```')) cleaned = cleaned.slice(3)
  if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3)
  cleaned = cleaned.trim()

  const obj = JSON.parse(cleaned)

  // Validate top-level keys
  const required = ['category', 'subcategory', 'visual_style', 'interactions',
    'best_for_industries', 'platform_fit', 'complexity', 'use_cases', 'ai_summary']
  for (const k of required) {
    if (!(k in obj)) throw new Error(`Missing key: ${k}`)
  }

  // Normalize platform_fit to array
  if (typeof obj.platform_fit === 'string') {
    const s = obj.platform_fit.toLowerCase()
    if (s === 'desktop') obj.platform_fit = ['desktop']
    else if (s === 'mobile') obj.platform_fit = ['mobile']
    else if (s.includes('desktop') && s.includes('mobile')) obj.platform_fit = ['desktop', 'mobile']
    else if (s.includes('both') || s.includes('mixed')) obj.platform_fit = ['desktop', 'mobile']
    else obj.platform_fit = ['desktop', 'mobile']
  }

  // Normalize arrays (ensure empty arrays, not null)
  for (const k of ['visual_style', 'interactions', 'best_for_industries', 'use_cases']) {
    if (!Array.isArray(obj[k])) obj[k] = []
  }

  return obj
}

// ------------------------------------------------------------------------------------------------
// Main
// ------------------------------------------------------------------------------------------------

async function main() {
  console.log(`[classify-components] Starting...`)
  console.log(`  Concurrency: ${CONCURRENCY}`)
  console.log(`  Limit: ${LIMIT ?? 'unlimited'}`)
  console.log(`  Dry run: ${DRY_RUN}`)

  const apiConfig = DRY_RUN ? null : getApiConfig()
  if (apiConfig) {
    console.log(`  API: ${apiConfig.baseUrl} (model: ${apiConfig.model})`)
  }

  // Find all component folders
  const allFolders = getComponentFolders()

  // Filter to those missing classification.json
  const toProcess = allFolders.filter(({ source, slug, folderPath }) => {
    const cf = path.join(folderPath, 'classification.json')
    return !existsSync(cf)
  })

  console.log(`  Total components: ${allFolders.length}`)
  console.log(`  Already classified: ${allFolders.length - toProcess.length}`)
  console.log(`  Need classification: ${toProcess.length}`)

  if (LIMIT) {
    toProcess.length = Math.min(toProcess.length, LIMIT)
    console.log(`  Limited to: ${toProcess.length}`)
  }

  if (toProcess.length === 0) {
    console.log('[classify-components] Nothing to classify.')
    return
  }

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Would classify:')
    for (const { source, slug } of toProcess) {
      console.log(`  ${source}/${slug}`)
    }
    return
  }

  // Load registry items + source for each component
  const components = []
  for (const { source, slug, folderPath } of toProcess) {
    const itemPath = path.join(folderPath, 'registry-item.json')
    const item = readJSON(itemPath)
    if (!item) continue

    const mainFile = getMainComponentFile(folderPath)
    const demoFile = getDemoFile(folderPath)
    const previewPath = path.join(folderPath, 'preview.png')
    const hasPreview = existsSync(previewPath)

    components.push({
      source,
      slug,
      folderPath,
      item,
      mainFile,
      demoFile,
      previewPath,
      hasPreview,
      sourceCode: mainFile ? readTextFile(mainFile.path, 2048) : '',
      demoCode: demoFile ? readTextFile(demoFile.path, 1024) : ''
    })
  }

  console.log(`\n[${new Date().toISOString()}] Starting classification...`)

  const now = new Date().toISOString()
  const total = components.length
  let done = 0
  let success = 0
  let failed = 0
  const failures = []

  // Failure log path
  const failureLogPath = path.join(ROOT, '.claude', `classify-failures-${now.slice(0, 10)}.json`)

  async function processOne(comp) {
    const { source, slug, folderPath, item, sourceCode, demoCode, hasPreview } = comp

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const rawText = await classifyComponent(apiConfig, {
          item,
          sourceCode,
          demoCode,
          hasPreview
        })

        const classification = parseClassification(rawText)

        // Add metadata
        classification._classifiedAt = new Date().toISOString()
        classification._classifierModel = 'claude-haiku-4-5-20251001'

        // Write file
        const cfPath = path.join(folderPath, 'classification.json')
        writeFileSync(cfPath, JSON.stringify(classification, null, 2), 'utf-8')

        return { status: 'success', slug: `${source}/${slug}` }
      } catch (err) {
        const msg = err.message || String(err)
        if (attempt === 0) {
          // Retry once
          console.warn(`  [RETRY] ${source}/${slug}: ${msg}`)
          continue
        }
        // Second failure
        failures.push({ source, slug, error: msg })
        return { status: 'failed', slug: `${source}/${slug}` }
      }
    }
  }

  // Simple concurrency control using a running-promises queue
  const running = []
  let idx = 0

  function throttle() {
    while (running.length < CONCURRENCY && idx < components.length) {
      const comp = components[idx++]
      const p = processOne(comp).then(result => {
        done++
        if (result.status === 'success') {
          success++
        } else {
          failed++
        }

        // Progress every 20
        if (done % 20 === 0 || done === total) {
          const pct = ((done / total) * 100).toFixed(1)
          console.log(`  [${done}/${total}] ${pct}% done — success: ${success}, failed: ${failed}`)
        }

        // Remove from running list
        const pos = running.indexOf(p)
        if (pos !== -1) running.splice(pos, 1)

        // Trigger next batch
        throttle()
      })
      running.push(p)
    }
  }

  throttle()

  // Wait for all to complete
  await Promise.all(running)

  // Write failure log
  if (failures.length > 0) {
    try {
      const feedbackDir = path.join(ROOT, '.claude')
      if (!existsSync(feedbackDir)) {
        // Skip writing failure log if .claude dir doesn't exist
      } else {
        writeFileSync(failureLogPath, JSON.stringify(failures, null, 2), 'utf-8')
        console.log(`\n  Failure log: ${failureLogPath}`)
      }
    } catch {}
  }

  // Token cost estimation: ~2000 in + ~300 out per component
  const estIn = total * 2000
  const estOut = total * 300
  const costIn = (estIn / 1_000_000) * 1.0  // $1/Mtok in
  const costOut = (estOut / 1_000_000) * 5.0 // $5/Mtok out
  const totalCost = costIn + costOut

  console.log(`\n[classify-components] Done.`)
  console.log(`  Classified: ${success}`)
  console.log(`  Failed: ${failed}`)
  console.log(`  Est. tokens in: ${estIn.toLocaleString()} (~$${costIn.toFixed(2)})`)
  console.log(`  Est. tokens out: ${estOut.toLocaleString()} (~$${costOut.toFixed(2)})`)
  console.log(`  Est. total cost: ~$${totalCost.toFixed(2)}`)

  if (success > 0) {
    // Show first ai_summary as spot-check sample
    const first = components.find(c => existsSync(path.join(c.folderPath, 'classification.json')))
    if (first) {
      const cf = readJSON(path.join(first.folderPath, 'classification.json'))
      if (cf?.ai_summary) {
        console.log(`\n  Spot-check (${first.source}/${first.slug}):`)
        console.log(`  "${cf.ai_summary.slice(0, 200)}..."`)
      }
    }
  }
}

main().catch(err => {
  console.error('[classify-components] Fatal:', err)
  process.exit(1)
})
