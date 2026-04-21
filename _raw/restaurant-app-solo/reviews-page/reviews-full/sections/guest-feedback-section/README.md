# Guest Feedback Section

This section powers the `/reviews` experience. It bundles the stats header, filter sidebar, review grid, modal workflow, and floating CTA so variants can swap layouts without touching the page contract.

- `index.tsx` / `registry.ts` – renderer helpers + `createSectionRegistry` wiring
- `types/` – Zod schema + exported TypeScript types (`GuestFeedbackContent`, `GuestFeedbackReview`, etc.)
- `data/mock.ts` – seeded snapshot used by Storybook (`GuestFeedbackSection` story) and Vitest smoke test
- Reuses component scaffolds in `../ratings-summary`, `../filter-bar`, `../reviews-grid`, `../review-card`, `../add-review-modal`, and `../image-lightbox`
- `templates/primary/` – server wrapper + client shell that handles modal state and server actions
- `tests/guestfeedbacksection.spec.ts` – verifies default variant registration/fallback

## Data Contract (v1)
```ts
GuestFeedbackContent = {
  heading: { title: string; subtitle?: string; pillText?: string };
  stats: {
    average: number;
    total: number;
    breakdown: { '5_stars': number; '4_stars': number; '3_stars': number; '2_stars': number; '1_star': number };
  };
  featuredTags?: string[];
  filters: {
    totalReviews: number;
    ratingBreakdown?: { 1: number; 2: number; 3: number; 4: number; 5: number };
  };
  reviews: GuestFeedbackReview[];
  viewer: { isAuthenticated: boolean; userName?: string | null };
}
```

`GuestFeedbackReview` models the Supabase payload (camel-cased) including optional owner responses, highlights/tags metadata, and image galleries.

## Variants
- **primary** – grid layout with sticky filter sidebar, gradient cards, submission modal, and floating “Add Review” CTA. Additional variants should re-use the shared components or extend them under `templates/<variant>/`.

See `docs/domains/section-architecture.md` for the shared playbook when adding new variants.
