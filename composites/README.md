# Composites — Tier 2

Assembled components made of primitives. Data-free but contextually composed.

---

## What Belongs Here

- `hero-shop`
- `product-spotlight`
- `feature-callouts` (dual-variant)
- `bundle-cards`
- `tiktok-carousel`
- `footer`
- `email-capture-card`
- `faq-with-reviews`
- `pdp-bottom-cta`

Components that compose multiple primitives into meaningful UI sections.

---

## Rules

- **May compose primitives.** Multiple atoms assembled into a meaningful whole.
- **May use `ImageAdapter`** for image URLs via `image.cdnUrl()`.
- **No auth.** No `useAuth()`, no session checks.
- **No cart logic.** No `useCart()`, no add-to-cart mutations.
- **No data fetching.** All content passed as props.
- **No analytics.** No direct tracking calls.

---

## Promotion Criteria

A component can be promoted to `composites/` if:
1. Composed of primitives or raw UI (no internal app deps)
2. Uses `ImageAdapter` for image URLs only
3. Takes all content as props (no internal data fetching)
4. No auth, cart, analytics, or session logic
5. Runs standalone with adapter contracts fulfilled

---

## Directory

```
composites/
  {component-name}/
    {component-name}.tsx
    demo.tsx
    README.md (optional)
```
