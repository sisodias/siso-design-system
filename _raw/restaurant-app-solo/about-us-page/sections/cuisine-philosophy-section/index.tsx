import type { CuisinePhilosophyRendererProps } from './types';
import type { CuisinePhilosophyVariant } from './types';
import type { CuisinePhilosophyContent } from './types/schema';
import { cuisinePhilosophyRegistry, getCuisinePhilosophyVariant, getCuisinePhilosophyComponent, listCuisinePhilosophyVariants } from './registry';

export * from './types';
export { cuisinePhilosophyRegistry, listCuisinePhilosophyVariants };

export function CuisinePhilosophyRenderer({ variant, fallbackVariant, content }: CuisinePhilosophyRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getCuisinePhilosophyVariant(requested);
  const Component = getCuisinePhilosophyComponent(resolved);
  return <Component {...content} />;
}

export function renderCuisinePhilosophy({ variant, fallbackVariant, content }: CuisinePhilosophyRendererProps) {
  const requested = variant ?? fallbackVariant;
  const resolved = getCuisinePhilosophyVariant(requested);
  const Component = getCuisinePhilosophyComponent(resolved);
  return <Component {...content} />;
}

export function getCuisinePhilosophyVariants(): Array<{ key: CuisinePhilosophyVariant; label: string; description: string }> {
  return listCuisinePhilosophyVariants().map(({ key, label, description }) => ({ key, label, description }));
}

export type { CuisinePhilosophyContent };
