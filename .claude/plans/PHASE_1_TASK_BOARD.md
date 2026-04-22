# Phase 1 Task Board — Viewer Refactor

**Parent plan:** `.claude/plans/BULK_IMPORT_PLAN.md`
**Blocks:** Phases 2, 3, 4, 5, 6, 7
**Wall-clock estimate:** ~2 hrs with 4 parallel workers
**Verifier:** Haiku — runs `npm run build` + cold-render benchmark + Playwright 60fps scroll check
**Project root:** `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system`

---

## Manifest schema (W1 output — consumed by W2, W3, W4)

W1 writes `library/manifest.json` via `scripts/build-manifest.mjs`. All other workers read this file; none write to it.

```ts
// viewer/lib/types.ts — W1 adds these types
export type ManifestEntry = {
  source: string               // e.g. "21st-dev"
  name: string                 // slug
  displayName: string
  description: string
  platform: 'Mobile' | 'Desktop' | 'Mixed'
  tags: string[]
  files: string[]
  addedAt?: string             // ISO, from _provenance.fetchedAt or mtime
  relativePath: string         // "library/{source}/{slug}/"
  folderPath: string           // absolute
  readmePath: string           // absolute
  preview?: {
    width?: number
    height?: number
    background?: string
    interactive?: boolean
    renderable?: boolean
    reason?: string
  }
  thumbnail?: string | null    // "/thumbnails/{source}/{slug}.png" or null — W3 populates
  hasThumbnail: boolean        // convenience flag for W3
}

export type ManifestFacet = { value: string; count: number }

export type Manifest = {
  generatedAt: string          // ISO
  schemaVersion: 1
  total: number                // total renderable components
  components: ManifestEntry[]  // sorted by `${source}/${name}`
  facets: {
    sources: ManifestFacet[]   // sorted desc by count
    tags: ManifestFacet[]      // sorted desc by count
    platforms: ManifestFacet[]
  }
}
```

`viewer/lib/registry.ts` (MODIFY, owned by W1) exposes:
- `getManifest(): Manifest` — synchronous `JSON.parse(readFileSync(manifest))` memoized per-process
- `getAllComponents(): ComponentEntry[]` — returns `manifest.components` mapped to `ComponentEntry` (back-compat wrapper)
- `getComponent(source, name): ComponentEntry | null` — indexed lookup
- `getFilteredComponents(filters: FilterState): { items: ComponentEntry[]; total: number; facets: Manifest['facets'] }` — server-side slice used by W4

`FilterState` is defined by W4 in `viewer/lib/filters.ts` and imported by W1's registry. W1 declares the type signature with a stub `{}` if needed, and W4 replaces it. To avoid the one cross-worker dep, W1 uses a permissive inline type (see W1 contract below).

---

## W1 — Build-time manifest

**Worker:** Haiku
**Why Haiku:** mechanical fs walk + JSON emit, no UI reasoning.

**Files:**
- CREATE `scripts/build-manifest.mjs`
- CREATE `library/manifest.json` (committed)
- MODIFY `viewer/lib/registry.ts` (full rewrite — sync reads from manifest.json)
- MODIFY `viewer/lib/types.ts` (add `ManifestEntry`, `Manifest`, `ManifestFacet` exports; keep existing `ComponentEntry`, `SourceApp`, `PlatformScope` exports untouched in shape)
- MODIFY `package.json` (root `/design-system/package.json` — add `build:manifest` script, `prebuild` hook chaining to it; if root has no package.json, CREATE it with only `scripts` block)
- READ-ONLY `library/**/registry-item.json`

**Blocks:** W2, W3, W4 (all depend on manifest schema being finalized before their verification step; they can START in parallel using the schema contract above).

**Contract with other workers:**
- `getFilteredComponents` accepts a parameter typed as `Partial<{ source: string|null; tags: string[]; platform: string|null; search: string; page: number; pageSize: number }>` — exact `FilterState` type owned by W4, but W1 uses this structural type to avoid import cycles.
- Manifest file path: `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system/library/manifest.json` — all other workers read this path via `getManifest()`; no worker ever imports the raw JSON.

