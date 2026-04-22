import type { CtaVariant } from './types';
import type { CtaContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as CtaPrimaryMetadata, CtaPrimary } from './templates/primary';
import { metadata as CtaTemplate2Metadata, CtaTemplate2 } from './templates/template-2';
import { metadata as CtaTemplate3Metadata, CtaTemplate3 } from './templates/template-3';

export const ctaRegistry = createSectionRegistry<CtaVariant, CtaContent>({
  defaultVariant: 'primary',
  variants: {
    primary: {
      label: CtaPrimaryMetadata.name,
      description: CtaPrimaryMetadata.description,
      screenshot: CtaPrimaryMetadata.screenshot,
      tags: CtaPrimaryMetadata.tags,
      supports: {
        backgroundImage: true,
        deliveryPartners: true,
      },
      load: async () => ({ default: CtaPrimary }),
    },
    'template-2': {
      label: CtaTemplate2Metadata.name,
      description: CtaTemplate2Metadata.description,
      screenshot: CtaTemplate2Metadata.screenshot,
      tags: CtaTemplate2Metadata.tags,
      supports: {
        dualCta: true,
      },
      load: async () => ({ default: CtaTemplate2 }),
    },
    'template-3': {
      label: CtaTemplate3Metadata.name,
      description: CtaTemplate3Metadata.description,
      screenshot: CtaTemplate3Metadata.screenshot,
      tags: CtaTemplate3Metadata.tags,
      supports: {
        minimalBanner: true,
      },
      load: async () => ({ default: CtaTemplate3 }),
    },
  },
});

const components: Record<CtaVariant, (props: CtaContent) => JSX.Element> = {
  primary: CtaPrimary,
  'template-2': CtaTemplate2,
  'template-3': CtaTemplate3,
};

export function getCtaVariant(variant: string | undefined): CtaVariant {
  return resolveVariant(variant, ctaRegistry);
}

export function getCtaComponent(variant: CtaVariant) {
  return components[variant];
}

export function listCtaVariants() {
  return listVariants(ctaRegistry);
}
