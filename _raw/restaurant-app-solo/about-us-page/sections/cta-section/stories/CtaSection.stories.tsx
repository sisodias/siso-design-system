import type { Meta, StoryObj } from '@storybook/react';
import { CtaRenderer } from '..';
import { ctaMocks } from '../data/mock';

const meta: Meta<typeof CtaRenderer> = {
  title: 'Domains/About Us/CTA',
  component: CtaRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof CtaRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: ctaMocks['primary'],
  },
};

export const Template2: Story = {
  args: {
    variant: 'template-2',
    content: ctaMocks['template-2'],
  },
};

export const Template3: Story = {
  args: {
    variant: 'template-3',
    content: ctaMocks['template-3'],
  },
};
