/**
 * Client Blog Infrastructure Layer
 *
 * Supabase client for blog data access (public/anon access only)
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey)

// Public Supabase client (no auth required for blog reading)
// When credentials are missing, a dummy client is returned so UI can render with empty data
export const supabase = hasSupabase
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null as any

// Blog-specific queries for public access
export const blogQueries = {
  // Get published posts only
  getPublishedPosts: async (limit = 12, offset = 0) => {
    if (!hasSupabase) return { posts: [], total: 0 }
    const { data, error, count } = await supabase
      .from('blog_posts')
      .select('*, author:blog_authors(*), category:blog_categories(*)', { count: 'exact' })
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { posts: data || [], total: count || 0 }
  },

  // Get post by slug
  getPostBySlug: async (slug: string) => {
    if (!hasSupabase) return null
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*),
        tags:blog_post_tags(tag:blog_tags(*)),
        faqs:blog_post_faqs(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .is('deleted_at', null)
      .single()

    if (error) throw error
    return data
  },

  // Get featured posts
  getFeaturedPosts: async (limit = 3) => {
    if (!hasSupabase) return []
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, author:blog_authors(*), category:blog_categories(*)')
      .eq('status', 'published')
      .eq('is_featured', true)
      .is('deleted_at', null)
      .order('featured_index', { ascending: true })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Get posts by category
  getPostsByCategory: async (categorySlug: string, limit = 12) => {
    if (!hasSupabase) return []
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, author:blog_authors(*), category:blog_categories(*)')
      .eq('status', 'published')
      .eq('category.blog_categories.slug', categorySlug)
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Get categories with post counts
  getCategories: async () => {
    if (!hasSupabase) return []
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*, posts:blog_posts(count)')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get tags with usage counts
  getTags: async () => {
    if (!hasSupabase) return []
    const { data, error } = await supabase
      .from('blog_tags')
      .select('*')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('usage_count', { ascending: false })
      .limit(50)

    if (error) throw error
    return data || []
  },

  // Search posts
  searchPosts: async (query: string, limit = 12) => {
    if (!hasSupabase) return []
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*, author:blog_authors(*), category:blog_categories(*)')
      .eq('status', 'published')
      .is('deleted_at', null)
      .or(`title.ilike.%${query}%,subtitle.ilike.%${query}%,excerpt.ilike.%${query}%,primary_keyword.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },
} as const
