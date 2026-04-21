import { describe, expect, it } from 'vitest';
import { reviewRegistry, listReviewVariants, getReviewVariant } from '../registry';

describe('Review Section Registry', () => {
  it('returns the default variant when none is provided', () => {
    expect(reviewRegistry.defaultVariant).toBe('primary');
  });

  it('lists all registered variants', () => {
    const keys = listReviewVariants().map(({ key }) => key);
    expect(keys).toEqual(['primary', 'classic', 'modern', 'minimal', 'featured', 'testimonial', 'grid', 'glass-swiper', 'image-masonry', 'stagger-cards', 'animated-stack', 'scrolling-columns']);
  });

  it('falls back to the default when an unknown variant is requested', () => {
    expect(getReviewVariant('unknown')).toBe('primary');
  });
});
