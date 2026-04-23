# `/pick` Flow + External Agent Integration Design

**Status:** design · **Date:** 2026-04-23
**Scope:** The killer feature. An external AI coding agent working in someone else's project can pop up a visual picker of every component in this bank matching some facets, the user picks one (or several) with a click, and the code lands in their codebase via `npx shadcn@latest add`. Text-only search forces agents to pick blind; a visual picker with postMessage callback + auto-install is what makes this tool different from every other component registry.

Depends on: `COMPOSE_DESIGN.md` (output formats + install URL resolution), `RANKING_DESIGN.md` (`/api/query` the agent uses to pre-filter before opening the picker).

---

## 1. The `/pick` route — visual grid for external callers

### URL shape

```
https://siso-design-system.vercel.app/pick
  ?category=topbar             # repeatable — same facet names as /api/query + /api/components
  &style=dark                  # repeatable
  &industry=saas               # repeatable
  &complexity=composite        # repeatable
  &q=search+text               # free-text pre-filter (optional)
  &limit=12                    # max cards to show (default 24, hard cap 100)
  &mode=single|multi           # single-pick returns on click; multi shows checkboxes + submit button
  &callbackMode=postMessage    # postMessage | redirect | webhook
  &callbackUrl=<url>           # required for redirect|webhook; ignored for postMessage (uses event.source)
  &session=<uuid-v4>           # opaque caller-provided correlation ID
  &caller=<human-readable>     # optional, shown in header — "Picking for cursor.sh"
  &theme=dark|light            # default: dark
  &preselect=source/slug,...   # optional — pre-highlights cards (for "pick a replacement" flows)
```

Facet param names match `/api/query` exactly. An agent that already uses `/api/query` to shortlist simply passes the same facets to `/pick` so the human sees only the narrowed set.

### Server-side behavior

- `viewer/app/pick/page.tsx` is a server component. It reads `searchParams`, calls `getFilteredComponents(parseFilters(...))` from `lib/registry.ts` (already exists — same function the home grid uses), sorts by effective Elo desc, slices to `limit`, and passes the list to the client component.
- `getFilteredComponents` already returns the full `ComponentEntry[]` with thumbnails, classification, provenance. No new data layer needed.
- `limit` capped at 100 hard — more than that defeats the purpose of a visual picker. If the underlying match-set is huge, show the top `limit` by Elo and display "Showing top 12 of 217 — refine your filters" in the footer.
- `X-Frame-Options` suppressed for `/pick` only (see §8). All other routes keep default same-origin protection.

### Layout

- No sidebar. No nav. No global header. Full-screen focused picker.
- Dark theme by default (matches agent-tool aesthetic — Cursor, Claude Code, GitHub Copilot all default dark).
- Cards are **larger** than on `/`: target 600×450 rendered (aspect 4:3). On a 1400px viewport that's 3 cols × ~440px wide. On a 2000px viewport still 3 cols but bigger. Mobile falls back to 1 col.
- Per-card: large thumbnail + displayName + 2-line `ai_summary` truncation (not just the name, like the main grid) + category pill + style pills.
- Hover swaps the thumbnail for a live iframe (reuse `Card.tsx` hover pattern — 150ms mount debounce, 500ms unmount delay).
- Selected state (multi-mode or hovered-in-single): thick 3px accent border + checkmark badge in top-right corner.

### Top bar

```
┌───────────────────────────────────────────────────────────────────────┐
│ SISO Design System — Pick a component                                 │
│                                                                       │
│ For: cursor.sh  •  Session: 3f9b…  •  12 of 217 matches shown         │
│                                                                       │
│ [category ▾] [style ▾] [industry ▾] [complexity ▾]    [🔀 Shuffle]    │
└───────────────────────────────────────────────────────────────────────┘
```

Facet dropdowns let the user further refine client-side without a round-trip. Search box hidden by default (agent already pre-filtered) — togglable via `⌘K` or a tiny 🔍 icon.

