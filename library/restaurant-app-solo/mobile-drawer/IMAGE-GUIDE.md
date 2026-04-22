# 🎨 FullScreenDrawer Image Guide

## Images Currently Being Used

The FullScreenDrawer uses **5 images** from your existing gallery to create the immersive visual experience:

### 🖼️ Image Sources

```
📁 /public/images/
  ├── hero-default.jpg          ← Central featured image (large circle)
  └── gallery/
      ├── gallery-1.jpg         ← Top-right small image
      ├── gallery-2.jpg         ← Top-right floating image
      ├── gallery-3.jpg         ← Bottom-right floating image
      └── gallery-4.jpg         ← Bottom corner image
```

---

## Visual Layout

```
┌─────────────────────────────────────────────────────┐
│  ✕  Close                                           │
│                                                     │
│  🍽️ Restaurant Name                    [gallery-1] │
│  "Tagline"                              [gallery-2] │
│                                                     │
│  🔥 Promo: 20% off!                                │
│                                                     │
│  🏠 Home                            [hero-default]  │
│  🍴 Menus                              (center)     │
│  📅 Booking                                         │
│  📍 Location                          [gallery-3]  │
│  ⭐ Reviews                           [gallery-4]  │
│  📧 Contact                                         │
│                                                     │
│  👤 User Profile                                    │
│  📞 Call Now                                        │
└─────────────────────────────────────────────────────┘
```

---

## Image Specifications

### Central Featured Image
- **Path:** `/images/shared/defaults/hero-default.jpg`
- **Size:** 192px × 192px (circular crop)
- **Purpose:** Main hero dish/restaurant showcase
- **Best for:** Signature dish, chef's special, or restaurant ambiance

### Floating Gallery Images (4 images)
- **Paths:** `/images/shared/gallery/gallery-[1-4].jpg`
- **Size:** 128px × 128px (rounded corners)
- **Purpose:** Supporting food photography
- **Best for:** Variety of dishes, ingredients, dining atmosphere

---

## How to Change Images

### Quick Method (Use Your Own Images)

1. **Replace files directly** in `/public/images/shared/gallery/`:
   ```bash
   # Replace with your images (keep same names)
   cp your-dish-1.jpg public/images/shared/gallery/gallery-1.jpg
   cp your-dish-2.jpg public/images/shared/gallery/gallery-2.jpg
   # etc...
   ```

2. **Or update the paths** in `primary/FullScreenDrawer.tsx` (lines 78-83):
   ```tsx
   const foodImages = [
     { src: '/images/your-custom-folder/dish1.jpg', alt: 'Your dish 1', position: 'top-4 right-8' },
     { src: '/images/your-custom-folder/dish2.jpg', alt: 'Your dish 2', position: 'top-32 right-24' },
     // Add more or remove as needed
   ];
   ```

3. **Change central image** (line 282 in `primary/FullScreenDrawer.tsx`):
   ```tsx
   <Image
     src="/images/your-hero-image.jpg"  // ← Change this
     alt="Featured dish"
     fill
     className="object-cover"
   />
   ```

---

## Image Position Customization

The floating images use Tailwind positioning classes. Here's how to adjust them:

### Current Positions
```tsx
{ position: 'top-4 right-8' }      // Near top-right
{ position: 'top-32 right-24' }    // Mid-right
{ position: 'bottom-32 right-12' } // Lower-right
{ position: 'bottom-4 right-36' }  // Bottom-right
```

### Position Class Reference
- `top-4` = 1rem (16px) from top
- `top-32` = 8rem (128px) from top
- `right-8` = 2rem (32px) from right
- `bottom-4` = 1rem (16px) from bottom

**Full Tailwind spacing scale:** https://tailwindcss.com/docs/customizing-spacing

---

## Adding More Images

Want to showcase more food? Easy!

```tsx
const foodImages = [
  // Existing 4 images...
  { src: '/images/shared/gallery/gallery-5.jpg', alt: 'New dish', position: 'top-1/2 right-4' },
  { src: '/images/shared/gallery/gallery-6.jpg', alt: 'Another dish', position: 'bottom-1/2 right-32' },
];
```

**Tip:** Use different positions to avoid overlap. Test on different screen sizes!

---

## Image Requirements

### Recommended Specs
- **Format:** JPG, WebP, or PNG
- **Resolution:** At least 512px × 512px (for sharp display on retina screens)
- **Aspect ratio:** Square (1:1) works best
- **File size:** < 200KB each (optimize for web)
- **Content:** High-quality food photography with good lighting

### Optimization Tips
1. Use WebP format for smallest file sizes
2. Compress images with tools like TinyPNG or ImageOptim
3. Use Next.js Image optimization (already built-in!)

---

## Quick Checklist

Before going live, verify:
- [ ] All image paths exist in `/public/images/`
- [ ] Images are optimized (< 200KB each)
- [ ] Images look good on mobile devices
- [ ] Central hero image represents your brand well
- [ ] Gallery images show variety of your menu

---

## Troubleshooting

**Images not showing?**
1. Check file paths are correct (case-sensitive!)
2. Verify images exist in `/public/images/`
3. Clear Next.js cache: `npm run dev` (restart dev server)
4. Check browser console for 404 errors

**Images look stretched or weird?**
- Use square images (1:1 aspect ratio)
- Minimum 512px × 512px resolution
- Check `object-cover` class is applied

**Too many/few images?**
- Adjust the `foodImages` array size
- 4-6 images work best for visual balance

---

## Examples

### Minimal (3 images)
```tsx
const foodImages = [
  { src: '/images/dish1.jpg', alt: 'Dish 1', position: 'top-8 right-8' },
  { src: '/images/dish2.jpg', alt: 'Dish 2', position: 'bottom-8 right-8' },
  { src: '/images/dish3.jpg', alt: 'Dish 3', position: 'top-1/2 right-16' },
];
```

### Maximum Impact (6 images)
```tsx
const foodImages = [
  { src: '/images/1.jpg', alt: '1', position: 'top-4 right-4' },
  { src: '/images/2.jpg', alt: '2', position: 'top-4 right-28' },
  { src: '/images/3.jpg', alt: '3', position: 'top-32 right-12' },
  { src: '/images/4.jpg', alt: '4', position: 'bottom-4 right-4' },
  { src: '/images/5.jpg', alt: '5', position: 'bottom-4 right-28' },
  { src: '/images/6.jpg', alt: '6', position: 'bottom-32 right-16' },
];
```

---

**Questions?** Check the main README.md or inspect `primary/FullScreenDrawer.tsx` lines 62-83 for image configuration.
