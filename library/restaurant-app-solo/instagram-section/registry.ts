import type { InstagramVariant } from './types';
import type { InstagramContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as InstagramPrimaryMetadata, InstagramPrimary } from './templates/primary';

export const instagramRegistry = createSectionRegistry<InstagramVariant, InstagramContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: InstagramPrimaryMetadata.name,
      description: InstagramPrimaryMetadata.description,
      screenshot: InstagramPrimaryMetadata.screenshot,
      tags: InstagramPrimaryMetadata.tags,
      load: async () => ({ default: InstagramPrimary }),
    },
  },
});

const components: Record<InstagramVariant, (props: InstagramContent) => JSX.Element> = {
  'primary': InstagramPrimary,
};

export function getInstagramVariant(variant: string | undefined): InstagramVariant {
  return resolveVariant(variant, instagramRegistry);
}

export function getInstagramComponent(variant: InstagramVariant) {
  return components[variant];
}

export function listInstagramVariants() {
  return listVariants(instagramRegistry);
}
