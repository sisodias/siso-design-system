import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { GuestFeedbackContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Guest Feedback · Primary',
  description: 'Full guest feedback layout with rating stats, filter controls, and photo-rich review cards.',
  recommendedUse: ['Standalone reviews page', 'High-signal social proof landing pages'],
  tags: ['reviews', 'social-proof', 'filters'],
});

export const load: SectionVariantLoader<GuestFeedbackContent> = async () => ({
  default: (await import('./GuestFeedbackPrimary')).default,
});

export { default as GuestFeedbackPrimary } from './GuestFeedbackPrimary';
