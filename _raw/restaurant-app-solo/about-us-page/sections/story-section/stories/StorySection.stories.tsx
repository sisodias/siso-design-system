import type { Meta, StoryObj } from '@storybook/react';
import { StoryRenderer } from '..';
import { storyMocks } from '../data/mock';

const meta: Meta<typeof StoryRenderer> = {
  title: 'Domains/About Us/Story',
  component: StoryRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof StoryRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: storyMocks['primary'],
  },
};

export const Template2: Story = {
  args: {
    variant: 'template-2',
    content: storyMocks['template-2'],
  },
};

export const Template3: Story = {
  args: {
    variant: 'template-3',
    content: storyMocks['template-3'],
  },
};
