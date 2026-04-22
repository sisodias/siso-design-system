import type { Meta, StoryObj } from '@storybook/react';
import { RatingsSummaryRenderer } from '..';
import { ratingsSummaryMocks } from '../data/mock';

const meta: Meta<typeof RatingsSummaryRenderer> = {
  title: 'Domains/Reviews / RatingsSummary',
  component: RatingsSummaryRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof RatingsSummaryRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: ratingsSummaryMocks['primary'],
  },
};
