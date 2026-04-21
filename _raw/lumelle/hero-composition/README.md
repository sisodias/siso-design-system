# Lumelle Mobile Hero Composition — Reference Bank

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source app:** `luminelle-partnership` (private conductor workspace)
**Preserved as-is for visual and structural reference. Do not refactor.**

---

## Source paths

| File | Source absolute path |
|------|---------------------|
| `HeroShop.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/domains/client/marketing/ui/sections/shop/hero-shop/HeroShop.tsx` |
| `TrustBar.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/domains/client/marketing/ui/sections/shop/trust-bar/TrustBar.tsx` |
| `AnnouncementBar.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/components/AnnouncementBar.tsx` |
| `PublicHeader.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/components/PublicHeader.tsx` |
| `GlobalHeader.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/components/GlobalHeader.tsx` |
| `StarRating.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/components/StarRating.tsx` |
| `MarketingLayout.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/layouts/MarketingLayout.tsx` |
| `SectionHeading.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/components/SectionHeading.tsx` |
| `AnimatedSection.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/components/AnimatedSection.tsx` |
| `GlobalFooter.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/components/GlobalFooter.tsx` |
| `home.config.ts` | `/Users/shaansisodia/conductor/luminelle-partnership/src/content/home.config.ts` |
| `DrawerContext.tsx` | `/Users/shaansisodia/conductor/luminelle-partnership/src/ui/providers/DrawerContext.tsx` |
| `cdn.ts` | `/Users/shaansisodia/conductor/luminelle-partnership/src/lib/utils/cdn.ts` |
| `constants.ts` | `/Users/shaansisodia/conductor/luminelle-partnership/src/config/constants.ts` |
| `posthog.ts` | `/Users/shaansisodia/conductor/luminelle-partnership/src/lib/analytics/posthog.ts` |
| `useFeatureFlagVariant.ts` | `/Users/shaansisodia/conductor/luminelle-partnership/src/lib/analytics/useFeatureFlagVariant.ts` |
| `useHydrateOnView.ts` | `/Users/shaansisodia/conductor/luminelle-partnership/src/domains/shared/hooks/useHydrateOnView.ts` |

---

## What this is

Mobile-first shop hero composition built for Lumelle's homepage. The composition is a 4-element vertical stack:

1. **Announcement bar** — rotating promo strip (Free shipping / Buy 2 save 10% / 30-day guarantee) in blush peach background
2. **Public header** — sticky white nav with rotating promo text, centered Lumelle logo + subtitle, WhatsApp CTA + account icon
3. **Hero** — full-bleed background image with mobile auto-advancing slides, overlaid cream/blush card with trust avatar pill + serif headline + coral CTA button + star-rating pill + product image panel
4. **Trust bar** — scrolling marquee of trust signals below the hero

### Screenshot reference

The composition renders as: rotating peach announcement bar at top → sticky white header with Lumelle branding → full-bleed hero image (mobile carousel, desktop single image) with overlaid cream card featuring avatar pill, serif headline, coral CTA, star rating pill → pink/blush product grid section → scrolling trust marquee at bottom.

---

## Components included

| File | Description |
|------|-------------|
| `HeroShop.tsx` | Main shop hero with trust avatars, headline, CTA, star rating, product image panel, mobile carousel, PostHog experiment variant for CTA copy |
| `TrustBar.tsx` | Scrolling marquee of trust signals with pause on hover/focus |
| `AnnouncementBar.tsx` | Dismissible info bar with optional CTA link; keyed by message for localStorage persistence |
| `PublicHeader.tsx` | Two-row header: rotating promo strip + sticky nav with logo, WhatsApp CTA, account icon |
| `GlobalHeader.tsx` | Auth-aware header variant: promo bar + shop/cart/sign-in/account controls (requires `@platform/auth` context) |
| `StarRating.tsx` | SVG star rating with half-star support and glow drop-shadow |
| `MarketingLayout.tsx` | Page wrapper: announcement strip, sticky header, optional section nav, main content, footer |
| `SectionHeading.tsx` | Reusable section heading with optional eyebrow, title, description, and action buttons |
| `AnimatedSection.tsx` | Scroll-triggered fade-in wrapper using Framer Motion + IntersectionObserver |
| `GlobalFooter.tsx` | Full footer with newsletter form, social links, nav, back-to-top button |

---

## Dependencies

These must be available (or stubbed) in the consuming app:

