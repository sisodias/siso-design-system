import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const ratingsBreakdownSchema = z.object({
  '5_stars': z.number().min(0),
  '4_stars': z.number().min(0),
  '3_stars': z.number().min(0),
  '2_stars': z.number().min(0),
  '1_star': z.number().min(0),
});

export const ratingsSummaryContentZodSchema = z.object({
  stats: z.object({
    average: z.number().min(0).max(5),
    total: z.number().min(0),
    breakdown: ratingsBreakdownSchema,
  }),
  featuredTags: z.array(z.string()).optional(),
});

export const ratingsSummaryContentSchema = createSectionSchema(ratingsSummaryContentZodSchema);

export type RatingsSummaryContentInput = z.input<typeof ratingsSummaryContentZodSchema>;
export type RatingsSummaryContent = z.output<typeof ratingsSummaryContentZodSchema>;
export type RatingsSummaryBreakdown = z.output<typeof ratingsBreakdownSchema>;
