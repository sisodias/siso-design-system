"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/domains/shared/components';
import { FaqAccordion } from '@/components/ui/faq-chat-accordion';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'general' | 'ordering' | 'dining' | 'delivery';
  icon?: string;
  iconPosition?: "left" | "right";
}

export interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
  showCategories?: boolean;
  timestamp?: string;
}

export function FAQSection({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about dining with us",
  items,
  showCategories = false,
  timestamp,
}: FAQSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = showCategories
    ? [
        { id: 'all', label: 'All Questions' },
        { id: 'general', label: 'General' },
        { id: 'ordering', label: 'Ordering' },
        { id: 'dining', label: 'Dining' },
        { id: 'delivery', label: 'Delivery' },
      ]
    : [];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  // Convert our FAQItem format to the chat accordion format
  const accordionData = filteredItems.map((item, index) => ({
    id: parseInt(item.id) || index + 1,
    question: item.question,
    answer: item.answer,
    icon: item.icon,
    iconPosition: item.iconPosition,
  }));

  return (
    <section className="bg-muted/30 py-16 px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <SectionHeading
          pillText="Common Questions"
          title={title}
          subtitle={subtitle}
          titleClassName="text-3xl md:text-4xl font-bold"
          as="h2"
          centered={true}
          className="mb-8"
        />

        {/* Category Filter */}
        {showCategories && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        {/* Chat-style FAQ Accordion */}
        <FaqAccordion
          data={accordionData}
          className="max-w-full"
          timestamp={timestamp}
        />

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No questions found in this category.</p>
          </div>
        )}

        {/* Still have questions CTA */}
        <div className="mt-10 rounded-xl border border-white/10 bg-black p-8 text-center text-white">
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Still have questions?
          </h3>
          <p className="mb-4 text-white/80">
            We&apos;re here to help! Reach out to us directly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/6281999777138"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Message on WhatsApp
            </a>
            <a
              href="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Chat to our chat bot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
