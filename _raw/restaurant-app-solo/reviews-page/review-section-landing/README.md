# Review Section Architecture

The review section now follows the shared scaffold (`docs/domains/section-architecture.md`). All legacy `review-templates` variants were migrated into `review-section/` so registry, schema, mocks, Storybook, and tests are consistent.

- `index.tsx` – public renderer + helper utilities
- `registry.ts` – variant metadata, loader map, fallback resolver
- `types/` – Zod schema (`ReviewContent`) and typed renderer props
- `data/mock.ts` – representative testimonial payloads for every variant
- `shared/` – reusable bits (`TestimonialsColumn`, helpers)
- `templates/<variant>/` – concrete implementations with metadata + README
- `stories/` – Storybook stories rendering each variant from mocks
- `tests/` – Vitest smoke coverage for registry wiring

## Data Contract (`ReviewContent`)

```ts
{
  title?: string;
  viewAllHref?: string;
  reviews: Array<{
    id: string;
    authorName: string;
    rating: number;
    comment?: string | null;
    publishedAt?: string | Date;
  }>;
  avgRating?: number;
  totalCount?: number;
}
```

All variants depend on the same payload shape; optional fields fall back gracefully when omitted.

## Variant Highlights

| Variant | Summary | Best for |
| --- | --- | --- |
| `primary` / `scrolling-columns` | Triple-column marquee of testimonials with animated scroll | Landing hero follow-ups, social proof bands |
| `classic` | Three-up cards with rating badge and CTA | Landing mid-page trust section |
| `modern` | Gradient-backed cards with ratings + CTA button | Premium campaign pages |
| `minimal` | Editorial list with subtle rating chips | Long-form content, slim rows |
| `featured` | Spotlight hero quote plus supporting cards | PR highlights, awards |
| `testimonial` | Framed testimonial trio with quote accents | General trust segments |
| `grid` | Animated mosaic grid backed by dashed pattern | Case studies, data storytelling |
| `glass-swiper` | Drag/swipe glassmorphism stack | Mobile-first, interactive landers |
| `image-masonry` | Gradient masonry wall with responsive columns | Lifestyle & brand visuals |
| `stagger-cards` | Playful staggered diamond cards | Event promos, experiential brands |
| `animated-stack` | Scroll-triggered 3D card stack | Scroll storytelling hero |

Update this README whenever new variants ship or the contract changes.
