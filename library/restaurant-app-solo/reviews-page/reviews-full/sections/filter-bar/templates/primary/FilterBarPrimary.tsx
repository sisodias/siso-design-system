"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FilterBarContent } from '../../types';

export default function FilterBarPrimary({ totalReviews, ratingBreakdown }: FilterBarContent) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentRating = searchParams.get('rating') || 'all';
  const currentSource = searchParams.get('source') || 'all';
  const currentFeature = searchParams.get('feature') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const ratingFilters = [
    { label: 'All Ratings', value: 'all' },
    { label: '5 Stars', value: '5' },
    { label: '4 Stars', value: '4' },
    { label: '3 Stars', value: '3' },
    { label: '2 Stars', value: '2' },
    { label: '1 Star', value: '1' },
  ];

  const sourceFilters = [
    { label: 'All Sources', value: 'all' },
    { label: 'Google Maps', value: 'google' },
    { label: 'Website', value: 'website' },
  ];

  const featureFilters = [
    { label: 'All Reviews', value: 'all' },
    { label: 'Featured', value: 'featured' },
    { label: 'With Photos', value: 'photos' },
    { label: 'Owner Response', value: 'response' },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Highest Rated', value: 'highest' },
    { label: 'Most Helpful', value: 'helpful' },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between sm:hidden">
        <p className="text-sm text-muted-foreground">{totalReviews} reviews</p>
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground"
        >
          Filters {showMobileFilters ? '−' : '+'}
        </button>
      </div>

      <div className={`space-y-4 ${showMobileFilters ? 'block' : 'hidden sm:block'}`}>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Rating
          </label>
          <div className="flex flex-wrap gap-2">
            {ratingFilters.map((filter) => {
              const count =
                filter.value === 'all'
                  ? totalReviews
                  : ratingBreakdown?.[parseInt(filter.value, 10)] ?? 0;

              return (
                <button
                  key={filter.value}
                  onClick={() => updateFilter('rating', filter.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    currentRating === filter.value
                      ? 'border-yellow-500 bg-yellow-500/15 text-yellow-700'
                      : 'border-border bg-background text-foreground hover:border-yellow-500/50'
                  }`}
                >
                  {filter.label}
                  <span className="ml-1.5 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Source
          </label>
          <div className="flex flex-wrap gap-2">
            {sourceFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => updateFilter('source', filter.value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  currentSource === filter.value
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Features
          </label>
          <div className="flex flex-wrap gap-2">
            {featureFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => updateFilter('feature', filter.value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  currentFeature === filter.value
                    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border-border bg-background text-foreground hover:border-primary/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sort By
          </label>
          <select
            value={currentSort}
            onChange={(event) => updateFilter('sort', event.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
