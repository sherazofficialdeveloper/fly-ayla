import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Star, Quote as QuoteIcon, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { TestimonialsCmsContent } from '../../types/cms';

interface TestimonialsSectionProps {
  content?: TestimonialsCmsContent;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ content }) => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [itemsPerView, setItemsPerView] = useState<number>(3);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const tag = content?.tag ?? 'CLIENT EXPERIENCES';
  const title = content?.title ?? 'TRUSTED BY DISCERNING TRAVELERS.';
  const description = content?.description ?? 'Read how leading family offices, sovereign delegations, corporate flight departments, and global executives rely on Fly Ayla for precision private aviation.';
  
  const rawTestimonials = content?.testimonials && content.testimonials.length > 0 
    ? content.testimonials.filter(t => t.active !== false)
    : [
      {
        id: 'test-1',
        quote: 'Fly Ayla delivered a Challenger 350 to Paris Le Bourget in under three hours when our scheduled flight was grounded. The transparency of the quote and direct cost breakdown was extraordinary.',
        authorName: 'T. Vandermeer',
        authorTitle: 'Family Office Principal',
        companyOrFleet: 'Geneva / London',
        initials: 'TV',
        rating: 5,
        active: true
      },
      {
        id: 'test-2',
        quote: 'Pricing multi-stop international flights used to take an entire day of back-and-forth broker negotiations. Fly Ayla calculates real Jet-A fuel burn, handling, and overflight costs instantly.',
        authorName: 'M. Al-Sabah',
        authorTitle: 'Executive Director',
        companyOrFleet: 'Gulf Executive Delegation',
        initials: 'MA',
        rating: 5,
        active: true
      },
      {
        id: 'test-3',
        quote: 'The level of service from tarmac greeting to onboard dining was flawless. No hidden broker markups or post-trip surprise invoices.',
        authorName: 'C. Kensington',
        authorTitle: 'Managing Partner',
        companyOrFleet: 'Private Equity Group',
        initials: 'CK',
        rating: 5,
        active: true
      },
      {
        id: 'test-4',
        quote: 'Managing emergency medical transports requires immediate response. Fly Ayla coordinated diplomatic overflight permits and ambulance apron access without a minute wasted.',
        authorName: 'Dr. H. Sterling',
        authorTitle: 'Chief Medical Coordinator',
        companyOrFleet: 'International Aeromedical Services',
        initials: 'HS',
        rating: 5,
        active: true
      },
      {
        id: 'test-5',
        quote: 'Our executive committee flew across Zurich, Dubai, and Singapore over five consecutive days. Every FBO transfer and catering requirement was executed to absolute perfection.',
        authorName: 'A. De la Tour',
        authorTitle: 'Head of Global Travel Operations',
        companyOrFleet: 'European Industrial Conglomerate',
        initials: 'AT',
        rating: 5,
        active: true
      },
      {
        id: 'test-6',
        quote: 'The JetFuelX dynamic pricing integration provides genuine cost clarity. We can review fuel burn metrics and landing fees before authorizing the flight dispatch.',
        authorName: 'R. Sterling-Hale',
        authorTitle: 'Director of Flight Assets',
        companyOrFleet: 'Sovereign Wealth Advisory',
        initials: 'RS',
        rating: 5,
        active: true
      },
      {
        id: 'test-7',
        quote: 'Fly Ayla has redefined how our sports agency books intercontinental charter for talent tours. Zero friction, instant dispatch confirmation, and impeccable aircraft standards.',
        authorName: 'E. Nakamura',
        authorTitle: 'Vice President of Operations',
        companyOrFleet: 'Global Athletic Management',
        initials: 'EN',
        rating: 5,
        active: true
      }
    ];

  const totalItems = rawTestimonials.length;

  // Measure container dimensions & responsive items per view accurately
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(width);
        
        let perView = 3;
        if (width < 600) {
          perView = 1;
        } else if (width < 960) {
          perView = 2;
        } else {
          perView = 3;
        }
        setItemsPerView(perView);

        // Clamp currentIndex if window resize lowers maxIndex
        const newMax = Math.max(0, totalItems - perView);
        setCurrentIndex((prev) => Math.min(prev, newMax));
      }
    };

    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [totalItems]);

  const maxIndex = Math.max(0, totalItems - itemsPerView);
  const gapPx = itemsPerView === 1 ? 16 : 24;

  // Calculate card width and exact track shift
  const cardWidth = containerWidth > 0
    ? (containerWidth - (itemsPerView - 1) * gapPx) / itemsPerView
    : 0;

  const currentTranslateX = currentIndex * (cardWidth + gapPx);

  // Navigation handlers with strict boundary protection
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) return prev;
      return prev + 1;
    });
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return 0;
      return prev - 1;
    });
  }, []);

  // Subtle auto-advance (5.5 seconds) - strictly STOPS at the final testimonial (FIRST -> LAST)
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;
    if (currentIndex >= maxIndex) return; // Halt at the end

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex, maxIndex, shouldReduceMotion]);

  // Touch / Mobile Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      // Swiped left -> advance
      nextSlide();
    } else if (diff < -45) {
      // Swiped right -> go back
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section 
      id="section-testimonials" 
      className="py-16 sm:py-24 bg-[#08080B] text-white border-b border-white/10 relative overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient subtle glow background */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 text-left gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10 mb-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                {tag}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight uppercase leading-tight">
              {title}
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              {description}
            </p>
          </div>

          {/* Navigation Controls & Counter */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <span className="text-xs font-mono text-zinc-400 font-medium tracking-wider">
              {String(currentIndex + 1).padStart(2, '0')} / {String(maxIndex + 1).padStart(2, '0')}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                id="testimonial-prev-btn"
                onClick={prevSlide}
                disabled={currentIndex <= 0}
                aria-label="Previous testimonial"
                className="p-2 sm:p-2.5 rounded-[6px] bg-zinc-900 border border-white/10 text-zinc-300 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-zinc-800 hover:enabled:text-white hover:enabled:border-white/25 active:enabled:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="testimonial-next-btn"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                aria-label="Next testimonial"
                className="p-2 sm:p-2.5 rounded-[6px] bg-zinc-900 border border-white/10 text-zinc-300 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-zinc-800 hover:enabled:text-white hover:enabled:border-white/25 active:enabled:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div 
          ref={containerRef}
          className="overflow-hidden w-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="flex"
            animate={{
              x: -currentTranslateX
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0.1 }
                : {
                    type: 'spring',
                    stiffness: 280,
                    damping: 32,
                    mass: 0.7
                  }
            }
            style={{
              gap: `${gapPx}px`
            }}
          >
            {rawTestimonials.map((item) => (
              <div
                key={item.id}
                style={{
                  width: cardWidth > 0 ? `${cardWidth}px` : '100%',
                  flexShrink: 0
                }}
                className="flex flex-col"
              >
                <div
                  className="h-full min-h-[290px] sm:min-h-[310px] p-6 sm:p-7 rounded-[8px] bg-[#0d0e13] border border-white/10 hover:border-white/25 shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  <div className="space-y-4">
                    {/* Top Reference Quote Icon & Star Rating */}
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-[4px] bg-red-950/50 border border-red-500/30 text-red-500 flex items-center justify-center shadow-sm">
                        <QuoteIcon className="w-4 h-4 fill-red-500/20" />
                      </div>

                      {/* 5-Star Rating */}
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    {/* Quote Text */}
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal text-left">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author Information */}
                  <div className="pt-4 mt-6 border-t border-white/10 flex items-center gap-3 text-left">
                    <div className="w-9 h-9 rounded-[4px] bg-red-600/90 text-white font-semibold text-xs flex items-center justify-center border border-red-500/40 shadow-md shrink-0">
                      {item.initials}
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 truncate">
                        <span>{item.authorName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      </div>
                      <div className="text-[11px] text-zinc-400 font-normal truncate">{item.authorTitle}</div>
                      <div className="text-[10px] text-zinc-500 font-normal truncate">{item.companyOrFleet}</div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots (Exactly matches maxIndex + 1 valid pages/indices) */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-8 sm:mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to testimonial card ${dotIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === dotIdx 
                    ? 'w-6 bg-red-600' 
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default TestimonialsSection;
