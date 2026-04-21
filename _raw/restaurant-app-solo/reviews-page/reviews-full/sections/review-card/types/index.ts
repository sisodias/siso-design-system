import type { ComponentType } from 'react';
import type { ReviewCardContent } from './schema';

export type ReviewCardVariant = 'primary' | 'noir';

export interface ReviewCardRendererProps {
  variant?: ReviewCardVariant;
  content: ReviewCardContent;
  onImageClick?: (images: string[], startIndex: number) => void;
  onHelpfulClick?: (reviewId: string) => void;
  fallbackVariant?: ReviewCardVariant;
}

export type ReviewCardComponentProps = {
  review: ReviewCardContent;
  onImageClick?: (images: string[], startIndex: number) => void;
  onHelpfulClick?: (reviewId: string) => void;
};

export type ReviewCardComponent = ComponentType<ReviewCardComponentProps>;

export type { ReviewCardContent } from './schema';
