import React from 'react';
import { Plane, ArrowRight, ShieldCheck, Fuel, Users, Compass } from 'lucide-react';
import { FleetCategoriesCmsContent } from '../../types/cms';

interface FleetCategoriesSectionProps {
  content: FleetCategoriesCmsContent;
  onExploreFleet?: () => void;
  onRequestQuoteForCategory?: (category: string) => void;
}

export const FleetCategoriesSection: React.FC<FleetCategoriesSectionProps> = ({
  content,
  onExploreFleet,
  onRequestQuoteForCategory
}) => {
  const tag = content?.tag ?? 'FLEET EXCELLENCE';
  const title = content?.title ?? 'Aircraft Categories & Ownership Models';
  const description = content?.description ?? 'Each aircraft category has its own cost structure, range profile, and passenger capacity.';
  const categories = content?.categories ?? [];

  return (
    <section className="py-24 bg-[#050507] text-white border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-16 text-left">
          <span className="text-red-500 font-semibold tracking-[0.2em] text-xs uppercase">
            {tag}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 3 Column Category Cards matching reference video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.filter(c => c.active).map((cat) => (
            <div
              key={cat.id}
              className="group p-8 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-red-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 group-hover:text-red-500 transition-all pointer-events-none">
                <Plane className="w-20 h-20" />
              </div>

              <div>
                {/* Red plane badge */}
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 text-red-500 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <Plane className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors">
                    {cat.categoryName}
                  </h3>
                  <span className="text-zinc-500">&mdash;</span>
                  <span className="text-xs font-semibold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20">
                    {cat.ownershipType}
                  </span>
                </div>

                <p className="text-[13px] sm:text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                  {cat.description}
                </p>

                {/* Specs Pill List */}
                <div className="space-y-2.5 py-4 border-t border-b border-white/5 text-[13px]">
                  <div className="flex justify-between text-zinc-400">
                    <span className="font-normal">Example Types:</span>
                    <span className="text-zinc-200 font-semibold">{cat.featuredAircraftName}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span className="font-normal">Hourly Rate Est:</span>
                    <span className="text-red-400 font-semibold">{cat.hourlyRateEst}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span className="font-normal">Max Range:</span>
                    <span className="text-zinc-200 font-medium">{cat.rangeNm.toLocaleString()} NM</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span className="font-normal">Seating:</span>
                    <span className="text-zinc-200 font-medium">Up to {cat.passengers} Pax</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onRequestQuoteForCategory ? onRequestQuoteForCategory(cat.categoryName) : onExploreFleet?.()}
                  className="w-full py-3 rounded-xl bg-zinc-900 group-hover:bg-red-600 border border-white/10 group-hover:border-red-600 text-white text-sm font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer leading-tight"
                >
                  <span>Select {cat.categoryName}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
