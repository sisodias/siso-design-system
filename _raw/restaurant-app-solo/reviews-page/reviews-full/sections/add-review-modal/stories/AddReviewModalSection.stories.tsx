import type { Meta, StoryObj } from '@storybook/react';
import { AddReviewModalRenderer } from '..';
import { addReviewModalMocks } from '../data/mock';

const meta: Meta<typeof AddReviewModalRenderer> = {
  title: 'Domains/Reviews / AddReviewModal',
  component: AddReviewModalRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof AddReviewModalRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: addReviewModalMocks['primary'],
  },
};
