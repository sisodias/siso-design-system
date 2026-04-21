/**
 * useBlogPosts Hook (Client)
 *
 * Fetches published blog posts for public consumption
 */

import { useQuery } from '@tanstack/react-query'
import { blogQueries } from '../infrastructure/supabase'

interface UseBlogPostsOptions {
  limit?: number
  offset?: number
  category?: string
  featured?: boolean
  search?: string
  enabled?: boolean
}

export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const { limit = 12, offset = 0, category, featured, search, enabled = true } = options

  return useQuery({
    queryKey: ['blog-posts', 'public', { limit, offset, category, featured, search }],
    queryFn: async () => {
      if (featured) {
        return { posts: await blogQueries.getFeaturedPosts(limit), total: limit }
      }

      if (category) {
        return { posts: await blogQueries.getPostsByCategory(category, limit), total: limit }
      }

      if (search) {
        return { posts: await blogQueries.searchPosts(search, limit), total: limit }
      }

      return await blogQueries.getPublishedPosts(limit, offset)
    },
    enabled,
    staleTime: 60_000, // 1 minute
    gcTime: 300_000, // 5 minutes
  })
}

/**
 * useBlogPost Hook (Client)
 *
 * Fetches a single published blog post by slug
 */
export function useBlogPost(slug?: string, enabled = true) {
  return useQuery({
    queryKey: ['blog-post', 'public', slug],
    queryFn: async () => {
      if (!slug) {
        throw new Error('Slug is required')
      }
      return await blogQueries.getPostBySlug(slug)
    },
    enabled: enabled && !!slug,
    staleTime: 300_000, // 5 minutes
  })
}
