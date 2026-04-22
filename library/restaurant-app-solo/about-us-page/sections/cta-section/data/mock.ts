import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { CtaVariant } from '../types';
import type { CtaContent } from '../types/schema';

export const ctaMocks = defineSectionMocks<CtaVariant, CtaContent>('CTA Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      title: 'Reserve Your Table',
      subtitle: 'From brunch to late-night—book your moment at Draco today.',
      backgroundImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&auto=format&fit=crop',
      showDeliveryPartners: true,
      menuHref: '/menu',
      whatsappNumber: '+6281999777138',
    },
    'template-2': {
      title: 'Plan Your Visit',
      subtitle: 'Chef’s counter or garden patio? Let us know.',
      menuHref: '/reservations',
      whatsappNumber: '+6281999777138',
      showDeliveryPartners: false,
    },
    'template-3': {
      title: 'Stay in the Loop',
      subtitle: 'Seasonal menus, chef pop-ups, and exclusive tastings.',
      showDeliveryPartners: false,
    },
  },
});

export type CtaMockKey = keyof typeof ctaMocks;