- `react-router-dom` — `Link`, `RouterLink`, `useNavigate`
- `lucide-react` — `Star`, `Menu`, `UserRound`, `Instagram`, `Music2`, `ShoppingBag`, `BookOpen`, `MessageCircle`, `Package`, `Mail`
- `framer-motion` — `motion`, `Variants` (required by `AnimatedSection`)
- `posthog-js` — analytics (optional; feature flags degrade gracefully)
- `@platform/auth` — `useAuthContext` (only in `GlobalHeader.tsx`; stub or replace if unused)
- `@ui/providers/DrawerContext` — `useDrawer` (only in `PublicHeader.tsx` and `GlobalHeader.tsx`; stub or replace if unused)
- `@/lib/utils/cdn` — `cdnUrl` helper (stub with identity function if no CDN)
- `@/config/constants` — `SUPPORT_EMAIL`, `INSTAGRAM_URL`, `TIKTOK_URL` (stub with hardcoded values)

---

## Known broken imports when isolated

Every `@/...` or `@ui/...` or `@platform/...` alias will not resolve outside the luminelle app:

| Broken import | Found in | What it needs |
|---|---|---|
| `@/lib/utils/cdn` | `HeroShop.tsx` | Stub `cdnUrl()` as identity function, or wire real CDN base URL |
| `@/lib/analytics/posthog` | `HeroShop.tsx` | Stub `captureEvent`, `captureExperimentExposure` as no-ops |
| `@/lib/analytics/useFeatureFlagVariant` | `HeroShop.tsx` | Stub or replace with local state |
| `@/config/constants` | `MarketingLayout.tsx`, `GlobalFooter.tsx` | Stub with hardcoded email + social URLs |
| `@/domains/shared/hooks/useHydrateOnView` | `AnimatedSection.tsx` | Already included here as `useHydrateOnView.ts` |
| `@ui/providers/DrawerContext` | `PublicHeader.tsx`, `GlobalHeader.tsx` | Already included here as `DrawerContext.tsx` |
| `@ui/components/PublicHeader` | `MarketingLayout.tsx` | Already included (circular self-reference) |
| `@ui/components/GlobalFooter` | `MarketingLayout.tsx` | Already included here as `GlobalFooter.tsx` |
| `@platform/auth/providers/AuthContext` | `GlobalHeader.tsx` | Requires Clerk or equivalent auth provider; stub `signedIn`, `user` |
| `posthog-js` | `posthog.ts` | Peer dependency; degrade to no-op if absent |
| `@/experiments/identity` | `posthog.ts` | Stub `getOrCreateAnonId`, `getOrCreateSessionId` |
| `@/lib/cookieConsent` | `posthog.ts` | Stub `hasTrackingConsent` as `() => true` |
| `import.meta.env.VITE_*` | `cdn.ts`, `constants.ts`, `posthog.ts` | Requires Vite env; stub values at build time |

---

## How to use as reference

This is preserved as-is for visual and structural reference. To actually render in a new app, you'll need to:

1. **Resolve `@/` aliases** — configure `tsconfig.json` paths or alias in Vite/Webpack
2. **Stub or replace `cdnUrl`** — pass an identity function `p => p` if no CDN
3. **Wire a cart context** — `DrawerContext` is provided here; provide real `openCart`/`openMenu` implementations
4. **Provide `homeConfig`** — `HeroShop` takes `config` and `socialProof` props typed from `home.config.ts`
5. **Stub analytics** — `captureEvent`, `captureExperimentExposure`, `useFeatureFlagVariant` can all be stubbed without breaking rendering
6. **Stub auth** — `GlobalHeader` uses `useAuth`; replace with a stub or remove if only using `PublicHeader`
7. **Stub PostHog** — the `posthog.ts` file degrades gracefully if `posthog-js` is absent; `initPosthogOnce` becomes a no-op

---

## Design tokens referenced (Lumelle brand)

The components use these semantic token classes (not literal hex values — they require the Lumelle Tailwind config):

- `semantic-legacy-brand-blush` — peach/pink background
- `semantic-legacy-brand-cocoa` — warm brown (CTAs, logo)
- `semantic-accent-cta` — cream/off-white (secondary accents)
- `semantic-text-primary` — dark text
- `shadow-soft` — custom soft shadow
- `font-heading` — serif heading font
- `font-serif` — body serif variant

When porting to a new app, map these to your own design system tokens or use literal values.
