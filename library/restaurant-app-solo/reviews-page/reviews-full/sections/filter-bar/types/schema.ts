import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const filterBarContentZodSchema = z.object({
  totalReviews: z.number().min(0),
  ratingBreakdown: z
    .record(z.number().min(0))
    .optional()
    .transform((value) => value ?? {}),
});

export const filterBarContentSchema = createSectionSchema(filterBarContentZodSchema);

export type FilterBarContentInput = z.input<typeof filterBarContentZodSchema>;
export type FilterBarContent = z.output<typeof filterBarContentZodSchema>;
