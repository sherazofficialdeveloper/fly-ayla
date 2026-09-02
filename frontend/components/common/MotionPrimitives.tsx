import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'motion/react';
import { motionTokens, animationVariants, transitions } from '../../lib/animations';

/**
 * Section & Container Reveal Primitives
 * Triggers a luxury viewport reveal once per section.
 */
interface RevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  width?: 'full' | 'auto';
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  duration = motionTokens.durationSlow,
  yOffset = 24,
  className = '',
  width = 'full',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={motionTokens.viewportSettings}
      transition={{
        duration,
        delay,
        ease: motionTokens.easeLuxury
      }}
      className={`${width === 'full' ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * FadeIn Component with directional offset support
 */
interface FadeInProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'none',
  delay = 0,
  duration = motionTokens.durationNormal,
  distance = 16,
  className = '',
  ...props
}) => {
  const getInitialOffset = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return {};
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialOffset() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={motionTokens.viewportSettings}
      transition={{
        duration,
        delay,
        ease: motionTokens.easeLuxury
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * SlideUp Component
 */
export const SlideUp: React.FC<FadeInProps> = (props) => (
  <FadeIn direction="up" {...props} />
);

/**
 * ScaleIn Component
 */
interface ScaleInProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = motionTokens.durationNormal,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={motionTokens.viewportSettings}
      transition={{
        duration,
        delay,
        ease: motionTokens.easeLuxury
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger Container & Items
 */
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = motionTokens.staggerNormal,
  delayChildren = 0,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={motionTokens.viewportSettings}
      variants={animationVariants.staggerContainer(staggerDelay, delayChildren)}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<HTMLMotionProps<'div'>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      variants={animationVariants.staggerItem}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * AnimatedCard
 * Provides a standardized subtle hover lift (translateY -4px) and smooth shadow transition
 * without changing existing card background or border colors.
 */
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  enableHoverLift?: boolean;
  enableScale?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  enableHoverLift = true,
  enableScale = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={enableHoverLift ? {
        y: -4,
        scale: enableScale ? 1.01 : 1,
        transition: { duration: motionTokens.durationNormal, ease: motionTokens.easeLuxury }
      } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={`transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Modal Wrapper Primitive
 * Renders backdrop & dialog with AnimatePresence and exact timing specifications.
 */
interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  backdropClassName?: string;
  containerClassName?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-xl',
  backdropClassName = '',
  containerClassName = ''
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants.modalBackdrop}
          onClick={onClose}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto ${backdropClassName}`}
        >
          <motion.div
            key="modal-content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={animationVariants.modalDialog}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} my-8 ${containerClassName}`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Drawer Wrapper Primitive (e.g., Notifications)
 */
interface DrawerWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export const DrawerWrapper: React.FC<DrawerWrapperProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = 'max-w-md'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="drawer-backdrop"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={animationVariants.modalBackdrop}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            key="drawer-content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={animationVariants.drawerRight}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${maxWidth} mt-14`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * PageTransition Component
 * Provides clean, instant-feel crossfade transitions between views without white flash
 */
interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  pageKey,
  className = ''
}) => {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{
        duration: motionTokens.durationNormal,
        ease: motionTokens.easeLuxury
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StepTransition Component for Multi-Step Wizards
 */
interface StepTransitionProps {
  children: React.ReactNode;
  stepKey: string | number;
  direction?: number;
  className?: string;
}

export const StepTransition: React.FC<StepTransitionProps> = ({
  children,
  stepKey,
  direction = 1,
  className = ''
}) => {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={stepKey}
        custom={direction}
        variants={animationVariants.stepTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export { ScrollRevealImage } from './ScrollRevealImage';
export type { ScrollRevealImageProps } from './ScrollRevealImage';

/**
 * AnimatedStepNumber Component
 * 
 * 360-Degree Viewport-Triggered Flip Animation:
 * Applied exclusively to the step number (01, 02, etc.) when its card enters the viewport.
 * Triggers ONCE on viewport entry with smooth 3D perspective.
 */
export interface AnimatedStepNumberProps {
  step: string | number;
  className?: string;
  containerClassName?: string;
  delay?: number;
  duration?: number;
}

export const AnimatedStepNumber: React.FC<AnimatedStepNumberProps> = ({
  step,
  className = '',
  containerClassName = '',
  delay = 0.1,
  duration = 0.65
}) => {
  return (
    <div style={{ perspective: 1000 }} className={`inline-flex items-center justify-center shrink-0 ${containerClassName}`}>
      <motion.div
        initial={{ rotateY: 0 }}
        whileInView={{ rotateY: 360 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'visible' }}
        className={className}
      >
        {step}
      </motion.div>
    </div>
  );
};

