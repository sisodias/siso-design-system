# Curation Sets — Tag-Based Replacement for `importMode`

**Status:** design · **Date:** 2026-04-23
**Scope:** Replace the binary `_provenance.importMode = "curated" | "bulk"` with multi-tag curation. Enables set-based curation (SaaS kit, e-commerce kit, reference-only, auto-hidden, per-project).

---

## Data model

Every component gets `_provenance.curationTags: string[]`. Empty = not curated. Tags are lowercase kebab-case.

**Predefined core tags:**
- `keeper` — general good component
- `featured` — top tier (auto-assigned at elo>1500+20 votes)
- `solid` — reliable medium-tier
- `experimental` — cool but risky
- `reference-only` — good example, not for implementation
- `auto-hidden` — low Elo, hidden from default grid
- `rejected-YYYY-MM` — auto-dated rejection marker

**Theme sets:** `minimalist-set`, `glassmorphism-set`, `dark-set`, `neobrutalism-set`
**Industry sets:** `saas-set`, `fintech-set`, `e-commerce-set`, `creator-tools-set`
**Project sets:** `for-isso-dashboard`, `for-agency-landing` (Shaan-defined, free-form)

**Backward compat:**
- Old `importMode === "curated"` migrates to `curationTags: ["keeper"]`
- Old `importMode === "bulk"` migrates to `curationTags: []`
- Derived `importMode` kept for one release: `curationTags.includes("keeper") ? "curated" : "bulk"` — then removed in v2

---

## Where tags live

**Source of truth:** `registry-item.json` `_provenance.curationTags`.

**Manifest:** denormalized into `ManifestEntry.curationTags: string[]` at build time.

**SQLite (`ratings.db`), for fast mutations:**

```sql
CREATE TABLE component_tags (
  source           TEXT NOT NULL,
  slug             TEXT NOT NULL,
  tag              TEXT NOT NULL,
  added_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source_of_truth  TEXT DEFAULT 'manual',  -- 'manual' | 'auto-elo' | 'auto-love-swipe'
  PRIMARY KEY (source, slug, tag)
);

CREATE INDEX idx_tags_tag ON component_tags(tag);
```

