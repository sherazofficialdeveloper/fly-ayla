import React from 'react';
import { 
  Plane, 
  Briefcase, 
  Building2, 
  Users, 
  HeartPulse, 
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { ServicesCmsContent } from '../../types/cms';

interface ServicesSectionProps {
  content: ServicesCmsContent;
  onRequestService: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  content,
  onRequestService 
}) => {
  const getServiceIcon = (index: number) => {
    switch (index % 6) {
      case 0: return Plane;
      case 1: return Briefcase;
      case 2: return Building2;
      case 3: return Users;
      case 4: return HeartPulse;
      default: return ShieldAlert;
    }
  };

  const tag = content?.tag ?? 'PRIVATE AVIATION SERVICES';
  const title = content?.title ?? 'FLY YOUR WAY.';
  const description = content?.description ?? 'Whether you require an urgent executive hop, transcontinental family travel, or dedicated corporate aviation, Fly Ayla executes every journey with flawless precision.';
  const services = content?.services ?? [];

  return (
    <section id="section-services" className="py-16 sm:py-24 bg-[#09090B] text-white border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
              {tag}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight uppercase leading-tight">
            {title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.filter(s => s.active !== false).map((srv, idx) => {
            const Icon = getServiceIcon(idx);
            return (
              <div
                key={srv.id}
                className="group relative bg-[#0e0f14] rounded-[8px] border border-white/10 hover:border-white/25 p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg cursor-pointer overflow-hidden"
                onClick={onRequestService}
              >
                {/* Red Accent Line on Top */}
                <div className="absolute top-0 left-0 h-[2px] w-6 bg-red-600 group-hover:w-full transition-all duration-300 ease-out" />

                <div>
                  {/* Top Icon & Badge Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="icon-flip-wrapper">
                      <div className="icon-box-interactive icon-flip-target w-10 h-10 rounded-[6px] bg-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold text-red-400 bg-red-950/40 border border-red-500/30 uppercase tracking-wider">
                      {srv.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-red-400 transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4 font-normal">
                    {srv.shortDescription}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-1.5 pt-3 border-t border-white/5">
                    {srv.highlights?.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300 font-normal">
                        <div className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Bottom Action */}
                <div className="pt-4 mt-3">
                  <div className="w-full py-2 px-3 rounded-[6px] bg-white/5 group-hover:bg-red-600 text-zinc-300 group-hover:text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-between transition-colors duration-200 leading-tight">
                    <span>{srv.ctaText || 'Request Details'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
