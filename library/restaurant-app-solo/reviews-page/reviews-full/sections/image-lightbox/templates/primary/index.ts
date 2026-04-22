import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ImageLightboxComponentProps } from '../../types';

export const metadata = defineTemplateMetadata({
  name: 'Image Lightbox · Primary',
  description: 'Fullscreen media viewer with keyboard and button navigation.',
  recommendedUse: ['Review photo galleries', 'Testimonial carousels'],
  tags: ['gallery', 'lightbox', 'media'],
});

export const load: SectionVariantLoader<ImageLightboxComponentProps> = async () => ({
  default: (await import('./ImageLightboxPrimary')).default,
});

export { default as ImageLightboxPrimary } from './ImageLightboxPrimary';
