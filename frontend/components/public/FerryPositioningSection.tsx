import React from 'react';
import { Plane, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { FerryPositioningCmsContent } from '../../types/cms';

interface FerryPositioningSectionProps {
  content: FerryPositioningCmsContent;
  onRequestFlight?: () => void;
}

export const FerryPositioningSection: React.FC<FerryPositioningSectionProps> = ({
  content,
  onRequestFlight
}) => {
  const tag = content?.tag ?? 'FERRY & EMPTY LEGS';
  const title = content?.title ?? 'No more untracked repositioning costs';
  const description = content?.description ?? 'Every private jet charter includes positioning, ferry, or return legs. Fly Ayla calculates empty leg hours, fuel burns, and crew accommodation automatically into the base calculation.';
  const bulletPoints = content?.bulletPoints ?? [
    'Automatic positioning leg generation from aircraft base',
    'Customizable return leg rules (empty, commercial, or reposition)',
    'Real-time deadhead recovery pricing',
    'Zero unbilled ferry hours'
  ];

  return (
    <section className="py-24 bg-[#09090B] text-white border-t border-white/10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Ferry Routing Visualization Card */}
          <div className="lg:col-span-6">
            <div className="bg-zinc-950 rounded-2xl border border-white/15 p-7 shadow-2xl space-y-6 relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  FERRY LEG &bull; INCLUDED AUTOMATICALLY
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  SMART REPOSITIONING
                </span>
              </div>

              {/* Waypoints Visualizer */}
              <div className="space-y-4 text-xs">
                
                {/* Leg 1: Repositioning */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-amber-400 text-[11px] font-medium">
                    <span>FERRY LEG (AIRCRAFT REPOSITIONING)</span>
                    <span className="font-semibold">2h 15m</span>
                  </div>
                  <div className="flex items-center justify-between text-white text-sm font-semibold">
                    <span>Base (OKKK)</span>
                    <span className="text-zinc-500 text-xs">➔ ➔ ➔</span>
                    <span>Origin (UAAA)</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 flex justify-between pt-1 border-t border-white/5 font-normal">
                    <span>Empty flight to pick up passenger</span>
                    <span className="text-amber-300 font-medium">Fuel &amp; Crew included in quote</span>
                  </div>
                </div>

                {/* Leg 2: Main Revenue Trip */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 text-[11px] font-medium">
                    <span>REVENUE PASSENGER LEG</span>
                    <span className="font-semibold">8h 37m</span>
                  </div>
                  <div className="flex items-center justify-between text-white text-sm font-semibold">
                    <span>Almaty (UAAA)</span>
                    <span className="text-zinc-500 text-xs">➔ ➔ ➔</span>
                    <span>Pau Pyrénées (LFBP)</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 flex justify-between pt-1 border-t border-white/5 font-normal">
                    <span>VIP Passenger Charter</span>
                    <span className="text-emerald-300 font-medium">Passenger Manifest Loaded</span>
                  </div>
                </div>

              </div>

              {/* Total Summary Footer */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Ferry cost added to total automatically</div>
                  <div className="text-[11px] text-zinc-400 font-normal">Zero margin loss on empty return/positioning legs</div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold">
                  Included ✓
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Copy & Checklist matching reference video */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <span className="text-red-500 font-semibold tracking-[0.2em] text-xs uppercase">
              {tag}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
              {description}
            </p>

            {/* Checklist */}
            <div className="space-y-4 pt-2">
              {bulletPoints.map((bp, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-600" />
                  </div>
                  <span className="text-sm sm:text-base text-zinc-300 font-normal">
                    {bp}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={onRequestFlight}
                className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-lg shadow-red-950/50 hover:shadow-red-600/40 transition-all flex items-center gap-2 cursor-pointer leading-tight"
              >
                <span>Try Multi-Leg Route Routing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
