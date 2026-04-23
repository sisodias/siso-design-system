# Ranking + Retrieval Design — `/api/query`

**Status:** design · **Date:** 2026-04-23
**Scope:** Add a ranked-retrieval endpoint over the classified component bank. Current `getFilteredComponents` filters but doesn't rank. External agents want "give me the 5 best dark glassmorphism pricing cards for SaaS" — that's ranking, not filtering.

---

## Scoring function

`score(component, brief) → [0, 1]`. Weighted sum of 5 signals:

```
score = 0.40 * facet_match
      + 0.30 * text_relevance
      + 0.15 * elo_normalized
      + 0.10 * curated_boost
      + 0.05 * renderable
```

**`facet_match`** — fraction of brief's facet terms the component satisfies. If brief asks for 3 styles and component has 2 of them, `facet_match = 2/3`. Hard-gates (category, complexity, platform) disqualify on mismatch; facet_match is computed over soft facets (visualStyle, industry) only.

**`text_relevance`** — BM25 over `aiSummary + useCases` (concatenated). Params k1=1.5, b=0.75 (shadcn-standard). IDF precomputed at manifest-build time.

**`elo_normalized`** — `clamp((effective_elo - 1000) / 500, 0, 1)`. Uses Bayesian-shrunk Elo (see `RATING_MATH_DESIGN.md`).

**`curated_boost`** — `1.0` if `_provenance.importMode === "curated"`, `0.5` otherwise. Multiplicative, not additive, at integration — but treat as 0-1 for the weighted sum here.

**`renderable`** — `1.0` renderable, `0.0` non-renderable. Non-renderable components still rank (as code references) but at a penalty.

Weights justified: facet match is the point of the query (highest weight). Text is secondary context. Elo is a weak signal until votes accumulate, so low weight. Curation is an editorial nudge. Renderability is a tiebreaker-level signal.

---

## Bayesian Elo prior (referenced from RATING_MATH_DESIGN.md)

```
effective_elo = (elo * votes + 1200 * 20) / (votes + 20)
```

At 0 votes: 1200 (neutral). At 100 votes: raw contributes 83%. `K_prior = 20`.

---

## Text relevance — BM25

Chosen over TF-IDF cosine for: handles short queries better, doesn't require query vectorization, robust to document-length variance. Chosen over token-overlap (Jaccard) for: weights rare terms higher, which matters when "glassmorphism" is more signal than "dark".

Tokenization: lowercase, split on `/\W+/`, drop length < 2. Stopwords: standard English 200-word list, PLUS UI-specific filler (`component`, `ui`, `react`, `design`, `layout`). Tokens lemmatized (simple suffix stripper, no full stemmer — keep deterministic).

IDF precomputed at manifest-build time, stored at `library/manifest.json` under `facets.idf: { [token]: number }`. Size estimate at 4,700 components × ~30 unique tokens per aiSummary × 2 bytes per token = ~280KB extra manifest.

Per-component token lists also stored in each `ManifestEntry.tokens: string[]` — another ~30 tokens × 15 bytes avg × 4,700 = ~2MB. Acceptable.

---

## API shape

`POST /api/query` (POST, not GET, because briefs can be long):

```json
{
  "categories": ["pricing", "hero"],
  "visualStyles": ["dark", "glassmorphism"],
  "industries": ["saas"],
  "complexity": ["composite"],
  "platforms": ["desktop"],
  "query": "tiered pricing with feature comparison",
  "limit": 10,
  "mode": "strict" | "loose",
  "includeNonRenderable": false
}
```

Response:

```json
{
  "brief": {...echoed...},
  "total_matched": 217,
  "returned": 10,
  "results": [
    {
      "source": "21st-dev",
      "slug": "pricing-card-foo",
      "score": 0.87,
      "score_breakdown": {
        "facet_match": 0.90,
        "text_relevance": 0.78,
        "elo_normalized": 0.60,
        "curated_boost": 0.50,
        "renderable": 1.00
      },
      "component": { ...full ComponentEntry... }
    }
  ]
}
```

