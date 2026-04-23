# DEPLOY_AND_REGISTRY_DESIGN

**Status:** Proposed
**Author:** Opus (planner)
**Date:** 2026-04-23
**Owner on execution:** Haiku worker (single-phase, isolated worktree)
**Supersedes:** nothing (first deploy design for this repo)
**Depends on:** manifest emitted by `scripts/build-manifest.mjs`, shadcn registry-item.json shape already present in every `library/{source}/{slug}/`

---

## 0. Problem statement

The viewer is fully functional on `localhost:3005` with 2,223 components classified and browsable. It has zero external reachability. The entire value proposition — "SISO agents pick components from a shared bank" — is gated on this viewer being public. Until we ship a URL, nothing else in the roadmap (RANKING, COMPOSE, CURATION_SETS, DEDUP) has a consumer.

Secondary problem: every component's on-disk `registry-item.json` is already shadcn-compatible. If we expose them at URLs the shadcn CLI accepts, `npx shadcn@latest add https://<host>/r/{source}/{slug}.json` works today — no custom installer, no wrapper CLI, no auth. The design system becomes a drop-in extension to any shadcn project in the SISO portfolio.

This doc specifies a single Vercel deployment that (a) serves the existing viewer read-only, (b) emits a static `/r/{source}/{slug}.json` tree the shadcn CLI can resolve, (c) disables rating writes in production, and (d) ships behind `siso-design-system.vercel.app` with a path to `design.siso.agency`.

---

## 1. Deploy target: Vercel

**Choice:** Vercel Hobby tier → Pro at $20/mo when traffic or collaborators demand it.

**Rationale (first-principles):** The viewer is Next.js 15 App Router with server components, standalone output, experimental `externalDir`, and a sibling `library/` directory resolved via `path.resolve(__dirname, '..')`. Vercel is the only host where all of these work with zero config edits:

- Cloudflare Pages ships Workers-runtime Next, which breaks on `readFileSync` of `../library/manifest.json` at request time.
- Netlify's Next runtime handles App Router but its monorepo root-directory semantics are clumsier than Vercel's.
- Self-host on Fly.io / Railway adds a Dockerfile, a process manager, SSL provisioning, and a monthly bill for something Vercel gives for free.

**Project config:**

| Field | Value |
|---|---|
| Project name | `siso-design-system` |
| Initial domain | `siso-design-system.vercel.app` (free) |
| Future domain | `design.siso.agency` (CNAME to `cname.vercel-dns.com`) |
| Framework preset | Next.js |
| Root directory | `viewer` (set in Vercel project settings) |
| Install command | `npm install --legacy-peer-deps` |
| Build command | `cd .. && node scripts/build-manifest.mjs && node scripts/emit-registry.mjs && cd viewer && npm run build` |
| Output directory | `.next` (Vercel default for standalone) |
| Node version | 20.x (matches local dev) |
| Environment variables | **None required at runtime.** No API keys, no auth secrets, no DB URLs. All data is pre-built into the manifest. |

**Monorepo-aware tracing.** `viewer/next.config.ts` already sets `outputFileTracingRoot: path.resolve(__dirname, '..')`, which tells Vercel to include `../library/` in the serverless bundle. This is the key line that makes this deploy work. Confirm it is preserved. Add `outputFileTracingIncludes` to explicitly cover manifest + registry files:

```ts
outputFileTracingIncludes: {
  '/**': ['../library/manifest.json', '../library/**/registry-item.json'],
}
```

Without this, Vercel's dependency tracer may omit `library/` siblings that aren't statically analyzable from viewer source.

---

## 2. Public route map

Every existing viewer route keeps its current path under the public domain. Two new route families are introduced.

**Existing routes (unchanged URL shape, now public):**

