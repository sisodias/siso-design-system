import { useEffect, useState } from 'react'

/**
 * ReadingProgress component displays a fixed progress bar at the top of the page
 * that fills based on scroll position to indicate reading progress.
 */
export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progressPercent = (scrolled / documentHeight) * 100
      setProgress(Math.min(100, Math.max(0, progressPercent)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial calculation
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 h-[1px] bg-gray-200"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-[#8B7355] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ReadingProgress