### Keyboard navigation (required)

| Key | Action |
|-----|--------|
| `←` `→` `↑` `↓` | Move selection between cards |
| `Enter` | Pick the selected card (single-mode) or toggle it (multi-mode) |
| `Space` | Same as Enter |
| `Esc` | Cancel → fire `siso:cancel` to caller |
| `⌘Enter` / `Ctrl+Enter` | Submit picks (multi-mode only) |
| `⌘K` | Focus search |
| `?` | Show keyboard shortcuts overlay |
| `1`-`9` | Jump to nth card |

Focus ring is visible; arrow keys wrap (moving right from last card wraps to first).

---

## 2. Callback mechanics — three modes

The picker emits one of two events on user action: **pick** or **cancel**. Payload shape is identical across callback modes; only the transport differs.

### Canonical pick payload

```json
{
  "type": "siso:pick",
  "session": "3f9b8c40-2ad8-4c55-a6fe-0e2c2f1b9a71",
  "mode": "single",
  "components": [
    {
      "source": "21st-dev",
      "slug": "glass-topbar-pro",
      "installUrl": "https://siso-design-system.vercel.app/r/21st-dev/glass-topbar-pro.json",
      "displayName": "Glass Topbar Pro",
      "category": "topbar",
      "visualStyle": ["dark", "glassmorphism"],
      "thumbnail": "https://siso-design-system.vercel.app/thumbnails/21st-dev__glass-topbar-pro.png"
    }
  ],
  "version": 1,
  "pickedAt": "2026-04-23T18:42:15.201Z"
}
```

### Canonical cancel payload

```json
{
  "type": "siso:cancel",
  "session": "3f9b8c40-2ad8-4c55-a6fe-0e2c2f1b9a71",
  "reason": "user_closed" | "user_escaped" | "timeout",
  "version": 1,
  "cancelledAt": "2026-04-23T18:42:15.201Z"
}
```

### (a) `postMessage` — preferred for iframe embedding

```js
window.parent.postMessage(
  { type: "siso:pick", session, components, mode, version: 1, pickedAt },
  targetOrigin
)
```

- `targetOrigin` resolved from `callbackUrl` query param's origin (e.g. `https://cursor.sh`). If `callbackUrl` missing, fall back to `"*"` but log a warning — in production we always want a specific origin.
- Caller listens on `window`:
  ```js
  window.addEventListener("message", (e) => {
    if (e.data?.type !== "siso:pick") return
    if (e.data.session !== mySession) return // correlate
    installComponents(e.data.components)
  })
  ```
- Caller is responsible for removing/hiding the iframe after receiving the event.

### (b) `redirect` — for tab-opened picker or agents without iframe capability

On pick:
```
302 → {callbackUrl}?siso_picked=<base64-urlsafe-encoded-JSON>&session=<id>
```

On cancel:
```
302 → {callbackUrl}?siso_cancelled=1&reason=user_closed&session=<id>
```

Base64 payload is the canonical pick payload above, JSON-stringified and URL-safe base64 encoded. At 1 component payload is ~500 bytes base64; at 10 components ~4KB (still under most URL limits). If payload would exceed 6KB, fall back to webhook mode if configured, otherwise show an error page with "Copy payload manually" button.

### (c) `webhook` — server-to-server (optional; v1.5)

On pick:
```
POST {callbackUrl}
Content-Type: application/json
X-Siso-Session: <id>

<canonical pick payload>
```

- Response body (JSON) is treated as instructions back to the picker:
  ```json
  { "redirect": "https://cursor.sh/installed?ok=1", "message": "Component installed! Returning to Cursor..." }
  ```
- If response provides `redirect`, picker navigates the browser there after showing `message` for 1.5s.
- If response is non-2xx, picker shows a generic "Something went wrong — try again" UI with the selected component details visible so the user isn't stranded.
- Timeout on webhook POST: 8 seconds. Timeout shows a "Server didn't respond, try again" UI.

