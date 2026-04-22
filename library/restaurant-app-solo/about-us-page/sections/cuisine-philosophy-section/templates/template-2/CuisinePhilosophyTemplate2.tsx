"use client";

import type { CuisinePhilosophyContent } from '../../types';

export default function CuisinePhilosophyTemplate2({
  title = 'Kitchen Pillars',
  subtitle = 'Quick snapshot',
  philosophyPoints = [],
}: CuisinePhilosophyContent) {
  return (
    <section className="bg-muted/10 py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-3 text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {philosophyPoints.map((point) => (
            <article key={point.id} className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {point.icon}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{point.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{point.description}</p>
            </article>
          ))}
        </div>

        {philosophyPoints.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Provide `philosophyPoints` to populate this layout.
          </p>
        )}
      </div>
    </section>
  );
}
