import type { HeroRendererProps } from './types';
import type { HeroVariant } from './types';
import type { HeroContent } from './types/schema';
import { heroRegistry, getHeroVariant, getHeroComponent, listHeroVariants } from './registry';

export * from './types';
export { heroRegistry, listHeroVariants };

export function HeroRenderer({ variant, fallbackVariant, content }: HeroRendererProps) {
  const requestedVariant = variant ?? fallbackVariant;
  const resolvedVariant = getHeroVariant(requestedVariant);
  const Component = getHeroComponent(resolvedVariant);
  return <Component {...content} />;
}

export function renderHero({ variant, fallbackVariant, content }: HeroRendererProps) {
  const requestedVariant = variant ?? fallbackVariant;
  const resolvedVariant = getHeroVariant(requestedVariant);
  const Component = getHeroComponent(resolvedVariant);
  return <Component {...content} />;
}

export function getHeroVariants(): Array<{ key: HeroVariant; label: string; description: string }> {
  return listHeroVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { HeroContent };
