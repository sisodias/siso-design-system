import type { Meta, StoryObj } from '@storybook/react';
import { MenuItemCardRenderer } from '..';
import { menuItemCardMocks } from '../data/mock';

const meta: Meta<typeof MenuItemCardRenderer> = {
  title: 'Domains/Menu / MenuItemCard',
  component: MenuItemCardRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MenuItemCardRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: menuItemCardMocks['primary'],
  },
};
