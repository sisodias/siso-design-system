"use client";

import { SectionHeading } from '@/domains/shared/components';
import type { ValuesContent, ValuesItem } from '../../types/schema';
import { valuesIconMap } from '../../shared/utils/valueIconMap';

function SpotlightCard({ item }: { item: ValuesItem }) {
  const Icon = valuesIconMap[item.icon];
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary-foreground text-primary-foreground">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="relative z-10 space-y-5 p-10">
        <div className="inline-flex items-center justify-center rounded-full bg-white/10 p-3 backdrop-blur-sm">
          <Icon className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em]">Spotlight</p>
          <h3 className="text-3xl font-semibold leading-tight">{item.title}</h3>
          <p className="text-sm leading-relaxed text-primary-foreground/90">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ValuesTemplate2(content: ValuesContent) {
  const { pillText, title, subtitle, description, values } = content;

  if (!values?.length) {
    return (
      <section className="flex min-h-[30vh] items-center justify-center bg-muted/40 px-6 text-center">
        <p className="max-w-lg text-sm text-muted-foreground">
          Populate the values collection to preview this variant.
        </p>
      </section>
    );
  }

  const [spotlight, ...rest] = values;

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl space-y-12 px-6">
        <SectionHeading
          pillText={pillText ?? 'Our Culture'}
          title={title}
          subtitle={subtitle ?? description}
          titleClassName="text-3xl md:text-4xl font-semibold"
          as="h2"
          centered={false}
          className="max-w-2xl"
        />

        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <SpotlightCard item={spotlight} />
            {description && (
              <div className="rounded-3xl border border-border/60 bg-background/80 p-8 backdrop-blur">
                <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
              </div>
            )}
          </div>

          <div className="grid gap-5">
            {rest.map((item) => {
              const Icon = valuesIconMap[item.icon];
              return (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-6 transition-colors hover:border-primary/60 hover:bg-background"
                >
                  <div className="flex items-start gap-4">
                    <span className="rounded-xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground/90 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
