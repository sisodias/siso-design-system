# `/compose` Route — Cart to Agent-Prompt Workflow

**Status:** design · **Date:** 2026-04-23
**Scope:** Replace the minimalist `/export` route with a proper cart-to-output workflow. Produces formats consumable by AI coding agents, shadcn CLI, zip downloads, and shareable URLs.

---

## Problem

Current `/export` takes selected cart items and emits a plain markdown list. Useless for:
- Feeding an AI agent that needs `ai_summary` + source files to build a feature
- Copy-paste into `npx shadcn add ...` install commands
- Sharing a curated set across machines / teammates
- Publishing a kit as a shadcn-compatible registry

---

## User stories

**1. Shaan composes a landing page.** Filters `?category=hero&style=dark` → adds 1 hero. `?category=pricing` → adds 3 pricing cards. Adds 1 feature grid + 1 footer. 6 items in cart. `/compose` → picks "Agent Prompt" format → Copy → pastes into Claude Code. Claude builds the landing page using ONLY the listed primitives.

**2. AI agent queries `/api/query` then calls `/api/compose`.** Agent hits `/api/query` (from RANKING_DESIGN.md) to pick 5 components. Posts them to `/api/compose` with `format: "agent-prompt"`. Returns a copy-ready prompt string. No UI involvement.

**3. Shaan publishes a kit.** Rated via `/rate/swipe`, 12 components are `featured`. Selects them all. `/compose` → "Registry JSON" → downloads `siso-pricing-kit-v1.json`. Anyone can `npx shadcn@latest add https://siso-design-system.vercel.app/r/kits/siso-pricing-kit-v1.json`. (v2 feature — reserve route now.)

---

## Route shape

- `/compose` — main page. Two-panel layout (see wireframe below).
- `POST /api/compose` — programmatic access. Body `{ components, format, options }`.
- `/r/kits/[name].json` — static-generated kit registry files (v2, reserved).

---

## Wireframe

```
┌──────────────────────────────────────────────────────────────┐
│ Compose · [6 items]          Format: [Agent Prompt ▼]        │
│──────────────────────────────────────────────────────────────│
│ Cart (6)                   │  Output preview                 │
│ ──────────────────────── │ ────────────────────────────── │
│ [×] dark-hero-block      │ │ You have these 6 components  │
│     category: hero       │ │ available for building a UI:  │
│     style: dark          │ │                               │
│ [×] tiered-pricing-card  │ │ 1. dark-hero-block            │
│     category: pricing    │ │    Dark hero w/ gradient orb  │
│     style: gradient      │ │    Source: library/21st-dev/… │
│ [×] feature-grid-4       │ │    ...                        │
│     category: data-display │ │ [5 more]                      │
│ [×] footer-minimal       │ │                               │
│ ... (2 more)             │ │ Build me: <your brief here>   │
│                          │ │                               │
│ [+ Add more] [Clear]     │ │ [Copy] [Download] [Share]    │
└──────────────────────────┴────────────────────────────────────┘
```

---

## Output formats

### (a) Agent prompt — plain text, ~2KB typical

Template (fields filled per cart):

```
You have these N components available for building a UI:

{for each component:}
{i}. {displayName} ({source}/{slug})
    {ai_summary}
    category: {category}
    visualStyle: {visualStyle.join(", ")}
    complexity: {complexity}
    platform: {platformFit.join(", ")}
    Source folder: library/{source}/{slug}/
    Files: {files.join(", ")}
{end for}

User brief: {user_input_text}

Constraints:
- Only use the listed components; don't invent primitives not in the list.
- Match their design language (infer from visualStyle + aiSummary).
- Preserve their interactions/accessibility patterns as in source.
- Use Tailwind classes; components target Next.js 15 App Router.
- If a constraint in the brief conflicts with the component set, explain and propose a substitute from the list.
```

Brief text is a user-controlled textarea on the compose page (optional, empty is fine).

### (b) Shadcn install command

Generates a `npx shadcn@latest add <url1> <url2> ...` one-liner. Per-component URL resolution:

- `source === "21st-dev"` + has `_provenance.fetchedFrom` → use that URL
- `source === "motion-primitives"` → construct `https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/{slug}.json`
- `source === "kokonutui"` → similar pattern when adapter ships
- `source === "siso-primitives"` → use our own published registry URL (v2; comment as "TODO publish" in v1)

Components without a resolvable URL get a fallback comment:

```
# npx shadcn@latest add \
#   https://21st.dev/r/aliimam/gallery \
#   https://raw.githubusercontent.com/ibelick/motion-primitives/main/public/c/marquee.json
# NOTE: siso-primitives/custom-hero not installable via shadcn — copy library/siso-primitives/custom-hero/ manually
```

### (c) Zip download — binary

Server-side zip of the selected `library/{source}/{slug}/` folders. Contents:
- All `.tsx`, `.ts`, `.css`, `.json` files in each folder
- Top-level `README.md` generated by the server listing: "This kit contains N components" + per-component summary

Exclusions (non-negotiable):
- `.claude/`, `node_modules/`, `.git/`, any dotfiles, `ratings.db*`
- `preview.png` included ONLY if component.hasThumbnail (reduces size)

Size estimate: 6 × ~22KB = ~150KB typical zip. At 20 components: ~500KB.

