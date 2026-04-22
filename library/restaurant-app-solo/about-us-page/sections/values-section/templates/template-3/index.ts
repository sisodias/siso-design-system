import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { ValuesContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Values Placeholder',
  description: 'Intentional no-op variant reserved for future 21st.dev drop-ins.',
  recommendedUse: ['Use while design is pending', 'Signals that content is not final'],
  tags: ['placeholder', 'todo'],
});

export const load: SectionVariantLoader<ValuesContent> = async () => ({
  default: (await import('./ValuesTemplate3')).default,
});

export { default as ValuesTemplate3 } from './ValuesTemplate3';
