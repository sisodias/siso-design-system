import type { Meta, StoryObj } from '@storybook/react';
import { ValuesRenderer } from '..';
import { valuesMocks } from '../data/mock';

const meta: Meta<typeof ValuesRenderer> = {
  title: 'Domains/About Us/Values',
  component: ValuesRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ValuesRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: valuesMocks.primary,
  },
};

export const Template2: Story = {
  args: {
    variant: 'template-2',
    content: valuesMocks['template-2'],
  },
};

export const Template3: Story = {
  args: {
    variant: 'template-3',
    content: valuesMocks['template-3'],
  },
};
