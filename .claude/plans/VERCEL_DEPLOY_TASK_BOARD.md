# Vercel Deploy — Haiku Task Board

**Parent design:** `.claude/plans/DEPLOY_AND_REGISTRY_DESIGN.md`
**Goal:** Single-phase deployment of the viewer to Vercel with shadcn-compatible public registry endpoints so external agents (including `@siso/cli`) can fetch + install components.

**Blocks:** `@siso/cli` runtime validation. Without a public URL, every CLI command returns network errors.
**Blocked by:** F1 revert (must ship first — preview routes must actually work in prod, not hang).

---

## Single worker, single phase

**Worker model:** Haiku
**Estimated wall time:** 1 hour
**Repo root:** `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system`

---

## File scope

| File | Operation | Notes |
|---|---|---|
| `scripts/emit-registry.mjs` | CREATE | Static generator: iterate manifest, inline file contents, write `viewer/public/r/{source}/{slug}.json` + `viewer/public/r/index.json` |
| `viewer/middleware.ts` | CREATE | 503 gate for `POST /api/rate/*` when `process.env.VERCEL === '1'` |
| `vercel.json` | CREATE | Repo-root config: build command, root directory pointer, CORS headers for `/r/*` + `/api/*` |
| `.gitignore` | MODIFY | Add `viewer/public/r/` (generated at build time) |
| `package.json` (root) | MODIFY | Add `emit-registry` script |
| `docs/DEPLOYMENT.md` | CREATE | Runbook for deploying, wiring custom domain, re-deploying |

READ-ONLY: `viewer/next.config.ts` (already has production-gated `outputFileTracingIncludes`), `library/manifest.json`, `scripts/build-manifest.mjs`.

---

## Acceptance criteria

1. `node scripts/emit-registry.mjs` exits 0, emits N files to `viewer/public/r/`, matches manifest component count
2. Each emitted file has `files[].content` inlined (not just `path`)
3. `viewer/public/r/index.json` is an array of `{source, slug, name, title, url}` with length matching manifest total
4. `curl -sI http://localhost:3005/r/21st-dev/notification.json` returns 200 + CORS `*` header (after `vercel dev` or prod)
5. In a fresh Next 15 + shadcn project: `npx shadcn@latest add http://localhost:3005/r/21st-dev/notification.json` installs successfully
6. `vercel.json` has the headers map for `/r/(.*)` + `/api/(.*)` routes
7. `viewer/middleware.ts` blocks POST to `/api/rate/*` only when `process.env.VERCEL === '1'` is truthy
8. `docs/DEPLOYMENT.md` documents: project setup on Vercel, root-directory config, custom domain wiring, manifest regeneration
9. `cd viewer && npm run build` exits 0 with the middleware + vercel.json in place

---

## Worker prompt (copy-paste verbatim)

