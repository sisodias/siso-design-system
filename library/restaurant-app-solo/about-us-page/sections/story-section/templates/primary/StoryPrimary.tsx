"use client";

import { SectionHeading } from '@/domains/shared/components';
import { Component as GlassTimeline } from '@/components/ui/timeline-component';
import type { TimelineEvent } from '@/components/ui/timeline-component';
import type { StoryContent } from '../../types/schema';

export default function StoryPrimary({
  title = 'Our Journey',
  subtitle = 'Milestones That Shaped Us',
  milestones,
}: StoryContent) {
  const events: TimelineEvent[] = (milestones ?? []).map((milestone) => ({
    year: milestone.year,
    title: milestone.title,
    description: milestone.description,
  }));

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
      <SectionHeading
        pillText="Our History"
        title={title}
        subtitle={subtitle}
        titleClassName="text-3xl md:text-4xl font-bold"
        as="h2"
        centered
        className="mb-8"
      />

      <GlassTimeline events={events} tone="brand" variant="dark" />
    </section>
  );
}
