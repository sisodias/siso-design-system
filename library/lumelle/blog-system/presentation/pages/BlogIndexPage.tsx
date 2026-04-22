import type { NavItem } from '@/layouts/MarketingLayout'
import { SectionHeading } from '@ui/components/SectionHeading'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { cdnUrl } from '@/utils/cdn'
import { BlogLayout } from '@blog/ui/layouts'
import { Seo } from '@/components/Seo'
import { toPublicUrl } from '@platform/seo/logic/publicBaseUrl'
import { useBlogPosts } from '@/domains/client/blog/application'

const navItems: NavItem[] = [
  { id: 'hero', label: 'Blog' },
  { id: 'posts', label: 'Posts' },
]

const tags = ['Frizz-free', 'Protective styles', 'Science', 'Creator tips', 'Travel', 'Care', 'How-to', 'Tips']

export const BlogIndexPage = () => {
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  // Fetch published posts from Supabase
  const { data: postsData, isLoading, error } = useBlogPosts({ limit: 100, featured: false })
  const { data: featuredData } = useBlogPosts({ limit: 2, featured: true })

  const allPosts = postsData?.posts || []
  const featuredPosts = featuredData?.posts || []

  // Filter by tag
  const filteredPosts = useMemo(() => {
    if (!tagFilter) return allPosts
    return allPosts.filter((p) => {
      const categoryTag = p.category?.name
      const pillarTag = p.pillar_cluster
      return categoryTag === tagFilter || pillarTag === tagFilter
    })
  }, [allPosts, tagFilter])

  // Get unique tags from posts
  const tagOptions = useMemo(
    () => Array.from(new Set(allPosts.map((p) => p.category?.name).filter(Boolean))).sort(),
    [allPosts]
  )

  const title = 'Journal'
  const description =
    'Guides, routines, and creator tips to keep silk presses, curls, and braids frizz-free with Lumelle.'
  const heroImage = cdnUrl(featuredPosts[0]?.cover_image_url || '/uploads/luminele/product-feature-01.webp')
  const url = toPublicUrl('/blog')

  // Simple Blog schema
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Lumelle Journal',
    url,
    description,
  }
  const ldBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: toPublicUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: url },
    ],
  }

  if (isLoading) {
    return (
      <BlogLayout navItems={navItems} subtitle="Journal">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-semantic-text-primary/60">Loading posts...</div>
        </div>
      </BlogLayout>
    )
  }

  if (error) {
    return (
      <BlogLayout navItems={navItems} subtitle="Journal">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-red-500">Error loading posts. Please try again.</div>
        </div>
      </BlogLayout>
    )
  }

  return (
    <>
      <Seo
        title={title}
        description={description}
        image={heroImage}
        url={url}
        type="website"
        jsonLd={[ld, ldBreadcrumb]}
      />
      <BlogLayout navItems={navItems} subtitle="Journal">
        <section id="hero" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
            <nav className="mb-4 flex items-center justify-center gap-2 text-sm text-semantic-text-primary/60">
              <Link to="/" className="hover:text-semantic-text-primary">Home</Link>
              <span>›</span>
              <span className="text-semantic-text-primary/80">Blog</span>
            </nav>
            <div className="text-center">
              <span className="inline-flex rounded-full bg-semantic-legacy-brand-blush/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-semantic-text-primary/70">
                Journal
              </span>
              <h1 className="mt-3 font-heading text-4xl text-semantic-text-primary md:text-5xl">Frizz-free hair, creator-tested</h1>
              <p className="mt-3 text-base text-semantic-text-primary/75 md:text-lg">
                Guides, routines, and creator scripts that keep your style flawless—plus launches and behind-the-scenes.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-semantic-text-primary/70">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-semantic-legacy-brand-blush/40 px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="posts" className="bg-semantic-legacy-brand-blush/10">
          <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
            <SectionHeading
              eyebrow="Featured"
              title="Start with these"
              description="Editor picks to help you protect your style fast."
              alignment="left"
            />
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post: any) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-3xl border border-semantic-accent-cta/40 bg-white shadow-soft transition hover:-translate-y-1"
                >
                  <div className="aspect-[3/2] w-full overflow-hidden bg-semantic-legacy-brand-blush/20">
                    <img
                      src={cdnUrl(post.cover_image_url)}
                      alt={post.title}
                      className="h-full w-full object-cover"
                      width={800}
                      height={533}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-semantic-text-primary/60">
                      <span className="rounded-full bg-semantic-legacy-brand-blush/40 px-2 py-0.5 text-semantic-text-primary/80">{post.category?.name || 'Article'}</span>
                      <span>{post.read_time_minutes} min</span>
                    </div>
                    <h3 className="font-heading text-xl text-semantic-text-primary">{post.title}</h3>
                    <p className="text-sm text-semantic-text-primary/75">{post.excerpt}</p>
                    <div className="text-xs text-semantic-text-primary/60">
                      {post.author?.display_name || 'Lumelle Studio'} • {post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <SectionHeading
              eyebrow="Latest"
              title="Browse all posts"
              description="Fresh tips for blowouts, curls, braids, and creator workflows."
              alignment="left"
              className="mt-8 pt-2 md:mt-12"
            />
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-semantic-text-primary/70">
              <button
                className={`rounded-full px-3 py-1 transition ${tagFilter === null ? 'bg-semantic-legacy-brand-cocoa text-white' : 'bg-white text-semantic-text-primary border border-semantic-legacy-brand-blush/60'
                  }`}
                onClick={() => setTagFilter(null)}
              >
                All
              </button>
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  className={`rounded-full px-3 py-1 transition border ${tagFilter === tag
                    ? 'bg-semantic-legacy-brand-cocoa text-white border-semantic-legacy-brand-cocoa'
                    : 'bg-white text-semantic-text-primary border-semantic-legacy-brand-blush/60'
                    }`}
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {filteredPosts.map((post: any) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-2xl border border-semantic-legacy-brand-blush/50 bg-white shadow-sm transition hover:-translate-y-1"
                >
                  <div className="aspect-[3/2] w-full overflow-hidden bg-semantic-legacy-brand-blush/20">
                    <img
                      src={cdnUrl(post.cover_image_url)}
                      alt={post.title}
                      className="h-full w-full object-cover"
                      width={600}
                      height={400}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-semantic-text-primary/60">
                      <span className="rounded-full bg-semantic-legacy-brand-blush/40 px-2 py-0.5 text-semantic-text-primary/80">{post.category?.name || 'Article'}</span>
                      <span>{post.read_time_minutes} min</span>
                    </div>
                    <h3 className="font-heading text-lg text-semantic-text-primary">{post.title}</h3>
                    <p className="text-sm text-semantic-text-primary/75 line-clamp-2">{post.excerpt}</p>
                    <div className="text-xs text-semantic-text-primary/60">
                      {post.author?.display_name || 'Lumelle Studio'} • {post.published_at ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </BlogLayout>
    </>
  )
}

export default BlogIndexPage
