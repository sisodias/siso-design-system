/**
 * viewer/lib/ranker.ts
 *
 * BM25-weighted ranking over the component manifest.
 * Pure scoring — zero side effects.
 *
 * Weights (per RANKING_DESIGN.md):
 *   0.40 * facet_match
 *   0.30 * text_relevance
 *   0.15 * elo_normalized
 *   0.10 * curated_boost
 *   0.05 * renderable
 */

import { ComponentEntry, Manifest } from './types'

// ------------------------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------------------------

export type Brief = {
  categories?: string[]
  visualStyles?: string[]
  industries?: string[]
  complexity?: ('atomic' | 'composite' | 'system')[]
  platforms?: ('desktop' | 'mobile')[]
  query?: string
  limit?: number
  mode?: 'strict' | 'loose'
  includeNonRenderable?: boolean
}

export type ScoreBreakdown = {
  facet_match: number
  text_relevance: number
  elo_normalized: number
  curated_boost: number
  renderable: number
}

export type RankedResult = {
  source: string
  slug: string
  score: number
  score_breakdown: ScoreBreakdown
  component: ComponentEntry
}

// ------------------------------------------------------------------------------------------------
// BM25 params
// ------------------------------------------------------------------------------------------------

const BM25_K1 = 1.5
const BM25_B = 0.75

// ------------------------------------------------------------------------------------------------
// Tokenization
// ------------------------------------------------------------------------------------------------

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for',
  'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'shall', 'this', 'that', 'these', 'those', 'it',
  'its', 'component', 'ui', 'react', 'design', 'layout',
])

function tokenize(text: string): string[] {
  if (!text) return []
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter(t => t.length >= 2 && !STOPWORDS.has(t))
}

// ------------------------------------------------------------------------------------------------
// Effective Elo (Bayesian-shrunk)
// ------------------------------------------------------------------------------------------------

const ELO_K_PRIOR = 20
const ELO_PRIOR = 1200

function effectiveElo(votes: number, elo: number): number {
  return (elo * votes + ELO_PRIOR * ELO_K_PRIOR) / (votes + ELO_K_PRIOR)
}

function eloNormalized(effectiveEloVal: number): number {
  return Math.min(1, Math.max(0, (effectiveEloVal - 1000) / 500))
}

// ------------------------------------------------------------------------------------------------
// Per-component scoring
// ------------------------------------------------------------------------------------------------

function facetMatchScore(
  brief: Brief,
  component: ComponentEntry,
): number {
  const bVisualStyles = brief.visualStyles ?? []
  const bIndustries = brief.industries ?? []

  // No facet constraints → perfect match
  if (bVisualStyles.length === 0 && bIndustries.length === 0) return 1.0

  let score = 0.0
  let total = 0

  if (bVisualStyles.length > 0) {
    total += bVisualStyles.length
    const cStyles = (component.visualStyle ?? []).map(v => v.toLowerCase())
    for (const wanted of bVisualStyles) {
      if (cStyles.includes(wanted.toLowerCase())) score += 1
    }
  }

  if (bIndustries.length > 0) {
    total += bIndustries.length
    const cIndustries = (component.bestForIndustries ?? []).map(v => v.toLowerCase())
    for (const wanted of bIndustries) {
      if (cIndustries.includes(wanted.toLowerCase())) score += 1
    }
  }

  return total === 0 ? 1.0 : score / total
}

function bm25Score(
  queryTokens: string[],
  docTokens: string[],
  docLength: number,
  avgDocLength: number,
  idf: Record<string, number>,
): number {
  if (queryTokens.length === 0 || docTokens.length === 0) return 0.0

  let score = 0.0
  const docTf = new Map<string, number>()
  for (const t of docTokens) docTf.set(t, (docTf.get(t) ?? 0) + 1)

  for (const term of queryTokens) {
    const tf = docTf.get(term) ?? 0
    const idfVal = idf[term] ?? 0
    if (idfVal === 0) continue

    const numerator = tf * (BM25_K1 + 1)
    const denominator = tf + BM25_K1 * (1 - BM25_B + BM25_B * (docLength / avgDocLength))
    score += idfVal * (numerator / denominator)
  }

  return score
}

function scoreComponent(
  component: ComponentEntry,
  manifest: Manifest,
  brief: Brief,
): { score: number; breakdown: ScoreBreakdown } {
  const tokens = component.tokens ?? []
  const avgDocLen = (manifest as any)._avgTokens ?? 30
  const idf = manifest.facets.idf ?? {}

  // Query tokenization
  const queryText = brief.query ?? ''
  const queryTokens = tokenize(queryText)

  // BM25 text score
  const rawBm25 = bm25Score(queryTokens, tokens, tokens.length, avgDocLen, idf)

  // Min/max normalise BM25 over the set — compute later when we have all results.
  // For single-component scoring we return raw BM25; normalise during final sort.
  const text_relevance = rawBm25

  // Elo
  const eloVal = (component as any).elo ?? 1200
  const votes = (component as any).votes ?? 0
  const effElo = effectiveElo(votes, eloVal)
  const elo_normalized = eloNormalized(effElo)

  // Curated boost
  const curated_boost = component.importMode === 'curated' ? 1.0 : 0.5

  // Renderable
  const renderable = component.preview?.renderable !== false ? 1.0 : 0.0

  // Facet match
  const facet_match = facetMatchScore(brief, component)

  const breakdown: ScoreBreakdown = {
    facet_match,
    text_relevance,
    elo_normalized,
    curated_boost,
    renderable,
  }

  const score =
    0.40 * facet_match +
    0.30 * text_relevance +
    0.15 * elo_normalized +
    0.10 * curated_boost +
    0.05 * renderable

  return { score, breakdown }
}

