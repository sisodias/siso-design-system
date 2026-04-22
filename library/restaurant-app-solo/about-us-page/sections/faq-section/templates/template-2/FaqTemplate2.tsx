"use client";

import { useMemo } from 'react';
import { SectionHeading } from '@/domains/shared/components';
import { FaqAccordion } from '@/components/ui/faq-chat-accordion';
import { cn } from '@/lib/utils';
import type { FaqContent } from '../../types/schema';

export default function FaqTemplate2(content: FaqContent) {
  const { pillText, title, subtitle, items, showCategories, timestamp, cta } = content;
  const hero = items[0];
  const rest = items.slice(1);

  if (!hero) {
    return null;
  }

  const categoryBadges = useMemo(() => {
    if (!showCategories) {
      return [];
    }
    const counts = new Map<string, number>();
    items.forEach((item) => {
      if (item.category) {
        counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
      }
    });
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }));
  }, [items, showCategories]);

  return (
    <section className="bg-background py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            pillText={pillText ?? 'FAQs'}
            title={title}
            subtitle={subtitle}
            titleClassName="text-3xl md:text-4xl font-semibold"
            as="h2"
            centered={false}
            className="max-w-xl"
          />

          <div className="rounded-3xl border border-border/60 bg-muted/20 p-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">Featured</p>
            <h3 className="mt-3 text-xl font-semibold text-foreground">{hero.question}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{hero.answer}</p>
            {hero.category && (
              <span className="mt-4 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {hero.category}
              </span>
            )}
          </div>

          {categoryBadges.length ? (
            <div className="flex flex-wrap gap-2">
              {categoryBadges.map(({ category, count }) => (
                <span
                  key={category}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground',
                    'bg-background/80'
                  )}
                >
                  <span className="capitalize">{category}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{count}</span>
                </span>
              ))}
            </div>
          ) : null}

          {cta && (
            <a
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/60 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              {cta.label}
            </a>
          )}
        </div>

        <div className="rounded-3xl border border-border/60 bg-background/70 p-6 shadow-lg shadow-primary/10">
          <FaqAccordion
            data={(rest.length ? rest : [hero]).map((item, index) => ({
              id: parseInt(item.id, 10) || index + 1,
              question: item.question,
              answer: item.answer,
              icon: item.icon,
              iconPosition: item.iconPosition,
            }))}
            className="max-w-full"
            timestamp={timestamp}
          />
        </div>
      </div>
    </section>
  );
}
