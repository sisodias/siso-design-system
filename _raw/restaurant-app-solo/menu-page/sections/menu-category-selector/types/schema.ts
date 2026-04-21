import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const categorySchema = z.object({
  id: z.string().min(1, 'Category id is required'),
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  count: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  pillText: z.string().optional(),
});

export const menuCategorySelectorContentZodSchema = z.object({
  heading: z.string().optional(),
  summary: z.string().optional(),
  filterLabel: z.string().optional(),
  allLabel: z.string().optional(),
  activeCategoryId: z.string().optional(),
  showFilterToggle: z.boolean().optional(),
  categories: z.array(categorySchema),
});

export const menuCategorySelectorContentSchema = createSectionSchema(menuCategorySelectorContentZodSchema);

export type MenuCategorySelectorContentInput = z.input<typeof menuCategorySelectorContentZodSchema>;
export type MenuCategorySelectorContent = z.output<typeof menuCategorySelectorContentZodSchema>;
export type MenuCategorySelectorCategory = z.output<typeof categorySchema>;