Uses the `zip` npm package (dep install in the Haiku worker's phase). Stream response, `Content-Type: application/zip`.

### (d) Shareable URL

Base64-encoded selection in URL param: `/compose?kit=<base64-json>`.

Payload: `{ components: [{source, slug}, ...], v: 1 }`. Max ~50 components before the URL exceeds 2KB (most browsers and proxies handle 8KB comfortably but keep headroom).

Fallback above 50 components: POST to `/api/kits` returns a short ID → URL becomes `/compose?kit=srv:<id>`. v2 feature; v1 just hard-caps share to 50.

### (e) Registry JSON (v2)

Emit a shadcn registry file matching `https://ui.shadcn.com/schema/registry.json`. Writes to `viewer/public/r/kits/[name].json` (static, Vercel-served). Requires a `kit_name` param (user input, slug-cased).

Reserve the route now; note `v1: skip, design v2` in code comments.

---

## API contract

```
POST /api/compose
body: {
  components: [{ source: string, slug: string }, ...],   // required, 1-100
  format: "agent-prompt" | "install" | "zip" | "share" | "registry",
  options?: {
    brief?: string,          // for agent-prompt
    framework?: "next" | "vite" | "remix",  // for install (default: next)
    kitName?: string,        // for registry
    includeClassifications?: boolean   // embed classification.json in zip
  }
}

response:
- agent-prompt: { content: string, length: number }
- install:      { command: string, resolvable: N, fallbacks: [...] }
- zip:          binary (Content-Type: application/zip)
- share:        { url: string, components: N }
- registry:     { registry_json: object, name: string }

errors: 400 if components empty, 404 if any component not in manifest,
        413 if share payload > 2KB (v1)
```

CORS open. Same `Access-Control-Allow-Origin: *` pattern as other APIs.

---

## Privacy / safety

- No path-traversal possible: server resolves each `{source, slug}` via `getComponent()` which indexes the manifest (no raw paths from user)
- Output strings never contain absolute filesystem paths — always `library/{source}/{slug}/...`
- Zip assembly reads only manifest-listed files, never traverses the filesystem freely
- No user tokens / API keys / env vars surfaced

---

## Persistence

**v1:** Kits ephemeral. Stored in `localStorage` via existing `CartProvider`. Share URL carries state; no server state.

**v2+:** `POST /api/kits` → server-side kit storage for long URLs. Reserve route.

---

## v1 scope boundary

**Ships in v1:**
- Agent-prompt output with user-customizable brief
- Shadcn install command (best-effort + fallback comments)
- Zip download
- Share URL with base64 payload (≤ 50 components)

**Deferred to v2+:**
- Registry JSON output
- Server-side kit storage
- AI-assisted brief → auto-populated cart (integrates with `/api/query` from RANKING_DESIGN.md)
- Per-stack install variants (Remix, Astro, Vite)

---

## File-level implementation plan (Haiku worker)

- CREATE `viewer/app/compose/page.tsx` — server component, renders ComposeClient
- CREATE `viewer/app/compose/ComposeClient.tsx` — client panel with format toggle + preview + actions
- CREATE `viewer/app/api/compose/route.ts` — POST endpoint, multi-format dispatch
- CREATE `viewer/lib/compose.ts` — pure helpers: `buildAgentPrompt()`, `buildInstallCommand()`, `buildZipStream()`, `buildShareUrl()`
- MODIFY `viewer/components/Sidebar.tsx` — add "Compose" nav link (1 line)
- MODIFY `viewer/components/CartDrawer.tsx` — add "Go to Compose" action button
- MODIFY `viewer/package.json` — add `jszip` or `yazl` for zip generation
- DELETE `viewer/app/export/page.tsx` OR redirect it to `/compose` (preserve BC bookmarks)

Rough: ~600 LOC total. 1-2 hour Haiku job.

---

## Acceptance criteria

1. `/compose` page loads, shows cart items populated from CartProvider
2. Empty cart shows "Add components to get started" + link to `/`
3. Format toggle switches preview output live (no network round-trip)
4. Copy button writes to clipboard via `navigator.clipboard.writeText()`
5. Agent-prompt contains each component's `ai_summary` + slug + category
6. Install format shows `npx shadcn@latest add ...` with N resolvable URLs + fallback comments for unresolvable sources
7. Download (zip) triggers browser download of a .zip with N component folders + top-level README.md
8. Share button writes URL with `?kit=<base64>` to clipboard; visiting URL re-hydrates the cart
9. `POST /api/compose {format:"agent-prompt", components:[...]}` returns 200 + non-empty `content`
10. `POST /api/compose {format:"zip", components:[...]}` returns binary with correct Content-Type
11. CORS: `OPTIONS /api/compose` returns 204 with `Access-Control-Allow-Origin: *`
12. Empty components array → 400
13. Invalid component → 404 with list of which slugs weren't found
14. No references to filesystem paths in output strings
15. `npm run build` exits 0

---

## Future extensions (v2+)

- Brief-to-cart: `POST /api/compose/from-brief` takes a natural-language brief, calls `/api/query` to fill the cart, then renders compose output
- Per-industry templates: "SaaS pricing kit", "Fintech dashboard kit" as preset carts
- Versioned kits with semantic diffs between v1/v2/v3
- Auto-regenerate prompts on framework switch (Next ↔ Remix ↔ Astro specifics)
- Embed-able iframe of the output preview for blog posts / handoff docs
