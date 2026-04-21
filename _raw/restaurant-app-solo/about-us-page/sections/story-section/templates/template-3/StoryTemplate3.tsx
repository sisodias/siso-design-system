"use client";

import type { StoryContent } from '../../types/schema';

export default function StoryTemplate3({
  title = 'Origins & Evolution',
  subtitle = 'Three-act arc',
  milestones = [],
}: StoryContent) {
  return (
    <section className="bg-muted/10 py-16 px-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
          <p className="mt-3 text-sm uppercase tracking-[0.4em] text-muted-foreground">{subtitle}</p>
        </header>

        <div className="relative">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" aria-hidden />
          <div className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {milestones.map((milestone, index) => (
              <article
                key={milestone.id}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  {milestone.year}
                </p>
                <h3 className="text-lg font-semibold text-foreground">{milestone.title}</h3>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
              </article>
            ))}
          </div>
        </div>

        {milestones.length === 0 && (
          <p className="text-center text-muted-foreground">
            Provide milestone data to render this story arc layout.
          </p>
        )}
      </div>
    </section>
  );
}
