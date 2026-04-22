import type { Meta, StoryObj } from '@storybook/react';
import { ReviewCardRenderer } from '..';
import { reviewCardMocks } from '../data/mock';

const meta: Meta<typeof ReviewCardRenderer> = {
  title: 'Domains/Reviews / ReviewCard',
  component: ReviewCardRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ReviewCardRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: reviewCardMocks['primary'],
  },
};
