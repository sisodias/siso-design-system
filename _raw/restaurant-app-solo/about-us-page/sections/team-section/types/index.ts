import type { ComponentType } from 'react';
import type { TeamContent, TeamMember } from './schema';

export type TeamVariant = 'primary' | 'template-2' | 'template-3';

export interface TeamRendererProps {
  variant?: TeamVariant;
  content: TeamContent;
  fallbackVariant?: TeamVariant;
}

export type TeamComponent = ComponentType<TeamContent>;
export type { TeamContent, TeamMember };
