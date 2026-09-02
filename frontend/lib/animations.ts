/**
 * Centralized Animation System for Fly Ayla Private Aviation
 * 
 * Defines luxury aviation motion tokens, easings, durations, 
 * spring configurations, stagger timings, and Framer Motion variants.
 * 
 * Strict Single Responsibility Principle:
 * Any adjustments to durations or easings can be made here globally.
 */

export const motionTokens = {
  // Durations (in seconds)
  durationFast: 0.18,      // Micro-interactions (hover, active, icons)
  durationNormal: 0.28,    // Cards, dropdowns, tooltips
  durationMedium: 0.45,    // Modals, drawers, step transitions
  durationSlow: 0.65,      // Section reveals, major headings
  durationHero: 0.8,       // Hero entrance, atmospheric effects

  // Stagger timings (in seconds)
  staggerSmall: 0.05,      // Fast lists, chips, badges
  staggerNormal: 0.08,     // Metric cards, feature grids
  staggerLarge: 0.12,      // Major hero elements, steps

  // Premium Easing Curves
  // Luxury exponential deceleration: instantaneous response, buttery soft landing
  easeLuxury: [0.16, 1, 0.3, 1] as const,
  // Smooth cubic ease out
  easeOutCubic: [0.215, 0.61, 0.355, 1] as const,
  // Standard ease in out for backdrops and cross-fades
  easeInOutSmooth: [0.4, 0, 0.2, 1] as const,

  // Viewport trigger settings for once-only section reveals
  viewportSettings: {
    once: true,
    amount: 0.15,
    margin: '0px 0px -40px 0px'
  }
} as const;

// Transition presets
export const transitions = {
  luxury: {
    duration: motionTokens.durationSlow,
    ease: motionTokens.easeLuxury
  },
  standard: {
    duration: motionTokens.durationNormal,
    ease: motionTokens.easeOutCubic
  },
  fast: {
    duration: motionTokens.durationFast,
    ease: motionTokens.easeOutCubic
  },
  modal: {
    duration: motionTokens.durationMedium,
    ease: motionTokens.easeLuxury
  },
  dropdown: {
    duration: motionTokens.durationFast,
    ease: motionTokens.easeOutCubic
  }
};

// Motion Variants for Framer Motion / Motion components
export const animationVariants = {
  // Fade in only
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: transitions.standard
    },
    exit: {
      opacity: 0,
      transition: transitions.fast
    }
  },

  // Reveal Section: Fade + Subtle Slide Up (20-25px)
  revealSection: {
    hidden: { 
      opacity: 0, 
      y: 24 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.luxury
    }
  },

  // Slide Up
  slideUp: {
    hidden: { 
      opacity: 0, 
      y: 16 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.standard
    }
  },

  // Slide Down
  slideDown: {
    hidden: { 
      opacity: 0, 
      y: -16 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.standard
    }
  },

  // Scale in
  scaleIn: {
    hidden: { 
      opacity: 0, 
      scale: 0.96 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: transitions.standard
    }
  },

  // Stagger Container (Parent)
  staggerContainer: (staggerDelay: number = motionTokens.staggerNormal, delayChildren: number = 0) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren
      }
    }
  }),

  // Stagger Item (Child)
  staggerItem: {
    hidden: { 
      opacity: 0, 
      y: 18 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: transitions.luxury
    }
  },

  // Modal Backdrop
  modalBackdrop: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: motionTokens.durationNormal, ease: motionTokens.easeInOutSmooth }
    },
    exit: { 
      opacity: 0,
      transition: { duration: motionTokens.durationFast, ease: motionTokens.easeInOutSmooth }
    }
  },

  // Modal Dialog Container
  modalDialog: {
    hidden: { 
      opacity: 0, 
      scale: 0.97, 
      y: 8 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: transitions.modal
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: 6,
      transition: transitions.fast
    }
  },

  // Notification Drawer (Slide from Right)
  drawerRight: {
    hidden: { 
      opacity: 0, 
      x: 32 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: transitions.modal
    },
    exit: { 
      opacity: 0, 
      x: 24,
      transition: transitions.fast
    }
  },

  // Dropdown Popover
  dropdown: {
    hidden: { 
      opacity: 0, 
      scale: 0.98, 
      y: -4 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: transitions.dropdown
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: -4,
      transition: transitions.fast
    }
  },

  // Page Fade Transition
  pageTransition: {
    initial: { 
      opacity: 0, 
      y: 6 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: motionTokens.durationNormal,
        ease: motionTokens.easeLuxury
      }
    },
    exit: { 
      opacity: 0, 
      y: -4,
      transition: {
        duration: motionTokens.durationFast,
        ease: motionTokens.easeInOutSmooth
      }
    }
  },

  // Mask / Overlay Image Reveal (stationary image underneath, mask wipes away)
  imageMaskReveal: {
    hidden: { scaleX: 1 },
    visible: {
      scaleX: 0,
      transition: {
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  },

  // Step Number 360-degree Viewport-Triggered Flip
  stepNumberFlip: {
    hidden: { rotateY: 0 },
    visible: {
      rotateY: 360,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  },

  // Multi-step Form Transition
  stepTransition: {
    initial: (direction: number = 1) => ({
      opacity: 0,
      x: direction > 0 ? 16 : -16
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: motionTokens.durationMedium,
        ease: motionTokens.easeLuxury
      }
    },
    exit: (direction: number = 1) => ({
      opacity: 0,
      x: direction > 0 ? -16 : 16,
      transition: {
        duration: motionTokens.durationFast,
        ease: motionTokens.easeOutCubic
      }
    })
  }
};