| Route | Behavior |
|---|---|
| `/` | Grid with facet sidebar, defaults to curated-only |
| `/component/[source]/[name]` | Detail page: live preview + highlighted source + README |
| `/preview/[source]/[slug]` | Bare iframe target used by cards and external embeds |
| `/export` | Cart-to-prompt builder |
| `/rate` | Landing page — renders but rating buttons no-op in prod (see §3) |
| `/rate/leaderboard` | Top 50 by Elo (read-only, pulls from manifest) |
| `/api/components` | Filterable JSON list |
| `/api/components/meta` | Manifest metadata |
| `/api/components/[source]/[slug]` | Single component JSON |
| `/api/facets` | Facet counts |

**New routes (public registry):**

| Route | Behavior |
|---|---|
| `/r/[source]/[slug]` | Returns `registry-item.json` verbatim, `Content-Type: application/json`, CORS `*`. Shadcn CLI accepts both with and without `.json` — serve both. |
| `/r/[source]/[slug].json` | Same as above; shadcn CLI's preferred form. Implemented as a file in `/public/r/{source}/{slug}.json` (static). |
| `/r/index.json` | Array of every `{source, slug, name, title, url}` for registry indexing tools |
| `/r/kits/[kit].json` | **v2.** Composed registry bundling multiple components under a named kit (e.g. `dark-saas-starter`). Depends on CURATION_SETS_DESIGN shipping first. |

The shadcn CLI resolves `npx shadcn add <URL>` by:
1. Fetching the URL
2. Parsing the JSON as a registry-item
3. Resolving each `files[].path` relative to the URL (so `notification.tsx` resolves to `<same-dir>/notification.tsx`)

This means we must also serve the actual component source files at the sibling URLs. Two options:

- **(a)** Emit `/public/r/{source}/{slug}/{filename}` for every file listed in the registry-item. Every install fetches multiple static files.
- **(b)** Inline the file contents into the emitted registry-item JSON via the `files[].content` field (shadcn supports both `path` and inline `content`). One fetch per install; no sibling files needed.

**Decision: (b), inlined content.** Rationale: cleaner URL surface, single cacheable artifact per component, no broken-sibling failure modes. File size per registry-item rises from ~2KB to ~20KB average, still negligible at 2,223 × 20KB ≈ 45MB of static JSON on disk.

---

## 3. Authentication decision

**Decision: Option A — production is read-only.**

Rating writes currently persist to `ratings.db` (local SQLite via `better-sqlite3`). `better-sqlite3` is a native binding that cannot run inside a Vercel serverless function without explicit binary bundling, and even if it ran, every function invocation gets a fresh `/tmp` filesystem so writes do not persist. Making ratings work in prod requires moving to Upstash Redis or Convex, which is out of scope for a first deploy.

More fundamental: ratings are **Shaan's curation signal**, not a public leaderboard. Public spam would pollute the signal with zero offsetting value. If we ever want public ratings we run a private instance with auth.

**Implementation of the read-only clamp:**

1. `viewer/middleware.ts` — early-return 503 for any `POST /api/rate/*` request when `process.env.VERCEL === '1'`. Returns JSON body `{"error":"rating_disabled_in_production"}` + `Cache-Control: no-store`.
2. `/rate` and `/rate/swipe` pages still render (so Shaan can audit how they look) but the submit buttons are disabled with a tooltip "Ratings are local-only. Rate on localhost, commit, push."
3. `/rate/leaderboard` remains fully functional — reads ELO scores from the manifest, which were baked in at build time from the local `ratings.db` state prior to commit.

**Future path:** if public rating becomes desirable, introduce Clerk auth + Upstash Redis + per-user rate-limiting in a follow-up `PUBLIC_RATING_DESIGN.md`. Not in scope here.

---

## 4. Registry file serving

**Decision: static generation (Option b in the problem statement).**

`scripts/emit-registry.mjs` (new, ~40 LOC) runs after `build-manifest.mjs` during the Vercel build step. Pseudocode:

