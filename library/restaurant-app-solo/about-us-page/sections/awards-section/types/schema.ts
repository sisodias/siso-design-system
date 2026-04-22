import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const googleRatingSchema = z.object({
  score: z.number().min(0).max(5),
  totalReviews: z.number().int().nonnegative(),
  source: z.string().min(1),
});

const testimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  rating: z.number().min(1).max(5),
  text: z.string().min(1),
  date: z.string().optional(),
  platform: z.enum(['Google', 'TripAdvisor', 'Facebook']).optional(),
});

const achievementSchema = z.object({
  id: z.string().min(1),
  icon: z.enum(['award', 'trending', 'users', 'star']),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const awardsContentZodSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  googleRating: googleRatingSchema.optional(),
  testimonials: z.array(testimonialSchema).optional(),
  achievements: z.array(achievementSchema).optional(),
  compact: z.boolean().optional(),
});

export const awardsContentSchema = createSectionSchema(awardsContentZodSchema);

export type AwardsContentInput = z.input<typeof awardsContentZodSchema>;
export type AwardsContent = z.output<typeof awardsContentZodSchema>;
export type AwardsGoogleRating = z.output<typeof googleRatingSchema>;
export type CustomerTestimonial = z.output<typeof testimonialSchema>;
export type AchievementBadge = z.output<typeof achievementSchema>;
