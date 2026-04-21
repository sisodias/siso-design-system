export type Review = {
  author: string
  stars: number
  title: string
  body: string
  image?: string
  date?: string
  source?: string
}

type MainCreatorClip = {
  eyebrow?: string
  title: string
  description: string
  stat?: string
  image: string
  imageAlt: string
  ctaLabel?: string
  ctaHref?: string
}

export type HomeConfig = {
  hero: {
    headline: string
    subhead: string
    ctaLabel: string
    ctaHref: string
    secondaryCtaLabel?: string
    secondaryCtaHref?: string
    offerChip?: string
    image: string
    bgImage?: string
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    gallery?: string[]
    objectPosition?: string
    pill?: string
    assurances?: { label: string }[]
  }
  slides: { title: string; copy: string; image: string; ctaHref: string; tag?: string; proof?: string }[]
  socialProof: { rating: number; count: number; tagline: string; trustCountLabel?: string; trustAvatars?: string[] }
  problemSolution: { problems: string[]; solutions: string[] }
  ugc: { src: string; type: 'image' | 'video'; caption?: string }[]
  benefits3?: { title: string; body: string; icon?: string }[]
  realWorldUse?: { src: string; alt: string; caption: string }[]
  details?: { title: string; body: string; thumbSrc?: string; thumbAlt?: string }[]
  reviews: Review[]
  pdpTeaser: {
    title: string
    subtitle: string
    description: string
    rating: number
    reviews: number
    pills: string[]
    priceNow: number
    priceWas?: number
    bullets: string[]
    image: string
    href: string
    ctaLabel: string
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    objectPosition?: string
  }
  pdpTeasers?: HomeConfig['pdpTeaser'][]
  faq: { q: string; a: string }[]
  stats: { value: string; label: string; helper?: string }[]
  comparison: { feature: string; lumelle: string; other: string }[]
  finalCta: { headline: string; subhead: string; bullets: string[]; ctaLabel: string; ctaHref: string }
  mainCreatorClip: MainCreatorClip
}

const pdpTeaserCap: HomeConfig['pdpTeaser'] = {
  title: 'Lumelle Shower Cap',
  subtitle: 'Creator-loved protection for every style',
  description:
    'Dual-layer satin with a waterproof core keeps silk presses, curls, and braids flawless through every steamy shower.',
  rating: 4.8,
  reviews: 100,
  pills: ['No-frizz seal', 'Luxury feel', 'Reusable + eco'],
  priceNow: 14.99,
  priceWas: 19.99,
  bullets: [
    'Reusable waterproof',
    'Satin lined',
    'Large wide shower cap',
    'Adjustable',
  ],
  image: '/uploads/luminele/page9-image.webp',
  href: '/product/lumelle-shower-cap',
  ctaLabel: 'Shop the cap',
  objectFit: 'cover',
  objectPosition: 'center 25%',
}

const pdpTeaserCurler: HomeConfig['pdpTeaser'] = {
  title: 'Satin Overnight Heatless Curler Set',
  subtitle: 'Wake up to curls—no heat, no damage',
  description:
    'A satin-wrapped rod + bonnet set designed for smooth, bouncy curls overnight—without heat damage.',
  rating: 4.8,
  reviews: 50,
  pills: ['Heatless curls', 'Overnight set', 'Satin smooth'],
  priceNow: 16.99,
  priceWas: 21.99,
  bullets: [
    'Satin heatless curling rod',
    'Luxury satin bonnet',
    '2× matching satin scrunchies',
    'Claw clip',
  ],
  image: '/uploads/curler/1.webp',
  href: '/product/satin-overnight-curler',
  ctaLabel: 'Shop the curler',
}

const pdpTeaserTowel: HomeConfig['pdpTeaser'] = {
  title: 'XL Microfibre Hair Towel',
  subtitle: 'Dry hair faster, with less frizz',
  description:
    'Ultra-absorbent microfiber towel that cuts drying time in half while reducing frizz and breakage.',
  rating: 4.8,
  reviews: 50,
  pills: ['Quick-dry', 'Anti-frizz', 'Travel-friendly'],
  priceNow: 14.99,
  priceWas: 19.99,
  bullets: [
    'Ultra-absorbent microfiber',
    'XL size with tulip design',
    'Secure elastic loop',
    'Frizz-reducing fabric',
  ],
  image: '/uploads/towel/Hero.webp',
  href: '/product/lumelle-xl-microfibre-hair-towel',
  ctaLabel: 'Shop the towel',
}

