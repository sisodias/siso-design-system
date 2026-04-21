import type { Meta, StoryObj } from '@storybook/react';
import { ImageLightboxRenderer } from '..';
import { imageLightboxMocks } from '../data/mock';

const meta: Meta<typeof ImageLightboxRenderer> = {
  title: 'Domains/Reviews / ImageLightbox',
  component: ImageLightboxRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ImageLightboxRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: imageLightboxMocks['primary'],
  },
};
