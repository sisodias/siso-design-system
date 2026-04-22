import type { FaqVariant } from './types';
import type { FaqContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as FaqPrimaryMetadata, FaqPrimary } from './templates/primary/index';
import { metadata as FaqTemplate2Metadata, FaqTemplate2 } from './templates/template-2';
import { metadata as FaqTemplate3Metadata, FaqTemplate3 } from './templates/template-3';

export const faqRegistry = createSectionRegistry<FaqVariant, FaqContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: FaqPrimaryMetadata.name,
      description: FaqPrimaryMetadata.description,
      screenshot: FaqPrimaryMetadata.screenshot,
      tags: FaqPrimaryMetadata.tags,
      supports: { categories: true, cta: true },
      load: async () => ({ default: FaqPrimary }),
    },
    'template-2': {
      label: FaqTemplate2Metadata.name,
      description: FaqTemplate2Metadata.description,
      screenshot: FaqTemplate2Metadata.screenshot,
      tags: FaqTemplate2Metadata.tags,
      supports: { spotlight: true, categories: true },
      load: async () => ({ default: FaqTemplate2 }),
    },
    'template-3': {
      label: FaqTemplate3Metadata.name,
      description: FaqTemplate3Metadata.description,
      screenshot: FaqTemplate3Metadata.screenshot,
      tags: FaqTemplate3Metadata.tags,
      supports: { placeholder: true },
      load: async () => ({ default: FaqTemplate3 }),
    },
  },
});

const components: Record<FaqVariant, (props: FaqContent) => JSX.Element> = {
  'primary': FaqPrimary,
  'template-2': FaqTemplate2,
  'template-3': FaqTemplate3,
};

export function getFaqVariant(variant: string | undefined): FaqVariant {
  return resolveVariant(variant, faqRegistry);
}

export function getFaqComponent(variant: FaqVariant) {
  return components[variant];
}

export function listFaqVariants() {
  return listVariants(faqRegistry);
}
