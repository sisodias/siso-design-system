"use client";

import { SectionHeading } from '@/domains/shared/components';
import type { TeamContent } from '../../types';

export default function TeamTemplate2({
  title = 'Leadership Team',
  subtitle = 'Faces behind the kitchen',
  members,
}: TeamContent) {
  const people = members ?? [];

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          pillText="Leadership"
          title={title}
          subtitle={subtitle}
          titleClassName="text-3xl md:text-4xl font-bold"
          as="h2"
          centered
          className="mb-10"
        />

        <div className="grid gap-8 md:grid-cols-3">
          {people.map((person) => (
            <div key={person.id} className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
              {person.imageUrl && (
                <img
                  src={person.imageUrl}
                  alt={person.name}
                  className="mb-4 h-20 w-20 rounded-full object-cover"
                />
              )}
              <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
              <p className="text-sm text-muted-foreground">{person.role}</p>
              <p className="mt-4 text-sm text-muted-foreground line-clamp-4">{person.bio}</p>
            </div>
          ))}
        </div>

        {people.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">Add team members to populate this layout.</p>
        )}
      </div>
    </section>
  );
}
