import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const philosophyPointSchema = z.object({
  id: z.string().min(1),
  icon: z.enum(['leaf', 'flame', 'heart', 'award']),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const cuisinePhilosophyContentZodSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  introduction: z.string().optional(),
  philosophyPoints: z.array(philosophyPointSchema).min(1),
});

export const cuisinePhilosophyContentSchema = createSectionSchema(cuisinePhilosophyContentZodSchema);

export type CuisinePhilosophyContentInput = z.input<typeof cuisinePhilosophyContentZodSchema>;
export type CuisinePhilosophyContent = z.output<typeof cuisinePhilosophyContentZodSchema>;
export type PhilosophyPoint = z.output<typeof philosophyPointSchema>;
