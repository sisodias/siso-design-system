# Lumelle Account System — Reference Copy

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source:** `luminelle-partnership/src/domains/client/account/`
**Preserved as:** SISO design system reference for user account UI

---

## What This Is

Complete client account area covering addresses, orders, payment methods, and profile settings. A full vertical slice of a real-world auth-gated account domain.

## Folder Breakdown

| Folder | Count | Contents |
|---|---|---|
| `data/` | 1 | Data types (empty in this export, types live inline) |
| `hooks/` | 2 | `useSyncUserToSupabase`, `useShopifyAddresses`, `useShopifyOrders` |
| `logic/` | 1 | Business logic (empty in this export) |
| `providers/` | 1 | `PaymentsProvider` — Stripe payments context |
| `state/` | 1 | `OrdersStore` — order state management |
| `ui/` | 21 | Pages, layouts, components, sections |

**Total: 28 files, ~2,995 LOC**

## Routes Exposed

All routes are mounted inside the `ClerkShell` (auth-gated route group).

| Route | File |
|---|---|
| `/account` | `ui/pages/AccountPage.tsx` |
| `/account/orders` | `ui/pages/OrdersPage.tsx` |
| `/account/orders/:orderId` | `ui/pages/OrderDetailPage.tsx` |
| `/account/addresses` | `ui/pages/AddressesPage.tsx` |
| `/account/payments` | `ui/pages/PaymentMethodsPage.tsx` |

## Dependencies

- **Clerk** — `useUser`, `useAuth`, `SignedIn/SignedOut` gates (heavy auth usage throughout)
- **react-router-dom** — routing, `useParams`, `Link`
- **@tanstack/react-query** — data fetching hooks
- **@stripe/stripe-js** — `PaymentsProvider` wraps Stripe payments
- **lucide-react** — icons
- **react-helmet-async** — `<Helmet>` for per-page SEO meta
- **Supabase** — `@platform/storage/supabase` for order persistence
- **Shopify** — `useShopifyAddresses`, `useShopifyOrders` hooks pull Shopify storefront API

## Known Broken Imports (must resolve when dropping into a new app)

These aliases exist in the source but have no target in this export:

```
@/components/Seo
@/config/constants
@/layouts/MarketingLayout
@platform/auth/clerkSupabaseToken
@platform/auth/providers/AuthContext
@platform/payments
@platform/payments/ports
@platform/seo/logic/publicBaseUrl
@platform/storage/supabase
@ui/components/GlobalFooter
@ui/components/GlobalHeader
```

**11 unique alias groups.** Key resolution steps:

1. **`@/components/Seo`** — create a `Seo` component wrapping `react-helmet-async`
2. **`@/config/constants`** — extract `SUPPORT_EMAIL` and `WHATSAPP_SUPPORT_URL` to a config file
3. **`@/layouts/MarketingLayout`** — replace with `AccountLayout` (already in `ui/layouts/`)
4. **`@platform/auth/*`** — wire Clerk `useUser`/`useAuth`; `clerkSupabaseToken` is a custom bridge for Supabase sessions from Clerk JWT
5. **`@platform/payments*`** — provide Stripe publishable key to `PaymentsProvider`
6. **`@ui/components/GlobalHeader/Footer`** — pull from design system or stub

## Why This Is a Keeper

Shaan said: *"manager account section as well, I want to take everything."* This is a production-grade, auth-gated account domain with real data hooks, Stripe payments, and Shopify integration. Preserved wholesale to drop into future SISO apps.

## How to Reuse

1. Copy this folder into your app's `components/` or `design-system/` tree
2. Add `@/components/Seo` (1-file stub), `@/config/constants` (2 string exports)
3. Wire Clerk auth — `useUser`, `useAuth`, `SignedIn/SignedOut` gates already in place
4. Provide Stripe publishable key via `PaymentsProvider`
5. Swap Shopify hooks for your own order/address API adapters
6. Mount the 5 routes under your auth-gated shell

## Sub-path Exports

Each subfolder has a `README.md` and `index.ts` barrel for granular imports:
- `data/` — no barrel (types are inline)
- `hooks/` — `index.ts` re-exports `useSyncUserToSupabase`, `useShopifyAddresses`, `useShopifyOrders`
- `providers/` — `PaymentsProvider` is the entry point
- `state/` — `OrdersStore` manages order state locally (localStorage + Supabase)
- `ui/` — `components/`, `layouts/`, `shared/` each have their own `index.ts` barrels
