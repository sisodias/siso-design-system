import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const valuesIconSchema = z.enum(['sprout', 'users', 'award', 'globe', 'heart', 'star', 'coffee'], {
  required_error: 'Each value must specify an icon.',
});

export const valuesItemSchema = z.object({
  id: z.string().min(1, 'Each value requires a stable id.'),
  title: z.string().min(1, 'Each value requires a title.'),
  description: z.string().min(1, 'Each value requires a description.'),
  icon: valuesIconSchema,
});

export const valuesContentZodSchema = z.object({
  pillText: z.string().optional(),
  title: z.string().min(1, 'The section requires a headline.'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  values: z.array(valuesItemSchema).min(1, 'Provide at least one value to highlight.'),
});

export const valuesContentSchema = createSectionSchema(valuesContentZodSchema);

export type ValuesIcon = z.infer<typeof valuesIconSchema>;
export type ValuesItem = z.infer<typeof valuesItemSchema>;
export type ValuesContentInput = z.input<typeof valuesContentZodSchema>;
export type ValuesContent = z.output<typeof valuesContentZodSchema>;
