"use client";

import type { HeroContent } from '../../types/schema';

export default function HeroTemplateTwo({ title, subtitle }: HeroContent) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {subtitle ?? 'Minimal Spotlight'}
        </p>
        <h1 className="mt-4 text-4xl font-bold text-foreground md:text-5xl">
          {title ?? 'Hero Template 2 Placeholder'}
        </h1>
        <p className="mt-6 text-base text-muted-foreground">
          Swap in a final design for Template 2 while preserving the data contract shared across variants.
        </p>
      </div>
    </section>
  );
}
