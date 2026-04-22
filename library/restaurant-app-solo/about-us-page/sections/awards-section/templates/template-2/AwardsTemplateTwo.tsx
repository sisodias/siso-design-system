"use client";

import { Star } from 'lucide-react';
import type { AwardsContent } from '../../types/schema';

export default function AwardsTemplateTwo({
  title = 'Guest Spotlight',
  subtitle = 'Latest five-star review',
  testimonials = [],
}: AwardsContent) {
  const spotlight = testimonials[0];

  return (
    <section className="bg-background py-16 px-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card/80 p-8 text-center shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">{subtitle}</p>
        <h2 className="mt-4 text-3xl font-bold text-foreground">{title}</h2>

        {spotlight ? (
          <figure className="mt-8 space-y-4">
            <div className="flex justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className="h-5 w-5"
                  fill={index < spotlight.rating ? 'currentColor' : 'transparent'}
                />
              ))}
            </div>
            <blockquote className="text-lg font-medium text-foreground">
              “{spotlight.text}”
            </blockquote>
            <figcaption className="text-sm text-muted-foreground">
              {spotlight.name}
              {spotlight.date ? ` · ${spotlight.date}` : ''}
            </figcaption>
          </figure>
        ) : (
          <p className="mt-8 text-base text-muted-foreground">
            Add testimonials to power this spotlight layout.
          </p>
        )}
      </div>
    </section>
  );
}
