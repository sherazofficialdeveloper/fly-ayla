import React from 'react';
import { 
  CreditCard, 
  Users, 
  GraduationCap, 
  FileCheck, 
  Wifi, 
  PlaneTakeoff, 
  Shirt, 
  Wrench, 
  Gauge, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { RecurringCostsCmsContent } from '../../types/cms';

interface RecurringCostsSectionProps {
  content: RecurringCostsCmsContent;
  onExploreCalculator?: () => void;
}

export const RecurringCostsSection: React.FC<RecurringCostsSectionProps> = ({
  content,
  onExploreCalculator
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return CreditCard;
      case 'Users': return Users;
      case 'GraduationCap': return GraduationCap;
      case 'FileCheck': return FileCheck;
      case 'Wifi': return Wifi;
      case 'PlaneTakeoff': return PlaneTakeoff;
      case 'Shirt': return Shirt;
      case 'Wrench': return Wrench;
      case 'Gauge': return Gauge;
      default: return AlertTriangle;
    }
  };

  const tag = content?.tag ?? 'COMPLETE COST TRANSPARENCY';
  const title = content?.title ?? 'Recurring Fixed Costs & Reserves';
  const description = content?.description ?? 'Fly Ayla models all fixed annual and monthly commitments, dividing them automatically into every charter flight quote.';
  const items = content?.items ?? [];

  return (
    <section className="py-24 bg-white text-zinc-900 border-t border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-16 text-left">
          <span className="text-red-600 font-semibold tracking-[0.2em] text-xs uppercase">
            {tag}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-950 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 10 Items Grid matching reference video */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.filter(i => i.active).map((item) => {
            const Icon = getIcon(item.iconName);
            return (
              <div
                key={item.id}
                className="group p-5 rounded-2xl bg-zinc-50 hover:bg-white border border-zinc-200/80 hover:border-red-500/40 hover:shadow-lg hover:shadow-red-950/5 transition-all duration-300 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 block mb-1">
                    {item.category} Cost
                  </span>
                  <h3 className="text-sm font-semibold text-zinc-900 leading-snug group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Want to see how your flight department costs amortize?</h3>
            <p className="text-xs text-zinc-400 font-normal">Use our live fleet cost simulator to calculate your exact breakeven flight hour threshold.</p>
          </div>
          <button
            onClick={onExploreCalculator}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer shrink-0 leading-tight"
          >
            <span>Launch Cost Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
