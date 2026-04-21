import { cache } from 'react';

import { withTenantSupabase } from '@/lib/supabase/withTenantSupabase';

export type ReviewStatus = 'pending' | 'published' | 'archived';

export interface ReviewRecord {
  id: string;
  authorName: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  publishedAt: string | null;
  createdAt: string;
}

export const listReviews = cache(async (status?: ReviewStatus): Promise<ReviewRecord[]> => {
  return withTenantSupabase(async (client, context) => {
    let query = client
      .from('review')
      .select('id, author_name, rating, comment, status, published_at, created_at')
      .eq('restaurant_id', context.restaurantId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data ?? []).map((row) => ({
      id: row.id as string,
      authorName: (row.author_name as string) ?? 'Guest',
      rating: (row.rating as number) ?? 0,
      comment: (row.comment as string | null) ?? null,
      status: (row.status as ReviewStatus) ?? 'pending',
      publishedAt: (row.published_at as string | null) ?? null,
      createdAt: (row.created_at as string) ?? '',
    }));
  });
});

export async function updateReviewStatus(payload: {
  id: string;
  status: ReviewStatus;
  publishedAt?: string | null;
}) {
  await withTenantSupabase(async (client, context) => {
    const { error } = await client
      .from('review')
      .update({
        status: payload.status,
        published_at: payload.publishedAt ?? (payload.status === 'published' ? new Date().toISOString() : null),
      })
      .eq('id', payload.id)
      .eq('restaurant_id', context.restaurantId);
    if (error) throw error;
  });
}

export async function deleteReview(id: string) {
  await withTenantSupabase(async (client, context) => {
    const { error } = await client
      .from('review')
      .delete()
      .eq('id', id)
      .eq('restaurant_id', context.restaurantId);
    if (error) throw error;
  });
}
