# Viewer Performance Design — kill the 166% CPU idle

**Problem:** `next dev -p 3005` pins 166% CPU sustained, even at idle.
**Corpus:** 3,509 components in `library/21st-dev/` + motion-primitives + kokonutui = ~14k watched files.
**Build artifact:** `.next/` is **6.3 GB** — catastrophic for a dev server.
**Goal:** <20% idle CPU, <4s cold load on `/?mode=all`, no feature regressions.

This is almost entirely a **dev-mode webpack compile problem**, not a runtime render problem. Virtualization already keeps DOM cost bounded. The real fire is the compiler.

---

## 1. Root-cause hypotheses (ranked)

### H1 — Dynamic-import glob in `PreviewRenderer.tsx` `[PROBABILITY: 95%]`

**File:** `viewer/components/PreviewRenderer.tsx:24`

```ts
import(`@lib/21st-dev/${slug}/demo`)
```

This is the smoking gun. Webpack resolves template-literal dynamic imports at compile time by **matching every possible file** that could satisfy the glob. At 3,509 component folders, webpack enumerates ~3,509 candidate modules and creates a request map for all of them. In dev mode this triggers lazy compilation, but the *module graph itself* (dependency walk, resolver state, watchpack registrations) is eagerly constructed.

**Compounding:** Each of those 3,509 candidate `demo.tsx` modules transitively pulls in Radix, Framer Motion, MUI, Chakra, Three.js, GSAP, Paper shaders, etc. The merged module graph is easily 50k+ modules. Next.js dev holds this graph in memory and re-walks it on every HMR tick.

**Test to confirm:**
```bash
cd viewer && rm -rf .next && time npm run dev &
sleep 60 && curl -s -o /dev/null -w "%{time_total}\n" http://localhost:3005/preview/21st-dev/aliimam-gallery
# First hit >20s → confirmed H1
# ps -p $(pgrep -f "next dev") -o %cpu at idle → >100% → confirmed H1
```

**Verdict:** This alone explains the 166% CPU. Fix F1 (explicit lazy-import map) is the single highest-leverage change.

### H2 — `externalDir: true` + `outputFileTracingRoot` watches entire library tree `[PROBABILITY: 85%]`

**File:** `viewer/next.config.ts:5-13`

```ts
output: 'standalone',
outputFileTracingRoot: path.resolve(__dirname, '..'),
experimental: { externalDir: true },
```

`externalDir: true` tells webpack + Turbopack it's OK to resolve imports outside the viewer root. Combined with H1's glob, chokidar registers watchers for every `.tsx` under `library/`. Output tracing also runs in dev, which is wasteful — it's only needed at `next build` time for the standalone bundle.

**Verdict:** Top-2 cause. Fix F2 disables the watch.

### H3 — Recently-Added rail swarm + missing `maxHoverIframes` guard `[PROBABILITY: 30%]`

The rail always renders 6 cards outside the virtualizer. No global cap: if the user moves the mouse across 6 cards in <500ms (during the unmount debounce window), up to 6 iframes mount simultaneously.

**Verdict:** Minor contributor to *peak* CPU. Not the idle cause. Fix F4.

### H4 — Webpack cache unbounded growth `[PROBABILITY: 70% — confirmed 6.3 GB]`

`du -sh viewer/.next` = **6.3 GB**. Byproduct of H1, not independent. Fix is "stop compiling 3,509 modules" (F1).

### H5–H8 — Manifest reads / SWC / Fast Refresh / sqlite

Module-scope cache in `registry.ts` looks correct. SWC overhead subsumed by H1. Fast Refresh fixed free by F2. sqlite is edge case.

### Committed top 3

1. **H1 — dynamic-import glob** — 80% of the CPU.
2. **H2 — `externalDir` + library watch** — 15%.
3. **H4 — 6.3 GB `.next/`** — amplifier for H1 over time.

---

## 2. Instrumentation plan

Add **temporary** logging in this order. Remove all of it after F1 + F2 ship.

| Target | File | What to log | Remove after |
|---|---|---|---|
| Manifest load counter | `viewer/lib/registry.ts:22` | `console.log('[perf] manifest read', process.hrtime())` in `_loadManifest` | F1 verify |
| Preview route compile time | `viewer/app/preview/[source]/[slug]/page.tsx:11` | Wrap body in `console.time('preview:'+slug) / console.timeEnd` | F1 verify |
| Dynamic import resolve time | `viewer/components/PreviewRenderer.tsx:22` | `const t0 = performance.now()` before `nextDynamic`, log delta in `.then` | F1 verify |
| Process CPU sampler | new `viewer/scripts/perf-sample.mjs` | `setInterval(() => console.log(process.cpuUsage()), 5000)` — spawn alongside dev | after diagnosis |
| Chokidar watcher count | `viewer/next.config.ts` webpack hook | `config.plugins.push({ apply(c) { c.hooks.watchRun.tap('perf', comp => console.log('watched:', Object.keys(comp.watchFileSystem.watcher?.fileWatchers ?? {}).length)) } })` | after F2 ship |
| `.next/cache` size | cron `watch -n 30 du -sh viewer/.next/cache` | shell only, not code | after F1 ship |

