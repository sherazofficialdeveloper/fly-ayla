'use client';

import React from 'react';
import { 
  ArrowRight,
  ArrowUpRight,
  Plane,
  Calculator,
  FileText,
  CreditCard,
  CheckCircle2,
  Lock,
  Layers,
  Compass,
  Sparkles
} from 'lucide-react';
import { GlobalCmsStore } from '../types/cms';
import { ScrollRevealImage } from '../components/common/ScrollRevealImage';

interface AboutPageProps {
  cmsContent: GlobalCmsStore;
  onRequestFlight: () => void;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onRequestFlight,
  onNavigate
}) => {
  return (
    <div className="w-full flex flex-col bg-[#08080A] text-white">
      
      {/* 1. ABOUT HERO */}
      <section className="relative py-16 sm:py-24 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80" 
            alt="Fly Ayla Aviation" 
            className="w-full h-full object-cover filter grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/85 to-[#08080A]/90" />
        </div>

        {/* Subtle radial glow */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-red-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
              ABOUT FLY AYLA
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight uppercase leading-[1.1] max-w-3xl">
            PRIVATE AVIATION, <br />
            <span className="text-red-500">
              WITH PURPOSE.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl font-normal leading-relaxed">
            Fly Ayla unifies luxury bespoke flight dispatch with modern operational technology, delivering complete pricing transparency, instant quotation telemetry, and seamless flight management across 4,500+ global airfields.
          </p>
        </div>
      </section>

      {/* 2. ABOUT STORY — SPLIT LAYOUT */}
      <section className="py-16 sm:py-24 bg-white text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Aviation Visual Asset */}
            <div className="lg:col-span-6 relative">
              <ScrollRevealImage
                src="https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1200&q=80"
                alt="Aviation Flight Operations"
                aspectRatio="aspect-[4/3]"
                containerClassName="rounded-[8px] overflow-hidden shadow-xl border border-zinc-200 bg-zinc-950"
                overlayClassName="bg-zinc-900"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 sm:p-6 text-white text-left z-20 pointer-events-none">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                    Modern Operations
                  </span>
                  <p className="text-sm sm:text-base font-semibold mt-0.5">
                    Precision flight planning meeting global Part 135 and EASA safety standards.
                  </p>
                </div>
              </ScrollRevealImage>
            </div>

            {/* Right: The Fly Ayla Story */}
            <div className="lg:col-span-6 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-zinc-100 border border-zinc-200">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600">
                  OUR STORY
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950 uppercase leading-tight">
                WHERE AVIATION SERVICE MEETS MODERN TECHNOLOGY.
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                Fly Ayla combines private aviation service with modern technology to simplify flight requests, quotations, bookings and payment management.
              </p>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                Rather than relying on opaque broker markups or endless email chains, our platform automates airway routing, Jet-A fuel index modeling, airport handling tariffs, and navigation charges. Discerning travelers, family offices, and corporate travel departments gain immediate clarity and absolute peace of mind.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3.5 rounded-[6px] bg-zinc-50 border border-zinc-200">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">4,500+</div>
                  <div className="text-zinc-700 mt-0.5 font-medium">VIP FBO Airports Worldwide</div>
                </div>
                <div className="p-3.5 rounded-[6px] bg-zinc-50 border border-zinc-200">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">100%</div>
                  <div className="text-zinc-700 mt-0.5 font-medium">Direct Cost Visibility</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION — 2 PREMIUM CARDS */}
      <section className="py-16 sm:py-24 bg-[#09090C] text-white border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-500">
              CORE PURPOSE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight uppercase leading-tight">
              MISSION &amp; VISION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Card 1: MISSION */}
            <div className="relative p-6 sm:p-7 rounded-[8px] bg-[#0e0f14] border border-white/10 hover:border-white/25 transition-all duration-200 hover:-translate-y-1 group text-left space-y-3.5 shadow-lg">
              <div className="w-10 h-10 rounded-[6px] bg-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                  OUR MISSION
                </span>
                <h3 className="text-lg font-semibold text-white">
                  Seamless &amp; Transparent Aviation
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                Provide a seamless and transparent private aviation experience by delivering accurate flight telemetry, direct tariff visibility, and personal concierge support on every journey.
              </p>
            </div>

            {/* Card 2: VISION */}
            <div className="relative p-6 sm:p-7 rounded-[8px] bg-[#0e0f14] border border-white/10 hover:border-white/25 transition-all duration-200 hover:-translate-y-1 group text-left space-y-3.5 shadow-lg">
              <div className="w-10 h-10 rounded-[6px] bg-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
                  OUR VISION
                </span>
                <h3 className="text-lg font-semibold text-white">
                  One Unified Aviation Ecosystem
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                Build a modern aviation platform that connects customers, operations, pricing and payments in one ecosystem — establishing the global benchmark for private flight agility.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. WHY FLY AYLA — 4 CORE BENEFITS */}
      <section className="py-16 sm:py-24 bg-[#0C0C0F] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-left max-w-2xl mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                THE FLY AYLA STANDARD
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight uppercase leading-tight">
              WHY FLY AYLA.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">
              Four foundational pillars that set our charter experience apart from traditional brokerages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Benefit 1 */}
            <div className="p-5 rounded-[8px] bg-[#0e0f14] border border-white/10 hover:border-white/25 group text-left space-y-3 transition-all duration-200 hover:-translate-y-1 shadow-md">
              <div className="w-9 h-9 rounded-[6px] bg-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Calculator className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Transparent Process</h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                Direct itemization of Jet-A fuel burn, FBO ramp handling fees, navigation tariffs, and crew costs with zero hidden broker markups.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-5 rounded-[8px] bg-[#0e0f14] border border-white/10 hover:border-white/25 group text-left space-y-3 transition-all duration-200 hover:-translate-y-1 shadow-md">
              <div className="w-9 h-9 rounded-[6px] bg-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Personalized Service</h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                Dedicated 24/7 flight concierges tailoring bespoke gourmet catering, tarmac limousine transfers, and rapid customs clearances.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-5 rounded-[8px] bg-[#0e0f14] border border-white/10 hover:border-white/25 group text-left space-y-3 transition-all duration-200 hover:-translate-y-1 shadow-md">
              <div className="w-9 h-9 rounded-[6px] bg-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Plane className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Smart Flight Management</h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                Live flight telemetry, digital passenger manifests, and real-time crew briefing accessible in one VIP executive portal.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="p-5 rounded-[8px] bg-[#0e0f14] border border-white/10 hover:border-white/25 group text-left space-y-3 transition-all duration-200 hover:-translate-y-1 shadow-md">
              <div className="w-9 h-9 rounded-[6px] bg-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Secure Payment Workflow</h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                Encrypted bank wire MT103 validation, corporate cards, and escrow settlement powered by PAYLA FORENSIC compliance oversight.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. TECHNOLOGY / MODERN OPERATIONS — VISUAL WORKFLOW */}
      <section className="py-16 sm:py-24 bg-white text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-left max-w-2xl mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-zinc-100 border border-zinc-200">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600">
                PLATFORM ARCHITECTURE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-950 tracking-tight uppercase leading-tight">
              MODERN OPERATIONS WORKFLOW.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
              How Fly Ayla combines algorithmic telemetry with operations dispatch to eliminate charter friction.
            </p>
          </div>

          {/* Visual Step Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              {
                step: '01',
                title: 'Flight Requests',
                desc: 'Origin, destination, dates, pax, & jet class.',
                icon: Plane
              },
              {
                step: '02',
                title: 'Pricing Engine',
                desc: 'Fuel burn, airway NM, handling, & nav fees.',
                icon: Calculator
              },
              {
                step: '03',
                title: 'Quotations',
                desc: 'Instant, itemized formal proposals issued.',
                icon: FileText
              },
              {
                step: '04',
                title: 'Invoices',
                desc: 'Transparent digital billing with escrow terms.',
                icon: FileText
              },
              {
                step: '05',
                title: 'Payments',
                desc: 'SWIFT wire, card, & PAYLA FORENSIC verification.',
                icon: CreditCard
              },
              {
                step: '06',
                title: 'Booking Management',
                desc: 'Flight crew briefed, slots cleared, VIP escort.',
                icon: CheckCircle2
              }
            ].map((node) => {
              const Icon = node.icon;
              return (
                <div 
                  key={node.step}
                  className="p-4 rounded-[6px] bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all text-left flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-[3px] border border-red-200 uppercase tracking-wider">
                        {node.step}
                      </span>
                      <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                    <h3 className="text-xs font-semibold text-zinc-900">{node.title}</h3>
                    <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed font-normal">{node.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-16 sm:py-24 bg-[#08080C] text-white border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow opacity-50 pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
              READY FOR TAKEOFF
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight uppercase leading-tight">
            READY FOR YOUR NEXT JOURNEY?
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed font-normal">
            Request your private flight and let Fly Ayla handle the details — from instant quotation to tarmac arrival.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onRequestFlight}
              className="px-6 py-3 rounded-[6px] text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-md transition-all flex items-center gap-1.5 cursor-pointer uppercase tracking-wider leading-tight hover:-translate-y-[1px]"
            >
              <span>Request a Flight</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-3 rounded-[6px] text-xs font-semibold text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5 leading-tight hover:-translate-y-[1px]"
            >
              <span>Contact Flight Operations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
