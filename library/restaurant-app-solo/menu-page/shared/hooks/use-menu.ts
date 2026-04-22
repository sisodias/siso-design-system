/**
 * Menu Domain - React Query Hooks
 * Domain-Based Architecture
 *
 * Custom hooks for menu data fetching with caching
 *
 * These hooks unwrap Result<T> from the service layer and handle
 * errors inline (not via error boundaries). This ensures graceful
 * degradation when Supabase is unavailable.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMenuItems,
  fetchMenuCategories,
  fetchMenuItemsByCategory,
} from "../services/menu.service";
import { FALLBACK_MENU_ITEMS, FALLBACK_CATEGORIES, MENU_QUERY_CONFIG } from "../types/menu.constants";

/**
 * Hook to fetch all menu items
 * Uses React Query for caching and automatic refetching
 * Unwraps Result<T> from service layer
 *
 * Error Handling: Errors are logged and fallback data is returned.
 * Errors do NOT throw to error boundary - graceful degradation.
 */
export const useMenuItems = () => {
  return useQuery({
    queryKey: ["menuItems"],
    queryFn: async () => {
      const result = await fetchMenuItems();
      if (result.success) {
        return result.data;
      } else {
        console.error('[useMenuItems] Error:', result.error);
        // Return fallback data instead of throwing
        return FALLBACK_MENU_ITEMS;
      }
    },
    staleTime: MENU_QUERY_CONFIG.STALE_TIME,
    gcTime: MENU_QUERY_CONFIG.GC_TIME,
    placeholderData: FALLBACK_MENU_ITEMS,
    // Don't throw to error boundary - handle errors inline
    useErrorBoundary: false,
  });
};

/**
 * Hook to fetch all menu categories
 * Unwraps Result<T> from service layer
 *
 * Error Handling: Errors are logged and fallback data is returned.
 * Errors do NOT throw to error boundary - graceful degradation.
 */
export const useMenuCategories = () => {
  return useQuery({
    queryKey: ["menuCategories"],
    queryFn: async () => {
      const result = await fetchMenuCategories();
      if (result.success) {
        return result.data;
      } else {
        console.error('[useMenuCategories] Error:', result.error);
        // Return fallback data instead of throwing
        return FALLBACK_CATEGORIES;
      }
    },
    staleTime: MENU_QUERY_CONFIG.STALE_TIME,
    gcTime: MENU_QUERY_CONFIG.GC_TIME,
    placeholderData: FALLBACK_CATEGORIES,
    // Don't throw to error boundary - handle errors inline
    useErrorBoundary: false,
  });
};

/**
 * Hook to fetch menu items filtered by category
 * Unwraps Result<T> from service layer
 *
 * Error Handling: Errors are logged and fallback data is returned.
 * Errors do NOT throw to error boundary - graceful degradation.
 */
export const useMenuItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["menuItems", category],
    queryFn: async () => {
      const result = await fetchMenuItemsByCategory(category);
      if (result.success) {
        return result.data;
      } else {
        console.error(`[useMenuItemsByCategory] Error for category ${category}:`, result.error);
        // Return filtered fallback data instead of throwing
        return FALLBACK_MENU_ITEMS.filter(item => category === 'all' || item.category === category);
      }
    },
    enabled: !!category,
    staleTime: MENU_QUERY_CONFIG.STALE_TIME,
    // Don't throw to error boundary - handle errors inline
    useErrorBoundary: false,
  });
};

/**
 * Hook to prefetch menu data on app startup
 * Improves perceived performance
 * Unwraps Result<T> from service layer
 *
 * Error Handling: Errors are silently handled with fallback data.
 * Prefetching failures should not disrupt the user experience.
 */
export const usePrefetchMenuData = () => {
  const queryClient = useQueryClient();

  const prefetchMenuData = () => {
    // Prefetch menu items
    queryClient.prefetchQuery({
      queryKey: ["menuItems"],
      queryFn: async () => {
        const result = await fetchMenuItems();
        return result.success ? result.data : FALLBACK_MENU_ITEMS;
      },
      staleTime: MENU_QUERY_CONFIG.STALE_TIME,
    });

    // Prefetch menu categories
    queryClient.prefetchQuery({
      queryKey: ["menuCategories"],
      queryFn: async () => {
        const result = await fetchMenuCategories();
        return result.success ? result.data : FALLBACK_CATEGORIES;
      },
      staleTime: MENU_QUERY_CONFIG.STALE_TIME,
    });
  };

  return { prefetchMenuData };
};

// Re-export types for convenience
export type { MenuItem, MenuCategory } from "../types";
