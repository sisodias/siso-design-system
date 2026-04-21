# mobile-drawer

**Raw source:** `restaurant-app-solo / src/domains/shared/components/mobile-drawer/`
**Preserved as:** wholesale copy, no refactor.

---

## What it is

The **Draco** mobile side-nav drawer — opens full-screen, split layout:

- **Left half:** dark (`bg-black`) nav panel with DRACO SVG wordmark + tagline at top, close X button top-right, vertical menu list with Lucide icons (Home, Menu, Calendar, MapPin, Star, Mail, Phone, Zap), "NEW" pill badges, Sign In pill bottom
- **Right half:** full-bleed food photography panel (`drawer-background.png`), creating an immersive brand moment
- Multi-variant: `primary/` (Draco/black), `variant-2/` and `variant-3/` (empty, reserved for future)

---

## Variants

| Variant | Status | Distinguishing feature |
|---------|--------|-----------------------|
| `primary/` | 8 files, production | Full-screen split layout, dark bg + food image panel, 6 floating gallery images |
| `variant-2/` | empty dir | Reserved for future theming |
| `variant-3/` | empty dir | Reserved for future theming |

---

## Components (primary/)

| File | Purpose |
|------|---------|
| `FullScreenDrawer.tsx` | Main Draco drawer — full-screen, split layout, iOS scroll-lock, ESC key handler |
| `MobileDrawer.tsx` | Classic side-drawer (~280px), no image panel, tabbed/section-based nav |
| `DrawerHeader.tsx` | Logo + name + tagline + close X button |
| `DrawerNavSection.tsx` | Animated nav list with active indicators, badges, staggered fade-in |
| `DrawerFooter.tsx` | Auth buttons (Google OAuth + Sign In/Sign Up) or user avatar + Sign Out |
| `DrawerPromoBanner.tsx` | Gradient membership-perk card with Flame icon |
| `DrawerSearch.tsx` | Search input bar |
| `index.ts` | Barrel export |

---

## Included docs

- `ORIGINAL_README.md` — original component README (switching between MobileDrawer vs FullScreenDrawer, how to swap in TenantHeader)
- `CHANGELOG.md` — FullScreenDrawer evolution: removed "TODAY'S SPECIAL" promo, minimized header, enhanced image showcase to 6 images, simplified close button
- `IMAGE-GUIDE.md` — image specs, positioning, optimization tips, troubleshooting

---

## Dependencies

```
next/image          — right-panel background + avatar images
lucide-react        — all nav icons (Home, Menu, Calendar, MapPin, Star, Mail, Phone, Zap, Search, X, Flame, ArrowRight)
framer-motion       — not used in these files (CSS animations via Tailwind animate-in)
@siso/ui/primitives/buttons/shadcn-ui-button — used in DrawerHeader + DrawerFooter
@supabase/supabase-js — User type for auth state
```

---

## Known broken imports (5 unique, deduped)

| Import | Occurs in | Notes |
|--------|-----------|-------|
| `@/lib/utils` | `DrawerNavSection.tsx`, `MobileDrawer.tsx`, `FullScreenDrawer.tsx` | App-level `cn()` utility — missing in design-system context |
| `@siso/ui/primitives/buttons/shadcn-ui-button` | `DrawerHeader.tsx`, `DrawerFooter.tsx` | Private SISO UI package — replace with your button primitive |
| `@supabase/supabase-js` | `DrawerFooter.tsx`, `MobileDrawer.tsx`, `FullScreenDrawer.tsx` | Auth provider — replace with Clerk or your auth User type |

---

## How to reuse

1. Copy `primary/` into your project
2. Fix the 5 broken imports above (replace with your equivalents)
3. Swap tenant content: brand name, tagline, SVG logo path, nav items, phone number, side-panel image path
4. Wire `open`/`onClose` to your app state

The `MobileDrawer` variant is a simpler drop-in if you don't want the full-screen image panel.
