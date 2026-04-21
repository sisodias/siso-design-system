/**
 * Menu Domain - Constants & Fallback Data
 * Domain-Based Architecture
 */

import { MenuItem, MenuCategory } from "../types/menu.types";

// Fallback menu data to display immediately while fetching
export const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    id: "fallback1",
    name: "Truffle Risotto",
    description: "Arborio rice, seasonal wild mushrooms, shaved truffle, aged parmesan",
    price: 18.00,
    category: "mains",
    image_url: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: true,
    is_spicy: false,
    ingredients: "Arborio rice, mushrooms, truffle, parmesan",
    calories: 450,
    protein_g: 12,
    carbs_g: 58,
    sugar_g: 3,
    fat_g: 16,
    prep_time_min: 18,
    allergens: ["dairy"],
    is_halal: true,
    serving_size_g: 320,
    is_seasonal: false,
    created_at: "2025-10-01",
    pairings: ["Sparkling water", "Arugula salad"],
    chef_tip: "Finish with a drizzle of extra virgin olive oil.",
    popular_score: 85
  },
  {
    id: "fallback2",
    name: "Sea Bass Acqua Pazza",
    description: "Line-caught sea bass, cherry tomatoes, olives, capers, white wine broth",
    price: 24.00,
    category: "mains",
    image_url: "https://images.unsplash.com/photo-1579684947550-22e945225d9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: true,
    is_spicy: false,
    ingredients: "Sea bass, tomatoes, olives, capers, white wine",
    calories: 320,
    protein_g: 34,
    carbs_g: 6,
    sugar_g: 3,
    fat_g: 14,
    prep_time_min: 15,
    allergens: ["fish"],
    is_halal: true,
    serving_size_g: 280,
    is_seasonal: true,
    created_at: "2025-10-20",
    pairings: ["Lemon iced tea", "Steamed rice"],
    chef_tip: "Squeeze fresh lemon right before eating.",
    popular_score: 78
  },
  {
    id: "fallback3",
    name: "Neapolitan Pizza",
    description: "San Marzano tomatoes, buffalo mozzarella, basil, extra virgin olive oil",
    price: 16.00,
    category: "pizzas",
    image_url: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: false,
    is_spicy: false,
    ingredients: "Flour, tomatoes, mozzarella, basil, olive oil",
    calories: 780,
    protein_g: 28,
    carbs_g: 95,
    sugar_g: 9,
    fat_g: 26,
    prep_time_min: 12,
    allergens: ["gluten", "dairy"],
    serving_size_g: 350,
    is_seasonal: false,
    created_at: "2025-09-10",
    pairings: ["Garlic bread", "Cola"],
    chef_tip: "Tear basil leaves by hand to release aroma.",
    popular_score: 92
  },
  {
    id: "fallback4",
    name: "Burrata Caprese",
    description: "Fresh burrata, heirloom tomatoes, basil, aged balsamic, olive oil",
    price: 14.00,
    category: "starters",
    image_url: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: true,
    is_spicy: false,
    ingredients: "Burrata, tomatoes, basil, balsamic",
    calories: 280,
    protein_g: 12,
    carbs_g: 10,
    sugar_g: 7,
    fat_g: 20,
    prep_time_min: 8,
    allergens: ["dairy"],
    serving_size_g: 220,
    is_seasonal: false,
    created_at: "2025-08-25",
    pairings: ["Espresso", "Vanilla gelato"],
    chef_tip: "Let it sit 2 minutes before serving for best texture.",
    popular_score: 88
  },
  {
    id: "fallback5",
    name: "Spaghetti Carbonara",
    description: "Handmade spaghetti, guanciale, pecorino romano, organic eggs, black pepper",
    price: 17.00,
    category: "mains",
    image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_spicy: false,
    ingredients: "Spaghetti, guanciale, pecorino, eggs",
    calories: 650,
    protein_g: 27,
    carbs_g: 70,
    sugar_g: 4,
    fat_g: 28,
    prep_time_min: 14,
    allergens: ["eggs", "dairy", "gluten"],
    serving_size_g: 330,
    is_seasonal: false,
    created_at: "2025-09-28",
    pairings: ["Sparkling water", "Side salad"],
    chef_tip: "Stir immediately to keep it creamy.",
    popular_score: 95
  },
  {
    id: "fallback6",
    name: "Tiramisu",
    description: "Traditional Italian dessert with espresso, mascarpone, cocoa",
    price: 9.00,
    category: "desserts",
    image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: false,
    is_spicy: false,
    ingredients: "Ladyfingers, espresso, mascarpone, cocoa",
    calories: 450,
    protein_g: 7,
    carbs_g: 55,
    sugar_g: 32,
    fat_g: 20,
    prep_time_min: 5,
    allergens: ["eggs", "dairy", "gluten"],
    serving_size_g: 180,
    is_seasonal: false,
    created_at: "2025-10-10",
    pairings: ["Cappuccino", "Amaretto (non‑alc: almond syrup latte)"],
    chef_tip: "Dust with cocoa just before serving.",
    popular_score: 90
  }
];

export const FALLBACK_CATEGORIES: MenuCategory[] = [
  {
    id: "starters",
    name: "Starters",
    description: "Small plates perfect for sharing",
    display_order: 0
  },
  {
    id: "mains",
    name: "Mains",
    description: "Our signature main courses featuring seasonal ingredients",
    display_order: 1
  },
  {
    id: "pizzas",
    name: "Pizzas",
    description: "Authentic Neapolitan pizzas baked in our wood-fired oven",
    display_order: 2
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Sweet finales to complete your meal",
    display_order: 3
  }
];

// Query configuration
export const MENU_QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000,   // 10 minutes
};
