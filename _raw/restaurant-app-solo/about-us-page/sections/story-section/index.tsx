import type { StoryRendererProps } from './types';
import type { StoryVariant } from './types';
import type { StoryContent } from './types/schema';
import { storyRegistry, getStoryVariant, getStoryComponent, listStoryVariants } from './registry';

export * from './types';
export { storyRegistry, listStoryVariants };

export function StoryRenderer({ variant, fallbackVariant, content }: StoryRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getStoryVariant(requested);
  const Component = getStoryComponent(resolved);
  return <Component {...content} />;
}

export function renderStory({ variant, fallbackVariant, content }: StoryRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getStoryVariant(requested);
  const Component = getStoryComponent(resolved);
  return <Component {...content} />;
}

export function getStoryVariants(): Array<{ key: StoryVariant; label: string; description: string }> {
  return listStoryVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { StoryContent };
