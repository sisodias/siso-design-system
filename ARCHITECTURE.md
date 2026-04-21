# Architecture — SISO Design System

**Status:** canon · **Version:** 1.0 · **Last updated:** 2026-04-22

How we store, describe, and render components. Read this before adding, moving, or previewing anything.

---

## The 3 building principles

### 1. Components are self-contained folders
Every component lives in its own folder with everything it needs to describe, display, and render itself. No global manifest, no loose files, no external metadata.

### 2. Metadata is JSON, not prose
Descriptions, dependencies, and config live in a `registry-item.json` file next to the code. Agents and tools can read structured data directly. Humans read the README.

### 3. Previews render in iframes
Live previews load inside sandboxed iframes on dedicated routes. No CSS bleed, no `h-screen` blowing up the layout, no `position: fixed` escaping the card. Each component renders in its own clean page, the viewer embeds it.

---

## Folder layout

Every component lives at:

```
design-system/
└── library/
    └── {source}/          e.g. 21st-dev, lumelle, restaurant-app-solo, siso-primitives
        └── {slug}/        kebab-case component name
            ├── registry-item.json     REQUIRED — shadcn-schema metadata
            ├── {slug}.tsx             REQUIRED — the component itself
            ├── demo.tsx               RECOMMENDED — standalone renderable demo
            ├── README.md              RECOMMENDED — human description + usage notes
            ├── preview.png            OPTIONAL — static fallback thumbnail
            └── (supporting files)     OPTIONAL — hooks, utils, subcomponents, CSS, JSON
```

### Source namespaces

