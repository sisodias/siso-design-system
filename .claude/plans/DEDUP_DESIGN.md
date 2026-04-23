# Cross-Source Component Deduplication — Design Doc

**Status:** design · **Created:** 2026-04-23 · **Owner:** Shaan (planner: Opus)
**Goal:** detect components that exist in multiple source namespaces (e.g. `motion-primitives/carousel` vs `21st-dev/ibelick-carousel`), pick a canonical per cluster, and hide the rest from default listings without deleting them.

## Problem

The manifest currently counts `21st-dev: 2,190` and `motion-primitives: 33` as if they were disjoint sets. They are not. 21st.dev aggregates primitives that originate in motion-primitives (`ibelick/*` slugs are Emil Kowalski's motion-primitives republished with a user prefix). The same pattern will repeat with reactbits, kokonutui, originui, cult-ui — once bulk import lands, the "2,200 components" number is inflated by duplicates.

Concrete observed overlaps after a 60-second inspection of `library/motion-primitives/` vs `library/21st-dev/ | grep ibelick`:

| motion-primitives slug | 21st-dev alias |
|---|---|
| `carousel` | `ibelick-carousel` |
| `morphing-popover` | `ibelick-morphing-popover` |
| `progressive-blur` | `ibelick-progressive-blur` |
| `text-effect` | `ibelick-text-effect` |
| `text-scramble` | `ibelick-text-scramble` |

At least 5 certain duplicates in the current 2,223-component manifest with no dedup pass. Extrapolating across 5,300 post-bulk-import components: ~200-400 duplicate clusters expected.

## 1. Detection algorithm

Deterministic pairwise similarity score in `[0, 1]`. Must run in <10s on 5,000 components.

**Signals per pair `(a, b)`:**

- **Normalized slug similarity** — strip known source prefixes (`ibelick-`, `kokonut-`, `reactbits-`, `originui-`, `bg.`), lowercase, drop `-`/`_`/`.`. Compute Levenshtein ratio `1 - distance(a, b) / max(len(a), len(b))`. Range `[0, 1]`.
- **Author-handle match** — extract handle from 21st-dev slugs (prefix before first `-`, e.g. `ibelick` from `ibelick-carousel`). If both sides map to the same upstream author OR one side's source equals the other's inferred author, score `0.4`. No match `0`. Binary, weighted into the final score.
- **Dependency Jaccard** — `|deps(a) ∩ deps(b)| / |deps(a) ∪ deps(b)|` over the `dependencies[]` array in each `registry-item.json`. Both empty → `0`.
- **aiSummary token overlap** — if both entries have `aiSummary`, tokenize (lowercase, split on non-word, drop stopwords), Jaccard on token sets. Either side missing classification → `0`.
- **Byte-size ratio of first `.tsx`** — `min(size_a, size_b) / max(size_a, size_b)` on the primary component file. Below `0.7` → treat as independent forks (zero out the whole pair).

**Scoring formula:**

```
score = 0.35 * slug_sim
      + 0.25 * author_match
      + 0.20 * dep_jaccard
      + 0.15 * summary_overlap
      + 0.05 * byte_ratio
```

**Threshold: `T = 0.75`.** Pairs at or above `T` are flagged as likely duplicates and enter a cluster.

**Byte-ratio short-circuit:** if `byte_ratio < 0.7`, skip the pair entirely (different implementations even if names match). This prevents slug collisions (e.g. two unrelated `card.tsx`) from being flagged.

## 2. Clustering

Pure pairwise is O(N²) = 25M comparisons at N=5000 — too slow.

**Bucketed approach:**

1. Bucket every component by `first_3_chars(normalized_slug)`. Motion-primitives `carousel` and 21st-dev `ibelick-carousel` both normalize to `carousel` → same bucket `car`.
2. Compute pairwise scores only within each bucket.
3. Merge overlapping buckets via union-find when a match is found (handles slugs that sit on bucket boundaries).
4. Target avg bucket size `<10`. At N=5,000 with good distribution → ~50,000 pairwise comparisons → <5s.

Clusters are equivalence classes: every member is a duplicate of every other member (transitive by construction).

## 3. Canonical precedence — first match wins

Within a cluster, pick the canonical entry by walking these rules in order; first rule that differentiates wins:

1. **Authoritative source** — `motion-primitives` > `kokonutui` > `reactbits` > `originui` > `cult-ui` > `21st-dev`. Authoritative = original publisher, not aggregator.
2. **`importMode === "curated"` beats `"bulk"`** — hand-picked beats scraped.
3. **`renderable !== false` beats non-renderable** — working preview wins.
4. **Higher `effective_elo`** — only applies when `votes >= 10` on both sides (otherwise Elo is noise).
5. **Earlier `_provenance.fetchedAt`** — first-imported wins the tie.
6. **Alphabetical `{source}/{slug}`** — final deterministic tiebreaker.

All non-canonical entries in the cluster become **aliases**.

## 4. Alias handling — keep, don't delete

Nothing gets deleted. The manifest grows two new fields.

**On alias entries (`ManifestEntry` + `ComponentEntry`):**

```ts
canonicalOf?: { source: string; slug: string }
duplicateSignalScore?: number  // the score that flagged this alias
```

**On canonical entries:**

```ts
aliases?: { source: string; slug: string }[]
```

Aliases are hidden from default listings but remain browsable via `?showAliases=1`. When revealed, alias cards show a "duplicate of {canonical.displayName}" pill (small, gray, top-right) with a link that swaps the grid to the canonical.

This preserves provenance forever (you can always see that 21st.dev re-hosted motion-primitives/carousel) and keeps per-entry classifications/ratings intact.

## 5. Facet count semantics

Decision: **counts include aliases; listings exclude aliases.** Document the trade.

- Sidebar facet `21st-dev: 2,190` reflects what physically exists in `library/21st-dev/`. Accurate to reality.
- Grid listing under that facet shows only non-alias 21st-dev components. Clean default view.
- The gap (`count - visible`) is the alias count. Sidebar renders it as `21st-dev: 2,190 (47 aliases)` so the delta is never hidden.

Alternative rejected: "counts exclude aliases" — more consistent visually but breaks the mental model that facets reflect the physical library. Makes reconciliation harder when Shaan is comparing manifest vs disk.

## 6. Manual override

Automated dedup is never 100%. Escape hatch lives in each component's `registry-item.json`:

```json
"_provenance": {
  "notDuplicateOf": ["motion-primitives/carousel", "kokonutui/carousel"]
}
```

The dedup script honors this list — never flags a pair where either side lists the other in `notDuplicateOf`.

**Review workflow:**

1. Build emits `.claude/dedup-report.json` with every cluster, member list, scores, and which canonical was picked.
2. Shaan reviews the report (CLI viewer or open JSON in editor).
3. False positives → add `notDuplicateOf` to the relevant component.
4. Next build picks up the override automatically.

## 7. Edge cases

- **Same-author variants (`text-roll`, `text-morph`, `text-scramble` all by Emil)** — different slugs, slug_sim below threshold, cluster together only if byte_ratio is suspiciously high. Precedence by `addedAt` if they do cluster. In practice they stay distinct.
- **Independent forks across authoritative sources** — two authors happen to build a similar `dock` component. Slug matches, but byte_ratio `<0.8` because implementations differ → score short-circuited to 0. Not flagged.
- **Slug collision, unrelated components** — e.g. `card.tsx` exists in 50 sources. dep_jaccard `<0.2` → final score falls well below `T = 0.75`. Not flagged.
- **Aggregator has modified variant** — 21st.dev user took motion-primitives/carousel and styled it differently. byte_ratio `<0.7` → treated as distinct component, not an alias. Correct behavior: they diverged.

## 8. Performance

At 5,000 components with avg bucket size 10: `O(N × avg_bucket_size) ≈ 50,000` pairwise comparisons.

Per-comparison cost: 5 string ops (normalize + Levenshtein) + 2 set diffs (deps, summary tokens) + 1 filesystem stat (byte size) ≈ 1ms.

Total: **<5s on dev hardware**. Acceptable as a build-time step.

**Caching:**
- Cache `aiSummary` tokenization in the manifest (`_cache.summaryTokens: string[]`) to avoid re-tokenizing on every build.
- Cache first-`.tsx` byte sizes in manifest entries (`_cache.primaryFileSize: number`).
- Both populated during `build-manifest.mjs`, invalidated only when the underlying file changes (mtime check).

## 9. Implementation plan

**Files:**

- **CREATE** `scripts/dedup-components.mjs` — standalone. Reads `library/manifest.json`, runs detection + clustering, picks canonicals, emits `.claude/dedup-report.json`. Does NOT mutate the manifest by itself.
- **MODIFY** `scripts/build-manifest.mjs` — add `--with-dedup` flag. When set, invokes the dedup script post-build and writes `canonicalOf` / `aliases` / `duplicateSignalScore` fields into the final manifest. Without the flag, manifest builds unchanged.
- **MODIFY** `viewer/lib/types.ts` — add `canonicalOf`, `aliases`, `duplicateSignalScore` to both `ManifestEntry` and `ComponentEntry`.
- **MODIFY** `viewer/lib/registry.ts` — extend `FilterState` with `showAliases?: boolean`. In `getFilteredComponents`, filter out entries where `canonicalOf` is set unless `showAliases === true`. Facet counts are computed against the unfiltered set.
- **MODIFY** `viewer/lib/filters.ts` — `parseFilters` reads `?showAliases=1` from URL, maps to `FilterState.showAliases`.
- **MODIFY** `viewer/components/Card.tsx` — when `component.canonicalOf` is set AND `showAliases` is on, render a small gray pill `"duplicate of {canonical.displayName}"` in the top-right, linking to the canonical's detail page.

**LOC estimate:** ~500 across all files. One Haiku day, or half a day with tight scoping.

## 10. Acceptance criteria

- Running `node scripts/dedup-components.mjs` against the current 2,223-component manifest emits `.claude/dedup-report.json` with **≥10 clusters**, top cluster similarity `>0.85`. Expected top hit: `motion-primitives/carousel` vs `21st-dev/ibelick-carousel`.
- Default viewer at `/` shows **zero alias components** in the grid. Total visible count equals `manifest.total - alias_count`.
- `/?showAliases=1` reveals alias components, each bearing a "duplicate of X" pill that links to the canonical.
- Sidebar facet counts match `(visible_in_grid + alias_count)` for every source. Alias count shown as `(N aliases)` suffix.
- Adding `"_provenance": { "notDuplicateOf": ["21st-dev/ibelick-carousel"] }` to `library/motion-primitives/carousel/registry-item.json` and rebuilding removes that pair from `dedup-report.json` clusters.

## 11. Out of scope

- **Thumbnail pixel-diff** — would catch visually-identical components with different code. Requires CLIP embeddings or perceptual hash. Deferred; not worth complexity until Phase 7b classification lands.
- **Cross-framework dedup** — React-only. Vue/Svelte ports of the same component are treated as distinct.
- **Auto-merging classifications** — each entry keeps its own `classification.json`. Aliases can have distinct classifications (e.g. 21st.dev's version might have been classified differently by the AI pass). Canonical's classification is the one surfaced in default listings; alias classifications are preserved but hidden by default.

---

## Summary

Dedup is a deterministic build-time pass producing a report + optional manifest annotations. No data loss, no deletion, full audit trail via `.claude/dedup-report.json`. Default view gets cleaner automatically; power users see everything via `?showAliases=1`. Manual overrides via `_provenance.notDuplicateOf`. ~500 LOC, one worker-day of Haiku time.
