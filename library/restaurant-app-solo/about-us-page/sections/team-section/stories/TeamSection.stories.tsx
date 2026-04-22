import type { Meta, StoryObj } from '@storybook/react';
import { TeamRenderer } from '..';
import { teamMocks } from '../data/mock';

const meta: Meta<typeof TeamRenderer> = {
  title: 'Domains/AboutUs / TeamSection',
  component: TeamRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof TeamRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: teamMocks['primary'],
  },
};

export const Template2: Story = {
  args: {
    variant: 'template-2',
    content: teamMocks['template-2'],
  },
};

export const Template3: Story = {
  args: {
    variant: 'template-3',
    content: teamMocks['template-3'],
  },
};
