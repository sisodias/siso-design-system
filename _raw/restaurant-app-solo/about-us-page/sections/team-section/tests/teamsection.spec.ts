import { describe, expect, it } from 'vitest';
import { teamRegistry, listTeamVariants, getTeamVariant } from '../registry';

describe('Team Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(teamRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listTeamVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getTeamVariant('unknown')).toBe('primary');
  });
});