**React Profiler:** Open DevTools Profiler, record 10s of Card mount at `/?mode=all`. Expected: **no render work >5ms** — the client grid is fine. Confirms the fire is server-side.

---

## 3. Fix catalogue (ranked by ROI)

| ID | Fix | CPU cut | Effort | Risk |
|---|---|---|---|---|
| **F1** | Explicit lazy-import map generated at manifest time | **-70%** | 4h | low |
| **F2** | Narrow dev watch to exclude `library/**/*.tsx` | **-15%** | 30m | low |
| **F4** | Global `maxHoverIframes=1` + rail virtualization | -5% | 1h | low |
| **F5** | Try Turbopack | -5% | 15m test | med |
| **F8** | Lazy `<img>` attrs | -1% | 15m | none |
| **F9** | Debounce sidebar filter links | -1% | 30m | none |
| **F10** | `React.memo` Card | -1% | 30m | none |
| **F11** | `better-sqlite3` lazy import gate | -1% | 30m | low |
| **F12** | Drop `outputFileTracingRoot` in dev | -2% | 15m | low |
| F3 | Short-circuit renderable=false server route | 0% | 10m | none (already shipped) |
| F6 | Static-export top-N preview routes | -2% | 3h | med |
| F7 | Prime `.next/cache` at CI time | -3% | 2h | high |

### F1 — Generated lazy-import manifest (THE fix)

**Current broken code** (`viewer/components/PreviewRenderer.tsx:22-24`):
```ts
return nextDynamic(
  () =>
    import(`@lib/21st-dev/${slug}/demo`)
```

Webpack treats this as `require.context("@lib/21st-dev", true, /\/demo$/)` and enumerates all 3,509 folders.

**Fix:**

1. Extend `scripts/build-manifest.mjs` to emit a sibling file `viewer/lib/preview-imports.generated.ts`:
   ```ts
   // AUTO-GENERATED. DO NOT EDIT. Regenerated by build-manifest.mjs.
   import type { ComponentType } from 'react'
   type Loader = () => Promise<{ default: ComponentType } | Record<string, unknown>>
   export const previewLoaders: Record<string, Loader> = {
     '21st-dev/aliimam-gallery': () => import('@lib/21st-dev/aliimam-gallery/demo'),
     '21st-dev/sean-button':    () => import('@lib/21st-dev/sean-button/demo'),
     // ... one line per renderable component
   }
   ```
2. Only emit entries for `preview.renderable !== false` components (~2,100 lines, not 3,509).
3. Rewrite `PreviewRenderer.tsx` to look up the loader:
   ```ts
   import { previewLoaders } from '@/lib/preview-imports.generated'
   const loader = previewLoaders[`${source}/${slug}`]
   const Demo = useMemo(() => nextDynamic(loader ?? fallbackLoader, { ssr: false, loading: ... }), [source, slug])
   ```
4. `.gitignore` the generated file; regenerate in `prebuild` and at end of `bulk-import.mjs`.

**Why it works:** Each `import('...')` is now a **literal** string. Webpack code-splits per-component, only compiles on demand, doesn't pre-enumerate the glob. Idle compile cost goes from "3,509 module resolver entries" to zero.

**Expected:** First-hit `/preview/*` drops from ~20s to <2s. Idle CPU drops from 166% to <20%.

**Acceptance signal:** `top -pid $(pgrep -f "next dev")` shows <20% over 60s idle after cold start. First-hit preview <3s.

### F2 — Narrow dev watch scope

**File:** `viewer/next.config.ts`

Add webpack config to ignore library files at watch time in dev:
```ts
webpack: (config, { dev, isServer }) => {
  if (dev) {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        path.resolve(__dirname, '../library/**/*.tsx'),
        path.resolve(__dirname, '../library/**/*.ts'),
        path.resolve(__dirname, '../library/**/*.json'),
        path.resolve(__dirname, '../library/**/*.md'),
        `!${path.resolve(__dirname, '../library/manifest.json')}`,
      ],
    }
  }
  // ...existing
}
```

