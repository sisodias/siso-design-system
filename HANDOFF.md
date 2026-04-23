# Handoff — SISO Design System

**Date:** 2026-04-23
**Branch:** main (assumed; confirm with `git branch --show-current`)
**Last known commit:** manifest generated at `2026-04-22T04:24:08.464Z` with 2,223 total components
**Dev server:** `cd viewer && npm run dev -- -p 3005` → `http://localhost:3005`
**GitHub:** [Lordsisodia/siso-design-system](https://github.com/Lordsisodia/siso-design-system)

---

## 1. Status

| Field | Value |
|---|---|
| Total components in manifest | **2,223** (as of last manifest build) |
| Renderable (`preview.renderable !== false`) | Majority of 21st-dev bulk corpus; exact count via `node scripts/build-manifest.mjs && cat library/manifest.json \| python3 -c "import json,sys; m=json.load(sys.stdin); print(sum(1 for c in m['components'] if not (c.get('preview') or {}).get('renderable') == False))"` |
| Non-renderable (`preview.renderable: false`) | Minority flagged by `backfill-renderable.mjs`; exact count via manifest |
| Classified | Depends on last `classify-components.mjs` run; check `library/21st-dev/*/classification.json` count |
| Ratings DB | `ratings.db` at repo root (gitignored); check swipes/comparisons with `sqlite3 ratings.db "SELECT COUNT(*) FROM swipes; SELECT COUNT(*) FROM comparisons;"` |
| Build status | `cd viewer && npm run build` — must pass |
| Deployment | Local only; runs on `localhost:3005` |

To get a fresh component count:
```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system
node scripts/build-manifest.mjs
cat library/manifest.json | python3 -c "import json,sys; m=json.load(sys.stdin); print('total:', m['total'])"
```

---

## 2. What this repo is

A self-contained React component bank plus a local Next.js viewer, rating system, and AI classification pipeline. It stores curated and bulk-imported UI components in `library/{source}/{slug}/` with shadcn `registry-item.json` metadata, renders live previews in sandboxed iframes, and exposes a filterable JSON API. The long-term purpose is to give SISO agents and Shaan a single browsable, rankable, exportable corpus of every UI pattern worth reusing.

---

## 3. Current state

### Component counts by source namespace

| Source | Count (approx) | Import mode |
|---|---|---|
| `21st-dev` | ~2,200 | `bulk` (scraped from sitemap) |
| Hand-curated 21st-dev | ~21 (the original pre-bulk batch) | `curated` |
| `lumelle` | 15 | raw harvest, not in library/ yet |
| `restaurant-app-solo` | 9 | raw harvest, not in library/ yet |
| `siso-primitives` | 0 | not started |

Lumelle and restaurant-app-solo components live in `_raw/` at the repo root — they predate the `library/` migration and have not been ported into the viewer. They are browsable as code reference only.

### Classifications

`classification.json` files are generated per-component by `scripts/classify-components.mjs`. Check how many exist:
```bash
find /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system/library -name "classification.json" | wc -l
```

Fields: `category`, `subcategory`, `visual_style`, `interactions`, `best_for_industries`, `platform_fit`, `complexity`, `use_cases`, `similar_to`, `ai_summary`, `_classifiedAt`, `_classifierModel`.

### Ratings state

```bash
sqlite3 /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system/ratings.db \
  "SELECT COUNT(*) FROM swipes; SELECT COUNT(*) FROM comparisons;"
```

If `ratings.db` does not exist, it is created on first request to `/rate/*`. The DB is gitignored (local state only).

### Build + deployment

- `cd viewer && npm run build` — standard Next.js build
- No CI, no deployment target. Runs locally on port 3005.
- `npm run dev` script is hardcoded to `-p 3005` in `viewer/package.json`.

---

## 4. The viewer (localhost:3005)

| Route | Purpose |
|---|---|
| `/` | Home grid with sidebar facets (source, tag, platform, importMode, AI category/style/industry) |
| `/component/[source]/[name]` | Detail page: live preview iframe + shiki-highlighted code + README markdown |
| `/preview/[source]/[slug]` | Bare iframe route — ONLY the component demo on a blank page; used as iframe src by cards |
| `/rate` | Rating landing page — pick Pairwise (Elo) or Swipe mode |
| `/rate/swipe` | Full-screen Tinder-style swipe UI: left=skip, right=keep, up=love+promote |
| `/rate/leaderboard` | Top 50 components by Elo score, grouped by source |
| `/export` | Cart → agent prompt builder (3 prompt styles: agent/list/markdown) |
| `/api/components` | Filterable JSON list — accepts `?source=`, `?tag=`, `?q=`, `?page=`, `?pageSize=`, `?mode=`, `?category=`, `?style=`, `?industry=`, `?complexity=` |
| `/api/components/[source]/[slug]` | Single component JSON |
| `/api/components/meta` | Manifest metadata (totals, generatedAt) |
| `/api/facets` | Facet counts for all filter dimensions |
| `/api/rate/compare` | POST — record a pairwise Elo comparison |
| `/api/rate/swipe` | POST — record a swipe action (skip/keep/love) |
| `/api/rate/stats` | GET — total comparisons, swipes, rated count, promoted count |

Default landing view shows **curated-only** components (`importMode !== 'bulk'`). Switch to "All" or "Generic only" via the sidebar toggle or `?mode=all` / `?mode=generic`.

---

## 5. Key architecture decisions

### Manifest-driven viewer

`viewer/lib/registry.ts` reads a single `library/manifest.json` file at module init time and memoises it in process scope. There are zero filesystem walks at request time. Before this change, `registry.ts` did a sync `readdir` + per-folder `readFile` + `JSON.parse` on every page hit — at 5,000 folders that was ~20k fs ops per request causing 3–8 second cold renders. The manifest is generated by `node scripts/build-manifest.mjs` and committed. It regenerates automatically via the root `package.json` `prebuild` hook and at the end of every `bulk-import.mjs` run.

### Virtualization above 60 components

`ComponentGrid.tsx` uses `@tanstack/react-virtual` for the main grid when `components.length > 60`. Below that threshold it falls back to a plain grid. This was required because browsers crash between 500–1000 simultaneous iframes. With virtualization, only ~30 cards are in the DOM at any time regardless of corpus size. The Recently Added rail (top 6) lives outside the virtualizer as a plain grid and is unaffected.

### Lazy PNG thumbnails + iframe-on-hover

`Card.tsx` renders a static `<img>` by default (the `preview.png` thumbnail). An iframe mounts only on `onMouseEnter` (150ms debounce) and unmounts on `onMouseLeave` (500ms delay). When `component.hasThumbnail === false`, the card falls back to iframe-always. This was the critical fix for browser tab stability at 500+ components — loading 2,000+ iframes simultaneously crashes the tab. Thumbnails are generated by `scripts/generate-thumbnails.mjs` using Playwright (requires dev server running at :3005).

### URL-param-driven filters

Source, tag, platform, search, importMode, and all AI classification filters are read from URL search params in the server component (`app/page.tsx`). The server calls `getFilteredComponents(parseFilters(searchParams))` and passes only the filtered slice to `ComponentGrid`. This means filter state is bookmarkable, shareable, and not lost on refresh. It also means server-rendered HTML already contains the filtered result — no client-side filter storm on initial load.

### Git LFS for thumbnails

`.gitattributes` includes `library/**/*.png filter=lfs diff=lfs merge=lfs -text`. However, `git lfs` is not installed on the local dev machine, so thumbnails currently commit as regular blobs. This works and does not break anything, but git operations will slow significantly at 5,000+ PNG files. Install `git lfs` before the next major thumbnail generation run: `brew install git-lfs && git lfs install`.

### `renderable: false` + demo.tsx stub pattern

Webpack resolves `next/dynamic` template literal imports at build time by scanning all files under `library/21st-dev/` transitively. A component with broken imports (unresolved `@/demos/*`, missing peer packages, syntax errors) causes the entire build to fail even if that component is never actually rendered. The fix is to mark the component `preview.renderable = false` in `registry-item.json` AND create a minimal stub `demo.tsx` that exports a placeholder `<div>`. This lets webpack resolve the import without executing the broken code. The `backfill-renderable.mjs` script automates detection and stubbing for common failure patterns.

### `_provenance.importMode = "bulk" | "curated"`

Every `registry-item.json` written by `bulk-import.mjs` gets `_provenance.importMode = "bulk"`. Hand-added or promoted components have `"curated"` (or the field is absent, which the viewer treats as curated). The default grid view hides bulk components so Shaan sees ~21 curated components on first load, not 2,200 cards. The full bulk corpus is opt-in via the sidebar toggle or `?mode=all`. Promotion from bulk to curated happens automatically when a component's Elo exceeds 1400 or receives 3+ "love" swipes — the ratings system writes the updated `importMode` back to `registry-item.json`.

### AI classification via MiniMax

`scripts/classify-components.mjs` sends component source + README to an LLM and writes `classification.json` per component. The script targets Claude Haiku via the Anthropic Messages API (`claude-haiku-4-5-20251001`) with `ANTHROPIC_API_KEY`. The BULK_IMPORT_PLAN originally specified MiniMax as the free-tier option. The actual implementation uses Anthropic Haiku directly — confirm the active model and key in `.env` before running at scale (~$10 total for 5,300 components at Haiku rates). MiniMax returns `content: [{thinking}, {text}]` (not just `{text}`) — the classifier handles this, but any other code that calls a MiniMax-compatible endpoint must strip the thinking block before JSON parsing.

### Elo with K=32 + auto-promotion at 1400

The rating system uses standard Elo with K=32. Starting Elo is 1200. Components that win against higher-rated opponents gain more points per win. Auto-promotion triggers at Elo > 1400 (sets `importMode: "curated"` in `registry-item.json`) or on any "love" swipe. Auto-hiding triggers at Elo < 1000 (sets `autoHidden: true` in `_provenance`). SQLite is used instead of Convex or a remote DB because this is a local tool with no auth requirement, and synchronous `better-sqlite3` is fast enough for a single-user session.

---

## 6. How to add a component

### One-off from 21st.dev

```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system
node scripts/add-21st.mjs {user}/{slug}
# example: node scripts/add-21st.mjs aliimam/gallery
```

Writes to `library/21st-dev/{user}-{slug}/`. Refresh the viewer to see the new card in the Recently Added rail.

### Bulk from any shadcn registry

```bash
node scripts/bulk-import.mjs --source=<name> --limit=N
# examples:
node scripts/bulk-import.mjs --source=21st-dev --limit=100
node scripts/bulk-import.mjs --source=originui
node scripts/bulk-import.mjs --source=magicui --limit=10 --dry-run
```

Supported source names map to known registries inside the script. Each run regenerates `library/manifest.json` on completion.

### Hand-written SISO primitive

Copy `docs/examples/example-component/` into `library/siso-primitives/{slug}/`. Rename files to match the slug. Update `registry-item.json` fields. Write `demo.tsx` that renders standalone with no external deps. Refresh viewer.

---

## 7. Recovery runbook — when build breaks after a bulk pull

```bash
# 1. Capture build errors
cd /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system/viewer
npm run build 2>&1 | tee /tmp/ds-build.log

# 2. Find missing npm packages
grep "Can't resolve" /tmp/ds-build.log | grep -v node_modules
# Install any real packages found:
npm install <missing-package> --legacy-peer-deps

# 3. Find bad imports in demo files (internal @/demos/*, relative ./X where X doesn't exist, etc.)
grep -E "@/demos|@/components/ui/(?!button|card|badge)" /tmp/ds-build.log
# Run the recovery script to mark those components non-renderable:
cd ..
node scripts/backfill-renderable.mjs

# 4. Rebuild manifest to pick up any new renderable=false flags
node scripts/build-manifest.mjs

# 5. Re-run build
cd viewer && npm run build

# 6. Repeat steps 2-5 until build exits 0.
```

The `--legacy-peer-deps` flag is required for almost all installs because the viewer's dependency tree has shadcn peer conflicts. If `npm install` fails without it, always add it.

---

## 8. What the scripts do

- `scripts/add-21st.mjs` — Fetches a single component from `https://21st.dev/r/{user}/{slug}`. Rewrites imports (`@/components/ui/X` → `./X`, `@/lib/utils` → `../_utils/cn`, `motion()` → `motion.create()`). Auto-generates `demo.tsx` if 21st.dev doesn't ship one. Writes `registry-item.json` with `_provenance.fetchedAt`. Legacy single-URL tool; superseded by bulk-import for batch work but kept for convenience.

- `scripts/bulk-import.mjs` — Generic multi-registry scraper. Accepts `--source=<name>`, `--limit=N`, `--concurrency=N` (default 8), `--dry-run`. Consumes sitemap or `registry.json` list, fetches individual items, applies import rewrites, writes `library/{source}/{slug}/`, sets `_provenance.importMode = "bulk"`. Handles 2 retries on 5xx, permanent skip on 404, detects "200 OK + empty JSON" failure mode. Logs failures to `.claude/scrape-failures-{source}-{timestamp}.json`. Regenerates manifest at end of run.

- `scripts/build-manifest.mjs` — Walks `library/{source}/{slug}/registry-item.json`, filters to components that have a `demo.tsx` (primitives-only folders excluded), builds facets (sources, tags, platforms, categories, visualStyles, industries, complexity), emits `library/manifest.json`. Also reads `classification.json` siblings to merge AI classification fields into manifest entries. Idempotent. Run after any `library/` change.

- `scripts/backfill-renderable.mjs` — Recovery pass. Scans every `demo.tsx` and component `.tsx` for known bad import patterns (`@/demos/*`, unresolved `@/` paths, missing relative siblings, `../../*.css` reaching outside the folder). For each hit, sets `preview.renderable = false` and `preview.reason` in `registry-item.json` and creates a minimal stub `demo.tsx` so webpack can resolve the import without crashing. Idempotent. Run after any bulk pull that breaks the build.

- `scripts/classify-components.mjs` — AI classification pipeline. For each component lacking a `classification.json`, reads `{slug}.tsx` + `demo.tsx` + `README.md`, sends to Claude Haiku, writes `classification.json` with category, visual_style, complexity, use_cases, ai_summary, best_for_industries. Supports `--limit=N`, `--dry-run`, `--concurrency=N` (default 10). Restartable (skips already-classified components). Requires `ANTHROPIC_API_KEY` env var.

- `scripts/generate-thumbnails.mjs` — Playwright-based screenshot tool. Iterates `library/manifest.json`, navigates to `http://localhost:3005/preview/{source}/{slug}`, saves 1200×900 PNG to `library/{source}/{slug}/preview.png`, copies to `viewer/public/thumbnails/{source}__{slug}.png` for static serving. Supports `--concurrency=N` (default 4), `--force` to overwrite existing. Requires dev server running at :3005. After all screenshots, re-invokes `build-manifest.mjs` to update `hasThumbnail` flags in the manifest.

**Planned scripts (not yet implemented — no `_DESIGN.md` files exist at time of writing):**

- `scripts/query.mjs` — `/api/query` scoring endpoint (RANKING_DESIGN: planned, not started)
- `scripts/dedup.mjs` — cross-source canonicalization (DEDUP_DESIGN: planned, not started)

---

## 9. API summary

### `GET /api/components`

Returns a filtered, paginated list of components from the manifest.

Query params: `source`, `tag` (repeatable), `q` (search), `page`, `pageSize` (default 120), `mode` (`curated`/`all`/`generic`), `category` (repeatable), `style` (repeatable), `industry` (repeatable), `complexity` (repeatable).

```bash
curl "http://localhost:3005/api/components?source=21st-dev&mode=all&pageSize=5"
# → { items: [...ComponentEntry], total: N, facets: {...} }
```

### `GET /api/components/[source]/[slug]`

Returns a single component entry.

```bash
curl "http://localhost:3005/api/components/21st-dev/aliimam-gallery"
# → ComponentEntry | { error: "not found" }
```

### `GET /api/components/meta`

Returns manifest metadata (totals, generatedAt, schemaVersion).

```bash
curl "http://localhost:3005/api/components/meta"
# → { total: 2223, generatedAt: "...", schemaVersion: 1 }
```

### `GET /api/facets`

Returns facet counts for all filter dimensions.

```bash
curl "http://localhost:3005/api/facets"
# → { sources: [{value, count}], tags: [...], platforms: [...], categories: [...], visualStyles: [...], industries: [...], complexity: [...] }
```

### `POST /api/rate/compare`

Records a pairwise Elo comparison.

```bash
curl -X POST "http://localhost:3005/api/rate/compare" \
  -H "Content-Type: application/json" \
  -d '{"a":{"source":"21st-dev","slug":"aliimam-gallery"},"b":{"source":"21st-dev","slug":"sean-button"},"winner":{"source":"21st-dev","slug":"aliimam-gallery"}}'
# → { aElo: 1215, bElo: 1187 }
```

### `POST /api/rate/swipe`

Records a swipe action.

```bash
curl -X POST "http://localhost:3005/api/rate/swipe" \
  -H "Content-Type: application/json" \
  -d '{"source":"21st-dev","slug":"glass-card","action":"love"}'
# → { ok: true, newElo: 1220, promoted: true }
```

### `GET /api/rate/stats`

Returns rating system stats.

```bash
curl "http://localhost:3005/api/rate/stats"
# → { totalComparisons: N, totalSwipes: N, totalRated: N, promotedCount: N }
```

---

## 10. Working state right now

### Shipped this project (in order)

- **Phase 0 — Recon** (4 parallel Haiku agents): confirmed 21st.dev has no rate limit; identified 4,501 valid 2-segment slugs; found 176 shadcn-compatible registries; determined viewer ceiling at ~500 components. Output: BULK_IMPORT_PLAN.md.
- **Phase 1.W1 — Build-time manifest**: `scripts/build-manifest.mjs` created; `viewer/lib/registry.ts` rewritten to read manifest synchronously; `viewer/lib/types.ts` extended with `ManifestEntry`, `Manifest`, `ManifestFacet`.
- **Phase 1.W2 — Virtualized grid**: `ComponentGrid.tsx` rewritten with `@tanstack/react-virtual`; plain grid preserved below 60 components; `@tanstack/react-virtual` added to `viewer/package.json`.
- **Phase 1.W3 — Lazy thumbnails**: `Card.tsx` updated to show static PNG by default + iframe-on-hover; `scripts/generate-thumbnails.mjs` created; `.gitattributes` updated for LFS.
- **Phase 1.W4 — URL-param filters**: `viewer/lib/filters.ts` created; `viewer/app/page.tsx` rewritten for Next 15 async `searchParams`; `viewer/components/Sidebar.tsx` updated to Link-based navigation.
- **Phase 2 — Generic scraper**: `scripts/bulk-import.mjs` created with concurrency, retry, idempotency, and provenance tagging.
- **Phase 3 — Stress test**: passed (100-component test confirmed viewer handles load).
- **Phase 4 — Full bulk pull**: 21st-dev corpus scraped to ~2,200 components in `library/21st-dev/`; manifest rebuilt at 2,223 total.
- **Phase 6 — Provenance tagging**: `_provenance.importMode = "bulk"` written by bulk-import; `[generic]` pill on Card; Sidebar importMode toggle; default curated-only view.
- **Phase 7a — Rating/swiper UI**: `/rate`, `/rate/swipe`, `/rate/leaderboard` routes built; `viewer/lib/ratings.ts` with SQLite + Elo; `better-sqlite3` dep added; `ratings.db` at repo root.
- **Phase 7b — AI classification pipeline**: `scripts/classify-components.mjs` built with Haiku API calls, `classification.json` output, manifest integration for classification facets.

### In flight

Check for active processes:
```bash
ps aux | grep node | grep -v grep
```

Any `bulk-import`, `classify-components`, or `generate-thumbnails` process would appear here. At the time this document was written, no background processes were confirmed running.

### Not yet built

The following features are planned but have no implementation and no `_DESIGN.md` files in `.claude/plans/` yet:

| Feature | Status |
|---|---|
| RANKING_DESIGN — `/api/query` natural-language scoring endpoint | Planned, not started |
| DEDUP_DESIGN — cross-source canonicalization (same component from 21st-dev and originui) | Planned, not started |
| COMPOSE_DESIGN — `/compose` route: build a page from selected components → export | Planned, not started |
| CURATION_SETS_DESIGN — named sets (e.g. "dark-saas-kit") replacing binary importMode | Planned, not started |
| originui/coss.com adapter (~500 more components) | Not in any plan |
| GitHub-repo sources: motion-primitives, reactbits, kokonutui (~250 components) | Phase 5 in BULK_IMPORT_PLAN.md, not executed |

---

## 11. Known gotchas

- **`--legacy-peer-deps` required.** The viewer has deep shadcn + Radix peer conflicts. Any `npm install` without this flag will fail. Always use `npm install <pkg> --legacy-peer-deps`.

- **`@base-ui-components/react/<subpath>` broken subpaths.** Some 21st-dev components import from `@base-ui/react` (or the older `@base-ui-components/react`) at subpaths that aren't actually exported. These are detected by `backfill-renderable.mjs` and marked non-renderable.

- **21st.dev sitemap has 2-segment and 3-segment slugs.** Only 2-segment slugs (`/r/{user}/{slug}`) are fetchable via the JSON API. 3-segment slugs (e.g. `/community/components/user/slug/variant`) resolve to a specific variant and the API returns a slightly different schema. `bulk-import.mjs` filters to 2-segment only.

- **MiniMax `content` array shape.** MiniMax responses return `content: [{type:"thinking",...}, {type:"text",...}]` rather than a plain string. The classifier handles this by finding the `text` block. Any other code that consumes MiniMax or a MiniMax-compatible endpoint must do the same — do not assume `response.content[0].text` is the answer text without checking the type.

- **Git LFS not installed locally.** Thumbnails commit as regular blobs. This works fine today but will slow `git clone` and `git log` significantly once there are 5,000+ PNG files. Run `brew install git-lfs && git lfs install && git lfs migrate import --include="library/**/*.png"` before the next major thumbnail push.

- **Dev server must be running at :3005 for thumbnail generation.** `scripts/generate-thumbnails.mjs` navigates to `http://localhost:3005/preview/{source}/{slug}`. If the server is not running it prints a clear error, but the failure mode (all thumbnails missing) is silent in the manifest until you check `hasThumbnail` counts.

- **originui.com redirects to coss.com/ui.** The domain changed. 21st.dev aggregates some coss.com components under different slugs. If a bulk-import run targeting originui returns unexpected redirect failures, update the base URL in the source config inside `bulk-import.mjs`.

- **Stale manifest.** If components are added manually (dropping a folder into `library/`) without running `node scripts/build-manifest.mjs`, the viewer shows old data. The manifest has a `generatedAt` timestamp; `registry.ts` logs a warning when it is older than 24 hours. Always regenerate after manual additions.

- **`typescript.ignoreBuildErrors: true` in `viewer/next.config.ts`.** Type errors in library components are silently ignored during build. This was set because bulk-imported components contain ambient TypeScript that the viewer's tsconfig can't always resolve. Do not remove this flag without fixing all type errors in the library corpus first.

- **`better-sqlite3` is a native module.** It compiles against Node.js headers on `npm install`. If Node version changes, run `npm rebuild better-sqlite3` in `viewer/`. On M-series Macs this is usually seamless.

---

## 12. Next session priorities

1. **RANKING_DESIGN** — implement `/api/query` with scoring that combines Elo, classification match, and recency. Biggest UX leverage for agents querying the bank. No design file exists yet — write one first in `.claude/plans/RANKING_DESIGN.md` then execute.

2. **DEDUP_DESIGN** — cross-source canonicalization. Right now the same component may exist as `21st-dev/user-slug` and `originui/slug`. When originui is pulled (Phase 5), duplicates will appear. Design a canonical ID system and a dedup script before pulling more sources.

3. **Phase 5 — GitHub-repo sources** — motion-primitives, reactbits, kokonutui (~250 components). Requires the GitHub fallback adapter in `bulk-import.mjs` (sub-task specified in BULK_IMPORT_PLAN.md Phase 5, not yet implemented).

4. **COMPOSE_DESIGN** — `/compose` route: select components from the grid, arrange into a page skeleton, export as a prompt or a Next.js file. Ships the core "agent building tool" use case that motivated this repo.

5. **CURATION_SETS_DESIGN** — replace binary `importMode` with flexible named sets (e.g. `"dark-saas-starter"`, `"mobile-ecommerce-kit"`). Enables Shaan to pre-package component collections for specific client types.

6. **Run classification at scale** — `node scripts/classify-components.mjs --concurrency=20` on the full 2,200-component corpus. Estimated ~30 min, ~$10 at Haiku rates. Unlocks the category/style/industry facet filters in the sidebar (currently sparse).

7. **originui/coss.com adapter** — ~500 more components. Update the base URL and schema adapter in `bulk-import.mjs`, then pull.

---

## 13. Quick-start for a fresh agent

1. `cd /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system`
2. Read this file end-to-end, then `ARCHITECTURE.md`, then `CONTRIBUTING.md`.
3. `cd viewer && npm install --legacy-peer-deps && npm run dev -- -p 3005` — open `http://localhost:3005` and confirm the grid loads with curated components visible.
4. Test the scraper (dry run, no writes): `cd .. && node scripts/bulk-import.mjs --source=21st-dev --limit=3 --dry-run`
5. Pick a next-priority item from section 12. If it needs a `_DESIGN.md` plan file, write that first in `.claude/plans/` before dispatching workers.