### Negotiation

If `callbackMode` is missing, default to `postMessage`. If the picker is NOT iframed (detected by `window.self === window.top`) and `postMessage` was requested, show an error page: "This picker was opened without a parent window — please use `?callbackMode=redirect&callbackUrl=...` instead."

---

## 3. `session` param — correlation, not persistence

- Opaque string the caller generates. Recommended: UUID v4.
- Echoed verbatim in every callback (`pick`, `cancel`, webhook body, webhook headers).
- The picker does **not** persist session state server-side. No `/api/sessions` table, no DB rows. It's purely a correlation ID the caller matches against their own outstanding picks.

### What `session` enables

- **Concurrent picks.** An agent can open 3 pickers simultaneously (topbar, hero, footer) in 3 tabs. Each has its own `session`. Caller correlates responses without serializing the UX.
- **Retry semantics.** If the caller's listener missed an event (e.g. iframe was destroyed too fast), they know which session never got a response and can retry or give up.
- **Idempotency.** The picker prevents double-fires per session: once `siso:pick` or `siso:cancel` fires for a session, further user actions are ignored (picker shows "Selection sent" confirmation state).
- **Analytics (v2).** If we ever want to track pick-through rate per caller, session + caller origin is the natural join key. Explicitly out of scope for v1; mention in §9.

### If `session` is missing

Server generates one (UUIDv4), includes it in payload, displays it in the header under "Session:". Caller without correlation is fine for simple single-shot flows.

---

## 4. Embedding patterns — how external agents open the picker

### (a) For AI coding agents inside an IDE (Cursor, Claude Code, GitHub Copilot)

Recommended: **CLI + redirect callback + local webhook** (see §5).

Flow:
1. Agent detects user intent ("I need a topbar")
2. Agent shells out: `npx siso pick --category=topbar --limit=10`
3. CLI prints the picker URL and opens default browser
4. User picks visually
5. Picker redirects to `http://localhost:{random}/picked?siso_picked=...`
6. CLI's local HTTP server captures it, parses, prints JSON to stdout, shuts down
7. Agent reads stdout, runs `npx siso add <source>/<slug>`

### (b) For web apps and playgrounds

Iframe embedding:
```html
<iframe
  src="https://siso-design-system.vercel.app/pick?category=topbar&callbackMode=postMessage&session=xyz"
  width="100%"
  height="800"
/>
<script>
window.addEventListener("message", (e) => {
  if (e.origin !== "https://siso-design-system.vercel.app") return
  if (e.data?.type === "siso:pick" && e.data.session === "xyz") {
    handlePick(e.data.components)
  }
})
</script>
```

### (c) For CLI tools and terminals

Same as (a). Always uses a local HTTP server + random port + redirect mode.

---

## 5. The `npx siso` CLI

Published as `@siso/cli` on npm. Binary name: `siso`.

### Command surface

```
npx siso                                     # interactive menu
npx siso pick <category>                     # open picker, print JSON to stdout
npx siso query "pricing card"                # POST /api/query, print top N
npx siso add <source>/<slug>                 # wraps npx shadcn add <registry-url>
npx siso list                                # manifest meta
npx siso facets                              # current facet vocabulary
```

### `siso pick` internals

1. Generate `session = crypto.randomUUID()`
2. Find free local TCP port (preferred 9876, fallback OS-assigned via `:0`). Bind to `127.0.0.1:{port}` only.
3. Register handlers for `/picked` and `/cancelled`
4. Open browser via npm `open` package (validates URL scheme first)
5. Wait for callback or timeout (default 300s)
6. On pick: write JSON payload to stdout, exit 0
7. On cancel: write cancel to stderr, exit 1
8. On timeout: write timeout error to stderr, exit 2
9. Tear down HTTP server before exiting

### `siso add` internals

1. Parse `<source>/<slug>` from argv
2. Resolve: `https://siso-design-system.vercel.app/r/{source}/{slug}.json`
3. Spawn `npx shadcn@latest add {url}` with inherited stdio
4. Exit code mirrors shadcn

