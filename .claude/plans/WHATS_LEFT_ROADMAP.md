# WHATS_LEFT — SISO Design System Roadmap

**Date:** 2026-04-23 · **Owner:** Shaan · **Status:** Living doc
**Purpose:** One ranked source-of-truth for what's still unshipped. All detailed designs already live in sibling `.claude/plans/*_DESIGN.md` files — this doc links, doesn't duplicate.

---

## 1. What exists today

| Metric | Value |
|---|---|
| Components in manifest | **3,567** (last generated 2026-04-22) |
| Components classified (`classification.json`) | **2,774** of 3,567 (~78%) — remaining **793** unclassified |
| Renderable components | Majority; non-renderable marked `preview.renderable: false` |
| Sources live | 21st-dev (~3,500), motion-primitives (~33), kokonutui (~40) |
| Commits this project | 15 feature/data commits since bulk-import start |
| Viewer routes live | `/`, `/component/[source]/[name]`, `/preview/[source]/[slug]`, `/rate`, `/rate/swipe`, `/rate/leaderboard`, `/export`, **`/pick`** |
| API routes live | `/api/components`, `/api/components/[source]/[slug]`, `/api/components/meta`, `/api/facets`, `/api/rate/compare`, `/api/rate/swipe`, `/api/rate/stats` |
| CLI package | `cli/` scaffolded (package.json, src/, tsup build, dist/ present) — entry `@siso/cli pick <category>` |
| Design docs authored | `BULK_IMPORT_PLAN`, `COMPOSE_DESIGN`, `CURATION_SETS_DESIGN`, `DEDUP_DESIGN`, `DEPLOY_AND_REGISTRY_DESIGN`, `PICK_FLOW_DESIGN`, `PICK_FLOW_TASK_BOARD`, `RANKING_DESIGN`, `RATING_MATH_DESIGN`, `VIEWER_PERFORMANCE_DESIGN`, `PHASE_1_TASK_BOARD`, `VERCEL_DEPLOY_TASK_BOARD`, `PERF_RESULTS` |
| Ratings | SQLite at `ratings.db` (gitignored) — Elo K=32, auto-promote at 1400 |

**The end-to-end demo surface is built.** `/pick` UI ships. CLI ships. What remains is the preview-hang unblock, classification tail, and curation-signal work.

---

## 2. What's broken

| # | Problem | Status | Reference |
|---|---|---|---|
| 2.1 | `/preview/[source]/[slug]` route hangs during webpack compile — 3,070 literal `import()` calls in one generated file blow up chunk splitter | **FIXED** — F1 reverted to require.context per-source. Preview notification cold: 3s. Hot: 0.3s. | `.claude/feedback/preview_route_hang.md` + commit `4113873b` |
| 2.2 | 793 components have no `classification.json` | Classification run in progress (PID 85084, concurrency 4, MiniMax). ~60% complete. | `BULK_IMPORT_PLAN.md` §Phase 7b |
| 2.3 | Git LFS not installed locally; thumbnails commit as blobs. Fine today, painful at 10k+ PNGs. | Defer until thumbnail run crosses 5k. `brew install git-lfs` when it matters. | HANDOFF §11 |
| 2.4 | originui/coss-ui and hextaui never pulled (blocked by bot shield / redirect) | Deferred to Phase 6 below. Not blocking anything. | `BULK_IMPORT_PLAN.md` §Phase 4, §Phase 5 |

No other bugs block the end-to-end demo. Everything below is **forward work, not debt**.

---

## 3. What's left — ranked by user leverage

Ranking criteria: (a) unblocks "agent picks, code lands" demo · (b) curation signal · (c) distribution · (d) polish.

