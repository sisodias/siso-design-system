import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const ratingBreakdownSchema = z.object({
  '5_stars': z.number().min(0),
  '4_stars': z.number().min(0),
  '3_stars': z.number().min(0),
  '2_stars': z.number().min(0),
  '1_star': z.number().min(0),
});

const condensedBreakdownSchema = z.object({
  1: z.number().min(0),
  2: z.number().min(0),
  3: z.number().min(0),
  4: z.number().min(0),
  5: z.number().min(0),
});

const reviewMetadataSchema = z
  .object({
    highlights: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  })
  .optional();

const reviewSchema = z.object({
  id: z.string(),
  authorName: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  publishedAt: z.string(),
  source: z.string(),
  verified: z.boolean(),
  featured: z.boolean(),
  images: z.array(z.string()),
  ownerResponse: z.string().nullable().optional(),
  ownerRespondedAt: z.string().nullable().optional(),
  helpfulCount: z.number().min(0),
  metadata: reviewMetadataSchema,
});

const headingSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  pillText: z.string().optional(),
});

const statsSchema = z.object({
  average: z.number().min(0).max(5),
  total: z.number().min(0),
  breakdown: ratingBreakdownSchema,
});

const viewerSchema = z.object({
  isAuthenticated: z.boolean(),
  userName: z.string().nullable().optional(),
});

export const guestFeedbackContentZodSchema = z.object({
  heading: headingSchema,
  stats: statsSchema,
  featuredTags: z.array(z.string()).optional(),
  filters: z.object({
    totalReviews: z.number().min(0),
    ratingBreakdown: condensedBreakdownSchema.optional(),
  }),
  reviews: z.array(reviewSchema),
  viewer: viewerSchema,
});

export const guestFeedbackContentSchema = createSectionSchema(guestFeedbackContentZodSchema);

export type GuestFeedbackContentInput = z.input<typeof guestFeedbackContentZodSchema>;
export type GuestFeedbackContent = z.output<typeof guestFeedbackContentZodSchema>;
export type GuestFeedbackReview = z.output<typeof reviewSchema>;
export type GuestFeedbackRatingBreakdown = z.output<typeof ratingBreakdownSchema>;