```
manifest = readJSON('library/manifest.json')
outDir = 'viewer/public/r'
rmrf(outDir)
mkdir(outDir)
indexEntries = []

for each component in manifest.components:
  srcDir = `library/${component.source}/${component.slug}`
  regItem = readJSON(`${srcDir}/registry-item.json`)

  // Inline file contents so shadcn CLI needs only this one URL.
  for each file in regItem.files:
    file.content = readFileSync(`${srcDir}/${file.path}`, 'utf8')

  // Inject canonical URL metadata for attribution / debugging.
  regItem._siso = {
    canonicalUrl: `https://siso-design-system.vercel.app/r/${component.source}/${component.slug}.json`,
    sourceRegistry: component.source,
    classifiedAt: component.classification?._classifiedAt ?? null,
  }

  outPath = `${outDir}/${component.source}/${component.slug}.json`
  mkdirp(dirname(outPath))
  writeFileSync(outPath, JSON.stringify(regItem, null, 2))
  indexEntries.push({
    source: component.source,
    slug: component.slug,
    name: regItem.name,
    title: regItem.title,
    url: regItem._siso.canonicalUrl,
  })

writeFileSync(`${outDir}/index.json`, JSON.stringify(indexEntries, null, 2))
```

**Disk cost.** 2,223 components × ~20KB inlined = ~45MB. At 4,700 components (after originui + GitHub pulls) ~95MB. Well inside Vercel's 1GB deployment limit for the Hobby tier and their 100MB per-function-bundle limit does not apply (these are static files, served from the edge CDN).

**Why not on-demand.** A dynamic `/r/[source]/[slug]/route.ts` would work but: (1) it pays a cold-start on first hit, (2) it's harder to cache since Vercel's edge cache doesn't know about query-param semantics by default, (3) shadcn CLI parallel-fetches multiple URLs when a user installs a kit, amplifying cold-start cost. Static is simpler, faster, free.

**Gitignore.** `viewer/public/r/` is generated during build and MUST be gitignored. Add a line to `.gitignore`. Vercel regenerates it on every deploy.

---

## 5. CORS + caching

**All `/api/*` and `/r/*` routes return:**

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Cache-Control: public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800
```

Rationale: 1 hour browser cache, 24 hour edge cache, 7 day stale-while-revalidate. Manifest changes ship via redeploy (which purges Vercel edge cache automatically), so stale-while-revalidate is safe.

Static files under `/public/r/` inherit Vercel's immutable caching when configured via `vercel.json` headers. Since we regenerate file content on every build but keep stable URLs, use `max-age=3600, s-maxage=86400` rather than `immutable`.

**`vercel.json` at repo root:**

```json
{
  "version": 2,
  "installCommand": "cd viewer && npm install --legacy-peer-deps",
  "buildCommand": "node scripts/build-manifest.mjs && node scripts/emit-registry.mjs && cd viewer && npm run build",
  "outputDirectory": "viewer/.next",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/r/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" },
        { "key": "Content-Type", "value": "application/json; charset=utf-8" }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "public, max-age=3600, s-maxage=86400" }
      ]
    },
    {
      "source": "/preview/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" },
        { "key": "X-Frame-Options", "value": "ALLOWALL" }
      ]
    }
  ]
}
```

Note: Vercel honors `vercel.json` at the repo root even when the Next project root is `viewer/`. The combination of root `vercel.json` + Vercel-project-setting `Root Directory = viewer` is the canonical pattern for monorepos with a sibling `library/` sharing the same deploy.

---

## 6. Thumbnail + preview image serving

**Thumbnails.** Already at `viewer/public/thumbnails/{source}__{slug}.png`. Vercel serves `/public/` as static by default. No change needed. Confirm count via `ls viewer/public/thumbnails | wc -l` matches manifest's `hasThumbnail: true` count.

**Preview iframes.** `/preview/[source]/[slug]` is a dynamic Next route that server-renders the demo component. `externalDir: true` in `next.config.ts` lets webpack pull from `../library/{source}/{slug}/`. This works on Vercel because `outputFileTracingRoot` includes the library directory in the serverless bundle.

**Risk:** Vercel's tracer sometimes drops sibling files that are imported via template-literal `next/dynamic`. Mitigation: add `outputFileTracingIncludes['/**']: ['../library/**']` to force-include the entire library tree. Bundle size impact: the full library is ~600MB on disk including demos and README files. Vercel's function bundle limit is 250MB zipped. This is the one place this deploy might break.

**Fallback plan if the bundle exceeds 250MB:** prune the trace pattern to `'../library/**/*.{tsx,ts,json,css,md}'` excluding PNG thumbnails (which serve from `viewer/public/thumbnails/` anyway) and any video/audio. That drops ~400MB. If still over, split the viewer into a separate static-only deployment (registry + grid) and move `/preview/*` to a side service — but we won't hit that until ~10k components.

