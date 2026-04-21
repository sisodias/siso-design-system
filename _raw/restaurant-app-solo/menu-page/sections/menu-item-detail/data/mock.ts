import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { MenuItemDetailVariant } from '../types';
import type { MenuItemDetailContent } from '../types/schema';

export const menuItemDetailMocks = defineSectionMocks<MenuItemDetailVariant, MenuItemDetailContent>('Menu Item Detail', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      id: 'iced-latte',
      name: 'Iced Vanilla Latte',
      description: 'Double-shot espresso poured over vanilla cream and milk. Served over crystal clear ice.',
      price: 45000,
      currency: 'IDR',
      category: 'Coffee',
      imageUrl: null,
      heroImageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772',
      gallery: [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      ],
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
      pairings: ['almond croissant', 'oat cookie'],
      chefTip: 'Ask for double vanilla if you like it sweeter.',
      popularScore: 95,
      origin: 'Single-estate beans from Kintamani, Bali',
      availability: 'Daily · 7am – 10pm',
      winePairing: 'Sparkling brut for afternoon pairing',
      preparationNotes: 'Shake for five seconds before pouring over the ice sphere.',
    },
  },
});

export type MenuItemDetailMockKey = keyof typeof menuItemDetailMocks;
