import type { LocationVariant } from './types';
import type { LocationContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as LocationPrimaryMetadata, LocationPrimary } from './templates/primary/index';
import { metadata as LocationTemplate2Metadata, LocationTemplate2 } from './templates/template-2';
import { metadata as LocationTemplate3Metadata, LocationTemplate3 } from './templates/template-3';

export const locationRegistry = createSectionRegistry<LocationVariant, LocationContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: LocationPrimaryMetadata.name,
      description: LocationPrimaryMetadata.description,
      screenshot: LocationPrimaryMetadata.screenshot,
      tags: LocationPrimaryMetadata.tags,
      supports: { mapEmbed: true, contacts: true, hours: true },
      load: async () => ({ default: LocationPrimary }),
    },
    'template-2': {
      label: LocationTemplate2Metadata.name,
      description: LocationTemplate2Metadata.description,
      screenshot: LocationTemplate2Metadata.screenshot,
      tags: LocationTemplate2Metadata.tags,
      supports: { mapEmbed: true, stickyLayout: true },
      load: async () => ({ default: LocationTemplate2 }),
    },
    'template-3': {
      label: LocationTemplate3Metadata.name,
      description: LocationTemplate3Metadata.description,
      screenshot: LocationTemplate3Metadata.screenshot,
      tags: LocationTemplate3Metadata.tags,
      supports: { placeholder: true },
      load: async () => ({ default: LocationTemplate3 }),
    },
  },
});

const components: Record<LocationVariant, (props: LocationContent) => JSX.Element> = {
  'primary': LocationPrimary,
  'template-2': LocationTemplate2,
  'template-3': LocationTemplate3,
};

export function getLocationVariant(variant: string | undefined): LocationVariant {
  return resolveVariant(variant, locationRegistry);
}

export function getLocationComponent(variant: LocationVariant) {
  return components[variant];
}

export function listLocationVariants() {
  return listVariants(locationRegistry);
}
