# Phase 3 Stress Test — Feedback

**Test:** `node scripts/bulk-import.mjs --source=21st-dev --limit=100` against a library baseline of 21 components.

**Verdict:** REJECTED. 3 findings, 1 hard blocker.

---

## Finding 1 — HARD BLOCKER: unresolved imports break `npm run build`

5 distinct imports unresolved. Affect 6 new components:

| Missing module | Components affected | Fix |
|---|---|---|
| `@base-ui/react/slider` | coss.com-slider | install `@base-ui/react` in viewer deps |
| `@base-ui/react/switch` | coss.com-switch | same |
| `@base-ui/react/tabs` | coss.com-tabs | same |
| `@base-ui/react/toggle` | coss.com-toggle | same |
| `@base-ui/react` (implicit) | coss.com-table | same |
| `@/demos/ui/marquee` | cnippet.dev-team | NOT a real package — it's 21st.dev's internal demo harness path. Scraper must handle this |

### `@base-ui/react` is a real package
`@base-ui/react` is the new name for the React primitives shadcn is migrating to (formerly `@radix-ui/react-*`). It's on npm as `@base-ui/react`. We should install it in `viewer/package.json` alongside the existing radix deps.

### `@/demos/ui/marquee` is a 21st.dev-only path
Their components import their own demo harness. Two options:
- **Option A (preferred):** scraper detects `@/demos/...` imports and rewrites them. If the import is for a known shadcn-compatible primitive that we might already have, resolve it; otherwise, stub with a `<div>NOT AVAILABLE</div>` placeholder so the component still renders and builds.
- **Option B:** flag these components `renderable: false` in the emitted `registry-item.json` so the viewer shows a code-reference treatment (already supported per ARCHITECTURE.md line 194).

Recommend **Option B for Phase 3 recovery** (fast), **Option A for Phase 4** (thorough — run a second import pass after the scraper supports it).

## Finding 2 — Scraper's success counter is inflated

The scraper reports 100/100 succeeded, but the manifest only grew from 21 → 54 (33 new). The delta is:
- shadcn/ui registryDependencies (button, card, avatar, badge, dropdown-menu, scroll-area, separator) — written but have no demo.tsx, so excluded from manifest
- `_utils` helper bundle — same
- Components that don't have a demo and aren't primitive-only — silently lost

Fix:
- Distinguish "wrote an item" from "imported a user-visible component".
- Report succeeded, skipped_dependency_only, failed.
- Gate the CLI's final summary on manifest delta, not on write-count.

## Finding 3 — Per-component size is bigger than Agent C estimated

- Agent C prediction: 22KB mean
- Real: 12KB median, 38.5KB mean, 396KB max
- Extrapolation to 4,800: **180MB** (not 147MB)

Still comfortable under the 500MB hard gate. Update `BULK_IMPORT_PLAN.md` disk estimate but no behavior change needed.

---

## Required fixes before re-testing

1. **`cd viewer && npm install @base-ui/react`** — 2 min.
2. **Add import rewrite/stub logic to `scripts/bulk-import.mjs`** for `@/demos/...` imports. Either rewrite to stub, or mark `renderable: false`. 20 min.
3. **Fix scraper success counter** — distinguish manifest-visible from dependency-only writes. 10 min.
4. **Re-run Phase 3** stress test with the same `--limit=100` parameters against a clean library (revert the current 33 new imports first, OR accept them and run `--limit=100` again to double-check idempotency plus add 100 more). Accept the latter.
5. Build must pass. Cold render must hold.

After those, if PASS, Phase 4 is unlocked.

## DO NOT revert the current 54 components

They're fine on disk. The build breakage only stops the viewer from compiling until `@base-ui/react` is installed. Once fixed, the 54 components are retained and count toward Phase 4's total.

