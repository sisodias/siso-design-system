#!/usr/bin/env node
/**
 * scripts/generate-thumbnails.mjs
 *
 * Generates static PNG thumbnails for all components in the manifest using Playwright.
 * Screenshots are saved to library/{source}/{slug}/preview.png and copied to
 * viewer/public/thumbnails/{source}__{slug}.png for Next.js static serving.
 *
 * After all screenshots succeed, re-invokes scripts/build-manifest.mjs so the manifest
 * picks up hasThumbnail: true + thumbnail: "/thumbnails/{source}__{slug}.png".
 *
 * Usage:
 *   node scripts/generate-thumbnails.mjs [--concurrency=4] [--force]
 *
 * Prerequisites:
 *   - Viewer dev server running on http://localhost:3005 (started automatically if not)
 *   - npx playwright install chromium (run once)
 *   - git lfs install (for tracking PNGs)
 */

import { chromium } from '../viewer/node_modules/playwright/index.mjs'
import { readFileSync, writeFileSync, copyFileSync, statSync, mkdirSync, existsSync } from 'fs'
import { execSync, spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LIBRARY_ROOT = path.join(ROOT, 'library')
const MANIFEST_PATH = path.join(ROOT, 'library', 'manifest.json')
const THUMBNAILS_PUBLIC = path.join(ROOT, 'viewer', 'public', 'thumbnails')
const VIEWER_URL = 'http://localhost:3005'
const SCREENSHOT_WIDTH = 1200
const SCREENSHOT_HEIGHT = 900

// ---- Parse CLI args ----
const args = process.argv.slice(2)
const concurrencyArg = args.find(a => a.startsWith('--concurrency='))
const CONCURRENCY = concurrencyArg ? parseInt(concurrencyArg.split('=')[1], 10) : 4
const FORCE = args.includes('--force')

// ---- Check git lfs ----
try {
  execSync('git lfs --version', { stdio: 'pipe' })
} catch {
  console.warn('[thumbnails] WARNING: git lfs not installed. PNGs will not be tracked under LFS.')
  console.warn('[thumbnails] Install: https://git-lfs.github.com/')
}

// ---- Check if viewer is reachable ----
async function checkViewerReachable() {
  try {
    const { default: http } = await import('http')
    return new Promise((resolve) => {
      const req = http.get(VIEWER_URL, (res) => {
        resolve(res.statusCode < 500)
      })
      req.on('error', () => resolve(false))
      req.setTimeout(3000, () => { req.destroy(); resolve(false) })
    })
  } catch {
    return false
  }
}

// ---- Start dev server if not running ----
let devServerProcess = null

async function ensureDevServer() {
  const reachable = await checkViewerReachable()
  if (reachable) {
    console.log(`[thumbnails] Viewer already running at ${VIEWER_URL}`)
    return false
  }

  console.log(`[thumbnails] Dev server not reachable at ${VIEWER_URL}. Starting...`)
  devServerProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(ROOT, 'viewer'),
    stdio: 'pipe',
    detached: false,
    shell: true,
  })

  // Wait up to 30s for server to come up
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000))
    const up = await checkViewerReachable()
    if (up) {
      console.log(`[thumbnails] Dev server started (waited ${i + 1}s)`)
      // Give it another 2s to fully initialize
      await new Promise(r => setTimeout(r, 2000))
      return true
    }
    if (i % 5 === 4) console.log(`[thumbnails] Still waiting for dev server... (${i + 1}s)`)
  }

  console.error(`[thumbnails] ERROR: Dev server did not start within 30s. Aborting.`)
  process.exit(1)
}

function stopDevServer() {
  if (devServerProcess) {
    try {
      devServerProcess.kill('SIGTERM')
      devServerProcess = null
    } catch {
      // ignore
    }
  }
}

// ---- Idempotency check ----
function shouldSkip(source, slug) {
  if (FORCE) return false

  const previewPath = path.join(LIBRARY_ROOT, source, slug, 'preview.png')
  const registryPath = path.join(LIBRARY_ROOT, source, slug, 'registry-item.json')

  if (!existsSync(previewPath)) return false

  try {
    const previewMtime = statSync(previewPath).mtimeMs
    const registryMtime = statSync(registryPath).mtimeMs
    if (previewMtime > registryMtime) {
      return true
    }
  } catch {
    return false
  }

  return false
}

