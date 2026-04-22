import type { Meta, StoryObj } from '@storybook/react';
import { MenuItemDetailRenderer } from '..';
import { menuItemDetailMocks } from '../data/mock';

const meta: Meta<typeof MenuItemDetailRenderer> = {
  title: 'Domains/Menu / MenuItemDetail',
  component: MenuItemDetailRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MenuItemDetailRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: menuItemDetailMocks['primary'],
    isOpen: true,
  },
};
