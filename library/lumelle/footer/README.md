# Lumelle GlobalFooter — Port Reference

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

## Source

`luminelle-partnership / src/ui/components/GlobalFooter.tsx` (220 lines)
Companion: `luminelle-partnership / src/config/constants.ts`

## What it is

Centered brand-forward mobile footer. Layout:

1. **Brand section** — Lumelle L-mark SVG avatar, Playfair serif wordmark, tagline, "MADE IN UK · 30-DAY RETURNS" pill badge.
2. **3-column icon link grid** — Explore (Shop, Brand Story, Blog) | Support (FAQ, Shipping & Returns, Contact) | Newsletter column (email pill input + social icons).
3. **Newsletter capture** — Full-width pill-shaped email input with inline icon, rounded "Join →" button. POSTs to `/api/newsletter/subscribe` with `{ email, source: 'footer' }`.
4. **Social icons** — Instagram + TikTok, circular bordered buttons with hover-scale.
5. **Bottom bar** — Copyright, Terms / Privacy links, circular back-to-top button (double-chevron SVG).

## Key design details

- Lucide icons: `ShoppingBag`, `BookOpen`, `MessageCircle`, `Package`, `Mail`, `Instagram`, `Music2` (TikTok).
- Peach-gradient top border on `<footer>`: `from-semantic-legacy-brand-blush/20 to-semantic-legacy-brand-blush/30`.
- Newsletter pill: `border-semantic-accent-cta/70`, submit button: `bg-semantic-legacy-brand-cocoa`.
- Social icons: `border-semantic-accent-cta/50`, hover lifts `translate-y-[-2px]`.
- Back-to-top: inline SVG double-chevron, circular bordered button.
- `col-span-2 lg:col-span-1` grid trick — newsletter column spans full width on mobile, narrows to 1/3 on lg.

## Dependencies

| Dependency | Purpose |
|---|---|
| `lucide-react` | Nav + social icons |
| `react-router-dom` | `Link` (aliased as `RouterLink`) for nav items |
| `/api/newsletter/subscribe` | Newsletter POST endpoint (Supabase Edge or similar) |
| `@/config/constants` | `INSTAGRAM_URL`, `TIKTOK_URL` (VITE-driven) |

## Known broken imports when isolated

| Import | Issue |
|---|---|
| `from 'react-router-dom'` | Will not resolve unless `react-router-dom` is installed in host project. |
| `from '@/config/constants'` | Will not resolve — `@` alias is luminelle-specific. The file is copied here as `constants.ts`; rewire to host project's alias or inline the values. |

## How to use as reference

Preserved verbatim. To adopt in SISO design system:

1. Swap `@/config/constants` import for SISO's equivalent (or inline `INSTAGRAM_URL` / `TIKTOK_URL`).
2. Replace `RouterLink` with SISO's link component (or keep `react-router-dom` if already a dependency).
3. Rewire newsletter `fetch('/api/newsletter/subscribe')` to SISO's newsletter endpoint.
4. Audit `semantic-legacy-brand-*` and `semantic-accent-*` token names against SISO's Tailwind config — some may not exist and will fall back to raw colors.
5. Replace `/l-icon.svg` with SISO's own logo asset.
6. Swap `supportEmail` prop for SISO's contact email source.
