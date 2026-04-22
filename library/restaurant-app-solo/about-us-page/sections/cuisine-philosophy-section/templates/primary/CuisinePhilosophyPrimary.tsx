"use client";

import { Leaf, Flame, Heart, Award } from 'lucide-react';
import { SectionHeading } from '@/domains/shared/components';
import type { CuisinePhilosophyContent, PhilosophyPoint } from '../../types';

const iconMap: Record<PhilosophyPoint['icon'], typeof Leaf> = {
  leaf: Leaf,
  flame: Flame,
  heart: Heart,
  award: Award,
};

export default function CuisinePhilosophyPrimary({
  title = 'Our Culinary Philosophy',
  subtitle = 'What Makes Us Different',
  introduction = 'Great food starts with quality, perfected by passion and tradition.',
  philosophyPoints,
}: CuisinePhilosophyContent) {
  const points = philosophyPoints ?? [];

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
      <SectionHeading
        pillText="Our Approach"
        title={title}
        subtitle={subtitle}
        titleClassName="text-3xl md:text-4xl font-bold text-foreground"
        as="h2"
        centered
        className="mb-8"
      />

      {introduction && (
        <p className="mx-auto mb-10 max-w-3xl text-center text-sm text-muted-foreground md:text-base">
          {introduction}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {points.map((point) => {
          const Icon = iconMap[point.icon];
          return (
            <div key={point.id} className="flex items-start gap-4">
              <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-white/10 text-white ring-1 ring-white/20">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{point.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{point.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
