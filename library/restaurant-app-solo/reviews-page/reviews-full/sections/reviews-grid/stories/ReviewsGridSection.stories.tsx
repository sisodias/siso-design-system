import type { Meta, StoryObj } from '@storybook/react';
import { ReviewsGridRenderer } from '..';
import { reviewsGridMocks } from '../data/mock';

const meta: Meta<typeof ReviewsGridRenderer> = {
  title: 'Domains/Reviews / ReviewsGrid',
  component: ReviewsGridRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ReviewsGridRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: reviewsGridMocks['primary'],
  },
};
