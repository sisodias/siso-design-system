"use client";

import type { ValuesContent } from '../../types/schema';

export default function ValuesTemplate3(props: ValuesContent) {
  const { title, subtitle, description } = props;
  return (
    <section className="flex min-h-[30vh] flex-col items-center justify-center bg-muted/20 px-6 text-center">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          {subtitle ?? 'Values Template 3'}
        </p>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {title ?? 'Placeholder variant awaiting 21st.dev component'}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground/80">
          {description ??
            'This template intentionally renders an empty placeholder. Swap it with a production-ready 21st.dev component when designs are ready.'}
        </p>
      </div>
    </section>
  );
}
