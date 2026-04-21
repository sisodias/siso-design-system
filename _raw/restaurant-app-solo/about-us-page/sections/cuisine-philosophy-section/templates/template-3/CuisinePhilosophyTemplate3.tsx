"use client";

import type { CuisinePhilosophyContent } from '../../types/schema';

export default function CuisinePhilosophyTemplate3(props: CuisinePhilosophyContent) {
  const { title, subtitle, description } = props;
  return (
    <section className="flex min-h-[40vh] flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {subtitle ?? 'CuisinePhilosophy Template3'}
        </p>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          {title ?? 'CuisinePhilosophy Template Placeholder'}
        </h1>
        {description ? (
          <p className="text-base text-muted-foreground">{description}</p>
        ) : (
          <p className="text-base text-muted-foreground">
            Replace this placeholder with the final design for the template-3 variant.
          </p>
        )}
      </div>
    </section>
  );
}
