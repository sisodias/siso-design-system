// Customer-facing page
export { default as ReviewsPage } from './pages/ReviewsPage';

// Guest feedback section (primary variant)
export {
  GuestFeedbackRenderer,
  renderGuestFeedback,
  guestFeedbackRegistry,
  getGuestFeedbackVariants,
} from './sections/guest-feedback-section';

export type {
  GuestFeedbackContent,
  GuestFeedbackVariant,
  GuestFeedbackReview,
  GuestFeedbackRatingBreakdown,
} from './sections/guest-feedback-section';

// Backwards-compatible component exports (primary defaults)
export { RatingsSummaryPrimary as RatingsSummary } from './sections/ratings-summary/templates/primary';
export { FilterBarPrimary as FilterBar } from './sections/filter-bar/templates/primary';
export { ReviewsGridPrimary as ReviewsGrid } from './sections/reviews-grid/templates/primary';
export { ReviewCardPrimary as ReviewCard } from './sections/review-card/templates/primary';
export { AddReviewModalPrimary as AddReviewModal } from './sections/add-review-modal/templates/primary';
export { ImageLightboxPrimary as ImageLightbox } from './sections/image-lightbox/templates/primary';
export { FloatingAddReviewButton } from './shared/components/FloatingAddReviewButton';
export { WriteReviewButton } from './shared/components/WriteReviewButton';
