# Guest Feedback · Primary Variant

- **Best for**: Standalone reviews pages that require rating stats, tag filters, and a write-review workflow.
- **Layout**: Two-column desktop layout (sticky filter sidebar + responsive grid), collapsible filters on mobile, gradient review cards with photo lightbox.
- **Content fields**: See `types/schema.ts` (`GuestFeedbackContent`). Provide stats, rating breakdown, review array, featured tags, and viewer state.
- **Notes**:
  - Client shell handles modal state and calls `submitReview` / `incrementHelpfulCount`.
  - Reuse shared components when building additional variants—extend under `templates/<variant>/` rather than duplicating logic.
