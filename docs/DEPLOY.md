# Cloudflare Deployment Guide

## Product: Cloudflare Workers (via @opennextjs/cloudflare)

The viewer app deploys to **Cloudflare Workers**, not Cloudflare Pages.
This means you need a **Workers** project (not a Pages project) connected to
this GitHub repository.

---

## One-time Cloudflare Dashboard Setup

### 1. Delete the old Pages project (if it exists)

If you have an existing `siso-design-system.pages.dev` project:

- Go to **Cloudflare Dashboard → Workers & Pages**
- Find `siso-design-system` under Pages
- Open Settings → scroll to bottom → **Delete project**

### 2. Create a new Workers project connected to GitHub

1. Go to **Cloudflare Dashboard → Workers & Pages → Create application**
2. Choose **Workers** tab (not Pages)
3. Click **"Import a repository"** (or "Connect to Git")
4. Select the `sisodias/siso-design-system` GitHub repo
5. Set the following build configuration:

| Field | Value |
|-------|-------|
| **Build command** | `npm install --legacy-peer-deps && npm run build` |
| **Root directory** | *(leave blank — repo root)* |
| **Output directory** | *(leave blank — managed by wrangler)* |
| **Node.js version** | `18` or `20` |

6. Click **Save and Deploy**

### 3. Expected URL

After first deploy: `https://siso-design-system.<your-account>.workers.dev`

You can also add a custom domain in Workers → Settings → Domains & Routes.

---

## Environment Variables / Secrets

No secrets are required for the base deployment.

| Variable | Where | Purpose |
|----------|-------|---------|
| `CF_WORKERS` | Set automatically via `wrangler.jsonc` `vars` | Disables better-sqlite3 on Workers runtime |
| `NODE_OPTIONS` | Set in build command via `npm run build` | Heap limit for large component manifest build |

If you want to add a `CLOUDFLARE_API_TOKEN` for CLI deploys from local, add it
to your local `.env` — it is never committed to the repo.

---

## Local Development

Local dev is unchanged:

```bash
cd viewer
npm run dev          # starts Next.js on :3005 with sqlite rating DB
```

To preview locally with the Workers runtime (optional):

```bash
cd viewer
npm run cf:preview   # builds + serves via wrangler dev
```

---

## What Works on Workers vs Local-Only

| Feature | Cloudflare Workers | Local |
|---------|--------------------|-------|
| Component browser | Yes | Yes |
| /query (AI compose) | Yes | Yes |
| /compose | Yes | Yes |
| /pick (iframe embed) | Yes | Yes |
| /api/rate/* | 503 (local-only) | Yes |
| /api/tags/* | 503 (local-only) | Yes |
| Component ratings / ELO | Local only | Yes |
| Tag curation | Local only | Yes |

The rating and tagging features use `better-sqlite3` (native Node.js addon) which
cannot run in the Workers runtime. They return 503 responses on the deployed app.
All component browsing, searching, and composition features work fully.

---

## Config Files

| File | Purpose |
|------|---------|
| `viewer/wrangler.jsonc` | Workers config (name, compatibility flags, assets binding) |
| `viewer/open-next.config.ts` | OpenNext Cloudflare adapter config |
| `viewer/next.config.ts` | Next.js config (OpenNext dev init + webpack externals) |
| `package.json` (root) | Chains manifest build → `viewer/cf:build` |
| `viewer/package.json` | `cf:build` = `opennextjs-cloudflare build` |
