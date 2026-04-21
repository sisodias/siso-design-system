# SISO Design System

Multi-app component bank — harvest, organize, and reuse UI across SISO projects.

## Structure

| Folder | Purpose |
|---|---|
| `tokens/{app}/` | Design tokens per source app (colors, type, spacing). Current: `lumelle/` |
| `_raw/{app}/` | Raw component bank. Verbatim copies with broken imports. Museum mode. |
| `_external/{source}/` | 3rd-party components. Current: `21st-dev/` (52 components). |
| `primitives/` | Tier 1 — zero-dep atoms. Drop-in ready. |
| `composites/` | Tier 2 — assembled components, data-free, use ImageAdapter only. |
| `systems/` | Tier 3 — full vertical slices. Use all 5 adapters. |
| `adapters/` | Contracts for auth, cart, analytics, content, image. |

## Two organization axes

1. **By origin** — where components came from: `_raw/{app}/` for SISO-built apps, `_external/{source}/` for 3rd-party.
2. **By maturity** — how plug-and-play: `primitives/` → `composites/` → `systems/`. Promotion requires stripping broken imports and wiring adapters.

A component can exist in both layers simultaneously — raw copy stays in `_raw/lumelle/hero-composition/` forever as reference, polished version lives in `composites/hero-shop/`.

## Harvest → promote workflow

1. **Harvest** — copy whole components/domains from source app into `_raw/{app}/`. Broken imports OK.
2. **Document** — update PROVENANCE.md with source → bank mapping.
3. **Promote (optional)** — pick a keeper to make plug-and-play:
   - Strip `@/` imports
   - Wire adapters for auth/cart/data
   - Move to `primitives/`, `composites/`, or `systems/` based on maturity
4. **Use** — new apps call `configureSisoDesign({ auth, cart, ... })` at root, then import from `primitives/composites/systems/`.

## Current state (2026-04-22)

- **Lumelle harvest complete:** 15 keepers, ~13,000 LOC in `_raw/lumelle/`
- **21st.dev bank imported:** 52 components in `_external/21st-dev/`
- **Restructure shipped:** tier folders live, adapter contracts live, provenance mapped
- **Nothing promoted yet** — everything is still in `_raw/` or `_external/`. Promotion starts next session.

## Platform scope

**All components in `_raw/` are mobile-first.** Every harvested keeper was browsed and greenlit on a mobile viewport. If you drop these into a desktop-first app they will look wrong at larger breakpoints — either scope them to mobile routes or redesign desktop variants as explicit additions.

The `_external/21st-dev/` bank is platform-agnostic (mix of desktop + mobile + responsive components — see each component's original context).

## Related docs

**Start here:**
- [ARCHITECTURE.md](./ARCHITECTURE.md) — how we store, describe, and render components (the 3 building principles + iframe preview contract)
- [CONTRIBUTING.md](./CONTRIBUTING.md) — quick reference for adding a component
- [docs/examples/example-component/](./docs/examples/example-component/) — copy-pasteable reference folder

**Reference:**
- [KEEPERS.md](./KEEPERS.md) — running log of greenlit harvests
- [PROVENANCE.md](./PROVENANCE.md) — every component → source mapping
- [CATALOG.md](./CATALOG.md) — usage-first index: "I'm building X, which components?"
- [ADAPTERS.md](./ADAPTERS.md) — adapter contract spec + wiring recipes

**Legacy (being migrated per ARCHITECTURE.md):**
- [_raw/README.md](./_raw/README.md) — raw bank rules
- [_external/README.md](./_external/README.md) — 3rd-party bank rules

## Philosophy

- **Provenance is sacred.** Every component traces to its source forever.
- **Broken imports are OK in `_raw/`.** They're museum pieces.
- **Promotion is intentional.** Only promote when you actually need it — saves premature abstraction.
- **Adapters are the bridge.** Systems don't know about Clerk, Shopify, or Supabase. They know about the 5 adapter contracts.
