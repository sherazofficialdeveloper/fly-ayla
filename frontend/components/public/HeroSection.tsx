import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plane, 
  Calendar,
  Clock,
  Users,
  ArrowUpRight,
  Plus,
  Trash2,
  CalendarDays
} from 'lucide-react';
import { GLOBAL_AIRPORTS, FLEET_AIRCRAFT, calculateDistanceNm, formatBlockHours } from '../../data/mockData';
import { Airport, Aircraft, TripType } from '../../types/aviation';
import { HeroCmsContent } from '../../types/cms';

export interface HeroFlightRequestPayload {
  tripType: TripType;
  aircraft: Aircraft;
  passengers: number;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  departureTime: string;
  returnDate?: string;
  returnTime?: string;
  legs: Array<{
    departure: Airport;
    destination: Airport;
    date: string;
    time: string;
    passengers: number;
  }>;
}

interface HeroSectionProps {
  content?: HeroCmsContent;
  onRequestFlight: (payload?: HeroFlightRequestPayload) => void;
  onExploreHowItWorks?: () => void;
  onSelectAircraft?: (aircraft: Aircraft) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onRequestFlight
}) => {
  // Flight Dispatch Form State
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [selectedOrigin, setSelectedOrigin] = useState<Airport>(GLOBAL_AIRPORTS[4]); // London LTN
  const [selectedDestination, setSelectedDestination] = useState<Airport>(GLOBAL_AIRPORTS[6]); // Geneva GVA
  const [passengerCount, setPassengerCount] = useState<number>(6);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft>(FLEET_AIRCRAFT[1]); // Challenger 350
  
  // Date & Time states
  const [flightDate, setFlightDate] = useState<string>('2026-08-28');
  const [flightTime, setFlightTime] = useState<string>('10:30');
  const [returnDate, setReturnDate] = useState<string>('2026-09-02');
  const [returnTime, setReturnTime] = useState<string>('16:00');

  // Multi-leg states (initialized from current selection)
  const [multiLegs, setMultiLegs] = useState<Array<{
    departure: Airport;
    destination: Airport;
    date: string;
    time: string;
  }>>([
    {
      departure: GLOBAL_AIRPORTS[4], // LTN
      destination: GLOBAL_AIRPORTS[6], // GVA
      date: '2026-08-28',
      time: '10:30'
    },
    {
      departure: GLOBAL_AIRPORTS[6], // GVA
      destination: GLOBAL_AIRPORTS[2], // Pau LFBP
      date: '2026-08-30',
      time: '14:00'
    }
  ]);

  // Seamless Mode Switching that preserves user data
  const handleTripTypeChange = (newType: TripType) => {
    if (newType === tripType) return;

    if (newType === 'multi-leg') {
      if (tripType === 'round-trip') {
        setMultiLegs([
          {
            departure: selectedOrigin,
            destination: selectedDestination,
            date: flightDate,
            time: flightTime
          },
          {
            departure: selectedDestination,
            destination: selectedOrigin,
            date: returnDate,
            time: returnTime
          }
        ]);
      } else {
        setMultiLegs([
          {
            departure: selectedOrigin,
            destination: selectedDestination,
            date: flightDate,
            time: flightTime
          },
          {
            departure: selectedDestination,
            destination: GLOBAL_AIRPORTS.find(a => a.icao !== selectedDestination.icao && a.icao !== selectedOrigin.icao) || GLOBAL_AIRPORTS[2],
            date: new Date(new Date(flightDate).getTime() + 86400000 * 2).toISOString().split('T')[0],
            time: '14:00'
          }
        ]);
      }
    } else if (tripType === 'multi-leg') {
      if (multiLegs.length > 0) {
        setSelectedOrigin(multiLegs[0].departure);
        setSelectedDestination(multiLegs[0].destination);
        setFlightDate(multiLegs[0].date);
        setFlightTime(multiLegs[0].time);
      }
      if (newType === 'round-trip' && multiLegs.length > 1) {
        setReturnDate(multiLegs[1].date);
        setReturnTime(multiLegs[1].time);
      }
    } else if (newType === 'round-trip') {
      if (!returnDate || returnDate <= flightDate) {
        setReturnDate(new Date(new Date(flightDate).getTime() + 86400000 * 4).toISOString().split('T')[0]);
      }
    }

    setTripType(newType);
  };

  // Add Leg to Multi-Leg
  const handleAddLeg = () => {
    if (multiLegs.length >= 4) return;
    const lastLeg = multiLegs[multiLegs.length - 1];
    const nextDestination = GLOBAL_AIRPORTS.find(
      a => a.icao !== lastLeg.destination.icao && a.icao !== lastLeg.departure.icao
    ) || GLOBAL_AIRPORTS[0];
    const nextDate = new Date(new Date(lastLeg.date).getTime() + 86400000 * 2).toISOString().split('T')[0];

    setMultiLegs([
      ...multiLegs,
      {
        departure: lastLeg.destination,
        destination: nextDestination,
        date: nextDate,
        time: '14:00'
      }
    ]);
  };

  // Remove Leg from Multi-Leg
  const handleRemoveLeg = (index: number) => {
    if (multiLegs.length <= 2) return;
    const updated = multiLegs.filter((_, i) => i !== index);
    setMultiLegs(updated);
  };

  // Calculate live telemetry according to mode
  const cruiseSpeed = selectedAircraft.cruiseSpeedKts || 450;
  let totalDistanceNm = 0;
  let totalEstHours = 0;

  if (tripType === 'one-way') {
    totalDistanceNm = calculateDistanceNm(
      selectedOrigin.lat,
      selectedOrigin.lng,
      selectedDestination.lat,
      selectedDestination.lng
    );
    totalEstHours = (totalDistanceNm / cruiseSpeed) + 0.35;
  } else if (tripType === 'round-trip') {
    const singleDist = calculateDistanceNm(
      selectedOrigin.lat,
      selectedOrigin.lng,
      selectedDestination.lat,
      selectedDestination.lng
    );
    totalDistanceNm = singleDist * 2;
    totalEstHours = ((singleDist / cruiseSpeed) + 0.35) * 2;
  } else {
    multiLegs.forEach((leg) => {
      const legDist = calculateDistanceNm(
        leg.departure.lat,
        leg.departure.lng,
        leg.destination.lat,
        leg.destination.lng
      );
      totalDistanceNm += legDist;
      totalEstHours += (legDist / cruiseSpeed) + 0.35;
    });
  }

  const formattedFlightTime = formatBlockHours(totalEstHours);

  // Form submission handler passing complete booking state
  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();

    let legsPayload: Array<{
      departure: Airport;
      destination: Airport;
      date: string;
      time: string;
      passengers: number;
    }> = [];

    if (tripType === 'one-way') {
      legsPayload = [
        {
          departure: selectedOrigin,
          destination: selectedDestination,
          date: flightDate,
          time: flightTime,
          passengers: passengerCount
        }
      ];
    } else if (tripType === 'round-trip') {
      legsPayload = [
        {
          departure: selectedOrigin,
          destination: selectedDestination,
          date: flightDate,
          time: flightTime,
          passengers: passengerCount
        },
        {
          departure: selectedDestination,
          destination: selectedOrigin,
          date: returnDate,
          time: returnTime,
          passengers: passengerCount
        }
      ];
    } else {
      legsPayload = multiLegs.map(l => ({
        ...l,
        passengers: passengerCount
      }));
    }

    onRequestFlight({
      tripType,
      aircraft: selectedAircraft,
      passengers: passengerCount,
      origin: tripType === 'multi-leg' ? multiLegs[0].departure : selectedOrigin,
      destination: tripType === 'multi-leg' ? multiLegs[0].destination : selectedDestination,
      departureDate: tripType === 'multi-leg' ? multiLegs[0].date : flightDate,
      departureTime: tripType === 'multi-leg' ? multiLegs[0].time : flightTime,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      returnTime: tripType === 'round-trip' ? returnTime : undefined,
      legs: legsPayload
    });
  };

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center overflow-hidden bg-[#060608] text-white border-b border-white/10">
      
      {/* 1. Cinematic Executive Jet Background Image (Fixed on desktop, mobile-safe fallback) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none hero-fixed-bg"
        aria-hidden="true"
      >
        {/* Cinematic contrast gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/90 lg:from-black/75 lg:via-black/35 lg:to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-black/60" />

        {/* Scroll-triggered reveal mask */}
        <motion.div
          initial={{ scaleX: 1, originX: 0 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-[#060608] pointer-events-none z-10"
        />
      </div>

      {/* 2. Hero Section Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col justify-end min-h-[120px] lg:min-h-[500px] pb-4 sm:pb-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              {/* Minimal Operational Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-black/70 border border-white/15 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300">
                  DIRECT EXECUTIVE AVIATION
                </span>
              </div>

              {/* Discreet Brand Subtitle */}
              <div className="text-xs sm:text-sm text-zinc-300 font-medium tracking-wide">
                4,500+ Worldwide Airfields &bull; Instant Transparent Quotation &bull; 24/7 Operations
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Flight Operations Dispatch Planner */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <form 
              onSubmit={handleRequestQuote}
              className="relative bg-[#0b0c11]/95 text-white rounded-[8px] p-5 sm:p-6 lg:p-7 border border-white/15 shadow-2xl space-y-4 hover:border-white/25 transition-all duration-200"
            >
              
              {/* Card Header & Live Telemetry */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                    Flight Operations Dispatch
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300 bg-white/5 px-2.5 py-1 rounded-[4px] border border-white/10">
                  <span>EST: {formattedFlightTime}</span>
                  <span className="text-zinc-600">&bull;</span>
                  <span>{Math.round(totalDistanceNm)} NM</span>
                </div>
              </div>

              {/* Trip Type Segmented Control */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-black/80 rounded-[6px] border border-white/12">
                {(['one-way', 'round-trip', 'multi-leg'] as const).map((type) => {
                  const isActive = tripType === type;
                  const label = type === 'one-way' ? 'One Way' : type === 'round-trip' ? 'Round Trip' : 'Multi Leg';
                  return (
                    <button
                      key={type}
                      type="button"
                      id={`hero-trip-${type}`}
                      onClick={() => handleTripTypeChange(type)}
                      className={`py-1.5 text-xs font-semibold rounded-[4px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-red-600 text-white shadow-md border border-red-500/40'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* MODE 1: ONE WAY */}
              {tripType === 'one-way' && (
                <div className="space-y-3">
                  {/* Origin & Destination Airfield Pickers */}
                  <div className="space-y-2.5">
                    {/* Departure (From) */}
                    <div className="p-3 rounded-[6px] bg-black/60 border border-white/12 hover:border-white/25 focus-within:border-red-500/60 transition-colors">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase mb-1">
                        <span className="font-medium tracking-wide">Departure Airfield (From)</span>
                        <span className="text-red-400 font-mono font-semibold">{selectedOrigin.icao}</span>
                      </div>
                      <select
                        value={selectedOrigin.icao}
                        onChange={(e) => {
                          const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                          if (found) setSelectedOrigin(found);
                        }}
                        className="w-full bg-transparent text-white font-medium text-xs sm:text-sm focus:outline-none cursor-pointer"
                      >
                        {GLOBAL_AIRPORTS.map((ap) => (
                          <option key={ap.icao} value={ap.icao} className="bg-zinc-950 text-white">
                            {ap.city} ({ap.icao} &bull; {ap.iata}) - {ap.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Destination (To) */}
                    <div className="p-3 rounded-[6px] bg-black/60 border border-white/12 hover:border-white/25 focus-within:border-red-500/60 transition-colors">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase mb-1">
                        <span className="font-medium tracking-wide">Destination Airfield (To)</span>
                        <span className="text-red-400 font-mono font-semibold">{selectedDestination.icao}</span>
                      </div>
                      <select
                        value={selectedDestination.icao}
                        onChange={(e) => {
                          const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                          if (found) setSelectedDestination(found);
                        }}
                        className="w-full bg-transparent text-white font-medium text-xs sm:text-sm focus:outline-none cursor-pointer"
                      >
                        {GLOBAL_AIRPORTS.map((ap) => (
                          <option key={ap.icao} value={ap.icao} className="bg-zinc-950 text-white">
                            {ap.city} ({ap.icao} &bull; {ap.iata}) - {ap.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Date, Time & Passenger Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-[6px] bg-black/60 border border-white/12 focus-within:border-red-500/60 transition-colors">
                      <div className="text-[10px] text-zinc-400 uppercase flex items-center gap-1 font-medium mb-1">
                        <Calendar className="w-3 h-3 text-red-500" />
                        <span>Departure Date</span>
                      </div>
                      <input
                        type="date"
                        value={flightDate}
                        onChange={(e) => setFlightDate(e.target.value)}
                        className="w-full bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
                      />
                    </div>

                    <div className="p-2.5 rounded-[6px] bg-black/60 border border-white/12 focus-within:border-red-500/60 transition-colors">
                      <div className="text-[10px] text-zinc-400 uppercase flex items-center gap-1 font-medium mb-1">
                        <Clock className="w-3 h-3 text-red-500" />
                        <span>Time (LT)</span>
                      </div>
                      <input
                        type="time"
                        value={flightTime}
                        onChange={(e) => setFlightTime(e.target.value)}
                        className="w-full bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
                      />
                    </div>

                    <div className="p-2.5 rounded-[6px] bg-black/60 border border-white/12 focus-within:border-red-500/60 transition-colors">
                      <div className="text-[10px] text-zinc-400 uppercase flex items-center gap-1 font-medium mb-1">
                        <Users className="w-3 h-3 text-red-500" />
                        <span>Passengers</span>
                      </div>
                      <select
                        value={passengerCount}
                        onChange={(e) => setPassengerCount(Number(e.target.value))}
                        className="w-full bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
                      >
                        {[1, 2, 4, 6, 8, 10, 12, 14, 16, 19].map((num) => (
                          <option key={num} value={num} className="bg-zinc-950 text-white">
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: ROUND TRIP */}
              {tripType === 'round-trip' && (
                <div className="space-y-3">
                  {/* Origin & Destination Airfield Pickers */}
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-[6px] bg-black/60 border border-white/12 hover:border-white/25 focus-within:border-red-500/60 transition-colors">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase mb-1">
                        <span className="font-medium tracking-wide">Departure Airfield (From)</span>
                        <span className="text-red-400 font-mono font-semibold">{selectedOrigin.icao}</span>
                      </div>
                      <select
                        value={selectedOrigin.icao}
                        onChange={(e) => {
                          const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                          if (found) setSelectedOrigin(found);
                        }}
                        className="w-full bg-transparent text-white font-medium text-xs sm:text-sm focus:outline-none cursor-pointer"
                      >
                        {GLOBAL_AIRPORTS.map((ap) => (
                          <option key={ap.icao} value={ap.icao} className="bg-zinc-950 text-white">
                            {ap.city} ({ap.icao} &bull; {ap.iata}) - {ap.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 rounded-[6px] bg-black/60 border border-white/12 hover:border-white/25 focus-within:border-red-500/60 transition-colors">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase mb-1">
                        <span className="font-medium tracking-wide">Destination Airfield (To)</span>
                        <span className="text-red-400 font-mono font-semibold">{selectedDestination.icao}</span>
                      </div>
                      <select
                        value={selectedDestination.icao}
                        onChange={(e) => {
                          const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                          if (found) setSelectedDestination(found);
                        }}
                        className="w-full bg-transparent text-white font-medium text-xs sm:text-sm focus:outline-none cursor-pointer"
                      >
                        {GLOBAL_AIRPORTS.map((ap) => (
                          <option key={ap.icao} value={ap.icao} className="bg-zinc-950 text-white">
                            {ap.city} ({ap.icao} &bull; {ap.iata}) - {ap.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Outbound & Return Date/Time Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Outbound Schedule */}
                    <div className="p-2.5 rounded-[6px] bg-black/60 border border-white/12 space-y-1.5">
                      <div className="text-[10px] text-zinc-400 uppercase font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-red-500" />
                        <span>Outbound Flight</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="date"
                          value={flightDate}
                          onChange={(e) => setFlightDate(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-white/10 rounded-[4px] p-1.5 text-[11px] text-white focus:outline-none focus:border-red-500"
                        />
                        <input
                          type="time"
                          value={flightTime}
                          onChange={(e) => setFlightTime(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-white/10 rounded-[4px] p-1.5 text-[11px] text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    {/* Return Schedule */}
                    <div className="p-2.5 rounded-[6px] bg-black/60 border border-white/12 space-y-1.5">
                      <div className="text-[10px] text-zinc-400 uppercase font-medium flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-red-500" />
                        <span>Return Flight</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-white/10 rounded-[4px] p-1.5 text-[11px] text-white focus:outline-none focus:border-red-500"
                        />
                        <input
                          type="time"
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                          className="w-full bg-zinc-900/80 border border-white/10 rounded-[4px] p-1.5 text-[11px] text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passengers Selector */}
                  <div className="p-2.5 rounded-[6px] bg-black/60 border border-white/12 flex items-center justify-between">
                    <div className="text-[10px] text-zinc-400 uppercase flex items-center gap-1 font-medium">
                      <Users className="w-3 h-3 text-red-500" />
                      <span>Passengers (Both Legs)</span>
                    </div>
                    <select
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(Number(e.target.value))}
                      className="bg-zinc-900 border border-white/10 rounded-[4px] px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {[1, 2, 4, 6, 8, 10, 12, 14, 16, 19].map((num) => (
                        <option key={num} value={num} className="bg-zinc-950 text-white">
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* MODE 3: MULTI LEG */}
              {tripType === 'multi-leg' && (
                <div className="space-y-3">
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {multiLegs.map((leg, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-[6px] bg-black/70 border border-white/12 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs pb-1 border-b border-white/10">
                          <span className="font-semibold text-red-400 uppercase tracking-wider text-[10px]">
                            Leg {index + 1}: {leg.departure.icao} ➔ {leg.destination.icao}
                          </span>
                          {multiLegs.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLeg(index)}
                              className="text-zinc-500 hover:text-red-400 p-0.5 cursor-pointer transition-colors"
                              title="Remove Leg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Origin & Destination Selectors */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase font-medium block mb-0.5">From</span>
                            <select
                              value={leg.departure.icao}
                              onChange={(e) => {
                                const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                                if (found) {
                                  const updated = [...multiLegs];
                                  updated[index].departure = found;
                                  setMultiLegs(updated);
                                }
                              }}
                              className="w-full bg-zinc-900 border border-white/10 rounded-[4px] p-1.5 text-[11px] text-white focus:outline-none"
                            >
                              {GLOBAL_AIRPORTS.map((a) => (
                                <option key={a.icao} value={a.icao}>
                                  {a.icao} &bull; {a.city}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase font-medium block mb-0.5">To</span>
                            <select
                              value={leg.destination.icao}
                              onChange={(e) => {
                                const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                                if (found) {
                                  const updated = [...multiLegs];
                                  updated[index].destination = found;
                                  setMultiLegs(updated);
                                }
                              }}
                              className="w-full bg-zinc-900 border border-white/10 rounded-[4px] p-1.5 text-[11px] text-white focus:outline-none"
                            >
                              {GLOBAL_AIRPORTS.map((a) => (
                                <option key={a.icao} value={a.icao}>
                                  {a.icao} &bull; {a.city}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Schedule */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase font-medium block mb-0.5">Date</span>
                            <input
                              type="date"
                              value={leg.date}
                              onChange={(e) => {
                                const updated = [...multiLegs];
                                updated[index].date = e.target.value;
                                setMultiLegs(updated);
                              }}
                              className="w-full bg-zinc-900 border border-white/10 rounded-[4px] p-1 text-[11px] text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase font-medium block mb-0.5">Time</span>
                            <input
                              type="time"
                              value={leg.time}
                              onChange={(e) => {
                                const updated = [...multiLegs];
                                updated[index].time = e.target.value;
                                setMultiLegs(updated);
                              }}
                              className="w-full bg-zinc-900 border border-white/10 rounded-[4px] p-1 text-[11px] text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Leg Button (supports up to 4 legs) */}
                  {multiLegs.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddLeg}
                      className="w-full py-1.5 rounded-[4px] border border-dashed border-white/20 hover:border-red-500 text-[11px] font-semibold text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      <Plus className="w-3.5 h-3.5 text-red-500" />
                      <span>Add Flight Leg</span>
                    </button>
                  )}

                  {/* Passengers Selector */}
                  <div className="p-2.5 rounded-[6px] bg-black/60 border border-white/12 flex items-center justify-between">
                    <div className="text-[10px] text-zinc-400 uppercase flex items-center gap-1 font-medium">
                      <Users className="w-3 h-3 text-red-500" />
                      <span>Passengers</span>
                    </div>
                    <select
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(Number(e.target.value))}
                      className="bg-zinc-900 border border-white/10 rounded-[4px] px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {[1, 2, 4, 6, 8, 10, 12, 14, 16, 19].map((num) => (
                        <option key={num} value={num} className="bg-zinc-950 text-white">
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Preferred Aircraft Class (Consistent across all modes) */}
              <div className="p-3 rounded-[6px] bg-black/60 border border-white/12 focus-within:border-red-500/60 transition-colors">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase mb-1 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Plane className="w-3 h-3 text-red-500" />
                    <span>Preferred Aircraft Class</span>
                  </span>
                  <span className="text-zinc-300 font-semibold">{selectedAircraft.category}</span>
                </div>
                <select
                  value={selectedAircraft.id}
                  onChange={(e) => {
                    const found = FLEET_AIRCRAFT.find(ac => ac.id === e.target.value);
                    if (found) setSelectedAircraft(found);
                  }}
                  className="w-full bg-transparent text-white font-medium text-xs sm:text-sm focus:outline-none cursor-pointer"
                >
                  {FLEET_AIRCRAFT.map((ac) => (
                    <option key={ac.id} value={ac.id} className="bg-zinc-950 text-white">
                      {ac.name} &bull; {ac.category} ({ac.maxPassengers} Pax &bull; {ac.cruiseSpeedKts} kts)
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  id="hero-request-quote-btn"
                  className="w-full py-3.5 px-4 rounded-[6px] bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-950/80 hover:-translate-y-[1px] active:translate-y-0 transition-all cursor-pointer leading-tight"
                >
                  <span>Request Instant Quotation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Operational Dispatch Notice */}
              <div className="text-center text-[10px] sm:text-[11px] text-zinc-400 font-normal pt-0.5">
                Direct tariff calculations &bull; Verified airfield slots &bull; VIP FBO Ground Support
              </div>

            </form>
          </motion.div>

        </div>
      </div>

    </section>
  );
};

export default HeroSection;
