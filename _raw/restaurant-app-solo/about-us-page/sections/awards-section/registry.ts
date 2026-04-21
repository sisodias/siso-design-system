import type { AwardsVariant } from './types';
import type { AwardsContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as AwardsPrimaryMetadata, AwardsPrimary } from './templates/primary';
import { metadata as AwardsTemplateTwoMetadata, AwardsTemplateTwo } from './templates/template-2';
import { metadata as AwardsTemplateThreeMetadata, AwardsTemplateThree } from './templates/template-3';

export const awardsRegistry = createSectionRegistry<AwardsVariant, AwardsContent>({
  defaultVariant: 'primary',
  variants: {
    primary: {
      label: AwardsPrimaryMetadata.name,
      description: AwardsPrimaryMetadata.description,
      screenshot: AwardsPrimaryMetadata.screenshot,
      tags: AwardsPrimaryMetadata.tags,
      supports: {
        testimonials: true,
        achievements: true,
        compact: true,
      },
      load: async () => ({ default: AwardsPrimary }),
    },
    'template-2': {
      label: AwardsTemplateTwoMetadata.name,
      description: AwardsTemplateTwoMetadata.description,
      screenshot: AwardsTemplateTwoMetadata.screenshot,
      tags: AwardsTemplateTwoMetadata.tags,
      supports: {
        testimonials: true,
        compact: true,
      },
      load: async () => ({ default: AwardsTemplateTwo }),
    },
    'template-3': {
      label: AwardsTemplateThreeMetadata.name,
      description: AwardsTemplateThreeMetadata.description,
      screenshot: AwardsTemplateThreeMetadata.screenshot,
      tags: AwardsTemplateThreeMetadata.tags,
      supports: {
        achievements: true,
      },
      load: async () => ({ default: AwardsTemplateThree }),
    },
  },
});

const components: Record<AwardsVariant, (props: AwardsContent) => JSX.Element> = {
  primary: AwardsPrimary,
  'template-2': AwardsTemplateTwo,
  'template-3': AwardsTemplateThree,
};

export function getAwardsVariant(variant: string | undefined): AwardsVariant {
  return resolveVariant(variant, awardsRegistry);
}

export function getAwardsComponent(variant: AwardsVariant) {
  return components[variant];
}

export function listAwardsVariants() {
  return listVariants(awardsRegistry);
}
