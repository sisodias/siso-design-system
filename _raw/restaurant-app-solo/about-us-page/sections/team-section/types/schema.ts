import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  imageUrl: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const teamContentZodSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  members: z.array(teamMemberSchema).min(1),
});

export const teamContentSchema = createSectionSchema(teamContentZodSchema);

export type TeamContentInput = z.input<typeof teamContentZodSchema>;
export type TeamContent = z.output<typeof teamContentZodSchema>;
export type TeamMember = z.output<typeof teamMemberSchema>;
