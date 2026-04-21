import type { Meta, StoryObj } from '@storybook/react';
import { InstagramRenderer } from '..';
import { instagramMocks } from '../data/mock';

const meta: Meta<typeof InstagramRenderer> = {
  title: 'Domains/Landing / InstagramSection',
  component: InstagramRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof InstagramRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: instagramMocks['primary'],
  },
};
