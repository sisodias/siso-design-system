'use client';

/**
 * Menu Domain - Menu Page
 * Domain-Based Architecture
 *
 * Main menu page with category tabs, filters, and responsive layout
 */

import { useEffect } from 'react';

import { useMenuItems, useMenuCategories } from '../shared/hooks';

// Sections
import { MenuCategoriesRenderer } from "../sections/menu-categories";
import type { MenuCategoriesContent } from "../sections/menu-categories";

type MenuPageProps = {
  isSignedIn?: boolean;
};

const MenuPage = ({ isSignedIn = false }: MenuPageProps) => {
  useEffect(() => {
    document.title = "Menu | Elementree Eatscape";
  }, []);

  const { data: menuItems, isLoading: isLoadingItems, error: menuItemsError } = useMenuItems();
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useMenuCategories();

  const hasError = menuItemsError || categoriesError;
  const isEmpty = (!isLoadingItems && !isLoadingCategories) &&
                 (!menuItems || menuItems.length === 0) &&
                 (!categories || categories.length === 0);

  const isLoading = isLoadingItems || isLoadingCategories;

  const categoriesContent: MenuCategoriesContent = {
    categories: categories ?? [],
    items: menuItems ?? [],
    isLoading,
    hasError: Boolean(hasError),
    errorMessage: hasError ? (menuItemsError ?? categoriesError)?.message : undefined,
    isEmpty,
    isSignedIn,
    about: {
      heading: 'About Our Menu',
      paragraphs: [
        'Located at 108 Cricklewood Broadway, London NW2 3EJ, Elementree offers authentic Italian cuisine and 100% Neapolitan pizzas made by our Italian pizzaiolo from Naples, using traditional recipes passed down through generations.',
        'Our menu celebrates the perfect balance of the four elements: earth, water, fire, and air. We use locally sourced ingredients and offer a range of options for vegetarians, vegans, and those with gluten-free requirements.',
        'For any special dietary needs or inquiries, please contact us at +44 20 8830 9344 or ask your server for assistance.',
      ],
      ctaLabel: 'Order Online Now',
      ctaHref: '/order',
    },
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 md:pt-28">
      <main className="mx-auto max-w-6xl px-6 pb-14 md:pb-16">
        <MenuCategoriesRenderer content={categoriesContent} />
      </main>
    </div>
  );
};

export default MenuPage;
