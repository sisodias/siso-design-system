"use client";

import { useMemo, useState } from 'react';
import { SectionHeading } from '@/domains/shared/components';
import { FaqAccordion } from '@/components/ui/faq-chat-accordion';
import { cn } from '@/lib/utils';
import type { FaqContent } from '../../types/schema';

const DEFAULT_CATEGORY = 'all';

export default function FaqPrimary(content: FaqContent) {
  const { pillText, title, subtitle, items, showCategories, timestamp, cta, emptyState } = content;

  const categories = useMemo(() => {
    if (!showCategories) {
      return [];
    }

    const unique = new Map<string, string>();
    items.forEach((item) => {
      if (item.category) {
        const label = item.category.charAt(0).toUpperCase() + item.category.slice(1);
        unique.set(item.category, label);
      }
    });

    return [{ id: DEFAULT_CATEGORY, label: 'All Questions' }, ...Array.from(unique.entries()).map(([id, label]) => ({ id, label }))];
  }, [items, showCategories]);

  const [activeCategory, setActiveCategory] = useState<string>(DEFAULT_CATEGORY);

  const filteredItems = useMemo(() => {
    if (activeCategory === DEFAULT_CATEGORY) {
      return items;
    }
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  const accordionData = filteredItems.map((item, index) => ({
    id: parseInt(item.id, 10) || index + 1,
    question: item.question,
    answer: item.answer,
    icon: item.icon,
    iconPosition: item.iconPosition,
  }));

  const renderEmptyState = filteredItems.length === 0;

  return (
    <section className="bg-muted/30 py-16 px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          pillText={pillText ?? 'FAQs'}
          title={title}
          subtitle={subtitle}
          titleClassName="text-3xl md:text-4xl font-bold"
          as="h2"
          centered
          className="mb-8"
        />

        {showCategories && categories.length > 1 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  activeCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        <FaqAccordion data={accordionData} className="max-w-full" timestamp={timestamp} />

        {renderEmptyState && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{emptyState ?? 'No questions available in this category yet.'}</p>
          </div>
        )}

        {cta && (
          <div className="mt-10 text-center">
            <a
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
