# FAQ Section

Shared schema (`types/schema.ts`) exposes:

- `pillText?: string`
- `title: string`
- `subtitle?: string`
- `timestamp?: string`
- `showCategories?: boolean`
- `items: FaqItem[]` (id, question, answer, optional category/icon/iconPosition)
- `emptyState?: string`
- `cta?: { label: string; href: string }`

### Variants
- **primary — Chat Accordion**
  Chat-bubble accordion with optional category filters and CTA.
- **template-2 — Editorial FAQ Breakdown**
  Two-column layout highlighting a hero question with supporting accordion and category chips.
- **template-3 — FAQ Placeholder**
  Intentional placeholder awaiting the final 21st.dev component.

`FaqAccordion` from `@/components/ui/faq-chat-accordion` powers every variant.
