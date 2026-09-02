import React, { useState } from 'react';
import { 
  Plane, 
  Calculator, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';
import { HowItWorksCmsContent } from '../../types/cms';
import { AnimatedStepNumber } from '../common/MotionPrimitives';

interface HowItWorksStepsProps {
  content: HowItWorksCmsContent;
  onRequestFlight?: () => void;
}

export const HowItWorksSteps: React.FC<HowItWorksStepsProps> = ({ 
  content,
  onRequestFlight 
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Plane': return Plane;
      case 'Calculator': return Calculator;
      case 'FileText': return FileText;
      case 'CreditCard': return CreditCard;
      case 'CheckCircle2': return CheckCircle2;
      default: return Plane;
    }
  };

  const tag = content?.tag ?? 'HOW IT WORKS';
  const title = content?.title ?? 'FROM FLIGHT REQUEST TO CONFIRMED BOOKING.';
  const description = content?.description ?? 'Experience a seamless, five-step private aviation journey engineered for absolute transparency, speed, and discretion.';
  const steps = content?.steps ?? [
    {
      stepNumber: '01',
      title: 'Request Your Flight',
      description: 'Specify your departure airport, arrival destination, date, passengers, and preferred aircraft class.',
      iconName: 'Plane',
      active: true
    },
    {
      stepNumber: '02',
      title: 'Flight Processing',
      description: 'Our engine routes the airway track, computes fuel burn, confirms airfield slots, and matches optimal aircraft.',
      iconName: 'Calculator',
      active: true
    },
    {
      stepNumber: '03',
      title: 'Receive Your Quote',
      description: 'Get a clear, transparent digital quote detailing aircraft interior specs, amenities, and itemized trip costs.',
      iconName: 'FileText',
      active: true
    },
    {
      stepNumber: '04',
      title: 'Approve & Pay',
      description: 'Approve your itinerary with one click and complete payment securely via bank wire, card, or escrow.',
      iconName: 'CreditCard',
      active: true
    },
    {
      stepNumber: '05',
      title: 'Booking Confirmed',
      description: 'Receive your flight briefing, crew details, FBO terminal directions, and 24/7 tarmac VIP concierge escort.',
      iconName: 'CheckCircle2',
      active: true
    }
  ];

  return (
    <section id="section-how-it-works" className="py-16 sm:py-24 bg-white text-zinc-900 border-t border-zinc-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-zinc-100 border border-zinc-200 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600">
              {tag}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-950 tracking-tight uppercase leading-tight">
            {title}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Desktop Horizontal Step Trackers */}
        <div className="hidden lg:grid grid-cols-5 gap-3 mb-10">
          {steps.map((st, idx) => {
            const Icon = getIcon(st.iconName);
            const isCurrent = activeStep === idx;
            return (
              <button
                key={st.stepNumber}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-[6px] border text-left transition-all duration-200 cursor-pointer ${
                  isCurrent 
                    ? 'bg-zinc-950 text-white border-zinc-900 shadow-md' 
                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <AnimatedStepNumber
                    step={st.stepNumber}
                    delay={idx * 0.08}
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] ${
                      isCurrent ? 'bg-red-600 text-white' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  />
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-red-500' : 'text-zinc-400'}`} />
                </div>
                <div className={`text-xs font-semibold tracking-tight ${isCurrent ? 'text-white' : 'text-zinc-900'}`}>
                  {st.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive 2-Column Inspector Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Step Cards List */}
          <div className="lg:col-span-6 space-y-2.5">
            {steps.filter(s => s.active !== false).map((item, idx) => {
              const isSelected = activeStep === idx;
              const Icon = getIcon(item.iconName);
              return (
                <div
                  key={item.stepNumber}
                  onClick={() => setActiveStep(idx)}
                  className={`group p-4 rounded-[6px] transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'bg-zinc-50 border-red-500 shadow-sm'
                      : 'bg-white hover:bg-zinc-50/70 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <AnimatedStepNumber
                      step={item.stepNumber}
                      delay={idx * 0.08}
                      className={`text-xs font-semibold px-2 py-1 rounded-[4px] transition-colors duration-200 flex items-center justify-center ${
                        isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-100 text-zinc-700 group-hover:bg-red-600 group-hover:text-white'
                      }`}
                    />

                    <div className="space-y-0.5 flex-1 text-left">
                      <h3 className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                        isSelected ? 'text-zinc-950' : 'text-zinc-700'
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-red-600' : 'text-zinc-400 group-hover:text-red-600'} transition-colors`} />
                        <span>{item.title}</span>
                      </h3>
                      <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>

                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-red-600 translate-x-0.5' : 'text-zinc-300 group-hover:text-zinc-500'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Live State Inspector */}
          <div className="lg:col-span-6">
            <div className="relative bg-[#0c0d12] text-white rounded-[8px] border border-zinc-800 p-6 sm:p-7 shadow-xl overflow-hidden min-h-[420px] flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                  <span className="text-xs font-semibold text-zinc-300 tracking-wider">
                    STEP {steps[activeStep]?.stepNumber || '01'} &bull; {steps[activeStep]?.title.toUpperCase() || 'REQUEST'}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-[4px] border border-emerald-500/20">
                  ACTIVE WORKFLOW
                </span>
              </div>

              {/* Dynamic View for each of the 5 steps */}
              <div className="my-5 space-y-3">
                {activeStep === 0 && (
                  <div className="space-y-2.5">
                    <div className="bg-[#121318] p-3.5 rounded-[6px] border border-white/5 space-y-1.5 text-left">
                      <div className="text-[11px] text-zinc-400 font-medium tracking-wide">TRIP ITINERARY: LONDON (EGGW) ➔ GENEVA (LSGG)</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-white">London Luton (LTN)</span>
                        <span className="text-red-500 font-medium">➔</span>
                        <span className="font-semibold text-white">Geneva (GVA)</span>
                      </div>
                      <div className="text-xs text-zinc-400 pt-0.5 font-normal">
                        6 Passengers &bull; Heavy Luggage &bull; On-Demand Catering
                      </div>
                    </div>
                    <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-[6px] text-xs text-red-300 flex items-center justify-between">
                      <span>Aircraft Preference: <strong>Super Midsize / Heavy</strong></span>
                      <span className="font-medium">Departure: Flexible</span>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-2 text-xs text-left">
                    <div className="flex justify-between p-3 bg-[#121318] rounded-[6px] border border-white/5">
                      <span className="text-zinc-400 font-normal">Airway Geodesic Track</span>
                      <span className="text-white font-semibold">410 NM (Block: 1h 15m)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#121318] rounded-[6px] border border-white/5">
                      <span className="text-zinc-400 font-normal">Jet-A Fuel Uplift Estimate</span>
                      <span className="text-white font-semibold">380 Gallons</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#121318] rounded-[6px] border border-white/5">
                      <span className="text-zinc-400 font-normal">FBO Slot &amp; Ramp Handling</span>
                      <span className="text-emerald-400 font-semibold">Slots Available</span>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-2 text-xs text-left">
                    <div className="p-3.5 bg-[#121318] rounded-[6px] border border-white/5 space-y-1.5">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span className="font-medium">Digital Quotation #Q-2026-881</span>
                        <span className="text-emerald-400 font-semibold">Ready for Review</span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        Challenger 350 &bull; Stand-Up VIP Cabin
                      </div>
                      <div className="text-xl font-bold text-red-500 pt-0.5">
                        $ 14,800.00
                      </div>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-[6px] text-zinc-400 text-xs font-normal">
                      ✓ Itemized breakdown of handling, navigation, and passenger taxes.
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-2 text-xs text-left">
                    <div className="p-3.5 bg-[#121318] rounded-[6px] border border-white/5 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-300 font-semibold">Payment Methods Available</span>
                        <span className="text-emerald-400 font-medium">Instant Settlement</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-[4px] bg-black/40 border border-white/5 text-zinc-300 font-normal">
                          Bank Wire / SWIFT
                        </div>
                        <div className="p-2 rounded-[4px] bg-black/40 border border-white/5 text-zinc-300 font-normal">
                          Major Credit Cards
                        </div>
                        <div className="p-2 rounded-[4px] bg-black/40 border border-white/5 text-zinc-300 font-normal">
                          Escrow Settlement
                        </div>
                        <div className="p-2 rounded-[4px] bg-black/40 border border-white/5 text-zinc-300 font-normal">
                          Corporate Account
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 4 && (
                  <div className="space-y-2 text-xs text-left">
                    <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-[6px] space-y-1.5 text-white">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>FLIGHT CLEARED &amp; DISPATCHED</span>
                      </div>
                      <div className="text-xs text-zinc-300 font-normal">
                        Flight crew briefed. Tarmac VIP greeting team assigned at Signature Flight Support FBO.
                      </div>
                    </div>
                    <div className="p-2.5 bg-[#121318] rounded-[6px] border border-white/5 text-zinc-400 text-xs flex items-center justify-between">
                      <span className="font-normal">VIP Passenger Manifest</span>
                      <span className="text-white font-semibold">Confirmed</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Nav Controller */}
              <div className="pt-3.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-normal">
                  Step {activeStep + 1} of {steps.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                    className="px-3.5 py-1.5 rounded-[6px] bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer hover:-translate-y-[1px] leading-tight"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
