'use client';

import React from 'react';
import { 
  ArrowLeft, 
  Users, 
  Compass, 
  Gauge, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Wifi, 
  Coffee, 
  Bed, 
  ArrowUpRight,
  Plane
} from 'lucide-react';
import { Aircraft } from '../types/aviation';
import { FLEET_AIRCRAFT } from '../data/mockData';
import { ScrollRevealImage } from '../components/common/ScrollRevealImage';

interface AircraftDetailPageProps {
  aircraft?: Aircraft;
  aircraftId?: string;
  onBackToFleet: () => void;
  onRequestFlight: (aircraft: Aircraft) => void;
}

export const AircraftDetailPage: React.FC<AircraftDetailPageProps> = ({
  aircraft,
  aircraftId,
  onBackToFleet,
  onRequestFlight
}) => {
  // Fallback to first aircraft if not passed directly
  const selectedAircraft = aircraft || FLEET_AIRCRAFT.find(a => a.id === aircraftId) || FLEET_AIRCRAFT[0];

  return (
    <div className="w-full flex flex-col bg-[#08080A] text-white">
      {/* 1. TOP NAV & BREADCRUMB */}
      <div className="border-b border-white/10 bg-[#0B0B0E] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToFleet}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white uppercase tracking-wide transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Fleet</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-red-400 uppercase px-3 py-1 bg-red-950/60 border border-red-500/40 rounded-full tracking-wide">
              {selectedAircraft.category}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN AIRCRAFT SHOWCASE */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Image Showcase & Amenities */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <ScrollRevealImage
                src={selectedAircraft.image}
                alt={selectedAircraft.name}
                aspectRatio="aspect-[16/10]"
                containerClassName="rounded-[8px] overflow-hidden shadow-2xl border border-white/15 bg-zinc-950"
                overlayClassName="bg-[#090a0e]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6 z-20 pointer-events-none">
                  <div>
                    <span className="text-xs text-zinc-200 uppercase tracking-wider bg-black/80 px-3 py-1 rounded-[4px] font-medium border border-white/10">
                      {selectedAircraft.manufacturer} &bull; {selectedAircraft.tailNumber || 'GLOBAL CHARTER'}
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-bold text-white uppercase mt-1.5 tracking-tight">
                      {selectedAircraft.name}
                    </h1>
                  </div>
                </div>
              </ScrollRevealImage>

              {/* Cabin Amenities Grid */}
              <div className="p-6 rounded-2xl bg-[#101015] border border-white/10 space-y-4">
                <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider text-zinc-200">
                  VIP Cabin Amenities &amp; Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedAircraft.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-200 bg-white/5 p-3 rounded-xl border border-white/5 font-normal">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-200 bg-white/5 p-3 rounded-xl border border-white/5 font-normal">
                    <Wifi className="w-4 h-4 text-red-500 shrink-0" />
                    <span>High-Speed Ka-Band Satellite Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-200 bg-white/5 p-3 rounded-xl border border-white/5 font-normal">
                    <Coffee className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Full Galley with Hot Catering Oven</span>
                  </div>
                </div>
              </div>

              {/* Aircraft Description */}
              <div className="p-6 rounded-2xl bg-[#101015] border border-white/10 space-y-3">
                <h3 className="text-sm sm:text-base font-semibold uppercase tracking-wider text-zinc-200">
                  Aircraft Overview
                </h3>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-normal">
                  {selectedAircraft.description}
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  Configured with an executive club arrangement, soundproofed cabin architecture, and certified for global non-stop intercontinental charter routes.
                </p>
              </div>
            </div>

            {/* Right Column: Key Specifications & Booking Action */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* Specs Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-[#101015] border border-white/15 space-y-6 shadow-2xl">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs text-zinc-400 uppercase font-medium tracking-wide">Performance Specs</span>
                    <h2 className="text-xl font-semibold text-white uppercase mt-0.5">{selectedAircraft.name}</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-red-400 bg-red-950/60 border border-red-500/40 uppercase tracking-wide">
                    {selectedAircraft.category}
                  </span>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 flex items-center gap-2 font-normal">
                      <Users className="w-4 h-4 text-red-500" />
                      Passenger Capacity
                    </span>
                    <span className="text-white font-semibold text-sm">{selectedAircraft.maxPassengers} Guests</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 flex items-center gap-2 font-normal">
                      <Compass className="w-4 h-4 text-red-500" />
                      Maximum Non-Stop Range
                    </span>
                    <span className="text-white font-semibold text-sm">{selectedAircraft.maxRangeNm.toLocaleString()} NM</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 flex items-center gap-2 font-normal">
                      <Gauge className="w-4 h-4 text-red-500" />
                      Cruising Speed
                    </span>
                    <span className="text-white font-semibold text-sm">{selectedAircraft.cruiseSpeedKts} Knots (M 0.80+)</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 flex items-center gap-2 font-normal">
                      <Clock className="w-4 h-4 text-red-500" />
                      Average Hourly Fuel Burn
                    </span>
                    <span className="text-white font-semibold text-sm">{selectedAircraft.hourlyFuelBurnGal} Gal/Hour</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 flex items-center gap-2 font-normal">
                      <Plane className="w-4 h-4 text-red-500" />
                      Cabin Dimensions (H &times; W)
                    </span>
                    <span className="text-white font-semibold text-sm">{selectedAircraft.cabinHeightFt} ft &times; {selectedAircraft.cabinWidthFt} ft</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-zinc-400 flex items-center gap-2 font-normal">
                      <Sparkles className="w-4 h-4 text-red-500" />
                      Luggage Capacity
                    </span>
                    <span className="text-white font-semibold text-sm">{selectedAircraft.baggageCuFt} Cu Ft</span>
                  </div>

                </div>

                {/* Direct Request CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => onRequestFlight(selectedAircraft)}
                    className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-sm font-semibold uppercase tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-red-950/80 transition-all cursor-pointer leading-tight"
                  >
                    <span>Request This Aircraft</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-zinc-400 mt-3 font-normal">
                    Instant automated quotation with live airfield handling tariffs.
                  </p>
                </div>

              </div>

              {/* Safety & Compliance Badge */}
              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <div className="font-semibold text-white">Full Safety &amp; Audit Compliance</div>
                  <div className="text-zinc-300 mt-1 leading-relaxed font-normal">
                    Operated exclusively by Part 135 certified air carriers with dual-captain flight crews and ARG/US Gold ratings.
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
};
