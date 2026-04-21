import { cache } from 'react';

import { formatIDR } from '@/lib/utils/currency';
import { withTenantSupabase } from '@/lib/supabase/withTenantSupabase';

export interface MenuItem {
  id: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: number;
  priceFormatted: string;
  imageUrl: string | null;
  active: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  position: number;
  items: MenuItem[];
}

export interface MenuData {
  categories: MenuCategory[];
}

export const getMenu = cache(async (): Promise<MenuData> => {
  return withTenantSupabase(async (client, context) => {
    const { data: categoriesData, error: categoriesError } = await client
      .from('category')
      .select('id, name, slug, position, visible')
      .eq('restaurant_id', context.restaurantId)
      .order('position', { ascending: true });

    if (categoriesError) {
      throw categoriesError;
    }

    const categories = (categoriesData ?? []).filter((cat) => cat.visible !== false);

    const { data: itemsData, error: itemsError } = await client
      .from('item')
      .select('id, category_id, name, description, price, active, image_url')
      .eq('restaurant_id', context.restaurantId)
      .order('name', { ascending: true });

    if (itemsError) {
      throw itemsError;
    }

    const items = (itemsData ?? []).filter((item) => item.active !== false);

    const categoryMap = new Map(
      categories.map((category) => [category.id as string, { ...category, items: [] as MenuItem[] }]),
    );

    items.forEach((item) => {
      const categoryId = item.category_id as string | null;
      const menuItem: MenuItem = {
        id: item.id as string,
        categoryId,
        name: item.name ?? 'Unnamed item',
        description: item.description ?? null,
        price: item.price ?? 0,
        priceFormatted: formatIDR(item.price ?? 0),
        imageUrl: item.image_url ?? null,
        active: item.active !== false,
      };

      if (categoryId && categoryMap.has(categoryId)) {
        categoryMap.get(categoryId)!.items.push(menuItem);
      }
    });

    const orderedCategories: MenuCategory[] = Array.from(categoryMap.values()).map((category) => ({
      id: category.id as string,
      name: category.name ?? 'Untitled category',
      slug: category.slug ?? category.id,
      position: category.position ?? 0,
      items: category.items,
    }));

    return {
      categories: orderedCategories,
    } satisfies MenuData;
  });
});

export async function createCategory(payload: { name: string }) {
  if (!payload.name.trim()) {
    throw new Error('Category name is required');
  }

  await withTenantSupabase(async (client, context) => {
    const { error } = await client.from('category').insert({
      restaurant_id: context.restaurantId,
      name: payload.name,
      slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      position: 0,
    });
    if (error) throw error;
  });
}

export async function createMenuItem(payload: {
  categoryId: string;
  name: string;
  price: number;
  description?: string;
}) {
  if (!payload.name.trim()) {
    throw new Error('Item name is required');
  }

  await withTenantSupabase(async (client, context) => {
    const { error } = await client.from('item').insert({
      restaurant_id: context.restaurantId,
      category_id: payload.categoryId,
      name: payload.name,
      slug: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: payload.price,
      description: payload.description ?? null,
      active: true,
    });
    if (error) throw error;
  });
}

export async function updateMenuItem(payload: {
  id: string;
  categoryId?: string | null;
  name?: string;
  price?: number;
  description?: string | null;
  active?: boolean;
}) {
  await withTenantSupabase(async (client, context) => {
    const updates: Record<string, unknown> = {};
    if (payload.categoryId !== undefined) updates.category_id = payload.categoryId || null;
    if (payload.name) {
      updates.name = payload.name;
      updates.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (payload.price != null) updates.price = payload.price;
    if (payload.description !== undefined) updates.description = payload.description;
    if (payload.active !== undefined) updates.active = payload.active;

    if (Object.keys(updates).length === 0) return;

    const { error } = await client
      .from('item')
      .update(updates)
      .eq('id', payload.id)
      .eq('restaurant_id', context.restaurantId);
    if (error) throw error;
  });
}

export async function deleteMenuItem(id: string) {
  await withTenantSupabase(async (client, context) => {
    const { error } = await client
      .from('item')
      .delete()
      .eq('id', id)
      .eq('restaurant_id', context.restaurantId);
    if (error) throw error;
  });
}
