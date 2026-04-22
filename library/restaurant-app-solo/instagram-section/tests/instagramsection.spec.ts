import { describe, expect, it } from 'vitest';
import { instagramRegistry, listInstagramVariants, getInstagramVariant } from '../registry';

describe('Instagram Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(instagramRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listInstagramVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getInstagramVariant('unknown')).toBe('primary');
  });
});