Also drop `outputFileTracingRoot` at dev time — it's only used at build. Gate via `process.env.NODE_ENV === 'production'` in `next.config.ts`.

**Expected:** `chokidar` watcher count drops from ~14k to ~500. RSS of next-dev drops ~1 GB. Fast Refresh no longer fires when thumbnail gen or classify-components touch library files.

**Acceptance signal:** Touch a random `library/21st-dev/*/demo.tsx` and confirm no HMR event in dev console.

### F3 — Server route short-circuit

**File:** `viewer/app/preview/[source]/[slug]/page.tsx:16-27`

Already done. Verified by Read. `preview?.renderable === false` → bails out *before* `PreviewRenderer` mounts. With F1, this also means the loader lookup never runs and the chunk never compiles. No change needed.

### F4 — Global iframe cap + rail fix

**File:** `viewer/components/Card.tsx`

Replace per-card `useState(iframeVisible)` with a module-scope slot:
```ts
let activeIframeSlug: string | null = null
const listeners = new Set<() => void>()
function setActive(slug: string | null) {
  activeIframeSlug = slug
  listeners.forEach(l => l())
}
function useActiveIframe(slug: string) {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  useEffect(() => { listeners.add(forceUpdate); return () => { listeners.delete(forceUpdate) } }, [])
  return activeIframeSlug === slug
}
```

Cards call `setActive(slug)` on mouseenter-timeout, `setActive(null)` on mouseleave-timeout. Only one iframe ever mounts globally.

**Rail fix:** Wrap the Recently-Added rail in an `IntersectionObserver` and only render cards when visible. Still 6 cards, but delay mount until scrolled into view.

**Expected:** -5% CPU during rapid mouse movement. No idle change.

**Acceptance signal:** Network tab shows at most 1 in-flight `/preview/*` request during hover storm.

### F5 — Try Turbopack

```bash
"dev": "next dev -p 3005 --turbopack"
```

Turbopack handles large module graphs with a Rust-backed module resolver and does not do the webpack glob-expansion pass. If F1 ships, the glob is gone anyway — Turbopack's main benefit remaining is faster cold start and lower steady-state CPU. Risk: some webpack plugins (custom `config.resolve.modules`, `better-sqlite3` external) don't have Turbopack equivalents yet.

**Verdict:** Defer until after F1 + F2. If F1 alone gets to <20% idle, Turbopack is a bonus.

### F8 — Thumbnail `<img>` attrs

**File:** `Card.tsx:103-110`

Already has `loading="lazy"`. Add `decoding="async"` and `fetchPriority="low"`. Trivial.

### F9 — Debounce filter click storm

**File:** `viewer/components/Sidebar.tsx`

Since filters are URL-driven and use `<Link>`, each click is a full server round-trip. If Shaan toggles 5 checkboxes fast, that's 5 server renders. Add `useDeferredValue` or a 200ms `setTimeout` batching layer that accumulates toggle state then navigates once.

### F10 — `React.memo` Card

`Card` re-renders every time `ComponentGrid` state changes (search, source toggle). With 30 cards visible, that's 30 unnecessary component invocations per keystroke. Wrap export: `export default memo(Card)`. Keys are already stable (`${source}-${name}`).

### F11 — Gate `better-sqlite3`

**File:** `viewer/lib/ratings.ts`

Ensure `new Database(...)` lives inside a lazy getter, not at module top. Import via `require('better-sqlite3')` only on first call to a rating API. Browse-only sessions never pay the native-binding cost.

### F12 — Remove `outputFileTracingRoot` in dev

**File:** `viewer/next.config.ts:6`

```ts
...(process.env.NODE_ENV === 'production' && {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(__dirname, '..'),
}),
```

Tracing is a build-time concern. Including `../library` at dev time is wasteful.

---

## 4. Ship order

| Phase | Ships | Duration | Expected idle CPU after | Expected cold `/?mode=all` |
|---|---|---|---|---|
| **P0** | Instrumentation (§2) + baseline `top` measurement | 1h | 166% (baseline) | baseline |
| **P1** | **F1** (generated lazy-import map) + **F2** (dev watch scope) + **F12** (no tracing in dev) | 4h | **<25%** | **<4s** |
| **P2** | F4 (global iframe cap) + F8 (img attrs) + F10 (memo Card) | 2h | <20% | <3s |
| **P3** | F9 (debounced filter) + F11 (sqlite lazy) + remove all instrumentation from P0 | 1h | <20% | <3s |
| **P4 (optional)** | F5 (Turbopack) + F6 (static-export top-N) | 4h | <10% | <1.5s |

