import React, { useState } from 'react';
import { 
  Compass, 
  Fuel, 
  Layers, 
  FileCheck, 
  Receipt, 
  LayoutDashboard,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PlatformFeaturesCmsContent } from '../../types/cms';

interface PlatformFeaturesProps {
  content: PlatformFeaturesCmsContent;
  onExploreFeature?: (featureId: string) => void;
}

export const PlatformFeatures: React.FC<PlatformFeaturesProps> = ({
  content,
  onExploreFeature
}) => {
  const [activeFeature, setActiveFeature] = useState<number>(0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return Compass;
      case 'Fuel': return Fuel;
      case 'Layers': return Layers;
      case 'FileCheck': return FileCheck;
      case 'Receipt': return Receipt;
      default: return LayoutDashboard;
    }
  };

  const tag = content?.tag ?? 'INTELLIGENT FLIGHT PRICING';
  const title = content?.title ?? 'A complete calculation engine for private jet charter';
  const description = content?.description ?? 'Every variable that goes into pricing a private flight — calculated in seconds, from real data, not estimates.';
  const features = content?.features ?? [];

  return (
    <section id="section-platform" className="py-24 bg-[#FAFAFB] text-zinc-900 border-t border-zinc-200/80 relative">
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

        {/* 6 Grid Cards matching reference video with clean light styling and red accents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.filter(f => f.active).map((feature, idx) => {
            const Icon = getIcon(feature.iconName);
            const isSelected = activeFeature === idx;
            return (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(idx)}
                className={`group relative p-8 rounded-2xl transition-all duration-300 cursor-pointer border ${
                  isSelected
                    ? 'bg-white border-red-500 shadow-xl shadow-red-950/10'
                    : 'bg-white/80 hover:bg-white border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg'
                }`}
              >
                {/* Accent top border glow when active */}
                {isSelected && (
                  <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-600" />
                )}

                {/* Icon Container with Fly Ayla red styling */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-rose-50 text-red-600 group-hover:bg-red-600 group-hover:text-white border border-rose-100'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-zinc-900 mb-2 tracking-tight group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-zinc-600 leading-relaxed mb-4 font-normal">
                  {feature.description}
                </p>

                {/* Detail expansion & badge */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium text-xs">
                    {feature.badge}
                  </span>
                  <span className="text-red-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {isSelected ? 'Active' : 'Details'} &rarr;
                  </span>
                </div>

                {/* Expanded details when selected */}
                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-red-100 text-xs text-zinc-700 bg-zinc-50 p-3 rounded-lg border border-zinc-200/60 leading-relaxed font-normal">
                    {feature.detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
