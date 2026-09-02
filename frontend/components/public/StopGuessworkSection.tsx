import React from 'react';
import { XCircle, CheckCircle2, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { StopGuessworkCmsContent } from '../../types/cms';

interface StopGuessworkSectionProps {
  content: StopGuessworkCmsContent;
  onRequestAccess?: () => void;
}

export const StopGuessworkSection: React.FC<StopGuessworkSectionProps> = ({
  content,
  onRequestAccess
}) => {
  const tag = content?.tag ?? 'THE PLATFORM ADVANTAGE';
  const title = content?.title ?? 'Stop Guessing. Start Computing.';
  const description = content?.description ?? 'Spreadsheets and manual fuel price calls create delays and margin leakage. See how Fly Ayla transforms charter flight operations.';
  const comparisons = content?.comparisons ?? [];

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

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: The Old Way (Spreadsheets) */}
          <div className="p-8 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900">Traditional Aviation Quoting</h3>
                <p className="text-xs text-zinc-500 font-normal">Spreadsheets, guesswork &amp; manual lookups</p>
              </div>
            </div>

            <div className="space-y-5">
              {comparisons.map((item) => (
                <div key={item.id} className="space-y-1.5 text-xs sm:text-sm">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block">
                    {item.topic}
                  </span>
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-600 leading-relaxed flex items-start gap-2.5 font-normal">
                    <span className="text-zinc-400 mt-0.5">&bull;</span>
                    <span>{item.traditionalWay}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: The Fly Ayla Way (Precision) */}
          <div className="p-8 rounded-2xl bg-zinc-950 text-white border border-red-500/30 shadow-xl shadow-red-950/10 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10 relative">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-950 text-red-500 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">The Fly Ayla Platform</h3>
                  <p className="text-xs text-zinc-400 font-normal">Automated operational cost intelligence</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-600 text-white">
                PRECISION
              </span>
            </div>

            <div className="space-y-5 relative">
              {content.comparisons.map((item) => (
                <div key={item.id} className="space-y-1.5 text-xs sm:text-sm">
                  <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wide block">
                    {item.topic}
                  </span>
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-red-500/20 text-zinc-200 leading-relaxed flex items-start gap-2.5 font-normal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item.flyAylaWay}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 relative">
              <button
                onClick={onRequestAccess}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold uppercase tracking-wide shadow-lg shadow-red-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer leading-tight"
              >
                <span>Switch to Fly Ayla Precision</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
