'use client';

import React from 'react';
import { HeroSection } from '../components/public/HeroSection';
import { ServicesSection } from '../components/public/ServicesSection';
import { HowItWorksSteps } from '../components/public/HowItWorksSteps';
import { CtaBannerSection } from '../components/public/CtaBannerSection';
import { GlobalCmsStore } from '../types/cms';
import { Aircraft } from '../types/aviation';
import { FLEET_AIRCRAFT } from '../data/mockData';
import { ScrollRevealImage } from '../components/common/ScrollRevealImage';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Users, 
  Compass, 
  Gauge, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  cmsContent: GlobalCmsStore;
  onRequestFlight: (payload?: any) => void;
  onNavigate: (page: string, params?: any) => void;
  onSelectAircraft: (aircraft: Aircraft) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  cmsContent,
  onRequestFlight,
  onNavigate,
  onSelectAircraft
}) => {
  // Only 4 featured aircraft for the homepage
  const featuredAircraft = FLEET_AIRCRAFT.slice(0, 4);

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO SECTION */}
      <HeroSection
        content={cmsContent.hero}
        onRequestFlight={onRequestFlight}
        onExploreHowItWorks={() => onNavigate('fleet')}
        onSelectAircraft={onSelectAircraft}
      />

      {/* 2. INTRODUCTION / VALUE PROPOSITION ("PRIVATE AVIATION, SIMPLIFIED.") */}
      <section className="py-20 bg-white text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Content & 3 Concise Benefits */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 font-mono">
                  {cmsContent.trustIntro?.eyebrow || 'PRIVATE AVIATION, SIMPLIFIED'}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 uppercase leading-tight">
                {cmsContent.trustIntro?.headline || 'A MODERN, TRANSPARENT WAY TO FLY PRIVATE.'}
              </h2>

              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
                {cmsContent.trustIntro?.description || 
                  'Fly Ayla helps customers request private flights, select aircraft, receive transparent quotations, and complete their booking through one professional platform.'}
              </p>

              {/* 3 Concise Benefits */}
              <div className="pt-4 space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200 red-accent-card">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">Direct Cost Visibility</h3>
                    <p className="text-sm text-zinc-600 mt-1 leading-relaxed">Instant flight telemetry and direct fuel index calculations without hidden broker markups.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200 red-accent-card">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">Global Safety &amp; Airfield Access</h3>
                    <p className="text-sm text-zinc-600 mt-1 leading-relaxed">Certified Part 135 &amp; EASA Ops compliance with access to over 4,500 VIP FBO airports worldwide.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-200 red-accent-card">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">24/7 Dedicated Flight Dispatch</h3>
                    <p className="text-sm text-zinc-600 mt-1 leading-relaxed">Personal flight concierges coordinating slots, customs clearance, and bespoke in-flight catering.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-red-600 uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Learn more about Fly Ayla</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: High-End Aviation Image */}
            <div className="lg:col-span-6 relative">
              <ScrollRevealImage
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80"
                alt="Fly Ayla Private Jet"
                aspectRatio="aspect-[4/3]"
                containerClassName="rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 bg-zinc-900"
                overlayClassName="bg-zinc-950"
                className="hover:scale-105 transition-transform duration-700"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8 text-white text-left z-20 pointer-events-none">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
                    Bespoke Flight Experience
                  </span>
                  <p className="text-base sm:text-lg font-semibold mt-1">
                    Every detail orchestrated for total comfort, privacy, and schedule agility.
                  </p>
                </div>
              </ScrollRevealImage>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION ("FLY YOUR WAY.") */}
      <ServicesSection
        content={cmsContent.services}
        onRequestService={onRequestFlight}
      />

      {/* 4. HOW IT WORKS SECTION ("FROM REQUEST TO TAKEOFF.") */}
      <HowItWorksSteps
        content={cmsContent.howItWorks}
        onRequestFlight={onRequestFlight}
      />

      {/* 5. FEATURED FLEET SECTION ("THE RIGHT AIRCRAFT FOR EVERY JOURNEY.") */}
      <section className="py-20 bg-[#08080B] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-left">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
                  GLOBAL CHARTER FLEET
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
                THE RIGHT AIRCRAFT FOR EVERY JOURNEY.
              </h2>
              <p className="text-base text-zinc-300 mt-2 max-w-2xl">
                Explore our curated fleet of modern executive aircraft, from agile light jets to ultra-long-range intercontinental flagships.
              </p>
            </div>

            <div className="mt-6 md:mt-0">
              <button
                onClick={() => onNavigate('fleet')}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>View All Aircraft</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Featured Aircraft Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAircraft.map((jet) => (
              <div
                key={jet.id}
                className="group relative bg-[#101015] rounded-2xl border border-white/10 hover:border-red-500/40 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-xl red-accent-card cursor-pointer"
                onClick={() => {
                  onSelectAircraft(jet);
                  onNavigate('aircraft-detail', { aircraftId: jet.id });
                }}
              >
                {/* Aircraft Image with Zoom */}
                <ScrollRevealImage
                  src={jet.image}
                  alt={jet.name}
                  aspectRatio="aspect-[16/10]"
                  containerClassName="overflow-hidden bg-zinc-950"
                  overlayClassName="bg-[#101015]"
                  className="group-hover:scale-110 transition-transform duration-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101015] via-transparent to-black/30 z-20 pointer-events-none" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-black/70 backdrop-blur-md text-red-400 border border-red-500/30 uppercase">
                      {jet.category}
                    </span>
                  </div>
                </ScrollRevealImage>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between text-left space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                      {jet.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 mt-1">
                      {jet.description}
                    </p>
                  </div>

                  {/* Specs Pill Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs sm:text-sm font-mono">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Users className="w-3.5 h-3.5 text-red-500" />
                      <span>{jet.maxPassengers} Pax</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Compass className="w-3.5 h-3.5 text-red-500" />
                      <span>{jet.maxRangeNm.toLocaleString()} NM</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Gauge className="w-3.5 h-3.5 text-red-500" />
                      <span>{jet.cruiseSpeedKts} kts</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-red-500" />
                      <span>{jet.hourlyFuelBurnGal} gal/hr</span>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2">
                    <div className="w-full py-3 px-3.5 rounded-xl bg-white/5 group-hover:bg-red-600 text-zinc-200 group-hover:text-white text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-between transition-all duration-300">
                      <span>View Aircraft</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. FINAL CTA BANNER SECTION */}
      <CtaBannerSection
        content={cmsContent.ctaBanner}
        onRequestFlight={onRequestFlight}
        onContactOperations={() => onNavigate('contact')}
      />
    </div>
  );
};