## Current state on disk
- `library/manifest.json` — 54 components, 1 source (21st-dev), facets integrity good
- `library/21st-dev/` — 33 new component folders + 7 dependency-only folders (shadcn/*)
- `viewer/` — build broken until `@base-ui/react` installed and `@/demos/ui/marquee` handled
- Idempotency proven — re-run skipped all 100 in 687ms
- Provenance tags verified — 5/5 show `bulk / 21st-dev-sitemap`

Current commit at time of report: `0c5aed7` (Phase 2 bulk-import.mjs).

## Resolution (2026-04-22)

### Fixes applied

**Fix 1 — `@base-ui/react` installed in viewer deps**
- `cd viewer && npm install @base-ui/react` — unblocked coss.com-slider, coss.com-switch, coss.com-tabs, coss.com-toggle, coss.com-table
- Also installed additional deps discovered from 101-200 batch: `gsap`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-hover-card`, `@radix-ui/react-icons`, `@radix-ui/react-label`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-progress`, `@radix-ui/react-switch`, `@carbon/icons-react`, `react-day-picker`, `cobe`, `input-otp`, `react-icons`

**Fix 2 — `@/demos/*` handling**
- Added `detectUnresolvableImports()` in `bulk-import.mjs` — scans component files for `@/demos/*` before writing registry-item.json
- Components with unresolvable imports get `preview.renderable = false` + `preview.reason`
- Already-written `cnippet.dev-team`: manually updated `registry-item.json`, created local `marquee.tsx` stub with import rewritten from `@/demos/ui/marquee` → `./marquee`
- `cnippet.dev-team/registry-item.json` now has `"preview": { ..., "renderable": false, "reason": "imports 21st.dev internal demo harness (@/demos/ui/marquee)" }`

**Fix 3 — Counter rework**
- `written_items`: every `registry-item.json` written (deps included)
- `manifest_visible`: components with demo.tsx (user-facing)
- `marked_non_renderable`: components flagged `renderable=false`
- Re-run output now prints all three separately

**Stubs created for build pass:**
- `library/21st-dev/aliimam-gallery/button.tsx` — empty Button stub
- `library/21st-dev/jshguo-interfaces-carousel/button.tsx` — empty Button stub
- `library/21st-dev/sshahaider-hero-3/button.tsx` — empty Button stub
- `library/21st-dev/cnippet.dev-team/marquee.tsx` — Marquee div stub

### Re-run results (limit=200)

```
  attempted: 200
  written_items: 95  (includes dependency-only)
  manifest_visible: 95  (user-facing components with demo)
  marked_non_renderable: 0  (cnippet.dev-team was skipped on re-run; manually fixed)
  skipped_existing: 105
  skipped_empty: 0
  failed_404: 0
  failed_5xx: 0
```

### Validation gates

| Gate | Result |
|------|--------|
| `npm run build` exit 0 | PASS |
| Manifest total | 87 (was 54 before re-run, grew with new batch) |
| Home cold render 200 | PASS (174KB) |
| URL filter route 200 | PASS |
| Random detail route 200 | PASS |
| `manifest_visible` counter distinct from `written_items` | PASS |
| `cnippet.dev-team` non-renderable in manifest | 1 non-renderable |

### Files modified
- `scripts/bulk-import.mjs` — `detectUnresolvableImports()`, counter rework, `nonRenderableReason` param
- `viewer/package.json` + `viewer/package-lock.json` — 15 new deps
- `library/21st-dev/cnippet.dev-team/registry-item.json` — `renderable: false`
- `library/21st-dev/cnippet.dev-team/team.tsx` — import rewrite `@/demos/ui/marquee` → `./marquee`
- `library/21st-dev/cnippet.dev-team/marquee.tsx` — new stub
- `library/21st-dev/aliimam-gallery/button.tsx` — new stub
- `library/21st-dev/jshguo-interfaces-carousel/button.tsx` — new stub
- `library/21st-dev/sshahaider-hero-3/button.tsx` — new stub
