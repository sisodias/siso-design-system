# Primitives — Tier 1

Zero-dependency atoms. Drop-in with just Tailwind + lucide-react.

---

## What Belongs Here

- `star-rating`
- `announcement-bar`
- `section-heading`
- `details-accordion`
- `trust-bar-marquee`

Anything with zero runtime deps beyond React + Tailwind + lucide-react.

---

## Rules

- **No adapters.** Not even ImageAdapter.
- **No auth.** No `useAuth()`, no session checks.
- **No data fetching.** No `useQuery()`, no API calls.
- **No app-specific imports.** No `@/lib/...`, no `~/...`, no absolute paths to source app.
- **All data as props.** Components receive everything they render via props.

---

## Promotion Criteria

A component can be promoted to `primitives/` if:
1. Zero runtime dependencies beyond `react`, `tailwindcss`, `lucide-react`
2. Takes all data/content as props (no internal fetches)
3. No adapter imports
4. No auth/session/cookie logic
5. Renders identically in isolation

---

## Directory

```
primitives/
  {component-name}/
    {component-name}.tsx
    demo.tsx
    README.md (optional)
```