CORS open. `OPTIONS` handler returns 204. `force-dynamic`.

---

## Tiebreakers (when scores within 0.01)

1. `effective_elo` higher
2. `vote_count` higher (more confident signal)
3. `renderable` beats non-renderable
4. `importMode === "curated"` wins
5. Alphabetical `source/slug`

---

## Edge cases

**Zero matches** — return `{ total_matched: 0, returned: 0, results: [], suggestion: "loosen strict filters (try ?mode=loose)" }`. Don't 404.

**Free-text only brief (no facets)** — category-agnostic; text_relevance dominates. Weights stay same; facet_match = 1.0 when no facet constraints (nothing to mismatch).

**Overspecified brief** — if `hard` filters leave zero, degrade gracefully: echo `total_matched: 0` + suggestion. Don't silently drop filters.

**Conflicting hard + soft** — hard filters apply first as HARD GATE. Soft filters then rank within the passing set.

---

## Hard vs soft

Default:
- HARD (disqualify on mismatch): `category`, `complexity`, `platform`, `includeNonRenderable`
- SOFT (penalize but keep): `visualStyle`, `industry`, `query`

`?mode=loose` demotes everything to SOFT — useful for exploratory queries.

---

## Precomputation at build time

`scripts/build-manifest.mjs` extended to:
1. Tokenize every `aiSummary + useCases` string per component
2. Compute IDF across the corpus: `idf(t) = log(N / df(t))` where `df(t)` = number of docs containing token `t`
3. Emit per-component `tokens[]` into `ManifestEntry`
4. Emit `facets.idf: { token: number }` into the manifest

Runtime ranker (`viewer/lib/ranker.ts`) reads these, never re-tokenizes. Scoring per component: ~50μs (token set intersection + BM25 sum). At 4,700 components: <250ms for a full sweep. Acceptable without sharding.

---

## File-level implementation plan (Haiku worker)

- CREATE `viewer/lib/ranker.ts` — BM25 + weighted composite scorer + `rankComponents(components, brief)` helper
- CREATE `viewer/app/api/query/route.ts` — POST route + CORS + OPTIONS
- MODIFY `scripts/build-manifest.mjs` — tokenization + IDF precompute
- MODIFY `viewer/lib/types.ts` — `ManifestEntry.tokens?: string[]`, `Manifest.facets.idf?: Record<string, number>`
- MODIFY `viewer/lib/registry.ts` — new `getRanked(brief): RankedResult[]` helper that wraps `getFilteredComponents` + ranker
- No UI surface in v1 — agents consume the API directly. `/query` page is v2.

---

## Acceptance criteria

1. `POST /api/query {categories:["pricing"], visualStyles:["dark"]}` returns ≥5 results. All have `category === "pricing"` (hard). Top result's `score >= 0.7`.
2. Same brief with `mode: "loose"` returns ≥10 results (includes partial-facet matches).
3. `POST /api/query {query: "spring animation"}` returns results where `ai_summary` or `useCases` actually mentions "spring" or synonyms.
4. Score breakdown present on every result; weights sum to 1.0.
5. Tiebreaker: two hand-crafted components with identical computed scores differ in final rank by elo.
6. Zero-match brief returns 200 + empty results + suggestion string (not 404).
7. Cold-start query latency < 500ms at 4,700 components (no rebuilding IDF).
8. `npm run build` exits 0 after all changes.
9. IDF table in manifest is < 500KB.
10. CORS: `OPTIONS /api/query` returns 204 with `Access-Control-Allow-Origin: *`.

---

## Future extensions

- Swap BM25 for local embedding similarity (SentenceTransformers via ONNX) when we can ship them in-browser
- Personalized weights per-user (Shaan's Elo vs Shaan-for-client Elo — consume from `component_tags` in `CURATION_SETS_DESIGN.md`)
- `?debug=1` flag that returns explanation strings per score component
- Query-expansion: if `query: "glass pricing"`, auto-add `visualStyles: ["glassmorphism"]` by fuzzy-matching the vocabulary
