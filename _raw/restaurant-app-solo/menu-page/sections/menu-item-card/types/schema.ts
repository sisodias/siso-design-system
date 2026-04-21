import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const menuItemCardContentZodSchema = z.object({
  id: z.string().min(1, 'Menu item id is required'),
  name: z.string().min(1, 'Menu item name is required'),
  description: z.string().nullable().optional(),
  price: z.number().nonnegative(),
  currency: z.string().default('IDR').optional(),
  category: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  calories: z.number().nullable().optional(),
  protein: z.number().nullable().optional(),
  carbs: z.number().nullable().optional(),
  sugar: z.number().nullable().optional(),
  fat: z.number().nullable().optional(),
  prepTimeMin: z.number().nullable().optional(),
  spiceLevel: z.number().int().min(0).max(3).nullable().optional(),
  servingSizeGrams: z.number().nullable().optional(),
  isHalal: z.boolean().nullable().optional(),
  isKosher: z.boolean().nullable().optional(),
  allergens: z.array(z.string()).nullable().optional(),
  pairings: z.array(z.string()).nullable().optional(),
  chefTip: z.string().nullable().optional(),
  popularScore: z.number().nullable().optional(),
  badges: z.array(z.string()).optional(),
});

export const menuItemCardContentSchema = createSectionSchema(menuItemCardContentZodSchema);

export type MenuItemCardContentInput = z.input<typeof menuItemCardContentZodSchema>;
export type MenuItemCardContent = z.output<typeof menuItemCardContentZodSchema>;
