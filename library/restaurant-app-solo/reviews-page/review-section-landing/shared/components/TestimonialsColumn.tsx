"use client";

import React from 'react';
import { motion } from 'motion/react';

export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
  rating?: number;
}

interface TestimonialsColumnProps {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
}

export function TestimonialsColumn({ testimonials, duration = 10, className }: TestimonialsColumnProps) {
  if (!testimonials.length) return null;

  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[0, 1].map((loopIndex) => (
          <React.Fragment key={loopIndex}>
            {testimonials.map(({ text, image, name, role }, index) => (
              <div
                className="w-full max-w-xs rounded-3xl border border-white/10 bg-white/90 p-10 shadow-lg shadow-primary/10"
                key={`${loopIndex}-${index}`}
              >
                <div className="text-gray-900">{text}</div>
                <div className="mt-5 flex items-center gap-2">
                  <img
                    src={image}
                    alt={name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-900 font-medium leading-5 tracking-tight">{name}</p>
                    <p className="text-gray-600 text-sm leading-5 tracking-tight">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
