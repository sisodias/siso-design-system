"use client";

import type { CtaContent } from '../../types';

export default function CtaTemplate3({
  title = 'Stay in the Loop',
  subtitle = 'Minimal banner CTA',
}: CtaContent) {
  return (
    <section className="bg-primary/10 py-10 px-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <p className="text-xs text-muted-foreground">
          Replace this layout with a final component (e.g., newsletter signup) before launch.
        </p>
      </div>
    </section>
  );
}
