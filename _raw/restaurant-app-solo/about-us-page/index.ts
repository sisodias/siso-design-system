/**
 * About Us Domain - Public API
 */

// Main Page
export { default as AboutPage } from './pages/AboutPage';
export type { AboutPageData, AboutPageProps } from './pages/AboutPage';

// Hero Section
export { HeroRenderer, renderHero, heroRegistry, getHeroVariants } from './sections/hero-section';
export type { HeroContent, HeroVariant } from './sections/hero-section';

// Cuisine Philosophy Section
export {
  CuisinePhilosophyRenderer,
  renderCuisinePhilosophy,
  cuisinePhilosophyRegistry,
  getCuisinePhilosophyVariants,
} from './sections/cuisine-philosophy-section';
export type {
  CuisinePhilosophyContent,
  CuisinePhilosophyVariant,
  PhilosophyPoint,
} from './sections/cuisine-philosophy-section';

// Story Section
export { StoryRenderer, renderStory, storyRegistry, getStoryVariants } from './sections/story-section';
export type { StoryContent, StoryVariant, StoryMilestone } from './sections/story-section';

// Team Section
export { TeamRenderer, renderTeam, teamRegistry, getTeamVariants } from './sections/team-section';
export type { TeamContent, TeamVariant, TeamMember } from './sections/team-section';

// Values Section
export { ValuesRenderer, renderValues, valuesRegistry, getValuesVariants } from './sections/values-section';
export type { ValuesContent, ValuesVariant, ValuesItem, ValuesIcon } from './sections/values-section';

// Venue Gallery Section
export {
  VenueGalleryRenderer,
  renderVenueGallery,
  venueGalleryRegistry,
  getVenueGalleryVariants,
} from './sections/venue-gallery-section';
export type {
  VenueGalleryContent,
  VenueGalleryVariant,
  VenueGalleryImage,
} from './sections/venue-gallery-section';

// Awards Section
export { AwardsRenderer, renderAwards, awardsRegistry, getAwardsVariants } from './sections/awards-section';
export type {
  AwardsContent,
  AwardsVariant,
  AwardsGoogleRating,
  CustomerTestimonial,
  AchievementBadge,
} from './sections/awards-section';

// Location Section
export { LocationRenderer, renderLocation, locationRegistry, getLocationVariants } from './sections/location-section';
export type {
  LocationContent,
  LocationVariant,
  LocationContactMethod,
  LocationOperatingHour,
} from './sections/location-section';

// FAQ Section
export { FaqRenderer, renderFaq, faqRegistry, getFaqVariants } from './sections/faq-section';
export type { FaqContent, FaqVariant, FaqItem, FaqCategory, FaqCta } from './sections/faq-section';

// CTA Section
export { CtaRenderer, renderCta, ctaRegistry, getCtaVariants } from './sections/cta-section';
export type { CtaContent, CtaVariant, DeliveryPartner } from './sections/cta-section';
