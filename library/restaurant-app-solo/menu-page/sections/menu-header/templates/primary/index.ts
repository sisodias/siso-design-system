import type { SectionVariantLoader } from '@/domains/shared/section-tools';
import { defineTemplateMetadata } from '@/domains/shared/section-tools';
import type { MenuHeaderContent } from '../../types/schema';

export const metadata = defineTemplateMetadata({
  name: 'Menu Header · Primary',
  description: 'Gradient glass hero introducing the menu with optional admin controls.',
  recommendedUse: ['Default menu landing header', 'Admin preview header'],
  tags: ['hero', 'cta'],
});

export const load: SectionVariantLoader<MenuHeaderContent> = async () => ({
  default: (await import('./MenuHeaderPrimary')).default,
});

export { default as MenuHeaderPrimary } from './MenuHeaderPrimary';
