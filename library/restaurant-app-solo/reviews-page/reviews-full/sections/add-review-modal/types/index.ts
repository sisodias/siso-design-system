import type { ComponentType } from 'react';
import type { AddReviewModalContent } from './schema';

export type AddReviewModalVariant = 'primary';

export interface AddReviewModalRendererProps {
  variant?: AddReviewModalVariant;
  content: AddReviewModalContent;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void> | void;
  fallbackVariant?: AddReviewModalVariant;
}

export type AddReviewModalComponentProps = {
  content: AddReviewModalContent;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void> | void;
};

export type AddReviewModalComponent = ComponentType<AddReviewModalComponentProps>;

export type { AddReviewModalContent } from './schema';
