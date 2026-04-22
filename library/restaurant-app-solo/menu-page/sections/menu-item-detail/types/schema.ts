import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';
import { menuItemCardContentZodSchema } from '@/domains/customer-facing/menu/sections/menu-item-card/types/schema';

export const menuItemDetailContentZodSchema = menuItemCardContentZodSchema.extend({
  heroImageUrl: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  origin: z.string().optional(),
  availability: z.string().optional(),
  winePairing: z.string().optional(),
  preparationNotes: z.string().optional(),
  ingredients: z.array(z.string()).optional(),
  recommendedItems: z.array(menuItemCardContentZodSchema).optional(),
});

export const menuItemDetailContentSchema = createSectionSchema(menuItemDetailContentZodSchema);

export type MenuItemDetailContentInput = z.input<typeof menuItemDetailContentZodSchema>;
export type MenuItemDetailContent = z.output<typeof menuItemDetailContentZodSchema>;