export const homeConfig: HomeConfig = {
  hero: {
    headline: 'Luxury shower cap that keeps hair frizz-free',
    subhead: 'Satin-lined, waterproof, and creator-tested to protect silk presses, curls, and braids from steam.',
    ctaLabel: 'Shop shower cap',
    ctaHref: '/product/lumelle-shower-cap',
    offerChip: 'Buy 2, save 10%',
    secondaryCtaLabel: 'Join WhatsApp',
    secondaryCtaHref: '/creators',
    image: '/uploads/luminele/product-main.webp',
    bgImage: '/uploads/luminele/hero-desktop.webp',
    objectPosition: 'center 30%',
    objectFit: 'cover',
    pill: 'Best seller',
    assurances: [
      { label: 'Free shipping' },
      { label: '30-day money back' },
    ],
    gallery: ['/uploads/luminele/hero-main-960.webp'],
  },
  slides: [
    {
      title: 'Luxury Self Care',
      copy: 'The design lets you fit your hair in easily and seal it comfortably for your shower.',
      image: '/uploads/luminele/product-feature-04.webp',
      ctaHref: '/product/lumelle-shower-cap',
      tag: 'Daily luxury',
      proof: '',
    },
    {
      title: 'Designed To Last',
      copy: 'It\'s fully reusable, made with durable materials that hold their shape and last shower after shower.',
      image: '/uploads/luminele/product-feature-05.webp',
      ctaHref: '/product/lumelle-shower-cap',
      tag: 'Durability',
      proof: '',
    },
    {
      title: 'Fits All Hair Sizes',
      copy: 'Designed for all hair types—it even fits thick, curly, or bum-length hair.',
      image: '/uploads/luminele/product-feature-06.webp',
      ctaHref: '/product/lumelle-shower-cap',
      tag: 'All hair welcome',
      proof: '',
    },
    {
      title: 'Frizz-Free Protection',
      copy: 'The satin lining reduces friction to keep your hair frizz-free while you\'re in your steamy shower.',
      image: '/uploads/luminele/steam-shield-new.webp',
      ctaHref: '/product/lumelle-shower-cap',
      tag: 'Frizz guard',
      proof: '',
    },
    {
      title: 'The Perfect Gift',
      copy: 'A simple gift that makes daily showers easier.',
      image: '/uploads/luminele/product-feature-07.webp',
      ctaHref: '/product/lumelle-shower-cap',
      tag: 'Giftable',
      proof: '',
    }
  ],
  socialProof: {
    rating: 4.8,
    count: 10000,
    tagline: 'Trusted by 10k users',
    trustCountLabel: '10k+',
    trustAvatars: [
      '/images/avatar-shannon.jpg',
      '/images/avatar-rachel.jpg',
      '/images/avatar-randomlife.jpg',
      '/images/avatar-jade.jpg',
      '/images/avatar-maya.jpg',
    ],
  },
  problemSolution: {
    problems: [
      'Plastic caps trap humidity → frizz',
      'Uncomfortable elastic leaves marks',
      'Disposable waste and poor durability'
    ],
    solutions: [
      'Moisture‑guard lining preserves styles',
      'Comfort stretch band with secure seal',
      'Long‑lasting build replaces disposables'
    ]
  },
  ugc: [
    { src: '/uploads/luminele/product-feature-07.webp', type: 'image', caption: 'Morning routine ready' },
    { src: '/uploads/luminele/product-feature-02.webp', type: 'image' },
    { src: '/uploads/luminele/product-feature-04.webp', type: 'image' }
  ],
  benefits3: [
    { title: 'Seal out steam', body: 'Waterproof core protects styles from moisture and frizz.' },
    { title: 'Comfort, no creases', body: 'Spa‑grade band hugs softly without leaving marks.' },
    { title: 'Reusable luxe', body: 'Dual‑layer satin built to last 100+ uses.' },
  ],
  realWorldUse: [
    { src: '/uploads/luminele/product-feature-03.webp', alt: 'Creator mirror selfie wearing cap', caption: 'After a hot shower — blowout stays smooth.' },
    { src: '/uploads/luminele/product-feature-07.webp', alt: 'Comfort band macro', caption: 'Comfort band sits softly — no marks.' },
    { src: '/uploads/luminele/product-feature-02.webp', alt: 'Bathroom lifestyle shot', caption: 'Fits curls and braids comfortably.' },
  ],
  details: [
    {
      title: 'Reusable & waterproof',
      body: 'Dual‑layer satin exterior + waterproof TPU core. Wipes clean daily; rinse after use, air dry fully, and hand wash weekly with mild soap to keep the seal strong for 100+ uses.',
      thumbSrc: '/uploads/luminele/product-feature-05.webp',
      thumbAlt: 'Satin lining macro',
    },
    {
      title: 'Satin lined',
      body: 'Smooth inner lining protects styles while blocking steam—reduces friction on silk presses, curls, braids, and locs so hair stays glossy.',
      thumbSrc: '/uploads/luminele/product-feature-07.webp',
      thumbAlt: 'Soft satin lining detail',
    },
    {
      title: 'Fit & sizing',
      body: 'Roomy silhouette fits curls, coils, braids, and bum‑length hair. Comfort band stretches to 24\"+ with a secure, no‑crease seal. 5★ customer: "Super long hair past my butt… hair stays bone dry and the band fits snug."',
      thumbSrc: '/uploads/luminele/product-feature-04.webp',
      thumbAlt: 'Comfort band detail',
    },
    {
      title: 'Adjustable & fresh',
      body: 'Plush band flexes without denting edges; deep crown tucks volume easily. Air‑dries fast to stay odor‑free—keep it in the pouch between uses.',
      thumbSrc: '/uploads/luminele/product-feature-06.webp',
      thumbAlt: 'Cap depth and stretch',
    },
  ],
  reviews: [
    {
      author: 'Amelia',
      stars: 5,
      title: 'Zero frizz',
      body: 'Finally a cap that actually works. I\'ve tried so many shower caps and they all let steam through. This one is completely waterproof—the satin lining keeps my hair bone dry even in my sauna-like bathroom. My silk presses have been lasting 3-4 days instead of just one.',
    },
    {
      author: 'Beth',
      stars: 5,
      title: 'So comfy',
      body: 'No marks on my forehead and looks cute. The elastic is gentle but secure, which is huge for me. Most caps leave deep indentations on my forehead, but this one doesn\'t. I actually don\'t mind wearing it around the house before my shower.',
    },
    {
      author: 'Cara',
      stars: 5,
      title: 'Worth it',
      body: `Saved my blowout more than once.

I gym in the mornings and used to have to restyle my hair completely after showering. Now I just pop this on and my style stays intact.

It's already paid for itself in saved salon visits.`,
    },
    {
      author: 'Danielle',
      stars: 5,
      title: 'Blowout saver',
      body: `Stayed smooth after a long, steamy shower.

I was skeptical about the waterproof claim, but it genuinely blocks all moisture. The satin interior feels luxurious against my hair.

My stylist asked what I've been doing differently because my hair is so much healthier.`,
    },
    {
      author: 'Ella',
      stars: 4.5,
      title: 'Soft band',
      body: `No dents and super gentle on edges.

As someone with delicate edges, finding a shower cap that doesn't cause breakage has been a struggle. The wide band on this cap is perfect.

It stays in place without being too tight, which is rare to find.`,
    },
    {
      author: 'Fiona',
      stars: 5,
      title: 'Looks luxe',
      body: `Finally a cap I'm not embarrassed to wear.

The quality is obvious—it doesn't look like those cheap plastic ones from the drugstore. The pink color is adorable and the satin lining makes it feel premium.

I even got compliments on it at the gym!`,
    },
    {
      author: 'Grace',
      stars: 5,
      title: 'Curl friendly',
      body: `Fits over braids without tugging.

I have thick box braids and most shower caps are too small. This one has plenty of room to accommodate my hairstyle comfortably.

The waterproof layer is legit—my scalp and hair stay completely dry.`,
    },
    {
      author: 'Hana',
      stars: 4.8,
      title: 'Travel staple',
      body: `Packs flat and keeps styles intact on trips.

I travel for work constantly and this cap has been a game-changer. It takes up zero space in my luggage and protects my hair regardless of the hotel shower situation.

Cannot recommend enough for frequent travelers.`,
    },
    {
      author: 'Isla',
      stars: 5,
      title: 'Steam proof',
      body: `Tested in a sauna shower—no puffiness.

My bathroom gets insanely steamy and I've never found a cap that could handle it until now. The waterproof layer actually works.

My hair stays completely dry and frizz-free every single time.`,
    },
    {
      author: 'Jade',
      stars: 4.9,
      title: 'Satin smooth',
      body: `Interior feels like a silk pillowcase.

The satin lining is what sets this apart—it's gentle on my hair and doesn't cause any friction or breakage.

My hair feels just as smooth when I take it off as it did before I put it on.`,
    },
    {
      author: 'Kara',
      stars: 5,
      title: 'Stretch fit',
      body: `Roomy enough for rollers and still sealed.

I sometimes set my hair in large rollers and most caps can't accommodate them. This one stretches to fit but still creates a perfect seal around the edges.

The waterproof protection is impressive.`,
    },
    {
      author: 'Lena',
      stars: 5,
      title: 'Worth the upgrade',
      body: `Feels premium compared to plastic caps.

Yes, it costs more than cheap shower caps, but the quality difference is massive. The materials are better, the construction is solid, and it actually works.

I've had mine for 3 months and it still looks brand new.`,
    },
    {
      author: 'Mara',
      stars: 4.7,
      title: 'Holds up',
      body: `Using daily for weeks—still perfect.

I was worried about durability given the price, but this cap is built to last. The elastic hasn't stretched out and the waterproof layer is still effective.

Best investment I've made for my hair care routine.`,
    },
    {
      author: 'Nia',
      stars: 5,
      title: 'Edge-safe',
      body: `No rubbing on baby hairs.

My baby hairs are super fragile and most shower caps cause breakage around my hairline. This one is gentle enough that I don't have any issues.

Finally found a shower cap that protects my edges while keeping my hair dry.`,
    },
    {
      author: 'Opal',
      stars: 5,
      title: 'Great gift',
      body: `Bought for my mom—she loves it.

Got this as a gift for my mom who has curly hair and struggles with frizz. She's been using it every day and says it's the best shower cap she's ever owned.

She's already asked me to buy her a second one as a backup!`,
    },
    {
      author: 'Priya',
      stars: 4.8,
      title: 'Cute design',
      body: `Functional and actually stylish.

I love that I don't have to hide this cap when someone walks into the bathroom. It looks like a luxury accessory, not something I need to be embarrassed about.

The fact that it actually works makes it even better.`,
    },
    {
      author: 'Quinn',
      stars: 5,
      title: 'Frizz free',
      body: `Hair stays shiny even on wash day.

I use this cap every time I wash my hair, and the difference in my hair health is noticeable. Less frizz, more shine, and my styles last so much longer.

My hairdresser commented on how healthy my ends look now.`,
    },
  ],
  pdpTeaser: pdpTeaserCap,
  pdpTeasers: [pdpTeaserCap, pdpTeaserCurler, pdpTeaserTowel],
  faq: [
    {
      q: 'Will it fit my hair?',
      a: "Customer review · 5★: I've never bothered with shower caps as I have super long hair that goes past my butt so my hair would always get wet and wouldn't fit. This shower cap is perfect – my hair stays bone dry, it fits with plenty of room and the band fits snug around the head. 10/10 worth the price!",
    },
    {
      q: 'Is it fully waterproof?',
      a: 'Yes, the durable waterproof outer shell shields hair from moisture and humidity.',
    },
    {
      q: 'How do I wash it?',
      a: 'Hand wash the shower cap in lukewarm water with mild soap, gently clean the satin lining, rinse well, and air-dry only. Avoid machine washing, tumble drying, or heat to keep the waterproof layer and satin in good condition.',
    },
    {
      q: 'What\'s the return policy?',
      a: '30-day Luxe Guarantee with easy exchanges or returns.',
    },
  ],
  stats: [
    { value: '4.9★', label: 'Average rating', helper: '10k+ trusted shoppers' },
    { value: '48 hrs', label: 'Dispatch time', helper: 'Ships fast from UK' },
    { value: 'Proven', label: 'Protects hair', helper: 'Creator-tested frizz defense' },
  ],
  comparison: [
    { feature: 'Material', lumelle: 'Dual-layer satin + waterproof core', other: 'Thin plastic film' },
    { feature: 'Fit', lumelle: 'Comfort band — no marks', other: 'Tight elastic dents' },
    { feature: 'Durability', lumelle: 'Reusable 100+ wears', other: 'Single-use disposables' },
    { feature: 'Care', lumelle: 'Rinse + air dry', other: 'Traps moisture & odor' },
  ],
  finalCta: {
    headline: 'Ready for frizz-free showers?',
    subhead: 'Join creators who keep every wash day protected with Lumelle.',
    bullets: ['Luxury satin exterior', 'Leak-proof lining', '30-day Luxe Guarantee'],
    ctaLabel: 'Buy Now',
    ctaHref: '/product/lumelle-shower-cap',
  },
  mainCreatorClip: {
    eyebrow: 'From Lumelle HQ',
    title: 'Our studio lead sets the tone',
    description: 'Go behind the scenes with the core Lumelle creator as she maps out look-book shots and scripts that everyone in the program riffs on.',
    stat: 'Shot inside the Lumelle content studio',
    image: '/uploads/luminele/product-main.webp',
    imageAlt: 'Lumelle studio lead planning a shoot with the signature cap',
    ctaLabel: 'See the full brief',
    ctaHref: '/creators',
  },
}
