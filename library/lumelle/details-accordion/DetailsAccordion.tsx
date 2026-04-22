import { SectionHeading } from '@ui/components/SectionHeading'

type DetailItem = { title: string; body: string; thumbSrc?: string; thumbAlt?: string }

type Heading = {
  eyebrow?: string
  title?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
}

type DetailsAccordionProps = {
  items: DetailItem[]
  heading?: Heading
  sectionId?: string
}

export const DetailsAccordion = ({ items, heading, sectionId }: DetailsAccordionProps) => (
  <section id={sectionId} className="bg-white">
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      {sectionId ? <div id={`${sectionId}-heading`} className="h-0 scroll-mt-24" /> : null}
      {heading?.title ? (
        <SectionHeading
          eyebrow={heading.eyebrow}
          title={heading.title}
          description={heading.description}
          alignment={heading.alignment === 'right' ? 'center' : heading.alignment}
        />
      ) : null}
      <div className={`divide-y divide-semantic-legacy-brand-blush/60 rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white ${heading ? 'mt-8' : 'mt-0'}`}>
        {items.map((d, i) => (
          <details
            key={i}
            id={sectionId ? `${sectionId}-item-${i + 1}` : undefined}
            className="group scroll-mt-24"
            // On mobile, only expand first 2 items by default. On desktop (md+), expand all.
            open={i < 2}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-semantic-text-primary">
              <div className="flex items-center gap-3">
                {d.thumbSrc ? (
                  <img src={d.thumbSrc} alt={d.thumbAlt || ''} loading="lazy" className="h-10 w-10 rounded-lg border border-semantic-legacy-brand-blush/60 object-cover" />
                ) : null}
                <span className="font-semibold">{d.title}</span>
              </div>
              <span className="text-semantic-text-primary/60 group-open:rotate-90">▸</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-semantic-text-primary/80 whitespace-pre-line">{d.body}</div>
          </details>
        ))}
      </div>
    </div>
  </section>
)

export default DetailsAccordion
