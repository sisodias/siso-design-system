import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { VenueGalleryVariant } from '../types';
import type { VenueGalleryContent } from '../types/schema';

const baseImages: VenueGalleryContent['images'] = [
  {
    id: 'barista-latte-art',
    url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2069&auto=format&fit=crop',
    alt: 'Barista pouring a latte with precise art',
    category: 'coffee',
    caption: 'Our baristas finish every cup with a signature flourish.',
  },
  {
    id: 'dining-room',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    alt: 'Warm interior dining room at sunset',
    category: 'interior',
  },
  {
    id: 'signature-dish',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2070&auto=format&fit=crop',
    alt: 'Signature dish plated with tropical herbs',
    category: 'food',
  },
  {
    id: 'garden-terrace',
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1974&auto=format&fit=crop',
    alt: 'Outdoor terrace surrounded by tropical plants',
    category: 'outdoor',
  },
  {
    id: 'espresso-martini',
    url: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?q=80&w=1974&auto=format&fit=crop',
    alt: 'Espresso martini cocktail on the bar',
    category: 'coffee',
  },
  {
    id: 'live-dj',
    url: 'https://images.unsplash.com/photo-1521337580396-0259d528230e?q=80&w=1987&auto=format&fit=crop',
    alt: 'DJ spinning records for the late-night crowd',
    category: 'atmosphere',
  },
  {
    id: 'dessert',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    alt: 'Dessert trio with seasonal fruit',
    category: 'food',
  },
  {
    id: 'pour-over-station',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
    alt: 'Pour-over coffee station with Chemex brewers',
    category: 'coffee',
  },
  {
    id: 'lounge',
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
    alt: 'Evening lounge area with mood lighting',
    category: 'atmosphere',
  },
];

export const venueGalleryMocks = defineSectionMocks<VenueGalleryVariant, VenueGalleryContent>('Venue Gallery Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      pillText: 'Step Inside',
      title: 'The Draco Atmosphere',
      subtitle: 'A peek at the craft, community, and glow of our space',
      intro: 'From sunrise espresso rituals to late-night vinyl sets, our space shifts with the rhythm of the day.',
      images: baseImages,
      showCategories: true,
      cta: {
        label: 'Book a walkthrough',
        href: 'mailto:events@dracobali.com',
      },
    },
    'template-2': {
      pillText: 'Gallery Highlight',
      title: 'Life at Draco in Motion',
      subtitle: 'A continuous reel of the energy inside our venue',
      intro: 'Press play on the vibe—perfect for plasma walls or landing page hero sections.',
      layout: 'slider',
      images: baseImages.slice(0, 6),
      showCategories: true,
    },
    'template-3': {
      title: 'Venue Gallery Placeholder',
      subtitle: 'Reserved for upcoming 21st.dev drop-in',
      layout: 'masonry',
      images: baseImages.slice(0, 3),
    },
  },
});

export type VenueGalleryMockKey = keyof typeof venueGalleryMocks;
