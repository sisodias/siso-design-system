/**
 * Static Menu Data
 *
 * Easy to customize per client - just edit this file!
 * No database needed, instant loading, version controlled.
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceFormatted: string;
  dietary?: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
    spicy?: boolean;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export const MENU_DATA: MenuCategory[] = [
  {
    id: "coffee",
    name: "Coffee",
    description: "Artisan coffee crafted from premium Indonesian beans",
    items: [
      {
        id: "espresso",
        name: "Espresso",
        description: "Rich, bold espresso shot",
        price: 25000,
        priceFormatted: "Rp 25,000",
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Espresso with steamed milk and foam",
        price: 35000,
        priceFormatted: "Rp 35,000",
      },
      {
        id: "latte",
        name: "Caffè Latte",
        description: "Smooth espresso with steamed milk",
        price: 35000,
        priceFormatted: "Rp 35,000",
      },
      {
        id: "americano",
        name: "Americano",
        description: "Espresso with hot water",
        price: 30000,
        priceFormatted: "Rp 30,000",
      },
    ],
  },
  {
    id: "pastries",
    name: "Pastries",
    description: "Freshly baked treats made daily",
    items: [
      {
        id: "croissant",
        name: "Butter Croissant",
        description: "Flaky, buttery French pastry",
        price: 35000,
        priceFormatted: "Rp 35,000",
        dietary: { vegetarian: true },
      },
      {
        id: "almond-croissant",
        name: "Almond Croissant",
        description: "Buttery croissant filled with almond cream",
        price: 45000,
        priceFormatted: "Rp 45,000",
        dietary: { vegetarian: true },
      },
      {
        id: "pain-au-chocolat",
        name: "Pain au Chocolat",
        description: "Chocolate-filled flaky pastry",
        price: 40000,
        priceFormatted: "Rp 40,000",
        dietary: { vegetarian: true },
      },
    ],
  },
  {
    id: "breakfast",
    name: "Breakfast",
    description: "Start your day right",
    items: [
      {
        id: "avocado-toast",
        name: "Avocado Toast",
        description: "Smashed avocado on sourdough with poached eggs",
        price: 65000,
        priceFormatted: "Rp 65,000",
        dietary: { vegetarian: true },
      },
      {
        id: "pancakes",
        name: "Fluffy Pancakes",
        description: "Stack of pancakes with maple syrup and butter",
        price: 55000,
        priceFormatted: "Rp 55,000",
        dietary: { vegetarian: true },
      },
      {
        id: "eggs-benedict",
        name: "Eggs Benedict",
        description: "Poached eggs, ham, hollandaise on English muffin",
        price: 75000,
        priceFormatted: "Rp 75,000",
      },
    ],
  },
  {
    id: "lunch",
    name: "Lunch & Mains",
    description: "Satisfying meals for any time of day",
    items: [
      {
        id: "caesar-salad",
        name: "Caesar Salad",
        description: "Crisp romaine, parmesan, croutons, Caesar dressing",
        price: 55000,
        priceFormatted: "Rp 55,000",
        dietary: { vegetarian: true },
      },
      {
        id: "club-sandwich",
        name: "Club Sandwich",
        description: "Triple-decker with chicken, bacon, lettuce, tomato",
        price: 65000,
        priceFormatted: "Rp 65,000",
      },
      {
        id: "pasta-carbonara",
        name: "Pasta Carbonara",
        description: "Creamy pasta with bacon and parmesan",
        price: 75000,
        priceFormatted: "Rp 75,000",
      },
      {
        id: "grilled-salmon",
        name: "Grilled Salmon",
        description: "Fresh salmon with vegetables and lemon butter",
        price: 95000,
        priceFormatted: "Rp 95,000",
        dietary: { glutenFree: true },
      },
    ],
  },
];

// Helper function to get all items (useful for search/display)
export function getAllMenuItems(): MenuItem[] {
  return MENU_DATA.flatMap(category => category.items);
}

// Helper to get items by category
export function getItemsByCategory(categoryId: string): MenuItem[] {
  const category = MENU_DATA.find(cat => cat.id === categoryId);
  return category?.items ?? [];
}