**Acceptance:**
- [ ] `node scripts/build-manifest.mjs` exits 0 and writes `library/manifest.json` with `schemaVersion: 1`, non-empty `components[]`, and populated `facets.sources[]`.
- [ ] `manifest.json` reflects all folders under `library/{source}/{slug}/` that contain a valid `registry-item.json` AND a `demo.tsx` file (primitive-only folders excluded, matching current behavior).
- [ ] `facets.sources` sums to `total`; `facets.tags` is sorted desc by count.
- [ ] `registry.ts` exports remain API-compatible: `getAllComponents()`, `getComponent(source, name)` still return the existing `ComponentEntry` shape (plus new optional `thumbnail` + `hasThumbnail` fields).
- [ ] `getManifest()` and `getFilteredComponents()` are new exports.
- [ ] No filesystem walks at request time — `registry.ts` uses only `readFileSync(manifest)` cached in module scope.
- [ ] `npm run build` in `viewer/` succeeds.
- [ ] Cold `await getAllComponents()` (simulated via `time node -e 'require("./viewer/lib/registry.ts")...'` or the build-time benchmark) completes in <50ms for current 21 components and <200ms with a synthetic 5,300-component manifest (verifier generates a fake manifest to test).
- [ ] Running `scripts/build-manifest.mjs` twice is idempotent (same output).

**Risk:** Stale manifest if a component is added without regenerating.
**Mitigation:** W1 adds `prebuild` npm script hook + a console warning in `getManifest()` when `manifest.generatedAt` is missing or older than any `registry-item.json` mtime sampled. Also document in script header: "Re-run after any `library/` change".

**Worker prompt:**
> You are a Haiku worker. Working directory: `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system`. Your isolated worktree is already created.
>
> Task: Implement W1 of Phase 1 per `.claude/plans/PHASE_1_TASK_BOARD.md`. Build a manifest generator that eliminates per-request filesystem walks in the viewer.
>
> 1. Create `scripts/build-manifest.mjs` (ESM Node script, no deps beyond `fs/promises` + `path`) that walks `library/{source}/{slug}/registry-item.json`, filters to components with a `demo.tsx` file, and emits `library/manifest.json` matching the `Manifest` type in the task board (schemaVersion 1, sorted components, built facets for sources/tags/platforms).
> 2. Run the script to generate `library/manifest.json` and commit it.
> 3. Rewrite `viewer/lib/registry.ts` to read the manifest synchronously via `readFileSync` + memoize in module scope. Preserve the existing `getAllComponents()` and `getComponent()` signatures (return `ComponentEntry[]`). Add new exports: `getManifest()`, `getFilteredComponents(filters)`.
> 4. Extend `viewer/lib/types.ts` with `ManifestEntry`, `Manifest`, `ManifestFacet` types. Do NOT modify the existing `ComponentEntry`, `SourceApp`, or `PlatformScope` shapes — only add optional `thumbnail?: string | null` and `hasThumbnail?: boolean` fields to `ComponentEntry`.
> 5. Add `build:manifest` + `prebuild` scripts to the root `package.json` (create if missing).
> 6. Run `cd viewer && npm run build` — must exit 0.
> 7. Do NOT touch `viewer/components/*`, `viewer/app/page.tsx`, or any file not listed under your W1 file scope.
>
> When done, return exactly: `[STATUS: AWAITING QA] W1 — manifest generator + registry.ts sync rewrite complete. Manifest has N components.` Do not dump code into the response.

---

## W2 — Virtualized grid

**Worker:** Sonnet
**Why Sonnet:** layout preservation (Recently Added rail + responsive 3-col) + virtualization library integration is non-trivial UI work.

