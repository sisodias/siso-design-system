"use client";

import type { ReactNode } from 'react';
import { RatingBadge } from '@/domains/shared/components';
import type { RatingsSummaryComponentProps } from '../../types';

export default function RatingsSummaryPrimary({ content, actionSlot }: RatingsSummaryComponentProps) {
  const { stats, featuredTags } = content;
  const { average, total, breakdown } = stats;

  const ratings = [
    { stars: 5, count: breakdown['5_stars'] },
    { stars: 4, count: breakdown['4_stars'] },
    { stars: 3, count: breakdown['3_stars'] },
    { stars: 2, count: breakdown['2_stars'] },
    { stars: 1, count: breakdown['1_star'] },
  ];

  const getBarWidth = (count: number) => {
    if (total === 0) return '0%';
    return `${(count / total) * 100}%`;
  };

  return (
    <div className="w-full rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Guest Reviews</h2>
          <p className="mt-1 text-sm text-muted-foreground">Real experiences from our community</p>
        </div>
        <div className="flex items-center gap-4">
          <RatingBadge rating={average} count={total} />
          {actionSlot && <div className="hidden sm:block">{actionSlot}</div>}
        </div>
      </div>

      {actionSlot && <div className="mb-6 sm:hidden">{actionSlot}</div>}

      <div className="mb-6 space-y-3">
        {ratings.map(({ stars, count }) => (
          <div key={stars} className="flex items-center gap-3">
            <span className="w-12 text-sm font-medium text-foreground">{stars} ★</span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: getBarWidth(count) }} />
            </div>
            <span className="w-12 text-right text-sm text-muted-foreground">{count}</span>
          </div>
        ))}
      </div>

      {featuredTags && featuredTags.length > 0 && (
        <div className="border-t border-border pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What guests love
          </p>
          <div className="flex flex-wrap gap-2">
            {featuredTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