| # | Item | Why it matters | Blocker | Effort | Design doc |
|---|---|---|---|---|---|
| ~~3.1~~ | ~~F1 revert lands, preview route compiles~~ | ~~Demo is broken without it~~ | **DONE** | — | — |
| **3.2** | Classify last 793 components | Completes the facet sidebar, unlocks `/api/query` ranking | Re-run script | **S** (~10min wall, cheap) | `BULK_IMPORT_PLAN.md` §7b |
| **3.3** | End-to-end runtime test: pick → CLI → code lands | Proves the concept works locally with zero deploy | 3.1 must ship | **S** | `PICK_FLOW_DESIGN.md` |
| **3.4** | Rating math v2 (Bayesian shrink, see `RATING_MATH_DESIGN`) | Current Elo has high variance at low vote counts. Shaan needs a stable signal before rating 100+. | 3.2 | **M** (~4hr) | `RATING_MATH_DESIGN.md` |
| **3.5** | Curation tags replace binary `importMode` | Binary curated/bulk is too blunt. Multiple named sets (`dark-saas-kit`, `mobile-ecom`) unlock kits-as-products. | 3.4 (needs stable ratings to auto-tag) | **M–L** (~6hr) | `CURATION_SETS_DESIGN.md` |
| **3.6** | `/api/query` endpoint (BM25 + classification + Elo) | The core agent-facing entrypoint. "dark saas pricing" → top-5 JSON. | 3.2 | **L** (~1 day) | `RANKING_DESIGN.md` |
| **3.7** | Dedup detection | Same component exists under 21st-dev and originui. Blocks correct top-K ranking. | None (runs on current corpus) | **M** (~4hr) | `DEDUP_DESIGN.md` |
| **3.8** | `/compose` route — build a page skeleton from picked components | The "full agent build tool" use case. Higher ceiling than `/pick`. | 3.1, 3.6 | **L–XL** (1–2 days) | `COMPOSE_DESIGN.md` |
| **3.9** | Publish `@siso/cli` to npm | Turns `/pick` into something anyone can `npx` from any project | Public URL for viewer + a settled npm scope | **S** (~1hr once decided) | `DEPLOY_AND_REGISTRY_DESIGN.md` |
| **3.10** | `@siso/mcp-server` — MCP wrapper around `/api/query` | Makes the bank a first-class tool for Claude, Cursor, Windsurf | 3.6, 3.9 | **M** (~4hr) | `DEPLOY_AND_REGISTRY_DESIGN.md` |
| **3.11** | Pull originui (~500), hextaui (~139), magicui (~74), cult-ui (~76) | More corpus. Each is a day of scraping + recovery. | None, but diminishing returns vs. 3,567 already in bank | **L each** | `BULK_IMPORT_PLAN.md` §Phase 4 |
| **3.12** | Pull reactbits + motion-primitives tail via GitHub adapter (~250) | Bot-shielded; requires GitHub fallback in `bulk-import.mjs` | None | **L** | `BULK_IMPORT_PLAN.md` §Phase 5 |
| **3.13** | Thumbnails for all 3,567 components | Viewer perf + `/pick` visual quality | Dev server on :3005 + Playwright | **L** (~6hr runtime) | `generate-thumbnails.mjs` exists |

---

## 4. Open decisions (need Shaan)

| # | Question | Options | Recommendation |
|---|---|---|---|
| **4.1** | `cli/` in monorepo or separate repo? | (a) stays in `design-system/cli/` as a sub-package · (b) split to `siso-cli` repo on GitHub | **(a) keep it in monorepo.** Zero overhead. Versions with the viewer. Only split if someone else contributes. |
| **4.2** | npm scope | (a) `@siso/cli` · (b) `@siso-ui/cli` · (c) `siso-design-system` (unscoped) · (d) personal scope `@shaansisodia/siso-cli` | **(b) `@siso-ui/cli`** — `@siso` is almost certainly taken, `siso-ui` matches the vibe and leaves room for `@siso-ui/mcp-server`, `@siso-ui/core`. Register the scope day one. |
| **4.3** | Where does CLI point before deploy exists? | (a) config-based (`SISO_BASE_URL=http://localhost:3005`) · (b) embed future prod URL now, fall back to localhost · (c) wait for deploy | **(a) env var + `~/.sisorc` config file.** Ship it local-first. When a public URL lands, default flips. No blocking. |
| **4.4** | Definition of "curated" | (a) binary `importMode` (current) · (b) tag-based named sets · (c) both (sets + a canonical "featured" tag) | **(c) both.** Keep `importMode` as the default-grid filter (one flag, simple). Add tags from `CURATION_SETS_DESIGN` for kits. Don't rip the binary out. |
| **4.5** | Rating math — ship as-is or upgrade? | (a) keep K=32 Elo · (b) Bayesian shrink per `RATING_MATH_DESIGN` · (c) Glicko-2 | **(b) Bayesian shrink.** The design doc exists; it's a ~4hr upgrade that saves Shaan from seeing garbage top-10 at low vote counts. Ship before rating 100+ components. |
| **4.6** | Dedup — before or after rating? | (a) dedup first (rate canonical only) · (b) rate first (dedup uses rating as tiebreaker) · (c) skip until agents complain | **(a) dedup first, lazily.** Run `scripts/dedup.mjs` on the current 3,567. Mark near-duplicates with `_canonical_of` pointer. Rate only canonicals. Cleaner UX, less wasted swiping. |
| **4.7** | CLI distribution model | (a) npm only · (b) npm + a one-line `curl \| sh` installer · (c) Homebrew tap too | **(a) npm only for now.** `npx @siso-ui/cli pick hero` is the pitch. Brew when someone asks. |

