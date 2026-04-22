import { describe, expect, it } from 'vitest';
import { awardsRegistry, listAwardsVariants, getAwardsVariant } from '../registry';

describe('Awards Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(awardsRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listAwardsVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getAwardsVariant('unknown')).toBe('primary');
  });
});
