import type { Meta, StoryObj } from '@storybook/react';
import { CuisinePhilosophyRenderer } from '..';
import { cuisinePhilosophyMocks } from '../data/mock';

const meta: Meta<typeof CuisinePhilosophyRenderer> = {
  title: 'Domains/About Us/Cuisine Philosophy',
  component: CuisinePhilosophyRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof CuisinePhilosophyRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: cuisinePhilosophyMocks['primary'],
  },
};

export const Template2: Story = {
  args: {
    variant: 'template-2',
    content: cuisinePhilosophyMocks['template-2'],
  },
};

export const Template3: Story = {
  args: {
    variant: 'template-3',
    content: cuisinePhilosophyMocks['template-3'],
  },
};
