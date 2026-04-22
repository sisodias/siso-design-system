# Handoff — SISO Design System

**Status:** 2026-04-22 · active · viewer running on `localhost:3005`
**GitHub:** [Lordsisodia/siso-design-system](https://github.com/Lordsisodia/siso-design-system)
**Local path:** `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system/`

This doc lets a fresh agent pick up where we left off. Read it top-to-bottom, then `ARCHITECTURE.md` + `CONTRIBUTING.md` for the building rules.

---

## What this repo is

A **self-contained React component bank** + **local Next.js viewer** that:
- Stores curated UI components in `library/{source}/{slug}/` with shadcn's `registry-item.json` metadata
- Renders live previews via iframe routes (`app/preview/[source]/[slug]/`)
- Browses + filters + selects + exports cart → agent prompts

Built to be a permanent, growing home for every UI pattern Shaan wants to reuse.

---

## Current state (what's live on `main` as of 433f762)

### Library contents

```
library/21st-dev/         31 entries total
  ├── 20 renderable components (have demo.tsx, show live preview)
  ├── 1  user-fetched: aliimam-gallery (via add-21st.mjs)
  ├── 8  dependency-only primitives (button, card, avatar, etc. — hidden from grid)
  ├── _utils/              (cn, stub-hook, ui-shims)
  └── catalog.json         (legacy index, kept for reference)
```

Lumelle (15) and restaurant-app-solo (9) harvests were **deleted** because they were all `renderable:false` placeholders — they cluttered the grid without rendering. Full history preserved in git + PROVENANCE.md.

### The viewer (localhost:3005)

Next.js 15 App Router + Tailwind + shadcn theme system. Three main routes:

- `/` — Home grid with sidebar (21st-dev / Recently Added / All) + filter + search + multi-select
- `/component/[source]/[name]` — Detail page: live preview iframe (top) + shiki-highlighted code (middle) + README markdown (bottom)
- `/preview/[source]/[slug]` — bare iframe route, ONLY the component demo on a blank page. Cards use this as their preview src
- `/export` — multi-select cart → agent prompt (3 styles: agent / list / markdown), copy to clipboard
- Modal: click card → `?preview={source}/{name}` query param opens full-screen modal with prev/next arrow keyboard nav

Sidebar uses shadcn-style `Tree` component with Clock-icon "Recently Added" + Sources group.

### The critical fix that took forever

The viewer originally **rendered components with wrong colors, fonts, and styles** because it was missing shadcn's theme vars. Fixed in commit `6a29e1e`:

- `globals.css` → full shadcn HSL theme (`--background`, `--foreground`, `--primary`, etc. both light + `.dark`)
- `tailwind.config.ts` → maps `colors.background = hsl(var(--background))` for all shadcn names
- Added `tailwindcss-animate` + `geist` (fonts) deps
- Content scan extended to `../library/**/*.{ts,tsx}` so library components get their classes compiled

This is the moment the bank went from "looks off" to "matches 21st.dev pixel-ish."

---

## File layout — what lives where

```
design-system/
├── README.md                      start here for philosophy
├── ARCHITECTURE.md                3 building principles + folder layout contract
├── CONTRIBUTING.md                how-to-add-a-component cheatsheet
├── CATALOG.md                     usage-first index ("I'm building X, which components?")
├── PROVENANCE.md                  every component → source app → original path
├── KEEPERS.md                     chronological harvest log
├── ADAPTERS.md                    adapter contract spec (for future systems tier)
├── HANDOFF.md                     this file
├── AUDIT.md                       original eduba-brand reverse-engineering audit
│
├── library/
│   └── 21st-dev/
│       ├── {slug}/
│       │   ├── registry-item.json   shadcn schema — required
│       │   ├── {slug}.tsx           the component — required
│       │   ├── demo.tsx             standalone demo — required if renderable
│       │   └── README.md            human notes (optional)
│       ├── _utils/                  cn.ts + stub-hook.ts + ui-shims.tsx
│       └── catalog.json             legacy index
│
├── docs/
│   └── examples/
│       └── example-component/      copy-pasteable template folder
│
├── scripts/
│   └── add-21st.mjs               fetch any 21st.dev component via /r/ JSON endpoint
│
├── viewer/                         Next.js 15 app
│   ├── app/
│   │   ├── layout.tsx             Geist fonts + CartProvider + PreviewModalServer
│   │   ├── page.tsx               home (pl-64 for sidebar)
│   │   ├── globals.css            shadcn HSL theme (light + .dark)
│   │   ├── preview/[source]/[slug]/page.tsx    iframe route, delegates to PreviewRenderer
│   │   ├── component/[source]/[name]/page.tsx  detail: preview + code + README
│   │   └── export/page.tsx        cart → prompt builder
│   ├── components/
│   │   ├── Sidebar.tsx            tree-based nav: All / Recently Added / Sources / Build
│   │   ├── Breadcrumb.tsx
│   │   ├── ComponentGrid.tsx      client filter + Recently Added rail + grid
│   │   ├── Card.tsx               4:3 aspect, iframe preview, title below
│   │   ├── PreviewRenderer.tsx    'use client', dynamic import from @lib/21st-dev/{slug}/demo
│   │   ├── PreviewModal.tsx       ?preview= query-driven modal w/ arrow-key nav
│   │   ├── PreviewModalServer.tsx server wrapper feeding components list to modal
│   │   ├── CartProvider.tsx       localStorage-persisted selection
│   │   ├── CartDrawer.tsx         floating bottom-right + slide-up panel
│   │   ├── CartToggleButton.tsx   (still exists but no longer used on cards)
│   │   ├── CopyPathButton.tsx     navigator.clipboard helper
│   │   ├── CodeBlock.tsx          shiki syntax highlighting, collapsible
│   │   ├── ErrorBoundary.tsx
│   │   ├── SourceBadge.tsx        colored source label
│   │   └── ui/tree.tsx            shadcn-style animated tree nav (motion/react)
│   ├── lib/
│   │   ├── registry.ts            walks library/ + parses registry-item.json
│   │   ├── files.ts               safe file reader for code viewer
│   │   ├── readme.ts              markdown parsing helper
│   │   ├── types.ts               ComponentEntry + SourceApp + PlatformScope
│   │   └── utils.ts               cn() for viewer's own code
│   ├── tsconfig.json              paths: @lib/* → ../library/*, @/* → ./*
│   ├── next.config.ts             externalDir, webpack resolve, images.remotePatterns,
│   │                              typescript.ignoreBuildErrors, outputFileTracingRoot
│   └── tailwind.config.ts         shadcn theme mapping + ../library/** in content
│
└── (empty tier folders — primitives/, composites/, systems/, adapters/, tokens/, _raw/)
```

---

## How to add a component

### From 21st.dev (preferred workflow — one command)

```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system
node scripts/add-21st.mjs 'https://21st.dev/community/components/{user}/{slug}/default'
# or: node scripts/add-21st.mjs {user}/{slug}
```

The script:
1. Fetches `https://21st.dev/r/{user}/{slug}` (shadcn registry JSON, no auth needed)
2. Recursively resolves `registryDependencies` (e.g. shadcn/button)
3. Writes files to `library/21st-dev/{user}-{slug}/`
4. Import rewrites: `@/components/ui/X` → `./X`, `@/lib/utils` → `../_utils/cn`, `motion()` → `motion.create()`
5. Auto-generates `demo.tsx` if 21st.dev doesn't ship one
6. Writes our `registry-item.json` wrapper with `_provenance.fetchedAt` for Recently Added sort

Refresh viewer, new card appears in Recently Added rail at top.

### Hand-written SISO primitives

See `docs/examples/example-component/` — copy the folder, rename files, update registry-item.json.

---

## The pivotal technical discoveries (in order)

1. **shadcn's `registry-item.json` schema is the industry standard** — used by shadcn CLI, v0, Cursor, Claude Code. Adopt verbatim.
2. **iframes for preview isolation** — not CSS scale transforms. `h-screen` demos work, `position: fixed` stays contained, no style conflicts.
3. **21st.dev has a public JSON registry** at `https://21st.dev/r/{user}/{slug}` — no auth, no scraping, verbatim source.
4. **Theme vars are load-bearing** — our viewer needed shadcn's CSS custom props in globals.css for components to look right. Missing theme = every component looks wrong in subtle ways.
5. **Webpack dynamic imports with template literals** — the regex matches ALL subdirs; anything broken in `library/21st-dev/` breaks the whole build. Skipped components MUST live outside this folder (we used `_skipped-21st-dev/` sibling, now deleted).
6. **`ssr: false` on `next/dynamic`** only works in client components. Preview route: server component checks renderable → delegates to client `PreviewRenderer.tsx` for the actual dynamic import.
7. **`motion(Component)` deprecated in framer-motion v12** → `motion.create(Component)`. Auto-fixed in `add-21st.mjs` for future fetches.

---

## Known gaps / TODOs

### Content
- **Only 21 renderable components in the bank** — need more. User wants to pull 21st.dev at scale.
- **No SISO-first primitives yet** — `primitives/` + `composites/` + `systems/` folders are empty. The adapter contracts (`adapters/*.ts`) exist but nothing consumes them.
- **isso-dashboard harvest not done** — was planned but never executed. Dashboard UI lives at `/Users/shaansisodia/SISO_Workspace/SISO_Agency/apps/isso-dashboard/` — would need to be harvested INTO the library with renderable demos (can't be code-reference-only per Shaan's preference now).

### Viewer
- **No "Add component" UI** — currently terminal-only via add-21st.mjs. Could paste a URL into viewer → auto-fetch.
- **No component comparison** — can't open two components side-by-side.
- **Search is only across name/description/tags** — not full-text across code.
- **No component versioning** — if 21st.dev updates a component, we don't know.
- **Tags are hand-rolled per fetch** — no canonical tag taxonomy.

### Technical debt
- `typescript.ignoreBuildErrors: true` in next.config.ts — set to skip type-check on library files. Should fix properly with a separate tsconfig for library/.
- `library/21st-dev/catalog.json` is legacy metadata from the original harvest — not read by the registry, could be deleted.
- Old non-renderable Lumelle/restaurant harvest READMEs still pushed on earlier git commits — preserved in history but cluttered.

---

## Next session priorities

User wants (in order):
1. **Scrape 21st.dev at scale** — find a sitemap, bulk-fetch all components to see how large the corpus actually is
2. **Look for other component libraries we can scrape** via similar JSON registry patterns — magicui, aceternity, originui, shadcn-phone-input, etc. Many may expose shadcn-compatible registry endpoints
3. **(Implied)** Make the viewer a better showcase for the scraped corpus once it's pulled in

Research pointers:
- 21st.dev sitemap: check `https://21st.dev/sitemap.xml` — standard Next.js SEO file
- Alternative: scrape the `https://21st.dev/community/components` list page HTML + extract all `/{user}/{slug}` links
- Other registries: magicui.design, aceternity.com/components, originui.com, tremor.so — most publish a `/r/` JSON endpoint matching shadcn format
- See if shadcn's CLI (`npx shadcn@latest add`) logs all the URLs it fetches — that's another way to discover endpoints

---

## How to pick up where we left off (for a fresh agent)

1. **Read this doc** + `ARCHITECTURE.md` + `CONTRIBUTING.md`
2. Verify viewer runs:
   ```bash
   cd /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system/viewer
   npm install
   npm run dev -- -p 3005
   ```
   Open `http://localhost:3005`
3. Test the fetch script works:
   ```bash
   node /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system/scripts/add-21st.mjs {user}/{slug}
   ```
4. Check the latest git commit + PROVENANCE.md + KEEPERS.md for what's already been done
5. Shaan's working style (from decision-patterns in memory):
   - First-principles reasoning, not pattern-matching
   - Parallel Haiku agents for bulk work, orchestrator stays in Sonnet
   - Don't ask dumb clarifying questions — decide and announce instead
   - End responses with "Next steps" (3 numbered options, 1 recommended)

---

## Recent commit timeline (most → least recent)

```
433f762  chore: remove dead non-renderable components
6a29e1e  feat(viewer): shadcn theme parity — HSL CSS vars + Geist fonts + fixed preview layout
9b7a7f7  fix: swap next/image for plain <img> in gallery (crash-free preview)
04260b9  fix: gallery + add-21st.mjs — motion() deprecation + next/image remote hosts
31aa4f5  feat(viewer): Recently Added rail + sidebar item
f140b51  feat: scripts/add-21st.mjs — pull any 21st.dev component via /r/ JSON endpoint
403e5b5  feat: migrate to library/ + iframe preview route (shadcn registry-item.json)
b9dacca  docs: standardize component architecture — shadcn registry-item.json + iframe preview contract
274287b  fix(viewer): fixed-viewport preview w/ CSS zoom + cleaner card (no + Select pill)
f5fb59a  fix(viewer): clean page.tsx (drop orphan header/max-width wrapper) + manifest skips demoless primitives
b0c55f9  fix(viewer): contain:strict on preview cards + tree sidebar
62b65ec  Viewer v2: 21st.dev-style UI
a816d33  fix(viewer): allowlist gate — skipped slugs show placeholder instead of build-time reaviz crash
3422e75  Viewer v1.3: live 21st.dev component previews
5f0b888  Viewer v1.2: syntax-highlighted code viewer on detail pages
8eddc2c  Viewer v1.1: client-side filter + full markdown + multi-select + prompt export
ca6a22e  Viewer v1 + mobile scope tagging + CATALOG.md
660d18e  Restaurant harvest: 9 keepers from restaurant-app-solo (~20,400 LOC)
e05131b  Initial bank: Lumelle harvest + 21st.dev imports + adapter contracts
```

---

## TL;DR for a new agent in 5 lines

1. Viewer renders live 21st.dev components in iframes at `localhost:3005`
2. Add components via `node scripts/add-21st.mjs <21st.dev url>` — writes to `library/21st-dev/{slug}/` with `registry-item.json`
3. Shadcn theme is wired in `globals.css` + `tailwind.config.ts` — don't break it
4. Next priority: scrape 21st.dev sitemap + other component libraries (magicui, aceternity, originui) via the same `/r/` pattern
5. Document architecture is in ARCHITECTURE.md + CONTRIBUTING.md + docs/examples/ — read these before adding stuff
