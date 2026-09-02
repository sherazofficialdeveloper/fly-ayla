'use client';

import React from 'react';
import { FlightRequestEngine } from '../components/booking/FlightRequestEngine';
import { FlightRoutesMap } from '../components/public/FlightRoutesMap';
import { Aircraft, Airport, FlightRequest, Quote, Invoice } from '../types/aviation';
import { ArrowLeft, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface FlightRequestPageProps {
  initialAircraft?: Aircraft;
  initialOrigin?: Airport;
  initialDestination?: Airport;
  initialTripType?: 'one-way' | 'round-trip' | 'multi-leg';
  initialLegs?: Array<{
    departure: Airport;
    destination: Airport;
    date: string;
    time: string;
    passengers: number;
  }>;
  initialPassengers?: number;
  onSubmitSuccess: (request: FlightRequest, quote: Quote, invoice: Invoice) => void;
  onBackToHome: () => void;
}

export const FlightRequestPage: React.FC<FlightRequestPageProps> = ({
  initialAircraft,
  initialOrigin,
  initialDestination,
  initialTripType,
  initialLegs,
  initialPassengers,
  onSubmitSuccess,
  onBackToHome
}) => {
  return (
    <div className="w-full flex flex-col bg-[#08080A] text-white">
      {/* 1. TOP NAV BAR */}
      <div className="border-b border-white/10 bg-[#0B0B0E] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase">
              Direct Dispatch Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. HEADER */}
      <section className="pt-10 pb-6 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
              FLIGHT QUOTATION ENGINE
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            REQUEST YOUR PRIVATE FLIGHT
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl">
            Configure your itinerary, choose your preferred aircraft class, and receive a binding quotation with transparent cost itemization.
          </p>
        </div>
      </section>

      {/* 3. FLIGHT REQUEST FORM ENGINE */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0D0D12] border border-white/10 p-4 sm:p-8 shadow-2xl">
            <FlightRequestEngine
              initialAircraft={initialAircraft}
              initialOrigin={initialOrigin}
              initialDestination={initialDestination}
              initialTripType={initialTripType}
              initialLegs={initialLegs}
              initialPassengers={initialPassengers}
              onSubmitSuccess={onSubmitSuccess}
              onCancel={onBackToHome}
            />
          </div>
        </div>
      </section>

      {/* 4. ROUTE MAP & OPERATIONAL ACCESS */}
      <section className="py-16 bg-[#0B0B0E] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
              GLOBAL ROUTE NETWORK
            </span>
            <h2 className="text-2xl font-black text-white uppercase">
              SAMPLE CHARTER CORRIDORS &amp; AIRPORT COVERAGE
            </h2>
          </div>

          <FlightRoutesMap
            onPlanRoute={(dep, dest) => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        </div>
      </section>
    </div>
  );
};
