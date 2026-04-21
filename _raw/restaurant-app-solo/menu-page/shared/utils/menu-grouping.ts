import type { MenuCategory, MenuItem } from '@/domains/customer-facing/menu/shared/types';

type GroupDefinition = {
  key: string;
  label: string;
  slug: string;
  patterns: RegExp[];
};

export type GroupedMenuSection = {
  key: string;
  label: string;
  slug: string;
  categories: MenuCategory[];
  items: MenuItem[];
};

const GROUP_DEFINITIONS: GroupDefinition[] = [
  { key: 'breakfast', label: 'Breakfast', slug: 'breakfast', patterns: [/breakfast/i, /brunch/i, /morning/i] },
  { key: 'starters', label: 'Starters', slug: 'starters', patterns: [/starter/i, /appet/i, /snack/i, /small plate/i, /bite/i] },
  { key: 'mains', label: 'Main Meals', slug: 'mains', patterns: [/main/i, /entree/i, /pasta/i, /pizza/i, /burger/i, /rice/i, /nasi/i, /noodle/i, /grill/i, /steak/i] },
  { key: 'sides', label: 'Sides', slug: 'sides', patterns: [/side/i, /salad/i, /soup/i, /fries/i, /share/i, /snack/i] },
  { key: 'dessert', label: 'Dessert', slug: 'dessert', patterns: [/dessert/i, /sweet/i, /cake/i, /pastry/i, /bake/i, /ice cream/i] },
  { key: 'coffee', label: 'Coffee & Tea', slug: 'coffee-tea', patterns: [/coffee/i, /espresso/i, /latte/i, /cappuccino/i, /tea/i, /matcha/i] },
  { key: 'juices', label: 'Juices & Soft Drinks', slug: 'juices-soft-drinks', patterns: [/juice/i, /smoothie/i, /shake/i, /soda/i, /mocktail/i, /lemonade/i, /cold brew/i] },
  { key: 'alcohol', label: 'Alcoholic Drinks', slug: 'alcoholic-drinks', patterns: [/alcohol/i, /cocktail/i, /wine/i, /beer/i, /spirit/i, /liquor/i] },
];

const DEFAULT_GROUP: GroupDefinition = {
  key: 'other',
  label: 'More to Explore',
  slug: 'more-to-explore',
  patterns: [],
};

export function resolveGroupForCategory(name: string): GroupDefinition {
  const match = GROUP_DEFINITIONS.find((definition) =>
    definition.patterns.some((pattern) => pattern.test(name)),
  );

  if (match) {
    return match;
  }

  return DEFAULT_GROUP;
}

export function groupMenuSections(
  categories: MenuCategory[],
  itemsByCategory: Record<string, MenuItem[]>,
): GroupedMenuSection[] {
  type GroupAccumulator = {
    definition: GroupDefinition;
    categories: MenuCategory[];
    items: MenuItem[];
  };

  const accumulators = new Map<string, GroupAccumulator>();

  categories.forEach((category) => {
    const categoryItems = itemsByCategory[category.id] ?? [];

    if (categoryItems.length === 0) {
      return;
    }

    const definition = resolveGroupForCategory(category.name ?? '');

    if (!accumulators.has(definition.key)) {
      accumulators.set(definition.key, {
        definition,
        categories: [],
        items: [],
      });
    }

    const entry = accumulators.get(definition.key)!;
    entry.categories.push(category);
    entry.items.push(...categoryItems);
  });

  const orderedKeys = [...GROUP_DEFINITIONS.map((definition) => definition.key), DEFAULT_GROUP.key];

  return orderedKeys
    .map((key) => accumulators.get(key))
    .filter((value): value is GroupAccumulator => Boolean(value))
    .map(({ definition, categories: groupedCategories, items }) => ({
      key: definition.key,
      label: definition.label,
      slug: definition.slug,
      categories: groupedCategories,
      items,
    }));
}

export function listGroupDefinitions(): GroupDefinition[] {
  return [...GROUP_DEFINITIONS, DEFAULT_GROUP];
}
