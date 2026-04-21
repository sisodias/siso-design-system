/**
 * MenuEmpty - Empty State Component
 *
 * Displays when no menu items are available.
 * Provides helpful messaging and call-to-action.
 */

import Link from 'next/link';

interface MenuEmptyProps {
  title?: string;
  message?: string;
  showAction?: boolean;
}

export default function MenuEmpty({
  title = 'No Menu Items Available',
  message = 'We currently don\'t have any items in this category. Please check back soon or explore other categories.',
  showAction = true,
}: MenuEmptyProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        {/* Empty State Icon */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-20 h-20 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* Empty State Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {message}
        </p>

        {/* Action Buttons */}
        {showAction && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Refresh Page
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Go to Home
            </Link>
          </div>
        )}

        {/* Additional Help Text */}
        <p className="mt-6 text-xs text-gray-500">
          Need assistance? Contact our support team.
        </p>
      </div>
    </div>
  );
}
