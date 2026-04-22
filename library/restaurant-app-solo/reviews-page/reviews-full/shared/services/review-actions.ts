'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const DRACO_RESTAURANT_ID = '00000000-0000-0000-0000-000000000003';

type Filters = {
  rating?: string;
  source?: string;
  feature?: string;
  sort?: string;
};

export async function getReviewsWithFilters(filters: Filters) {
  const supabase = await createClient();

  let query = supabase
    .from('review')
    .select('*')
    .eq('restaurant_id', DRACO_RESTAURANT_ID)
    .eq('status', 'published');

  if (filters.rating && filters.rating !== 'all') {
    query = query.eq('rating', parseInt(filters.rating));
  }

  if (filters.source && filters.source !== 'all') {
    const sourceMap: Record<string, string> = {
      google: 'Google Maps',
      website: 'website',
    };
    query = query.eq('source', sourceMap[filters.source]);
  }

  if (filters.feature && filters.feature !== 'all') {
    switch (filters.feature) {
      case 'featured':
        query = query.eq('featured', true);
        break;
      case 'photos':
        query = query.not('images', 'eq', '[]');
        break;
      case 'response':
        query = query.not('owner_response', 'is', null);
        break;
      default:
        break;
    }
  }

  switch (filters.sort) {
    case 'oldest':
      query = query.order('published_at', { ascending: true });
      break;
    case 'highest':
      query = query.order('rating', { ascending: false });
      break;
    case 'helpful':
      query = query.order('helpful_count', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('published_at', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    console.error('[reviews] getReviewsWithFilters failed', error);
    return [];
  }

  return (data ?? []).map((review) => ({
    ...review,
    images: Array.isArray(review.images) ? review.images : [],
  }));
}

export async function getRatingStats() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_restaurant_rating', {
    restaurant_uuid: DRACO_RESTAURANT_ID,
  });

  if (error) {
    console.error('[reviews] getRatingStats failed', error);
    return {
      average: 0,
      total: 0,
      breakdown: {
        '5_stars': 0,
        '4_stars': 0,
        '3_stars': 0,
        '2_stars': 0,
        '1_star': 0,
      },
    };
  }

  return data;
}

export async function getRatingBreakdown() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('review')
    .select('rating')
    .eq('restaurant_id', DRACO_RESTAURANT_ID)
    .eq('status', 'published');

  if (error || !data) {
    return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  }

  const breakdown = data.reduce<Record<number, number>>((acc, review) => {
    const rating = review.rating;
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  return {
    1: breakdown[1] || 0,
    2: breakdown[2] || 0,
    3: breakdown[3] || 0,
    4: breakdown[4] || 0,
    5: breakdown[5] || 0,
  };
}

export async function getFeaturedTags() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('review')
    .select('metadata')
    .eq('restaurant_id', DRACO_RESTAURANT_ID)
    .eq('status', 'published')
    .not('metadata', 'is', null);

  if (error || !data) {
    return [];
  }

  const tags = new Set<string>();
  data.forEach((review) => {
    const metadata = review.metadata as { tags?: string[]; highlights?: string[] };
    metadata?.tags?.forEach((tag) => tags.add(tag));
    metadata?.highlights?.forEach((highlight) => tags.add(highlight));
  });

  return Array.from(tags).slice(0, 6);
}

export async function submitReview(data: { rating: number; comment: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to submit a review');
  }

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous';

  const { error } = await supabase.from('review').insert({
    restaurant_id: DRACO_RESTAURANT_ID,
    author_name: userName,
    rating: data.rating,
    comment: data.comment,
    status: 'pending',
    source: 'website',
    verified: false,
    featured: false,
    images: [],
    helpful_count: 0,
  });

  if (error) {
    console.error('[reviews] submitReview failed', error);
    throw new Error('Failed to submit review');
  }

  revalidatePath('/reviews');
}

export async function incrementHelpfulCount(reviewId: string) {
  const supabase = await createClient();

  const { error } = await supabase.rpc('increment', {
    row_id: reviewId,
    x: 1,
  });

  if (error) {
    const { data: review } = await supabase
      .from('review')
      .select('helpful_count')
      .eq('id', reviewId)
      .single();

    if (review) {
      await supabase
        .from('review')
        .update({ helpful_count: (review.helpful_count || 0) + 1 })
        .eq('id', reviewId);
    }
  }

  revalidatePath('/reviews');
}
