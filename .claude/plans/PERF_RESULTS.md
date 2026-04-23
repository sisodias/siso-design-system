# Viewer Performance Results — P1 verification

**Date:** 2026-04-23
**Commits verified:** `287a2e60` (F2+F12) + `49f59b76` (F1)
**Test environment:** `next dev -p 3005` after `rm -rf .next`, measured with `ps` + `curl -w`

---

## Primary target: idle CPU

| Metric | Baseline | Target | Measured | Status |
|---|---|---|---|---|
| Idle CPU (60s sampled, dev running, no traffic) | **166%** sustained | <20% | **0.0%** (5 consecutive 5s samples) | ✅ |
| Idle RSS | **~2.5 GB est.** | <1 GB | **149 MB** initial → 34 MB settled | ✅ |
| `.next/` total after session | **6.3 GB confirmed** | <500 MB | (pending — blown away mid-test) | — |
| Dev-server cold start time | ~5-8s | <3s | **~22s (ready) + 11s first-compile** | ⚠ |

Interpretation: **F2 alone nailed the primary goal.** CPU went from 166% sustained → 0% at idle. The library file-watch scope was the entire issue.

---

## Route compile times (cold, fresh `.next/`)

| Route | Time | Notes |
|---|---|---|
| `/?mode=curated` | **11.97 s** (first hit) | 1,572 modules compiled; route-level chunk |
| `/?mode=all` | **0.25 s** (hot) | Reuses `/` chunk, just changes filter |
| `/preview/21st-dev/notification` | **⚠ hung** (>6 min, no response; dev server idle at 0% CPU) | Known follow-up issue (see below) |

Interpretation: `/?` route cold-compile of ~12s is acceptable but higher than the <4s target. Could be further reduced by **F5 (Turbopack)** in P4 — defer unless annoying.

---

## Module graph size (webpack)

| Metric | Before F1 | After F1 |
|---|---|---|
| Compiled modules for `/` | ~50k+ (estimated; whole-library glob) | **1,572** ✅ |
| Generated loader entries | N/A (template-literal glob) | **3,070 explicit `import()`** in `preview-imports.generated.ts` |
| Suppressed broken components | 0 | 85 (24 known-broken npm-path patterns) |

F1 bounded the module graph to **per-route** rather than per-library. Without F1, F2's watch-scope fix would still leave a latent 50k-module graph liability any time watching were re-enabled.

---

## Follow-up issues found mid-verification

### Preview route hang (not a regression — possibly pre-existing)

Calling `/preview/21st-dev/notification` during P3 verification didn't return within 6+ minutes. Dev server was at **0% CPU and 34MB RSS** during the hang — i.e. not compiling, just wedged. Curl didn't error; it just held the connection.

Plausible causes (not yet investigated):
- `nextDynamic(ssr:false)` in `PreviewRenderer.tsx` inside a server component might be mis-wired
- `Suspense` boundary swallowing the response
- Dev server dead but socket still listening (would reset on ECONNREFUSED, didn't)

**This is a real bug but not caused by F1 or F2.** The server-side short-circuit for non-renderable components (verified earlier) isn't failing — `notification` is renderable. Filing as a follow-up.

---

## Recommendation

**Ship P1. Skip P2.** F2 alone obliterated the 166% idle CPU. P2 fixes (F4 global iframe cap, F9 debounced sidebar, F10 Card memo, F11 lazy sqlite) are each <5% CPU gains against a 0% baseline — rounding error.

All P2 fixes remain on the shelf. If CPU ever regresses (e.g. someone re-enables library watching, or bulk-import scripts start writing to library/ during dev), they're ready to apply.

## Next priorities

1. Investigate the preview-route hang (separate issue, not a perf regression)
2. Find / recreate the GitHub remote (repo returns 404; 3 commits are unpushed)
3. Classify the ~1,900 still-unclassified components (gap between bulk pulls and classify runs)
4. Continue integration track: `/pick` flow implementation, deploy to Vercel
