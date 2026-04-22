import type { GuestFeedbackVariant } from './types';
import type { GuestFeedbackContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as GuestFeedbackPrimaryMetadata, GuestFeedbackPrimary } from './templates/primary';

export const guestFeedbackRegistry = createSectionRegistry<GuestFeedbackVariant, GuestFeedbackContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: GuestFeedbackPrimaryMetadata.name,
      description: GuestFeedbackPrimaryMetadata.description,
      screenshot: GuestFeedbackPrimaryMetadata.screenshot,
      tags: GuestFeedbackPrimaryMetadata.tags,
      load: async () => ({ default: GuestFeedbackPrimary }),
    },
  },
});

const components: Record<GuestFeedbackVariant, (props: GuestFeedbackContent) => JSX.Element> = {
  'primary': GuestFeedbackPrimary,
};

export function getGuestFeedbackVariant(variant: string | undefined): GuestFeedbackVariant {
  return resolveVariant(variant, guestFeedbackRegistry);
}

export function getGuestFeedbackComponent(variant: GuestFeedbackVariant) {
  return components[variant];
}

export function listGuestFeedbackVariants() {
  return listVariants(guestFeedbackRegistry);
}
