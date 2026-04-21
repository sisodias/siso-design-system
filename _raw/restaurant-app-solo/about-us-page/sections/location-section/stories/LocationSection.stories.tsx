import type { Meta, StoryObj } from '@storybook/react';
import { LocationRenderer } from '..';
import { locationMocks } from '../data/mock';

const meta: Meta<typeof LocationRenderer> = {
  title: 'Domains/About Us/Location',
  component: LocationRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof LocationRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: locationMocks.primary,
  },
};

export const Template2: Story = {
  args: {
    variant: 'template-2',
    content: locationMocks['template-2'],
  },
};

export const Template3: Story = {
  args: {
    variant: 'template-3',
    content: locationMocks['template-3'],
  },
};
