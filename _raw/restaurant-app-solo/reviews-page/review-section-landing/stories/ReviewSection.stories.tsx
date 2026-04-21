import type { Meta, StoryObj } from '@storybook/react';
import { ReviewRenderer } from '..';
import { reviewMocks } from '../data/mock';

const meta: Meta<typeof ReviewRenderer> = {
  title: 'Domains/Landing / ReviewSection',
  component: ReviewRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ReviewRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: reviewMocks['primary'],
  },
};

export const Classic: Story = {
  args: {
    variant: 'classic',
    content: reviewMocks['classic'],
  },
};

export const Modern: Story = {
  args: {
    variant: 'modern',
    content: reviewMocks['modern'],
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    content: reviewMocks['minimal'],
  },
};

export const Featured: Story = {
  args: {
    variant: 'featured',
    content: reviewMocks['featured'],
  },
};

export const Testimonial: Story = {
  args: {
    variant: 'testimonial',
    content: reviewMocks['testimonial'],
  },
};

export const Grid: Story = {
  args: {
    variant: 'grid',
    content: reviewMocks['grid'],
  },
};

export const GlassSwiper: Story = {
  args: {
    variant: 'glass-swiper',
    content: reviewMocks['glass-swiper'],
  },
};

export const ImageMasonry: Story = {
  args: {
    variant: 'image-masonry',
    content: reviewMocks['image-masonry'],
  },
};

export const StaggerCards: Story = {
  args: {
    variant: 'stagger-cards',
    content: reviewMocks['stagger-cards'],
  },
};

export const AnimatedStack: Story = {
  args: {
    variant: 'animated-stack',
    content: reviewMocks['animated-stack'],
  },
};

export const ScrollingColumns: Story = {
  args: {
    variant: 'scrolling-columns',
    content: reviewMocks['scrolling-columns'],
  },
};
