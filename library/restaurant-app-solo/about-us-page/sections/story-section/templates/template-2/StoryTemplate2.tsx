"use client";

import type { StoryContent } from '../../types/schema';

export default function StoryTemplate2({
  title = 'Highlights at a Glance',
  subtitle = 'Four pivotal chapters',
  milestones = [],
}: StoryContent) {
  return (
    <section className="bg-background py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary/70">{subtitle}</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {milestones.map((milestone) => (
            <article
              key={milestone.id}
              className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {milestone.year}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{milestone.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{milestone.description}</p>
            </article>
          ))}
        </div>

        {milestones.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Provide milestone entries to populate this layout.
          </p>
        )}
      </div>
    </section>
  );
}
