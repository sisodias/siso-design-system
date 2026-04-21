# FeatureCallouts

**Source:** `luminelle-partnership / src/domains/client/shop/products/ui/sections/feature-callouts/FeatureCallouts.tsx`

One of Shaan's favorite components — a dual-variant content-block section used TWICE on the PDP with different props.

## Two Variants

### `variant="reasons"` ("YOUR SIGN TO TRY THIS")

Compact eyebrow pill + 3 vertically-stacked white cards. Each card has a filled cocoa circle with a big white number (1, 2, 3) on the left, title on top right, and body copy below. Card 2 is often highlighted with a blush-tinted bg.

### `variant="story"` ("WHY YOU'LL LOVE IT")

Centered peach pill eyebrow + multi-line heading + subtitle + embedded 9:16 TikTok/Instagram video with floating "Safe for silk press" chip overlay at top, creator note bottom-left, engagement stats bottom-right, "WATCH IT IN ACTION" peach pill label. Below video: row of outlined pill chips ("Creator-tested frizz", etc.).

## Prop Shapes

### `variant="cards"` (default)
```ts
<FeatureCallouts
  items={[
    { icon: Droplets, title: 'Waterproof', desc: '...' },
    // ...
  ]}
  heading={{ eyebrow: 'Features', title: '...', description: '...' }}
  sectionId="my-section"
/>
```

### `variant="story"`
```ts
<FeatureCallouts
  variant="story"
  mediaSrc="video://https://www.tiktok.com/embed/..."
  mediaAlt="Lumelle shower cap in use"
  mediaLabel="Less breakage"
  mediaNote="Soft satin band prevents pulling"
  pills={['Creator-tested frizz', 'Shower Cap', 'Frizz-free']}
  heading={{ eyebrow: 'Why you\'ll love it', title: '...', description: '...' }}
  sectionId="why-love"
/>
```

## Dependencies

| Dependency | Location |
|---|---|
| `SectionHeading` | `@components/lumelle/hero-composition/SectionHeading` |
| `LazyVisible` | `@components/lumelle/tiktok-carousel/LazyVisible` |
| `lucide-react` (Crown, Droplets, Leaf, Heart) | external |
| `react-router-dom` (Link as RouterLink) | external |

## Known Broken Imports (when isolated)

The following `@ui/...` imports need rewiring to `@components/lumelle/...`:
- `@ui/components/SectionHeading` -> `@components/lumelle/hero-composition/SectionHeading`
- `@ui/components/LazyVisible` -> `@components/lumelle/tiktok-carousel/LazyVisible`

These rewires have already been applied in the ported file.

## Why This Is a Keeper

Shaan explicitly called out the "why you'll love this" section as one he likes. The dual-variant pattern (same component, two layouts via prop) is a smart reuse pattern that avoids code duplication between the numbered-reasons and story-with-video sections.
