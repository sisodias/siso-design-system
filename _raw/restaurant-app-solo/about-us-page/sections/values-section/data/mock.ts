import { defineSectionMocks } from '@/domains/shared/section-tools';
import type { ValuesVariant } from '../types';
import type { ValuesContent } from '../types/schema';

const coreValues: ValuesContent['values'] = [
  {
    id: 'craft',
    icon: 'star',
    title: 'Craft Over Convenience',
    description: 'Every pour, plate, and playlist is tuned by hand. We choose techniques that honour flavour even when they take longer.',
  },
  {
    id: 'local',
    icon: 'sprout',
    title: 'Rooted in Bali',
    description: 'We champion island growers and collaborate with neighbours so that every visit invests back into the community.',
  },
  {
    id: 'hospitality',
    icon: 'heart',
    title: 'Hospitality by Name',
    description: 'From the welcome at the door to the final refill, we take cues from guests and tailor the experience to their pace.',
  },
  {
    id: 'team',
    icon: 'users',
    title: 'Team-Led Momentum',
    description: 'We build career pathways for baristas, chefs, and hosts through ongoing training, mentorship, and shared wins.',
  },
  {
    id: 'sustainability',
    icon: 'globe',
    title: 'Planet-Minded Decisions',
    description: 'Compostable packaging, mindful sourcing, and energy tracking keep our footprint as light as our pastries.',
  },
  {
    id: 'innovation',
    icon: 'coffee',
    title: 'Curiosity Fueled',
    description: 'Seasonal tastings, experimental roasts, and chef collabs keep delight on the menu for returning regulars.',
  },
];

export const valuesMocks = defineSectionMocks<ValuesVariant, ValuesContent>('Values Section', {
  defaultVariant: 'primary',
  variants: {
    primary: {
      pillText: 'Our DNA',
      title: 'What Powers Draco',
      subtitle: 'Values that drive every cup and conversation',
      values: coreValues,
    },
    'template-2': {
      pillText: 'Culture Code',
      title: 'Hospitality Is a Team Sport',
      subtitle: 'The principles we coach every new teammate on day one',
      description:
        'We operate like a creative studio with a hospitality heart. Each value keeps the espresso dialled in and the service intuitive.',
      values: [
        coreValues[3],
        coreValues[0],
        coreValues[2],
        coreValues[5],
        coreValues[4],
        coreValues[1],
      ],
    },
    'template-3': {
      title: 'Values Placeholder',
      subtitle: 'Reserved for future 21st.dev drop-in',
      description:
        'This dataset is shared so designers have realistic content when swapping in a new component.',
      values: coreValues.slice(0, 3),
    },
  },
});

export type ValuesMockKey = keyof typeof valuesMocks;
