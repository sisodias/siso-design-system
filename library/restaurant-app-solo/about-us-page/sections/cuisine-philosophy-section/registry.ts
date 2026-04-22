import type { CuisinePhilosophyVariant } from './types';
import type { CuisinePhilosophyContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as CuisinePhilosophyPrimaryMetadata, CuisinePhilosophyPrimary } from './templates/primary';
import { metadata as CuisinePhilosophyTemplate2Metadata, CuisinePhilosophyTemplate2 } from './templates/template-2';
import { metadata as CuisinePhilosophyTemplate3Metadata, CuisinePhilosophyTemplate3 } from './templates/template-3';

export const cuisinePhilosophyRegistry = createSectionRegistry<CuisinePhilosophyVariant, CuisinePhilosophyContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: CuisinePhilosophyPrimaryMetadata.name,
      description: CuisinePhilosophyPrimaryMetadata.description,
      screenshot: CuisinePhilosophyPrimaryMetadata.screenshot,
      tags: CuisinePhilosophyPrimaryMetadata.tags,
      load: async () => ({ default: CuisinePhilosophyPrimary }),
    },
    'template-2': {
      label: CuisinePhilosophyTemplate2Metadata.name,
      description: CuisinePhilosophyTemplate2Metadata.description,
      screenshot: CuisinePhilosophyTemplate2Metadata.screenshot,
      tags: CuisinePhilosophyTemplate2Metadata.tags,
      load: async () => ({ default: CuisinePhilosophyTemplate2 }),
    },
    'template-3': {
      label: CuisinePhilosophyTemplate3Metadata.name,
      description: CuisinePhilosophyTemplate3Metadata.description,
      screenshot: CuisinePhilosophyTemplate3Metadata.screenshot,
      tags: CuisinePhilosophyTemplate3Metadata.tags,
      load: async () => ({ default: CuisinePhilosophyTemplate3 }),
    },
  },
});

const components: Record<CuisinePhilosophyVariant, (props: CuisinePhilosophyContent) => JSX.Element> = {
  'primary': CuisinePhilosophyPrimary,
  'template-2': CuisinePhilosophyTemplate2,
  'template-3': CuisinePhilosophyTemplate3,
};

export function getCuisinePhilosophyVariant(variant: string | undefined): CuisinePhilosophyVariant {
  return resolveVariant(variant, cuisinePhilosophyRegistry);
}

export function getCuisinePhilosophyComponent(variant: CuisinePhilosophyVariant) {
  return components[variant];
}

export function listCuisinePhilosophyVariants() {
  return listVariants(cuisinePhilosophyRegistry);
}
