import React from 'react';
import { Shield, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { TrustIntroCmsContent } from '../../types/cms';
import { ScrollRevealImage } from '../common/ScrollRevealImage';

interface TrustIntroSectionProps {
  content?: TrustIntroCmsContent;
  onRequestFlight?: () => void;
}

export const TrustIntroSection: React.FC<TrustIntroSectionProps> = ({
  content,
  onRequestFlight
}) => {
  const tag = content?.tag ?? 'PRIVATE AVIATION, SIMPLIFIED';
  const title = content?.title ?? 'A modern, transparent way to fly private';
  const description = content?.description ?? 'Traditional private jet charter has always been burdened by manual phone calls, hidden brokerage markups, and delayed quotes. Fly Ayla simplifies every step from your initial flight request to confirmed tarmac departure.';
  const image = content?.image ?? 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80';
  const points = content?.points ?? [
    {
      title: 'Instant Flight Requests',
      description: 'Submit your departure, destination, schedule, and passenger requirements in seconds.'
    },
    {
      title: 'Intelligent Route & Fleet Matching',
      description: 'Our aviation engine calculates real flight paths, block times, and pairs the ideal aircraft for your mission.'
    },
    {
      title: 'Transparent Pricing & Digital Invoicing',
      description: 'Receive an itemized quote reflecting actual fuel, handling, and navigation fees with zero hidden surprises.'
    },
    {
      title: 'Guaranteed 24/7 Operations Support',
      description: 'Dedicated flight coordinators manage diplomatic clearances, FBO handling, and tarmac concierge around the clock.'
    }
  ];

  return (
    <section id="section-trust-intro" className="py-24 sm:py-32 bg-white text-zinc-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              {tag}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 uppercase leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 2-Column High-Impact Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: High-End Aircraft Visual with Floating Stats Card */}
          <div className="lg:col-span-6 relative">
            <ScrollRevealImage
              src={image}
              alt="Fly Ayla Private Jet On Tarmac"
              aspectRatio="aspect-[4/3] sm:aspect-[16/11]"
              containerClassName="rounded-[8px] overflow-hidden border border-zinc-200 shadow-2xl group bg-zinc-950"
              overlayClassName="bg-zinc-900"
              className="group-hover:scale-104 transition-transform duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent z-20 pointer-events-none" />
              
              {/* Bottom Badge Over Image */}
              <div className="absolute bottom-6 left-6 right-6 text-white z-20 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-red-600/90 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider mb-2">
                  <span>ARG/US Platinum &amp; Wyvern Standards</span>
                </div>
                <div className="text-lg sm:text-xl font-semibold">
                  Precision in Every Flight Stage
                </div>
                <p className="text-xs text-zinc-300 mt-0.5 font-normal">
                  Dedicated handling at over 4,500 VIP FBO terminals globally.
                </p>
              </div>
            </ScrollRevealImage>

            {/* Floating Trust Indicator Pill */}
            <div className="absolute -bottom-4 -right-2 sm:right-4 bg-zinc-950 text-white p-3.5 sm:p-4 rounded-[6px] shadow-2xl border border-zinc-800 max-w-xs hidden sm:block z-30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[4px] bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 font-semibold shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] text-zinc-400 font-medium">Response Speed</div>
                  <div className="text-xs font-semibold text-white">&lt; 3 Hours Dispatch</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Core Capabilities */}
          <div className="lg:col-span-6 space-y-4">
            {points.map((pt, idx) => (
              <div 
                key={pt.title}
                className="group relative p-6 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50 transition-all duration-300 red-accent-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white text-sm font-semibold flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-600 transition-colors">
                    0{idx + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-950 tracking-tight flex items-center gap-2">
                      {pt.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] sm:text-sm text-zinc-600 leading-relaxed font-normal">
                      {pt.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Action Button */}
            <div className="pt-4 flex items-center gap-4">
              {onRequestFlight && (
                <button
                  onClick={onRequestFlight}
                  className="px-6 py-3 rounded-lg text-sm font-semibold tracking-wide uppercase text-white bg-zinc-950 hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer leading-tight"
                >
                  <span>Request a Flight</span>
                  <ArrowRight className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
