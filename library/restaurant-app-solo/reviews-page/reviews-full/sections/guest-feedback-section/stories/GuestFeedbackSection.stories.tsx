import type { Meta, StoryObj } from '@storybook/react';
import { GuestFeedbackRenderer } from '..';
import { guestFeedbackMocks } from '../data/mock';

const meta: Meta<typeof GuestFeedbackRenderer> = {
  title: 'Domains/Reviews/Guest Feedback Section',
  component: GuestFeedbackRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof GuestFeedbackRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: guestFeedbackMocks['primary'],
  },
};
