import type { ComponentType } from 'react';
import type { StoryContent, StoryMilestone } from './schema';

export type StoryVariant = 'primary' | 'template-2' | 'template-3';

export interface StoryRendererProps {
  variant?: StoryVariant;
  content: StoryContent;
  fallbackVariant?: StoryVariant;
}

export type StoryComponent = ComponentType<StoryContent>;
export type { StoryContent, StoryMilestone };
