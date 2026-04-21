'use client';

/**
 * Menu Page - Improved Version
 * Mobile-optimized with cleaner category selection
 *
 * User Feedback Addressed:
 * 1. Horizontal scroll for cards (user preference)
 * 2. Cards properly sized for mobile
 * 3. Cleaner category selection
 * 4. Much nicer card design
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SectionHeading } from '@/domains/shared/components';
import {
  useMenuCategories,
  useMenuItems,
  MenuLoadingState,
  MenuErrorAlert,
  MenuEmptyState,
  MenuItemDetailDialog,
  type MenuItem,
  type MenuCategory,
} from '@/domains/customer-facing/menu';
import { ChevronDown } from 'lucide-react';

export default function MenuPageImproved() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // Default to 'all'
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  // Fetch all categories and items
  const {
    data: realCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useMenuCategories();

  const {
    data: allItems = [],
    isLoading: itemsLoading,
  } = useMenuItems();

  // Add "All" category at the beginning
  const categories = [
    {
      id: 'all',
      name: 'All',
      description: 'Browse all menu items',
      display_order: -1
    },
    ...realCategories
  ];

  // Filter items by selected category
  const categoryItems = selectedCategory === 'all'
    ? allItems
    : allItems.filter(item => item.category === selectedCategory);

  // Get selected category name
  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name || 'All';

  // Count items for each category
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    itemCount: cat.id === 'all'
      ? allItems.length
      : allItems.filter(item => item.category === cat.id).length
  }));

  // Loading state
  if (categoriesLoading || itemsLoading) {
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
    <div className="min-h-screen bg-background pb-20">
      {/* HEADER SECTION */}
      <section className="w-full pt-28 pb-8 px-6 sm:pt-32">
        <div className="mx-auto w-full max-w-5xl">
          <SectionHeading
            pillText="Our Menu"
            title="Browse Our Menu"
            subtitle={`${allItems.length} delicious items • ${categories.length} categories`}
            centered={true}
            className="mb-6"
            as="h1"
            titleClassName="text-3xl sm:text-4xl font-bold"
          />
        </div>
      </section>

      {/* CATEGORY SELECTOR - CLEANER VERSION */}
      <section className="w-full pb-6 px-6">
        <div className="mx-auto w-full max-w-5xl">
          {/* Category Dropdown Button */}
          <button
            onClick={() => setShowCategorySelector(!showCategorySelector)}
            className="
              w-full px-6 py-4 rounded-xl
              bg-white/10 border border-white/20
              hover:bg-white/15 hover:border-white/30
              transition-all duration-300
              backdrop-blur-sm
              flex items-center justify-between
              group
            "
          >
            <span className="text-lg font-medium text-white">
              {selectedCategoryName}
            </span>
            <motion.div
              animate={{ rotate: showCategorySelector ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-white/70 group-hover:text-white" />
            </motion.div>
          </button>

          {/* Category Grid Popup */}
          <AnimatePresence>
            {showCategorySelector && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="
                  mt-3 p-4 rounded-xl
                  bg-black/95 border border-white/20
                  backdrop-blur-xl
                  shadow-2xl shadow-black/50
                "
              >
                <div className="grid grid-cols-2 gap-3">
                  {categoriesWithCount.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowCategorySelector(false);
                      }}
                      className={`
                        px-4 py-3 rounded-lg text-sm font-medium
                        transition-all duration-300
                        ${selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                          : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/15'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={category.id === 'all' ? 'font-bold' : ''}>
                          {category.name}
                        </span>
                        <span className="text-xs opacity-70">{category.itemCount}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* MENU ITEMS - HORIZONTAL SCROLL */}
      <section className="w-full py-6">
        <div className="mx-auto w-full max-w-5xl">
          {/* Items Counter */}
          <div className="px-6 mb-4">
            <p className="text-sm text-muted-foreground">
              {categoryItems.length} items in {selectedCategoryName}
            </p>
          </div>

          {categoryItems.length === 0 ? (
            <div className="px-6 text-center py-12">
              <p className="text-muted-foreground">
                No items found in this category
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide px-6 -mx-6">
              <div className="flex gap-4 px-6 pb-4 snap-x snap-mandatory">
                {categoryItems.map((item, index) => (
                  <MenuItemCardHorizontal
                    key={item.id}
                    item={item}
                    onClick={() => setSelectedItem(item)}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER INFO */}
      <section className="w-full py-8 border-t border-white/10 px-6">
        <div className="mx-auto w-full max-w-5xl text-center">
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
// IMPROVED HORIZONTAL MENU CARD
// ============================================================================

interface MenuItemCardHorizontalProps {
  item: MenuItem;
  onClick: () => void;
  index: number;
}

function MenuItemCardHorizontal({ item, onClick, index }: MenuItemCardHorizontalProps) {
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
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="
        snap-center shrink-0
        w-[85vw] max-w-[340px]
        cursor-pointer
        rounded-2xl overflow-hidden
        bg-gradient-to-br from-white/15 to-white/5
        border border-white/30
        hover:border-primary/50
        transition-all duration-300
        backdrop-blur-md
        shadow-xl shadow-black/20
        hover:shadow-2xl hover:shadow-primary/20
        group
      "
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* IMAGE SECTION with Gradient Overlay */}
      <div className="relative w-full h-48 overflow-hidden">
        {/* Background Image */}
        {item.image_url ? (
          <div className="relative w-full h-full">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}

        {/* Price Badge - Floating on Image */}
        <div className="absolute top-3 right-3">
          <div className="px-4 py-2 rounded-full bg-primary/90 backdrop-blur-sm border border-white/20 shadow-lg">
            <span className="text-sm font-bold text-white">
              {formatPrice(item.price)}
            </span>
          </div>
        </div>

        {/* Dietary Badges - Bottom Left */}
        {(item.is_vegetarian || item.is_vegan || item.is_spicy) && (
          <div className="absolute bottom-3 left-3 flex gap-2">
            {item.is_vegan && (
              <div className="px-2 py-1 rounded-md bg-green-500/90 backdrop-blur-sm text-xs font-medium text-white">
                Vegan
              </div>
            )}
            {item.is_vegetarian && !item.is_vegan && (
              <div className="px-2 py-1 rounded-md bg-green-400/90 backdrop-blur-sm text-xs font-medium text-white">
                Veggie
              </div>
            )}
            {item.is_spicy && (
              <div className="px-2 py-1 rounded-md bg-red-500/90 backdrop-blur-sm text-xs font-medium text-white">
                🌶 Spicy
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5 flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {item.description || 'No description available'}
        </p>

        {/* View Details Button */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-white/50">
            Tap to view details
          </span>
          <div className="px-4 py-2 rounded-full bg-primary/20 text-primary font-medium text-sm group-hover:bg-primary group-hover:text-white transition-all">
            View
          </div>
        </div>
      </div>
    </motion.div>
  );
}
