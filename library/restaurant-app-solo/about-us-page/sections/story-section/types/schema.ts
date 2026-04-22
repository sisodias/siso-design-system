import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const milestoneSchema = z.object({
  id: z.string().min(1),
  year: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const storyContentZodSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  milestones: z.array(milestoneSchema).min(1),
});

export const storyContentSchema = createSectionSchema(storyContentZodSchema);

export type StoryContentInput = z.input<typeof storyContentZodSchema>;
export type StoryContent = z.output<typeof storyContentZodSchema>;
export type StoryMilestone = z.output<typeof milestoneSchema>;
