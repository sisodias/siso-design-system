# Competing Products Research: AI Agents Selecting and Installing UI Components

**Date:** 2026-04-23

---

## Q1: v0.dev — generative, not curation

**Finding:** No visual component gallery to pick from. Purely generative. Public REST API at `api.v0.dev` + `v0-sdk` npm package. MCP adapter at `v0.app/docs/api/platform/adapters/mcp-server`. Pricing: Free ($5 credits/mo), Premium ($20), Team ($30/user), Business ($100/user).

**Gap for us:** v0 always generates. Cannot browse, filter, and pick from a pre-existing curated bank.

---

## Q2: 21st.dev Magic MCP — in-IDE text, no visual grid

**Finding:** `@21st-dev/magic` MCP server (4.8k GitHub stars, last commit Feb 2026). Installs into Cursor/Windsurf/VSCode/Claude Code. Primary trigger: type `/ui` in IDE agent chat and describe what you want. Generates or retrieves. All text — no visual picker. Requires paid API key. Closest active competitor.

**Gap for us:** No visual grid. "Pick" is after generation (text-listed variations). No semantic filter by industry/style at query time.

---

## Q3: shadcn CLI ecosystem — explicitly agent-first

**Finding:** shadcn CLI v4 (March 2026) — "built for coding agents" framing. Additions: `--preset` (design system pack), `shadcn/skills` (agent context), `--dry-run/--diff/--view`, `registry:base`, official MCP.

Parallel ecosystem:
- **shadcn.io/mcp** (paid, $19/mo): 6,000+ blocks, 285k icons, screenshots, analytics rank. "No more hallucinated props."
- **Jpisnice/shadcn-ui-mcp-server** (community): shadcn/ui v4 metadata
- **bit.dev, Storybook:** no pick-and-install

**Gap for us:** Both official + third-party shadcn MCPs are text-chat driven — no visual grid, no industry filter. shadcn.io is closest but lives in IDE chat.

---

## Q4: Iframe picker prior art

**Finding:** Framer Marketplace is the clearest precedent — visual card grid, category filter, click → canvas preview, copy-to-project. No equivalent exists in the React/shadcn/Tailwind ecosystem. Webflow has no component marketplace. Builder.io is Figma-centric.

**Gap for us:** Framer's UX is best-in-class but locked to Framer runtime. Zero equivalent for React/shadcn with postMessage + CLI install callback.

---

## Q5: MCP servers for UI libraries — enumeration

| Server | Source | Purpose | Stars |
|---|---|---|---|
| `@21st-dev/magic` | github.com/21st-dev/magic-mcp | In-IDE `/ui` generation | 4.8k |
| shadcn official MCP | ui.shadcn.com/docs/mcp | Browse/search/install any registry | official |
| shadcn.io MCP (paid) | shadcn.io/mcp | 6k+ blocks, screenshots, analytics | commercial |
| `shadcn-ui-mcp-server` | Jpisnice | shadcn v4 metadata | community |
| v0 MCP adapter | v0.app | Wraps v0 API | official |

No cross-library MCP (shadcn + magic-ui + aceternity in one query). **That space is unoccupied.**

---

## Q6: Polaris / Material / Chakra / Radix — zero agent install

**Finding:** None have pick-and-install flow. Polaris/Material/Chakra/Radix are all npm + docs + copy-paste. Chakra CLI only generates theme typings.

**Gap for us:** Dominant non-shadcn systems have zero agent-facing install infrastructure. Entire user base unserved.

---

## Q7: Generative tools — all generation, no curation

**Finding:** v0, Lovable, Bolt, Galileo AI (now Google Stitch) — all generative. No curation side. OpenUI is a W3C spec effort. No tool lets you browse pre-made components by semantic filter + install.

**Gap for us:** "Generation vs. curation" axis is unoccupied on the curation side for React/shadcn. Catalog = distinct positioning.

---

## Q8: Registry directory landscape — April 2026

**Finding:** registry.directory catalogs 40+ shadcn-compat registries with live counts. Notable: React Bits (38.6k stars, 520 items), AI Elements (23.7k, 77), Magic UI (20.8k, 236), Coss UI (9.5k, 551), Assistant UI (9.6k, 34), Animate UI (3.6k, 580), ElevenLabs UI (2.2k, 50). Official shadcn: 405 items, 112.7k stars.

UX: card grid → Explore → IDE-style file viewer → copy install command. **No agent API. No postMessage. No semantic tags.**

**Gap for us:** Stop at copy-paste. No agent callback. No semantic filter. Position as "registry.directory + semantic search + agent install callback."

---

## Q9: "Agent-first UI library" positioning

**Finding:** Two products explicitly use "built for AI" language:

1. **Coss UI** (coss.com/ui, 9.5k stars): "Built for developers and AI." Has "Built for Humans and AI" docs, `llms.txt`, Skills docs. Cal.com design system.
2. **AI Elements** (Vercel, 23.7k stars): AI-UI components (chat bubbles, message streams), not general UI.

**Nobody explicitly markets as "the library AI agents pick from via semantic query."** Open space.

---

## Q10: Pick-and-preview UX patterns — top 5

1. **Framer Marketplace** — visual grid, category, click → canvas preview. Best UX but locked to Framer runtime.
2. **registry.directory** — card grid + IDE-style viewer. Developer-facing. No visual rendered preview.
3. **shadcn.io MCP terminal flow** — text only. `search_items('pricing') → 40 blocks` → `get_item_details(slug)` returns screenshot. Agent-native pick but no grid for humans.
4. **v0.dev post-gen preview** — not a picker. Polished iframe sandbox after generation.
5. **Builder.io Visual Editor** — drag-drop sidebar → renders in preview. Locked to Builder runtime.

**Gap for us:** No tool combines (a) visual grid of pre-made + (b) semantic filter + (c) one-click install outside proprietary runtime. Framer UX + shadcn CLI + semantic search = unoccupied.

---

## Top 3 to steal

1. **Framer Marketplace's visual card grid UX** — adapt for React
2. **shadcn.io MCP's screenshot-per-block + analytics ranking** — every component gets light/dark/framed screenshots, popularity signal
3. **shadcn CLI v4's `--preset` + `registry:base`** — style packs applied as unit

---

## Top 3 traps to avoid

1. **Being another generation tool** — v0/Lovable/Bolt/Galileo saturated. Position as curation, not generation. Message must be clear.
2. **Text-only agent interface** — every MCP competitor is IDE chat. Visual `/pick` grid IS the differentiator. MCP-only = indistinguishable.
3. **Registry-only positioning** — registry.directory already aggregates 40+. Don't position as "another aggregator." Differentiator is semantic query + agent install callback.

---

## Positioning summary

No one currently owns: **semantic query (category + style + industry) + visual `/pick` grid + agent install callback outside a proprietary runtime.**

That's our exact space.
