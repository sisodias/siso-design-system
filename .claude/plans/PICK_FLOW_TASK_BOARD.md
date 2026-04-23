# Pick Flow — Haiku Task Board

**Parent design:** `.claude/plans/PICK_FLOW_DESIGN.md`
**Phases that ship now:** A (viewer `/pick` route) + B (`@siso/cli` npm package)
**Deferred:** C (`@siso/mcp-server`, v2)
**Parallelizable:** A and B have zero file overlap — dispatch simultaneously.

---

## Zero-overlap file matrix

| File | Phase A | Phase B |
|---|---|---|
| `viewer/app/pick/page.tsx` | CREATE | — |
| `viewer/app/pick/PickClient.tsx` | CREATE | — |
| `viewer/app/pick/PickCard.tsx` | CREATE | — |
| `viewer/lib/pick.ts` | CREATE | — |
| `viewer/next.config.ts` | MODIFY | — |
| `cli/package.json` | — | CREATE |
| `cli/tsconfig.json` | — | CREATE |
| `cli/tsup.config.ts` | — | CREATE |
| `cli/src/index.ts` | — | CREATE |
| `cli/src/commands/*.ts` (pick, add, query, list, facets) | — | CREATE |
| `cli/src/browser.ts` | — | CREATE |
| `cli/src/local-server.ts` | — | CREATE |
| `cli/src/config.ts` | — | CREATE |
| `cli/README.md` | — | CREATE |
| `cli/.npmignore` | — | CREATE |
| `cli/.gitignore` | — | CREATE |
| `viewer/lib/types.ts` | READ-ONLY | — |
| `viewer/lib/registry.ts` | READ-ONLY | — |
| `viewer/lib/filters.ts` | READ-ONLY | — |
| `viewer/components/Card.tsx` | READ-ONLY | — |
| `viewer/components/ComponentGrid.tsx` | READ-ONLY | — |

---

## IMPORTANT: iframe-embedding headers (security correction)

The design doc mentions `X-Frame-Options: ALLOWALL` — **this value does not exist** in any browser-recognized specification. The correct implementation for `/pick` is:

1. **Remove** (do not set) the `X-Frame-Options` header on `/pick` responses.
2. **Add** `Content-Security-Policy: frame-ancestors *` to `/pick` responses.

