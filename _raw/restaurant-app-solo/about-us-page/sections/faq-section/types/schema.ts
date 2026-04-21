import { z } from 'zod';
import { createSectionSchema } from '@/domains/shared/section-tools';

export const faqCategorySchema = z.enum(['general', 'ordering', 'dining', 'delivery', 'experience', 'custom'], {
  invalid_type_error: 'FAQ category must match a known key or use "custom".',
});

export const faqItemSchema = z.object({
  id: z.string().min(1, 'Each FAQ needs an id.'),
  question: z.string().min(1, 'FAQ items require a question.'),
  answer: z.string().min(1, 'Provide an answer for every FAQ item.'),
  category: faqCategorySchema.optional(),
  icon: z.string().optional(),
  iconPosition: z.enum(['left', 'right']).optional(),
});

export const faqCtaSchema = z
  .object({
    label: z.string().min(1),
    href: z.string().min(1),
  })
  .optional();

export const faqContentZodSchema = z.object({
  pillText: z.string().optional(),
  title: z.string().min(1, 'FAQ sections require a title.'),
  subtitle: z.string().optional(),
  timestamp: z.string().optional(),
  showCategories: z.boolean().default(false),
  items: z.array(faqItemSchema).min(1, 'Provide at least one FAQ entry.'),
  emptyState: z.string().optional(),
  cta: faqCtaSchema,
});

export const faqContentSchema = createSectionSchema(faqContentZodSchema);

export type FaqCategory = z.infer<typeof faqCategorySchema>;
export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqCta = z.infer<typeof faqCtaSchema>;
export type FaqContentInput = z.input<typeof faqContentZodSchema>;
export type FaqContent = z.output<typeof faqContentZodSchema>;
