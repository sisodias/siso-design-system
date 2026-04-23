# Preview Route Hang — Investigation Report

**Date:** 2026-04-23
**Status:** REPRODUCED, ROOT CAUSE IDENTIFIED, FIX NOT YET IMPLEMENTED

---

## Reproduction

```bash
pkill -9 -f "next dev"
cd viewer && rm -rf .next
NODE_OPTIONS='--max-old-space-size=8192' npm run dev -- -p 3005 &
sleep 35
curl -sS --max-time 120 http://localhost:3005/preview/21st-dev/notification
# Result: times out after 120s with 0 bytes received
```

Meanwhile, home route compiles fine:

```
GET / 200 in 11271ms          # ← 10.4s webpack compile + 0.9s render
○ Compiling /preview/[source]/[slug] ...
# (never completes)
```

## Root cause

`viewer/lib/preview-imports.generated.ts` is 316KB with 3,079 lines, containing **3,070 literal `import()` calls**:

```ts
export const previewLoaders: Record<string, PreviewLoader> = {
  "21st-dev/0xurvish-animated-collection": () => import("@lib/21st-dev/0xurvish-animated-collection/demo"),
  "21st-dev/0xurvish-bento-card": () => import("@lib/21st-dev/0xurvish-bento-card/demo"),
  // ... 3,068 more ...
}
```

F1 intended to replace webpack's template-literal glob (`import(\`@lib/${source}/${slug}/demo\`)`) with explicit literal `import()` calls. This eliminated glob enumeration, BUT webpack **still treats every `import()` call as an async split point**. Having 3,070 split points in a single module means:

1. Every module that imports `preview-imports.generated.ts` (currently only `PreviewRenderer.tsx`) triggers webpack to generate 3,070 separate async chunks
2. The preview route's module graph includes `PreviewRenderer.tsx` → `preview-imports.generated.ts` → 3,070 chunk edges
3. Webpack's chunk splitter hangs or becomes pathologically slow processing this

## Evidence

- Home route (`/`) compiles in 10.4s / 1,572 modules — it does NOT import `preview-imports.generated.ts` transitively
- Preview route compile starts but never emits a "Compiled" log within 120 seconds
- Idle CPU after the hang: 0% (dev server process is wedged, not spinning)
- `.next/trace` shows `add-entry` events for the preview route but no completion
- Memory usage jumped from normal ~150MB to 1.7GB RSS during the hang, suggesting webpack is holding the module graph in RAM

## Why F2 alone seemed to fix everything

F2 (library watch scope) fixed the idle CPU pin because chokidar was re-stat'ing 14k library files on every HMR tick. With those files ignored, idle CPU drops to 0%. But **F2 doesn't touch webpack's module graph**.

F1's fix is correct in direction (eliminate the glob) but wrong in execution (one big file with 3,070 dynamic imports is worse than a glob for webpack's chunk splitter).

## Fix options (ranked by effort)

### Option A — Split generated file per-source (likely winner, ~2h)

Instead of one 316KB `preview-imports.generated.ts`, emit one file per source:

- `viewer/lib/preview-imports-21st-dev.generated.ts` (2,996 entries)
- `viewer/lib/preview-imports-motion-primitives.generated.ts` (33 entries)
- `viewer/lib/preview-imports-kokonutui.generated.ts` (40 entries)

`PreviewRenderer.tsx` uses runtime dynamic import to load ONLY the file for the current source:

```ts
const loaderMap = await import(`@/lib/preview-imports-${source}.generated`)
const loader = loaderMap.previewLoaders[slug]
```

Webpack still glob-enumerates (3 files), but only one loads at runtime. Chunk count per preview request drops from 3,070 to ~2,996 (most).

### Option B — Drop static `import()`, use runtime resolution (harder, but correct)

Have the build script emit a **data file** (JSON map of slugs) rather than a code file with `import()` calls. At runtime, `PreviewRenderer.tsx` constructs the import path dynamically:

```ts
// preview-manifest.json: { "21st-dev/notification": { "valid": true }, ... }
const modulePath = `@lib/${source}/${slug}/demo`
const Demo = await import(/* webpackChunkName: "demo-[request]" */ modulePath)
```

This is exactly what F1 was trying to avoid (webpack glob enumeration). But with F2 preventing library watches, the glob cost is one-time (build), not per-HMR. If it's <30s cold, acceptable.

### Option C — Exclude preview route from dev compilation (nuclear, defer)

`next.config.ts`: `excludedRoutes: ['/preview/[source]/[slug]']` — compile only on first actual request, keep home + listing routes fast. Doesn't fix the underlying issue but isolates the blast radius.

### Option D — Revert F1 entirely

The template-literal glob was slow at module-graph-construction time (H1 in the original design doc), but apparently fast enough that routes still compiled. Revert F1 and rely on F2 alone — idle CPU stays at 0%, and the glob's cost is paid only when the preview route is requested.

**Tradeoff:** First preview-route request takes ~20s (glob enumeration). With F2 eating the idle-CPU cost, 20s first-hit isn't fatal.

## Recommendation

Go with **Option D (revert F1) first** as a fast unblock — confirms F2 alone is the actual fix, simplifies the codebase, restores working previews immediately. Then explore Option A for further optimization if first-hit preview times prove too slow.

## Next action

Dispatch a Haiku worker (when rate-limit budget allows) to:

1. Revert `PreviewRenderer.tsx` to the pre-F1 template-literal glob version (but keep `'use client'` + useEffect shape from F1 rewrite — that's independently good)
2. Revert `scripts/build-manifest.mjs` to not emit `preview-imports.generated.ts`
3. Revert `viewer/package.json` predev/prebuild hooks
4. Keep `viewer/.gitignore` excluding the generated file (harmless, now unused)
5. Keep all F2 + F12 changes (those actually solved the idle CPU)
6. Verify: home compiles <15s, preview compiles <30s first-hit, idle CPU stays 0%

Report + commit. If this works, the project lands on a clean F2-only state that matches the original Opus diagnosis's H2 (not H1) as the real root cause.
