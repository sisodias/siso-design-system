import type { TeamRendererProps } from './types';
import type { TeamVariant } from './types';
import type { TeamContent } from './types/schema';
import { teamRegistry, getTeamVariant, getTeamComponent, listTeamVariants } from './registry';

export * from './types';
export { teamRegistry, listTeamVariants };

export function TeamRenderer({ variant, fallbackVariant, content }: TeamRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getTeamVariant(requested);
  const Component = getTeamComponent(resolved);
  return <Component {...content} />;
}

export function renderTeam({ variant, fallbackVariant, content }: TeamRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getTeamVariant(requested);
  const Component = getTeamComponent(resolved);
  return <Component {...content} />;
}

export function getTeamVariants(): Array<{ key: TeamVariant; label: string; description: string }> {
  return listTeamVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { TeamContent };
