'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Delays hydrating expensive client components until their container intersects the viewport.
 * Pass the returned ref to a wrapping element and render a lightweight placeholder while
 * `hydrated === false`.
 */
export function useHydrateOnView<T extends HTMLElement>(
  options?: IntersectionObserverInit,
): { ref: RefObject<T | null>; hydrated: boolean } {
  const targetRef = useRef<T | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (hydrated) return
    const node = targetRef.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setHydrated(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setHydrated(true)
          observer.disconnect()
        }
      })
    }, options)

    observer.observe(node)
    return () => observer.disconnect()
  }, [hydrated, options])

  return { ref: targetRef, hydrated }
}
