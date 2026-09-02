import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface ScrollRevealImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  overlayClassName?: string;
  aspectRatio?: string;
  direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom';
  duration?: number;
  delay?: number;
  threshold?: number;
  objectFit?: 'cover' | 'contain';
  objectPosition?: string;
  loading?: 'lazy' | 'eager';
  children?: React.ReactNode;
}

/**
 * ScrollRevealImage Component
 * 
 * Stationary Image Scroll-Triggered Mask/Overlay Reveal:
 * - The image occupies its correct final position from the initial render.
 * - The image NEVER flies, shifts, or bounces.
 * - An overlay mask covers the image initially and smoothly wipes away once when scrolled into view.
 * - Supports prefers-reduced-motion for accessibility.
 * - Mobile-safe with zero layout shifts or horizontal overflow.
 */
export const ScrollRevealImage: React.FC<ScrollRevealImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  overlayClassName = 'bg-[#090a0e]',
  aspectRatio = 'aspect-[4/3]',
  direction = 'left-to-right',
  duration = 0.85,
  delay = 0.1,
  threshold = 0.2,
  objectFit = 'cover',
  objectPosition = 'center',
  loading = 'lazy',
  children
}) => {
  const shouldReduceMotion = useReducedMotion();
  const originX = direction === 'right-to-left' ? 1 : 0;
  const isVertical = direction === 'top-to-bottom';

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${containerClassName}`}>
      {/* 1. Stationary Image - occupies final layout position without translation */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full select-none ${objectFit === 'cover' ? 'object-cover' : 'object-contain'} ${className}`}
        style={{ objectPosition }}
        referrerPolicy="no-referrer"
        loading={loading}
      />

      {/* 2. Scroll-triggered Reveal Mask / Overlay */}
      {!shouldReduceMotion && (
        <motion.div
          initial={isVertical ? { scaleY: 1, originY: 0 } : { scaleX: 1, originX }}
          whileInView={isVertical ? { scaleY: 0 } : { scaleX: 0 }}
          viewport={{ once: true, amount: threshold }}
          transition={{
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1]
          }}
          className={`absolute inset-0 z-10 pointer-events-none ${overlayClassName}`}
        />
      )}

      {/* 3. Optional Overlay Children (captions, badges, gradients) */}
      {children}
    </div>
  );
};

export default ScrollRevealImage;
