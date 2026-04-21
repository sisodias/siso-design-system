import { describe, expect, it } from 'vitest';
import { menuCategoriesRegistry, listMenuCategoriesVariants, getMenuCategoriesVariant } from '../registry';

describe('MenuCategories Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(menuCategoriesRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listMenuCategoriesVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getMenuCategoriesVariant('unknown')).toBe('primary');
  });
});