```
You are a Haiku worker shipping the Vercel deployment infrastructure for the SISO design-system viewer.

Repo root: /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system
Deploy target: Vercel (project name: siso-design-system, domain: siso-design-system.vercel.app initially)

READ THESE FIRST:
1. .claude/plans/DEPLOY_AND_REGISTRY_DESIGN.md — full design doc
2. viewer/next.config.ts — existing config (F2 + F12 already production-gate tracing)
3. library/manifest.json — first 50 lines, see component shape
4. scripts/build-manifest.mjs — understand the existing emit pattern
5. viewer/app/api/facets/route.ts — existing CORS pattern for /api/*

YOUR TASK: Ship Vercel deploy scaffolding.

CREATE scripts/emit-registry.mjs
  ESM Node script (no deps beyond fs/promises + path). Read library/manifest.json,
  iterate components, for each emit a file at viewer/public/r/{source}/{slug}.json
  containing its registry-item.json with files[].content inlined (readFileSync
  each file referenced in files[].path). Also write viewer/public/r/index.json
  as an array of { source, slug, name, title, url } where url is
  "https://siso-design-system.vercel.app/r/{source}/{slug}.json". At end:
  console.log(\"[emit-registry] N files written to viewer/public/r/\").
  Script should be safe to re-run (wipes viewer/public/r/ before emitting).

CREATE viewer/middleware.ts
  'use server' not applicable — this is Next middleware. Export:
    import { NextRequest, NextResponse } from 'next/server'
    export function middleware(request: NextRequest) {
      if (process.env.VERCEL === '1' &&
          request.nextUrl.pathname.startsWith('/api/rate/') &&
          request.method === 'POST') {
        return NextResponse.json(
          { error: 'rating_disabled_in_production' },
          { status: 503, headers: { 'Cache-Control': 'no-store' } }
        )
      }
      return NextResponse.next()
    }
    export const config = {
      matcher: ['/api/rate/:path*']
    }

CREATE vercel.json (at repo root, NOT inside viewer/)
  {
    \"version\": 2,
    \"installCommand\": \"cd viewer && npm install --legacy-peer-deps\",
    \"buildCommand\": \"node scripts/build-manifest.mjs && node scripts/emit-registry.mjs && cd viewer && npm run build\",
    \"outputDirectory\": \"viewer/.next\",
    \"framework\": \"nextjs\",
    \"headers\": [
      {
        \"source\": \"/r/(.*)\",
        \"headers\": [
          { \"key\": \"Access-Control-Allow-Origin\", \"value\": \"*\" },
          { \"key\": \"Access-Control-Allow-Methods\", \"value\": \"GET, OPTIONS\" },
          { \"key\": \"Cache-Control\", \"value\": \"public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800\" },
          { \"key\": \"Content-Type\", \"value\": \"application/json; charset=utf-8\" }
        ]
      },
      {
        \"source\": \"/api/(.*)\",
        \"headers\": [
          { \"key\": \"Access-Control-Allow-Origin\", \"value\": \"*\" },
          { \"key\": \"Cache-Control\", \"value\": \"public, max-age=3600, s-maxage=86400\" }
        ]
      },
      {
        \"source\": \"/preview/(.*)\",
        \"headers\": [
          { \"key\": \"Cache-Control\", \"value\": \"public, max-age=86400\" }
        ]
      }
    ]
  }

MODIFY .gitignore (repo root)
  Add line: viewer/public/r/

MODIFY package.json (repo root, NOT viewer/)
  Add to scripts:
    \"emit-registry\": \"node scripts/emit-registry.mjs\"

CREATE docs/DEPLOYMENT.md
  Short runbook covering:
  - Vercel project setup (root directory = viewer, install command override,
    build command from vercel.json)
  - How to wire custom domain (DNS CNAME cname.vercel-dns.com)
  - How to trigger a manual redeploy (git push or Vercel dashboard)
  - How to test the registry URLs locally (vercel dev + curl tests)
  - Rating routes return 503 in prod — document why, how to re-enable later

VALIDATION:
  cd /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system
  node scripts/emit-registry.mjs
  # Must emit N files matching manifest.total
  ls viewer/public/r/21st-dev/ | wc -l
  # Should be non-zero
  cat viewer/public/r/21st-dev/notification.json | python3 -c 'import sys,json; d=json.load(sys.stdin); print(\"files\", len(d[\"files\"]), \"content-lens\", [len(f.get(\"content\",\"\")) for f in d[\"files\"]])'
  # Each file should have non-empty content
  cd viewer && npm run build
  # Must exit 0

DO NOT TOUCH:
  viewer/next.config.ts (already correct)
  viewer/app/api/*/route.ts (CORS already handled per-route; vercel.json is additional edge-level)
  viewer/components/*
  scripts/build-manifest.mjs, bulk-import.mjs, classify-components.mjs, backfill-renderable.mjs, generate-thumbnails.mjs, add-21st.mjs
  Any library/* file

RETURN (single line):
[STATUS: AWAITING QA] Vercel deploy scaffold ready. Emitted N registry files.
Build exit 0. vercel.json + middleware + docs in place. Ready for
`vercel deploy --prod` from repo root.
```

---

## After worker returns — orchestrator does these

1. Commit the changes (don't include the generated `viewer/public/r/` — it's gitignored)
2. `vercel link` to attach the local repo to the Vercel project (interactive — might need human)
3. `vercel deploy --prod` from repo root
4. Verify acceptance criteria 4 + 5 against the live URL
5. Update `cli/src/config.ts` default `BASE_URL` if the final Vercel URL differs from the placeholder
6. Push `siso_design_system_url` update to memory/HANDOFF.md

---

## Deferred to follow-up

- Custom domain setup (`design.siso.agency`) — manual DNS work
- Public rating infra (Upstash Redis + Clerk auth)
- Kit-registry endpoint (`/r/kits/[kit].json`) — depends on CURATION_SETS shipping
- Vercel Edge Config / Analytics — not needed at current scale
