import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  alignment?: 'left' | 'center'
  actions?: ReactNode
  className?: string
}

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  alignment = 'left',
  actions,
  className,
}: SectionHeadingProps) => {
  const alignmentClass =
    alignment === 'center' ? 'items-center text-center' : 'items-start'

  return (
    <div
      className={`flex flex-col gap-4 ${alignmentClass} text-semantic-text-primary ${className ?? ''}`}
    >
      {eyebrow ? (
        <span className="inline-flex rounded-full bg-semantic-legacy-brand-blush/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-semantic-text-primary/70">
          {eyebrow}
        </span>
      ) : null}
      <div
        className={`flex w-full flex-col gap-3 ${
          alignment === 'center' ? 'items-center' : ''
        }`}
      >
        <h2 className="font-heading text-3xl font-bold md:text-4xl whitespace-pre-line">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-base leading-relaxed text-semantic-text-primary/80 font-serif">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  )
}
