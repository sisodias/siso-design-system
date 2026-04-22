# Bulk Component Import — Multi-Registry Plan

**Status:** planning · **Created:** 2026-04-22 · **Owner:** Shaan (orchestrator: Sonnet)
**Goal:** Grow the component bank from 20 renderable → ~5,300 renderable by mirroring the shadcn registry ecosystem.

---

## Research summary (what the 4 agents found)

| Area | Finding | Source |
|---|---|---|
| 21st.dev rate limit | **None.** Concurrency 16 clean, 680ms median, no 429s | Agent A |
| 21st.dev valid corpus | **4,501** components (2-segment slugs only; 65% → 13% failure after filter) | Agent A |
| Broader ecosystem | **176 shadcn-compatible registries** in official index (`ui.shadcn.com/r/registries.json`) | Agent D |
| Top registries | originui (~500), hextaui (139), cult-ui (76), magicui (74), shadcn core (~50) | Agent B |
| Skip | aceternity (paywalled), tremor (not shadcn schema), v0 (consumer), kokonutui/reactbits/motion-primitives (bot-shielded → pull via GitHub) | Agent B |
| Storage | ~22KB/component × 5,300 = ~120MB. Trivial. | Agent C |
| **Viewer ceiling** | **~500 components before it crashes** | Agent C |

## Hard blocker: viewer won't survive bulk import

Agent C identified three architectural bottlenecks in the current viewer:

1. **`viewer/lib/registry.ts:32-88`** — sync-style `fs.readdir` + per-folder `readFile` + `JSON.parse` on every request. No cache. At 5k folders that's ~20k fs ops per page hit → 3-8s cold renders.
2. **`viewer/components/ComponentGrid.tsx:122`** + **`Card.tsx:21`** — one iframe per card, no virtualization. Browser tab crashes between 500-1000 iframes.
3. No server-side faceting — client receives the full list regardless of filter.

**Order of operations is fixed:** viewer refactor FIRST, bulk import SECOND.

---

## Execution plan — 4 phases

### Phase 1 — Viewer Refactor (blocking prerequisite)

**Goal:** lift the viewer ceiling from ~500 to ~10,000 components.

**Workstreams (parallelizable):**

| P1.W1 | Build-time manifest |
|---|---|
| Model | **Opus** (planner) → **Haiku** workers |
| Files | `viewer/lib/registry.ts`, new `scripts/build-manifest.mjs`, new `library/manifest.json` (gitignored or committed per user pref) |
| Output | One `manifest.json` with all parsed registry-item data, generated at import-time + build-time. `getAllComponents()` becomes `JSON.parse(readFileSync(manifest))`. |
| Risk | Stale manifest — solve with import-script hook that regenerates on every `bulk-import` run. |

| P1.W2 | Virtualized grid |
|---|---|
| Model | **Sonnet** worker (frontend-tricky enough to warrant it) |
| Files | `viewer/components/ComponentGrid.tsx`, add `@tanstack/react-virtual` dep |
| Output | Only renders cards in viewport. ~30 visible at a time instead of 5,000. |
| Risk | Breaks current layout (3-col responsive grid with "Recently Added" rail). Preserve both. |

| P1.W3 | Lazy preview — kill iframe-per-card |
|---|---|
| Model | **Sonnet** worker |
| Files | `viewer/components/Card.tsx`, new `scripts/generate-thumbnails.mjs` (Playwright) |
| Output | Card shows static `preview.png` by default. Iframe loads only on hover or in detail view. Thumbnails generated at import time. |
| Risk | Playwright in import path adds ~1-2s per component. Acceptable (async-dispatch at import time, not user-facing). |

| P1.W4 | Server-side facets + pagination |
|---|---|
| Model | **Haiku** worker (mechanical) |
| Files | `viewer/app/page.tsx`, `viewer/components/Sidebar.tsx` |
| Output | Source + tag filters become URL params. Server reads manifest with filter pre-applied. Client only receives filtered slice. |
| Risk | Low. |

**Parallelization:** W1 and W4 can start immediately. W2 and W3 depend on W1 (manifest schema).
**Total Phase 1 estimate:** 4 workers × ~1hr each, ~2hrs wall-clock with parallelism.

