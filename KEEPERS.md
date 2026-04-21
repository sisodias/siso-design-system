# SISO Design System — Keepers Log

Running list of components Shaan has greenlit for the bank, with source, status, and notes.

## 2026-04-22 — Lumelle harvest session 1

### Keeper #1: Mobile Shop Hero Composition
Source: luminelle-partnership /
Location in bank: components/lumelle/hero-composition/
Includes:
- AnnouncementBar (rotating peach top bar, "FREE SHIPPING")
- PublicHeader / GlobalHeader (menu icon + wordmark + account icon)
- HeroShop (full-bleed image + overlaid cream card with trust pill + serif headline + coral CTA + star rating + product grid)
- TrustBar (scrolling marquee — "WATERPROOF · 30 DAY MONEY BACK GUARANTEE")
- StarRating (half-star SVG atom)
- MarketingLayout (wrapper)
Status: Copied as reference. Broken imports preserved. Will need rewiring to use in a new app.

### Keeper #2: Menu/Cart Side Drawer
Source: luminelle-partnership
Location in bank: components/lumelle/menu-cart-drawer/
Includes:
- DrawerProvider (Menu + Cart tab toggle, portal, 952 LOC)
- DrawerContext
- CartContext (cart state, volume discounts, Shopify sync, 562 LOC)
- Supporting cart logic + constants + product config
Status: Copied as reference. Shopify/Clerk/PostHog dependencies preserved.
Note: Shaan specifically liked the Menu/Cart tab pattern, product rail with badges, MORE nav section (Creators/Brand story/Blog), and the sign-in footer card.

### Keeper #3: Lumelle Design Tokens
Source: luminelle-partnership
Location in bank: tokens/lumelle/
Includes: tokens.json, tailwind.config.js, CSS vars, Tailwind utilities.
Status: Copied. Cleaner token architecture than isso-dashboard — worth studying for SISO's own token system.

---

## 2026-04-22 — Session 1 completion: restructure + Lumelle harvest done

All 15 Lumelle keepers are now located at `_raw/lumelle/{keeper}/`:

1. hero-composition (11 files) — AnnouncementBar + PublicHeader + HeroShop + TrustBar + StarRating + MarketingLayout + SectionHeading + AnimatedSection + GlobalFooter + home.config + misc helpers
2. menu-cart-drawer (11 files, 2,797 LOC) — DrawerProvider + CartContext + cart types + volumeDiscounts + constants + posthog + product-config
3. footer (2 files) — GlobalFooter + constants
4. email-capture-card — "Get 10% off your first order" card
5. faq-section (4 files) — FaqSectionShop with embedded review accordion
6. spin-wheel (4 files, 366 LOC) — welcome-deal spinner
7. bundle-cards (5 files) — product card with pill badges + feature chips + dual CTA
8. tiktok-carousel (5 files) — creator video scroller, platform-agnostic
9. product-spotlight (4 files) — mobile one-viewport product card
10. feature-callouts (2 files) — dual-variant "Your sign to try this" + "Why you'll love it"
11. details-accordion (2 files) — "Materials, care & fit" clean accordion
12. pdp-bottom-cta (4 files) — bottom CTA + MobileStickyCta extracted
13. product-page-hero (8 files, 2,117 LOC) — full PDP from announcement pill to Buy Now
14. blog-system (23 files, 2,042 LOC) — whole blog vertical
15. account-system (29 files, 3,077 LOC) — whole account area

**Total: ~13,000 LOC across 15 keepers. Every component has a README with broken-import manifest.**

**Restructure applied:**
- Moved `components/lumelle/*` → `_raw/lumelle/*`
- Created `primitives/`, `composites/`, `systems/`, `adapters/`, `_external/` scaffolds
- Imported 52 21st.dev components from `SISO_Library/component_library/` → `_external/21st-dev/`
- Wrote adapter contracts (5 interfaces + configureSisoDesign)
- Wrote PROVENANCE.md mapping every component to source
- Wrote ADAPTERS.md with wiring recipes for Clerk, Shopify, Supabase

**Next harvest: restaurant-app-solo** (queued)
