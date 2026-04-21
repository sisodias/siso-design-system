import { useState, useEffect, useRef } from 'react'

/**
 * Animates a number from 0 to the target value when the element enters the viewport.
 * Uses easeOutQuart easing for smooth, premium feel.
 *
 * @param targetValue - The final number to animate to
 * @param duration - Animation duration in milliseconds (default: 1500ms)
 * @param threshold - IntersectionObserver threshold (default: 0.5)
 * @returns Object containing displayValue and hasAnimated flag
 */
export function useCountUpAnimation(
  targetValue: number,
  duration: number = 1500,
  threshold: number = 0.5
): { displayValue: number; hasAnimated: boolean; elementRef: React.RefObject<HTMLDivElement | null> } {
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (hasAnimated) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)

            const start = Date.now()
            const animate = () => {
              const now = Date.now()
              const progress = Math.min((now - start) / duration, 1)
              // easeOutQuart: 1 - (1 - t)^4
              const easeOut = 1 - Math.pow(1 - progress, 4)
              setDisplayValue(easeOut * targetValue)

              if (progress < 1) {
                requestAnimationFrame(animate)
              } else {
                setDisplayValue(targetValue)
              }
            }
            animate()
          }
        })
      },
      { threshold }
    )

    const current = elementRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [targetValue, duration, threshold, hasAnimated])

  return { displayValue, hasAnimated, elementRef }
}
