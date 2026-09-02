import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Headphones, 
  Wifi, 
  Coffee, 
  Armchair, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { PremiumExperienceCmsContent } from '../../types/cms';
import { ScrollRevealImage } from '../common/ScrollRevealImage';

interface PremiumExperienceSectionProps {
  content?: PremiumExperienceCmsContent;
  onRequestFlight?: () => void;
}

export const PremiumExperienceSection: React.FC<PremiumExperienceSectionProps> = ({
  content,
  onRequestFlight
}) => {
  const tag = content?.tag ?? 'THE BESPOKE STANDARD';
  const title = content?.title ?? 'MORE THAN A FLIGHT. AN UNCOMPROMISED EXPERIENCE.';
  const description = content?.description ?? 'Step aboard with complete peace of mind. Every detail of your journey—from VIP terminal private suite security to bespoke onboard dining—is meticulously curated.';
  const pillars = content?.pillars ?? [
    {
      title: 'Absolute Privacy & Discretion',
      description: 'Private FBO access away from public commercial terminals. Confidential passenger manifests and anonymous tail scheduling.',
      iconName: 'Lock'
    },
    {
      title: 'Bespoke In-Flight Luxury & Comfort',
      description: 'Handcrafted leather club seating, flat-bed berthing, Ka-band high speed satellite connectivity, and custom culinary menus.',
      iconName: 'Armchair'
    },
    {
      title: 'Total Schedule Flexibility',
      description: 'Change departure times or passenger manifests on short notice. The aircraft waits on your schedule, never the reverse.',
      iconName: 'Clock'
    },
    {
      title: '24/7 Dedicated Concierge & Dispatch',
      description: 'A personal flight advisor coordinates tarmac limousines, helicopter transfers, customs clearances, and special luggage handling.',
      iconName: 'Headphones'
    }
  ];

  const getPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lock': return Lock;
      case 'Armchair': return Armchair;
      case 'Clock': return Clock;
      case 'Headphones': return Headphones;
      default: return Sparkles;
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-[#08080B] text-white border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
              {tag}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight uppercase leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* 4 Experience Pillars with Red Accent Line */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((pil) => {
            const Icon = getPillarIcon(pil.iconName);
            return (
              <div
                key={pil.title}
                className="group relative bg-[#101015] rounded-2xl border border-white/10 hover:border-white/20 p-7 flex flex-col justify-between transition-all duration-300 hover:bg-[#14141C] red-accent-card shadow-xl"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/30 text-red-500 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2.5 group-hover:text-white">
                    {pil.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                    {pil.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5 flex items-center gap-1.5 text-xs text-red-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Platinum Safety Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* High-Impact Visual Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-zinc-300 uppercase">
                <span>In-Flight Amenities</span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                Designed for productivity and supreme relaxation.
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                Whether you need a confidential boardroom in the sky at 45,000 feet or a peaceful master suite, Fly Ayla crafts the ultimate cabin atmosphere for your journey.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 font-normal">
                  <Wifi className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Ultra-Fast Ka-Band</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 font-normal">
                  <Coffee className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Michelin Dining</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 font-normal">
                  <Armchair className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Full-Flat Beds</span>
                </div>
              </div>

              <div className="pt-4">
                {onRequestFlight && (
                  <button
                    onClick={onRequestFlight}
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold uppercase tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-950/60 leading-tight"
                  >
                    <span>Request Custom Flight</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 h-72 sm:h-96 lg:h-full relative min-h-[320px]">
              <ScrollRevealImage 
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80"
                alt="Fly Ayla Jet Interior"
                aspectRatio="aspect-auto"
                containerClassName="w-full h-full min-h-[320px] bg-zinc-950"
                overlayClassName="bg-zinc-950"
              >
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent z-20 pointer-events-none" />
              </ScrollRevealImage>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
