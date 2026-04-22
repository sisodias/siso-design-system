import type { AddReviewModalVariant, AddReviewModalComponent, AddReviewModalComponentProps } from './types';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as AddReviewModalPrimaryMetadata, AddReviewModalPrimary } from './templates/primary';

export const addReviewModalRegistry = createSectionRegistry<AddReviewModalVariant, AddReviewModalComponentProps>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: AddReviewModalPrimaryMetadata.name,
      description: AddReviewModalPrimaryMetadata.description,
      screenshot: AddReviewModalPrimaryMetadata.screenshot,
      tags: AddReviewModalPrimaryMetadata.tags,
      load: async () => ({ default: AddReviewModalPrimary }),
    },
  },
});

const components: Record<AddReviewModalVariant, AddReviewModalComponent> = {
  primary: AddReviewModalPrimary,
};

export function getAddReviewModalVariant(variant: string | undefined): AddReviewModalVariant {
  return resolveVariant(variant, addReviewModalRegistry);
}

export function getAddReviewModalComponent(variant: AddReviewModalVariant) {
  return components[variant];
}

export function listAddReviewModalVariants() {
  return listVariants(addReviewModalRegistry);
}
