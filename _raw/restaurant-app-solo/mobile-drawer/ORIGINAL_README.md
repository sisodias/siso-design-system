# Mobile Drawer Components

This directory contains two drawer implementations for mobile navigation:

**Directory layout**
- `primary/` — production-ready drawer components used in templates today
- `variant-2/`, `variant-3/` — reserved for future experiments (empty by design)
- `index.ts` — re-exports the current primary implementation and helpers

## 1. MobileDrawer (Standard)
**Location:** `primary/MobileDrawer.tsx`

A traditional side drawer that slides in from the right.
- Width: 280-320px
- Clean, compact design
- Shows logo, navigation, and footer

## 2. FullScreenDrawer (Enhanced) ✨
**Location:** `primary/FullScreenDrawer.tsx`

A modern, immersive full-screen drawer with split layout.
- Full screen takeover
- **Left side:** Navigation menu with icons on dark background
- **Right side:** Beautiful food imagery showcase
- Smooth animations and transitions
- Perfect for restaurants wanting a premium visual experience

---

## How to Switch Between Drawers

### ✅ Quick One-Line Swap in TenantHeader

Open `src/domains/shared/components/tenant-header/TenantHeader.tsx` and update the drawer import:

```tsx
// FROM:
import { MobileDrawer } from '../mobile-drawer';

// TO:
import { FullScreenDrawer as MobileDrawer } from '../mobile-drawer';
```

**That's it!** ✨

The FullScreenDrawer now has the **exact same props** as MobileDrawer, so you don't need to change anything else. It includes:
- ✅ User authentication (sign in/out)
- ✅ Logo and tagline
- ✅ Promo message banner
- ✅ Phone number button
- ✅ All navigation features

### Alternative: Keep Both and Toggle

If you want to keep both drawers and switch between them easily:

```tsx
// Import both
import { MobileDrawer, FullScreenDrawer } from '../mobile-drawer';

// Use one or the other
const DrawerComponent = FullScreenDrawer; // or MobileDrawer

// Then use it
<DrawerComponent
  open={mobileOpen}
  onClose={() => setMobileOpen(false)}
  // ... rest of props
/>
```

---

## Customization

### FullScreenDrawer Images

Edit the `foodImages` array in `primary/FullScreenDrawer.tsx` (line ~47):

```tsx
const foodImages = [
  { src: '/images/shared/gallery/gallery-1.jpg', alt: 'Delicious dish 1', position: 'top-4 right-8' },
  { src: '/images/shared/gallery/gallery-2.jpg', alt: 'Delicious dish 2', position: 'top-32 right-24' },
  // Add or modify images here
];
```

### Icon Mapping

The drawer automatically maps navigation labels to icons. To customize, edit the `getIconForItem` function in `primary/FullScreenDrawer.tsx` (line ~19).

### Colors and Styling

The FullScreenDrawer uses:
- **Background:** Pure black (`bg-black`)
- **Text:** White with opacity variations
- **Accent:** Primary color from your theme
- **Images:** Gallery images from `/public/images/shared/gallery/`

To adjust colors, modify the Tailwind classes in the component.

---

## Comparison

| Feature | MobileDrawer | FullScreenDrawer |
|---------|--------------|------------------|
| Screen Coverage | ~280-320px | Full screen |
| Visual Impact | Minimal | High |
| Food Imagery | No | Yes |
| User Auth Display | Yes | No |
| Footer Info | Yes | No |
| Animations | Simple slide | Multiple staggered |
| Best For | Standard apps | Visual brands |

---

## Preview Tips

1. **Mobile only:** Both drawers only appear on mobile/tablet (`lg:hidden`)
2. **Test responsive:** Try different screen sizes
3. **Check images:** Make sure gallery images exist in `/public/images/shared/gallery/`
4. **Verify icons:** Ensure navigation labels map correctly to icons

---

## Questions?

The FullScreenDrawer is inspired by modern restaurant apps with immersive visuals. It's perfect for brands that want to showcase their food photography while maintaining clean navigation.

For issues or customization needs, check the component source code with inline comments.
