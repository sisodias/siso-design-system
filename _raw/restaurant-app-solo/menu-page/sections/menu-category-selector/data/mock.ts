import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { MenuCategorySelectorVariant } from '../types';
import type { MenuCategorySelectorContent } from '../types/schema';

export const menuCategorySelectorMocks = defineSectionMocks<MenuCategorySelectorVariant, MenuCategorySelectorContent>('Menu Category Selector', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      heading: 'Browse Our Menu',
      summary: '12 items · 3 categories',
      filterLabel: 'Filter categories',
      allLabel: 'All categories',
      activeCategoryId: 'all',
      showFilterToggle: true,
      categories: [
        {
          id: 'all',
          name: 'All',
          description: 'See everything at once',
          count: 12,
          isActive: true,
          pillText: 'FEATURED',
        },
        {
          id: 'coffee',
          name: 'Coffee',
          description: 'Brews & espresso classics',
          count: 4,
        },
        {
          id: 'brunch',
          name: 'Brunch',
          description: 'Morning favourites',
          count: 5,
        },
        {
          id: 'desserts',
          name: 'Desserts',
          description: 'Sweet finishes',
          count: 3,
        },
      ],
    },
  },
});

export type MenuCategorySelectorMockKey = keyof typeof menuCategorySelectorMocks;
