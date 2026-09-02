import React, { useState } from 'react';
import { 
  Plane, 
  Users, 
  Gauge, 
  Fuel, 
  ArrowRight, 
  Compass, 
  Check, 
  Maximize2, 
  X,
  Sparkles,
  Luggage
} from 'lucide-react';
import { FLEET_AIRCRAFT } from '../../data/mockData';
import { Aircraft, AircraftCategory } from '../../types/aviation';
import { ScrollRevealImage } from '../common/ScrollRevealImage';

interface FleetSectionProps {
  onSelectAircraftForQuote: (aircraft: Aircraft) => void;
}

export const FleetSection: React.FC<FleetSectionProps> = ({ onSelectAircraftForQuote }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalAircraft, setActiveModalAircraft] = useState<Aircraft | null>(null);

  const categories = ['All', 'Ultra Long Range', 'Heavy Jet', 'Super Midsize', 'Light Jet'];

  const filteredFleet = selectedCategory === 'All'
    ? FLEET_AIRCRAFT
    : FLEET_AIRCRAFT.filter(ac => ac.category === selectedCategory);

  return (
    <section id="section-fleet" className="py-24 bg-[#09090B] border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-red-500 font-semibold tracking-[0.2em] text-xs uppercase">
              LUXURY FLEET CATALOG
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Curated Private Aircraft
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              From transcontinental ultra-long-range flagships to agile light jets. Every aircraft in our fleet meets ARG/US Platinum and Wyvern Wingman standards.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/40'
                    : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFleet.map((aircraft) => (
            <div
              key={aircraft.id}
              className="group bg-zinc-950 rounded-[8px] border border-white/10 hover:border-white/25 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Aircraft Photo & Badge */}
              <ScrollRevealImage
                src={aircraft.image}
                alt={aircraft.name}
                aspectRatio="aspect-auto"
                containerClassName="h-52 sm:h-56 bg-zinc-900"
                overlayClassName="bg-zinc-950"
                className="transition-transform duration-700 group-hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-20 pointer-events-none" />
                
                {/* Category Pill */}
                <div className="absolute top-3.5 left-3.5 z-20">
                  <span className="px-2.5 py-0.5 rounded-[4px] text-[10px] font-semibold tracking-wide uppercase bg-black/80 backdrop-blur-md text-zinc-200 border border-white/15">
                    {aircraft.category}
                  </span>
                </div>

                {/* Quick inspect button */}
                <button
                  onClick={() => setActiveModalAircraft(aircraft)}
                  className="absolute top-3.5 right-3.5 p-1.5 rounded-[4px] bg-black/60 hover:bg-black/90 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
                  title="View Specs"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Bottom Model Name */}
                <div className="absolute bottom-3 left-4 right-4 text-left z-20 pointer-events-none">
                  <div className="text-xs text-red-400 font-medium">{aircraft.manufacturer}</div>
                  <h3 className="text-lg font-semibold text-white tracking-tight">{aircraft.name}</h3>
                </div>
              </ScrollRevealImage>

              {/* Specs Matrix */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2 font-normal text-left">
                  {aircraft.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center">
                  <div className="p-2 rounded-[6px] bg-zinc-900/70 border border-white/5">
                    <div className="icon-flip-wrapper mx-auto mb-1">
                      <div className="icon-box-interactive icon-flip-target">
                        <Users className="w-3.5 h-3.5 text-red-500" />
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-white">{aircraft.maxPassengers} Pax</div>
                    <div className="text-[11px] text-zinc-400 font-normal">Capacity</div>
                  </div>
                  <div className="p-2 rounded-[6px] bg-zinc-900/70 border border-white/5">
                    <div className="icon-flip-wrapper mx-auto mb-1">
                      <div className="icon-box-interactive icon-flip-target">
                        <Compass className="w-3.5 h-3.5 text-red-500" />
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-white">{aircraft.maxRangeNm} NM</div>
                    <div className="text-[11px] text-zinc-400 font-normal">Max Range</div>
                  </div>
                  <div className="p-2 rounded-[6px] bg-zinc-900/70 border border-white/5">
                    <div className="icon-flip-wrapper mx-auto mb-1">
                      <div className="icon-box-interactive icon-flip-target">
                        <Gauge className="w-3.5 h-3.5 text-red-500" />
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-white">{aircraft.cruiseSpeedKts} kts</div>
                    <div className="text-[11px] text-zinc-400 font-normal">Speed</div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5 text-left">
                  {aircraft.features.slice(0, 3).map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-xs text-zinc-300 font-normal">
                      <Check className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveModalAircraft(aircraft)}
                    className="flex-1 py-2.5 px-3 rounded-[6px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold border border-white/10 transition-colors cursor-pointer leading-tight"
                  >
                    View Specs
                  </button>
                  <button
                    onClick={() => onSelectAircraftForQuote(aircraft)}
                    className="flex-1 py-2.5 px-3 rounded-[6px] bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-red-950/40 active:scale-98 cursor-pointer leading-tight"
                  >
                    <span>Instant Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Aircraft Details Modal */}
      {activeModalAircraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <button
              onClick={() => setActiveModalAircraft(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-red-500 text-xs font-semibold uppercase tracking-wider">
                  {activeModalAircraft.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeModalAircraft.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-normal">Manufacturer: {activeModalAircraft.manufacturer}</p>
              </div>

              <div className="h-64 rounded-xl overflow-hidden bg-zinc-900">
                <img
                  src={activeModalAircraft.image}
                  alt={activeModalAircraft.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                {activeModalAircraft.description}
              </p>

              {/* Extended Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-zinc-900/80 border border-white/10 text-xs">
                <div>
                  <span className="text-zinc-500 font-normal">Max Range:</span>
                  <div className="font-semibold text-white">{activeModalAircraft.maxRangeNm} Nautical Miles</div>
                </div>
                <div>
                  <span className="text-zinc-500 font-normal">Max Cruise Speed:</span>
                  <div className="font-semibold text-white">{activeModalAircraft.cruiseSpeedKts} Knots (Mach 0.85+)</div>
                </div>
                <div>
                  <span className="text-zinc-500 font-normal">Max Passengers:</span>
                  <div className="font-semibold text-white">{activeModalAircraft.maxPassengers} VIP Seats</div>
                </div>
                <div>
                  <span className="text-zinc-500 font-normal">Cabin Height / Width:</span>
                  <div className="font-semibold text-white">{activeModalAircraft.cabinHeightFt} ft &times; {activeModalAircraft.cabinWidthFt} ft</div>
                </div>
                <div>
                  <span className="text-zinc-500 font-normal">Baggage Volume:</span>
                  <div className="font-semibold text-white">{activeModalAircraft.baggageCuFt} cu. ft.</div>
                </div>
                <div>
                  <span className="text-zinc-500 font-normal">Fuel Burn Index:</span>
                  <div className="font-semibold text-white">{activeModalAircraft.hourlyFuelBurnGal} gal / hour</div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                  Cabin Features &amp; Equipment
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeModalAircraft.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-200 font-normal">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => setActiveModalAircraft(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white text-sm font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const chosen = activeModalAircraft;
                    setActiveModalAircraft(null);
                    onSelectAircraftForQuote(chosen);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-950/50 cursor-pointer"
                >
                  Configure Charter on this Jet
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
