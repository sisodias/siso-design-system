# Systems — Tier 3

Full vertical slices with adapter wiring. The highest maturity tier.

---

## What Belongs Here

- `shop-cart-drawer`
- `product-page-hero`
- `blog-system`
- `account-system`

Components that wire together auth, cart, content, analytics, and image adapters.

---

## Rules

- **Import adapters via `getSisoConfig()`** from `adapters/`. Never direct Clerk/Shopify/Supabase imports.
- **Use adapter hooks:** `useAuth()`, `useCart()`, `useProduct()`, `useBlog()`, `useAnalytics()`, `useImage()`.
- **No raw SDK imports.** Systems talk to adapter contracts only — adapters implement the actual SDK calls.
- **All adapter dependencies must be wired.** A system with broken adapter imports is not ready.

---

## Promotion Criteria

A system is ready when:
1. All auth/cart/content/analytics dependencies route through configured adapters
2. Broken imports are resolved
3. Adapter hooks are wired and typed
4. Runs standalone with only the adapter contracts fulfilled
5. Demo mode available (mock adapter) for preview without backend

---

## Directory

```
systems/
  {system-name}/
    {system-name}.tsx
    demo.tsx
    README.md (optional)
```

---

## Adapter Contracts

See `adapters/README.md` for the full contract spec. Systems must implement the adapter interface for each dependency they use.
