import type { ReviewsGridRendererProps } from './types';
import type { ReviewsGridVariant } from './types';
import type { ReviewsGridContent } from './types/schema';
import { reviewsGridRegistry, getReviewsGridVariant, getReviewsGridComponent, listReviewsGridVariants } from './registry';

export * from './types';
export { reviewsGridRegistry, listReviewsGridVariants };

export function ReviewsGridRenderer({ variant, fallbackVariant, content, onHelpfulClick }: ReviewsGridRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getReviewsGridVariant(requested);
  const Component = getReviewsGridComponent(resolved);
  return <Component content={content} onHelpfulClick={onHelpfulClick} />;
}

export function renderReviewsGrid({ variant, fallbackVariant, content, onHelpfulClick }: ReviewsGridRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getReviewsGridVariant(requested);
  const Component = getReviewsGridComponent(resolved);
  return <Component content={content} onHelpfulClick={onHelpfulClick} />;
}

export function getReviewsGridVariants(): Array<{ key: ReviewsGridVariant; label: string; description: string }> {
  return listReviewsGridVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { ReviewsGridContent };
