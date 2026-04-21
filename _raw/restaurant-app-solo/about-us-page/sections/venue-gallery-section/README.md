# Venue Gallery Section

Shared schema (`types/schema.ts`) provides:

- `pillText?: string`
- `title: string`
- `subtitle?: string`
- `intro?: string`
- `showCategories?: boolean`
- `layout?: 'masonry' | 'slider'`
- `images: VenueGalleryImage[]` (id, url, alt, optional category/caption)
- `cta?: { label: string; href: string }`

### Variants
- **primary — Masonry Lightbox Gallery**
  Category filterable masonry grid with fullscreen lightbox.
- **template-2 — Immersive Auto Slider**
  Motion-focused slider that loops imagery inside a cinematic frame.
- **template-3 — Venue Gallery Placeholder**
  Empty placeholder that reminds us to swap in a 21st.dev component later.

`templates/primary/components/VenueGallery.tsx` contains the reusable masonry implementation.
