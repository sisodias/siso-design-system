'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SectionHeading, AnimatedText } from '@/domains/shared/components';
import { useMenuCategories, useMenuItems } from '@/domains/customer-facing/menu';
import { groupMenuItemsByCategory } from '@/domains/customer-facing/menu/shared/hooks';
import { groupMenuSections } from '@/domains/customer-facing/menu/shared/utils/menu-grouping';
import MenuAboutSection from '@/domains/customer-facing/menu/sections/menu-categories/shared/components/MenuAboutSection';
import {
  MenuItemCardRenderer,
  type MenuItemCardContent,
} from '@/domains/customer-facing/menu/sections/menu-item-card';
import type { MenuItem } from '@/domains/customer-facing/menu/shared/types';
import MenuLoadingState from '@/domains/customer-facing/menu/sections/menu-categories/shared/components/MenuLoadingState';
import MenuErrorAlert from '@/domains/customer-facing/menu/sections/menu-categories/shared/components/MenuErrorAlert';
import MenuEmptyState from '@/domains/customer-facing/menu/sections/menu-categories/shared/components/MenuEmptyState';
import {
  MenuItemDetailRenderer,
  type MenuItemDetailContent,
} from '@/domains/customer-facing/menu/sections/menu-item-detail';
import type { MenuCategoriesContent } from '@/domains/customer-facing/menu/sections/menu-categories';

export default function MenuCategoriesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetGroupSlug = searchParams.get('group');

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useMenuCategories();

  const {
    data: items = [],
    isLoading: itemsLoading,
  } = useMenuItems();

  const loading = categoriesLoading || itemsLoading;
  const hasError = Boolean(categoriesError);

  const itemsByCategory = useMemo(() => groupMenuItemsByCategory(items), [items]);
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  }, [categories]);

  const groupedSections = useMemo(
    () => groupMenuSections(sortedCategories, itemsByCategory),
    [itemsByCategory, sortedCategories],
  );

  const categoryNameById = useMemo(() => new Map(sortedCategories.map((cat) => [cat.id, cat.name])), [sortedCategories]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

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
  const recommendedPool: MenuItem[] = [];
  const pairingNames = Array.isArray(item.pairings) ? item.pairings : [];

  pairingNames.forEach((name) => {
    const match = items.find((candidate) =>
      candidate.id === name || candidate.name.toLowerCase() === name.toLowerCase(),
    );
    if (match) {
      recommendedPool.push(match);
    }
  });

  if (recommendedPool.length < 3) {
    const sameCategory = items
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

  const recommendedItems = recommendedPool
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
    recommendedItems: recommendedItems.length > 0 ? recommendedItems : undefined,
  };
};

  const selectedGroup = targetGroupSlug
    ? groupedSections.find((section) => section.slug === targetGroupSlug)
    : null;

  const displaySections = useMemo(() => {
    if (!selectedGroup) {
      return groupedSections;
    }

    return [selectedGroup];
  }, [groupedSections, selectedGroup]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MenuLoadingState />
      </div>
    );
  }

  if (hasError || groupedSections.length === 0) {
    if (hasError) {
      return (
        <div className="min-h-screen bg-background">
          <MenuErrorAlert error={categoriesError as Error} />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <MenuEmptyState />
      </div>
    );
  }

  const totalItems = items.length;
  const about: MenuCategoriesContent['about'] = {
    heading: 'About Our Menu',
    paragraphs: [
      'Located at 108 Cricklewood Broadway, London NW2 3EJ, Elementree offers authentic Italian cuisine and 100% Neapolitan pizzas made by our Italian pizzaiolo from Naples, using traditional recipes passed down through generations.',
      'Our menu celebrates the perfect balance of the four elements: earth, water, fire, and air. We use locally sourced ingredients and offer a range of options for vegetarians, vegans, and those with gluten-free requirements.',
      'For any special dietary needs or inquiries, please contact us at +44 20 8830 9344 or ask your server for assistance.',
    ],
    ctaLabel: 'Order Online Now',
    ctaHref: '/order',
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="w-full px-6 pt-24 pb-10">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            pillText="Menu Categories"
            title={selectedGroup ? selectedGroup.label : 'Explore Every Section'}
            subtitle={selectedGroup
              ? `${selectedGroup.items.length} items in this section`
              : `${groupedSections.length} curated sections • ${totalItems} total items`}
            centered
            className="text-center"
            titleClassName="text-3xl sm:text-4xl font-semibold"
          />

          {selectedGroup ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => router.push('/menu/categories')}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/15"
              >
                View all menu sections
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="w-full px-6">
        <div className="mx-auto w-full max-w-6xl space-y-20">
          {displaySections.map((group) => {
            const sortedGroupCategories = [...group.categories].sort((a, b) => {
              const orderA = a.display_order ?? Number.MAX_SAFE_INTEGER;
              const orderB = b.display_order ?? Number.MAX_SAFE_INTEGER;
              return orderA - orderB;
            });

            return (
              <div key={group.key} id={`menu-group-${group.slug}`} className="space-y-10 scroll-mt-28">
                <div className="space-y-4">
                  <AnimatedText
                    text={group.label}
                    as="h2"
                    className="items-start justify-start gap-1"
                    textClassName="text-left text-3xl font-semibold text-white md:text-4xl"
                    underlineGradient="from-amber-400 via-orange-500 to-pink-500"
                    underlineHeight="h-[3px]"
                    underlineOffset="mt-2"
                  />
                  <p className="text-sm text-white/60 md:text-base">
                    {group.items.length} {group.items.length === 1 ? 'item' : 'items'} curated for this section.
                  </p>
                </div>

                <div className="space-y-10">
                  {sortedGroupCategories.map((category) => {
                    const categoryItems = itemsByCategory[category.id] ?? [];

                    if (categoryItems.length === 0) {
                      return null;
                    }

                    return (
                      <div key={category.id} className="space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                          {category.name ?? 'Category'}
                          <span className="text-white/40">•</span>
                          <span>{categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}</span>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          {categoryItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 12 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 0.2 }}
                              transition={{ duration: 0.25, delay: 0.05 }}
                              className="h-full"
                            >
                              <MenuItemCardRenderer
                                content={toCardContent(item)}
                                onSelectItem={() => setSelectedItem(item)}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!selectedGroup ? <MenuAboutSection about={about} /> : null}
        </div>
      </section>

      {selectedItem ? (
        <MenuItemDetailRenderer
          content={toDetailContent(selectedItem)}
          isOpen
          onClose={() => setSelectedItem(null)}
        />
      ) : null}
    </div>
  );
}
