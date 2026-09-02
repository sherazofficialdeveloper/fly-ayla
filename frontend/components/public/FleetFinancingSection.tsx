import React from 'react';
import { FileText, Layers, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { FleetFinancingCmsContent } from '../../types/cms';

interface FleetFinancingSectionProps {
  content: FleetFinancingCmsContent;
  onRequestQuote?: () => void;
}

export const FleetFinancingSection: React.FC<FleetFinancingSectionProps> = ({
  content,
  onRequestQuote
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'Layers': return Layers;
      case 'Building2': return Building2;
      default: return CheckCircle2;
    }
  };

  const tag = content?.tag ?? 'OWNERSHIP, YOUR WAY';
  const title = content?.title ?? 'Every aircraft is financed differently. So is every quote.';
  const description = content?.description ?? 'Model distinct cashflow structures for each aircraft in your fleet with transparent, predictable amortization.';
  const models = content?.models ?? [];

  return (
    <section className="py-24 bg-[#FAFAFB] text-zinc-900 border-t border-zinc-200/80 relative">
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

        {/* 4 Cards Grid matching reference video */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.filter(m => m.active).map((model) => {
            const Icon = getIcon(model.iconName);
            return (
              <div
                key={model.id}
                className="group bg-white p-7 rounded-2xl border border-zinc-200/90 hover:border-red-500/40 shadow-sm hover:shadow-xl hover:shadow-red-950/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 text-red-600 flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-900 mb-2 group-hover:text-red-600 transition-colors">
                    {model.title}
                  </h3>

                  <p className="text-[13px] sm:text-sm text-zinc-600 leading-relaxed font-normal">
                    {model.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-red-600 group-hover:translate-x-1 transition-transform">
                  <span>Model Economics</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
