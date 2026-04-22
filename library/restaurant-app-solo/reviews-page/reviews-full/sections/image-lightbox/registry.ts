import type { ImageLightboxVariant, ImageLightboxComponent, ImageLightboxComponentProps } from './types';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as ImageLightboxPrimaryMetadata, ImageLightboxPrimary } from './templates/primary';

export const imageLightboxRegistry = createSectionRegistry<ImageLightboxVariant, ImageLightboxComponentProps>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: ImageLightboxPrimaryMetadata.name,
      description: ImageLightboxPrimaryMetadata.description,
      screenshot: ImageLightboxPrimaryMetadata.screenshot,
      tags: ImageLightboxPrimaryMetadata.tags,
      load: async () => ({ default: ImageLightboxPrimary }),
    },
  },
});

const components: Record<ImageLightboxVariant, ImageLightboxComponent> = {
  primary: ImageLightboxPrimary,
};

export function getImageLightboxVariant(variant: string | undefined): ImageLightboxVariant {
  return resolveVariant(variant, imageLightboxRegistry);
}

export function getImageLightboxComponent(variant: ImageLightboxVariant) {
  return components[variant];
}

export function listImageLightboxVariants() {
  return listVariants(imageLightboxRegistry);
}
