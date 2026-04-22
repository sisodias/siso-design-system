# Thumbnail Generation

Static PNG thumbnails for components in the design-system viewer. Thumbnails are generated via Playwright and served from `/thumbnails/` in the viewer.

## File Locations

| File | Purpose |
|------|---------|
| `library/{source}/{slug}/preview.png` | Source thumbnail, colocated with component (tracked via Git LFS) |
| `viewer/public/thumbnails/{source}__{slug}.png` | Copy served by Next.js static file handling |
| `library/manifest.json` | Updated by the script with `hasThumbnail: true` + `thumbnail: "/thumbnails/..."` |

## Prerequisites

1. **Git LFS** — large PNG files are tracked via LFS, not as regular blobs:
   ```bash
   brew install git-lfs
   git lfs install
   ```

2. **Playwright Chromium** — install once after `npm install` in the `viewer/` directory:
   ```bash
   cd viewer && npx playwright install chromium
   ```

## How to Run

Generate thumbnails for all components (starts the viewer dev server automatically if not running):

```bash
node scripts/generate-thumbnails.mjs
```

Options:

| Flag | Default | Description |
|------|---------|-------------|
| `--concurrency=N` | `4` | Number of Chromium pages to run in parallel |
| `--force` | off | Regenerate all thumbnails, ignoring the idempotency check |

Example with higher concurrency:
```bash
node scripts/generate-thumbnails.mjs --concurrency=8
```

Force-regenerate all (e.g. after design changes):
```bash
node scripts/generate-thumbnails.mjs --force
```

## Idempotency

The script skips components where `preview.png` already exists AND is newer than `registry-item.json`. This means:

- Adding a new component → only that component is screenshotted on the next run.
- Re-running after no changes → all components are skipped, manifest is still refreshed.
- Touching `registry-item.json` (e.g. updating tags) → the component's thumbnail is regenerated.

## Viewer Dev Server

The script assumes the viewer is reachable at `http://localhost:3005`. If not running, the script automatically starts `npm run dev` in the `viewer/` directory, waits up to 30s for it to boot, takes screenshots, then stops the server.

You can also start the server manually before running the script:
```bash
cd viewer && npm run dev
# then in another terminal:
node scripts/generate-thumbnails.mjs
```

## After Generation

After all screenshots succeed, the script automatically re-runs `node scripts/build-manifest.mjs` to update `library/manifest.json` with `hasThumbnail: true` and the correct `thumbnail` path for each component.

The `Card.tsx` component uses `component.hasThumbnail` to decide whether to show the static PNG or fall back to the iframe-always behavior.

## Committing Thumbnails

Since `library/**/*.png` is tracked via Git LFS, commit as normal:
```bash
git add library/21st-dev/new-component/preview.png
git add viewer/public/thumbnails/21st-dev__new-component.png
git add library/manifest.json
git commit -m "feat(thumbnails): add preview for new-component"
```

The `.gitattributes` rule ensures PNGs are stored in LFS automatically.
