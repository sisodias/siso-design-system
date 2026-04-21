import type { RatingsSummaryRendererProps } from './types';
import type { RatingsSummaryVariant } from './types';
import type { RatingsSummaryContent } from './types/schema';
import { ratingsSummaryRegistry, getRatingsSummaryVariant, getRatingsSummaryComponent, listRatingsSummaryVariants } from './registry';

export * from './types';
export { ratingsSummaryRegistry, listRatingsSummaryVariants };

export function RatingsSummaryRenderer({ variant, fallbackVariant, content, actionSlot }: RatingsSummaryRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getRatingsSummaryVariant(requested);
  const Component = getRatingsSummaryComponent(resolved);
  return <Component content={content} actionSlot={actionSlot} />;
}

export function renderRatingsSummary({ variant, fallbackVariant, content, actionSlot }: RatingsSummaryRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getRatingsSummaryVariant(requested);
  const Component = getRatingsSummaryComponent(resolved);
  return <Component content={content} actionSlot={actionSlot} />;
}

export function getRatingsSummaryVariants(): Array<{ key: RatingsSummaryVariant; label: string; description: string }> {
  return listRatingsSummaryVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { RatingsSummaryContent };
