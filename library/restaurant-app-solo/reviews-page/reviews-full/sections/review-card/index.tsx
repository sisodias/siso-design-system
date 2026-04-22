import type { ReviewCardRendererProps } from './types';
import type { ReviewCardVariant } from './types';
import type { ReviewCardContent } from './types/schema';
import { reviewCardRegistry, getReviewCardVariant, getReviewCardComponent, listReviewCardVariants } from './registry';

export * from './types';
export { reviewCardRegistry, listReviewCardVariants };

export function ReviewCardRenderer({
  variant,
  fallbackVariant,
  content,
  onImageClick,
  onHelpfulClick,
}: ReviewCardRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getReviewCardVariant(requested);
  const Component = getReviewCardComponent(resolved);
  return <Component review={content} onImageClick={onImageClick} onHelpfulClick={onHelpfulClick} />;
}

export function renderReviewCard({
  variant,
  fallbackVariant,
  content,
  onImageClick,
  onHelpfulClick,
}: ReviewCardRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getReviewCardVariant(requested);
  const Component = getReviewCardComponent(resolved);
  return <Component review={content} onImageClick={onImageClick} onHelpfulClick={onHelpfulClick} />;
}

export function getReviewCardVariants(): Array<{ key: ReviewCardVariant; label: string; description: string }> {
  return listReviewCardVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { ReviewCardContent };
