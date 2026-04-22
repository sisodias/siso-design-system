/**
 * useBlogCategories and useBlogTags Hooks (Client)
 *
 * Fetches blog categories and tags for public consumption
 */

import { useQuery } from '@tanstack/react-query'
import { blogQueries } from '../infrastructure/supabase'

export function useBlogCategories(enabled = true) {
  return useQuery({
    queryKey: ['blog-categories', 'public'],
    queryFn: blogQueries.getCategories,
    enabled,
    staleTime: 300_000, // 5 minutes
    gcTime: 600_000, // 10 minutes
  })
}

export function useBlogTags(enabled = true) {
  return useQuery({
    queryKey: ['blog-tags', 'public'],
    queryFn: blogQueries.getTags,
    enabled,
    staleTime: 300_000, // 5 minutes
    gcTime: 600_000, // 10 minutes
  })
}

/**
 * useBlogSearch Hook
 *
 * Search blog posts by query string
 */
export function useBlogSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ['blog-search', query],
    queryFn: () => blogQueries.searchPosts(query),
    enabled: enabled && query.length > 2,
    staleTime: 60_000, // 1 minute
    gcTime: 300_000, // 5 minutes
  })
}
