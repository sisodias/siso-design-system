import type { StoryVariant } from './types';
import type { StoryContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as StoryPrimaryMetadata, StoryPrimary } from './templates/primary';
import { metadata as StoryTemplate2Metadata, StoryTemplate2 } from './templates/template-2';
import { metadata as StoryTemplate3Metadata, StoryTemplate3 } from './templates/template-3';

export const storyRegistry = createSectionRegistry<StoryVariant, StoryContent>({
  defaultVariant: 'primary',
  variants: {
    primary: {
      label: StoryPrimaryMetadata.name,
      description: StoryPrimaryMetadata.description,
      screenshot: StoryPrimaryMetadata.screenshot,
      tags: StoryPrimaryMetadata.tags,
      load: async () => ({ default: StoryPrimary }),
    },
    'template-2': {
      label: StoryTemplate2Metadata.name,
      description: StoryTemplate2Metadata.description,
      screenshot: StoryTemplate2Metadata.screenshot,
      tags: StoryTemplate2Metadata.tags,
      load: async () => ({ default: StoryTemplate2 }),
    },
    'template-3': {
      label: StoryTemplate3Metadata.name,
      description: StoryTemplate3Metadata.description,
      screenshot: StoryTemplate3Metadata.screenshot,
      tags: StoryTemplate3Metadata.tags,
      load: async () => ({ default: StoryTemplate3 }),
    },
  },
});

const components: Record<StoryVariant, (props: StoryContent) => JSX.Element> = {
  primary: StoryPrimary,
  'template-2': StoryTemplate2,
  'template-3': StoryTemplate3,
};

export function getStoryVariant(variant: string | undefined): StoryVariant {
  return resolveVariant(variant, storyRegistry);
}

export function getStoryComponent(variant: StoryVariant) {
  return components[variant];
}

export function listStoryVariants() {
  return listVariants(storyRegistry);
}
