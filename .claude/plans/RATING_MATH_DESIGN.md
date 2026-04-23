# Rating Math Design — Confidence-Aware Bayesian Elo v2

**Status:** design · **Date:** 2026-04-23 · **Author:** Opus (Planner)
**Scope:** Upgrade the existing `ratings.db` + `viewer/lib/ratings.ts` system to produce statistically meaningful effective ratings with confidence intervals, unified swipe math, temporal decay, and tighter promotion rules.

---

## Current system (verified from code)

From `viewer/lib/ratings.ts`:
- K-factor: 32 (pairwise Elo)
- Swipe deltas: `love +20`, `keep +8`, `skip -10`
- Starting Elo: 1200
- Auto-promoted: `elo > 1400 OR action === 'love'`
- Auto-hidden: `elo < 1000`
- Leaderboard sorts by raw `elo DESC`

---

## Decision 1: Confidence model — Approach A (Bayesian shrink)

Chosen: Approach A. Reason: single user, single SQLite file, no distributed rating infrastructure. Glicko-2's RD decay math adds implementation surface area without meaningfully improving signal quality for a sub-10k-vote dataset. Approach A gives 90% of the benefit at 20% of the complexity.

Formula:

```
effective_elo(v, r) = (r * v + 1200 * K_prior) / (v + K_prior)
```

Where `v` = total vote count, `r` = raw Elo, `K_prior = 20`.

At `v = 0`: effective_elo = 1200 (pure prior)
At `v = 20`: effective_elo = (r + 1200) / 2 (halfway to raw)
At `v = 100`: raw contributes 83% weight

Confidence tiers: `low` = v < 5, `medium` = 5–19, `high` = v >= 20.

---

## Decision 2: Unified rating source (swipes as virtual pairwise)

| Swipe action | Notional opponent Elo | Outcome for component |
|---|---|---|
| `skip` | 1100 | Component loses |
| `keep` | 1200 | Component wins against mean |
| `love` | 1350 | Component wins against strong opponent |

Notional opponent Elos are fixed (not rolling averages). Rolling baselines make old and new ratings incomparable across the lifetime of the DB.

Standard Elo update applied with K=32. A `love` on a component at 1200 vs notional-1350 yields +22.5 — close to the current `+20` but now mathematically consistent with pairwise data.

---

## Decision 3: Temporal decay

```
weight(t) = exp(-dt / τ)    where τ = 30 days
```

At dt=0: weight=1.0. At dt=30d: weight≈0.37. At dt=90d: weight≈0.05.

Implementation: `effective_elo_cache` is a materialized column recomputed on every write. At recompute time, pull all comparison and swipe rows for the component, apply `exp(-dt/30)` weighting, replay Elo from 1200, apply Bayesian shrink, write result. No recompute on read — fast path always hits the cache column.

---

## Decision 4: Leaderboard changes

- Primary sort: `effective_elo_cache DESC`
- Tiebreaker: higher vote count
- Display: `Elo (N votes)` — e.g., `1347 (23 votes)` + confidence badge (low/medium/high)
- New column: "Last rated" in days ago
- Filter: "Confident only" toggle (hides `votes < 10`), off by default

---

## Decision 5: Auto-promotion rules

| Outcome | Condition |
|---|---|
| Auto-curated | `effective_elo_cache > 1350` AND `votes >= 10` AND `last_rated within 90 days` |
| Auto-hidden | `effective_elo_cache < 1050` AND `votes >= 10` |
| Auto-featured (new) | `effective_elo_cache > 1500` AND `votes >= 20` AND `last_rated within 60 days` |

`featured` → `_provenance.importMode = 'featured'`. Manual tags always override.

---

## Decision 6: Starting Elo for new components

Stay at 1200 for v2. Category seeding requires Phase 7b classification to be trusted first. Seeding from partially-correct AI classifications before the fleet has run would introduce systematic bias.

---

## DB schema changes

```sql
ALTER TABLE components ADD COLUMN rating_deviation    REAL      DEFAULT 350;
ALTER TABLE components ADD COLUMN last_rated          TIMESTAMP;
ALTER TABLE components ADD COLUMN effective_elo_cache REAL;

CREATE INDEX IF NOT EXISTS idx_components_effective_elo
  ON components (effective_elo_cache DESC);
```

---

## New helpers in `viewer/lib/ratings.ts`

```ts
getEffectiveElo(source, slug): number
getConfidence(source, slug): 'low' | 'medium' | 'high'
recomputeEffectiveElo(source, slug): void    // called on every write
recomputeAll(): void                          // backfill at migration
```

---

## New API endpoint

`GET /api/rate/component/[source]/[slug]`

```json
{
  "elo": 1387,
  "effective_elo": 1341,
  "votes": 23,
  "last_rated": "2026-04-18T14:22:00Z",
  "confidence_tier": "high",
  "rating_deviation": 87
}
```

---

## UI changes (minimal touch)

`viewer/app/rate/leaderboard/page.tsx`: sort by effective_elo_cache, display as `1341 (23)`, add Last rated column, add Confident only toggle, adjust color thresholds.

`viewer/app/rate/swipe/SwipeRater.tsx`: small `Rated 23x` badge below component name.

---

## Migration plan

1. `getDb()` runs ALTER TABLE statements guarded by idempotency checks on first load
2. Immediately calls `recomputeAll()` — populates `effective_elo_cache` for all rated components
3. Auto-promotion re-evaluates all components: a component at `elo = 1401` with 2 votes gets `effective_elo = (1401*2 + 1200*20) / 22 = 1219` — no longer auto-curated (correct behavior)
4. Raw `elo` column preserved as audit trail, never displayed

---

## Acceptance criteria

1. Every component with `votes > 0` has non-null `effective_elo_cache` after migration
2. Leaderboard sorts by `effective_elo_cache`
3. 1 vote at raw 1500 ranks below 30 votes at raw 1450 (effective: ~1345 vs ~1421)
4. Component at `elo = 1401` with 2 votes is no longer auto-curated
5. Swipe events use virtual-opponent Elo formula (not fixed deltas)
6. `last_rated` is set on every write
7. `recomputeAll()` completes under 5 seconds on 1,000-component DB

---

## Out of scope (deferred)

- Glicko-2 full implementation
- ML personalization
- Category-seeded starting Elo (v3, requires trusted Phase 7b classification)
- Vote history sparkline in component detail view
- Multi-user rating support
