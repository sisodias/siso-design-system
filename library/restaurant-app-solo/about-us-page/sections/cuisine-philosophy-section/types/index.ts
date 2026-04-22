import type { ComponentType } from 'react';
import type { CuisinePhilosophyContent, PhilosophyPoint } from './schema';

export type CuisinePhilosophyVariant = 'primary' | 'template-2' | 'template-3';

export interface CuisinePhilosophyRendererProps {
  variant?: CuisinePhilosophyVariant;
  content: CuisinePhilosophyContent;
  fallbackVariant?: CuisinePhilosophyVariant;
}

export type CuisinePhilosophyComponent = ComponentType<CuisinePhilosophyContent>;
export type { CuisinePhilosophyContent, PhilosophyPoint };
