import type { ComponentType } from 'react';
import type { ReviewsGridContent } from './schema';

export type ReviewsGridVariant = 'primary';

export interface ReviewsGridRendererProps {
  variant?: ReviewsGridVariant;
  content: ReviewsGridContent;
  onHelpfulClick?: (reviewId: string) => void;
  fallbackVariant?: ReviewsGridVariant;
}

export type ReviewsGridComponentProps = {
  content: ReviewsGridContent;
  onHelpfulClick?: (reviewId: string) => void;
};

export type ReviewsGridComponent = ComponentType<ReviewsGridComponentProps>;

export type { ReviewsGridContent, ReviewsGridReview } from './schema';
