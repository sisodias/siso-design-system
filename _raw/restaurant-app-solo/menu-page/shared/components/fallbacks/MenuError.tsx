/**
 * MenuError - Inline Error State Component
 *
 * Displays when menu fails to load but we want to show an inline error
 * instead of throwing to error boundary. Provides retry functionality.
 */

import Link from 'next/link';

interface MenuErrorProps {
  error?: Error;
  onRetry?: () => void;
  message?: string;
}

export default function MenuError({ error, onRetry, message }: MenuErrorProps) {
  const errorMessage = message || error?.message || 'Failed to load menu';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg border border-red-200 p-8">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
          Unable to Load Menu
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          {errorMessage}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          )}
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
          >
            Return to Home
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-xs text-gray-500 text-center">
          If this problem persists, please contact us or try again later.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium">
              Error Details (Development Only)
            </summary>
            <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
              <pre className="text-xs text-gray-600 overflow-auto whitespace-pre-wrap break-words">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
