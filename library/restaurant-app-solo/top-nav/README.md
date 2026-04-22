# restaurant-app-solo / top-nav + TenantHeader

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source:**** `restaurant-app-solo` / `src/domains/shared/components/top-nav/` + `tenant-header/`
**Status:** wholesale preserved copy -- no refactor

---

## What it is

The Draco "COFFEE AND EATERY" frosted-glass floating top nav. A rounded pill bar that sits over the hero image via `fixed inset-x-0 top-0 z-40`, `backdrop-blur`, and `bg-white/10` / `border-white/20`. Left side renders a brand mark + eyebrow copy ("DRACO / COFFEE AND EATERY"), right side has a `Menu` icon (hamburger) that opens a `FullScreenDrawer` mobile nav.

The server component (`TopNavHost`) reads the tenant runtime config and picks one of three variants at runtime.

## Variant system

| Variant | File | Mobile behavior | Distinguishing feature |
|---|---|---|---|
| `pills` (primary) | `primary/TopNavPills.tsx` | Horizontally scrolling pill tab row with `rounded-full` pill borders | Default Draco look; pill badges per active tab |
| `segments` | `variant-2/TopNavSegments.tsx` | 4-column underline-segment bar, no icons | Compact; underline indicator per active section |
| `more-sheet` | `variant-3/TopNavMoreSheet.tsx` | First 3 links shown + "More" button opens a `BottomSheet` | Collapses overflow into a bottom sheet |

## TenantHeader

`TenantHeader.tsx` is the standalone brand block -- the logo + tagline inside the nav. Uses `useTenant()` provider for dynamic brand config (logo URL, `titleAfterLogo`, tagline). Wraps a `FullScreenDrawer` for mobile. Has a `NavigationMenu` desktop nav on the right side.

`tenant-header-index.ts` -- thin re-export: `export { TenantHeader } from './TenantHeader'`.

## Dependencies

- `next/image` -- tenant logo
- `lucide-react` -- Menu, Phone, Utensils, Gift, MessageSquare, Star, Info, FileText, Zap icons
- `@siso/ui` -- shadcn-ui NavigationMenu, Button (TenantHeader only)
- `framer-motion` -- not directly imported; relies on shadcn component internals

## Known broken imports (deduped)

| Import | File |
|---|---|
| `@/domains/shared/hooks/useTenantServer` | TopNavHost.tsx |
| `@/lib/config/site` | TopNavHost.tsx |
| `@/domains/shared/components/BottomSheet` | variant-3/TopNavMoreSheet.tsx |
| `@/lib/utils` | primary/TopNavPills.tsx, TenantHeader.tsx |
| `@/lib/siteRoutes` | TenantHeader.tsx |
| `@siso/ui/primitives/menus/shadcn-ui-navigation-menu` | TenantHeader.tsx |
| `@siso/ui/primitives/buttons/shadcn-ui-button` | TenantHeader.tsx |
| `@/providers/TenantProvider` | TenantHeader.tsx |
| `@/features/auth/hooks/useAuth` | TenantHeader.tsx |
| `@/domains/shared/components/mobile-drawer` (FullScreenDrawer) | TenantHeader.tsx |

All of the above are internal to the `restaurant-app-solo` monorepo and will not resolve outside it.

## How to reuse

Preserved as-is. To adapt:

1. Swap `tenant.siteConfig` for your own config source (env vars, CMS, etc.)
2. Replace `FullScreenDrawer` with your mobile nav component
3. Replace `@siso/ui` shadcn components with your own primitives (Button, NavigationMenu)
4. Swap the `useAuth` hook for your auth layer
5. Update icon imports from `lucide-react` if needed
6. The nav variant is selected via `siteConfig.features.topNavVariant` ("1"/"pills", "2"/"segments", "3"/"more-sheet")
