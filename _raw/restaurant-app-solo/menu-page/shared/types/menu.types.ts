/**
 * Menu Domain - Type Definitions
 * Domain-Based Architecture
 */

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  ingredients: string | null;
  calories: number | null;
  // Optional nutrition fields (per serving)
  protein_g?: number | null;
  carbs_g?: number | null;
  sugar_g?: number | null;
  fat_g?: number | null;
  // Prep time in minutes (optional)
  prep_time_min?: number | null;
  // Allergens list (e.g., ["nuts", "dairy"]) – optional
  allergens?: string[] | null;
  // Additional dietary flags (optional)
  is_halal?: boolean | null;
  is_kosher?: boolean | null;
  // Derived/extra fields
  spice_level?: 0 | 1 | 2 | 3 | null; // 0 none, 1 mild, 2 medium, 3 hot
  serving_size_g?: number | null;
  is_seasonal?: boolean | null;
  is_new?: boolean | null;
  created_at?: string | null;
  pairings?: string[] | null;
  chef_tip?: string | null;
  popular_score: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
};

export type MenuItemsByCategory = Record<string, MenuItem[]>;

export type MenuFilters = {
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  spicy?: boolean;
  searchQuery?: string;
};
