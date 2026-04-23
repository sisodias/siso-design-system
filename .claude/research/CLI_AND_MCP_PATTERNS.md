# CLI + MCP Patterns Research

**Date:** 2026-04-23
**Informs:** `@siso/cli` + `@siso/mcp-server` design

---

## 1. Browser-opening CLIs that receive callbacks

| Tool | Auth | Port | Timeout | Key lesson |
|------|------|------|---------|-----------|
| `gh auth login` | OAuth device flow | No local server | Infinite polling | Bug: polling only starts after Enter |
| `vercel login` | OAuth redirect | Fixed `:3557` | ~5min | Port in use = hard failure |
| `wrangler login` | OAuth redirect | Fixed `:8976` | ~5min | `--callback-port` flag |
| `supabase login` | OAuth redirect | **Random OS-assigned (`:0`)** | ~5min | Best practice |
| `smithery auth login` | Browser + polling | URL shown | ~5min | Supports headless |

**Lessons:**
- Start polling **before** opening browser (don't gate on Enter)
- Random port (`:0`) is the correct answer — requires OAuth server to allow loopback redirects
- Always print URL in plain text for headless/CI fallback
- Device flow survives firewalls better than local-server
- 5 minutes = industry standard timeout

---

## 2. npm publish for scoped packages

**Paid org required?** NO. Free public orgs since 2017.

**Procedure:**
1. Create account + free org `@siso`
2. `npm publish --access public`

**Time to live:** 2-5 min for CDN propagation.

**Idiomatic:**
```json
{
  "name": "@siso/cli",
  "bin": { "siso": "./dist/cli.js" }
}
```
- `npx @siso/cli@latest` — first-run
- `siso` after `npm i -g @siso/cli`

**Recommendation:** `bin: { siso }` inside `@siso/cli`. No separate unscoped package.

---

## 3. CLI packaging in 2026

**Winner: `tsup`** (3M weekly downloads). esbuild-powered, 1.2s build.

```ts
export default defineConfig([{
  entry: { cli: 'src/cli.ts' },
  format: ['cjs'],
  banner: { js: '#!/usr/bin/env node' },
  platform: 'node',
  target: 'es2022',
}])
```

- **Bundle**, don't ship TS source (bad for `npx` one-shot)
- **Target Node 18+** (Node 22 LTS)
- **No sourcemaps** for CLI bin (size waste)
- Node 22/23 added native CJS-requires-ESM, reducing dual-publish pain

---

## 4. Cross-platform browser opening

**Use `open` (npm, ~50M weekly downloads, Sindre Sorhus).**

```ts
import open from 'open'
await open('https://example.com/auth')
```

- v9+ is ESM-only; use v8 for CJS
- macOS `open`, Linux `xdg-open`, Windows `start`
- **Security: validate URL scheme.** Only allow `http:`/`https:`. Never `javascript:`, `file:`.
- `opn` is old name, abandoned 2019. Don't use.

---

## 5. Local HTTP server — port-in-use strategy

```ts
async function startCallbackServer() {
  const PREFERRED = 9876
  try { return await listenOnPort(PREFERRED) }
  catch (e) {
    if (e.code === 'EADDRINUSE') return await listenOnPort(0) // OS picks
    throw e
  }
}
```

**Caveat:** Random port requires OAuth server to allow loopback redirects (`localhost:*`). Auth0/Supabase/Clerk support; Cloudflare/Wrangler don't.

Fallback if server doesn't allow: device flow (gh pattern).

---

## 6. MCP spec — April 2026

**Latest version: `2025-11-25`**

| Version | Status |
|---|---|
| 2025-11-25 | Current |
| 2025-06-18 | Previous, widely supported |
| 2024-11-05 | Deprecated |

**Major changes since 2025-06-18:**
- **URL mode elicitation (SEP-1036)** — servers can ask client to open a URL. **This is the spec-sanctioned way to trigger our browser picker from MCP.**
- OAuth Client ID Metadata Documents
- Durable tasks with polling + deferred results (experimental)
- Server icons on tools/resources/prompts
- Incremental OAuth scope via `WWW-Authenticate`
- Tool calling in sampling (`tools` + `toolChoice`)
- JSON Schema 2020-12 default
- Streamable HTTP: 403 on invalid Origin headers

`@modelcontextprotocol/sdk` in `@21st-dev/magic`: `^1.25.3` (Feb 2026 security patch).

---

## 7. MCP server discovery + install

### Claude Desktop
Settings → Extensions → Browse. Anthropic-curated + manual JSON.

### Claude Code
```bash
claude mcp add <name>
```

### Universal config
```json
{
  "mcpServers": {
    "@siso/mcp-server": {
      "command": "npx",
      "args": ["-y", "@siso/mcp-server@latest"],
      "env": { "SISO_API_KEY": "key" }
    }
  }
}
```

| Client | Config path |
|---|---|
| Claude Desktop | Settings or `~/.claude.ai/config` |
| Claude Code | `project/.claude/mcp_config.json` |
| Cursor | `~/.cursor/mcp.json` |
| Windsurf | `~/.codeium/windsurf/mcp_config.json` |
| VS Code | User settings JSON |

### Smithery — dominant registry

**smithery.ai** — 7,484+ MCP servers (April 2026).

```bash
npm i -g @smithery/cli
smithery auth login
smithery mcp add <slug>
```

Publish: add `smithery.yaml` to repo root.

Official MCP registry: modelcontextprotocol.io/registry/about (smaller, Anthropic-curated).

---

## 8. @21st-dev/magic — dissection

**Repo:** github.com/21st-dev/magic-mcp
**Stars:** 4.8k | **Forks:** 328
**SDK:** `@modelcontextprotocol/sdk ^1.25.3`

### Install
```bash
npx @21st-dev/cli@latest install cursor --api-key <key>
```

### Tools exposed
- `21st_magic_component_builder` — NL → React component
- `21st_magic_component_inspiration` — search/browse
- `21st_magic_component_refiner` — polish existing
- `logo_search` — brand logos (JSX/TSX/SVG)

### Picker strategy
**No browser picker. Text only.** User types `/ui <desc>`, tool returns code. No iframe, no postMessage, no local server.

### Traction
- 4.8k stars in ~14 months
- Built into Claude Code's default MCP stack
- Smithery + Cursor + Windsurf listings
- Ships `llms-install.md` in repo root

---

## 9. Other shipped UI/design MCP servers

| Server | Purpose | Pattern |
|---|---|---|
| `@21st-dev/magic` | React gen | API key env, stdio |
| Figma MCP (unofficial) | Read Figma | API key REST bridge |
| Storybook MCP (community) | Query stories | Local process |
| shadcn/ui MCP (community) | Install shadcn | npx passthrough |

**Repeating patterns:**
1. API key via env var (agents need scriptable configs)
2. `npx -y @pkg@latest` command — zero install friction
3. `smithery.yaml` for marketplace distribution
4. `llms-install.md` for machine-readable docs

---

## 10. MCP boilerplate

Official SDK: `@modelcontextprotocol/sdk ^1.25.3`

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

const server = new McpServer({ name: '@siso/mcp-server', version: '0.1.0' })

server.tool(
  'pick_component',
  'Find and return a SISO UI component matching the description',
  { query: z.string(), context: z.string().optional() },
  async ({ query, context }) => {
    const code = await fetchComponent(query)
    return { content: [{ type: 'text', text: code }] }
  }
)

await server.connect(new StdioServerTransport())
```

No official scaffolder. Best starting point: github.com/modelcontextprotocol/servers (`filesystem`/`everything` examples).

Alt: `mcp-framework` (mcp-framework.com) — class-based, decorators, smaller community.

---

## 11. Agent discoverability

| Agent | Mechanism |
|---|---|
| Cursor | `.cursorrules` at project root, auto-read |
| Claude Code | `~/.claude/skills/` + CLAUDE.md + Smithery |
| GitHub Copilot | No plugin/tool registry |
| Aider | `.aider.conf.yml`, no plugins |

**Winning adoption pattern (2026):**
1. Smithery listing (table stakes)
2. `llms-install.md` in repo root (21st.dev pioneered, now expected)
3. VS Code one-click badge in README
4. Slash command trigger (`/siso`, `/ui`) — lowers activation energy
5. Include in CLAUDE.md of target repos

---

## 12. Successful agent-first dev tools (traction)

### Context7 (upstash/context7-mcp)
- **13k Smithery installs**, ~3k GitHub stars
- Solves: stale training data / hallucinated APIs
- UX: `use context7` appended to any prompt
- Won on: universal problem + frictionless trigger

### @21st-dev/magic
- 4.8k stars, built into Claude Code
- Framing: "v0 in your editor"
- Won on: `/ui` trigger, no context switching

### Exa Search MCP
- **59.8k Smithery installs** (highest)
- Solves: web search for every agent
- Won on: universal utility + clean structured API

**Common thread:** concrete job-to-be-done, zero-install `npx`, Smithery first.

---

## 13. Common CLI pitfalls

### TTY detection
```ts
const isInteractive = process.stdout.isTTY
// CI/Docker/agent: isTTY false/undefined
```

### Piping
```ts
// Status → stderr, data → stdout
process.stderr.write('Fetching...\n')
process.stdout.write(JSON.stringify(result) + '\n')
```

### Colors
Use `chalk` (auto-respects `NO_COLOR`, `CI=true`, `TERM=dumb`). Never hardcode ANSI.

### Windows paths
`path.join()` always. `open` v9+ handles Windows shell escaping post-CVE-2024-36138.

### Agent detection
```ts
const runningInAgent = !process.stdin.isTTY
  || !!process.env.CI
  || !!process.env.CLAUDE_CODE_AGENT
```

---

## 14. postMessage security 2026

```ts
// SENDER:
window.opener.postMessage(
  { type: 'COMPONENT_SELECTED', payload: selected },
  'https://your-exact-origin.com'  // NEVER '*' for sensitive data
)

// RECEIVER:
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://picker.siso.dev') return  // validate
  if (e.data?.type !== 'COMPONENT_SELECTED') return
  handle(e.data.payload)
})
```

**Rules:**
- Never `targetOrigin: '*'` for sensitive data
- Always validate `event.origin`
- CSP: `frame-ancestors 'self' https://allowed-host.com`
- For CLI: local HTTP is cleaner than postMessage