**If P1 alone hits targets, stop.** P2–P4 are polish.

---

## 5. Measurement targets

| Metric | Current (measured) | Target | How to measure |
|---|---|---|---|
| Idle CPU (dev running, no traffic) | **166%** sustained | **<20%** | `top -pid $(pgrep -f "next dev") -l 60 -s 1` avg %CPU |
| Cold load `/?mode=curated` | ~3s (est; 21 components) | <2s | `time curl -s -o /dev/null http://localhost:3005/?mode=curated` fresh `.next/` |
| Cold load `/?mode=all` | ~15s (est) | <4s | same with `?mode=all` |
| First `/preview/{source}/{slug}` | **>20s (est)** | **<2s** | curl timer, fresh `.next/` |
| Hover → iframe mount | ~1.5s | <500ms post-debounce | Performance tab frame timing |
| RSS of `next dev` | **>2.5 GB (est)** | <1 GB | `ps -p $PID -o rss=` ÷ 1024 |
| `.next/` total | **6.3 GB confirmed** | <500 MB | `du -sh .next` after 1h session |
| `.next/cache` growth/hr | ~500 MB/hr (est) | <200 MB/hr linear | `du -sh .next/cache` delta |

Estimated numbers (marked "est") get replaced with real measurements after P0 instrumentation.

---

## 6. What NOT to do

- **Don't** move to Vite or rewrite. The fix is small and inside Next.
- **Don't** shard `library/` across sub-apps.
- **Don't** remove iframe-on-hover, ratings, `/pick`, `/rate`, classification.
- **Don't** block this on RANKING/DEDUP/COMPOSE designs.
- **Don't** delete components to shrink corpus. The viewer *should* handle 10k+.
- **Don't** force Turbopack before F1 — Turbopack may mask the real bug; when webpack is needed again (CI builds), the bug returns.

---

## 7. Implementation plan for a Haiku worker

### Phase 1 — serial (one worker, 4h total)

| # | File | Change | LOC |
|---|---|---|---|
| 1 | `scripts/build-manifest.mjs` | After writing `manifest.json`, emit `viewer/lib/preview-imports.generated.ts` — iterate manifest, skip `preview.renderable === false`, write one line per component with literal `import()` path | +40 |
| 2 | `viewer/lib/preview-imports.generated.ts` | **Generated**. Add to `viewer/.gitignore` | auto |
| 3 | `viewer/components/PreviewRenderer.tsx` | Replace template-literal `import()` with `previewLoaders[key]` lookup; fall back to error component if key missing | ~30 mod |
| 4 | `viewer/next.config.ts` | Add dev-only `watchOptions.ignored` for library paths; gate `output: 'standalone'` + `outputFileTracingRoot` to production only | +20 |
| 5 | `viewer/package.json` | Ensure `predev` script calls `node ../scripts/build-manifest.mjs` so generated file exists before Next starts | +2 |
| 6 | `viewer/.gitignore` | Add `lib/preview-imports.generated.ts` | +1 |

Acceptance for Phase 1: `rm -rf viewer/.next && npm run dev` → after 60s idle `top` shows <25% CPU. First `/preview/{valid-slug}` returns <3s.

### Phase 2 — parallel (three workers, 2h wall)

| Worker | Files | Change |
|---|---|---|
| A | `viewer/components/Card.tsx` | F4 global iframe slot + F8 `decoding="async" fetchPriority="low"` + F10 `memo` export |
| B | `viewer/components/Sidebar.tsx`, `viewer/app/page.tsx` | F9 debounce filter navigation (200ms batching) |
| C | `viewer/lib/ratings.ts` | F11 lazy-load `better-sqlite3` only when a rating API is called |

All three touch disjoint files — no merge conflicts.

### Phase 3 — cleanup (1 worker, 1h)

Remove all instrumentation added in §2. Re-measure. Write `PERF_RESULTS.md` in `.claude/plans/` with before/after numbers.

### Global acceptance

```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system/viewer
rm -rf .next
npm run dev -- -p 3005 &
sleep 45
ps -p $(pgrep -f "next dev") -o %cpu,rss
# Expect: %cpu <20, rss <1000000 (KB → <1 GB)

time curl -s -o /dev/null "http://localhost:3005/?mode=all"
# Expect: <4s

time curl -s -o /dev/null "http://localhost:3005/preview/21st-dev/aliimam-gallery"
# Expect: <3s first hit, <200ms subsequent
```

Ship P1 first. Measure. If P1 clears targets, P2–P3 are polish; if not, escalate with real numbers and re-plan.
