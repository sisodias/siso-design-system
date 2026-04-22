'use client';

/**
 * Menu Page - Restaurant Template
 * Mobile-first design with landing page aesthetics
 *
 * Design System:
 * - Dark theme background
 * - Glass-morphism cards
 * - Section-based layout
 * - Framer Motion animations
 * - Mobile horizontal scroll
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/domains/shared/components';
import {
  useMenuCategories,
  useMenuItemsByCategory,
  MenuLoadingState,
  MenuErrorAlert,
  MenuEmptyState,
  MenuItemDetailDialog,
  type MenuItem,
  type MenuCategory,
} from '@/domains/customer-facing/menu';

export default function MenuPageNew() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Fetch all categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useMenuCategories();

  // Fetch all items
  const {
    data: allItems = [],
    isLoading: itemsLoading,
  } = useMenuItemsByCategory(selectedCategory || '');

  // Count items per category
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    itemCount: allItems.filter(item => item.category === cat.id).length
  }));

  // Auto-select first category
  if (!selectedCategory && categories.length > 0) {
    setSelectedCategory(categories[0].id);
  }

  // Filter items by selected category
  const categoryItems = selectedCategory
    ? allItems.filter(item => item.category === selectedCategory)
    : [];

  // Loading state
  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MenuLoadingState />
      </div>
    );
  }

  // Error state
  if (categoriesError) {
    return (
      <div className="min-h-screen bg-background">
        <MenuErrorAlert error={categoriesError as Error} />
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <MenuEmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER SECTION */}
      <section className="w-full py-12 px-6">
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeading
            pillText="Our Menu"
            title="104 Delicious Choices"
            subtitle="Browse our full menu organized by category • All prices in IDR"
            centered={true}
            className="mb-8"
            as="h1"
            titleClassName="text-3xl sm:text-4xl font-bold"
          />
        </div>
      </section>

      {/* CATEGORY TABS SECTION */}
      <section className="w-full pb-6">
        <div className="mx-auto w-full max-w-5xl px-6">
          {/* Mobile: Horizontal Scroll Tabs */}
          <div className="sm:hidden">
            <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
              <div className="flex gap-3 pb-4">
                {categoriesWithCount.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      shrink-0 px-6 py-3 rounded-full text-sm font-medium
                      transition-all duration-300
                      ${selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                      }
                    `}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      {category.name}
                      <span className="text-xs opacity-70">
                        ({category.itemCount || 0})
                      </span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Grid Tabs */}
          <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categoriesWithCount.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-300
                  ${selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                    : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{category.name}</span>
                  <span className="text-xs opacity-70">
                    {category.itemCount || 0} items
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* MENU ITEMS SECTION */}
      <section className="w-full py-6">
        <div className="mx-auto w-full max-w-5xl px-6">
          {itemsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-xl bg-white/10 animate-pulse border border-white/20"
                />
              ))}
            </div>
          ) : categoryItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No items found in this category
              </p>
            </div>
          ) : (
            <>
              {/* Mobile: Horizontal Scroll Cards */}
              <div className="sm:hidden">
                <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
                  <div className="flex gap-4 pb-4">
                    {categoryItems.map((item) => (
                      <MenuItemCardMobile
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedItem(item)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop: Grid Cards */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryItems.map((item) => (
                  <MenuItemCardDesktop
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* FOOTER INFO */}
      <section className="w-full py-12 border-t border-white/10">
        <div className="mx-auto w-full max-w-5xl px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Available on GoFood & GrabFood
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Direct Delivery: +62 819 9977 7138
          </p>
        </div>
      </section>

      {/* ITEM DETAIL DIALOG */}
      <MenuItemDetailDialog
        item={selectedItem}
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

// ============================================================================
// MOBILE MENU ITEM CARD
// ============================================================================

interface MenuItemCardMobileProps {
  item: MenuItem;
  onClick: () => void;
}

function MenuItemCardMobile({ item, onClick }: MenuItemCardMobileProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      onClick={onClick}
      className="
        min-w-[280px] h-[360px] shrink-0 cursor-pointer
        rounded-xl overflow-hidden
        bg-white/10 border border-white/20
        hover:bg-white/20 hover:border-white/30
        transition-all duration-300
        backdrop-blur-sm
      "
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-muted">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatPrice(item.price)}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
            View Details
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// DESKTOP MENU ITEM CARD
// ============================================================================

interface MenuItemCardDesktopProps {
  item: MenuItem;
  onClick: () => void;
}

function MenuItemCardDesktop({ item, onClick }: MenuItemCardDesktopProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      onClick={onClick}
      className="
        cursor-pointer rounded-xl overflow-hidden
        bg-white/10 border border-white/20
        hover:bg-white/20 hover:border-white/30
        hover:shadow-xl hover:shadow-primary/10
        transition-all duration-300
        backdrop-blur-sm
      "
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-muted">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white line-clamp-1">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatPrice(item.price)}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
            View
          </span>
        </div>
      </div>
    </motion.div>
  );
}
