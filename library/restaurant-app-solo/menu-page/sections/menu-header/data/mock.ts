import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { MenuHeaderVariant } from '../types';
import type { MenuHeaderContent } from '../types/schema';

export const menuHeaderMocks = defineSectionMocks<MenuHeaderVariant, MenuHeaderContent>('Menu Header', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      title: 'Our Menu',
      subtitle: 'Discover our handcrafted dishes from Draco Coffee & Eatery',
      tagline: 'From espresso to nasi bakar, every plate is made to delight.',
      showSeedButton: false,
      cta: {
        label: 'Order Online',
        href: '/order',
        icon: 'shopping-bag',
      },
    },
  },
});

export type MenuHeaderMockKey = keyof typeof menuHeaderMocks;