---

## 7. Domain + SSL

**Phase 1 (day zero):** `siso-design-system.vercel.app`. Free, auto-SSL via Vercel, provisioned within 60 seconds of project creation.

**Phase 2 (week 1-2, optional):** `design.siso.agency`. Requires:
1. DNS: add CNAME `design` → `cname.vercel-dns.com` in the `siso.agency` DNS provider
2. Vercel dashboard: Project → Settings → Domains → Add `design.siso.agency`
3. Vercel auto-provisions Let's Encrypt cert (~30 seconds)

No code change needed. Document in `docs/DEPLOYMENT.md`.

---

## 8. Deployment pipeline

- **Main branch → production.** Every push to `main` triggers a prod deploy.
- **All other branches → preview deployments.** Each PR gets a unique `siso-design-system-git-{branch}-{owner}.vercel.app` URL. Useful for verifying registry URL changes without promoting to prod.
- **Build hook.** Vercel exposes a `POST https://api.vercel.com/v1/integrations/deploy/{hook-id}` URL. Add one trigger point: after any manual manifest regeneration without a commit (edge case; manifest changes almost always commit).
- **Deploy protection.** Leave off for now (anyone with the URL can view). Components are already public data.

---

## 9. Cost estimate

**Hobby tier limits:** 100GB bandwidth/mo, 100GB-hours compute, 100 deploys/day, 1GB deployment artifact size, 250MB function bundle.

**Projected usage:** conservative — a single agent fetches the registry 100 times/day at 20KB avg = 2MB/day = 60MB/mo. 10 agents = 600MB/mo. Still 0.6% of free tier. Preview iframes are the cost risk: a heavy crawler hitting every `/preview/*` at 200KB HTML+JS = 2,200 × 200KB = 440MB for a single full crawl. One crawl/day = 13GB/mo, still well under. Ten concurrent crawlers = 130GB/mo = over Hobby tier. Mitigation: preview routes already cache at `max-age=86400`.

**Upgrade trigger:** move to Pro ($20/mo) when monthly bandwidth crosses 80GB or when we add a second teammate to the Vercel project.

---

## 10. Security

- **Secrets.** Deployment has no secrets. Confirm via `grep -rE "API_KEY|SECRET|TOKEN|sk-|PRIVATE" viewer/ library/ scripts/ --include="*.ts" --include="*.tsx" --include="*.mjs" --include="*.json"` returns only false positives (type definitions, public keys). The `.env` file used for `classify-components.mjs` is local-only and gitignored — classification already ran, results are baked into manifest, no runtime API calls.
- **Rating writes blocked** in prod via middleware (see §3).
- **CORS wide open** is acceptable — all served data is derived from publicly scraped shadcn registries and contains no customer data, analytics, or PII.
- **XSS surface.** Component source code is rendered via shiki (safe HTML highlighting) and in iframes (sandboxed by browser). The only user input surface is URL query params, all of which are validated against the facet enum in `parseFilters`.
- **Iframe embedding.** Preview routes intentionally set `X-Frame-Options: ALLOWALL` (or omit) so external sites can embed previews. Document this explicitly — it is a deliberate loosening of the default same-origin frame policy.

---

## 11. Implementation plan for the Haiku worker

Single phase. Estimated 30 minutes of execution.