---

### Phase 2 — Generic Multi-Registry Scraper

**Goal:** one scraper that consumes ANY shadcn-compatible `/r/` registry.

**Single worker (Haiku or Sonnet — mechanical but must be robust):**

- **New file:** `scripts/bulk-import.mjs`
- **API:**
  ```js
  importRegistry({
    source: 'originui',
    listUrl: 'https://originui.com/r/registry.json',   // or sitemap
    itemUrlTemplate: 'https://originui.com/r/{slug}.json',
    concurrency: 8,
    filter: (url) => /^[^/]+\/[^/]+$/.test(url),        // 2-segment only (21st.dev)
    skip: (slug) => existsSync(libraryPath(source, slug)),
  })
  ```
- **Policies (from Agent A):**
  - Concurrency 8 default (safe, no rate limit observed)
  - 2 retries on 5xx transient, skip 404s permanently
  - Detect "200 OK + empty JSON" → skip (Agent A found this failure mode)
  - Global `registryDependencies` dedupe across the whole run
  - Writes to `library/{source}/{slug}/`, matching existing add-21st.mjs output shape
  - Logs failures to `.claude/scrape-failures-{source}-{timestamp}.json`
  - Regenerates `library/manifest.json` at end of run

- **GitHub fallback adapter** (sub-task): for Vercel-shielded registries (motion-primitives, reactbits, kokonutui), add a second codepath that reads raw files from `raw.githubusercontent.com/{owner}/{repo}/main/registry/{slug}.json`.

**Total Phase 2 estimate:** 1 worker × ~1-2hrs.

---

### Phase 3 — Dry-run + stress test

**Goal:** prove it works on small scale before firing the full pull.

- **Sanity run:** `bulk-import.mjs --source=magicui --limit=10` → 10 components land in `library/magicui/`
- **100-component stress test:** `bulk-import.mjs --source=21st-dev --limit=100`
  - Measure: actual per-component size vs. 22KB estimate
  - Measure: viewer cold-render time after the import
  - Verify: virtualized grid handles 120+ total components
- **Gate:** if stress test passes, proceed to Phase 4. If not, loop back to Phase 1 fixes.

**Single verifier agent (Haiku):** runs the stress test, writes PASS/FAIL report.

---

### Phase 4 — Full Bulk Pull

**Goal:** ~5,300 components live in the bank.

**Dispatch 5 Haiku workers in parallel** (each owns one source, zero file overlap):

| Worker | Source | URL pattern | ETA | Est. components |
|---|---|---|---|---|
| BP-1 | originui | `https://originui.com/r/{slug}.json` | ~5 min | ~500 |
| BP-2 | hextaui | `https://hextaui.com/r/{slug}.json` | ~3 min | ~139 |
| BP-3 | magicui | `https://magicui.design/r/{slug}.json` | ~2 min | ~74 |
| BP-4 | cult-ui | `https://www.cult-ui.com/r/{slug}.json` | ~2 min | ~76 |
| BP-5 | 21st-dev | sitemap + `/r/{user}/{slug}` | ~10 min | ~4,501 |

Each worker:
1. Pulls the source's list (sitemap or `registry.json`)
2. Runs `bulk-import.mjs --source=<name> --concurrency=8`
3. Regenerates its slice of the manifest
4. Returns `[STATUS: DONE | count | failures]`

After all 5 return → single Haiku merges manifests + commits.

**Total Phase 4 estimate:** ~10 min wall clock (parallel) + merge.

---

### Phase 5 (optional) — GitHub-repo sources

For Vercel-shielded registries only:
- motion-primitives (ibelick/motion-primitives)
- reactbits (DavidHDev/react-bits)
- kokonutui (kokonut-labs/kokonutui)

Single Haiku worker, uses the GitHub fallback adapter. Adds ~250 components.

---

### Phase 6 — "Generic" provenance tagging

**Goal:** distinguish bulk-imported components from hand-curated keepers everywhere in the system (UI, filters, agent queries).

