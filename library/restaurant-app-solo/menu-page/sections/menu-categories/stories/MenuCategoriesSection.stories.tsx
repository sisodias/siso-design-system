import type { Meta, StoryObj } from '@storybook/react';
import { MenuCategoriesRenderer } from '..';
import { menuCategoriesMocks } from '../data/mock';

const meta: Meta<typeof MenuCategoriesRenderer> = {
  title: 'Domains/Menu / MenuCategories',
  component: MenuCategoriesRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MenuCategoriesRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: menuCategoriesMocks['primary'],
  },
};
