import { useParams, Navigate, Link as RouterLink } from 'react-router-dom'
import Markdown from 'markdown-to-jsx'
import { MarketingLayout } from '@/layouts/MarketingLayout'
import type { NavItem } from '@/layouts/MarketingLayout'
import { SectionHeading } from '@ui/components/SectionHeading'
import { cdnUrl } from '@/utils/cdn'
import BlogSocial from '../components/BlogSocial'
import { Seo } from '@/components/Seo'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'
import { SUPPORT_EMAIL } from '@/config/constants'
import { useCallback, useState, useEffect, useRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBlogPost } from '@/domains/client/blog/application'

const navItems: NavItem[] = [
  { id: 'hero', label: 'Post' },
  { id: 'faq', label: 'FAQ' },
]

type MarkdownAnchorProps = ComponentPropsWithoutRef<'a'> & {
  href?: string
}

const isExternalHref = (href: string) => {
  const trimmed = href.trim()
  return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(trimmed) || /^[a-z][a-z0-9+.-]*:/i.test(trimmed)
}

const hasFileExtension = (href: string) => {
  // Avoid treating direct static asset/doc links as SPA routes (router would 404).
  // Examples: `/docs/foo.md`, `/files/terms.pdf`, `/images/x.png`
  return /\.[a-z0-9]{2,6}(?:[?#]|$)/i.test(href)
}

const isSpaInternalRouteHref = (href: string) => {
  const trimmed = href.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('#')) return false
  if (isExternalHref(trimmed)) return false
  if (hasFileExtension(trimmed)) return false
  if (trimmed.startsWith('/docs/')) return false

  if (trimmed.startsWith('/')) {
    if (trimmed === '/') return true
    const allowedPrefixes = [
      '/welcome',
      '/landing',
      '/creators',
      '/brand',
      '/product/',
      '/blog',
      '/cart',
      '/checkout',
      '/order/',
      '/search',
      '/returns',
      '/terms',
      '/privacy',
      '/brief',
      '/rewards',
      '/sign-in',
      '/sign-up',
      '/sso-callback',
      '/account',
      '/admin',
    ]
    return allowedPrefixes.some((p) => trimmed === p || trimmed.startsWith(p))
  }

  // Relative links in markdown (rare in our blog content) are still safe to route client-side.
  if (trimmed.startsWith('.') || trimmed.startsWith('?')) return true

  return false
}

const BlogMarkdownLink = ({ href = '', children, ...rest }: MarkdownAnchorProps) => {
  if (isSpaInternalRouteHref(href)) {
    // `react-router-dom`'s <Link> renders an <a> but intercepts clicks for SPA navigation.
    return (
      <RouterLink to={href} {...rest}>
        {children}
      </RouterLink>
    )
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}

const markdownOptions = {
  overrides: {
    a: {
      component: BlogMarkdownLink,
    },
  },
} as const

const BLOG_SLUG_ALIASES: Record<string, string> = {
  'frizz-free-showers': 'frizz-free-showers-seo',
  'hair-hooks-that-convert': 'creator-tiktok-scripts',
  'satin-vs-waterproof': 'why-satin-matters',
  'travel-hair-kit': 'travel-ready-hair-kit',
}

export const BlogPostPage = () => {
  const { slug } = useParams()
  const canonicalSlug = slug ? BLOG_SLUG_ALIASES[slug] ?? slug : undefined

  // Fetch post from Supabase
  const { data: post, isLoading, error } = useBlogPost(canonicalSlug)

  const [currentRelatedIndex, setCurrentRelatedIndex] = useState(0)
  const relatedTrackRef = useRef<HTMLDivElement | null>(null)
  const [copied, setCopied] = useState(false)

  // Handle loading, error, and redirect states
  if (isLoading) {
    return (
      <MarketingLayout navItems={navItems} subtitle="Journal">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-semantic-text-primary/60">Loading post...</div>
        </div>
      </MarketingLayout>
    )
  }

  if (error || !post) {
    return <Navigate to="/blog" replace />
  }

  if (slug !== canonicalSlug) {
    return <Navigate to={`/blog/${canonicalSlug}`} replace />
  }

  // Get related posts (for now, skip related posts from Supabase - can be added later)
  const related: any[] = []

  const authorHref = post.author_link?.trim() ? post.author_link : null

  const scrollRelatedToIndex = useCallback(
    (idx: number) => {
      const track = relatedTrackRef.current
      if (!track) return

      const clamped = Math.max(0, Math.min(related.length - 1, idx))
      const el = track.querySelector(`[data-related-slide="${clamped}"]`) as HTMLElement | null
      if (!el) return

      const trackRect = track.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const left = elRect.left - trackRect.left + track.scrollLeft
      track.scrollTo({ left, behavior: 'smooth' })
    },
    [related.length],
  )

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'section'

  // Track horizontal scroll progress on the related carousel for the dots indicator
  useEffect(() => {
    const track = relatedTrackRef.current
    if (!track) return

    let raf = 0

    const handleScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const slides = Array.from(track.querySelectorAll('[data-related-slide]')) as HTMLElement[]
        if (!slides.length) return

        const trackRect = track.getBoundingClientRect()
        const trackCenterX = trackRect.left + trackRect.width / 2

        let bestIdx = 0
        let bestDist = Number.POSITIVE_INFINITY
        for (let i = 0; i < slides.length; i += 1) {
          const rect = slides[i].getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const dist = Math.abs(centerX - trackCenterX)
          if (dist < bestDist) {
            bestDist = dist
            bestIdx = i
          }
        }

        setCurrentRelatedIndex(bestIdx)
      })
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      track.removeEventListener('scroll', handleScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [related.length])

  const title = post.title
  const description =
    post.excerpt || post.subtitle || 'Frizz-free hair care, creator routines, and product science from Lumelle.'
  const image = post.og_image_url ?? post.cover_image_url
  const absImage = cdnUrl(image)
  const url = toPublicUrl(`/blog/${post.slug}`)
  const handleCopy = useCallback(() => {
    void navigator.clipboard?.writeText?.(url)?.then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    })
  }, [url])

  // Structured data: Article + FAQ from Supabase
  const faq = post.faqs && post.faqs.length
    ? post.faqs.map((f: any) => ({ question: f.question, answer: f.answer }))
    : [
      {
        question: 'How do I keep hair frizz-free in the shower?',
        answer:
          'Use a satin-lined, waterproof cap placed just beyond the hairline, angle spray forward, finish cool, and remove front-to-back after blotting.',
      },
      {
        question: 'How should I care for the cap to keep the seal strong?',
        answer: 'Rinse after each use, hand wash weekly with mild soap, air dry fully, and rotate caps so the liner stays dry and odor-free.',
      },
    ]

  const ldArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description,
    image: absImage,
    author: { '@type': 'Organization', name: post.author?.display_name || 'Lumelle Studio' },
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: url,
  }

  const ldFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: { '@type': 'Answer', text: qa.answer },
    })),
  }

  const ldBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: toPublicUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: toPublicUrl('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  const reviewed = post.reviewed_at || post.published_at || post.created_at

  return (
    <>
      <Seo
        title={title}
        description={description}
        image={absImage}
        url={url}
        type="article"
        jsonLd={[ldArticle, ldFaq, ldBreadcrumb]}
      />
      <MarketingLayout navItems={navItems} subtitle="Journal">
        <section id="hero" className="bg-white">
          <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
            <nav className="mb-4 flex items-center gap-2 text-sm text-semantic-text-primary/60">
              <RouterLink to="/" className="hover:text-semantic-text-primary">Home</RouterLink>
              <span>›</span>
              <RouterLink to="/blog" className="hover:text-semantic-text-primary">Blog</RouterLink>
              <span>›</span>
              <span className="text-semantic-text-primary/80">{post.title}</span>
            </nav>
            <span className="inline-flex rounded-full bg-semantic-legacy-brand-blush/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-semantic-text-primary/70">
              {post.category?.name || 'Article'}
            </span>
            <h1 className="mt-3 font-heading text-4xl text-semantic-text-primary">{post.title}</h1>
            <p className="mt-3 text-lg text-semantic-text-primary/75">{post.subtitle}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-semantic-text-primary/80">
              <div className="flex items-center gap-2">
                {post.author?.avatar_url ? (
                  authorHref ? (
                    <a
                      href={authorHref}
                      className="inline-flex h-9 w-9 overflow-hidden rounded-full border border-semantic-legacy-brand-blush/60 shadow-soft hover:-translate-y-0.5 transition"
                    >
                      <img src={cdnUrl(post.author.avatar_url)} alt={post.author.display_name} className="h-full w-full object-cover" loading="lazy" />
                    </a>
                  ) : (
                    <span className="inline-flex h-9 w-9 overflow-hidden rounded-full border border-semantic-legacy-brand-blush/60 shadow-soft">
                      <img src={cdnUrl(post.author.avatar_url)} alt={post.author.display_name} className="h-full w-full object-cover" loading="lazy" />
                    </span>
                  )
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-semantic-legacy-brand-blush/50 text-sm font-semibold text-semantic-text-primary">
                    {post.author?.display_name?.charAt(0) || 'L'}
                  </span>
                )}
                {authorHref ? (
                  <a
                    href={authorHref}
                    className="font-semibold text-semantic-text-primary hover:text-semantic-text-primary/80"
                    title={post.author_role_long || post.author?.role}
                  >
                    {post.author?.display_name || 'Lumelle Studio'}
                  </a>
                ) : (
                  <span
                    className="font-semibold text-semantic-text-primary"
                    title={post.author_role_long || post.author?.role}
                  >
                    {post.author?.display_name || 'Lumelle Studio'}
                  </span>
                )}
                {post.author?.role ? <span className="text-semantic-text-primary/70">· {post.author.role}</span> : null}
              </div>
              {post.author_role_long ? <span className="text-semantic-text-primary/60">{post.author_role_long}</span> : null}
              <span>•</span>
              <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span>{post.read_time_minutes} min read</span>
              <span>•</span>
              <div className="flex items-center gap-2 text-semantic-text-primary/70">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-full border border-semantic-legacy-brand-blush/60 px-3 py-1 text-xs font-semibold hover:-translate-y-0.5 hover:shadow-soft transition"
                >
                  {copied ? 'Link copied' : 'Copy link'}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-semantic-legacy-brand-blush/60 px-3 py-1 text-xs font-semibold hover:-translate-y-0.5 hover:shadow-soft transition"
                >
                  Share
                </a>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-semantic-legacy-brand-blush/60">
              <img
                src={cdnUrl(post.cover_image_url)}
                alt={post.title}
                className="w-full object-cover"
                width={1200}
                height={800}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-4 pb-12 md:px-6">
            <div className="rounded-2xl border border-semantic-legacy-brand-blush/60 bg-semantic-legacy-brand-blush/15 p-4 text-semantic-text-primary">
              <h2 className="text-lg font-semibold text-semantic-text-primary">
                {post.faqs?.[0]?.question || 'How do I keep hair frizz-free in the shower?'}
              </h2>
              <p className="mt-1 text-semantic-text-primary/75">
                {post.faqs?.[0]?.answer ||
                  'Use a satin-lined, waterproof cap placed just beyond the hairline, tuck sideburns, angle spray forward, finish with 60 seconds of cooler water, then blot and remove front-to-back.'}
              </p>
            </div>

            <div className="rounded-3xl border border-semantic-legacy-brand-blush/50 bg-semantic-legacy-brand-blush/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/60">TL;DR</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-semantic-text-primary/80">
                <li>{post.excerpt}</li>
                <li>Skim the subheads for quick wins and routines.</li>
              </ul>
              <div className="mt-4">
                {post.product_card ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white p-3 shadow-soft">
                    <img
                      src={cdnUrl(post.product_card.image)}
                      alt={post.product_card.title}
                      className="h-14 w-14 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="flex flex-1 flex-col gap-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-semantic-text-primary">{post.product_card.title}</span>
                        {post.product_card.badge ? (
                          <span className="rounded-full bg-semantic-legacy-brand-blush/40 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-semantic-text-primary/80">
                            {post.product_card.badge}
                          </span>
                        ) : null}
                      </div>
                      {post.product_card.caption ? (
                        <p className="text-xs text-semantic-text-primary/70">{post.product_card.caption}</p>
                      ) : null}
                      <div className="flex items-center gap-2 text-sm font-semibold text-semantic-text-primary">
                        {post.product_card.price ? <span>{post.product_card.price}</span> : null}
                        {post.product_card.href?.startsWith('/') ? (
                          <RouterLink
                            to={post.product_card.href}
                            className="inline-flex items-center gap-1 rounded-full bg-semantic-legacy-brand-cocoa px-3 py-1 text-xs font-semibold text-white shadow-soft hover:-translate-y-0.5"
                          >
                            Shop now
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                          </RouterLink>
                        ) : (
                          <a
                            href={post.product_card.href || post.cta_target || '/product/lumelle-shower-cap'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full bg-semantic-legacy-brand-cocoa px-3 py-1 text-xs font-semibold text-white shadow-soft hover:-translate-y-0.5"
                          >
                            Shop now
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <RouterLink
                    to={post.cta_target || '/product/lumelle-shower-cap'}
                    className="inline-flex items-center gap-2 rounded-full bg-semantic-legacy-brand-cocoa px-4 py-2 text-sm font-semibold text-white shadow-soft hover:-translate-y-0.5"
                  >
                    Shop the satin-lined waterproof cap
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </RouterLink>
                )}
              </div>
            </div>

            {/* Body with structured sections - content is JSONB in Supabase */}
            {post.content && Array.isArray(post.content) && post.content.length > 0 ? (
              <div className="mb-4 block rounded-xl border border-semantic-legacy-brand-blush/60 bg-white/90 p-3 text-sm text-semantic-text-primary/75 shadow-soft md:hidden">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-primary/60">Jump to</label>
                <select
                  className="mt-2 w-full rounded-lg border border-semantic-legacy-brand-blush/60 bg-white px-3 py-2 text-sm text-semantic-text-primary outline-none focus:ring-2 focus:ring-semantic-legacy-brand-cocoa/30"
                  onChange={(e) => {
                    const id = e.target.value
                    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a section
                  </option>
                  {post.content.map((section) => {
                    const id = slugify(section.heading)
                    return (
                      <option key={id} value={id}>
                        {section.heading}
                      </option>
                    )
                  })}
                </select>
              </div>
            ) : null}
            {post.content ? (
              <div className="mt-8 grid gap-8 text-semantic-text-primary lg:grid-cols-[220px_1fr]">
                <aside className="hidden lg:block">
                  <div className="sticky top-28 rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white/85 p-4 text-sm text-semantic-text-primary/75 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-primary/60">Jump to</p>
                    <ul className="mt-2 space-y-2">
                      {post.content.map((section: any) => {
                        const id = slugify(section.heading)
                        return (
                          <li key={id}>
                            <a href={`#${id}`} className="hover:text-semantic-text-primary">
                              {section.heading}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </aside>
                <div className="space-y-10">
                  {post.content.map((section: any, idx: number) => {
                    const id = slugify(section.heading)
                    return (
                      <article key={section.heading + idx} id={id} className="space-y-4 scroll-mt-24">
                        <h2 className="font-heading text-2xl text-semantic-text-primary">{section.heading}</h2>
                        {section.paragraphs.map((para, pIdx) => (
                          <div
                            key={pIdx}
                            className="prose prose-lg text-semantic-text-primary prose-headings:font-heading prose-p:leading-relaxed prose-strong:text-semantic-text-primary prose-li:marker:text-semantic-text-primary/60"
                          >
                            <Markdown options={markdownOptions}>{para}</Markdown>
                          </div>
                        ))}
                        {section.productCard ? (
                          <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-semantic-legacy-brand-blush/60 bg-white p-3 shadow-soft md:flex-row md:items-center">
                            <img
                              src={section.productCard.image}
                              alt={section.productCard.title}
                              className="h-14 w-14 rounded-xl object-cover"
                              loading="lazy"
                            />
                            <div className="flex flex-1 flex-col gap-1 text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-semantic-text-primary">{section.productCard.title}</span>
                                {section.productCard.badge ? (
                                  <span className="rounded-full bg-semantic-legacy-brand-blush/40 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-semantic-text-primary/80">
                                    {section.productCard.badge}
                                  </span>
                                ) : null}
                              </div>
                              {section.productCard.caption ? (
                                <p className="text-xs text-semantic-text-primary/70">{section.productCard.caption}</p>
                              ) : null}
                              <div className="flex items-center gap-2 text-sm font-semibold text-semantic-text-primary">
                                {section.productCard.price ? <span>{section.productCard.price}</span> : null}
                                <a
                                  href={section.productCard.href}
                                  className="inline-flex items-center gap-1 rounded-full bg-semantic-legacy-brand-cocoa px-3 py-1 text-xs font-semibold text-white shadow-soft hover:-translate-y-0.5"
                                >
                                  Shop now
                                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : null}
                        {section.relatedLinks?.length ? (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-semantic-text-primary/75">
                            <span className="text-semantic-text-primary/60">Related:</span>
                            {section.relatedLinks.map((link) => (
                              <a
                                key={link.href}
                                href={link.href}
                                className="underline decoration-semantic-text-primary/50 underline-offset-4 hover:text-semantic-text-primary"
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
                        ) : null}
                        {section.image ? (
                          <figure className="mt-3 overflow-hidden rounded-2xl border border-semantic-legacy-brand-blush/50 bg-white shadow-soft">
                            <img src={section.image} alt={section.imageAlt ?? section.heading} className="w-full object-cover" loading="lazy" />
                            {section.imageAlt ? <figcaption className="px-4 py-2 text-sm text-semantic-text-primary/70">{section.imageAlt}</figcaption> : null}
                          </figure>
                        ) : null}
                        {section.embedUrl ? (
                          <div className="relative mt-3 overflow-hidden rounded-2xl border border-semantic-legacy-brand-blush/50 pb-[56.25%] shadow-soft">
                            <iframe
                              src={section.embedUrl}
                              title={`${section.heading} video`}
                              className="absolute inset-0 h-full w-full"
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : null}
	                      </article>
	                    )
	                  })}
	                </div>
	              </div>
	            ) : (
	              <div className="prose prose-lg mt-8 text-semantic-text-primary prose-headings:font-heading prose-p:leading-relaxed prose-strong:text-semantic-text-primary">
	                <Markdown options={markdownOptions}>{post.body ?? ''}</Markdown>
	              </div>
	            )}
	          </div>
	        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-4 pb-12 md:px-6">
            <BlogSocial url={url} title={post.title} />
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-4 pb-12 md:px-6">
            <div className="flex items-center gap-4 rounded-3xl border border-semantic-legacy-brand-blush/60 bg-semantic-legacy-brand-blush/15 p-4">
              {authorHref ? (
                <a
                  href={authorHref}
                  className="h-12 w-12 rounded-full bg-semantic-legacy-brand-blush/40 text-center text-lg font-semibold text-semantic-text-primary flex items-center justify-center hover:-translate-y-0.5 transition"
                >
                  {(post.author?.display_name || 'L').charAt(0)}
                </a>
              ) : (
                <div className="h-12 w-12 rounded-full bg-semantic-legacy-brand-blush/40 text-center text-lg font-semibold text-semantic-text-primary flex items-center justify-center">
                  {(post.author?.display_name || 'L').charAt(0)}
                </div>
              )}
              <div className="space-y-1 text-sm text-semantic-text-primary/80">
                <div className="font-semibold text-semantic-text-primary">
                  {authorHref ? (
                    <a href={authorHref} className="hover:text-semantic-text-primary">
                      {post.author?.display_name || 'Lumelle Studio'}
                    </a>
                  ) : (
                    <span>{post.author?.display_name || 'Lumelle Studio'}</span>
                  )}
                  {post.author?.role ? ` · ${post.author.role}` : ''}
                </div>
                {post.author_role_long ? (
                  <div className="text-semantic-text-primary/70">{post.author_role_long}</div>
                ) : null}
                <div>
                  Published {new Date(post.published_at || post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} · Last reviewed {new Date(reviewed).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div>
                  Have feedback? Email{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-4 hover:text-semantic-text-primary">
                    {SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

	        {related.length ? (
	          <section className="bg-white">
	            <div className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
	              <SectionHeading
	                eyebrow="Related reads"
	                title="You might also like"
	                description="More quick wins to keep hair frizz-free."
	                alignment="left"
	              />
                <div className="mt-6 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-semantic-text-primary/60">
                    {currentRelatedIndex + 1} / {related.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous related post"
                      onClick={() => scrollRelatedToIndex(currentRelatedIndex - 1)}
                      disabled={currentRelatedIndex <= 0}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next related post"
                      onClick={() => scrollRelatedToIndex(currentRelatedIndex + 1)}
                      disabled={currentRelatedIndex >= related.length - 1}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-semantic-legacy-brand-blush/60 bg-white text-semantic-text-primary shadow-sm hover:bg-brand-porcelain/60 disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

	              <div
	                ref={relatedTrackRef}
                  role="region"
                  aria-label="Related reads"
	                className="no-scrollbar mt-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
	              >
	                <div className="flex gap-4 pr-6 md:pr-10">
	                  {related.map((item, idx) => (
	                    <RouterLink
	                      key={item.slug}
	                      to={`/blog/${item.slug}`}
                        data-related-slide={idx}
	                      className="group relative flex min-w-[17rem] max-w-[17rem] flex-1 shrink-0 flex-col overflow-hidden rounded-2xl border border-semantic-legacy-brand-blush/50 bg-white shadow-sm transition hover:-translate-y-1"
	                    >
	                      <div className="aspect-[3/2] w-full overflow-hidden bg-semantic-legacy-brand-blush/20">
                        <img src={cdnUrl(item.cover)} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
	                      </div>
	                      <div className="space-y-2 p-4">
	                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-semantic-text-primary/60">
	                          <span className="rounded-full bg-semantic-legacy-brand-blush/40 px-2 py-0.5 text-semantic-text-primary/80">{item.tag}</span>
	                          <span>{item.readTime}</span>
	                        </div>
	                        <h3 className="font-heading text-lg text-semantic-text-primary">{item.title}</h3>
	                        <p className="text-sm text-semantic-text-primary/75 line-clamp-2">{item.teaser}</p>
	                      </div>
	                    </RouterLink>
	                  ))}
	                </div>
	              </div>

	              <div className="mt-4 flex justify-center gap-2">
	                {related.map((item, idx) => (
	                  <button
	                    key={item.slug}
                      type="button"
                      aria-label={`Go to related post ${idx + 1}`}
                      aria-current={currentRelatedIndex === idx ? 'true' : undefined}
                      onClick={() => scrollRelatedToIndex(idx)}
	                    className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                        currentRelatedIndex === idx ? 'bg-semantic-legacy-brand-cocoa' : 'bg-semantic-legacy-brand-blush/60 hover:bg-semantic-legacy-brand-blush'
                      }`}
	                  />
	                ))}
	              </div>
	            </div>
	          </section>
	        ) : null}

      </MarketingLayout>
    </>
  )
}

export default BlogPostPage
