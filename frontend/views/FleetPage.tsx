'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Compass, 
  Gauge, 
  Clock, 
  ArrowUpRight, 
  Filter, 
  Plane,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Aircraft, AircraftCategory } from '../types/aviation';
import { GlobalCmsStore } from '../types/cms';
import { ScrollRevealImage } from '../components/common/ScrollRevealImage';

interface FleetPageProps {
  fleet: Aircraft[];
  cmsContent: GlobalCmsStore;
  onSelectAircraft: (aircraft: Aircraft) => void;
  onRequestFlight: (aircraft?: Aircraft) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const FleetPage: React.FC<FleetPageProps> = ({
  fleet,
  cmsContent,
  onSelectAircraft,
  onRequestFlight,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: (AircraftCategory | 'All')[] = [
    'All',
    'Light Jet',
    'Midsize',
    'Super Midsize',
    'Heavy Jet',
    'Ultra Long Range',
    'Turboprop'
  ];

  const filteredFleet = fleet.filter((ac) => {
    const matchesCat = selectedCategory === 'All' || ac.category === selectedCategory;
    const matchesSearch = 
      ac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ac.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col bg-[#08080A] text-white">
      {/* 1. HERO */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80" 
            alt="Fly Ayla Fleet" 
            className="w-full h-full object-cover filter grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/80 to-[#08080A]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
              EXECUTIVE FLEET
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-tight max-w-4xl">
            THE RIGHT AIRCRAFT FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">EVERY MISSION.</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
            From nimble light jets accessing tight Alpine runways to ultra-long-range intercontinental jets connecting London to Tokyo nonstop, explore our curated global charter fleet.
          </p>
        </div>
      </section>

      {/* 2. FLEET FILTER & LISTING */}
      <section className="py-16 bg-[#0B0B0E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search aircraft or class..."
                className="w-full bg-white/5 border border-white/15 focus:border-red-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="text-left mb-6 text-xs text-zinc-400 font-mono">
            Showing {filteredFleet.length} {filteredFleet.length === 1 ? 'aircraft' : 'aircraft'} in charter fleet
          </div>

          {/* Aircraft Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.map((jet) => (
              <div
                key={jet.id}
                className="group relative bg-[#121218] rounded-2xl border border-white/10 hover:border-red-500/40 overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-xl red-accent-card"
              >
                {/* Image */}
                <ScrollRevealImage
                  src={jet.image}
                  alt={jet.name}
                  aspectRatio="aspect-[16/10]"
                  containerClassName="overflow-hidden bg-zinc-950"
                  overlayClassName="bg-[#121218]"
                  className="group-hover:scale-110 transition-transform duration-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-black/30 z-20 pointer-events-none" />
                  
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/90 backdrop-blur-md text-red-400 border border-red-500/40 uppercase">
                      {jet.category}
                    </span>
                  </div>

                  {jet.status && (
                    <div className="absolute top-3 right-3 z-20">
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 uppercase">
                        {jet.status}
                      </span>
                    </div>
                  )}
                </ScrollRevealImage>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                  <div>
                    <div className="text-xs font-mono font-semibold text-zinc-300 uppercase">
                      {jet.manufacturer}
                    </div>
                    <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors mt-0.5">
                      {jet.name}
                    </h3>
                    <p className="text-sm text-zinc-300 line-clamp-2 mt-1.5 leading-relaxed">
                      {jet.description}
                    </p>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10 text-xs sm:text-sm font-mono">
                    <div className="flex items-center gap-2 text-zinc-200">
                      <Users className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{jet.maxPassengers} Passengers</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-200">
                      <Compass className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{jet.maxRangeNm.toLocaleString()} NM Range</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-200">
                      <Gauge className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{jet.cruiseSpeedKts} kts Cruise</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-200">
                      <Clock className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{jet.hourlyFuelBurnGal} gal/hr</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onSelectAircraft(jet);
                        onNavigate('aircraft-detail', { aircraftId: jet.id });
                      }}
                      className="py-3 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-colors cursor-pointer"
                    >
                      View Specs
                    </button>

                    <button
                      onClick={() => {
                        onSelectAircraft(jet);
                        onRequestFlight(jet);
                      }}
                      className="py-3 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-colors shadow-lg shadow-red-950/50 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Request</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFleet.length === 0 && (
            <div className="py-16 text-center text-zinc-500 space-y-3">
              <Plane className="w-10 h-10 mx-auto text-zinc-600 animate-pulse" />
              <div className="text-sm font-medium">No aircraft match your filter criteria.</div>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-red-500 hover:underline uppercase"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 3. CUSTOM SOURCING BANNER */}
      <section className="py-16 bg-white text-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-50 border border-zinc-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 font-mono">
                BESPOKE SOURCING
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase">
                Need a specific aircraft or VIP airliner?
              </h3>
              <p className="text-sm text-zinc-600 max-w-2xl">
                Through our global operator network, Fly Ayla can source any heavy jet, Boeing Business Jet (BBJ), or Airbus Corporate Jet (ACJ) worldwide within hours.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <button
                onClick={() => onRequestFlight()}
                className="px-6 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Inquire With Dispatch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
