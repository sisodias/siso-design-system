import { describe, expect, it } from 'vitest';
import { menuCategorySelectorRegistry, listMenuCategorySelectorVariants, getMenuCategorySelectorVariant } from '../registry';

describe('MenuCategorySelector Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(menuCategorySelectorRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listMenuCategorySelectorVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getMenuCategorySelectorVariant('unknown')).toBe('primary');
  });
});
