# Example Component

A reference folder showing every file a component in `library/` should have. Copy this as a starting point when adding new components.

## Files

| File | Required? | Purpose |
|---|---|---|
| `registry-item.json` | Yes | shadcn-schema metadata — dependencies, tags, preview sizing |
| `example-component.tsx` | Yes | The component itself |
| `demo.tsx` | Recommended | Standalone renderable demo — what the viewer shows |
| `README.md` | Recommended | Human notes, usage examples, design rationale |

## Using this as a template

1. Copy the whole folder to `library/{your-source}/{your-slug}/`
2. Rename `example-component.tsx` → `{your-slug}.tsx`
3. Update every `example-component` reference inside the files to your slug
4. Edit `registry-item.json` — change `name`, `title`, `description`, `tags`, `dependencies`
5. Replace component code with your actual component
6. Update `demo.tsx` to render your component with sample props
7. Run `npm run dev` in `viewer/` — card appears

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | `"Example title"` | Title shown next to the icon |
| `subtitle` | string | `"Example subtitle"` | Subtitle beneath the title |

## Dependencies

- `lucide-react` (Sparkles icon)

## Design intent

Minimal, data-driven, zero external coupling. This is the quality bar every `siso-primitives` component should meet. Components in `lumelle/` and `restaurant-app-solo/` sources are intentionally exempt — they preserve broken imports as reference for what the original app shipped.

## See also

- [ARCHITECTURE.md](../../../ARCHITECTURE.md) — why the folder structure looks this way
- [CONTRIBUTING.md](../../../CONTRIBUTING.md) — quick reference for adding components
