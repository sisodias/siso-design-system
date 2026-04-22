import { describe, expect, it } from 'vitest';
import { locationRegistry, listLocationVariants, getLocationVariant } from '../registry';

describe('Location Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(locationRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listLocationVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getLocationVariant('unknown')).toBe('primary');
  });
});
