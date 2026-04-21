import { describe, expect, it } from 'vitest';
import { valuesRegistry, listValuesVariants, getValuesVariant } from '../registry';

describe('Values Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(valuesRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listValuesVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getValuesVariant('unknown')).toBe('primary');
  });
});
