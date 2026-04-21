"use client";

import { ShineBorder } from './ShineBorder';
import { SectionHeading } from '@/domains/shared/components';
import type { ValuesItem } from '../../../types/schema';
import { valuesIconMap } from '../../../shared/utils/valueIconMap';

export interface ValuesGridProps {
  pillText?: string;
  title: string;
  subtitle?: string;
  values: ValuesItem[];
}

export function ValuesGrid({
  pillText = 'Our Principles',
  title,
  subtitle = 'What We Stand For',
  values,
}: ValuesGridProps) {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Section Heading */}
      <SectionHeading
        pillText={pillText}
        title={title}
        subtitle={subtitle}
        titleClassName="text-3xl md:text-4xl font-bold"
        as="h2"
        centered={true}
        className="mb-8"
      />

      {/* Single Big Card using ShineBorder */}
      <div className="mx-auto max-w-5xl">
        <ShineBorder
          borderWidth={3}
          borderRadius={24}
          duration={10}
          color={["#FF007F", "#39FF14", "#00FFFF"]}
          className="bg-white/5 p-0 text-foreground dark:bg-black/20"
        >
          <div className="w-full rounded-[20px] bg-background/70 p-6 backdrop-blur-sm md:p-10">
            <div className="grid gap-6 md:grid-cols-2">
              {values.map((value) => {
                const Icon = valuesIconMap[value.icon];
                return (
                  <div key={value.id} className="flex gap-4">
                    <div className="mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-white/10 text-white ring-1 ring-white/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {value.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/80">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ShineBorder>
      </div>
    </section>
  );
}
