/**
 * MenuSkeleton - Loading State Component
 *
 * Displays a skeleton UI while menu data is loading.
 * Provides visual feedback and perceived performance improvement.
 */

export default function MenuSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>

      {/* Category Tabs Skeleton */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-full w-24 flex-shrink-0"></div>
        ))}
      </div>

      {/* Menu Items Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Image Skeleton */}
            <div className="h-48 bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>

              {/* Price and Tags */}
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Text */}
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">Loading menu...</p>
      </div>
    </div>
  );
}
