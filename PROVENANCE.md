# Provenance Map

Every component in this bank has a traceable origin. This doc maps every folder to its source app and original file path.

---

## Table 1: Lumelle Harvest

| Bank Folder | Source App | Original Source Path | One-line Description | Status |
|---|---|---|---|---|
| `agent-plan` | Lumelle | `components/agent-plan/` | Animated task planner with MCP tool badges | raw |
| `analytics-card` | Lumelle | `components/analytics-card/` | Responsive analytics card with animated bar chart | raw |
| `animated-card` | Lumelle | `components/animated-card/` | Card with layered chart visual and hover-reveal tooltip | raw |
| `animated-card-chart` | Lumelle | `components/animated-card-chart/` | 3D glass-morphism card with animated bar charts | raw |
| `animated-card-diagram` | Lumelle | `components/animated-card-diagram/` | Multi-layered card with SVG donut chart and tech badges | raw |
| `anomaly-heatmap` | Lumelle | `components/anomaly-heatmap/` | Data visualization with intensity-based heatmap grid | raw |
| `avatar` | Lumelle | `components/avatar/` | Avatar component with fallback and status support | raw |
| `award` | Lumelle | `components/award/` | Multi-variant awards component (6 styles) | raw |
| `badge` | Lumelle | `components/badge/` | Shadcn/ui badge with variant styling | raw |
| `bar-chart` | Lumelle | `components/bar-chart/` | Shadcn-style chart wrapping recharts | raw |
| `button` | Lumelle | `components/button/` | Button component with multiple variants | raw |
| `card` | Lumelle | `components/card/` | Shadcn/ui card primitive | raw |
| `card-8` | Lumelle | `components/card-8/` | Animated alert card with spring animations | raw |
| `circular-navigation` | Lumelle | `components/circular-navigation/` | Full-screen circular nav menu | raw |
| `countdown-number` | Lumelle | `components/countdown-number/` | Animated countdown timer with smooth number transitions | raw |

---

## Table 2: 21st.dev Components

Full list in `_external/21st-dev/catalog.json`. Sampled first 10:

| Component Name | Source | Bank Path |
|---|---|---|
| AnimatedNumberCountdown | 21st.dev | `_external/21st-dev/countdown-number/` |
| Badge | shadcn/ui | `_external/21st-dev/badge/` |
| SearchBar | 21st.dev | `_external/21st-dev/search-bar/` |
| FuturisticFileUploader | 21st.dev | `_external/21st-dev/futuristic-file-uploader/` |
| AgentPlan | 21st.dev | `_external/21st-dev/agent-plan/` |
| GlassCard | 21st.dev | `_external/21st-dev/glass-card/` |
| AnimatedCardChart | 21st.dev | `_external/21st-dev/animated-card-chart/` |
| AnimatedCardDiagram | 21st.dev | `_external/21st-dev/animated-card-diagram/` |
| IaSiriChat | 21st.dev | `_external/21st-dev/ia-siri-chat/` |
| RadialOrbitalTimeline | 21st.dev | `_external/21st-dev/radial-orbital-timeline/` |

_(48 more — see `_external/21st-dev/catalog.json` for full list)_

---

## Table 3: Future Harvests

| Source App | Status |
|---|---|
| `restaurant-app-solo` | Not started |
| `isso-dashboard` | Not started |
| `agency-landing` | Not started |
| `restaurant-ui-library` | Not started |

---

## Promotion Rule

When a component gets promoted from `_raw/` to `primitives/`, `composites/`, or `systems/`:
1. Update its **status** column above to `promoted to primitives|composites|systems`
2. Add a second row with the new **bank path** column filled in
3. Do NOT remove the original `_raw/` row — provenance is permanent
