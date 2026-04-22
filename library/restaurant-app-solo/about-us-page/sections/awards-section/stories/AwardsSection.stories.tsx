import type { Meta, StoryObj } from '@storybook/react';
import { AwardsRenderer } from '..';
import { awardsMocks } from '../data/mock';

const meta: Meta<typeof AwardsRenderer> = {
  title: 'Domains/About Us/Awards',
  component: AwardsRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof AwardsRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: awardsMocks.primary,
  },
};

export const TemplateTwo: Story = {
  args: {
    variant: 'template-2',
    content: awardsMocks['template-2'],
  },
};

export const TemplateThree: Story = {
  args: {
    variant: 'template-3',
    content: awardsMocks['template-3'],
  },
};
