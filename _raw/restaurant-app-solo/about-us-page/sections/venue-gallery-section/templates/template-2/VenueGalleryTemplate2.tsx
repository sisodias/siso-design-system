"use client";

import { Component as ImageAutoSlider } from '@/components/ui/image-auto-slider';
import { SectionHeading } from '@/domains/shared/components';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import type { VenueGalleryContent } from '../../types/schema';

export default function VenueGalleryTemplate2(content: VenueGalleryContent) {
  const { pillText, title, subtitle, intro, images, showCategories } = content;

  const sliderImages = images.map((image) => image.url);
  const sectionPillText = pillText ?? "Our Space";
  const categories = useMemo(() => {
    if (!showCategories) {
      return [] as Array<{ category: string; count: number }>;
    }
    const counts = new Map<string, number>();
    images.forEach((image) => {
      if (image.category) {
        counts.set(image.category, (counts.get(image.category) ?? 0) + 1);
      }
    });
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
  }, [images, showCategories]);

  return (
    <section className="relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/80" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pt-16 pb-10 lg:flex-row lg:items-center lg:gap-10">
        <div className="w-full space-y-3 text-white lg:max-w-sm">
          <SectionHeading
            pillText={sectionPillText}
            title={title}
            subtitle={subtitle ?? intro}
            titleClassName="text-3xl md:text-4xl font-semibold"
            as="h2"
            centered={false}
            className="[&>div]:text-white"
          />

          {intro && (
            <p className="text-sm text-white/70">{intro}</p>
          )}

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(({ category, count }) => (
                <span
                  key={category}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs font-medium'
                  )}
                >
                  <span className="capitalize">{category}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">{count}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="w-full overflow-hidden rounded-[32px] lg:rounded-[36px]">
          <ImageAutoSlider images={sliderImages} className="min-h-[55vh]" title={title} showTitlePill={false} />
        </div>
      </div>
    </section>
  );
}
