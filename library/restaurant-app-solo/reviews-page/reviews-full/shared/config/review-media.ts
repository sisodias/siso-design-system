const authorImageMap: Record<string, string[]> = {
  'pitachan': [
    '/images/tenants/draco/reviews/review-1/photo-1.jpg',
    '/images/tenants/draco/reviews/review-1/photo-2.jpg',
  ],
  'dara mischella': [
    '/images/tenants/draco/reviews/review-2/photo-1.jpg',
    '/images/tenants/draco/reviews/review-2/photo-2.jpg',
  ],
  'danny kwan': ['/images/tenants/draco/reviews/review-3/photo-1.jpg'],
  'zsolt zsemba': ['/images/tenants/draco/reviews/review-4/photo-1.jpg'],
  'natasha saleh': [
    '/images/tenants/draco/reviews/review-5/photo-1.jpg',
  ],
};

const defaultImagePool = [
  '/images/tenants/draco/gallery/dracogallery.png',
  '/images/tenants/draco/gallery/dracogallery2.png',
  '/images/tenants/draco/gallery/dracogallery3.png',
  '/images/tenants/draco/gallery/dracogallery4.png',
  '/images/tenants/draco/gallery/dracogallery5.png',
  '/images/tenants/draco/gallery/dracogallery6.png',
  '/images/tenants/draco/gallery/dracogallery7.png',
  '/images/tenants/draco/gallery/dracogallery8.png',
  '/images/tenants/draco/gallery/dracogallery9.png',
  '/images/tenants/draco/gallery/dracogallery10.png',
  '/images/tenants/draco/gallery/dracogallery11.png',
  '/images/tenants/draco/gallery/dracogallery12.png',
  '/images/tenants/draco/gallery/dracogallery13.png',
  '/images/tenants/draco/gallery/dracogallery14.png',
] as const;

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? '';

export function getFallbackReviewImages(authorName?: string | null): string[] {
  const author = normalize(authorName);
  return authorImageMap[author] ?? [];
}

export function mergeReviewImages(current: string[], fallback: string[]): string[] {
  if (fallback.length === 0) {
    return current;
  }

  const merged: string[] = [...current];
  fallback.forEach((path) => {
    if (path && !merged.includes(path)) {
      merged.push(path);
    }
  });

  return merged;
}

function getDefaultReviewImages(seed: string, count: number): string[] {
  if (defaultImagePool.length === 0 || count <= 0) {
    return [];
  }

  const safeSeed = seed && seed.length > 0 ? seed : 'default';
  const charSum = Array.from(safeSeed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const startIndex = charSum % defaultImagePool.length;
  const images: string[] = [];

  for (let offset = 0; offset < count; offset += 1) {
    const index = (startIndex + offset) % defaultImagePool.length;
    const candidate = defaultImagePool[index];
    if (!images.includes(candidate)) {
      images.push(candidate);
    }
  }

  return images;
}

type ResolveReviewImagesInput = {
  id: string;
  authorName?: string | null;
  images: string[];
  expectsPhotos: boolean;
  expectedCount?: number;
};

export function resolveReviewImages({
  id,
  authorName,
  images,
  expectsPhotos,
  expectedCount,
}: ResolveReviewImagesInput): string[] {
  const authorFallback = getFallbackReviewImages(authorName);
  let resolved = mergeReviewImages(images, authorFallback);

  if (!expectsPhotos) {
    return resolved;
  }

  const requiredCount = Math.max(expectedCount ?? 3, resolved.length > 0 ? resolved.length : 3);
  if (resolved.length >= requiredCount) {
    return resolved;
  }

  const defaultFallback = getDefaultReviewImages(id, requiredCount);
  resolved = mergeReviewImages(resolved, defaultFallback);

  return resolved.slice(0, requiredCount);
}
