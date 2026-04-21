# Raw Component Bank

**Mode: Museum. Read-only. Do not edit.**

**Platform: Mobile-only.** All harvested components in this directory were browsed and curated on a mobile viewport. Assume mobile-first Tailwind classes unless a component's own README says otherwise.

---

## Purpose

Raw harvest bank. Components preserved verbatim with broken imports intentionally intact. Treat as a reference archive — don't edit directly, only reference or promote upward.

---

## Structure

```
_raw/
  lumelle/     # Harvested from Lumelle app (15 components)
  ...          # Future: restaurant-app-solo/, isso-dashboard/, etc.
```

Each subfolder may have its own README (Lumelle components already documented per-folder).

---

## Usage Rules

1. **Anything in `_raw/` is NOT production-ready.** Broken imports, app-specific paths, and hardcoded dependencies are expected.
2. **To use a component:** promote it to `primitives/`, `composites/`, or `systems/` with adapter wiring.
3. **Never edit files in `_raw/` directly.** Changes belong in the promoted tier folder.
4. **Provenance is permanent.** The original copy stays here forever as the source of truth.

---

## Promotion Workflow

1. Copy component from `_raw/{app}/` to target tier
2. Strip `@/` imports and app-specific paths
3. Wire adapters (auth, cart, image, etc.) per tier rules
4. Update `PROVENANCE.md` status column
