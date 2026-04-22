import { describe, expect, it } from 'vitest';
import { cuisinePhilosophyRegistry, listCuisinePhilosophyVariants, getCuisinePhilosophyVariant } from '../registry';

describe('CuisinePhilosophy Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(cuisinePhilosophyRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listCuisinePhilosophyVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getCuisinePhilosophyVariant('unknown')).toBe('primary');
  });
});
