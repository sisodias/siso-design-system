import type { Meta, StoryObj } from '@storybook/react';
import { MenuCategorySelectorRenderer } from '..';
import { menuCategorySelectorMocks } from '../data/mock';

const meta: Meta<typeof MenuCategorySelectorRenderer> = {
  title: 'Domains/Menu / MenuCategorySelector',
  component: MenuCategorySelectorRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MenuCategorySelectorRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: menuCategorySelectorMocks['primary'],
  },
};
