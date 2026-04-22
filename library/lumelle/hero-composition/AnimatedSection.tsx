'use client'

import type { ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useHydrateOnView } from '@/domains/shared/hooks/useHydrateOnView'

type AnimatedSectionProps = {
  children: ReactNode
  staggerDelay?: number // Time between child animations (default: 0.15s)
  threshold?: number // IntersectionObserver threshold (default: 0.2)
  className?: string
}

/**
 * Wrapper component that adds scroll-triggered fade-in animations to children.
 * Uses Framer Motion for smooth animations and IntersectionObserver for viewport detection.
 *
 * @example
 * <AnimatedSection>
 *   <motion.h1 variants={itemVariants}>Headline</motion.h1>
 *   <motion.p variants={itemVariants}>Subtext</motion.p>
 * </AnimatedSection>
 */
export const AnimatedSection = ({
  children,
  staggerDelay = 0.15,
  threshold = 0.2,
  className = '',
}: AnimatedSectionProps) => {
  const { ref, hydrated } = useHydrateOnView({ threshold })

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2, // Initial delay before first animation
      },
    },
  }

  // Animation variants for individual items
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial="hidden"
      animate={hydrated ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/**
       * We clone children and inject the itemVariants prop.
       * This allows each child to be animated individually.
       */}
      {children}
    </motion.div>
  )
}

// Export item variants for use with direct children
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}