// ------------------------------------------------------------------------------------------------
// Normalise BM25 scores across a result set using min-max scaling to [0,1]
// ------------------------------------------------------------------------------------------------

function normalizeResults(results: RankedResult[]): RankedResult[] {
  const scores = results.map(r => r.score_breakdown.text_relevance)
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const range = max - min

  if (range === 0) {
    // All tied on text — leave as-is
    return results
  }

  return results.map(r => ({
    ...r,
    score_breakdown: {
      ...r.score_breakdown,
      text_relevance: (r.score_breakdown.text_relevance - min) / range,
    },
    score:
      0.40 * r.score_breakdown.facet_match +
      0.30 * ((r.score_breakdown.text_relevance - min) / range) +
      0.15 * r.score_breakdown.elo_normalized +
      0.10 * r.score_breakdown.curated_boost +
      0.05 * r.score_breakdown.renderable,
  }))
}

// ------------------------------------------------------------------------------------------------
// Hard gate — disqualify on category, complexity, platform mismatch (strict mode only)
// ------------------------------------------------------------------------------------------------

function passesHardGates(component: ComponentEntry, brief: Brief): boolean {
  if (brief.mode === 'loose') return true

  if (brief.categories && brief.categories.length > 0) {
    const cats = (component.category ?? []).map(v => v.toLowerCase())
    if (!brief.categories.some(c => cats.includes(c.toLowerCase()))) return false
  }

  if (brief.complexity && brief.complexity.length > 0) {
    const comp = component.complexity
    if (!comp || !brief.complexity.includes(comp as any)) return false
  }

  if (brief.platforms && brief.platforms.length > 0) {
    const plat = component.platform?.toLowerCase()
    if (!brief.platforms.map(p => p.toLowerCase()).includes(plat ?? '')) return false
  }

  if (!brief.includeNonRenderable && component.preview?.renderable === false) {
    return false
  }

  return true
}

// ------------------------------------------------------------------------------------------------
// Tiebreaker — when two scores are within 0.01
// ------------------------------------------------------------------------------------------------

function tiebreaker(a: RankedResult, b: RankedResult): number {
  if (Math.abs(a.score - b.score) > 0.01) return 0

  const aElo = (a.component as any).elo ?? 1200
  const bElo = (b.component as any).elo ?? 1200
  if (aElo !== bElo) return bElo - aElo

  const aVotes = (a.component as any).votes ?? 0
  const bVotes = (b.component as any).votes ?? 0
  if (aVotes !== bVotes) return bVotes - aVotes

  const aRenderable = a.component.preview?.renderable !== false ? 1 : 0
  const bRenderable = b.component.preview?.renderable !== false ? 1 : 0
  if (aRenderable !== bRenderable) return bRenderable - aRenderable

  const aCurated = a.component.importMode === 'curated' ? 1 : 0
  const bCurated = b.component.importMode === 'curated' ? 1 : 0
  if (aCurated !== bCurated) return bCurated - aCurated

  return `${a.source}/${a.slug}`.localeCompare(`${b.source}/${b.slug}`)
}

// ------------------------------------------------------------------------------------------------
// Precompute average token count for BM25 length normalisation
// ------------------------------------------------------------------------------------------------

function computeAvgTokens(components: ComponentEntry[]): number {
  if (components.length === 0) return 30
  let total = 0
  for (const c of components) {
    total += (c.tokens ?? []).length
  }
  return total / components.length
}

// ------------------------------------------------------------------------------------------------
// Public API
// ------------------------------------------------------------------------------------------------

export function rank(
  components: ComponentEntry[],
  manifest: Manifest,
  brief: Brief,
): RankedResult[] {
  // Attach avg tokens to manifest for BM25 scoring
  const avgTokens = computeAvgTokens(components)
  const manifestWithAvg = { ...manifest, _avgTokens: avgTokens } as Manifest & { _avgTokens: number }

  // Hard gate first
  let candidates = components.filter(c => passesHardGates(c, brief))

  // Score each candidate
  let results: RankedResult[] = candidates.map(component => {
    const { score, breakdown } = scoreComponent(component, manifestWithAvg, brief)
    return {
      source: component.source,
      slug: component.name,
      score,
      score_breakdown: breakdown,
      component,
    }
  })

  // Normalise text_relevance across the set
  results = normalizeResults(results)

  // Sort: primary by score desc, then tiebreaker
  results.sort((a, b) => {
    const scoreDiff = b.score - a.score
    if (Math.abs(scoreDiff) > 0.01) return scoreDiff
    return tiebreaker(a, b)
  })

  // Apply limit
  const limit = brief.limit ?? 20
  return results.slice(0, limit)
}
