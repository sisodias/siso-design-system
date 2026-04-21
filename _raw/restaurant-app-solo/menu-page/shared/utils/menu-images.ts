/**
 * Menu Image Utilities
 * Handles image URLs with Cloudinary optimization and category-based fallbacks
 */

import type { MenuItem } from '../types/menu.types';

type ImageSize = 'thumbnail' | 'card' | 'detail' | 'hero';

const imageSizeMap: Record<ImageSize, { width: number; height: number }> = {
  thumbnail: { width: 200, height: 150 },
  card: { width: 400, height: 300 },
  detail: { width: 800, height: 600 },
  hero: { width: 1200, height: 800 },
};

/**
 * Category-based fallback images from Unsplash
 * High-quality food photography
 */
const categoryImageMap: Record<string, string> = {
  // Breakfast
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=880&q=80',
  brunch: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=880&q=80',

  // Main Dishes
  pizza: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=880&q=80',
  pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=880&q=80',
  burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=880&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=880&q=80',
  sandwiches: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=880&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=880&q=80',

  // Bowls & Soups
  'rice bowl': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=880&q=80',
  'rice bowls': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=880&q=80',
  bowl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=880&q=80',
  bowls: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=880&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=880&q=80',
  soups: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=880&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=880&q=80',
  salads: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=880&q=80',

  // Beverages
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=880&q=80',
  tea: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=880&q=80',
  smoothies: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=880&q=80',
  smoothie: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=880&q=80',
  cocktails: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=880&q=80',
  cocktail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=880&q=80',
  mocktails: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=880&q=80',
  wine: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=880&q=80',
  beer: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=880&q=80',
  drinks: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=880&q=80',
  beverages: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=880&q=80',

  // Desserts
  desserts: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=880&q=80',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=880&q=80',
  sweets: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=880&q=80',
  pastries: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=880&q=80',

  // General
  specials: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=880&q=80',
  appetizers: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=880&q=80',
  mains: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=880&q=80',
  sides: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=880&q=80',
};
/**
 * Heuristic: infer a category keyword from an item's name.
 * This lets us pick a relevant placeholder image even when the
 * item's category is a UUID (common with DB-backed categories).
 */
const nameKeywordMap: Record<string, string> = {
  // Pizzas
  pizza: 'pizza', margherita: 'pizza', pepperoni: 'pizza', quattro: 'pizza',
  // Pasta
  pasta: 'pasta', spaghetti: 'pasta', carbonara: 'pasta', bolognese: 'pasta', lasagna: 'pasta', fettuccine: 'pasta', penne: 'pasta', ravioli: 'pasta',
  // Burgers & Sandwiches
  burger: 'burger', cheeseburger: 'burger', hamburger: 'burger', sandwich: 'sandwich', panini: 'sandwich', club: 'sandwich',
  // Salads & Bowls
  salad: 'salad', caesar: 'salad', greek: 'salad', bowl: 'bowl', 'rice bowl': 'rice bowl', poke: 'bowl',
  // Soups
  soup: 'soup', ramen: 'soup', pho: 'soup', chowder: 'soup',
  // Breakfast & Brunch
  breakfast: 'breakfast', brunch: 'brunch', omelette: 'breakfast', pancake: 'breakfast', waffles: 'breakfast',
  // Desserts
  dessert: 'dessert', desserts: 'desserts', tiramisu: 'desserts', cake: 'desserts', brownie: 'desserts', cheesecake: 'desserts', gelato: 'desserts',
  // Beverages
  coffee: 'coffee', latte: 'coffee', cappuccino: 'coffee', espresso: 'coffee',
  tea: 'tea', matcha: 'tea', chai: 'tea',
  smoothie: 'smoothie', milkshake: 'smoothie', shake: 'smoothie',
  cocktail: 'cocktail', cocktails: 'cocktails', mojito: 'cocktails', margarita: 'cocktails', spritz: 'cocktails',
  wine: 'wine', beer: 'beer',
  // Generics
  appetizers: 'appetizers', starter: 'appetizers', fries: 'sides', side: 'sides', mains: 'mains', special: 'specials'
};

const inferCategoryFromName = (name: string): string | null => {
  if (!name) return null;
  const lower = name.toLowerCase();
  for (const [keyword, mapped] of Object.entries(nameKeywordMap)) {
    if (lower.includes(keyword)) {
      return mapped;
    }
  }
  return null;
};

/**
 * Get fallback image URL based on category
 */
const getCategoryFallbackImage = (category: string): string => {
  const normalizedCategory = category.toLowerCase().trim();
  return (
    categoryImageMap[normalizedCategory] ||
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=880&q=80' // Generic food
  );
};

/**
 * Build Cloudinary URL with transformations
 */
const buildCloudinaryUrl = (url: string, size: ImageSize): string => {
  // Check if it's already a Cloudinary URL
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const { width, height } = imageSizeMap[size];

  // Add Cloudinary transformations
  // Example: https://res.cloudinary.com/demo/image/upload/w_400,h_300,c_fill,q_auto,f_auto/sample.jpg
  const transformations = `w_${width},h_${height},c_fill,q_auto,f_auto`;

  // Insert transformations before the image path
  return url.replace('/upload/', `/upload/${transformations}/`);
};

/**
 * Build Unsplash URL with size parameters
 */
const buildUnsplashUrl = (url: string, size: ImageSize): string => {
  if (!url.includes('unsplash.com')) {
    return url;
  }

  const { width, height } = imageSizeMap[size];

  // Update or add Unsplash parameters
  const urlObj = new URL(url);
  urlObj.searchParams.set('w', width.toString());
  urlObj.searchParams.set('h', height.toString());
  urlObj.searchParams.set('fit', 'crop');
  urlObj.searchParams.set('q', '80');

  return urlObj.toString();
};

/**
 * Get optimized image URL for a menu item
 * Priority: item.image_url → category fallback → generic fallback
 */
export const getMenuItemImage = (
  item: MenuItem,
  size: ImageSize = 'card'
): string => {
  let imageUrl: string | null = null;

  // 1) Use the item's own image when present
  if (item.image_url) {
    imageUrl = item.image_url;
  }

  // 2) Try a category-based fallback (works when category is a readable slug)
  if (!imageUrl && item.category) {
    const normalizedCategory = item.category.toLowerCase().trim();
    if (categoryImageMap[normalizedCategory]) {
      imageUrl = categoryImageMap[normalizedCategory];
    }
  }

  // 3) Heuristic: infer category from the item name (handles UUID category IDs)
  if (!imageUrl) {
    const inferred = inferCategoryFromName(item.name);
    if (inferred && categoryImageMap[inferred]) {
      imageUrl = categoryImageMap[inferred];
    }
  }

  // 4) Final generic fallback
  if (!imageUrl) {
    imageUrl = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=880&q=80';
  }

  // Apply appropriate transformations based on source
  if (imageUrl.includes('cloudinary.com')) {
    return buildCloudinaryUrl(imageUrl, size);
  } else if (imageUrl.includes('unsplash.com')) {
    return buildUnsplashUrl(imageUrl, size);
  }

  return imageUrl;
};

/**
 * Preload an image for better UX
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Get multiple images for different sizes (for srcset)
 */
export const getMenuItemImageSet = (item: MenuItem) => {
  return {
    thumbnail: getMenuItemImage(item, 'thumbnail'),
    card: getMenuItemImage(item, 'card'),
    detail: getMenuItemImage(item, 'detail'),
    hero: getMenuItemImage(item, 'hero'),
  };
};
