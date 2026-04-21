export type ProductConfig = {
  handle: string
  fallbackVariantKey?: string | null
  fallbackItemId?: string
  shopifyId?: string
  shopifyVariantId?: string
  defaultTitle: string
  defaultSubtitle: string
  defaultPrice?: number
  compareAtPrice?: number
  discountPercentOverride?: number
  ratingValueOverride?: number
  ratingCountLabelOverride?: string
  badge?: string
  bottomCtaChips?: string[]
  gallery?: string[]
  videoSlot?: string
  hideDetailsAccordion?: boolean
  essentials?: { title: string; body: string }[]
  reasons?: { title: string; desc: string }[]
  qa?: { q: string; a: string }[]
  how?: { title: string; body: string }[]
  care?: { icon?: string; title: string; body: string }[]
  careLabelOverride?: string
  featureCallouts?: {
    mediaSrc?: string
    mediaAlt?: string
    mediaLabel?: string
    mediaNote?: string
    heading?: {
      eyebrow?: string
      title?: string
      description?: string
      alignment?: 'left' | 'center' | 'right'
    }
  }
  featuredTikTokHeading?: {
    eyebrow?: string
    title?: string
    description?: string
    alignment?: 'left' | 'center' | 'right'
  }
  featuredTikToks?: {
    name: string
    handle: string
    embedUrl: string
    videoUrl?: string
  }[]
  reviews?: {
    author: string
    stars: number
    title: string
    body: string
    image?: string
    date?: string
    source?: string
  }[]
}
