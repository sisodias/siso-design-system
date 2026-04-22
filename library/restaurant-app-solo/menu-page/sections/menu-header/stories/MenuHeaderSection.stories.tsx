import type { Meta, StoryObj } from '@storybook/react';
import { MenuHeaderRenderer } from '..';
import { menuHeaderMocks } from '../data/mock';

const meta: Meta<typeof MenuHeaderRenderer> = {
  title: 'Domains/Menu / MenuHeader',
  component: MenuHeaderRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MenuHeaderRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: menuHeaderMocks['primary'],
  },
};
