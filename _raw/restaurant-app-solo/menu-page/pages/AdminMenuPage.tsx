import { revalidatePath } from 'next/cache';

import { SolidButton } from '@siso/ui';

import {
  createCategory,
  createMenuItem,
  deleteMenuItem,
  getMenu,
  updateMenuItem,
} from '@/domains/customer-facing/menu/shared/services';
import { getTenantFromRequest } from '@/domains/shared/hooks/useTenantServer';
import { AdminPageHeader } from '@/domains/shared/components/admin/AdminPageHeader';
import { AdminCard } from '@/domains/shared/components/admin/AdminCard';
import { AdminEmptyState } from '@/domains/shared/components/admin/AdminEmptyState';
import { FormField } from '@/domains/shared/components/admin/FormField';

async function createCategoryAction(formData: FormData) {
  'use server';

  await createCategory({ name: String(formData.get('name') ?? '').trim() });
  revalidatePath('/admin/menu');
}

async function createItemAction(formData: FormData) {
  'use server';

  const categoryId = String(formData.get('categoryId') ?? '');
  const name = String(formData.get('name') ?? '');
  const price = Number(formData.get('price') ?? 0);
  const description = String(formData.get('description') ?? '').trim() || undefined;

  await createMenuItem({ categoryId, name, price, description });
  revalidatePath('/admin/menu');
}

async function updateItemAction(formData: FormData) {
  'use server';

  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const categoryId = String(formData.get('categoryId') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const price = Number(formData.get('price') ?? NaN);
  const descriptionRaw = String(formData.get('description') ?? '').trim();
  const active = formData.get('active') === 'on';

  if (!name) {
    throw new Error('Item name is required');
  }
  if (Number.isNaN(price)) {
    throw new Error('Item price is required');
  }

  await updateMenuItem({
    id,
    categoryId: categoryId ? categoryId : null,
    name,
    price,
    description: descriptionRaw || null,
    active,
  });
  revalidatePath('/admin/menu');
}

async function deleteItemAction(formData: FormData) {
  'use server';

  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await deleteMenuItem(id);
  revalidatePath('/admin/menu');
}

export default async function AdminMenuPage() {
  const tenant = await getTenantFromRequest();
  const menu = await getMenu();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Menu items"
        subtitle={`Manage the categories and dishes for ${tenant.displayName}.`}
      />
      <AdminCard>
        <form action={createCategoryAction} className="flex flex-wrap items-end gap-3">
          <FormField label="New category">
            <input
              name="name"
              required
              placeholder="e.g., Appetizers"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </FormField>
          <SolidButton type="submit" size="sm">
            Add category
          </SolidButton>
        </form>
      </AdminCard>
      <div className="space-y-4">
        {menu.categories.length === 0 ? (
          <AdminEmptyState title="No menu data yet" description="Start by importing seed data or adding a category." />
        ) : (
          menu.categories.map((category) => (
            <section key={category.id} className="rounded-xl border border-border bg-background p-5 shadow-sm">
              <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{category.name}</h2>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Slug: {category.slug}</p>
                </div>
                <form action={createItemAction} className="flex flex-wrap items-end gap-2 text-xs">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <FormField label="Name">
                    <input
                      name="name"
                      required
                      className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                    />
                  </FormField>
                  <FormField label="Price (IDR)">
                    <input
                      name="price"
                      type="number"
                      min={0}
                      required
                      className="w-24 rounded-md border border-input bg-background px-2 py-1 text-sm"
                    />
                  </FormField>
                  <FormField label="Description">
                    <input
                      name="description"
                      className="w-40 rounded-md border border-input bg-background px-2 py-1 text-sm"
                    />
                  </FormField>
                  <SolidButton type="submit" size="sm" variant="secondary">
                    Add item
                  </SolidButton>
                </form>
              </header>
              {category.items.length === 0 ? (
                <p className="rounded-md border border-dashed border-border px-4 py-4 text-sm text-muted-foreground">
                  No items yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <article
                      key={item.id}
                      className="space-y-3 rounded-lg border border-border/80 bg-background p-4 shadow-sm"
                    >
                      <form action={updateItemAction} className="grid gap-3 sm:grid-cols-5">
                        <input type="hidden" name="id" value={item.id} />
                        <label className="flex flex-col text-xs sm:col-span-2">
                          <span className="mb-1 font-semibold text-muted-foreground">Name</span>
                          <input
                            name="name"
                            required
                            defaultValue={item.name}
                            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                          />
                        </label>
                        <label className="flex flex-col text-xs sm:col-span-1">
                          <span className="mb-1 font-semibold text-muted-foreground">Category</span>
                          <select
                            name="categoryId"
                            defaultValue={item.categoryId ?? ''}
                            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                          >
                            <option value="">Uncategorised</option>
                            {menu.categories.map((catOption) => (
                              <option key={catOption.id} value={catOption.id}>
                                {catOption.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="flex flex-col text-xs sm:col-span-1">
                          <span className="mb-1 font-semibold text-muted-foreground">Price (IDR)</span>
                          <input
                            name="price"
                            type="number"
                            min={0}
                            step="500"
                            required
                            defaultValue={item.price}
                            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                          />
                        </label>
                        <label className="flex flex-col text-xs sm:col-span-3">
                          <span className="mb-1 font-semibold text-muted-foreground">Description</span>
                          <textarea
                            name="description"
                            rows={2}
                            defaultValue={item.description ?? ''}
                            className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                          />
                        </label>
                        <label className="flex items-center gap-2 text-xs sm:col-span-1 sm:items-end">
                          <input
                            name="active"
                            type="checkbox"
                            defaultChecked={item.active}
                            className="h-4 w-4"
                          />
                          <span className="font-semibold text-muted-foreground">Active</span>
                        </label>
                        <div className="sm:col-span-5 flex justify-end">
                          <SolidButton type="submit" size="sm" variant="secondary">
                            Save changes
                          </SolidButton>
                        </div>
                      </form>
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span>Current price: {item.priceFormatted}</span>
                        <form action={deleteItemAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <SolidButton type="submit" size="sm" variant="danger">
                            Delete
                          </SolidButton>
                        </form>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))
        )}
      </div>
    </div>
  );
}