### Distribution (per CLI+MCP research findings)

- Publish `@siso/cli` as scoped public npm package (free npm org)
- `bin: { siso: "./dist/cli.js" }` in package.json
- Bundle via `tsup` (3M weekly downloads, esbuild-powered, 1.2s build) — CJS format with shebang banner
- Node 18+ target, sourcemaps off, no TS shipped
- Cross-platform browser open via `open` v9+ npm package
- `smithery.yaml` + `llms-install.md` for agent marketplace discovery

---

## 6. Worked example — full end-to-end flow

**User:** "I need a topbar with a search bar and user avatar."
**Agent running in Claude Code:**

1. Agent parses intent → category=navigation, keywords=[topbar, search, avatar]
2. Agent runs `npx siso query "topbar with search and user avatar"` → top 3 close scores
3. Scores close, let human pick visually
4. Agent runs `npx siso pick --category=navigation --q="topbar search avatar" --limit=10`
5. CLI starts local server on port 9876 (or random fallback). Browser opens picker URL
6. User sees 10 topbar variations, picks 4th with arrow-enter. Browser navigates to localhost:9876/picked
7. Local server decodes payload, prints to stdout, exits 0
8. Agent extracts source/slug from stdout
9. Agent runs `npx siso add 21st-dev/glass-topbar-pro`
10. Under hood: `npx shadcn@latest add https://siso-design-system.vercel.app/r/21st-dev/glass-topbar-pro.json`
11. Component lands in `components/ui/glass-topbar-pro.tsx`
12. Agent continues building, knows the component API from the classification metadata

Total human interaction: **one visual pick**.

---

## 7. MCP server — v2 wrapper (~0.5 day once CLI ships)

Per research, MCP has **URL mode elicitation** (SEP-1036 in spec 2025-11-25) — spec-sanctioned way to ask the client to open a URL. This is the clean primitive for our picker.

### Package: `@siso/mcp-server`

MCP tools:

| Tool | Equivalent CLI |
|------|---------------|
| `siso_query(facets, limit)` | `siso query` |
| `siso_pick(facets, mode, multi)` | `siso pick` — uses URL elicitation to open picker |
| `siso_add(source, slug)` | `siso add` |
| `siso_list()` | `siso list` |
| `siso_facets()` | `siso facets` |

Uses `@modelcontextprotocol/sdk ^1.25` (stdio transport). ~200 LOC wrapping CLI.

Distribution via Smithery (7k+ MCP servers indexed, dominant marketplace as of April 2026) + official registry.

---

## 8. Security

### `/pick` is public, no auth

Components are public knowledge. No login, no rate limit on `/pick` itself (static Next page). This is fine because the callback doesn't receive any user secrets — just a component selection.

### CORS + iframe embedding

- `viewer/next.config.ts` strips `X-Frame-Options` on `/pick` only
- `Content-Security-Policy: frame-ancestors *` on `/pick` — explicitly iframe-embeddable from any origin
- All other routes keep default same-origin protection

### `postMessage` targetOrigin discipline

- Always validate `event.origin` on the receiver side
- Never use `targetOrigin: "*"` for non-trivial data (per postMessage 2026 best practices)
- If `callbackUrl` absent, fall back to `"*"` with logged warning (not sensitive data in our case)

### CLI local server

- Bound to `127.0.0.1` only (never `0.0.0.0`)
- Preferred port 9876, fallback random via `:0`
- Shuts down on first valid hit or timeout
- Only handles `/picked` and `/cancelled`; everything else 404

---

## 9. Future extensions (v2+)

