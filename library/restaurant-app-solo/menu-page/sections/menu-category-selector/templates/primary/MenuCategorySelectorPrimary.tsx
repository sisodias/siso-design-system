"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeading, Tabs, TabsContent, TabsList, TabsTrigger } from '@/domains/shared/components';
import type { MenuCategorySelectorContent } from '../../types';

interface Props extends MenuCategorySelectorContent {
  onSelectCategory?: (categoryId: string) => void;
}

export default function MenuCategorySelectorPrimary({
  heading,
  summary,
  filterLabel = 'Filter categories',
  allLabel = 'All',
  activeCategoryId,
  showFilterToggle = true,
  categories,
  onSelectCategory,
}: Props) {
  const firstCategoryId = categories[0]?.id ?? 'all';
  const [selectedId, setSelectedId] = useState(activeCategoryId ?? firstCategoryId);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!categories.some((cat) => cat.id === selectedId)) {
      setSelectedId(activeCategoryId ?? firstCategoryId);
      return;
    }
    if (activeCategoryId && activeCategoryId !== selectedId) {
      setSelectedId(activeCategoryId);
    }
  }, [activeCategoryId, categories, firstCategoryId, selectedId]);

  const handleSelect = (categoryId: string) => {
    setSelectedId(categoryId);
    setShowDropdown(false);
    onSelectCategory?.(categoryId);
  };

  return (
    <section className="w-full space-y-6">
      <SectionHeading
        pillText={heading ? undefined : 'Our Menu'}
        title={heading ?? allLabel}
        subtitle={summary}
        centered
        className="mb-2"
        titleClassName="text-2xl font-bold sm:text-3xl"
      />

      {showFilterToggle ? (
        <button
          onClick={() => setShowDropdown((open) => !open)}
          className={cn(
            'flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-300 backdrop-blur-sm',
            'hover:border-white/30 hover:bg-white/15'
          )}
        >
          <span>{selectedId === 'all' ? `${allLabel} (${categories.length - 1})` : categories.find((cat) => cat.id === selectedId)?.name ?? allLabel}</span>
          <motion.div animate={{ rotate: showDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </motion.div>
        </button>
      ) : null}

      {showDropdown ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="rounded-xl border border-white/20 bg-black/90 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelect(category.id)}
                className={cn(
                  'rounded-lg px-3 py-2 text-xs font-medium transition-all duration-300',
                  selectedId === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                )}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span>{category.name}</span>
                  {typeof category.count === 'number' ? (
                    <span className="text-[11px] opacity-70">({category.count})</span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}

      <Tabs value={selectedId} onValueChange={handleSelect} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="flex w-full justify-start gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 px-2 py-2 backdrop-blur-xl">
            {categories.map((category, index) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-medium text-gray-300 transition-all duration-200',
                  'hover:text-white',
                  'data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg'
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <span>{category.name}</span>
                {typeof category.count === 'number' ? (
                  <span className="text-xs text-white/80">({category.count})</span>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} />
        ))}
      </Tabs>
    </section>
  );
}
