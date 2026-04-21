import { describe, expect, it } from 'vitest';
import { mapRegistry, listMapVariants, getMapVariant } from '../registry';

describe('Map Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(mapRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listMapVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getMapVariant('unknown')).toBe('primary');
  });
});
