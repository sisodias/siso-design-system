import { useCallback, useEffect, useRef, useState } from 'react'
import { successStories } from '@/content/landing'
import { SectionHeading } from '@ui/components/SectionHeading'
import { LazyVisible } from '@ui/components/LazyVisible'

type Heading = {
  eyebrow?: string
  title?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
}

type Props = {
  heading?: Heading
  sectionId?: string
  tiktoks?: {
    name: string
    handle: string
    embedUrl: string
    videoUrl?: string
  }[]
}

const defaultHeading: Heading = {
  eyebrow: 'As seen on TikTok',
  title: 'Creators using Lumelle',
  description: 'Swipe to watch a few of our favourite videos.',
  alignment: 'center',
}

export const FeaturedTikTok = ({ heading, sectionId, tiktoks }: Props) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [readyIndexes, setReadyIndexes] = useState<Set<number>>(new Set([0]))
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 })

  const goTo = useCallback(
    (idx: number, behavior: ScrollBehavior = 'smooth') => {
      const el = scrollerRef.current
      if (!el) return
      const cards = el.querySelectorAll<HTMLElement>('[data-tiktok-card]')
      if (!cards.length) return

      const target = ((idx % cards.length) + cards.length) % cards.length
      const card = cards[target]
      const offset = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2
      el.scrollTo({ left: Math.max(0, offset), behavior })
    },
    []
  )

  const nudge = (dir: 'left' | 'right') => {
    goTo(active + (dir === 'right' ? 1 : -1))
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (!el) return
    dragState.current.isDown = true
    dragState.current.startX = e.pageX - el.offsetLeft
    dragState.current.scrollLeft = el.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current
    if (!el || !dragState.current.isDown) return
    e.preventDefault()
    const x = e.pageX - el.offsetLeft
    const walk = x - dragState.current.startX
    el.scrollLeft = dragState.current.scrollLeft - walk
  }

  const endDrag = () => {
    dragState.current.isDown = false
  }

  useEffect(() => {
    setHydrated(true)
    const el = scrollerRef.current
    if (!el) return

    const handleScroll = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-tiktok-card]'))
      if (!cards.length) return

      const viewportCenter = el.scrollLeft + el.clientWidth / 2
      let closestIdx = 0
      let smallestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2
        const distance = Math.abs(cardCenter - viewportCenter)
        if (distance < smallestDistance) {
          smallestDistance = distance
          closestIdx = idx
        }
      })

      setActive(closestIdx)
      setReadyIndexes((prev) => {
        if (prev.has(closestIdx)) return prev
        const next = new Set(prev)
        // keep nearest neighbours warm
        next.add(closestIdx)
        next.add(Math.max(0, closestIdx - 1))
        next.add(Math.min(cards.length - 1, closestIdx + 1))
        return next
      })
    }

    handleScroll()
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const resolvedHeading = {
    ...defaultHeading,
    ...heading,
    alignment: heading?.alignment ?? defaultHeading.alignment,
  }

  return (
    <section id={sectionId} className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-6">
        <SectionHeading
          eyebrow={resolvedHeading.eyebrow}
          title={resolvedHeading.title ?? ''}
          description={resolvedHeading.description}
          alignment={resolvedHeading.alignment === 'right' ? 'center' : resolvedHeading.alignment}
        />

        <div className="mt-6 rounded-3xl border border-semantic-accent-cta/40 bg-gradient-to-r from-[#FDEBE3] via-white to-[#FDEBE3] p-4 shadow-soft">
          <div
            ref={scrollerRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={endDrag}
            onMouseUp={endDrag}
            onMouseMove={handleMouseMove}
            className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 sm:px-2 lg:gap-4 lg:px-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
          >
            {(tiktoks ?? successStories).map((s, idx) => {
              const shouldLoad = hydrated && readyIndexes.has(idx)
              return (
                <article key={`${s.handle}-${idx}`} data-tiktok-card className="min-w-[min(72vw,300px)] snap-center lg:min-w-[min(340px,26vw)]">
                  <LazyVisible
                    placeholder={
                      <div className="relative overflow-hidden rounded-2xl border border-semantic-accent-cta/40 pb-[158%] shadow-soft bg-semantic-legacy-brand-blush/20" />
                    }
                  >
                    <div className="relative overflow-hidden rounded-2xl border border-semantic-accent-cta/40 pb-[158%] shadow-soft bg-black">
                      {shouldLoad ? (
                        <iframe
                          src={s.embedUrl.includes('lang=') ? s.embedUrl : `${s.embedUrl}&lang=en`}
                          title={`${s.name} TikTok embed`}
                          loading="lazy"
                          allow="encrypted-media; fullscreen; clipboard-write"
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                          allowFullScreen
                          scrolling="no"
                          className="absolute inset-0 h-full w-full"
                          style={{ border: 0 }}
                        />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-semantic-legacy-brand-blush/20 text-semantic-text-primary/60 text-xs">
                      Loading…
                    </div>
                  )}
                </div>
              </LazyVisible>
                  <div className="mt-2 text-center text-sm text-semantic-text-primary/70">{s.name} • {s.handle}</div>
                  <div className="mt-1 text-center">
                    <a
                      href={s.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-semantic-legacy-brand-blush/60 px-3 py-1 text-xs font-semibold text-semantic-text-primary/80 hover:bg-semantic-legacy-brand-blush/40"
                    >
                      Watch on TikTok
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                    </a>
                  </div>
                </article>
              )
            })}
            {/* Desktop-only arrow nudges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden items-center md:flex">
              <button
                aria-label="Scroll videos left"
                onClick={() => nudge('left')}
                className="pointer-events-auto ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white text-semantic-text-primary shadow-soft hover:bg-semantic-legacy-brand-blush/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-legacy-brand-cocoa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center md:flex">
              <button
                aria-label="Scroll videos right"
                onClick={() => nudge('right')}
                className="pointer-events-auto mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white text-semantic-text-primary shadow-soft hover:bg-semantic-legacy-brand-blush/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-semantic-legacy-brand-cocoa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-sm text-semantic-text-primary/80">
          {(tiktoks ?? successStories).map((_, i) => (
            <button
              key={i}
              aria-label={`Go to TikTok slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-0.5 w-0.5 rounded-full transition ${i === active ? 'bg-semantic-legacy-brand-cocoa' : 'bg-semantic-legacy-brand-cocoa/30'}`}
            />
          ))}
        </div>
        <span className="sr-only" aria-live="polite">
          Showing TikTok slide {active + 1} of {(tiktoks ?? successStories).length}
        </span>
      </div>
    </section>
  )
}

export default FeaturedTikTok
