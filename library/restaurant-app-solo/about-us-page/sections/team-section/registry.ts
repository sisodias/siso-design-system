import type { TeamVariant } from './types';
import type { TeamContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as TeamPrimaryMetadata, TeamPrimary } from './templates/primary';
import { metadata as TeamTemplate2Metadata, TeamTemplate2 } from './templates/template-2';
import { metadata as TeamTemplate3Metadata, TeamTemplate3 } from './templates/template-3';

export const teamRegistry = createSectionRegistry<TeamVariant, TeamContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: TeamPrimaryMetadata.name,
      description: TeamPrimaryMetadata.description,
      screenshot: TeamPrimaryMetadata.screenshot,
      tags: TeamPrimaryMetadata.tags,
      load: async () => ({ default: TeamPrimary }),
    },
    'template-2': {
      label: TeamTemplate2Metadata.name,
      description: TeamTemplate2Metadata.description,
      screenshot: TeamTemplate2Metadata.screenshot,
      tags: TeamTemplate2Metadata.tags,
      load: async () => ({ default: TeamTemplate2 }),
    },
    'template-3': {
      label: TeamTemplate3Metadata.name,
      description: TeamTemplate3Metadata.description,
      screenshot: TeamTemplate3Metadata.screenshot,
      tags: TeamTemplate3Metadata.tags,
      load: async () => ({ default: TeamTemplate3 }),
    },
  },
});

const components: Record<TeamVariant, (props: TeamContent) => JSX.Element> = {
  'primary': TeamPrimary,
  'template-2': TeamTemplate2,
  'template-3': TeamTemplate3,
};

export function getTeamVariant(variant: string | undefined): TeamVariant {
  return resolveVariant(variant, teamRegistry);
}

export function getTeamComponent(variant: TeamVariant) {
  return components[variant];
}

export function listTeamVariants() {
  return listVariants(teamRegistry);
}
