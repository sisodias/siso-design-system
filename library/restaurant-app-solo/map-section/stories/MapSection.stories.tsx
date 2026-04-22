import type { Meta, StoryObj } from '@storybook/react';
import { MapRenderer } from '..';
import { mapMocks } from '../data/mock';

const meta: Meta<typeof MapRenderer> = {
  title: 'Domains/Landing / MapSection',
  component: MapRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MapRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: mapMocks['primary'],
  },
};
