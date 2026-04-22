import { describe, expect, it } from 'vitest';
import { filterBarRegistry, listFilterBarVariants, getFilterBarVariant } from '../registry';

describe('FilterBar Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(filterBarRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listFilterBarVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getFilterBarVariant('unknown')).toBe('primary');
  });
});
