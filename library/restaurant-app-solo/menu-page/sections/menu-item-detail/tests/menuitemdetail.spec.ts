import { describe, expect, it } from 'vitest';
import { menuItemDetailRegistry, listMenuItemDetailVariants, getMenuItemDetailVariant } from '../registry';

describe('MenuItemDetail Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(menuItemDetailRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listMenuItemDetailVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getMenuItemDetailVariant('unknown')).toBe('primary');
  });
});