---

## 5. Recommended order — phased

### Phase 1 — Unblock (no new decisions)

- **1.1** ~~F1 revert completes → `/preview/*` compiles~~ **DONE (commit 4113873b)**
- **1.2** Final classification pass (793 components) — running in background
- **1.3** Manifest regenerated, viewer restart clean

**Acceptance gate:** `curl -sS --max-time 60 http://localhost:3005/preview/21st-dev/notification` returns HTML (PASSED — 3s cold). `find library -name classification.json | wc -l` = 3,567.

---

### Phase 2 — End-to-end local demo (prove the concept)

- **2.1** Runtime test: open `http://localhost:3005/pick?category=hero` in browser, click a card, confirm postMessage fires
- **2.2** CLI test: `SISO_BASE_URL=http://localhost:3005 node cli/dist/index.js pick hero` → card selected → code written to `./target-project/components/siso/<slug>.tsx`
- **2.3** Write a 5-step README in `cli/README.md` showing the full loop

**Acceptance gate:** "I run one CLI command in an empty Next project, I pick a card in a browser tab that opens, the code lands in my repo, I import it, it renders."

**Task board:** `PICK_FLOW_TASK_BOARD.md` already covers this.

---

### Phase 3 — Curation signal (build Shaan's taste model)

- **3.1** Ship rating math v2 (Bayesian shrink) — decision 4.5
- **3.2** Run dedup pass — decision 4.6, writes `_canonical_of` pointers
- **3.3** Shaan rates ~150 components via `/rate/swipe` (human task, ~30 min)
- **3.4** Ship curation tags + `featured` tag per decision 4.4
- **3.5** Auto-promote top ~50 to a `featured` set

**Acceptance gate:** `/` landing page shows ~50 "featured" components by default (not 3,567, not the pre-bulk 21). Tags queryable via `/api/components?tag=featured`.

**Task board:** create `.claude/plans/CURATION_TASK_BOARD.md` (combines `RATING_MATH_DESIGN` + `DEDUP_DESIGN` + `CURATION_SETS_DESIGN`).

---

### Phase 4 — Differentiators (queryable catalog)

- **4.1** Ship `/api/query` with BM25 + classification match + Elo scoring
- **4.2** Semantic search in viewer sidebar points at `/api/query`
- **4.3** Ship `/compose` route (MVP: multi-select → prompt export, not full codegen)

**Acceptance gate:** `curl "http://localhost:3005/api/query?q=dark+saas+pricing"` returns a ranked JSON list where the top-5 are all genuinely dark saas pricing components. `/compose` can export 3 selected components as a single agent prompt.

**Task board:** `RANKING_DESIGN.md` and `COMPOSE_DESIGN.md` already cover it.

---

### Phase 5 — Distribution (when public URL exists)

- **5.1** Publish `@siso-ui/cli` to npm
- **5.2** Publish `@siso-ui/mcp-server` (wraps `/api/query`) to npm + Smithery registry
- **5.3** Update `README.md` in repo root with install + usage
- **5.4** Update `cli/README.md` with `npx @siso-ui/cli pick` one-liner

