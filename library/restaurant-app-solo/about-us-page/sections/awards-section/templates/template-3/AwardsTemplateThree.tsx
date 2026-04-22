"use client";

import type { AwardsContent } from '../../types/schema';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/domains/shared/components';
import { Award, TrendingUp, Users, Star } from 'lucide-react';

const iconMap = {
  award: Award,
  trending: TrendingUp,
  users: Users,
  star: Star,
};

export default function AwardsTemplateThree({
  title = 'Awards & Accolades',
  subtitle = 'Highlights from the past year',
  achievements = [],
}: AwardsContent) {
  return (
    <section className="bg-muted/20 py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          pillText="Awards"
          title={title}
          subtitle={subtitle}
          centered
          className="mb-10"
          titleClassName="text-3xl md:text-4xl font-bold"
        />

        {achievements.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => {
              const Icon = iconMap[achievement.icon];
              return (
                <div
                  key={achievement.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6 shadow-sm"
                >
                  <div className={cn(
                    'w-fit rounded-full p-3',
                    achievement.icon === 'award' && 'bg-primary/10 text-primary',
                    achievement.icon === 'trending' && 'bg-amber-100 text-amber-600',
                    achievement.icon === 'users' && 'bg-emerald-100 text-emerald-600',
                    achievement.icon === 'star' && 'bg-yellow-100 text-yellow-600',
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Add achievement entries to showcase awards timeline.
          </p>
        )}
      </div>
    </section>
  );
}
