import type { Meta, StoryObj } from '@storybook/react';
import { FaqRenderer } from '..';
import { faqMocks } from '../data/mock';

const meta: Meta<typeof FaqRenderer> = {
  title: 'Domains/About Us/FAQ',
  component: FaqRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof FaqRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: faqMocks.primary,
  },
};

export const Template2: Story = {
  args: {
    variant: 'template-2',
    content: faqMocks['template-2'],
  },
};

export const Template3: Story = {
  args: {
    variant: 'template-3',
    content: faqMocks['template-3'],
  },
};
