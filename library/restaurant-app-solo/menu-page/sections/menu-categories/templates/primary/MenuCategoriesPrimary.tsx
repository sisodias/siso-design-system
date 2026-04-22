"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { groupMenuItemsByCategory } from '@/domains/customer-facing/menu/shared/hooks';
import type { MenuCategory, MenuItem } from '@/domains/customer-facing/menu/shared/types';
import MenuLoadingState from '../../shared/components/MenuLoadingState';
import MenuErrorAlert from '../../shared/components/MenuErrorAlert';
import MenuEmptyState from '../../shared/components/MenuEmptyState';
import MenuAboutSection from '../../shared/components/MenuAboutSection';
import {
  MenuItemCardRenderer,
  type MenuItemCardContent,
} from '@/domains/customer-facing/menu/sections/menu-item-card';
import {
  MenuItemDetailRenderer,
  type MenuItemDetailContent,
} from '@/domains/customer-facing/menu/sections/menu-item-detail';
import type { MenuCategoriesContent } from '../../types';
import { AnimatedText, SectionHeading } from '@/domains/shared/components';
import { groupMenuSections } from '@/domains/customer-facing/menu/shared/utils/menu-grouping';
import { useRouter } from 'next/navigation';

export default function MenuCategoriesPrimary({
  categories = [],
  items = [],
  isLoading,
  hasError,
  errorMessage,
  isEmpty,
  isSignedIn,
  about,
}: MenuCategoriesContent) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const menuItems = useMemo(() => items as MenuItem[], [items]);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }, [categories]);

  const itemsByCategory = useMemo(
    () => groupMenuItemsByCategory(menuItems),
    [menuItems],
  );

  const loading = Boolean(isLoading);
  const error = hasError ? new Error(errorMessage ?? 'Failed to load menu data.') : null;
  const empty = Boolean(isEmpty) || (!loading && !error && menuItems.length === 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MenuLoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MenuErrorAlert error={error} />
      </div>
    );
  }

  if (empty) {
    return (
      <div className="min-h-screen bg-background">
        <MenuEmptyState isSignedIn={Boolean(isSignedIn)} />
      </div>
    );
  }

  const categoryNameById = useMemo(() => {
    return new Map(sortedCategories.map((cat) => [cat.id, cat.name]));
  }, [sortedCategories]);

  const toCardContent = (item: MenuItem): MenuItemCardContent => ({
    id: item.id,
    name: item.name,
    description: item.description ?? undefined,
    price: item.price,
    currency: 'IDR',
    category: categoryNameById.get(item.category) ?? item.category ?? 'Dish',
    imageUrl: item.image_url ?? undefined,
    isVegetarian: item.is_vegetarian,
    isVegan: item.is_vegan,
    isGlutenFree: item.is_gluten_free,
    isSpicy: item.is_spicy,
    calories: item.calories ?? undefined,
    protein: item.protein_g ?? undefined,
    carbs: item.carbs_g ?? undefined,
    sugar: item.sugar_g ?? undefined,
    fat: item.fat_g ?? undefined,
    prepTimeMin: item.prep_time_min ?? undefined,
    spiceLevel: item.spice_level ?? undefined,
    servingSizeGrams: item.serving_size_g ?? undefined,
    isHalal: item.is_halal ?? undefined,
    isKosher: item.is_kosher ?? undefined,
    allergens: item.allergens ?? undefined,
    pairings: item.pairings ?? undefined,
    chefTip: item.chef_tip ?? undefined,
    popularScore: item.popular_score ?? undefined,
    badges: item.is_new ? ['New'] : undefined,
  });

  const toDetailContent = (item: MenuItem): MenuItemDetailContent => {
    const pairingNames = Array.isArray(item.pairings) ? item.pairings : [];
    const recommendedPool: MenuItem[] = [];

    pairingNames.forEach((name) => {
      const match = menuItems.find((candidate) =>
        candidate.id === name || candidate.name.toLowerCase() === name.toLowerCase(),
      );
      if (match) {
        recommendedPool.push(match);
      }
    });

    if (recommendedPool.length < 3) {
      const sameCategory = menuItems
        .filter((candidate) => candidate.category === item.category && candidate.id !== item.id)
        .sort((a, b) => (b.popular_score ?? 0) - (a.popular_score ?? 0));

      sameCategory.forEach((candidate) => {
        if (recommendedPool.length >= 4) {
          return;
        }
        if (!recommendedPool.some((existing) => existing.id === candidate.id)) {
          recommendedPool.push(candidate);
        }
      });
    }

    const recommendedContent = recommendedPool
      .slice(0, 6)
      .map((candidate) => toCardContent(candidate));

    return {
      ...toCardContent(item),
      heroImageUrl: item.image_url ?? undefined,
      gallery: undefined,
      origin: undefined,
      availability: undefined,
      winePairing: undefined,
      preparationNotes: undefined,
      recommendedItems: recommendedContent.length > 0 ? recommendedContent : undefined,
    };
  };

  const handleSelectItem = (itemId: string) => {
    const match = menuItems.find((entry) => entry.id === itemId);
    if (match) {
      setSelectedItem(match);
    }
  };

  const closeDetail = () => setSelectedItem(null);
  const groupedSections = useMemo(
    () => groupMenuSections(sortedCategories, itemsByCategory),
    [itemsByCategory, sortedCategories],
  );

  const CategoryPill = ({ label, count }: { label: string; count: number }) => {
    const shellClass = cn('relative flex h-1 w-1 items-center justify-center rounded-full bg-white/35');
    const pingClass = 'flex h-2 w-2 animate-ping items-center justify-center rounded-full bg-white';
    const coreClass = 'absolute top-1/2 left-1/2 flex h-1 w-1 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/80';

    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80 shadow-sm backdrop-blur">
        <span className={shellClass}>
          <span className={pingClass}>
            <span className={pingClass}></span>
          </span>
          <span className={coreClass}></span>
        </span>
        {label}
        <span className="text-white/50">•</span>
        <span>
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </span>
    );
  };

  const router = useRouter();

  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (groupedSections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let maxEntry: IntersectionObserverEntry | null = null;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (!maxEntry || entry.intersectionRatio > maxEntry.intersectionRatio) {
            maxEntry = entry;
          }
        });

        if (maxEntry) {
          const key = maxEntry.target.getAttribute('data-group-key');
          setActiveGroupKey(key && key.length > 0 ? key : null);
        }
      },
      {
        rootMargin: '-200px 0px -55%',
        threshold: [0.1, 0.25, 0.5],
      },
    );

    groupedSections.forEach((section) => {
      const el = document.getElementById(`menu-group-${section.slug}`);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [groupedSections]);

  useEffect(() => {
    if (!selectorOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!selectorRef.current) {
        return;
      }

      if (!selectorRef.current.contains(event.target as Node)) {
        setSelectorOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [selectorOpen]);

  const navigateToGroup = (slug: string | null) => {
    const href = slug ? `/menu/categories?group=${slug}` : '/menu/categories';
    router.push(href);
    setSelectorOpen(false);
  };

  const navButtonClass = (isActive: boolean) =>
    cn(
      'w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors text-left',
      isActive
        ? 'border-primary/60 bg-primary/20 text-white shadow-lg shadow-primary/30'
        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white',
    );

  const totalItems = menuItems.length;
  const selectedGroupLabel = activeGroupKey
    ? groupedSections.find((section) => section.key === activeGroupKey)?.label ?? 'Menu Categories'
    : 'All Sections';

  return (
    <div className="space-y-16" id="menu-category-top">
      <header className="flex justify-center">
        <SectionHeading
          pillText="Our Menu"
          title="Browse Our Menu"
          subtitle="Curated sections keep things simple—jump into breakfast, mains, and drinks without endless scrolling."
          centered
          className="max-w-2xl text-center"
          titleClassName="text-3xl md:text-4xl font-semibold"
        />
      </header>

      {groupedSections.length > 0 ? (
        <div className="relative mx-auto w-full max-w-5xl" ref={selectorRef}>
          <button
            type="button"
            onClick={() => setSelectorOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-white transition-colors hover:border-white/30 hover:bg-white/10"
          >
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Categories</p>
              <p className="mt-1 text-lg font-semibold">
                {selectedGroupLabel}
                {activeGroupKey ? null : ` • ${totalItems} items`}
              </p>
            </div>
            <motion.span animate={{ rotate: selectorOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <svg className="h-5 w-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.span>
          </button>

          <AnimatePresence>
            {selectorOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-30 rounded-3xl border border-white/15 bg-black/85 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className={navButtonClass(activeGroupKey === null)}
                    onClick={() => navigateToGroup(null)}
                  >
                    <span className="flex flex-col">
                      <span className="text-base font-semibold">All Items</span>
                      <span className="text-sm text-white/60">{totalItems} total</span>
                    </span>
                  </button>
                  {groupedSections.map((section) => {
                    const count = section.items.length;
                    return (
                      <button
                        key={section.key}
                        type="button"
                        className={navButtonClass(activeGroupKey === section.key)}
                        onClick={() => navigateToGroup(section.slug)}
                      >
                        <span className="flex flex-col">
                          <span className="text-base font-semibold">{section.label}</span>
                          <span className="text-sm text-white/60">{count} {count === 1 ? 'item' : 'items'}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      {groupedSections.length > 0 ? (
        <div className="space-y-16">
          {groupedSections.map((group) => {
            const subcategorySummary = group.categories
              .map((subcategory) => subcategory.name)
              .filter(Boolean)
              .join(' • ');

            return (
              <motion.section
                key={group.key}
                id={`menu-group-${group.slug}`}
                data-group-key={group.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <AnimatedText
                      text={group.label}
                      as="h2"
                      className="items-start justify-start gap-1"
                      textClassName="text-left text-2xl font-semibold text-white md:text-3xl"
                      underlineGradient="from-amber-400 via-orange-500 to-pink-500"
                      underlineHeight="h-[3px]"
                      underlineOffset="mt-2"
                    />
                    {subcategorySummary ? (
                      <p className="text-sm text-white/60 md:text-base">
                        {subcategorySummary}
                      </p>
                    ) : null}
                  </div>

                  <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/50">
                    {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <div className="space-y-10">
                  {group.categories.map((category) => {
                    const categoryItems = itemsByCategory[category.id] ?? [];
                    if (categoryItems.length === 0) {
                      return null;
                    }

                    return (
                      <div
                        key={category.id}
                        id={`menu-category-${category.id}`}
                        data-category-id={category.id}
                        className="space-y-4 scroll-mt-32"
                      >
                        <div className="flex items-center justify-between">
                          <CategoryPill label={category.name ?? 'Category'} count={categoryItems.length} />
                        </div>

                        <div className="-mx-2 overflow-x-auto pb-2">
                          <div className="flex snap-x snap-mandatory gap-4 px-2 md:gap-6 md:px-3 lg:px-4">
                            {categoryItems.map((item) => (
                              <div
                                key={item.id}
                                className="w-[300px] shrink-0 snap-start md:w-[340px] lg:w-[380px]"
                              >
                                <MenuItemCardRenderer
                                  content={toCardContent(item)}
                                  onSelectItem={handleSelectItem}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          })}
        </div>
      ) : (
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/80">
          No dishes found yet. Please check back soon.
        </div>
      )}

      <section className="w-full">
        <div className="mx-auto w-full max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 shadow-lg backdrop-blur-md sm:p-6">
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-orange-500/20 blur-3xl" />

            <div className="flex flex-col items-start gap-3 text-white/90 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-purple-600/30">🤖</span>
                <div>
                  <p className="text-sm font-semibold sm:text-base">Unsure what to pick?</p>
                  <p className="text-xs text-white/70 sm:text-sm">Our AI assistant can help you choose a dish that matches your tastes.</p>
                </div>
              </div>

              <div className="sm:ml-auto">
                <a
                  href="/chat"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
                >
                  Ask the AI assistant
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-auto w-full max-w-5xl">
          <MenuAboutSection about={about} />
        </div>
      </section>

      {selectedItem ? (
        <MenuItemDetailRenderer
          content={toDetailContent(selectedItem)}
          isOpen
          onClose={closeDetail}
        />
      ) : null}
    </div>
  );
}
