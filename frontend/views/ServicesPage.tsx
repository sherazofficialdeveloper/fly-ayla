'use client';

import React from 'react';
import { 
  Plane, 
  Briefcase, 
  Crown, 
  Users, 
  Flame, 
  Sparkles, 
  Wifi, 
  Coffee, 
  Bed, 
  ShieldCheck, 
  ArrowUpRight,
  ArrowRight,
  HeartPulse,
  Navigation
} from 'lucide-react';
import { GlobalCmsStore } from '../types/cms';
import { ScrollRevealImage } from '../components/common/ScrollRevealImage';

interface ServicesPageProps {
  cmsContent: GlobalCmsStore;
  onRequestFlight: () => void;
  onNavigate: (page: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  cmsContent,
  onRequestFlight,
  onNavigate
}) => {
  const fullServices = [
    {
      id: 'private-charter',
      title: 'Private Jet Charter',
      tagline: 'ON-DEMAND FLIGHTS',
      description: 'Fly anywhere in the world on your exact schedule. Access over 4,500 private airfields with zero commercial terminal queues or delays.',
      icon: Plane,
      features: ['Personalized departure slot', 'Discreet private VIP terminal', 'Bespoke in-flight catering']
    },
    {
      id: 'executive-travel',
      title: 'Executive & C-Suite Travel',
      tagline: 'BUSINESS MOBILITY',
      description: 'Equipped with ultra-fast Ka-Band Wi-Fi and confidential cabin boardrooms so executive teams maintain full productivity in transit.',
      icon: Briefcase,
      features: ['High-speed satellite connectivity', 'Guaranteed privacy & NDA dispatch', 'Multi-city same-day itineraries']
    },
    {
      id: 'corporate-aviation',
      title: 'Corporate Aviation Programs',
      tagline: 'FLEET LOGISTICS',
      description: 'Streamlined enterprise accounts offering transparent fixed-rate blocks, automated invoicing, and dedicated flight managers.',
      icon: Crown,
      features: ['Centralized enterprise billing', 'Priority aircraft availability', 'Customized monthly reporting']
    },
    {
      id: 'group-travel',
      title: 'Group Delegations & Events',
      tagline: 'HIGH-CAPACITY JETS',
      description: 'Seamless group charters for international summits, sports teams, roadshows, and private delegations with customized branding.',
      icon: Users,
      features: ['Custom branded headrests & menus', 'Dedicated tarmac baggage coordination', 'Coordinated VIP transfers']
    },
    {
      id: 'medical-air-ambulance',
      title: 'Medical Evacuation & Cargo',
      tagline: 'CRITICAL DISPATCH',
      description: 'Rapid-response medical flights with on-board intensive care units, specialized medical teams, and express airspace clearances.',
      icon: HeartPulse,
      features: ['Under 2-hour dispatch readiness', 'Bed-to-bed medical escort', 'Express diplomatic overflight permits']
    },
    {
      id: 'last-mile-helicopter',
      title: 'Helicopter & Last-Mile Transfers',
      tagline: 'AIRPORT TO DESTINATION',
      description: 'Direct transfers from major international hub runways to ski resorts, yachts, private estates, and downtown heliports.',
      icon: Navigation,
      features: ['Direct runway-to-chopper transfer', 'Access to restricted mountain pads', 'Zero ground traffic delay']
    }
  ];

  return (
    <div className="w-full flex flex-col bg-[#08080A] text-white">
      {/* 1. HERO */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80" 
            alt="Services Atmosphere" 
            className="w-full h-full object-cover filter grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/80 to-[#08080A]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
              FLIGHT SERVICES
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-tight max-w-4xl">
            FLY YOUR WAY, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">EVERY TIME.</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
            From single-leg executive charters to complex multi-continental corporate shuttles, Fly Ayla provides complete aviation solutions tailored to your operational requirements.
          </p>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-20 bg-white text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 font-mono">
              FULL SERVICE SPECTRUM
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 uppercase mt-1">
              COMPREHENSIVE PRIVATE AVIATION SOLUTIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fullServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="group relative p-8 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-red-500/40 hover:bg-zinc-50/80 transition-all duration-300 flex flex-col justify-between shadow-sm red-accent-card cursor-pointer"
                  onClick={onRequestFlight}
                >
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center group-hover:bg-red-600 transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded border border-red-200">
                        {srv.tagline}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 group-hover:text-red-600 transition-colors">
                      {srv.title}
                    </h3>

                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {srv.description}
                    </p>

                    <div className="pt-3 border-t border-zinc-200 space-y-1.5">
                      {srv.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-800 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="w-full py-3 px-4 rounded-xl bg-zinc-900 group-hover:bg-red-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-between transition-colors">
                      <span>Request This Service</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. BESPOKE IN-FLIGHT AMENITIES */}
      <section className="py-20 bg-[#0A0A0E] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
                THE CABIN ATMOSPHERE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                DESIGNED FOR MAXIMUM PRODUCTIVITY &amp; RELAXATION.
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Whether you require a secure airborne boardroom at 45,000 feet or a restful sanctuary across time zones, our aircraft cabins are prepared according to your precise specifications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <Wifi className="w-5 h-5 text-red-500" />
                  <div className="text-xs sm:text-sm font-bold text-white">Ka-Band Wi-Fi</div>
                  <div className="text-xs text-zinc-300">Stream 4K video and host video conferences seamlessly.</div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <Coffee className="w-5 h-5 text-red-500" />
                  <div className="text-xs sm:text-sm font-bold text-white">Michelin Dining</div>
                  <div className="text-xs text-zinc-300">Custom menus and sommeliers paired to your dietary choices.</div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <Bed className="w-5 h-5 text-red-500" />
                  <div className="text-xs sm:text-sm font-bold text-white">Lie-Flat Berthing</div>
                  <div className="text-xs text-zinc-300">Full mattress setup with Egyptian cotton linens.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <ScrollRevealImage
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Jet Interior"
                aspectRatio="aspect-[4/3]"
                containerClassName="rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-zinc-950"
                overlayClassName="bg-[#0A0A0E]"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-16 bg-zinc-950 text-center border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Have a custom travel requirement?
          </h2>
          <p className="text-base text-zinc-300">
            Our 24/7 flight operations desk is ready to configure your multi-leg itinerary or specialized charter.
          </p>
          <button
            onClick={onRequestFlight}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl shadow-red-950/80 cursor-pointer"
          >
            Request Flight Quote
          </button>
        </div>
      </section>
    </div>
  );
};
