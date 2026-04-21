import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { MenuItemCardVariant } from '../types';
import type { MenuItemCardContent } from '../types/schema';

export const menuItemCardMocks = defineSectionMocks<MenuItemCardVariant, MenuItemCardContent>('Menu Item Card', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      id: 'iced-latte',
      name: 'Iced Vanilla Latte',
      description: 'Double-shot espresso poured over vanilla cream and milk.',
      price: 45000,
      currency: 'IDR',
      category: 'Coffee',
      imageUrl: null,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      calories: 210,
      protein: 6,
      carbs: 24,
      sugar: 18,
      fat: 6,
      prepTimeMin: 5,
      spiceLevel: 0,
      servingSizeGrams: null,
      isHalal: true,
      isKosher: false,
      allergens: ['dairy'],
      pairings: ['almond croissant'],
      chefTip: 'Ask for double vanilla if you like it sweeter.',
      popularScore: 95,
      badges: ['Best Seller'],
    },
  },
});

export type MenuItemCardMockKey = keyof typeof menuItemCardMocks;