**Why:** 5,300 components is way too many to treat as equals. Most are B-tier copy-paste from 21st.dev. A small fraction are genuine keepers. Shaan needs to see at a glance which is which — and so do AI agents reading the manifest.

**Implementation:**

| Field | Where | Value |
|---|---|---|
| `_provenance.importMode` | Every `registry-item.json` | `"bulk"` (scraped) \| `"curated"` (hand-added / promoted) |
| `_provenance.importedAt` | Set by `bulk-import.mjs` | ISO timestamp |
| `_provenance.importedFromList` | Set by `bulk-import.mjs` | e.g. `"21st-dev-sitemap"`, `"originui-registry-json"`, `"github/ibelick/motion-primitives"` |

**Viewer changes:**
- `Card.tsx` → shows a small `[generic]` pill on bulk-imported cards (gray, subtle, top-right corner)
- `Sidebar.tsx` → adds a toggle: "Curated only" / "All" / "Generic only"
- `ComponentGrid.tsx` → filter honors the toggle
- Default landing view: **"Curated only"** — so Shaan opens localhost:3005 and doesn't drown in 5,000 cards by default. Bulk corpus is opt-in.

**Promotion path:** once you rate a generic component as a keeper (via Phase 7 swiper), an agent rewrites its `importMode` from `"bulk"` to `"curated"`. Promotion is one-way (curated never becomes generic). That's how the keepers set grows over time.

**Worker:** 1 Haiku worker. Touches `scripts/bulk-import.mjs` (write the fields), `viewer/components/Card.tsx`, `viewer/components/Sidebar.tsx`, `viewer/components/ComponentGrid.tsx`, `viewer/lib/filters.ts`.

**Runs in parallel with Phase 2** — doesn't block the scraper, just requires the scraper to set the fields.

---

### Phase 7 — Rating & Classification System

**Goal:** (a) let Shaan triage 5,000+ components fast, (b) make every component machine-readable to agents building new UIs.

This is two sub-phases because the workloads are fundamentally different.

---

#### Phase 7a — Gamified swiper (Elo-based rating)

**UX:** new `/rate` route in the viewer. Two modes:

| Mode | How it works | Best for |
|---|---|---|
| **Pairwise (Elo)** | Shows component A vs. component B side-by-side → pick winner → both components' Elo scores update. Repeat. | Consistent cross-component ranking. Better signal than star ratings. |
| **Swipe (Tinder)** | Shows one component full-screen → swipe left (skip/bad) / right (keep/good) / up (love/promote-to-curated). | Fast triage. Good for the first pass through bulk-imported corpus. |

**Data model** — new SQLite DB at `design-system/ratings.db`:
```sql
CREATE TABLE components (source TEXT, slug TEXT, elo INTEGER DEFAULT 1200, votes INTEGER DEFAULT 0, rating TEXT, PRIMARY KEY (source, slug));
CREATE TABLE comparisons (id INTEGER PRIMARY KEY, a_source TEXT, a_slug TEXT, b_source TEXT, b_slug TEXT, winner TEXT, ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE swipes (id INTEGER PRIMARY KEY, source TEXT, slug TEXT, action TEXT, ts TIMESTAMP);  -- action: skip | keep | love
```

**Elo update:** standard Elo formula, K=32. Components that win against higher-rated opponents gain more points.

**Promotion rules (auto):**
- Elo > 1400 OR 3+ `love` swipes → auto-promote to `importMode: "curated"`
- Elo < 1000 → hide from default grid (still browsable via "show all")
- Everything in between stays `generic`

**Routes:**
- `/rate` — landing page, pick mode
- `/rate/pair` — shows A vs B
- `/rate/swipe` — full-screen swipe UI
- `/rate/leaderboard` — top 50 by Elo, grouped by source

**Build:** 1 Sonnet worker. Frontend-interactive, gesture handling, DB writes. Touches:
- `viewer/app/rate/` (new directory, 3 routes)
- `viewer/lib/ratings.ts` (new, SQLite wrapper)
- `viewer/package.json` (add `better-sqlite3`)
- `design-system/ratings.db` (new, gitignored — local state)