| Extension | Sketch |
|-----------|--------|
| Diff mode | `/pick?diff=source1/slug1,source2/slug2` — side-by-side A/B |
| Remix mode | User picks 2, viewer generates "blend" brief, shows new grid |
| Explain mode | Agent asks "why this one?" → viewer returns score breakdown |
| Embedded chat preview | Inline iframe in chat transcripts |
| Personalized recommendations | CLI reports picks, ranker boosts similar |
| Session analytics | Per-caller pick-through rate (opt-in) |
| Pick-for-me | Model picks automatically based on learned prefs |
| Multi-framework install | `siso add --framework=remix` rewrites imports |

---

## 10. Implementation plan — phased

### Phase A — `/pick` route (Haiku, ~4h)

CREATE:
- `viewer/app/pick/page.tsx` (server component, renders PickClient)
- `viewer/app/pick/PickClient.tsx` (client: grid, keyboard nav, callback dispatch)
- `viewer/app/pick/PickCard.tsx` (picker-specific card, reuses Card.tsx hover pattern)
- `viewer/lib/pick.ts` (shared helpers: buildCallbackPayload, fireCallback, validateSession, resolveTargetOrigin, encodeRedirectPayload)

MODIFY:
- `viewer/next.config.ts` — headers override for `/pick` (no X-Frame-Options, CSP frame-ancestors *)

### Phase B — `@siso/cli` (Haiku, ~6h)

New subproject at `cli/`. Per research (section 15 of CLI_AND_MCP_PATTERNS):
- `tsup` bundler, CJS format with shebang banner
- `bin: { siso: "./dist/cli.js" }` in `package.json`
- Commands: `pick`, `add`, `query`, `list`, `facets` (minimal v1)
- `open` npm package for cross-platform browser opening
- Local server with port fallback pattern (preferred → OS-assigned)
- `smithery.yaml` + `llms-install.md` at repo root

Publish: `npm publish --access public` under `@siso/cli`

### Phase C — `@siso/mcp-server` (Sonnet, ~1 day; v2)

New subproject at `mcp/`. Per research:
- `@modelcontextprotocol/sdk ^1.25`
- Stdio transport
- 5 tools matching CLI commands
- Use URL elicitation (SEP-1036) for `siso_pick` to launch browser
- Publish to Smithery + official registry

---

## 11. Acceptance criteria

1. `GET /pick?category=topbar&limit=6` renders 6 cards; keyboard nav works
2. `postMessage` fires with canonical pick payload on pick
3. `postMessage` fires with canonical cancel payload on Esc
4. Redirect mode navigates to `{callbackUrl}?siso_picked=<base64>&session=<id>`
5. `X-Frame-Options` NOT set on `/pick`; CSP `frame-ancestors *` IS set
6. Cold-start load of `/pick` on Vercel under 1.5s
7. Two parallel pick sessions with different UUIDs don't cross-contaminate
8. `npx siso pick topbar` opens browser, prints JSON pick payload to stdout, exits 0 within timeout
9. `npx siso add 21st-dev/<slug>` installs the component in a fresh `create-next-app` cleanly
10. Full E2E: `npx siso pick topbar --json | jq -r '.components[0] | "\(.source)/\(.slug)"' | xargs npx siso add` works end-to-end
11. Picker does NOT double-fire for same session (idempotency)
12. CLI local server binds to `127.0.0.1` only

---

## 12. Cross-plan dependencies

- **RANKING_DESIGN (`/api/query`)** ships first — CLI's `siso query` is sugar over it
- **COMPOSE_DESIGN** provides `installUrl` resolution — `lib/pick.ts` reuses
- **DEPLOY_AND_REGISTRY_DESIGN** — ships the public `/r/{source}/{slug}.json` URLs that `siso add` resolves
- Thumbnails + classification pipelines — picker cards depend on both (already shipped)

---

## 13. What this explicitly does NOT include

- Live code editing / forking inside picker
- Pairwise rating UX inside picker (stays at `/rate/swipe`)
- AI-assisted "pick for me" auto-selection
- Multi-framework codegen in `siso add` (Next.js only v1)
- Server-side session store (correlation-ID only)
- Analytics (v2, opt-in)
- Auth on the picker (intentionally public)
