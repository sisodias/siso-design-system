/**
 * Menu Category Icon Component
 * Maps menu categories to appropriate lucide-react icons
 */

import {
  Coffee,
  Pizza,
  Utensils,
  Beef,
  GlassWater,
  Martini,
  Croissant,
  IceCream,
  Salad,
  Cookie,
  Wine,
  Beer,
  UtensilsCrossed,
  Sandwich,
  Soup as SoupIcon,
  type LucideIcon,
} from "lucide-react";
import { createElement } from "react";

type CategoryIconMap = {
  [key: string]: LucideIcon;
};

const categoryIconMap: CategoryIconMap = {
  // Breakfast & Morning
  breakfast: Croissant,
  brunch: Coffee,

  // Main Dishes
  pizza: Pizza,
  pasta: Utensils,
  burgers: Beef,
  burger: Beef,
  sandwiches: Sandwich,
  sandwich: Sandwich,

  // Bowls & Soups
  'rice bowl': Utensils,
  'rice bowls': Utensils,
  bowl: Utensils,
  bowls: Utensils,
  soup: SoupIcon,
  soups: SoupIcon,
  salad: Salad,
  salads: Salad,

  // Beverages
  coffee: Coffee,
  tea: Coffee,
  smoothies: GlassWater,
  smoothie: GlassWater,
  cocktails: Martini,
  cocktail: Martini,
  mocktails: Martini,
  wine: Wine,
  beer: Beer,
  drinks: GlassWater,
  beverages: Coffee,

  // Desserts
  desserts: IceCream,
  dessert: IceCream,
  sweets: Cookie,
  pastries: Croissant,

  // General/Fallback
  specials: UtensilsCrossed,
  appetizers: Utensils,
  mains: UtensilsCrossed,
  sides: Utensils,
};

/**
 * Get the appropriate icon component for a category
 */
export const getCategoryIcon = (category: string): LucideIcon => {
  const normalizedCategory = category.toLowerCase().trim();
  return categoryIconMap[normalizedCategory] || UtensilsCrossed;
};

type MenuCategoryIconProps = {
  category: string;
  className?: string;
  size?: number;
};

/**
 * Renders an icon for a menu category
 */
export const MenuCategoryIcon = ({
  category,
  className = "w-5 h-5",
  size
}: MenuCategoryIconProps) => {
  return createElement(getCategoryIcon(category), { className, size });
};

export default MenuCategoryIcon;
