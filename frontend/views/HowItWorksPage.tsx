'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Calculator, 
  Send, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  Plane, 
  HelpCircle,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { HowItWorksSteps } from '../components/public/HowItWorksSteps';
import { WorkflowCommercialSection } from '../components/public/WorkflowCommercialSection';
import { GlobalCmsStore } from '../types/cms';

interface HowItWorksPageProps {
  cmsContent: GlobalCmsStore;
  onRequestFlight: () => void;
  onNavigate: (page: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  cmsContent,
  onRequestFlight,
  onNavigate
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const detailedSteps = [
    {
      num: '01',
      title: 'Flight Request & Itinerary Submission',
      desc: 'Submit your departure and arrival airfields, dates, passenger count, and preferred aircraft class via our web platform or VIP concierge desk.'
    },
    {
      num: '02',
      title: 'Aviation Slot & Runway Feasibility',
      desc: 'Our dispatch team models exact airport runway lengths, slot allocations, customs clearance requirements, and weather routing.'
    },
    {
      num: '03',
      title: 'Real-Time Cost Calculation',
      desc: 'Our pricing engine pulls live JetFuelX fuel tariffs, landing fees, passenger facility charges, and Eurocontrol/FAA route navigation costs.'
    },
    {
      num: '04',
      title: 'Official Binding Quotation',
      desc: 'Receive a crystal-clear, itemized digital PDF quote in your VIP portal with guaranteed aircraft availability and pricing lock.'
    },
    {
      num: '05',
      title: 'Customer Review & One-Click Approval',
      desc: 'Review passenger manifest details, catering choices, and approve the flight quote directly with digital signature verification.'
    },
    {
      num: '06',
      title: 'Digital Commercial Invoicing',
      desc: 'An automated commercial tax invoice is generated with clear line-item breakdowns, international VAT handling, and currency options.'
    },
    {
      num: '07',
      title: 'Secure Payment Processing',
      desc: 'Pay safely via corporate wire transfer, major credit cards, or digital escrow with end-to-end encryption.'
    },
    {
      num: '08',
      title: 'PAYLA Verification & Dispatch Release',
      desc: 'Payment is confirmed in real-time. Flight release is issued to the aircraft captain, FBO handler, and crew.'
    },
    {
      num: '09',
      title: 'VIP FBO Boarding & Takeoff',
      desc: 'Arrive just 15 minutes before departure at the private VIP lounge. Walk directly across the tarmac to your jet.'
    }
  ];

  const faqs = [
    {
      q: 'How far in advance do I need to request a private charter flight?',
      a: 'We can dispatch aircraft in as little as 2 to 4 hours for emergency and priority missions. For standard international charters, requesting 24–48 hours in advance ensures optimal slot and aircraft choice.'
    },
    {
      q: 'How does Fly Ayla calculate flight pricing without broker markups?',
      a: 'We utilize algorithmic calculations based on actual nautical miles, aircraft burn rates, JetFuelX fuel pricing indices, and official published airport handling tariffs rather than vague broker estimates.'
    },
    {
      q: 'Can I change my passenger list or flight time after booking?',
      a: 'Yes. Private aviation gives you total flexibility. You can update your passenger manifest up to 1 hour before departure and adjust departure times with our 24/7 flight operations desk.'
    },
    {
      q: 'What is the boarding process at the private terminal (FBO)?',
      a: 'You bypass all commercial airport crowds. You arrive at a dedicated VIP FBO, meet your flight captain in a private lounge, and your luggage is loaded directly onto the aircraft. Boarding takes less than 5 minutes.'
    }
  ];

  return (
    <div className="w-full flex flex-col bg-[#08080A] text-white">
      {/* 1. HERO */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80" 
            alt="How It Works" 
            className="w-full h-full object-cover filter grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/80 to-[#08080A]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
              FLIGHT WORKFLOW
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-tight max-w-4xl">
            FROM REQUEST TO TAKEOFF, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">SEAMLESS &amp; TRANSPARENT.</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
            Discover how Fly Ayla coordinates your entire journey—from itinerary submission, automated slot and tariff modeling, to verified booking and tarmac boarding.
          </p>
        </div>
      </section>

      {/* 2. THE 9-STEP EXTENDED FLIGHT LIFECYCLE */}
      <section className="py-20 bg-[#0B0B0E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
              END-TO-END JOURNEY
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase mt-1">
              THE 9-STAGE OPERATIONAL LIFECYCLE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {detailedSteps.map((st) => (
              <div
                key={st.num}
                className="p-7 rounded-2xl bg-[#121218] border border-white/10 red-accent-card text-left space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl sm:text-2xl font-mono font-black text-red-500">{st.num}</span>
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold">STAGE {st.num}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-sm text-zinc-300 mt-2.5 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COMMERCIAL WORKFLOW & INVOICE VERIFICATION */}
      <WorkflowCommercialSection content={cmsContent.workflowCommercial} />

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-white text-zinc-900 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 font-mono">
              FREQUENT QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 uppercase mt-1">
              EVERYTHING YOU NEED TO KNOW ABOUT FLYING WITH US
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-zinc-50 border border-zinc-200 overflow-hidden text-left"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 flex items-center justify-between text-left font-bold text-base sm:text-lg text-zinc-900 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm sm:text-base text-zinc-700 leading-relaxed border-t border-zinc-200/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-16 bg-zinc-950 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Ready to book your next flight?
          </h2>
          <p className="text-base text-zinc-300">
            Submit your itinerary and experience seamless private charter execution.
          </p>
          <button
            onClick={onRequestFlight}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl shadow-red-950/80 cursor-pointer"
          >
            Request Your Flight Now
          </button>
        </div>
      </section>
    </div>
  );
};
