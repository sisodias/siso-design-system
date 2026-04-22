/**
 * Menu Domain - Service Layer
 * Domain-Based Architecture
 *
 * Handles all data fetching and business logic for menu domain
 *
 * IMPORTANT: All async functions return Result<T> instead of throwing.
 * This ensures errors are handled explicitly and the app can gracefully
 * degrade when Supabase is unavailable.
 */

import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { Ok, Err, type Result } from "@/lib/types/Result";
import { MenuItem, MenuCategory } from "../types";
import { enrichMenuItems } from "../utils/enrich-menu-items";

// Create single client instance at module level (singleton pattern)
const supabase = createSupabaseClient();

// Create helper to match elementree pattern
const fromTable = (tableName: string) => {
  return supabase.from(tableName);
};

/**
 * Fetch all menu items from database
 * Returns Result<MenuItem[]> - never throws
 *
 * @returns Ok(items) on success, Ok(FALLBACK_MENU_ITEMS) if Supabase unavailable,
 *          or Err(error) on unexpected failures
 */
export const fetchMenuItems = async (): Promise<Result<MenuItem[]>> => {
  try {
    const { data, error } = await fromTable('item')
      .select("*")
      .eq('active', true)
      .order("name");

    if (error) {
      console.error("[Menu Service] Error fetching menu items:", error);
      return Err(new Error(`Failed to fetch menu items: ${error.message}`));
    }

    // Map database fields to MenuItem type
    const items = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name || 'Unnamed item',
      description: item.description || null,
      price: parseFloat(item.price) || 0,
      category: item.category_id || '',  // UUID foreign key
      image_url: item.image_url || null,
      is_vegetarian: item.is_vegetarian || false,
      is_vegan: item.is_vegan || false,
      is_gluten_free: item.is_gluten_free || false,
      is_spicy: item.is_spicy || false,
      ingredients: item.ingredients || null,
      calories: item.calories ?? null,
      protein_g: item.protein_g ?? null,
      carbs_g: item.carbs_g ?? null,
      sugar_g: item.sugar_g ?? null,
      fat_g: item.fat_g ?? null,
      prep_time_min: item.prep_time_min ?? item.prep_minutes ?? null,
      allergens: Array.isArray(item.allergens)
        ? (item.allergens as string[])
        : (typeof item.allergens === 'string'
            ? (item.allergens as string)
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
            : null),
      is_halal: item.is_halal ?? null,
      is_kosher: item.is_kosher ?? null,
      serving_size_g: item.serving_size_g ?? null,
      is_seasonal: item.is_seasonal ?? null,
      created_at: item.created_at ?? null,
      popular_score: item.popular_score || 0
    }));

    return Ok(enrichMenuItems(items as MenuItem[]));
  } catch (error) {
    console.error("[Menu Service] Unexpected error fetching menu items:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return Err(err);
  }
};

/**
 * Fetch all menu categories from database
 * Categories are derived from distinct category values in menu_items
 * Returns Result<MenuCategory[]> - never throws
 *
 * @returns Ok(categories) on success, Ok(FALLBACK_CATEGORIES) if Supabase unavailable,
 *          or Err(error) on unexpected failures
 */
export const fetchMenuCategories = async (): Promise<Result<MenuCategory[]>> => {
  try {
    const { data, error } = await fromTable('item')
      .select("category_id")
      .eq('active', true);

    if (error) {
      console.error("[Menu Service] Error fetching menu categories:", error);
      return Err(new Error(`Failed to fetch menu categories: ${error.message}`));
    }

    // Extract unique category_ids
    const uniqueCategoryIds = [...new Set((data || []).map((item: any) => item.category_id))];

    // Fetch category names from category table
    const { data: categoryData, error: catError } = await fromTable('category')
      .select("id, name, position")
      .in('id', uniqueCategoryIds.filter(Boolean));

    if (catError) {
      console.error("[Menu Service] Error fetching category names:", catError);
      return Err(new Error(`Failed to fetch category names: ${catError.message}`));
    }

    const categories = (categoryData || [])
      .sort((a: any, b: any) => (a.position || 0) - (b.position || 0))
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        description: null,
        display_order: cat.position || 0
      }));

    return Ok(categories as MenuCategory[]);
  } catch (error) {
    console.error("[Menu Service] Unexpected error fetching menu categories:", error);
    const err = error instanceof Error ? error : new Error(String(error));
    return Err(err);
  }
};

