"use client";

import { SectionHeading } from '@/domains/shared/components';
import { Carousel } from '@/components/ui/retro-testimonial';
import TeamGlassCard from './components/TeamGlassCard';
import type { TeamContent, TeamMember } from '../../types';

function toCarouselItems(members: TeamMember[]) {
  return members.map((member, index) => (
    <TeamGlassCard
      key={member.id}
      testimonial={{
        name: member.name,
        designation: member.role,
        description: member.bio,
        imageUrl: member.imageUrl,
      }}
      index={index}
    />
  ));
}

export default function TeamPrimary({
  title = 'Meet Our Team',
  subtitle = 'The People Behind Your Experience',
  members,
}: TeamContent) {
  const items = toCarouselItems(members ?? []);

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <SectionHeading
          pillText="Our Team"
          title={title}
          subtitle={subtitle}
          titleClassName="text-3xl md:text-4xl font-bold"
          as="h2"
          centered
          className="mb-4"
        />

        <Carousel items={items} />
      </div>
    </section>
  );
}
