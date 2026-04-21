import { describe, expect, it } from 'vitest';
import { menuItemCardRegistry, listMenuItemCardVariants, getMenuItemCardVariant } from '../registry';

describe('MenuItemCard Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(menuItemCardRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listMenuItemCardVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getMenuItemCardVariant('unknown')).toBe('primary');
  });
});