This allows embedding from any origin. All other routes should keep their default Next.js headers (which do not set `X-Frame-Options` either — Next.js doesn't set this by default, so the key action is adding the CSP `frame-ancestors *` header on `/pick` only).

---

## Phase A — `/pick` route

**Worker model:** Haiku
**Estimated wall time:** 4h
**Depends on:** nothing (all prior infrastructure is shipped — manifest, registry, filters, Card.tsx, ComponentGrid.tsx all exist)
**Repo root (absolute):** `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system`

### Files

| File | Operation | Notes |
|---|---|---|
| `viewer/app/pick/page.tsx` | CREATE | Server component — reads searchParams, calls getFilteredComponents, passes slice to PickClient |
| `viewer/app/pick/PickClient.tsx` | CREATE | Client component — grid, keyboard nav, callback dispatch |
| `viewer/app/pick/PickCard.tsx` | CREATE | Larger card variant (4:3 aspect, 600×450 target) with hover-iframe and selection state |
| `viewer/lib/pick.ts` | CREATE | Pure helpers: buildCallbackPayload, fireCallback, encodeRedirectPayload, resolveTargetOrigin, validateSession |
| `viewer/next.config.ts` | MODIFY | Add headers() entry for `/pick` path: set CSP `frame-ancestors *`, do NOT set X-Frame-Options |

### Acceptance criteria

1. `curl -s "http://localhost:3005/pick?category=topbar&limit=6&mode=all" | grep -c 'PickCard\|data-card'` — returns HTML containing 6 card elements
2. `curl -sI "http://localhost:3005/pick" | grep -i "content-security-policy"` — contains `frame-ancestors *`
3. `curl -sI "http://localhost:3005/pick" | grep -i "x-frame-options"` — returns NO match (header absent)
4. `curl -sI "http://localhost:3005/" | grep -i "content-security-policy"` — root route is NOT changed (CSP only on `/pick`)
5. Keyboard: arrow keys move focus ring; `Enter` fires pick callback; `Esc` fires cancel callback
6. postMessage payload matches schema: `{ type: "siso:pick", session, mode, components: [{source, slug, installUrl, displayName, category, visualStyle, thumbnail}], version: 1, pickedAt }`
7. `?callbackMode=redirect&callbackUrl=http://localhost:3950/p` — picking navigates to `http://localhost:3950/p?siso_picked=<base64>&session=<id>`
8. `?mode=single`: clicking a card fires callback immediately
9. `?mode=multi`: clicking cards toggles selection; `⌘Enter` / `Ctrl+Enter` submits
10. `cd viewer && npm run build` exits 0

### Worker prompt (copy-paste verbatim into Agent call)

```
You are a Haiku worker implementing Phase A of the SISO Design System pick flow.
Repo root: /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system
Viewer runs at localhost:3005. Dev server: cd viewer && npm run dev -- -p 3005

READ THESE FILES FIRST (in order):
1. viewer/lib/types.ts               — ComponentEntry shape
2. viewer/lib/registry.ts            — getFilteredComponents, FilterState
3. viewer/lib/filters.ts             — parseFilters, FilterState
4. viewer/components/Card.tsx        — hover/iframe debounce pattern to replicate
5. viewer/next.config.ts             — existing headers config to extend

YOUR TASK: Create the /pick visual picker route.

FILES TO CREATE:
────────────────

viewer/lib/pick.ts
  Export these pure functions (no React imports):

  buildCallbackPayload(components: ComponentEntry[], session: string, mode: string): object
    Returns canonical pick payload:
    { type: "siso:pick", session, mode, components: [mapped], version: 1, pickedAt: new Date().toISOString() }
    Each component mapped: { source, slug: component.name, installUrl, displayName, category, visualStyle, thumbnail }
    installUrl = "https://siso-design-system.vercel.app/r/" + component.source + "/" + component.name + ".json"

  buildCancelPayload(session: string, reason: "user_closed"|"user_escaped"|"timeout"): object
    Returns: { type: "siso:cancel", session, reason, version: 1, cancelledAt: new Date().toISOString() }

  resolveTargetOrigin(callbackUrl: string | null): string
    If callbackUrl null/empty → "*"
    Otherwise try new URL(callbackUrl).origin, catch → "*"

  encodeRedirectPayload(payload: object): string
    btoa(unescape(encodeURIComponent(JSON.stringify(payload))))

  validateSession(raw: string | null): string
    Valid UUID v4 pattern → return it; else crypto.randomUUID()


viewer/app/pick/page.tsx
  Server component. Reads searchParams (async, Next 15 pattern).
  Accepted params (all optional):
    category (repeatable), style (repeatable), industry (repeatable), complexity (repeatable),
    q, limit (default 24, cap 100), mode ("single"|"multi", default "single"),
    callbackMode ("postMessage"|"redirect"|"webhook", default "postMessage"),
    callbackUrl, session, caller, theme ("dark"|"light", default "dark"),
    preselect (comma-separated "source/slug" pairs)

  Logic:
  1. Parse facet params with parseFilters() from viewer/lib/filters.ts
     Set importMode: "all" — picker shows all components, not just curated
     Set pageSize equal to capped limit
  2. Call getFilteredComponents(filters) from viewer/lib/registry.ts
  3. Sort results: classified first (hasClassification), then alphabetically
  4. Slice to limit
  5. Generate/validate session with validateSession() from viewer/lib/pick.ts
  6. Render full-page layout (no sidebar, no global nav):
     Dark bg: bg-neutral-950 text-white min-h-screen
     Top bar: "SISO Design System — Pick a component" + caller (if provided) + session short-id + match count
     Pass components, session, mode, callbackMode, callbackUrl, preselect to <PickClient>
  7. Add <meta name="viewport"> and <title>


viewer/app/pick/PickCard.tsx
  'use client'. Props:
    component: ComponentEntry
    isSelected: boolean
    onPick: (component: ComponentEntry) => void
    index: number

  Behavior (replicate Card.tsx debounce pattern exactly):
  - mountTimerRef: 150ms debounce on mouseenter → show iframe
  - unmountTimerRef: 500ms delay on mouseleave → hide iframe
  - Larger than Card.tsx — aspect-[4/3] with min-h-[200px]
  - hasThumbnail → show <img> default, swap to <iframe> on hover (same as Card.tsx)
  - !hasThumbnail && isRenderable → always show <iframe>
  - !isRenderable → placeholder div

  Selected state:
  - ring-2 ring-blue-500 border-blue-500 on preview container
  - Checkmark badge: absolute top-right, bg-blue-500 rounded-full, checkmark SVG

  Footer below preview:
  - displayName (truncated, font-medium text-neutral-200)
  - aiSummary 2-line truncation (text-xs text-neutral-400 line-clamp-2)
  - Category pill (text-[10px] bg-neutral-800 rounded px-1.5 py-0.5)
  - Style pills for each visualStyle entry

  Click handler: onPick(component)
  Keyboard: tabIndex={0}, Enter/Space calls onPick


viewer/app/pick/PickClient.tsx
  'use client'. Props:
    components: ComponentEntry[]
    session: string
    mode: "single" | "multi"
    callbackMode: "postMessage" | "redirect" | "webhook"
    callbackUrl: string | null
    preselect: string[]
    caller: string | null
    totalMatched: number
    limit: number

  State: selectedIndex, selectedComponents, fired, searchVisible, searchQuery

  Layout:
  - Top bar with caller + session + match count
  - Search (hidden until Cmd+K or icon click)
  - 3-column grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4)
  - NO virtualizer — picker capped at 100 cards, well below 60-card threshold

  Keyboard (useEffect on window keydown):
  - Arrow keys: move selectedIndex with wrap-around
  - Enter/Space: pick selectedIndex card
  - Escape: fire cancel callback
  - Cmd+Enter / Ctrl+Enter: submit multi selection (multi mode only)
  - Cmd+K: toggle search
  - 1-9: jump to nth card
  - ?: toggle keyboard shortcuts modal

  Callback logic (import helpers from viewer/lib/pick.ts):
  - postMessage: window.parent.postMessage(buildCallbackPayload(...), resolveTargetOrigin(callbackUrl))
  - redirect: window.location.href = callbackUrl + "?siso_picked=" + encodeRedirectPayload(payload) + "&session=" + session
  - webhook: POST callbackUrl JSON, 8s timeout, redirect on success if response.redirect
  - After firing: set fired=true, show "Selection sent" confirmation (replace grid)
  - Cancel: fire buildCancelPayload(session, "user_escaped"), show "Cancelled" state

  Idempotency: once fired=true, ignore further picks (no double-fire)

  Preselect: on mount, find components matching preselect slugs, pre-populate selectedComponents

  Iframe detection: if window.self === window.top and callbackMode === "postMessage":
    Show error: "This picker was opened without a parent window — please use ?callbackMode=redirect&callbackUrl=... instead."


MODIFY: viewer/next.config.ts
  Add a headers() async function to the nextConfig object:

  async headers() {
    return [
      {
        source: '/pick',
        headers: [
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
          // DO NOT add X-Frame-Options — ALLOWALL is not a valid value; omitting the header is correct
        ],
      },
      {
        source: '/pick/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
    ]
  },

  Merge with existing nextConfig (do NOT overwrite webpack, images, typescript, experimental, or output fields).
  The existing config has NO headers() function — add it as a new key only.

VALIDATION:
  cd viewer && npm run build    # Must exit 0
  curl -sI http://localhost:3005/pick | grep -i content-security-policy   # must contain frame-ancestors *
  curl -sI http://localhost:3005/pick | grep -i x-frame-options            # must be empty

DO NOT TOUCH:
  viewer/lib/registry.ts, viewer/lib/filters.ts, viewer/lib/types.ts,
  viewer/components/Card.tsx, viewer/components/ComponentGrid.tsx,
  any file outside viewer/app/pick/, viewer/lib/pick.ts, viewer/next.config.ts

RETURN (single line, no code dump):
[STATUS: AWAITING QA] Phase A complete. Files created: viewer/app/pick/page.tsx, viewer/app/pick/PickClient.tsx, viewer/app/pick/PickCard.tsx, viewer/lib/pick.ts. Modified: viewer/next.config.ts. Build: exit 0.
```

---

## Phase B — `@siso/cli`

**Worker model:** Haiku
**Estimated wall time:** 6h
**Depends on:** nothing (fully independent subproject; calls live Vercel URL, not localhost)
**Repo root (absolute):** `/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system`

### Files

| File | Operation | Notes |
|---|---|---|
| `cli/package.json` | CREATE | bin: siso, type: module, deps: open, chalk, commander |
| `cli/tsconfig.json` | CREATE | ES2022, NodeNext modules |
| `cli/tsup.config.ts` | CREATE | CJS format, shebang banner, no sourcemaps |
| `cli/src/index.ts` | CREATE | Commander root, subcommands, --version |
| `cli/src/commands/pick.ts` | CREATE | Local server + browser open + await callback + stdout JSON |
| `cli/src/commands/add.ts` | CREATE | Parse source/slug, resolve URL, spawn shadcn |
| `cli/src/commands/query.ts` | CREATE | POST /api/query, print JSON |
| `cli/src/commands/list.ts` | CREATE | GET /api/components/meta, print JSON |
| `cli/src/commands/facets.ts` | CREATE | GET /api/facets, print JSON |
| `cli/src/browser.ts` | CREATE | open() wrapper with URL scheme validation |
| `cli/src/local-server.ts` | CREATE | Port alloc, /picked + /cancelled handlers, 127.0.0.1 bind only |
| `cli/src/config.ts` | CREATE | BASE_URL, PICK_TIMEOUT_MS, PREFERRED_PORT |
| `cli/README.md` | CREATE | Usage docs |
| `cli/.npmignore` | CREATE | Exclude src/, tsconfig, tsup.config |
| `cli/.gitignore` | CREATE | Exclude dist/, node_modules/ |

`cli/` is a brand-new independent subproject at the repo root. It does NOT go inside `viewer/`. The viewer does NOT import from `cli/`.

### Acceptance criteria

1. `cd cli && npm install && npm run build && node dist/cli.js --version` — prints version, exits 0
2. `du -sh cli/dist/` — under 2MB
3. `node dist/cli.js pick topbar --limit=3` — opens browser to correct picker URL, starts local server, exits 0 with JSON on stdout within 60s of pick (exits 2 on timeout)
4. `node dist/cli.js add 21st-dev/aliimam-gallery` — spawns `npx shadcn@latest add https://siso-design-system.vercel.app/r/21st-dev/aliimam-gallery.json`, mirrors exit code
5. `node dist/cli.js query "pricing"` — POSTs to `https://siso-design-system.vercel.app/api/query`, prints JSON
6. Local server in pick command binds to `127.0.0.1` only — `lsof -i :9876 | grep LISTEN` shows `127.0.0.1:9876` not `*:9876`
7. `cd cli && npm run build` exits 0

### Worker prompt

See the full prompt body in the planner's inline response — copy from there when dispatching. Summary of deliverables: `cli/` as independent subproject with 15 files, TypeScript + commander + tsup build, 127.0.0.1-only local server, `BASE_URL` from env with default to Vercel deploy URL, exit codes 0=picked / 1=cancelled / 2=timeout.

---

## Phase C — `@siso/mcp-server` (v2, deferred)

Thin MCP wrapper (~200 LOC) using `@modelcontextprotocol/sdk ^1.25` with stdio transport. Exposes 5 tools mirroring the CLI surface: `siso_query`, `siso_pick`, `siso_add`, `siso_list`, `siso_facets`. `siso_pick` uses MCP URL elicitation (SEP-1036, spec 2025-11-25) to ask the MCP client to open the picker URL in a browser, then awaits the callback via a local server identical to Phase B's `local-server.ts`. Deferred because: Phase B must ship + validate first (MCP reuses its pattern); Smithery distribution is a separate workflow.

---

## Quick QA checklist

### Phase A

```bash
REPO=/Users/shaansisodia/SISO_Workspace/SISO_Library/design-system
cd $REPO/viewer && npm run build 2>&1 | tail -5        # exit 0
curl -sI http://localhost:3005/pick | grep -i content-security-policy  # contains "frame-ancestors *"
curl -sI http://localhost:3005/pick | grep -i x-frame-options           # empty
curl -sI http://localhost:3005/ | grep -i "frame-ancestors"             # empty (only on /pick)
```

### Phase B

```bash
cd /Users/shaansisodia/SISO_Workspace/SISO_Library/design-system/cli
npm install && npm run build                              # exit 0
du -sh dist/                                              # <2MB
node dist/cli.js --version                                # prints version
node dist/cli.js list 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print('total:', d.get('total'))"  # positive number
node dist/cli.js pick &
BGPID=$!; sleep 2
lsof -i :9876 | grep LISTEN                              # 127.0.0.1 bind
kill $BGPID 2>/dev/null
```
