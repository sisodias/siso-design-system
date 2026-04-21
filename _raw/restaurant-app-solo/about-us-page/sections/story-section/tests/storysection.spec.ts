import { describe, expect, it } from 'vitest';
import { storyRegistry, listStoryVariants, getStoryVariant } from '../registry';

describe('Story Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(storyRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listStoryVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'template-2', 'template-3']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getStoryVariant('unknown')).toBe('primary');
  });
});
