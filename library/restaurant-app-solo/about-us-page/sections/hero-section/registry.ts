import type { HeroVariant } from './types';
import type { HeroContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as primaryMetadata, HeroPrimary } from './templates/primary';
import { metadata as templateTwoMetadata, HeroTemplateTwo } from './templates/template-2';
import { metadata as templateThreeMetadata, HeroTemplateThree } from './templates/template-3';

export const heroRegistry = createSectionRegistry<HeroVariant, HeroContent>({
  defaultVariant: 'primary',
  variants: {
    primary: {
      label: primaryMetadata.name,
      description: primaryMetadata.description,
      screenshot: primaryMetadata.screenshot,
      supports: { image: true },
      tags: primaryMetadata.tags,
      load: async () => ({ default: HeroPrimary }),
    },
    'template-2': {
      label: templateTwoMetadata.name,
      description: templateTwoMetadata.description,
      screenshot: templateTwoMetadata.screenshot,
      tags: templateTwoMetadata.tags,
      load: async () => ({ default: HeroTemplateTwo }),
    },
    'template-3': {
      label: templateThreeMetadata.name,
      description: templateThreeMetadata.description,
      screenshot: templateThreeMetadata.screenshot,
      supports: { splitLayout: true, image: true },
      tags: templateThreeMetadata.tags,
      load: async () => ({ default: HeroTemplateThree }),
    },
  },
});

const heroComponents: Record<HeroVariant, (props: HeroContent) => JSX.Element> = {
  primary: HeroPrimary,
  'template-2': HeroTemplateTwo,
  'template-3': HeroTemplateThree,
};

export function getHeroVariant(variant: string | undefined): HeroVariant {
  return resolveVariant(variant, heroRegistry);
}

export function getHeroComponent(variant: HeroVariant) {
  return heroComponents[variant];
}

export function listHeroVariants() {
  return listVariants(heroRegistry);
}
