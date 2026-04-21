# Contributing — SISO Design System

Quick reference. Full architecture in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Adding a new component

**TL;DR — drop a folder matching the pattern and the viewer picks it up on refresh.**

### 1. Pick your source namespace

Where did the component come from?

- `21st-dev` — pulled from 21st.dev
- `lumelle` — harvested from Lumelle app
- `restaurant-app-solo` — harvested from restaurant-app-solo
- `siso-primitives` — hand-written SISO component
- Or invent a new namespace for a new source app

### 2. Create the folder

```
library/{source}/{slug}/
├── registry-item.json      REQUIRED
├── {slug}.tsx              REQUIRED
├── demo.tsx                RECOMMENDED — what the viewer renders
├── README.md               RECOMMENDED — human notes
└── (supporting files)      OPTIONAL
```

Slug must be lowercase kebab-case matching the filename.

### 3. Write `registry-item.json`

Minimum viable example:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "my-component",
  "type": "registry:ui",
  "title": "My Component",
  "description": "One-line description shown on cards.",
  "source": "siso-primitives",
  "platform": "Mobile",
  "tags": ["card", "animated"],
  "files": [
    { "path": "my-component.tsx", "type": "registry:ui" },
    { "path": "demo.tsx", "type": "registry:example" }
  ],
  "dependencies": ["framer-motion"],
  "registryDependencies": []
}
```

See [ARCHITECTURE.md](./ARCHITECTURE.md#registry-itemjson--the-metadata-contract) for all fields.

### 4. Write `demo.tsx`

Must render the component standalone — no auth, no cart, no undefined props.

```tsx
"use client"
import MyComponent from "./my-component"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <MyComponent title="Hello" subtitle="This is a demo" />
    </div>
  )
}
```

### 5. Tune the preview (optional)

If your component renders at a weird size in the card, add a `preview` block to `registry-item.json`:

```json
"preview": {
  "width": 375,
  "height": 600,
  "background": "neutral-950",
  "interactive": false
}
```

The viewer's iframe will render at this size, then scale to fit the card.

### 6. Test

```bash
cd viewer
npm run dev
```

Your card appears on the home grid on refresh.

---

## When a component can't render standalone

If it pulls in `useAuth`, `useCart`, `homeConfig`, Cloudinary helpers, or other external state that can't be mocked cheaply, mark it as **code-reference only**:

```json
"preview": {
  "renderable": false
}
```

Card shows a code snippet treatment instead of a live iframe. Component is still in the bank, still browsable, just not previewable.

---

## When NOT to add something to `library/`

- **Component is still in an external app's src tree** → harvest first, don't symlink
- **Component has no demo + can't be made to render + has no unique reference value** → skip it, not every utility deserves a card
- **You want to "save for later"** → use a github issue or your own notes, not the bank

---

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Source namespace | lowercase kebab-case | `21st-dev`, `lumelle`, `siso-primitives` |
| Component slug | lowercase kebab-case | `notification`, `star-rating`, `pipeline-status-strip` |
| Component file | matches slug | `notification.tsx` |
| Demo file | always `demo.tsx` | — |
| Helper file | kebab-case | `use-count-up.ts`, `lib-utils.ts` |
| Tag | lowercase kebab-case | `toast`, `status-indicator`, `urgency` |

---

## Common errors when adding

| Error | Fix |
|---|---|
| Demo not showing up | Check `registry-item.json` has a `files` entry with `type: "registry:example"` |
| `Cannot find module './my-component'` | Slug in `registry-item.json` must match folder name exactly |
| Preview is tiny or huge | Add `preview.width` + `preview.height` to `registry-item.json` |
| `h-screen` overflows card | Expected pre-iframe migration. Won't happen inside iframes. |
| Broken import `@/lib/utils` | Add `"registryDependencies": ["utils"]` OR stub locally |

---

## Governance

- Every component MUST have `registry-item.json`. No exceptions.
- Every component MUST render (live or reference). No silent failures.
- Every component MUST have clear provenance (source + original path). Documented in PROVENANCE.md.
- Viewer code (under `viewer/`) is NOT part of the library. Don't add library components under `viewer/`.

---

## File pointers

- [ARCHITECTURE.md](./ARCHITECTURE.md) — the full "why" + iframe rendering contract
- [PROVENANCE.md](./PROVENANCE.md) — every component → source app → original path
- [ADAPTERS.md](./ADAPTERS.md) — auth/cart/analytics/content/image adapters (for `systems/` tier)
- [CATALOG.md](./CATALOG.md) — usage-first index: "I'm building X, which components?"
- [KEEPERS.md](./KEEPERS.md) — chronological harvest log
