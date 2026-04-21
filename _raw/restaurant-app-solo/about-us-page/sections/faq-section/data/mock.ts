import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { FaqVariant } from '../types';
import type { FaqContent } from '../types/schema';

const baseItems: FaqContent['items'] = [
  {
    id: '1',
    question: 'Do you offer delivery?',
    answer:
      'Absolutely. Order through GrabFood or GoFood for island-wide delivery. In-house courier service launches soon — tax is 5%.',
    category: 'delivery',
    icon: '🛵',
    iconPosition: 'right',
  },
  {
    id: '2',
    question: 'What are your opening hours?',
    answer: 'We brew daily from 08:00 and keep the kitchen running until 23:00 (midnight on weekends).',
    category: 'general',
    icon: '🌙',
    iconPosition: 'left',
  },
  {
    id: '3',
    question: 'Do you have WiFi?',
    answer: 'Yes. Complimentary high-speed WiFi is available throughout the venue — ask the team for the password.',
    category: 'general',
    icon: '📡',
    iconPosition: 'right',
  },
  {
    id: '4',
    question: 'Can you accommodate dietary restrictions?',
    answer: 'We can adapt most dishes for vegetarian preferences and common allergies. Let your host know when ordering.',
    category: 'dining',
  },
  {
    id: '5',
    question: 'What are your signature dishes?',
    answer: 'Nasi Bakar (Ayam & Cumi), Chicken Sambal Matah, and our Espresso Martini top the charts every week.',
    category: 'ordering',
    icon: '⭐',
    iconPosition: 'left',
  },
];

export const faqMocks = defineSectionMocks<FaqVariant, FaqContent>('Faq Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      pillText: 'Need a hand?',
      title: 'Frequently Asked Questions',
      subtitle: 'What guests ask us most before booking',
      items: baseItems,
      showCategories: true,
      timestamp: 'Updated 24 Oct 2025',
      cta: {
        href: 'https://wa.me/6281999777138',
        label: 'Chat with support',
      },
    },
    'template-2': {
      pillText: 'Before You Visit',
      title: 'Answers From Our Concierge Team',
      subtitle: 'Here are the essentials we cover in DMs every week',
      items: baseItems,
      showCategories: true,
      timestamp: 'Updated 24 Oct 2025',
      cta: {
        href: 'mailto:hello@dracobali.com',
        label: 'Email the concierge',
      },
    },
    'template-3': {
      title: 'FAQ Placeholder',
      subtitle: 'Swap for future 21st.dev drop-in',
      items: baseItems.slice(0, 3),
    },
  },
});

export type FaqMockKey = keyof typeof faqMocks;
