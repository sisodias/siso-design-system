import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { FaqContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'FAQ Placeholder',
  description: 'Intentionally empty variant reserved for a future 21st.dev component.',
  recommendedUse: ['Use in mocks only until design delivers final artwork'],
  tags: ['placeholder', 'todo'],
});

export const load: SectionVariantLoader<FaqContent> = async () => ({
  default: (await import('./FaqTemplate3')).default,
});

export { default as FaqTemplate3 } from './FaqTemplate3';
