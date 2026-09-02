import React, { useState } from 'react';
import { 
  Sparkles
} from 'lucide-react';
import { FleetCostSimulatorCmsContent } from '../../types/cms';

interface PricingCalculatorSectionProps {
  content: FleetCostSimulatorCmsContent;
  onRequestAccess?: () => void;
}

export const PricingCalculatorSection: React.FC<PricingCalculatorSectionProps> = ({
  content,
  onRequestAccess
}) => {
  // State for interactive fleet cost variables
  const [dryLease, setDryLease] = useState<number>(content?.defaultDryLease ?? 8200);
  const [crewSalaries, setCrewSalaries] = useState<number>(content?.defaultCrewSalaries ?? 22000);
  const [engineReserve, setEngineReserve] = useState<number>(content?.defaultEngineReserve ?? 348);
  const [airframeReserve, setAirframeReserve] = useState<number>(content?.defaultAirframeReserve ?? 210);
  const [crewTraining, setCrewTraining] = useState<number>(content?.defaultCrewTraining ?? 1800);
  const [wifiSub, setWifiSub] = useState<number>(content?.defaultWifiSub ?? 420);
  const [monthlyCharterHours, setMonthlyCharterHours] = useState<number>(content?.defaultMonthlyHours ?? 35);

  const tag = content?.tag ?? 'FOR OPERATORS';
  const title = content?.title ?? 'Built around how your fleet actually costs money';
  const description = content?.description ?? "Dry lease or wet lease. Financed or fully owned. Every operator's cost structure is different — Fly Ayla is built to model yours, not a generic template.";
  const bulletPoints = content?.bulletPoints ?? [
    'Dry lease, wet lease, bank financing, or depreciation — your choice',
    'Ferry and positioning legs included automatically',
    'Engine & airframe maintenance reserves built into every quote',
    'Multiple aircraft profiles under one subscription'
  ];

  // Derived math
  const monthlyFixedTotal = dryLease + crewSalaries + crewTraining + wifiSub;
  const fixedPerHour = Math.round(monthlyFixedTotal / (monthlyCharterHours || 1));
  const hourlyReserves = engineReserve + airframeReserve;
  const totalInternalHourlyCost = fixedPerHour + hourlyReserves;

  return (
    <section id="section-pricing" className="py-16 sm:py-24 bg-[#08080a] text-white border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Interactive Fixed Cost Profile Card */}
          <div className="lg:col-span-6">
            <div className="bg-zinc-950 rounded-[8px] border border-white/15 p-6 sm:p-7 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  FIXED COST PROFILE
                </span>
                <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> LIVE SIMULATOR
                </span>
              </div>

              {/* Sliders / Inputs List */}
              <div className="space-y-3.5">
                
                {/* Aircraft Dry Lease */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-medium">Aircraft (Dry Lease)</span>
                    <span className="text-white font-semibold">${dryLease.toLocaleString()} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="45000"
                    step="500"
                    value={dryLease}
                    onChange={(e) => setDryLease(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-red-600"
                  />
                </div>

                {/* Crew Salaries */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-medium">Crew Salaries</span>
                    <span className="text-white font-semibold">${crewSalaries.toLocaleString()} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="8000"
                    max="40000"
                    step="1000"
                    value={crewSalaries}
                    onChange={(e) => setCrewSalaries(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-red-600"
                  />
                </div>

                {/* Engine Maintenance Reserve */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-medium">Engine Maintenance Reserve</span>
                    <span className="text-white font-semibold">${engineReserve} / hr</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="900"
                    step="10"
                    value={engineReserve}
                    onChange={(e) => setEngineReserve(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-red-600"
                  />
                </div>

                {/* Airframe Maintenance Reserve */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-medium">Airframe Maintenance Reserve</span>
                    <span className="text-white font-semibold">${airframeReserve} / hr</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={airframeReserve}
                    onChange={(e) => setAirframeReserve(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-red-600"
                  />
                </div>

                {/* Crew Training & Licensing */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-medium">Crew Training &amp; Licensing</span>
                    <span className="text-white font-semibold">${crewTraining.toLocaleString()} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="6000"
                    step="100"
                    value={crewTraining}
                    onChange={(e) => setCrewTraining(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-red-600"
                  />
                </div>

                {/* WiFi & Subscriptions */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-medium">WiFi &amp; Subscriptions</span>
                    <span className="text-white font-semibold">${wifiSub} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="20"
                    value={wifiSub}
                    onChange={(e) => setWifiSub(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-red-600"
                  />
                </div>

              </div>

              {/* Resulting Automatic Allocation Bar */}
              <div className="pt-3.5 border-t border-white/10 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 font-medium">Target Monthly Fleet Utilization:</span>
                  <span className="text-red-400 font-semibold">{monthlyCharterHours} Flight Hours</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="100"
                  value={monthlyCharterHours}
                  onChange={(e) => setMonthlyCharterHours(Number(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-red-600"
                />

                <div className="p-3.5 bg-zinc-900 rounded-[6px] border border-red-500/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-300 font-medium">Allocated Fixed Base Cost</div>
                    <div className="text-[10px] text-zinc-500 font-normal">Auto-injected into every flight quote</div>
                  </div>
                  <div className="text-lg font-bold text-white tracking-tight">
                    ${totalInternalHourlyCost.toLocaleString()} <span className="text-xs text-zinc-400 font-normal">/ hour</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Copy */}
          <div className="lg:col-span-6 space-y-4 text-left">
            
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
              <span className="text-zinc-300 font-semibold tracking-[0.2em] text-[11px] uppercase">
                {tag}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight uppercase">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              {description}
            </p>

            {/* Feature Bullet Points */}
            <div className="space-y-2.5 pt-1">
              {bulletPoints.map((bp, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="mt-1 w-4 h-4 rounded-[4px] bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-300 font-normal">
                    {bp}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="p-3.5 rounded-[6px] bg-white/5 border border-white/10 text-xs text-zinc-400 font-normal leading-relaxed">
                <strong className="text-zinc-200 font-semibold">Operator Privacy Guarantee:</strong> Your operational margins and internal reserve numbers are encrypted and never shown to end clients. Only the final clean quote is visible.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
