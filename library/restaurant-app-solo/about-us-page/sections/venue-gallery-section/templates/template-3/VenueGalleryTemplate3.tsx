"use client";

import type { VenueGalleryContent } from '../../types/schema';

export default function VenueGalleryTemplate3(props: VenueGalleryContent) {
  const { title, subtitle, description } = props;
  return (
    <section className="flex min-h-[30vh] flex-col items-center justify-center bg-muted/25 px-6 text-center">
      <div className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
          {subtitle ?? 'Venue Gallery Template 3'}
        </p>
        <h2 className="text-xl font-semibold text-muted-foreground">
          {title ?? 'Placeholder variant awaiting 21st.dev integration'}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground/80">
          {description ??
            'No gallery UI ships with this variant yet. Swap in the production component when design assets land.'}
        </p>
      </div>
    </section>
  );
}