**Opus micro-planning:** worth one small Opus call to design the Elo + promotion-rule logic cleanly. Maybe 200 tokens of Opus, not a full planner invocation.

---

#### Phase 7b — AI-readable classification

**Goal:** every component gets a `classification.json` sibling file so agents can answer queries like "find me dark glass-morphism pricing cards" or "what's the best loading-state component for a mobile checkout."

**Schema** — `library/{source}/{slug}/classification.json`:
```json
{
  "category": "pricing" | "hero" | "card" | "form" | "navigation" | "overlay" | ...,
  "subcategory": "tiered-pricing" | "comparison-table" | ...,
  "visual_style": ["glass-morphism", "dark", "gradient-border", "neobrutalism"],
  "interactions": ["hover-glow", "scroll-animate", "drag"],
  "best_for_industries": ["saas", "fintech", "e-commerce", "creator-tools"],
  "platform_fit": ["desktop", "mobile", "both"],
  "complexity": "atomic" | "composite" | "system",
  "use_cases": [
    "Landing page hero for a B2B SaaS",
    "Pricing page for a developer tool"
  ],
  "similar_to": [{"source":"21st-dev","slug":"..."}],
  "ai_summary": "2-3 sentence description optimized for LLM retrieval",
  "_classifiedAt": "2026-04-...",
  "_classifierModel": "haiku-4.5"
}
```

**Pipeline:**
1. Worker reads `{slug}.tsx` + `demo.tsx` + `README.md` + screenshot (from Phase 1.W3)
2. Worker (Haiku) sends all four to a classification prompt → gets JSON back
3. Worker writes `classification.json` to the component folder
4. `manifest.json` rebuild includes classification fields so the viewer can filter/search on them

**Scale:** 5,300 classifications × ~3s per call at Haiku = ~4.5 hours serial, or **~30 min at concurrency 10** via async-dispatch.

**Cost:** Haiku-4.5 @ ~$1/Mtok input, components are ~2k tokens each → 5,300 × 2k = 10.6M tokens → ~$10 total. Cheap.

**Worker fleet:** `async-dispatch` with 10 parallel MiniMax/Haiku workers, each claims a slice of unclassified components, writes `classification.json`, marks row in SQLite as classified. Restartable — if a worker dies, another picks up where it left off.

**Viewer integration:**
- Manifest build script reads `classification.json` alongside `registry-item.json`
- Sidebar gains faceted filters: category, visual_style, industry, complexity
- Search becomes semantic (grep across `ai_summary` + `use_cases`)
- New route `/query` — natural-language search ("dark saas pricing with glow") → resolves to classification facets → returns matching components

**Dependency:** runs AFTER Phase 4 (needs components) + AFTER Phase 1.W3 (needs screenshots for multimodal classification). Can run in parallel with Phase 7a — they write to different files.

---

## Updated timeline

| Wall clock | What's happening |
|---|---|
| 0:00 — 0:02 | Phase 0 — Opus generates task board |
| 0:02 — 2:00 | Phase 1 — viewer refactor (4 parallel workers) |
| 2:00 — 2:15 | Phase 1 verifier PASS |
| 2:15 — 3:30 | Phase 2 — generic scraper (1 worker, writes provenance fields from Phase 6) |
| 2:15 — 3:30 | Phase 6 — provenance tagging (parallel with Phase 2, 1 worker) |
| 3:30 — 3:45 | Phase 3 — stress test (10 + 100 components) |
| 3:45 — 4:00 | Phase 4 — full bulk pull (5 parallel workers) |
| 4:00 — 4:15 | Manifest merge + commit + viewer smoke test |
| 4:15 — 4:30 | Phase 5 (optional) — GitHub sources |
| 4:30 — 5:30 | Phase 7a — rating/swiper UI (1 Sonnet worker) |
| 4:30 — 5:00 | Phase 7b — classification pipeline build (1 Haiku worker) |
| 5:00 — 5:30 | Phase 7b — run classification fleet (10 parallel Haiku workers, ~30 min, ~$10) |

