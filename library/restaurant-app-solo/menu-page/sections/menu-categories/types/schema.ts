import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  display_order: z.number().nullable().optional(),
});

const menuItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  price: z.number().nonnegative(),
  category: z.string().min(1),
  image_url: z.string().nullable().optional(),
  is_vegetarian: z.boolean().optional(),
  is_vegan: z.boolean().optional(),
  is_gluten_free: z.boolean().optional(),
  is_spicy: z.boolean().optional(),
  ingredients: z.string().nullable().optional(),
  calories: z.number().nullable().optional(),
  protein_g: z.number().nullable().optional(),
  carbs_g: z.number().nullable().optional(),
  sugar_g: z.number().nullable().optional(),
  fat_g: z.number().nullable().optional(),
  prep_time_min: z.number().nullable().optional(),
  allergens: z.array(z.string()).nullable().optional(),
  is_halal: z.boolean().nullable().optional(),
  is_kosher: z.boolean().nullable().optional(),
  spice_level: z.number().min(0).max(3).nullable().optional(),
  serving_size_g: z.number().nullable().optional(),
  is_seasonal: z.boolean().nullable().optional(),
  is_new: z.boolean().nullable().optional(),
  created_at: z.string().nullable().optional(),
  pairings: z.array(z.string()).nullable().optional(),
  chef_tip: z.string().nullable().optional(),
  popular_score: z.number().optional(),
});

const aboutSchema = z.object({
  heading: z.string().optional(),
  paragraphs: z.array(z.string()).optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export const menuCategoriesContentZodSchema = z.object({
  categories: z.array(categorySchema),
  items: z.array(menuItemSchema),
  isLoading: z.boolean().optional(),
  hasError: z.boolean().optional(),
  errorMessage: z.string().optional(),
  isEmpty: z.boolean().optional(),
  isSignedIn: z.boolean().optional(),
  about: aboutSchema.optional(),
});

export const menuCategoriesContentSchema = createSectionSchema(menuCategoriesContentZodSchema);

export type MenuCategoriesContentInput = z.input<typeof menuCategoriesContentZodSchema>;
export type MenuCategoriesContent = z.output<typeof menuCategoriesContentZodSchema>;
export type MenuCategorySummary = z.output<typeof categorySchema>;
export type MenuCategoryItem = z.output<typeof menuItemSchema>;
export type MenuCategoriesAbout = z.output<typeof aboutSchema>;