// ---- Screenshot single component ----
async function screenshotComponent(browser, component) {
  const { source, name: slug } = component
  const previewPath = path.join(LIBRARY_ROOT, source, slug, 'preview.png')
  const publicPath = path.join(THUMBNAILS_PUBLIC, `${source}__${slug}.png`)

  if (shouldSkip(source, slug)) {
    console.log(`[thumbnails] SKIP  ${source}/${slug} (preview.png newer than registry-item.json)`)
    return { source, slug, skipped: true }
  }

  const url = `${VIEWER_URL}/preview/${encodeURIComponent(source)}/${encodeURIComponent(slug)}`
  const page = await browser.newPage()

  try {
    await page.setViewportSize({ width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT })
    // Use 'load' then a fixed settle rather than 'networkidle', because many components
    // have infinite animations / WebSocket connections that prevent networkidle.
    await page.goto(url, { waitUntil: 'load', timeout: 30000 })

    // Settle time for CSS animations / hydration to paint first frame
    await page.waitForTimeout(800)

    await page.screenshot({
      path: previewPath,
      type: 'png',
      clip: { x: 0, y: 0, width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT },
    })

    // Copy to public/thumbnails for Next.js static serving
    mkdirSync(THUMBNAILS_PUBLIC, { recursive: true })
    copyFileSync(previewPath, publicPath)

    console.log(`[thumbnails] DONE  ${source}/${slug}`)
    return { source, slug, skipped: false, success: true }
  } catch (err) {
    console.error(`[thumbnails] FAIL  ${source}/${slug}: ${err.message}`)
    return { source, slug, skipped: false, success: false, error: err.message }
  } finally {
    await page.close()
  }
}

// ---- Process queue with concurrency limit ----
async function processQueue(items, processor, concurrency) {
  const results = []
  let idx = 0

  async function worker() {
    while (idx < items.length) {
      const i = idx++
      const result = await processor(items[i])
      results[i] = result
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker)
  await Promise.all(workers)
  return results
}

// ---- Main ----
async function main() {
  // Read manifest
  let manifest
  try {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))
  } catch (err) {
    console.error(`[thumbnails] ERROR: Could not read manifest at ${MANIFEST_PATH}`)
    console.error(`[thumbnails] Run: node scripts/build-manifest.mjs`)
    process.exit(1)
  }

  const components = manifest.components
  console.log(`[thumbnails] ${components.length} components found in manifest`)
  console.log(`[thumbnails] Concurrency: ${CONCURRENCY}${FORCE ? ' (force mode — skipping idempotency check)' : ''}`)

  // Ensure public thumbnails dir exists
  mkdirSync(THUMBNAILS_PUBLIC, { recursive: true })

  // Check/start dev server
  const weStartedServer = await ensureDevServer()

  // Launch browser
  const browser = await chromium.launch({ headless: true })

  let results
  try {
    results = await processQueue(
      components,
      (component) => screenshotComponent(browser, component),
      CONCURRENCY,
    )
  } finally {
    await browser.close()
    if (weStartedServer) {
      stopDevServer()
    }
  }

  const succeeded = results.filter(r => !r.skipped && r.success)
  const skipped = results.filter(r => r.skipped)
  const failed = results.filter(r => !r.skipped && !r.success)

  console.log(`\n[thumbnails] Summary:`)
  console.log(`  Generated: ${succeeded.length}`)
  console.log(`  Skipped:   ${skipped.length}`)
  console.log(`  Failed:    ${failed.length}`)

  if (failed.length > 0) {
    console.error('\n[thumbnails] Failed components:')
    for (const r of failed) {
      console.error(`  ${r.source}/${r.slug}: ${r.error}`)
    }
  }

  if (failed.length > 0) {
    console.error('\n[thumbnails] Some screenshots failed. Not rebuilding manifest.')
    process.exit(1)
  }

  // Re-run build-manifest to populate hasThumbnail + thumbnail fields
  console.log('\n[thumbnails] Rebuilding manifest to update thumbnail metadata...')
  try {
    execSync(`node ${path.join(ROOT, 'scripts', 'build-manifest.mjs')}`, {
      stdio: 'inherit',
      cwd: ROOT,
    })
  } catch (err) {
    console.error('[thumbnails] ERROR: build-manifest.mjs failed:', err.message)
    process.exit(1)
  }

  console.log(`\n[thumbnails] All done. ${succeeded.length + skipped.length} components have thumbnails.`)
}

main().catch(err => {
  console.error('[thumbnails] Fatal error:', err)
  stopDevServer()
  process.exit(1)
})
