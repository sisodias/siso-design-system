import type { Meta, StoryObj } from '@storybook/react';
import { HeroRenderer } from '..';
import { heroMocks } from '../data/mock';

const meta: Meta<typeof HeroRenderer> = {
  title: 'Domains/About Us/Hero',
  component: HeroRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof HeroRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: heroMocks.primary,
  },
};

export const TemplateTwo: Story = {
  args: {
    variant: 'template-2',
    content: heroMocks['template-2'],
  },
};

export const TemplateThree: Story = {
  args: {
    variant: 'template-3',
    content: heroMocks['template-3'],
  },
};
