import type { MapVariant } from './types';
import type { MapContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as MapPrimaryMetadata, MapPrimary } from './templates/primary';

export const mapRegistry = createSectionRegistry<MapVariant, MapContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: MapPrimaryMetadata.name,
      description: MapPrimaryMetadata.description,
      screenshot: MapPrimaryMetadata.screenshot,
      tags: MapPrimaryMetadata.tags,
      load: async () => ({ default: MapPrimary }),
    },
  },
});

const components: Record<MapVariant, (props: MapContent) => JSX.Element> = {
  'primary': MapPrimary,
};

export function getMapVariant(variant: string | undefined): MapVariant {
  return resolveVariant(variant, mapRegistry);
}

export function getMapComponent(variant: MapVariant) {
  return components[variant];
}

export function listMapVariants() {
  return listVariants(mapRegistry);
}
