import type { Meta, StoryObj } from '@storybook/react';
import { FilterBarRenderer } from '..';
import { filterBarMocks } from '../data/mock';

const meta: Meta<typeof FilterBarRenderer> = {
  title: 'Domains/Reviews / FilterBar',
  component: FilterBarRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof FilterBarRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: filterBarMocks['primary'],
  },
};