**Acceptance gate:** `npx @siso-ui/cli pick hero` from any fresh Next project works. MCP server discoverable in Claude Desktop's MCP browser.

**Task board:** `DEPLOY_AND_REGISTRY_DESIGN.md` already covers it.

---

### Phase 6 — Long tail (opportunistic, no time pressure)

- **6.1** originui, hextaui, cult-ui, magicui adapters (~790 more)
- **6.2** GitHub fallback for reactbits, motion-primitives, kokonutui tails (~250)
- **6.3** Publish named kits (`dark-saas-starter`, `mobile-ecom`, etc.) as `/r/kits/{name}.json`
- **6.4** Thumbnail-generation run for full corpus

**Acceptance gate:** none — purely additive. Ship whenever a specific component gap bites.

**Task board:** `BULK_IMPORT_PLAN.md` §Phases 4–5 covers it.

---

## 6. What NOT to do

Explicit out-of-scope list. These are tempting and wrong:

1. **Don't rewrite the viewer in a different framework.** Next.js 15 + shadcn is fine. Any port is weeks of yak-shaving for zero user-facing win.
2. **Don't add auth to the viewer.** It's a localhost tool. When public URL lands, use Cloudflare Access or a signed URL — not Clerk-in-viewer.
3. **Don't build visual-remix / AI-blending yet.** `/compose` prompt-export is enough. A true AI blender is a different product.
4. **Don't pursue cross-framework codegen.** Remix / Astro / SolidJS variants of every component is a 10x scope inflation. Ship React first.
5. **Don't rate all 3,567 components.** ~150 ratings is statistically sufficient for Bayesian-shrunk rankings. Grinding 3,567 is burnout.
6. **Don't over-design the MCP server.** Wrap `/api/query` in a `search_components` MCP tool, add `get_component` for detail fetch. That's it. No stateful sessions, no caching layer.
7. **Don't replace SQLite with Convex for ratings.** Single-user local tool. Convex is overkill until there are multiple raters.
8. **Don't chase 10k components.** 3,567 is already 700× more than Shaan can meaningfully curate. Depth of signal > breadth of corpus.

---

## 7. One week of focused work (3hrs/day)

Assumes Phase 1 (unblock) is done day-zero as background work.

| Day | Focus | Ships |
|---|---|---|
| **Mon** | Phase 2 end-to-end demo | Browser tab opens, Shaan clicks a card, code file appears in a test Next project. README updated. |
| **Tue** | Rating math v2 + dedup pass | `ratings.ts` upgraded with Bayesian shrink. `scripts/dedup.mjs` runs, writes `_canonical_of` on near-duplicates. Manifest rebuilt. |
| **Wed** | Shaan rates + curation tags MVP | ~100 swipe ratings. Curation-tag schema added. `featured` tag populated from auto-promotion. Default grid shows `featured` set. |
| **Thu** | `/api/query` ranking endpoint | BM25 + classification + Elo blended scoring live. Sidebar search calls it. First five "dark saas pricing" results are genuinely good. |
| **Fri** | `/compose` MVP | Multi-select cart already exists at `/export`. Extend into `/compose` with prompt-pack export (agent-ready markdown bundle). |
| **Sat** | npm publish prep | Register `@siso-ui` scope. `cli/package.json` ready. Dry-run `npm publish --dry-run`. Decide final CLI name and flag surface. |
| **Sun** | MCP server + release | `@siso-ui/mcp-server` skeleton pointing at `/api/query`. README polish. Ship v0.1.0 of both packages to npm (pointed at localhost for now — env var switches to public URL when deploy lands). |

**End-of-week state:** the bank is queryable, rateable, composable, and distributable. The only thing missing is a public URL — which is descoped per hard constraint #1, so this plan ends here and doesn't block on it.

---

## 8. Cross-references

- All phase-level task boards live in `.claude/plans/`.
- Feedback / bug reports live in `.claude/feedback/`.
- Architecture details: `HANDOFF.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md` in repo root.
- Running state: `memory/brain.md`, `memory/journal.md`, `memory/state.json` per `.claude/rules/01-persistence.md`.