**Files:**
- MODIFY `viewer/components/ComponentGrid.tsx` (full rewrite — swap grid for `@tanstack/react-virtual`)
- MODIFY `viewer/package.json` (add `@tanstack/react-virtual` dep)
- MODIFY `viewer/package-lock.json` (regenerated by `npm install`)
- READ-ONLY `viewer/lib/registry.ts`, `viewer/lib/types.ts` (consumes W1 output)
- READ-ONLY `viewer/components/Card.tsx` (W3 owns, W2 only calls it)

**Depends on:** W1 types landed (for `ManifestEntry`/`ComponentEntry` with optional thumbnail).

**Contract:**
- Props stay the same: `{ components: ComponentEntry[] }`. The parent (`page.tsx`, owned by W4) passes a pre-filtered list. W2 does NOT implement source/tag filtering logic — only local search-over-visible if needed, but prefer moving search to URL param (W4's job).
- If `components.length <= 60`, render as a plain grid (no virtualizer overhead). Above 60, use virtualization.
- Preserve Recently Added rail (top 6 when no filter active). The "no filter active" signal is now `components.length === manifest.total`.

**Acceptance:**
- [ ] `@tanstack/react-virtual` is in `dependencies` (exact version pinned).
- [ ] `ComponentGrid` renders only cards whose estimated rect intersects the viewport (check via DOM node count: visible cards ≤ 30 at 1080p when `components.length = 1000`).
- [ ] Scroll from top to bottom of a 1000-item synthetic list maintains ≥50fps (verifier measures via Playwright's `page.evaluate` performance marks; 60fps is aspirational, 50fps is the hard gate).
- [ ] Recently Added rail still renders when `activeSource === null && !search.trim()`.
- [ ] 3-column responsive grid at `lg` breakpoint preserved; 2-column at `md`; 1-column below.
- [ ] No layout shift when scrolling (cards have fixed aspect 4:3 + title row height).
- [ ] `npm run build` in `viewer/` succeeds.
- [ ] Keyboard focus + link navigation still work (Tab through cards opens detail via Enter).

**Risk:** Virtualized lists with variable row heights cause janky scroll; Recently Added rail + header disrupt the virtualizer's linear offset math.
**Mitigation:** Use `react-virtual`'s grid mode with fixed estimated size (aspect 4:3 + title = ~280px at `lg`). Recently Added rail stays OUTSIDE the virtualizer (plain grid, always 6 cards max). Header/breadcrumb stay outside. Only the main filtered grid is virtualized.

**Worker prompt:**
> You are a Sonnet worker. Working directory: `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system`. Your isolated worktree is already created.
>
> Task: Implement W2 of Phase 1 per `.claude/plans/PHASE_1_TASK_BOARD.md`. Replace the plain grid in `ComponentGrid.tsx` with a virtualized grid using `@tanstack/react-virtual` so that rendering 5,000+ components stays smooth.
>
> 1. `cd viewer && npm install @tanstack/react-virtual` — pin the latest stable.
> 2. Rewrite `viewer/components/ComponentGrid.tsx`:
>    - Keep props `{ components: ComponentEntry[] }`.
>    - Keep Recently Added rail, sidebar mount, breadcrumb, and count display exactly as-is.
>    - For the main grid only (not the rail): if `components.length > 60`, use `useVirtualizer` with grid layout (compute column count from container width, row height from card aspect 4:3 + title row ≈ 280px).
>    - If `components.length <= 60`, render the existing plain grid.
>    - Search and activeSource state: keep them client-side for now (W4 will migrate to URL params — do not preempt that work).
> 3. Do NOT modify `Card.tsx`, `Sidebar.tsx`, `page.tsx`, `registry.ts`, or any file outside your W2 scope.
> 4. Run `cd viewer && npm run build` — must exit 0.
> 5. Manually verify by adding a synthetic filter path: temporarily test with a fake 1000-component array (via devtools) — confirm only ~30 cards in the DOM.
>
> When done, return exactly: `[STATUS: AWAITING QA] W2 — virtualized grid complete. Plain grid preserved below 60 components.` Do not dump code.

---

## W3 — Lazy preview + thumbnails

**Worker:** Sonnet
**Why Sonnet:** Playwright scripting + hover-to-upgrade iframe UX + git-lfs setup needs judgment.

**Files:**
- MODIFY `viewer/components/Card.tsx` (replace iframe-always with static-png → iframe-on-hover)
- CREATE `scripts/generate-thumbnails.mjs` (Playwright-based)
- CREATE `viewer/public/thumbnails/.gitkeep` (only directory marker W3 writes; actual PNGs live under `library/{source}/{slug}/preview.png` and are symlinked/copied into public at build time OR served by a Next.js rewrite)
- MODIFY `.gitattributes` (add `library/**/*.png filter=lfs diff=lfs merge=lfs -text`)
- CREATE `docs/thumbnails.md` (brief: how to regenerate, how LFS is set up)
- READ-ONLY `library/{source}/{slug}/preview.png` — PNG outputs are data, not code; W3 generates them as part of its run but they're not "source files" tracked in the file-scope overlap check.

**Depends on:** W1 manifest schema (uses `manifest.components` to iterate; writes `thumbnail` + `hasThumbnail` back via a manifest patch step — implemented as a post-step in `generate-thumbnails.mjs` that re-invokes `scripts/build-manifest.mjs`).

**Contract:**
- Thumbnail path convention: `library/{source}/{slug}/preview.png` (colocated with the component per ARCHITECTURE.md line 36 — already listed as OPTIONAL).
- Served via a Next.js rewrite `/_thumb/{source}/{slug}.png` → file-system read, OR via a symlink `viewer/public/thumbnails/{source}__{slug}.png`. W3 picks ONE; recommend rewrite via `next.config.ts`. **BUT** `next.config.ts` is not in W3's scope — so W3 uses Option B: a build step inside `generate-thumbnails.mjs` that copies/symlinks PNGs into `viewer/public/thumbnails/`. This keeps W3 from touching `next.config.ts`.
- Card behavior: show `<img src={thumbnail} loading="lazy">` by default. On hover (desktop) or when card is focused, swap to the existing iframe. On touch devices, keep the img until click → detail page.

**Acceptance:**
- [ ] `node scripts/generate-thumbnails.mjs --concurrency=4` completes for all 21 current components and writes `library/{source}/{slug}/preview.png` (1200×900, cropped to 4:3).
- [ ] Script is idempotent: skips components whose `preview.png` exists AND is newer than `registry-item.json`.
- [ ] `.gitattributes` includes `library/**/*.png filter=lfs` entry.
- [ ] `Card.tsx` renders `<img>` by default, swaps to iframe on `onMouseEnter` (debounced 150ms) / `onFocus`; on mouse leave, unmounts the iframe.
- [ ] When `component.hasThumbnail === false`, Card falls back to the current iframe-always behavior (no regression for components without screenshots yet).
- [ ] Initial DOM of home page at `localhost:3005` with 1000 synthetic components has ZERO `<iframe>` elements before user interaction (verifier asserts via Playwright `page.locator('iframe').count()` → 0).
- [ ] `npm run build` in `viewer/` succeeds.
- [ ] `git lfs ls-files` shows the new PNGs tracked under LFS.

**Risk:**
1. Playwright browser download on first run adds 5+ min. Mitigation: script checks for existing playwright cache; print installation hint if missing.
2. Hover-to-iframe spam creates/destroys iframes rapidly. Mitigation: 150ms debounce before mount; 500ms delay before unmount so quick cursor movement doesn't flash.
3. Git LFS must be installed on the dev machine. Mitigation: `docs/thumbnails.md` documents `git lfs install` prerequisite; script prints warning if `git lfs --version` fails.

**Worker prompt:**
> You are a Sonnet worker. Working directory: `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system`. Your isolated worktree is already created.
>
> Task: Implement W3 of Phase 1 per `.claude/plans/PHASE_1_TASK_BOARD.md`. Replace the iframe-per-card default with lazy static PNG thumbnails generated by Playwright.
>
> 1. Create `scripts/generate-thumbnails.mjs`: launches Playwright Chromium, iterates the components listed in `library/manifest.json` (W1 output), navigates to `http://localhost:3005/preview/{source}/{slug}` (assumes the viewer dev server is already running — script prints clear error if port 3005 unreachable), takes a 1200×900 screenshot, saves to `library/{source}/{slug}/preview.png`. Concurrency via `--concurrency=N` flag (default 4). Idempotent (skip if PNG newer than registry-item.json). After all screenshots, invoke `node scripts/build-manifest.mjs` to refresh thumbnail metadata.
> 2. Modify `viewer/components/Card.tsx`: render `<img src="/thumbnails/{source}__{slug}.png" loading="lazy">` when `component.hasThumbnail`. On hover (150ms debounce) or focus, mount the iframe over the img. On blur/mouseleave (500ms delay), unmount. Fallback to current iframe-always behavior when `!component.hasThumbnail`.
> 3. Update `.gitattributes` — add `library/**/*.png filter=lfs diff=lfs merge=lfs -text`. Run `git lfs install` if not already.
> 4. Create `viewer/public/thumbnails/.gitkeep` and have the thumbnail script copy/symlink PNGs into `viewer/public/thumbnails/{source}__{slug}.png` so Next can serve them from `/thumbnails/...` statically.
> 5. Create `docs/thumbnails.md` documenting: prerequisites (git lfs, playwright), how to run, idempotency, where files land.
> 6. Do NOT modify `ComponentGrid.tsx`, `Sidebar.tsx`, `page.tsx`, `registry.ts`, `types.ts`, or `next.config.ts`.
> 7. Run thumbnail generation for the current 21 components, then `cd viewer && npm run build`.
>
> When done, return exactly: `[STATUS: AWAITING QA] W3 — lazy thumbnails complete. N PNGs generated, iframe-on-hover wired.` Do not dump code.

---

## W4 — Server-side facets + URL-param filtering

**Worker:** Haiku
**Why Haiku:** mechanical URL-param plumbing + server-side slice.

**Files:**
- MODIFY `viewer/app/page.tsx` (read `searchParams`, call `getFilteredComponents(filters)`, pass filtered slice + facets to `ComponentGrid`)
- MODIFY `viewer/components/Sidebar.tsx` (source filter buttons become `<Link href="?source=...">` instead of `onSourceFilter` callback; receive `sourceCounts` from server via props)
- CREATE `viewer/lib/filters.ts` (exports `FilterState` type, `parseFilters(searchParams)`, `filterComponents(all, filters)`, `buildFacets(all)`)
- READ-ONLY `viewer/lib/registry.ts`, `viewer/lib/types.ts` (W1)
- READ-ONLY `viewer/components/ComponentGrid.tsx` (W2 — W4 only changes the PROPS passed in, not the component itself)
- READ-ONLY `viewer/components/Card.tsx` (W3)

**Depends on:** W1 manifest (for `getFilteredComponents`).

**Contract with W2:**
- W2's `ComponentGrid` props stay `{ components: ComponentEntry[] }`. W4 passes a pre-filtered server-side slice.
- W4 removes the client-side `useState` for `activeSource` from `ComponentGrid` — **this requires a coordinated edit**. To preserve zero-overlap, W4 does NOT edit `ComponentGrid.tsx`. Instead, W2 keeps its client state but it becomes a no-op when the server already filtered. Post-merge cleanup (removing dead client state) is a follow-up task, not a Phase 1 blocker.
- Bottom line: Phase 1 ends with filters working at BOTH layers (server pre-filters, client still has its state but receives already-filtered data). Phase 1 verifier confirms URL params work end-to-end. Cleanup of the dead client filter state is explicitly out of scope for Phase 1 (tracked as tech debt).

**Acceptance:**
- [ ] `viewer/lib/filters.ts` exports `FilterState = { source: string|null; tags: string[]; platform: string|null; search: string; page: number; pageSize: number }`.
- [ ] `parseFilters(searchParams)` handles: `?source=21st-dev`, `?tag=animated&tag=toast` (array), `?q=search`, `?page=2`, `?platform=Mobile`. Unknown params ignored. Invalid values (e.g. `page=-1`) clamp to defaults.
- [ ] `page.tsx` reads `searchParams` prop (Next 15 pattern), calls `getFilteredComponents(parseFilters(searchParams))`, passes `{ components: filteredSlice }` to `ComponentGrid`. Default `pageSize: 120`.
- [ ] Sidebar source buttons are now `<Link>` elements to `?source=...`; clicking one navigates (no client re-render storm). Active source visually highlighted based on current URL (Sidebar reads current pathname/searchParams via `usePathname`/`useSearchParams`).
- [ ] Visiting `/?source=21st-dev` on the server returns HTML with ONLY 21st-dev components (verifier asserts via `curl localhost:3005/?source=21st-dev | grep -c "component-card"` matches the filtered count, not total).
- [ ] `/?page=2&pageSize=50` returns components 51-100.
- [ ] `npm run build` in `viewer/` succeeds.
- [ ] No regression: `/` (no params) still shows all components, Recently Added rail, search box works.

**Risk:**
1. Next 15 `searchParams` is async (Promise). Mitigation: `page.tsx` becomes `async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string|string[]|undefined>> })` and awaits it.
2. Sidebar currently drives state via callback props; switching to URL params means Sidebar no longer needs `onSourceFilter`/`onSearchChange` callbacks. Mitigation: W4 keeps the prop signatures (pass no-op functions from server) so W2's `ComponentGrid` which passes callbacks doesn't break. Sidebar internally uses `<Link>` for navigation; callbacks fire but are no-ops. Post-Phase-1 cleanup removes the dead callbacks.

**Worker prompt:**
> You are a Haiku worker. Working directory: `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system`. Your isolated worktree is already created.
>
> Task: Implement W4 of Phase 1 per `.claude/plans/PHASE_1_TASK_BOARD.md`. Move filter state from client into URL search params and server-side filter the component list before it reaches the grid.
>
> 1. Create `viewer/lib/filters.ts` exporting `FilterState`, `parseFilters(searchParams)`, `filterComponents(all, filters)`, `buildFacets(all)`. See task board for exact `FilterState` shape and parsing rules.
> 2. Rewrite `viewer/app/page.tsx` to:
>    - Accept `searchParams: Promise<...>` prop (Next 15 async pattern).
>    - Await and parse via `parseFilters`.
>    - Call `getFilteredComponents(filters)` from `@/lib/registry` (provided by W1).
>    - Pass the filtered slice to `<ComponentGrid components={...} />`.
> 3. Modify `viewer/components/Sidebar.tsx`:
>    - Source items become `<Link href="/?source=...">` instead of `onSourceFilter` callbacks. Active item read from `useSearchParams()`.
>    - Search input becomes a `<form>` with GET method targeting `/?q=...`, OR controlled input that pushes to router on debounced change.
>    - Keep all existing `Props` fields (`sourceCounts`, `activeSource`, `onSourceFilter`, `onSearchChange`, `searchValue`) for back-compat; accept but don't rely on callbacks.
> 4. Do NOT modify `ComponentGrid.tsx`, `Card.tsx`, `registry.ts`, or `types.ts`.
> 5. Run `cd viewer && npm run build`.
> 6. Test: `curl localhost:3005/?source=21st-dev` returns a page with only 21st-dev cards.
>
> When done, return exactly: `[STATUS: AWAITING QA] W4 — URL-param filters + server slice complete. /?source=X works.` Do not dump code.

---

## Zero-overlap audit

| File | W1 | W2 | W3 | W4 |
|---|---|---|---|---|
| `scripts/build-manifest.mjs` | CREATE | — | — | — |
| `scripts/generate-thumbnails.mjs` | — | — | CREATE | — |
| `library/manifest.json` | CREATE | — | — | — |
| `library/**/preview.png` | — | — | CREATE (data) | — |
| `viewer/lib/registry.ts` | MODIFY | RO | RO | RO |
| `viewer/lib/types.ts` | MODIFY | RO | RO | RO |
| `viewer/lib/filters.ts` | — | — | — | CREATE |
| `viewer/components/ComponentGrid.tsx` | — | MODIFY | — | RO |
| `viewer/components/Card.tsx` | — | RO | MODIFY | RO |
| `viewer/components/Sidebar.tsx` | — | — | — | MODIFY |
| `viewer/app/page.tsx` | — | — | — | MODIFY |
| `viewer/package.json` | — | MODIFY | — | — |
| `viewer/package-lock.json` | — | MODIFY | — | — |
| `viewer/public/thumbnails/.gitkeep` | — | — | CREATE | — |
| `.gitattributes` | — | — | MODIFY | — |
| `package.json` (root) | MODIFY/CREATE | — | — | — |
| `docs/thumbnails.md` | — | — | CREATE | — |

**No file has two workers with non-RO access.** Clean.

---

## Dependency graph

```
         W1 (manifest + types)
        / | \
       /  |  \
      W2  W3  W4
       \  |  /
        \ | /
         MERGE → VERIFIER
```

W1 MUST complete first OR its schema contract (above) MUST be frozen before W2/W3/W4 start. Since the schema is defined in this task board, W2/W3/W4 can start in parallel against the contract; they just can't RUN the verifier until W1's branch is merged first (manifest file must exist on their branch for integration testing).

**Merge order:** W1 → W4 → W2 → W3. Rationale:
1. W1 first — everyone needs the manifest.
2. W4 next — server-side filtering gives us a stable props contract for W2.
3. W2 — virtualization relies on stable filtered input.
4. W3 — thumbnails regenerate the manifest at the end, so doing it last avoids re-merging `manifest.json`.

---

## Verifier checklist (Phase 1 gate — single Haiku verifier runs after all 4 workers merge)

- [ ] `cd viewer && npm install` clean (lockfile has `@tanstack/react-virtual`).
- [ ] `node scripts/build-manifest.mjs` exits 0, `library/manifest.json` exists.
- [ ] `cd viewer && npm run build` exits 0, no type errors printed beyond the existing `ignoreBuildErrors` noise.
- [ ] Generate synthetic 1000-entry manifest (script: duplicate current entries 50×) and confirm `curl localhost:3005/ | wc -c` returns HTML under 500KB and responds in <500ms (cold).
- [ ] Playwright check: `page.goto('/')` → `page.locator('iframe').count()` → **0** before interaction.
- [ ] Playwright check: hover a card → iframe appears within 300ms.
- [ ] Playwright check: scroll the grid with 1000 synthetic components, measure `performance.getEntriesByType('frame')` → average frame time <20ms (≥50fps).
- [ ] `curl localhost:3005/?source=21st-dev` returns filtered HTML.
- [ ] `curl localhost:3005/?page=2&pageSize=50` returns a different slice.
- [ ] `git lfs ls-files` includes the thumbnail PNGs.
- [ ] Sidebar clicks navigate (check by asserting URL changes).
- [ ] Recently Added rail still renders on `/` with no params.

**On any FAIL:** verifier writes `.claude/feedback/phase_1_Wn_fixes.md` with the failing criterion + repro command + relevant file excerpt, returns `[STATUS: REJECTED]` for that specific workstream, orchestrator relaunches the failing worker.

**On ALL PASS:** merge to `dev`, close Phase 1, unblock Phase 2.
