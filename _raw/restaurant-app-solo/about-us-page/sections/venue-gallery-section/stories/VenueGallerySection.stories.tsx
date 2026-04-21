import type { Meta, StoryObj } from '@storybook/react';
import { VenueGalleryRenderer } from '..';
import { venueGalleryMocks } from '../data/mock';

const meta: Meta<typeof VenueGalleryRenderer> = {
  title: 'Domains/About Us/Venue Gallery',
  component: VenueGalleryRenderer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof VenueGalleryRenderer>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    content: venueGalleryMocks.primary,
  },
};

export const Template2: Story = {
  args: {
    variant: 'template-2',
    content: venueGalleryMocks['template-2'],
  },
};

export const Template3: Story = {
  args: {
    variant: 'template-3',
    content: venueGalleryMocks['template-3'],
  },
};
