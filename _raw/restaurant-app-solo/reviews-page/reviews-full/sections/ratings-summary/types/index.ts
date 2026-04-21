import type { ComponentType, ReactNode } from 'react';
import type { RatingsSummaryContent } from './schema';

export type RatingsSummaryVariant = 'primary';

export interface RatingsSummaryRendererProps {
  variant?: RatingsSummaryVariant;
  content: RatingsSummaryContent;
  actionSlot?: ReactNode;
  fallbackVariant?: RatingsSummaryVariant;
}

export type RatingsSummaryComponentProps = {
  content: RatingsSummaryContent;
  actionSlot?: ReactNode;
};

export type RatingsSummaryComponent = ComponentType<RatingsSummaryComponentProps>;

export type { RatingsSummaryContent } from './schema';
