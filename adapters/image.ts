/**
 * Image Adapter Contract
 *
 * Defines the interface for CDN and image optimization.
 * Works with Cloudinary, Imgix, next/image, Vercel image optimization, Cloudflare Images.
 */

export interface ImageOptions {
  width?: number
  quality?: number
  format?: 'auto' | 'webp'
}

export interface ImageAdapter {
  cdnUrl(path: string, opts?: ImageOptions): string
  preload(paths: string[]): void
}

/**
 * No-op image adapter — identity pass-through.
 */
export const noopImage: ImageAdapter = {
  cdnUrl: (path) => path,
  preload: () => {},
}
