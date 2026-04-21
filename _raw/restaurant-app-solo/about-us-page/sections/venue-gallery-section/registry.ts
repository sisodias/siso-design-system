import type { VenueGalleryVariant } from './types';
import type { VenueGalleryContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as VenueGalleryPrimaryMetadata, VenueGalleryPrimary } from './templates/primary';
import { metadata as VenueGalleryTemplate2Metadata, VenueGalleryTemplate2 } from './templates/template-2';
import { metadata as VenueGalleryTemplate3Metadata, VenueGalleryTemplate3 } from './templates/template-3';

export const venueGalleryRegistry = createSectionRegistry<VenueGalleryVariant, VenueGalleryContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: VenueGalleryPrimaryMetadata.name,
      description: VenueGalleryPrimaryMetadata.description,
      screenshot: VenueGalleryPrimaryMetadata.screenshot,
      tags: VenueGalleryPrimaryMetadata.tags,
      supports: { masonry: true, lightbox: true, categories: true },
      load: async () => ({ default: VenueGalleryPrimary }),
    },
    'template-2': {
      label: VenueGalleryTemplate2Metadata.name,
      description: VenueGalleryTemplate2Metadata.description,
      screenshot: VenueGalleryTemplate2Metadata.screenshot,
      tags: VenueGalleryTemplate2Metadata.tags,
      supports: { slider: true, motion: true },
      load: async () => ({ default: VenueGalleryTemplate2 }),
    },
    'template-3': {
      label: VenueGalleryTemplate3Metadata.name,
      description: VenueGalleryTemplate3Metadata.description,
      screenshot: VenueGalleryTemplate3Metadata.screenshot,
      tags: VenueGalleryTemplate3Metadata.tags,
      supports: { placeholder: true },
      load: async () => ({ default: VenueGalleryTemplate3 }),
    },
  },
});

const components: Record<VenueGalleryVariant, (props: VenueGalleryContent) => JSX.Element> = {
  'primary': VenueGalleryPrimary,
  'template-2': VenueGalleryTemplate2,
  'template-3': VenueGalleryTemplate3,
};

export function getVenueGalleryVariant(variant: string | undefined): VenueGalleryVariant {
  return resolveVariant(variant, venueGalleryRegistry);
}

export function getVenueGalleryComponent(variant: VenueGalleryVariant) {
  return components[variant];
}

export function listVenueGalleryVariants() {
  return listVariants(venueGalleryRegistry);
}
