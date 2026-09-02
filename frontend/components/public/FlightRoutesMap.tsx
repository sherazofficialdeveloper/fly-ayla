import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Plane, 
  Navigation, 
  Clock, 
  Fuel, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { GLOBAL_AIRPORTS, calculateDistanceNm, formatBlockHours } from '../../data/mockData';
import { Airport } from '../../types/aviation';

interface FlightRoutesMapProps {
  onPlanRoute: (dep: Airport, dest: Airport) => void;
}

export const FlightRoutesMap: React.FC<FlightRoutesMapProps> = ({ onPlanRoute }) => {
  const [selectedOrigin, setSelectedOrigin] = useState<Airport>(GLOBAL_AIRPORTS[0]); // Kuwait OKKK
  const [selectedDestination, setSelectedDestination] = useState<Airport>(GLOBAL_AIRPORTS[2]); // Pau LFBP

  // Calculate stats
  const distance = calculateDistanceNm(
    selectedOrigin.lat,
    selectedOrigin.lng,
    selectedDestination.lat,
    selectedDestination.lng
  );
  const flightHours = distance / 500; // ~500 kts average
  const formattedTime = formatBlockHours(flightHours + 0.4);

  // SVG coordinate projection helper (Equirectangular onto 1000x500 viewport)
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const originPos = projectCoords(selectedOrigin.lat, selectedOrigin.lng);
  const destPos = projectCoords(selectedDestination.lat, selectedDestination.lng);

  // Quadratic curve control point for great-circle geodesic arch
  const midX = (originPos.x + destPos.x) / 2;
  const midY = Math.min(originPos.y, destPos.y) - Math.abs(originPos.x - destPos.x) * 0.15 - 30;
  const pathD = `M ${originPos.x} ${originPos.y} Q ${midX} ${midY} ${destPos.x} ${destPos.y}`;

  return (
    <section id="section-routes" className="py-24 bg-[#09090B] border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 text-left">
            <span className="text-red-500 font-semibold tracking-[0.2em] text-xs uppercase">
              GLOBAL FLIGHT CORRIDORS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Interactive Route Visualizer
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Simulate geodesic flight trajectories, block hours, and airway overflight requirements across our global network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onPlanRoute(selectedOrigin, selectedDestination)}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold tracking-wide uppercase flex items-center gap-2 shadow-lg shadow-red-950/40 transition-all cursor-pointer leading-tight"
            >
              <span>Build Full Quote on This Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Airport Selectors Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Departure Airport</div>
              <select
                value={selectedOrigin.icao}
                onChange={(e) => {
                  const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                  if (found) setSelectedOrigin(found);
                }}
                className="bg-transparent text-white font-semibold text-sm sm:text-base focus:outline-none cursor-pointer mt-0.5"
              >
                {GLOBAL_AIRPORTS.map((ap) => (
                  <option key={ap.icao} value={ap.icao} className="bg-zinc-900 text-white font-normal">
                    {ap.icao} - {ap.city} ({ap.country})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right text-xs text-red-400 font-medium">
              {selectedOrigin.iata} / {selectedOrigin.timezone}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Destination Airport</div>
              <select
                value={selectedDestination.icao}
                onChange={(e) => {
                  const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                  if (found) setSelectedDestination(found);
                }}
                className="bg-transparent text-white font-semibold text-sm sm:text-base focus:outline-none cursor-pointer mt-0.5"
              >
                {GLOBAL_AIRPORTS.map((ap) => (
                  <option key={ap.icao} value={ap.icao} className="bg-zinc-900 text-white font-normal">
                    {ap.icao} - {ap.city} ({ap.country})
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right text-xs text-red-400 font-medium">
              {selectedDestination.iata} / {selectedDestination.timezone}
            </div>
          </div>
        </div>

        {/* Interactive Vector Map Container */}
        <div className="relative w-full rounded-2xl bg-[#060608] border border-white/15 p-4 sm:p-8 shadow-2xl overflow-hidden min-h-[440px]">
          
          {/* Radar background grid */}
          <div className="absolute inset-0 bg-aviation-grid opacity-20 pointer-events-none" />

          {/* SVG Map Render */}
          <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-lg">
            {/* World Graticule grid lines */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="#ffffff" strokeOpacity="0.06" strokeDasharray="4 4" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="#ffffff" strokeOpacity="0.06" strokeDasharray="4 4" />
            
            {/* All airport nodes */}
            {GLOBAL_AIRPORTS.map((ap) => {
              const pos = projectCoords(ap.lat, ap.lng);
              const isOrig = ap.icao === selectedOrigin.icao;
              const isDest = ap.icao === selectedDestination.icao;

              return (
                <g key={ap.icao} className="cursor-pointer" onClick={() => setSelectedDestination(ap)}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isOrig || isDest ? "6" : "3"}
                    fill={isOrig ? "#E11D48" : isDest ? "#F43F5E" : "#71717A"}
                    opacity={isOrig || isDest ? 1 : 0.6}
                  />
                  {(isOrig || isDest) && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="12"
                      fill="none"
                      stroke="#E11D48"
                      strokeWidth="1.5"
                      opacity="0.7"
                      className="animate-ping"
                    />
                  )}
                  <text
                    x={pos.x}
                    y={pos.y - 8}
                    fill={isOrig || isDest ? "#FFFFFF" : "#A1A1AA"}
                    fontSize={isOrig || isDest ? "11" : "8"}
                    fontWeight={isOrig || isDest ? "600" : "400"}
                    textAnchor="middle"
                    fontFamily="Inter, sans-serif"
                  >
                    {ap.icao}
                  </text>
                </g>
              );
            })}

            {/* Active Flight Route Geodesic Arc */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#route-gradient)"
              strokeWidth="2.5"
              strokeDasharray="6 3"
              className="animate-pulse"
            />

            {/* Linear Gradient for Flight Path */}
            <defs>
              <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E11D48" />
                <stop offset="50%" stopColor="#FB7185" />
                <stop offset="100%" stopColor="#E11D48" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating Route Telemetry HUD */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 bg-zinc-950/90 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl flex flex-wrap items-center justify-between sm:justify-end gap-6 text-xs">
            <div>
              <div className="text-zinc-500 text-[11px] font-normal">Great-Circle Geodesic</div>
              <div className="text-white font-semibold text-sm sm:text-base">{distance.toLocaleString()} NM</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[11px] font-normal">Estimated Block Duration</div>
              <div className="text-white font-semibold text-sm sm:text-base">{formattedTime}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[11px] font-normal">Overflight FIRs</div>
              <div className="text-red-400 font-semibold text-sm sm:text-base">Permits Active</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
