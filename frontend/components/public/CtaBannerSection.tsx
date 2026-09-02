import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { CtaBannerCmsContent } from '../../types/cms';

interface CtaBannerSectionProps {
  content?: CtaBannerCmsContent;
  onRequestAccess?: () => void;
  onRequestFlight?: () => void;
  onContactOperations?: () => void;
}

export const CtaBannerSection: React.FC<CtaBannerSectionProps> = ({
  content,
  onRequestAccess,
  onRequestFlight,
  onContactOperations
}) => {
  const handleAction = onRequestFlight || onRequestAccess || (() => {});
  const tag = content?.tag ?? 'READY FOR TAKEOFF';
  const title = content?.title ?? 'READY FOR YOUR NEXT JOURNEY?';
  const description = content?.description ?? 'Request your private flight and let Fly Ayla handle the details — from instant quotation to tarmac arrival.';
  const buttonText = content?.buttonText ?? 'Request a Flight';
  const subtext = content?.subtext ?? 'Real-time telemetry • Direct tariff itemization • 24/7 dedicated dispatch';

  return (
    <section className="py-16 sm:py-24 bg-[#050507] text-white border-t border-white/10 relative overflow-hidden">
      {/* Central Red Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative space-y-5">
        
        {/* Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-white/5 border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
          <span className="text-zinc-300 font-semibold tracking-[0.2em] text-[11px] uppercase">
            {tag}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight uppercase leading-tight">
          {title}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed font-normal">
          {description}
        </p>

        {/* Actions */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleAction}
            className="group px-6 py-3 rounded-[6px] text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-lg shadow-red-950/80 hover:-translate-y-[1px] active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider leading-tight"
          >
            <span>{buttonText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {onContactOperations && (
            <button
              onClick={onContactOperations}
              className="px-5 py-3 rounded-[6px] text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 transition-all cursor-pointer uppercase tracking-wider flex items-center gap-2 hover:-translate-y-[1px] leading-tight"
            >
              <span>Contact Flight Operations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Subtext */}
        {subtext && (
          <div className="text-xs text-zinc-400 font-normal pt-1">
            {subtext}
          </div>
        )}

      </div>
    </section>
  );
};
