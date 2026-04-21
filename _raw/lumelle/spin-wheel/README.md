# Spin Wheel — Lumelle Welcome Deal Component

## Source

`luminelle-partnership` / `src/domains/client/marketing/ui/sections/shop/final-cta-section/`

Files preserved verbatim:
- `SpinWheelLocal.tsx` (366 lines) — main spin wheel logic
- `FinalCtaSection.tsx` (16 lines) — thin wrapper section
- `SpinWheel.tsx` (2 lines) — re-export stub

## What it is

Mobile-first welcome-deal spin wheel. Centered card with: Playfair serif headline "Spin the wheel to unlock your reward", small diamond pointer above wheel, 8-segment CSS conic-gradient wheel in alternating peach shades with percentage labels (5%, 10%, 15%), white center circle with the diamond pointer, "Reveal welcome deal" dark cocoa CTA button, subtitle microcopy, and a nested "Guaranteed welcome deal" card showing fallback code (LUMELLE10) + "Use code LUMELLE10 for Free Shipping on orders over £20+".

## Design details

- The wheel is pure CSS `conic-gradient` with segments driven by `Prize.color` hex values (peach palette: `#F9A58A`, `#F4C7B7`, `#FDD9C3`, `#F7B8A0`).
- No framer-motion — CSS `transition-transform duration-[3200ms] ease-out` handles the spin.
- Labels are absolutely positioned on the wheel using trigonometry (sin/cos on slice angles).
- Diamond pointer is a rotated square (`rotate-45`, `bg-semantic-legacy-brand-cocoa`).
- After spin, a **guaranteed fallback code** (`LUMELLE10`) is always shown — prevents loser-gets-nothing UX.
- Signed-out users can preview-spin; their result is persisted in `localStorage` and auto-claimed on sign-in.

## Known broken imports when isolated

| Import | Status |
|--------|--------|
| `@clerk/clerk-react` | Third-party — install with `npm install @clerk/clerk-react` |
| `@platform/auth/providers/AuthContext` | Internal to luminelle-partnership — needs SISO equivalent (Clerk `useAuth` + SISO auth context) |
| `@/lib/supabase` | Internal — needs SISO `createSupabaseClient` helper |
| `@platform/auth/clerkSupabaseToken` | Internal — needs SISO `getClerkSupabaseToken` helper |
| `@client/shop/cart/providers/CartContext` | Internal — needs SISO `useCart` hook with `applyDiscount`, `items`, `checkoutUrl` |

Also references a Supabase table `welcome_wheel_claims` (user_id, discount_code, claimed_at) and a custom cart event `lumelle:open-cart`.

## How to use as reference

Preserved as-is. To adapt for production:
1. Replace `@platform/auth/...` and `@client/shop/cart/...` with SISO equivalents.
2. Replace `createSupabaseClient` / `getClerkSupabaseToken` with Convex or your preferred auth-backed DB.
3. Replace `WELCOME_DISCOUNT_CODE = 'LUMELLE10'` and `guaranteedAward` with your actual reward logic.
4. Replace `applyDiscount`, `checkoutUrl`, `items`, `lumelle:open-cart` with your cart integration.
5. Strip `FinalCtaSection.tsx` wrapper if not needed — `SpinWheel` is self-contained.