---

## 15. Minimum viable shipped CLI + MCP — v1

| # | Build | Skip to v2+ |
|---|---|---|
| 1 | `@siso/cli` — CJS bundle via tsup, `bin: { siso }` | Windows native installer |
| 2 | `siso login` — OAuth redirect (random port + device code fallback) | Enterprise SSO |
| 3 | `@siso/mcp-server` — separate package, stdio, SDK ^1.25 | Remote HTTP transport |
| 4 | One core tool: `pick_component(query, context?)` → code inline | Multiple tools (refiner, inspiration, logos) |
| 5 | `llms-install.md` + `smithery.yaml` + VS Code badge | Browser picker iframe (postMessage) |

**What to defer:**
- Visual picker — text `/ui` works in v1, what every successful MCP ships
- Windows installer / native binary
- Plugin system
- Cursor rules auto-injection (document instead)
- Multiple MCP tools beyond core

---

## References

| Topic | URL |
|---|---|
| MCP spec 2025-11-25 changelog | modelcontextprotocol.io/specification/2025-11-25/changelog |
| gh auth login bug | github.com/cli/cli/issues/12925 |
| wrangler callback port | github.com/cloudflare/workers-sdk/issues/11959 |
| tsup vs unbuild vs pkgroll | pkgpulse.com/blog/tsup-vs-unbuild-vs-pkgroll-typescript-library-bundling-2026 |
| npm scoped packages | docs.npmjs.com/creating-and-publishing-scoped-public-packages |
| Smithery | smithery.ai |
| 21st-dev/magic-mcp | github.com/21st-dev/magic-mcp |
| Claude Desktop MCP | support.claude.com/en/articles/10949351 |
