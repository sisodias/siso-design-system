import type { PromoVariant } from './types';
import type { PromoContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as PromoPrimaryMetadata, PromoPrimary } from './templates/primary';

export const promoRegistry = createSectionRegistry<PromoVariant, PromoContent>({
  defaultVariant: 'primary',
  variants: {
    primary: {
      label: PromoPrimaryMetadata.name,
      description: PromoPrimaryMetadata.description,
      screenshot: PromoPrimaryMetadata.screenshot,
      tags: PromoPrimaryMetadata.tags,
      load: async () => ({ default: PromoPrimary }),
    },
  },
});

const components: Record<PromoVariant, (props: PromoContent) => JSX.Element> = {
  primary: PromoPrimary,
};

export function getPromoVariant(variant: string | undefined) {
  return resolveVariant(variant, promoRegistry);
}

export function getPromoComponent(variant: PromoVariant) {
  return components[variant];
}

export function listPromoVariants() {
  return listVariants(promoRegistry);
}