**Sync:** Writes hit SQLite first (instant UI feedback). `scripts/build-manifest.mjs` merges SQLite tags INTO `registry-item.json` on next run (writable source of truth + committable snapshot). On conflict between SQLite and disk, SQLite wins (it's more recent).

---

## Sidebar UX (new facet)

Add a collapsible section below existing facets:

```
┌──────────────────────────┐
│ CURATION TAGS        ∧   │
│ ─────────────────────    │
│ ☐ keeper          (87)  │
│ ☐ featured        (14)  │
│ ☐ solid           (42)  │
│ ☐ reference-only  (7)   │
│ ☑ saas-set        (23)  │  ← active
│ ☐ fintech-set     (11)  │
│ ☐ glassmorphism-set (18)│
│ (more...)                │
│                          │
│ EXCLUDE                  │
│ ☐ auto-hidden     (8)   │
│ ─────────────────────    │
│ [Clear tag filters]      │
└──────────────────────────┘
```

URL state: `?tag=saas-set&tag=keeper` (OR), `?requireAllTags=1` (switch to AND), `?excludeTag=auto-hidden`.

---

## Detail page tag editor

Bottom of `/component/[source]/[name]`:

```
Tags: [keeper ✕] [saas-set ✕] [featured ✕]
┌────────────────────────────┐
│ Add tag: _____________     │ (autocomplete from existing)
└────────────────────────────┘
```

POST `/api/tags/add` on submit. Autocomplete queries `GET /api/tags`.

---

## Swipe keyboard shortcuts (replacing current Elo-only behavior)

In `viewer/app/rate/swipe/SwipeRater.tsx`:
- `→` Keep: adds `keeper` tag (source: `auto-love-swipe` if first `keeper`, else manual)
- `↑` Love: adds `keeper` + `featured` tags
- `←` Skip: adds `rejected-YYYY-MM` tag (auto-dated current month)
- `Shift + →` prompts for custom tag name → adds that + `keeper`

All still hit Elo via existing compare/swipe API; tag writes are a parallel concern.

---

## Filter semantics

Extend `FilterState`:

```ts
curationTags?: string[]       // OR within (match ANY of these)
requireAllTags?: boolean      // switch OR → AND
excludeTags?: string[]        // never match any of these
```

`getFilteredComponents` (in registry.ts) adds after existing filters:

```
if (curationTags?.length) {
  filtered = requireAllTags
    ? filtered.filter(c => curationTags.every(t => c.curationTags.includes(t)))
    : filtered.filter(c => curationTags.some(t => c.curationTags.includes(t)))
}
if (excludeTags?.length) {
  filtered = filtered.filter(c => !excludeTags.some(t => c.curationTags.includes(t)))
}
```

**BC for "Curated only" toggle:** Sidebar's existing mode switch → `?tag=keeper` under the hood. Existing `?mode=curated` URLs redirect to `?tag=keeper`.

---

## Auto-tagging rules (replaces current Elo > 1400 promotion)

Run on every rating write (in `recordSwipe` / `recordComparison`):

- `effective_elo > 1350` AND `votes >= 10` AND last-rated within 90 days → add `keeper` (source: `auto-elo`)
- `effective_elo > 1500` AND `votes >= 20` AND last-rated within 60 days → add `featured` (source: `auto-elo`)
- `effective_elo < 1050` AND `votes >= 10` → add `auto-hidden` (source: `auto-elo`)
- 3+ `love` swipes → add `keeper` (source: `auto-love-swipe`)

**Manual tags always override auto.** Auto-rules never remove manual tags. If a manual `keeper` exists, auto-hidden rule does NOT fire.

---

## API endpoints

```
GET  /api/tags                      → { tags: [{ name, count }], ... }  sorted desc by count
POST /api/tags/add                  body: { source, slug, tag }
POST /api/tags/remove               body: { source, slug, tag }
POST /api/tags/bulk                 body: { source, slug, add?: [...], remove?: [...] }
GET  /api/tags/[tag]                → list of components with this tag
```

All writes synchronous to SQLite. Return the component's updated tag set so the UI can re-render immediately.

---

## Dashboard routes

- `/tags` — index. Top 30 tags by count. Click any → `/tags/[tag]`.
- `/tags/[tag]` — all components with the tag. Filter bar reused from home page.
- Recent tag activity sidebar: last 20 adds/removes, linkable.

---

## Migration plan

**One-shot script:** `scripts/migrate-curation-tags.mjs`.

Reads every `registry-item.json`. For each:
- `_provenance.importMode === "curated"` → set `_provenance.curationTags = ["keeper"]`
- Else → set `_provenance.curationTags = []`

Writes back. Emits summary:

```
[migrate-curation-tags] Done.
  scanned: 2223
  migrated-to-keeper: 21
  migrated-to-empty: 2202
  already-had-tags: 0
```

Run once. Idempotent on re-run (detects existing `curationTags` and skips).

---

## Implementation plan (Haiku worker)

- CREATE `scripts/migrate-curation-tags.mjs`
- MODIFY `viewer/lib/ratings.ts` — SQLite schema + `addTag` / `removeTag` / `bulkTags` / `listTagsByFrequency` / `listComponentsByTag` helpers
- MODIFY `viewer/lib/registry.ts` — `getFilteredComponents` honors curationTags / excludeTags
- MODIFY `viewer/lib/filters.ts` — parseFilters reads `?tag=`, `?excludeTag=`, `?requireAllTags=1`
- MODIFY `viewer/lib/types.ts` — `ManifestEntry.curationTags`, `ComponentEntry.curationTags`
- MODIFY `scripts/build-manifest.mjs` — merge SQLite tags into registry-item.json (if SQLite newer) + emit into manifest
- CREATE `viewer/app/api/tags/route.ts` + `add/route.ts` + `remove/route.ts` + `bulk/route.ts` + `[tag]/route.ts`
- MODIFY `viewer/components/Sidebar.tsx` — new facet section per ASCII mock
- CREATE `viewer/app/tags/page.tsx` + `viewer/app/tags/[tag]/page.tsx`
- MODIFY `viewer/app/rate/swipe/SwipeRater.tsx` — call tag API on swipe actions
- MODIFY `viewer/app/component/[source]/[name]/page.tsx` — add tag editor panel

Rough: ~800 LOC total. 1 day Haiku.

---

## Acceptance criteria

1. `POST /api/tags/add {source:"21st-dev", slug:"notification", tag:"keeper"}` → 200 + SQLite row present
2. `GET /api/tags` returns list sorted desc by count
3. `/?tag=keeper&mode=all` filters to only tagged components
4. `/?tag=keeper&tag=saas-set` returns OR-union; `?requireAllTags=1` switches to AND
5. `/?excludeTag=auto-hidden` removes those from results
6. `/rate/swipe` + arrow-up → both `keeper` and `featured` added
7. Migration script: 21 existing curated components end with `curationTags: ["keeper"]`; 2,202 bulk end with empty array
8. `build-manifest.mjs` reads SQLite + merges into `registry-item.json` + regenerates manifest
9. `/tags` page shows top 30 tags
10. `/tags/keeper` lists all keeper-tagged components

---

## What this doesn't change

- Elo math (see `RATING_MATH_DESIGN.md`)
- Classification fields (category, visualStyle, etc. — separate from curation tags)
- Search / facet infra (additive only)
- Existing "curated" in the UI (redirected, not broken)
