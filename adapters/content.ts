/**
 * Content Adapter Contract
 *
 * Defines the interface for content fetching across domains.
 * Works with Supabase, Convex, Contentful, Sanity, Shopify, static JSON.
 */

export interface Product {
  id: string
  slug: string
  title: string
  content: string
  [key: string]: unknown
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  publishedAt?: string
  [key: string]: unknown
}

export interface Page {
  id: string
  slug: string
  title: string
  content: string
  [key: string]: unknown
}

export interface ContentAdapter<T> {
  getBySlug(slug: string): Promise<T | null>
  list(filter?: Record<string, unknown>): Promise<T[]>
}

export interface ProductContentAdapter extends ContentAdapter<Product> {}
export interface BlogContentAdapter extends ContentAdapter<BlogPost> {}
export interface PageContentAdapter extends ContentAdapter<Page> {}

/**
 * No-op content adapter — returns null / empty array.
 */
export const noopContent: ContentAdapter<unknown> = {
  getBySlug: async () => null,
  list: async () => [],
}

export const noopProduct: ProductContentAdapter = { ...noopContent }
export const noopBlog: BlogContentAdapter = { ...noopContent }
export const noopPage: PageContentAdapter = { ...noopContent }
