import type { ReviewRendererProps } from './types';
import type { ReviewVariant } from './types';
import type { ReviewContent } from './types/schema';
import { reviewRegistry, getReviewVariant, getReviewComponent, listReviewVariants } from './registry';

export * from './types';
export { reviewRegistry, listReviewVariants };

export function ReviewRenderer({ variant, fallbackVariant, content }: ReviewRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getReviewVariant(requested);
  const Component = getReviewComponent(resolved);
  return <Component {...content} />;
}

export function renderReview({ variant, fallbackVariant, content }: ReviewRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getReviewVariant(requested);
  const Component = getReviewComponent(resolved);
  return <Component {...content} />;
}

export function getReviewVariants(): Array<{ key: ReviewVariant; label: string; description: string }> {
  return listReviewVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { ReviewContent };