1. **CREATE** `scripts/emit-registry.mjs` — the emitter from §4. ~40 LOC. Read manifest, iterate components, inline file contents, write `viewer/public/r/{source}/{slug}.json`, write `viewer/public/r/index.json`.
2. **MODIFY** `viewer/next.config.ts` — add `outputFileTracingIncludes` block from §1.
3. **CREATE** `viewer/middleware.ts` — 503 gate for `POST /api/rate/*` when `process.env.VERCEL === '1'`.
4. **CREATE** `vercel.json` at repo root — exact JSON from §5.
5. **MODIFY** `.gitignore` — add `viewer/public/r/` so generated registry JSON is not committed.
6. **MODIFY** `package.json` at repo root — add script `"emit-registry": "node scripts/emit-registry.mjs"` for local testing.
7. **CREATE** `docs/DEPLOYMENT.md` — short runbook: how to deploy via Vercel dashboard, how to wire custom domain, how to trigger a manual redeploy, how to test the registry URL locally.
8. **VERIFY** locally: `npm run emit-registry && ls viewer/public/r/21st-dev | wc -l` should match the 21st-dev component count.

**Do not do** in this phase: custom domain setup (manual Vercel dashboard work), public rating infra, kit-registry endpoint (depends on CURATION_SETS).

---

## 12. Acceptance criteria

Every item below must pass before the worker returns `[STATUS: AWAITING QA]`.

1. `vercel deploy --prod` from repo root (or Vercel dashboard "Deploy" button) produces a successful build and a live URL.
2. `curl https://siso-design-system.vercel.app/api/components/meta` returns JSON with `total`, `generatedAt`, `schemaVersion`.
3. `curl https://siso-design-system.vercel.app/r/21st-dev/notification.json` returns a valid shadcn registry-item with inlined `files[].content`.
4. In a clean Next 15 + shadcn project: `npx shadcn@latest add https://siso-design-system.vercel.app/r/21st-dev/notification.json` installs `notification.tsx` and `demo.tsx` to `components/ui/` without errors.
5. Visiting `https://siso-design-system.vercel.app/` loads the grid, shows thumbnails, and filters work via URL params.
6. `/rate` page renders. Clicking a rating action returns 503 with `{"error":"rating_disabled_in_production"}`.
7. `curl -I https://siso-design-system.vercel.app/api/components/meta` shows `access-control-allow-origin: *` and `cache-control: public, max-age=3600, s-maxage=86400`.
8. Preview iframe `https://siso-design-system.vercel.app/preview/21st-dev/notification` renders the component in a blank page.
9. `curl https://siso-design-system.vercel.app/r/index.json | jq 'length'` returns the same count as `manifest.total`.

---

## 13. Deferred to v2+

- **Custom domain.** `design.siso.agency` DNS setup (manual, post-launch).
- **Public rating infra.** Upstash Redis rate-limiting + Clerk auth if we ever want external rating signal. Separate `PUBLIC_RATING_DESIGN.md`.
- **Kit registry endpoint.** `/r/kits/[kit].json` depends on CURATION_SETS_DESIGN shipping first.
- **Per-source subdomains.** `21st-dev.siso.design`, `originui.siso.design`. Noise unless a source becomes independently navigable.
- **Vercel Edge Config.** Feature flags for A/B testing sidebar layouts. Not needed at current scale.
- **Multi-region deploy.** Vercel auto-routes to nearest edge already. Multi-region origin doesn't matter for static + light serverless.
- **Analytics.** Vercel Analytics is free at Hobby but privacy-sensitive. Decide in a separate doc.
- **Webhook on registry change.** Notify agents when a new component lands. Out of scope for v1.

---

## 14. Execution handoff

This doc is ready for a single-phase Haiku worker in an isolated worktree. The worker should:

1. Read this doc end to end.
2. Execute §11 in order.
3. Run §12 acceptance checks 1–3, 5, 7, 8, 9 locally against a `vercel dev` build (checks 4 and 6 require a live deploy — capture those in the verifier step).
4. Return `[STATUS: AWAITING QA]` with the preview URL from `vercel deploy` (not `--prod`).

Verifier agent then runs checks 4 and 6 against the preview URL and promotes to prod on PASS.
