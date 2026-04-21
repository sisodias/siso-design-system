import type { ComponentType } from 'react';
import type {
  GuestFeedbackContent,
  GuestFeedbackReview,
  GuestFeedbackRatingBreakdown,
} from './schema';

export type GuestFeedbackVariant = 'primary';

export interface GuestFeedbackRendererProps {
  variant?: GuestFeedbackVariant;
  content: GuestFeedbackContent;
  fallbackVariant?: GuestFeedbackVariant;
}

export type GuestFeedbackComponent = ComponentType<GuestFeedbackContent>;

export type { GuestFeedbackContent, GuestFeedbackReview, GuestFeedbackRatingBreakdown };
