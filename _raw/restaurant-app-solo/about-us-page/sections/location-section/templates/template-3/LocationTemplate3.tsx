"use client";

import type { LocationContent } from '../../types/schema';

export default function LocationTemplate3(props: LocationContent) {
  const { title, subtitle, description } = props;
  return (
    <section className="flex min-h-[30vh] flex-col items-center justify-center bg-muted/30 px-6 text-center">
      <div className="max-w-xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          {subtitle ?? 'Location Template 3'}
        </p>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {title ?? 'Placeholder variant awaiting production design'}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground/80">
          {description ??
            'This variant does not render a live layout yet. Replace it with a 21st.dev component once designs land.'}
        </p>
      </div>
    </section>
  );
}