| Source | Meaning |
|---|---|
| `21st-dev` | Harvested from [21st.dev](https://21st.dev/) |
| `lumelle` | Harvested from Lumelle app (private conductor workspace) |
| `restaurant-app-solo` | Harvested from restaurant-app-solo (Draco Coffee) |
| `siso-primitives` | First-party SISO primitives (hand-written, no source app) |
| `shadcn` | Pulled from shadcn/ui registry |
| `{new-app}` | Any future harvest gets its own namespace |

---

## `registry-item.json` — the metadata contract

Follows the [shadcn registry-item.json schema](https://ui.shadcn.com/docs/registry/registry-json). Every field below is required unless marked optional.

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "notification",
  "type": "registry:ui",
  "title": "Notification Toast",
  "description": "Animated notification toast with avatar, title, and timestamp.",
  "source": "21st-dev",
  "platform": "Mixed",
  "tags": ["toast", "notification", "animated"],

  "files": [
    { "path": "notification.tsx", "type": "registry:ui" },
    { "path": "demo.tsx", "type": "registry:example" }
  ],

  "dependencies": [
    "framer-motion",
    "lucide-react"
  ],

  "registryDependencies": [],

  "preview": {
    "width": 400,
    "height": 300,
    "background": "neutral-950",
    "interactive": false
  }
}
```

### Field reference

| Field | Type | Purpose |
|---|---|---|
| `$schema` | string | Always `https://ui.shadcn.com/schema/registry-item.json` — enables editor autocomplete |
| `name` | string | Lowercase kebab-case, matches folder name |
| `type` | enum | `registry:ui` \| `registry:component` \| `registry:block` \| `registry:hook` |
| `title` | string | Human display name, e.g. "Notification Toast" |
| `description` | string | 1–2 sentence description — shown on cards |
| `source` | enum | The source namespace (see table above) |
| `platform` | enum | `Mobile` \| `Desktop` \| `Mixed` |
| `tags` | string[] | 2–5 kebab-case keywords for filtering |
| `files` | array | Every .tsx/.ts in the folder + its role (`registry:ui`, `registry:example`, `registry:hook`) |
| `dependencies` | string[] | npm packages to install (e.g. `framer-motion`) |
| `registryDependencies` | string[] | Other components in this registry it imports (e.g. `["button", "card"]`) |
| `preview` | object | OPTIONAL — preview sizing hint (see below) |

### The `preview` field — tuning how it renders

```json
"preview": {
  "width": 400,          // preferred viewport width in the iframe
  "height": 300,         // preferred viewport height
  "background": "neutral-950",  // Tailwind bg class inside the iframe
  "interactive": false   // if false, iframe has pointer-events: none
}
```

If omitted, the viewer uses defaults: `400×300`, dark background, non-interactive.

---

## How previews render — the iframe contract

### The route

Every component gets a dedicated Next.js route that renders ONLY its demo on a blank page:

```
/preview/{source}/{slug}
```

This route is the **iframe src** embedded by each card. Inside the iframe:

- No sidebar, no chrome, no viewer UI
- Body has `width: 100vw; height: 100vh; margin: 0`
- The demo renders centered with whatever layout it wants
- Tailwind + framer-motion + lucide-react are all available
- `h-screen` in a demo actually means "100% of iframe height" — works as the author intended

### The card

Cards embed the preview with a scaled iframe:

```tsx
<iframe
  src={`/preview/${source}/${slug}`}
  width={previewWidth}       // from registry-item.json
  height={previewHeight}
  style={{ transform: `scale(${cardWidth / previewWidth})` }}
  className="pointer-events-none"
/>
```

Benefits:
- **True isolation** — no CSS conflicts between demos or with viewer chrome
- **`h-screen` works** — means the iframe's height, not the browser's
- **`position: fixed` stays contained** — iframes are their own layout root
- **No rewrite regex** — demo.tsx runs verbatim, no import mangling

---

## How to add a new component

### Option A — Harvest from an existing source

1. Copy the component files into `library/{source}/{slug}/`
2. If imports reference `@/lib/utils` or `@/components/ui/{name}`, leave them — they resolve via tsconfig paths
3. Write `registry-item.json` with all required fields
4. Write `demo.tsx` that renders the component standalone (no auth context, no cart context, no undefined props)
5. Run `npm run dev` in the viewer — card appears on refresh

### Option B — Hand-write a SISO primitive

1. Create `library/siso-primitives/{slug}/`
2. Add `{slug}.tsx` (the component)
3. Add `demo.tsx` (renders it with sample props)
4. Add `registry-item.json`
5. Done — no harvesting, no rewriting

### Demo conventions

Demo files MUST:
- Use `"use client"` at the top if they use hooks/state/motion
- Default-export the demo component OR export it as `DemoOne`
- Not reference any external data sources, auth, cart, or API calls
- Render at a reasonable size (300–800px ideal, not `h-screen` unless the component intrinsically needs full viewport)
- Wrap in a container with `width: 100%; height: 100%; display: flex; align-items: center; justify-content: center` if the component doesn't have its own layout

### What breaks a preview

- Importing `@platform/auth/...`, `@client/...`, `useCart`, `useUser`, `homeConfig`, Cloudinary `cdnUrl`, etc. → resolve or stub before committing
- Calling `window.*` at module top level → wrap in `useEffect`
- Loading Google Fonts via `<link>` at runtime → use `next/font` instead
- Rendering an image from a CDN that returns undefined → use a local placeholder or an Unsplash URL you know exists

Components that can't be made renderable (too much external state, Shopify/Supabase backing, etc.) still ship in `library/{source}/{slug}/` but their card shows a **code-reference treatment** (snippet preview + "Open" button) instead of a live iframe. Mark with `"preview": { "renderable": false }` in registry-item.json.

---

## What lives where

| Path | Contents |
|---|---|
| `library/{source}/{slug}/` | Components — the source of truth |
| `viewer/` | The Next.js app that renders the bank |
| `viewer/app/preview/[source]/[slug]/page.tsx` | The iframe route that renders a single demo |
| `viewer/app/component/[source]/[slug]/page.tsx` | Detail page — full preview + code + README |
| `viewer/lib/registry.ts` | Reads `library/` at build time, emits the component list |
| `docs/` | Architecture, provenance, catalog, audit |

---

## Decisions + rationale

### Why shadcn's schema instead of custom JSON?
- Industry standard in 2026
- [shadcn CLI](https://ui.shadcn.com/docs/cli) + v0 + Cursor + Claude Code all speak it
- Means future SISO components are installable via `npx shadcn@latest add ...` if we ever publish the registry
- Free editor autocomplete via `$schema`

### Why iframes instead of inline rendering?
- True layout isolation — `h-screen` demos don't overflow, fixed positioning stays contained
- No need for a rewrite script that mangles imports
- Demo code runs exactly as the author wrote it
- Matches how 21st.dev, shadcn registry previews, and Storybook handle isolation

### Why keep 3 source namespaces (21st-dev, lumelle, restaurant-app-solo) instead of flattening?
- Provenance stays traceable forever — you can always see where a component came from
- Different sources have different expectations (21st.dev = standalone, lumelle = broken-by-design reference)
- New harvests slot in cleanly as new namespaces

### Why live in `library/` not `components/`?
- `components/` is an overloaded name in every React project — would collide with the viewer's own `viewer/components/`
- `library/` signals "this is the shipped bank, not the viewer's internal UI"

---

## Migration from the current state

Right now the repo has this messy structure:

```
design-system/
├── _raw/lumelle/               15 components, broken-by-design
├── _raw/restaurant-app-solo/   9 components, broken-by-design
├── _external/21st-dev/         52 components, mostly standalone
└── viewer/
    └── app/_previews/          rewritten copies of 21st-dev (generated at build)
```

The migration:

1. Create `library/` at root
2. Move `_external/21st-dev/*` → `library/21st-dev/*` (verbatim, no rewrite needed)
3. Move `_raw/lumelle/*` → `library/lumelle/*` (keep broken imports, these are reference-only)
4. Move `_raw/restaurant-app-solo/*` → `library/restaurant-app-solo/*` (same)
5. Generate initial `registry-item.json` for each component (one-time codemod from existing README/files)
6. Delete `viewer/app/_previews/` and `scripts/build-previews.mjs` — no longer needed
7. Delete `_external/` and `_raw/` — library is the new source of truth
8. Add iframe preview route at `viewer/app/preview/[source]/[slug]/page.tsx`
9. Update `viewer/lib/walk.ts` → `viewer/lib/registry.ts`, reads from `library/` and `registry-item.json` files

The migration is scripted (one commit, not piecemeal) so the repo stays coherent.

---

## References

- [shadcn registry documentation](https://ui.shadcn.com/docs/registry)
- [shadcn registry-item.json schema](https://ui.shadcn.com/docs/registry/registry-json)
- [shadcn CLI v4 changelog (March 2026)](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4)
- [Live Component Preview for React — iframe-based sandboxing](https://dev.to/barelyhuman/live-component-preview-for-react-c37)
- [Storybook configuration](https://storybook.js.org/docs/configure)
- [shadcn-storybook-registry — community bridge](https://github.com/lloydrichards/shadcn-storybook-registry)
