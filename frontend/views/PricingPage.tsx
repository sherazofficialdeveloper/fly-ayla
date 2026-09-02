'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  Fuel, 
  LandPlot, 
  ShieldCheck, 
  Scale, 
  Sparkles, 
  DollarSign, 
  TrendingDown, 
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import { SmartPricingSection } from '../components/public/SmartPricingSection';
import { PricingCalculatorSection } from '../components/public/PricingCalculatorSection';
import { PriceBreakdownSection } from '../components/public/PriceBreakdownSection';
import { GlobalCmsStore } from '../types/cms';
import { Aircraft } from '../types/aviation';

interface PricingPageProps {
  cmsContent: GlobalCmsStore;
  onRequestFlight: () => void;
  onSelectAircraft?: (aircraft: Aircraft) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  cmsContent,
  onRequestFlight,
  onSelectAircraft
}) => {
  return (
    <div className="w-full flex flex-col bg-[#08080A] text-white">
      {/* 1. HERO */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80" 
            alt="Private Jet Pricing" 
            className="w-full h-full object-cover filter grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/80 to-[#08080A]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
              COST TRANSPARENCY
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-tight max-w-4xl">
            PRECISION BEHIND <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">EVERY QUOTE.</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
            Private flight pricing should never be based on arbitrary rules of thumb. Fly Ayla calculates every flight from actual route telemetry, live JetFuelX fuel pricing indices, airport handling tariffs, and fixed operational reserves.
          </p>
        </div>
      </section>

      {/* 2. SMART PRICING 6 PILLARS */}
      <SmartPricingSection content={cmsContent.smartPricing || cmsContent.pricing} />

      {/* 3. INTERACTIVE SIMULATOR & CALCULATOR */}
      <div className="border-b border-white/10">
        <PricingCalculatorSection 
          content={cmsContent.fleetCostSimulator} 
          onRequestAccess={onRequestFlight} 
        />
      </div>

      {/* 4. DETAILED PRICE BREAKDOWN SYSTEM */}
      <PriceBreakdownSection
        onRequestFlight={onRequestFlight}
      />

      {/* 5. NO HIDDEN FEES GUARANTEE */}
      <section className="py-20 bg-white text-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-zinc-50 border border-zinc-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 font-mono">
                  ZERO SURCHARGE PROMISE
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 uppercase">
                The Price We Quote Is The Price You Pay.
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Unlike traditional broker estimates that add surprise post-flight de-icing, repositioning ferry fees, or handling uplifts, our digital binding contracts protect your budget with total transparency.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <button
                onClick={onRequestFlight}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-xl shadow-red-950/50 cursor-pointer"
              >
                Request Binding Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
