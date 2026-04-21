# restaurant-app-solo / reviews-page

**Platform:** Mobile — all SISO-harvested components are mobile-first. Desktop layouts (if any) are secondary variants inside the same file. Use on mobile surfaces only unless explicitly redesigned.

**Source:**** restaurant-app-solo / `src/domains/customer-facing/reviews/` + `src/domains/customer-facing/landing/sections/review-section/`

**What it is:** Full reviews page (grid view, individual review cards, add-review modal) + a landing page reviews teaser section with 10 distinct visual variants.

## Sub-folders

| Path | Contents |
|------|----------|
| `reviews-full/pages/` | `ReviewsPage.tsx` -- full reviews page orchestrator |
| `reviews-full/sections/reviews-grid/` | Responsive grid layout for review cards |
| `reviews-full/sections/review-card/` | Single review card (primary + noir variants) |
| `reviews-full/sections/add-review-modal/` | Modal for posting a new review with form |
| `reviews-full/sections/filter-bar/` | Filter/sort bar (star rating, date, tags) |
| `reviews-full/sections/ratings-summary/` | Aggregate rating display (overall + breakdown) |
| `reviews-full/sections/guest-feedback-section/` | Guest feedback submission section |
| `reviews-full/sections/image-lightbox/` | Photo gallery lightbox for review images |
| `reviews-full/shared/` | Shared components, services, config |
| `review-section-landing/` | Condensed landing page teaser (10 variants: animated-stack, classic, featured, glass-swiper, grid, image-masonry, minimal, modern, primary, scrolling-columns, stagger-cards, testimonial) |

## Reusable primitives to promote

- **ReviewCard** -- author avatar + name, star rating, body text, date, tags, photo thumbnails
- **StarRating** -- reusable star rating display (filled/half/empty)
- **ReviewGrid** -- responsive card grid with column variants
- **AddReviewModal** -- modal form pattern with rating input + textarea + photo upload
- **FilterBar** -- filter chips + sort dropdown + count
- **RatingsSummary** -- overall score + bar-chart breakdown
- **ImageLightbox** -- photo carousel in review detail
- **Landing teaser variants** -- any of the 10 `review-section-landing/templates/` variants can be ported standalone

## Dependencies

- `lucide-react` (icons)
- `framer-motion` / `motion/react` (animations, modals)
- `date-fns` (date formatting)
- `zod` (form validation)
- `class-variance-authority` (variant handling)
- `clsx` (class merging)
- `next/image`, `next/link`, `next/navigation` (Next.js)

## Known broken imports (will not resolve in design-system bank)

All `@/` path aliases reference the restaurant-app-solo monorepo and must be replaced:

```
@/components/ui/avatar
@/config/client
@/domains/customer-facing/landing/shared/components/review-card
@/domains/customer-facing/reviews/sections/add-review-modal/templates/primary
@/domains/customer-facing/reviews/sections/filter-bar/templates/primary
@/domains/customer-facing/reviews/sections/image-lightbox/templates/primary
@/domains/customer-facing/reviews/sections/ratings-summary/templates/primary
@/domains/customer-facing/reviews/sections/review-card
@/domains/customer-facing/reviews/sections/reviews-grid/templates/primary
@/domains/customer-facing/reviews/shared/components/FloatingAddReviewButton
@/domains/customer-facing/reviews/shared/components/WriteReviewButton
@/domains/customer-facing/reviews/shared/config/review-links
@/domains/customer-facing/reviews/shared/config/review-theme
@/domains/shared/components
@/domains/shared/hooks/use-toast
@/domains/shared/section-tools
@/lib/supabase/server
@/lib/supabase/withTenantSupabase
@/lib/utils
```

Third-party imports (`lucide-react`, `framer-motion`, `date-fns`, `zod`, `cva`, `clsx`, `next/*`, `@storybook/react`, `vitest`) are fine and will resolve in the design system bank.

## Stats

- **Total LOC:** 5,221 (73 files)
- **No refactor performed** -- wholesale copy preserved as reference
