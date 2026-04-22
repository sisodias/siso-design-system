import type { ReviewVariant } from './types';
import type { ReviewContent } from './types/schema';
import { createSectionRegistry, listVariants, resolveVariant } from '@/domains/shared/section-tools';
import { metadata as ReviewPrimaryMetadata, ReviewPrimary } from './templates/primary';
import { metadata as ReviewClassicMetadata, ReviewClassic } from './templates/classic';
import { metadata as ReviewModernMetadata, ReviewModern } from './templates/modern';
import { metadata as ReviewMinimalMetadata, ReviewMinimal } from './templates/minimal';
import { metadata as ReviewFeaturedMetadata, ReviewFeatured } from './templates/featured';
import { metadata as ReviewTestimonialMetadata, ReviewTestimonial } from './templates/testimonial';
import { metadata as ReviewGridMetadata, ReviewGrid } from './templates/grid';
import { metadata as ReviewGlassSwiperMetadata, ReviewGlassSwiper } from './templates/glass-swiper';
import { metadata as ReviewImageMasonryMetadata, ReviewImageMasonry } from './templates/image-masonry';
import { metadata as ReviewStaggerCardsMetadata, ReviewStaggerCards } from './templates/stagger-cards';
import { metadata as ReviewAnimatedStackMetadata, ReviewAnimatedStack } from './templates/animated-stack';
import { metadata as ReviewScrollingColumnsMetadata, ReviewScrollingColumns } from './templates/scrolling-columns';

export const reviewRegistry = createSectionRegistry<ReviewVariant, ReviewContent>({
  defaultVariant: 'primary',
  variants: {
    'primary': {
      label: ReviewPrimaryMetadata.name,
      description: ReviewPrimaryMetadata.description,
      screenshot: ReviewPrimaryMetadata.screenshot,
      tags: ReviewPrimaryMetadata.tags,
      load: async () => ({ default: ReviewPrimary }),
    },
    'classic': {
      label: ReviewClassicMetadata.name,
      description: ReviewClassicMetadata.description,
      screenshot: ReviewClassicMetadata.screenshot,
      tags: ReviewClassicMetadata.tags,
      load: async () => ({ default: ReviewClassic }),
    },
    'modern': {
      label: ReviewModernMetadata.name,
      description: ReviewModernMetadata.description,
      screenshot: ReviewModernMetadata.screenshot,
      tags: ReviewModernMetadata.tags,
      load: async () => ({ default: ReviewModern }),
    },
    'minimal': {
      label: ReviewMinimalMetadata.name,
      description: ReviewMinimalMetadata.description,
      screenshot: ReviewMinimalMetadata.screenshot,
      tags: ReviewMinimalMetadata.tags,
      load: async () => ({ default: ReviewMinimal }),
    },
    'featured': {
      label: ReviewFeaturedMetadata.name,
      description: ReviewFeaturedMetadata.description,
      screenshot: ReviewFeaturedMetadata.screenshot,
      tags: ReviewFeaturedMetadata.tags,
      load: async () => ({ default: ReviewFeatured }),
    },
    'testimonial': {
      label: ReviewTestimonialMetadata.name,
      description: ReviewTestimonialMetadata.description,
      screenshot: ReviewTestimonialMetadata.screenshot,
      tags: ReviewTestimonialMetadata.tags,
      load: async () => ({ default: ReviewTestimonial }),
    },
    'grid': {
      label: ReviewGridMetadata.name,
      description: ReviewGridMetadata.description,
      screenshot: ReviewGridMetadata.screenshot,
      tags: ReviewGridMetadata.tags,
      load: async () => ({ default: ReviewGrid }),
    },
    'glass-swiper': {
      label: ReviewGlassSwiperMetadata.name,
      description: ReviewGlassSwiperMetadata.description,
      screenshot: ReviewGlassSwiperMetadata.screenshot,
      tags: ReviewGlassSwiperMetadata.tags,
      load: async () => ({ default: ReviewGlassSwiper }),
    },
    'image-masonry': {
      label: ReviewImageMasonryMetadata.name,
      description: ReviewImageMasonryMetadata.description,
      screenshot: ReviewImageMasonryMetadata.screenshot,
      tags: ReviewImageMasonryMetadata.tags,
      load: async () => ({ default: ReviewImageMasonry }),
    },
    'stagger-cards': {
      label: ReviewStaggerCardsMetadata.name,
      description: ReviewStaggerCardsMetadata.description,
      screenshot: ReviewStaggerCardsMetadata.screenshot,
      tags: ReviewStaggerCardsMetadata.tags,
      load: async () => ({ default: ReviewStaggerCards }),
    },
    'animated-stack': {
      label: ReviewAnimatedStackMetadata.name,
      description: ReviewAnimatedStackMetadata.description,
      screenshot: ReviewAnimatedStackMetadata.screenshot,
      tags: ReviewAnimatedStackMetadata.tags,
      load: async () => ({ default: ReviewAnimatedStack }),
    },
    'scrolling-columns': {
      label: ReviewScrollingColumnsMetadata.name,
      description: ReviewScrollingColumnsMetadata.description,
      screenshot: ReviewScrollingColumnsMetadata.screenshot,
      tags: ReviewScrollingColumnsMetadata.tags,
      load: async () => ({ default: ReviewScrollingColumns }),
    },
  },
});

const components: Record<ReviewVariant, (props: ReviewContent) => JSX.Element> = {
  'primary': ReviewPrimary,
  'classic': ReviewClassic,
  'modern': ReviewModern,
  'minimal': ReviewMinimal,
  'featured': ReviewFeatured,
  'testimonial': ReviewTestimonial,
  'grid': ReviewGrid,
  'glass-swiper': ReviewGlassSwiper,
  'image-masonry': ReviewImageMasonry,
  'stagger-cards': ReviewStaggerCards,
  'animated-stack': ReviewAnimatedStack,
  'scrolling-columns': ReviewScrollingColumns,
};

export function getReviewVariant(variant: string | undefined): ReviewVariant {
  return resolveVariant(variant, reviewRegistry);
}

export function getReviewComponent(variant: ReviewVariant) {
  return components[variant];
}

export function listReviewVariants() {
  return listVariants(reviewRegistry);
}