**Total ~5.5 hours wall-clock** → 20 → ~5,300 components, all tagged, all AI-classified, all rankable by Shaan via swiper.

---

## Model routing summary

| Phase | Planner | Workers | Verifier |
|---|---|---|---|
| P1 — Viewer refactor | **Opus** (one plan file, phase breakdown) | **Sonnet** × 2 (virtualization, thumbnails), **Haiku** × 2 (manifest, facets) | **Haiku** (typecheck + cold-render test) |
| P2 — Generic scraper | — (already designed) | **Haiku** × 1 | **Haiku** (run dry-run, verify 10 components land) |
| P3 — Stress test | — | — | **Haiku** × 1 |
| P4 — Bulk pull | — | **Haiku** × 5 (parallel, one per source) | **Haiku** × 1 (manifest merge + smoke test) |
| P5 — GitHub sources | — | **Haiku** × 1 | **Haiku** × 1 |
| P6 — Provenance tagging | — | **Haiku** × 1 (parallel with P2) | shared with P3 |
| P7a — Rating/swiper | micro-Opus for Elo design (~200 tok) | **Sonnet** × 1 | manual (Shaan uses it) |
| P7b — Classification | — | **Haiku** × 1 (builds pipeline) + **Haiku** × 10 (runs it via async-dispatch) | **Haiku** × 1 (spot-check 50 random classifications) |

**Codex kept in reserve** for any worker that gets stuck on a specific scraping edge case (bot-shield workaround, framer-motion import mangling, etc.) — invoke via `codex:rescue` skill.

**Opus used once** — to generate the Phase 1 TASK_BOARD.md with zero-overlap file scopes for the 4 parallel workers. That's the only architectural-planning moment in this project.

---

## Zero-overlap file scopes (for Opus to enforce in Phase 1)

```
P1.W1 (manifest):       viewer/lib/registry.ts
                        scripts/build-manifest.mjs  (new)
                        library/manifest.json       (new, committed)

P1.W2 (virtualization): viewer/components/ComponentGrid.tsx
                        viewer/package.json         (add @tanstack/react-virtual)

P1.W3 (thumbnails):     viewer/components/Card.tsx
                        scripts/generate-thumbnails.mjs  (new)
                        library/{source}/{slug}/preview.png  (new per component)

P1.W4 (facets):         viewer/app/page.tsx
                        viewer/components/Sidebar.tsx
                        viewer/lib/filters.ts       (new)
```

No two workers touch the same file. No merge conflicts.

---

## Locked decisions (Shaan confirmed 2026-04-22)

1. ✅ **Commit `manifest.json`** — source of truth, diffable.
2. ✅ **Commit thumbnails via git-lfs** under `library/**/*.png`. `.gitattributes` gets updated as part of Phase 1.W3.
3. ✅ **First bulk run pulls all 5 sources.**
4. ✅ **Bulk-imported components get a `[generic]` tag** — see Phase 6.
5. ✅ **Gamified rating system + AI-readable classification** — see Phase 7.

---

## Timeline at a glance

| Wall clock | What's happening |
|---|---|
| 0:00 — 2:00 | Phase 1 — viewer refactor (4 workers in parallel) |
| 2:00 — 2:15 | Phase 1 verifier PASS |
| 2:15 — 3:30 | Phase 2 — generic scraper (1 worker) |
| 3:30 — 3:45 | Phase 3 — stress test (10 + 100 components) |
| 3:45 — 4:00 | Phase 4 — full bulk pull (5 workers in parallel) |
| 4:00 — 4:15 | Manifest merge + commit + viewer smoke test |
| 4:15 — 4:30 | Phase 5 (optional) — GitHub sources |

**Total ~4.5 hours of wall-clock work** → bank grows from 20 components to ~5,300.

---

## Next concrete action

**Dispatch Opus as a planner** to generate `.claude/plans/PHASE_1_TASK_BOARD.md` — a Kanban board with the 4 Phase-1 workstreams, each with file scopes (already specified above), acceptance criteria, and ordering dependencies (W1 before W2/W3).

Once that board exists, Sonnet orchestrator dispatches 4 Haiku/Sonnet workers in isolated worktrees.
