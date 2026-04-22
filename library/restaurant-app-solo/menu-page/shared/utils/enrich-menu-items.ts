/**
 * Enrichment utilities for Menu Items
 * - Infer allergens from name/ingredients when missing
 * - Derive popularity score when missing/zero
 */

import type { MenuItem } from "../types/menu.types";

const allergenKeywords: Record<string, string> = {
  // Nuts
  peanut: "nuts",
  peanuts: "nuts",
  almond: "nuts",
  almonds: "nuts",
  walnut: "nuts",
  walnuts: "nuts",
  cashew: "nuts",
  cashews: "nuts",
  pistachio: "nuts",
  hazelnut: "nuts",
  hazelnuts: "nuts",
  nut: "nuts",
  nuts: "nuts",

  // Dairy
  milk: "dairy",
  cheese: "dairy",
  mozzarella: "dairy",
  parmesan: "dairy",
  burrata: "dairy",
  butter: "dairy",
  cream: "dairy",
  mascarpone: "dairy",
  yogurt: "dairy",

  // Eggs
  egg: "eggs",
  eggs: "eggs",
  mayo: "eggs",
  mayonnaise: "eggs",
  carbonara: "eggs",

  // Gluten (wheat)
  wheat: "gluten",
  flour: "gluten",
  bread: "gluten",
  bun: "gluten",
  pizza: "gluten",
  pasta: "gluten",
  spaghetti: "gluten",
  lasagna: "gluten",
  fettuccine: "gluten",
  penne: "gluten",

  // Soy
  soy: "soy",
  "soy sauce": "soy",
  tofu: "soy",
  edamame: "soy",

  // Fish & shellfish
  fish: "fish",
  salmon: "fish",
  tuna: "fish",
  anchovy: "fish",
  anchovies: "fish",
  "sea bass": "fish",
  shrimp: "shellfish",
  prawns: "shellfish",
  prawn: "shellfish",
  crab: "shellfish",
  lobster: "shellfish",
  clam: "shellfish",
  clams: "shellfish",
  oyster: "shellfish",
  oysters: "shellfish",
  mussel: "shellfish",
  mussels: "shellfish",

  // Seeds & others
  sesame: "sesame",
  tahini: "sesame",
  mustard: "mustard",
};

const inferAllergens = (name: string, ingredients?: string | null): string[] => {
  const text = `${name} ${ingredients || ""}`.toLowerCase();
  const found = new Set<string>();
  for (const [kw, allergen] of Object.entries(allergenKeywords)) {
    if (text.includes(kw)) found.add(allergen);
  }
  // Heuristics by dish type
  if (/tiramisu|gelato|cheesecake/.test(text)) {
    found.add("dairy");
    found.add("eggs");
    if (!/gluten-free/.test(text)) found.add("gluten");
  }
  if (/risotto/.test(text)) {
    found.add("dairy");
  }
  return Array.from(found);
};

const inferPopularity = (name: string, base?: number | null): number => {
  let score = typeof base === "number" && base > 0 ? base : 70;
  const lower = name.toLowerCase();
  if (/(signature|special|spesial|best|chef|classic)/.test(lower)) score += 15;
  if (/(spicy|hot)/.test(lower)) score += 3;
  if (/(salad|soup)/.test(lower)) score -= 5;
  if (/(pizza|pasta|burger|steak)/.test(lower)) score += 5;
  // clamp
  score = Math.max(40, Math.min(99, score));
  return score;
};

export const enrichMenuItem = (item: MenuItem): MenuItem => {
  const existingAllergens = Array.isArray(item.allergens) ? item.allergens : [];
  const inferredAllergens = inferAllergens(item.name, item.ingredients || null);
  const allergens = Array.from(new Set([...
    existingAllergens,
    ...inferredAllergens,
  ])).filter(Boolean);

  const popular_score = inferPopularity(item.name, item.popular_score);

  // Spice level: derive from flags + keywords
  const spiceKeywords: Record<string, number> = {
    sambal: 2,
    balado: 2,
    pedas: 2,
    chilli: 1,
    chili: 1,
    'bird eye': 2,
    cayenne: 2,
    hot: 1,
    spicy: 1,
    mala: 3,
    rendang: 1,
    curry: 1,
  };
  const txt = `${item.name} ${item.description ?? ''} ${item.ingredients ?? ''}`.toLowerCase();
  let spice_level = item.is_spicy ? 2 : 0;
  for (const [kw, val] of Object.entries(spiceKeywords)) {
    if (txt.includes(kw)) spice_level = Math.max(spice_level, Math.min(3, val));
  }
  if (spice_level > 0 && txt.includes('extra')) spice_level = Math.min(3, spice_level + 1);

  // New/seasonal
  let is_new = false;
  const now = new Date();
  if (item.created_at) {
    const d = new Date(item.created_at);
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    is_new = diffDays <= 30;
  }

  const is_seasonal = item.is_seasonal ?? /seasonal|mango|durian|ramadan|christmas|summer|winter/.test(txt);

  // Pairings (very simple heuristic)
  const pairings: string[] = [];
  if (spice_level >= 2) pairings.push('Iced tea');
  if (/sea ?bass|salmon|tuna|prawn|shrimp|crab|lobster|fish/.test(txt)) pairings.push('Citrus soda');
  if (/pasta|pizza/.test(txt)) pairings.push('Garlic bread');
  if (pairings.length === 0) pairings.push('Sparkling water');

  // Chef tip (simple)
  let chef_tip: string | null = null;
  if (/lime|lemon|citrus/.test(txt)) chef_tip = 'Add a squeeze of citrus for brightness.';
  else if (/sambal|chili|chilli/.test(txt)) chef_tip = 'Ask for extra sambal if you like heat.';
  else if (/cheese|parmesan|mozzarella/.test(txt)) chef_tip = 'Finish with a touch of grated cheese.';

  return {
    ...item,
    allergens: allergens.length > 0 ? allergens : item.allergens || null,
    spice_level: (spice_level as 0|1|2|3),
    is_new,
    is_seasonal,
    pairings,
    chef_tip: item.chef_tip ?? chef_tip,
    popular_score,
  };
};

export const enrichMenuItems = (items: MenuItem[]): MenuItem[] => {
  const enriched = items.map(enrichMenuItem);

  // Boost top items per category so each category surfaces clear best-sellers
  const byCategory = new Map<string, MenuItem[]>();
  for (const it of enriched) {
    const key = it.category || "__uncategorized__";
    const arr = byCategory.get(key) || [];
    arr.push(it);
    byCategory.set(key, arr);
  }
  for (const [, arr] of byCategory) {
    arr.sort((a, b) => (b.popular_score ?? 0) - (a.popular_score ?? 0));
    if (arr[0]) arr[0].popular_score = Math.max(arr[0].popular_score ?? 0, 92);
    if (arr[1]) arr[1].popular_score = Math.max(arr[1].popular_score ?? 0, 86);
  }
  return enriched;
};
