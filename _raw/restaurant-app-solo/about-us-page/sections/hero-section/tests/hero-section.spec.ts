import { describe, expect, it } from 'vitest';
import { heroRegistry, listHeroVariants, getHeroVariant } from '../registry';

describe('Hero Section Registry', () => {
  it('exposes primary as the default variant', () => {
    expect(heroRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const variantKeys = listHeroVariants().map(({ key }) => key);
    expect(variantKeys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to default when variant is missing', () => {
    expect(getHeroVariant('does-not-exist')).toBe('primary');
  });
});