/**
 * Fetch menu items filtered by category
 * If category is 'all', returns all items
 * Returns Result<MenuItem[]> - never throws
 *
 * @param category - Category to filter by, or 'all' for all items
 * @returns Ok(items) on success, Ok(filtered fallback) if Supabase unavailable,
 *          or Err(error) on unexpected failures
 */
export const fetchMenuItemsByCategory = async (category: string): Promise<Result<MenuItem[]>> => {
  try {
    let query = fromTable('item')
      .select("*")
      .eq('active', true);

    // Only filter by category if not 'all'
    if (category !== 'all') {
      query = query.eq("category_id", category);
    }

    query = query.order("name");

    const { data, error } = await query;

    if (error) {
      console.error(`[Menu Service] Error fetching menu items for category ${category}:`, error);
      return Err(new Error(`Failed to fetch menu items for category ${category}: ${error.message}`));
    }

    // Map database fields to MenuItem type
    const items = (data || []).map((item: any) => ({
      id: item.id,
      name: item.name || 'Unnamed item',
      description: item.description || null,
      price: parseFloat(item.price) || 0,
      category: item.category || '',  // TEXT field
      image_url: item.image_url || null,
      is_vegetarian: item.is_vegetarian || false,
      is_vegan: item.is_vegan || false,
      is_gluten_free: item.is_gluten_free || false,
      is_spicy: item.is_spicy || false,
      ingredients: item.ingredients || null,
      calories: item.calories ?? null,
      protein_g: item.protein_g ?? null,
      carbs_g: item.carbs_g ?? null,
      sugar_g: item.sugar_g ?? null,
      fat_g: item.fat_g ?? null,
      prep_time_min: item.prep_time_min ?? item.prep_minutes ?? null,
      allergens: Array.isArray(item.allergens)
        ? (item.allergens as string[])
        : (typeof item.allergens === 'string'
            ? (item.allergens as string)
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
            : null),
      is_halal: item.is_halal ?? null,
      is_kosher: item.is_kosher ?? null,
      serving_size_g: item.serving_size_g ?? null,
      is_seasonal: item.is_seasonal ?? null,
      created_at: item.created_at ?? null,
      popular_score: item.popular_score || 0
    }));

    return Ok(enrichMenuItems(items as MenuItem[]));
  } catch (error) {
    console.error(`[Menu Service] Unexpected error fetching menu items for category ${category}:`, error);
    const err = error instanceof Error ? error : new Error(String(error));
    return Err(err);
  }
};

/**
 * Group menu items by category
 */
export const groupMenuItemsByCategory = (
  menuItems: MenuItem[]
): Record<string, MenuItem[]> => {
  return menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const categoryId = item.category;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {});
};

/**
 * Filter menu items based on dietary preferences
 */
export const filterMenuItems = (
  items: MenuItem[],
  filters: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    spicy?: boolean;
  }
): MenuItem[] => {
  return items.filter(item => {
    if (filters.vegetarian && !item.is_vegetarian) return false;
    if (filters.vegan && !item.is_vegan) return false;
    if (filters.glutenFree && !item.is_gluten_free) return false;
    if (filters.spicy && !item.is_spicy) return false;
    return true;
  });
};

/**
 * Search menu items by name or description
 */
export const searchMenuItems = (
  items: MenuItem[],
  query: string
): MenuItem[] => {
  const lowerQuery = query.toLowerCase();
  return items.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description?.toLowerCase().includes(lowerQuery) ||
    item.ingredients?.toLowerCase().includes(lowerQuery)
  );
};
