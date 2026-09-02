import React from 'react';
import { 
  Calculator, 
  Fuel, 
  Building, 
  Compass, 
  Users, 
  ShieldCheck, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { SmartPricingCmsContent } from '../../types/cms';

interface SmartPricingSectionProps {
  content?: SmartPricingCmsContent;
  onExploreCalculator?: () => void;
}

export const SmartPricingSection: React.FC<SmartPricingSectionProps> = ({
  content,
  onExploreCalculator
}) => {
  const tag = content?.tag ?? 'SMART AVIATION PRICING';
  const title = content?.title ?? 'PRECISION BEHIND EVERY QUOTE.';
  const description = content?.description ?? 'Private flight pricing should never be based on arbitrary rules of thumb. Fly Ayla calculates every variable from actual flight telemetry, current fuel indices, airport handling tariffs, and fixed operational reserves.';
  const breakdownItems = content?.breakdownItems ?? [
    {
      name: 'Aircraft Base Flight Cost',
      description: 'Aircraft flight time multiplied by calibrated hourly consumption profile and airframe utilization.',
      typicalCost: 'Base Route Calculation',
      iconName: 'Plane'
    },
    {
      name: 'Jet-A Fuel Burn & Uplift',
      description: 'Specific nautical distance fuel burn adjusted for cruise altitude, headwind components, and local airport Jet-A prices.',
      typicalCost: 'Live FBO Fuel Matrix',
      iconName: 'Fuel'
    },
    {
      name: 'Airport Handling & Ramp Fees',
      description: 'Landing fees, FBO ramp handling, passenger terminal taxes, and overnight apron parking fees.',
      typicalCost: 'Official Airport Tariffs',
      iconName: 'Building'
    },
    {
      name: 'Navigation & FIR Overflight Fees',
      description: 'Eurocontrol and national Flight Information Region (FIR) overflight charges computed along the active airway track.',
      typicalCost: 'Airspace Authority Rates',
      iconName: 'Compass'
    },
    {
      name: 'Operational & Crew Logistics',
      description: 'Captain and First Officer duty per diems, hotel accommodations, crew transport, and catering allowances.',
      typicalCost: 'Mission-Specific Logistics',
      iconName: 'Users'
    },
    {
      name: 'Fixed Cost & Maintenance Reserves',
      description: 'Dry lease debt service, engine overhaul reserves (MSP/JSSI), and avionics insurance amortized per block hour.',
      typicalCost: 'Fleet Economic Amortization',
      iconName: 'ShieldCheck'
    }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fuel': return Fuel;
      case 'Building': return Building;
      case 'Compass': return Compass;
      case 'Users': return Users;
      case 'ShieldCheck': return ShieldCheck;
      default: return Calculator;
    }
  };

  return (
    <section id="section-pricing" className="py-24 sm:py-32 bg-[#09090B] text-white border-t border-white/10 relative overflow-hidden">
      {/* Subtle aviation background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-950/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
              {tag}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 6 Metric Calculation Pillars (3x2 grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {breakdownItems.map((item) => {
            const Icon = getIcon(item.iconName);
            return (
              <div 
                key={item.name}
                className="group relative bg-[#111115] rounded-2xl border border-white/10 hover:border-white/20 p-7 flex flex-col justify-between transition-all duration-300 hover:bg-[#15151C] red-accent-card shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-zinc-300 uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-md border border-white/10 font-medium">
                      {item.typicalCost}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm text-zinc-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-white/10 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400">
                  <Check className="w-4 h-4 text-red-500" />
                  <span>Calculated in &lt; 5s per route</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
