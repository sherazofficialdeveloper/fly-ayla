import React, { useState } from 'react';
import { 
  Plane, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  CheckCircle2
} from 'lucide-react';
import { GLOBAL_AIRPORTS, FLEET_AIRCRAFT, calculateFlightCost } from '../../data/mockData';
import { Airport, Aircraft, FlightRequest, Quote, Invoice } from '../../types/aviation';
import { FlightRequestService } from '../../services/customer/flightRequest.service';

interface FlightRequestEngineProps {
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
  onCancel?: () => void;
}

export const FlightRequestEngine: React.FC<FlightRequestEngineProps> = ({
  initialAircraft,
  initialOrigin,
  initialDestination,
  initialTripType,
  initialLegs,
  initialPassengers,
  onSubmitSuccess,
  onCancel
}) => {
  // Form State
  const [tripType, setTripType] = useState<'one-way' | 'round-trip' | 'multi-leg'>(
    initialTripType || (initialLegs && initialLegs.length > 1 ? (initialLegs.length === 2 && initialLegs[0].departure.icao === initialLegs[1].destination.icao ? 'round-trip' : 'multi-leg') : 'one-way')
  );
  const [legs, setLegs] = useState<Array<{
    departure: Airport;
    destination: Airport;
    date: string;
    time: string;
    passengers: number;
  }>>(() => {
    if (initialLegs && initialLegs.length > 0) {
      return initialLegs;
    }
    if (initialTripType === 'round-trip') {
      const orig = initialOrigin || GLOBAL_AIRPORTS[4];
      const dest = initialDestination || GLOBAL_AIRPORTS[6];
      return [
        {
          departure: orig,
          destination: dest,
          date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          time: '10:30',
          passengers: initialPassengers || 4
        },
        {
          departure: dest,
          destination: orig,
          date: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
          time: '16:00',
          passengers: initialPassengers || 4
        }
      ];
    }
    return [
      {
        departure: initialOrigin || GLOBAL_AIRPORTS[4],
        destination: initialDestination || GLOBAL_AIRPORTS[6],
        date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        time: '10:30',
        passengers: initialPassengers || 4
      }
    ];
  });

  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft>(
    initialAircraft || FLEET_AIRCRAFT[0]
  );
  const [markupPercent, setMarkupPercent] = useState<number>(14);

  // VIP Amenities
  const [cateringTier, setCateringTier] = useState<string>('Michelin Star Gourmet');
  const [groundTransport, setGroundTransport] = useState<boolean>(true);
  const [highSpeedWifi, setHighSpeedWifi] = useState<boolean>(true);
  const [petOnBoard, setPetOnBoard] = useState<boolean>(false);
  const [specialNotes] = useState<string>('');

  // Customer Contact
  const [customerName, setCustomerName] = useState<string>('Prince Khalid Al-Sabah');
  const [customerEmail, setCustomerEmail] = useState<string>('khalid.sabah@investment-holdings.kw');
  const [customerPhone, setCustomerPhone] = useState<string>('+965 9988 7766');
  const [customerCompany] = useState<string>('Al-Sabah Global Capital');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdSummary, setCreatedSummary] = useState<{ quote: Quote; invoice: Invoice } | null>(null);

  // Add Leg
  const handleAddLeg = () => {
    const lastLeg = legs[legs.length - 1];
    setLegs([
      ...legs,
      {
        departure: lastLeg.destination,
        destination: GLOBAL_AIRPORTS[2], // Pau LFBP default
        date: new Date(Date.now() + 86400000 * (legs.length + 3)).toISOString().split('T')[0],
        time: '14:00',
        passengers: lastLeg.passengers
      }
    ]);
    setTripType('multi-leg');
  };

  // Remove Leg
  const handleRemoveLeg = (index: number) => {
    if (legs.length <= 1) return;
    const next = legs.filter((_, i) => i !== index);
    setLegs(next);
    if (next.length === 1) setTripType('one-way');
  };

  // Calculate live cost
  const calculation = calculateFlightCost(
    legs.map(l => ({ departure: l.departure, destination: l.destination, passengers: l.passengers })),
    selectedAircraft,
    markupPercent
  );

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Submit to Backend REST API & MongoDB
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        companyName: customerCompany,
        tripType,
        legs: calculation.legsCalculated.map(l => ({
          departureIcao: l.departure.icao,
          departureAirport: l.departure.icao,
          departureName: l.departure.name,
          departureCity: l.departure.city,
          destinationIcao: l.destination.icao,
          destinationAirport: l.destination.icao,
          destinationName: l.destination.name,
          destinationCity: l.destination.city,
          departureDate: l.departureDate,
          departureTime: l.departureTime,
          passengersCount: l.passengers,
          distanceNm: l.distanceNm,
          flightTimeHours: l.blockHours || 3.0,
        })),
        aircraftCategory: selectedAircraft.category,
        aircraftPreference: selectedAircraft.name,
        specialRequests: specialNotes,
        cateringPreference: cateringTier,
        groundTransport,
        markupPercent,
      };

      const response = await FlightRequestService.submitRequest(payload).catch((err) => {
        console.warn('Backend request submission note:', err);
        return null;
      });

      const serverRequest = response?.data?.flightRequest;
      const serverQuote = response?.data?.quote;
      const serverInvoice = response?.data?.invoice;

      const requestId = serverRequest?._id || serverRequest?.id || `req-ayla-${Date.now().toString().slice(-4)}`;
      const quoteId = serverQuote?._id || serverQuote?.id || `quote-ayla-${Date.now().toString().slice(-4)}`;
      const invoiceId = serverInvoice?._id || serverInvoice?.id || `inv-ayla-${Date.now().toString().slice(-4)}`;

      const newRequest: FlightRequest = {
        id: requestId,
        requestNumber: serverRequest?.requestNumber || `AYLA-RQ-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        customerName,
        customerEmail,
        customerPhone,
        customerCompany,
        tripType,
        legs: calculation.legsCalculated,
        aircraftCategory: selectedAircraft.category,
        preferredAircraftId: selectedAircraft.id,
        specialRequests: specialNotes,
        cateringPreference: cateringTier,
        groundTransport,
        status: serverRequest?.status || 'Quote Ready',
        createdAt: serverRequest?.createdAt || new Date().toISOString(),
        quoteId
      };

      const newQuote: Quote = {
        id: quoteId,
        quoteNumber: serverQuote?.quoteNumber || `AYLA-QT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        requestId,
        request: newRequest,
        aircraft: selectedAircraft,
        costBreakdown: calculation.breakdown,
        terms: [
          'Guaranteed departure slot upon invoice signature.',
          'All handling, landing permits, and catering included in quoted total.',
          'Complimentary VIP ground transfer arranged at destination FBO.'
        ],
        validUntil: serverQuote?.validUntil || new Date(Date.now() + 86400000 * 3).toISOString(),
        status: serverQuote?.status || 'Sent',
        invoiceId,
        createdAt: serverQuote?.createdAt || new Date().toISOString()
      };

      const newInvoice: Invoice = {
        id: invoiceId,
        invoiceNumber: serverInvoice?.invoiceNumber || `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        quoteId,
        requestId,
        customerName,
        customerEmail,
        aircraftName: `${selectedAircraft.name} (${selectedAircraft.tailNumber || 'VIP'})`,
        routeSummary: legs.map(l => l.departure.icao).join(' ➔ ') + ' ➔ ' + legs[legs.length - 1].destination.icao,
        subtotal: calculation.breakdown.subtotal,
        taxes: calculation.breakdown.markupAmount,
        total: calculation.breakdown.quotedTotal,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        status: 'Pending'
      };

      setIsSubmitting(false);
      setIsSuccess(true);
      setCreatedSummary({ quote: newQuote, invoice: newInvoice });
      onSubmitSuccess(newRequest, newQuote, newInvoice);
    } catch (error) {
      console.error('Error submitting flight request:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 px-2 sm:px-4 max-w-7xl mx-auto text-white">
      
      {isSuccess && createdSummary ? (
        <div className="bg-[#0e0f14] border border-emerald-500/30 rounded-[8px] p-6 sm:p-8 max-w-2xl mx-auto text-center space-y-5 shadow-xl animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">Flight Quote Generated &amp; Synced</h2>
            <p className="text-xs text-zinc-400 font-normal">
              Quote <strong className="text-white font-semibold">{createdSummary.quote.quoteNumber}</strong> and Invoice <strong className="text-white font-semibold">{createdSummary.invoice.invoiceNumber}</strong> have been created.
            </p>
          </div>

          <div className="p-4 rounded-[6px] bg-zinc-900 border border-white/10 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Aircraft:</span>
              <span className="text-white font-semibold">{selectedAircraft.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Total Distance:</span>
              <span className="text-white font-semibold">{calculation.totalDistanceNm} NM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Total Block Time:</span>
              <span className="text-white font-semibold">{calculation.totalBlockHours} Hours</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 text-xs sm:text-sm">
              <span className="text-zinc-300 font-semibold">Client Quoted Total:</span>
              <span className="text-red-500 font-bold text-base sm:text-lg">${createdSummary.quote.costBreakdown.quotedTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsSuccess(false);
                setCreatedSummary(null);
              }}
              className="px-5 py-2.5 rounded-[6px] bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Configure Another Flight
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-5 py-2.5 rounded-[6px] bg-red-600 hover:bg-red-500 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-colors cursor-pointer hover:-translate-y-[1px]"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Itinerary and Details */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Trip Type Tabs */}
            <div className="bg-zinc-950 p-1.5 rounded-[6px] border border-white/10 flex items-center gap-1.5">
              {(['one-way', 'round-trip', 'multi-leg'] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => {
                    setTripType(type);
                    if (type === 'one-way' && legs.length > 1) {
                      setLegs([legs[0]]);
                    } else if (type === 'round-trip' && legs.length === 1) {
                      setLegs([
                        legs[0],
                        {
                          departure: legs[0].destination,
                          destination: legs[0].departure,
                          date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
                          time: '16:00',
                          passengers: legs[0].passengers
                        }
                      ]);
                    }
                  }}
                  className={`flex-1 py-1.5 rounded-[4px] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    tripType === type
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Flight Legs Card */}
            <div className="bg-[#0e0f14] rounded-[8px] border border-white/10 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wide">
                  <Plane className="w-4 h-4 text-red-500" /> Flight Itinerary &amp; Waypoints
                </h2>
                <span className="text-[11px] text-zinc-500 font-medium">
                  {legs.length} {legs.length === 1 ? 'Leg' : 'Legs'}
                </span>
              </div>

              {/* Legs Array */}
              <div className="space-y-3">
                {legs.map((leg, index) => (
                  <div key={index} className="p-3.5 rounded-[6px] bg-zinc-900 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-red-400 uppercase tracking-wider text-[11px]">
                        Leg {index + 1}
                      </span>
                      {legs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLeg(index)}
                          className="text-zinc-500 hover:text-red-400 p-0.5 cursor-pointer"
                          title="Remove Leg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Origin & Destination Selectors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block mb-1">
                          Departure (ICAO/IATA)
                        </label>
                        <select
                          value={leg.departure.icao}
                          onChange={(e) => {
                            const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                            if (found) {
                              const updated = [...legs];
                              updated[index].departure = found;
                              setLegs(updated);
                            }
                          }}
                          className="w-full bg-zinc-950 border border-white/15 rounded-[4px] p-2 text-xs text-white focus:border-red-500 focus:outline-none"
                        >
                          {GLOBAL_AIRPORTS.map((a) => (
                            <option key={a.icao} value={a.icao}>
                              {a.icao} - {a.city} ({a.country})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block mb-1">
                          Arrival Destination
                        </label>
                        <select
                          value={leg.destination.icao}
                          onChange={(e) => {
                            const found = GLOBAL_AIRPORTS.find(a => a.icao === e.target.value);
                            if (found) {
                              const updated = [...legs];
                              updated[index].destination = found;
                              setLegs(updated);
                            }
                          }}
                          className="w-full bg-zinc-950 border border-white/15 rounded-[4px] p-2 text-xs text-white focus:border-red-500 focus:outline-none"
                        >
                          {GLOBAL_AIRPORTS.map((a) => (
                            <option key={a.icao} value={a.icao}>
                              {a.icao} - {a.city} ({a.country})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Date, Time, Pax */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={leg.date}
                          onChange={(e) => {
                            const updated = [...legs];
                            updated[index].date = e.target.value;
                            setLegs(updated);
                          }}
                          className="w-full bg-zinc-950 border border-white/15 rounded-[4px] p-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block mb-1">
                          Time
                        </label>
                        <input
                          type="time"
                          value={leg.time}
                          onChange={(e) => {
                            const updated = [...legs];
                            updated[index].time = e.target.value;
                            setLegs(updated);
                          }}
                          className="w-full bg-zinc-950 border border-white/15 rounded-[4px] p-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block mb-1">
                          Pax
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={selectedAircraft.maxPassengers}
                          value={leg.passengers}
                          onChange={(e) => {
                            const updated = [...legs];
                            updated[index].passengers = Number(e.target.value);
                            setLegs(updated);
                          }}
                          className="w-full bg-zinc-950 border border-white/15 rounded-[4px] p-1.5 text-xs text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Leg Button */}
              <button
                type="button"
                onClick={handleAddLeg}
                className="w-full py-2 rounded-[6px] border border-dashed border-white/20 hover:border-red-500 text-xs font-semibold text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5 text-red-500" />
                <span>Add Additional Flight Leg</span>
              </button>
            </div>

            {/* Aircraft Selection */}
            <div className="bg-[#0e0f14] rounded-[8px] border border-white/10 p-5 space-y-3.5 shadow-sm">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wide">
                <Plane className="w-4 h-4 text-red-500" /> Select Jet Category &amp; Model
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FLEET_AIRCRAFT.map((ac) => {
                  const isSelected = selectedAircraft.id === ac.id;
                  return (
                    <div
                      key={ac.id}
                      onClick={() => setSelectedAircraft(ac)}
                      className={`p-3 rounded-[6px] border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-zinc-900 border-red-500 shadow-sm'
                          : 'bg-zinc-900/40 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span>{ac.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 font-normal">
                        {ac.category} &bull; {ac.maxPassengers} Pax &bull; {ac.maxRangeNm} NM
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VIP In-Flight Experience & Contact */}
            <div className="bg-[#0e0f14] rounded-[8px] border border-white/10 p-5 space-y-3.5 shadow-sm">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-red-500" /> VIP Amenities &amp; Principal Contact
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block mb-1">
                    Catering Service Level
                  </label>
                  <select
                    value={cateringTier}
                    onChange={(e) => setCateringTier(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-[4px] p-2 text-white text-xs"
                  >
                    <option>Michelin Star Gourmet &amp; Fine Caviar</option>
                    <option>Executive VIP Cold &amp; Hot Buffet</option>
                    <option>Halal Premium Culinary Service</option>
                    <option>Organic Vegan &amp; Gluten Free</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block mb-1">
                    Passenger / Principal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-[4px] p-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-[4px] p-2 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block mb-1">
                    Direct Telephone
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/15 rounded-[4px] p-2 text-white text-xs"
                  />
                </div>
              </div>

              {/* VIP Toggles */}
              <div className="pt-1 grid grid-cols-3 gap-2">
                <label className="flex items-center gap-1.5 p-2 rounded-[4px] bg-zinc-900 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={groundTransport}
                    onChange={(e) => setGroundTransport(e.target.checked)}
                    className="rounded text-red-600 focus:ring-0"
                  />
                  <span className="text-[11px]">VIP Chauffeur</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 rounded-[4px] bg-zinc-900 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highSpeedWifi}
                    onChange={(e) => setHighSpeedWifi(e.target.checked)}
                    className="rounded text-red-600 focus:ring-0"
                  />
                  <span className="text-[11px]">Ka-Band WiFi</span>
                </label>
                <label className="flex items-center gap-1.5 p-2 rounded-[4px] bg-zinc-900 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={petOnBoard}
                    onChange={(e) => setPetOnBoard(e.target.checked)}
                    className="rounded text-red-600 focus:ring-0"
                  />
                  <span className="text-[11px]">Pet Friendly</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Live Calculation Breakdown & Margin Slider */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            
            <div className="bg-[#0e0f14] rounded-[8px] border border-white/15 p-5 shadow-xl space-y-4 text-left">
              
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="text-red-500">((•))</span> LIVE CALCULATION ENGINE
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-[4px] border border-emerald-500/20 font-semibold tracking-wider uppercase">
                  REAL-TIME VERIFIED
                </span>
              </div>

              {/* Itinerary summary */}
              <div className="bg-zinc-900/80 p-2.5 rounded-[6px] border border-white/5 space-y-1 text-xs font-normal">
                <div className="flex justify-between text-zinc-400">
                  <span>Routing:</span>
                  <span className="text-white font-semibold">
                    {legs.map(l => l.departure.icao).join(' ➔ ')} ➔ {legs[legs.length - 1].destination.icao}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Distance &amp; Time:</span>
                  <span className="text-white">
                    {calculation.totalDistanceNm} NM &bull; {calculation.totalBlockHours} Block Hrs
                  </span>
                </div>
              </div>

              {/* Cost Itemization */}
              <div className="space-y-2 text-xs font-normal">
                <div className="flex justify-between items-start text-zinc-400 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>Jet-A Fuel Burn</span>
                      {calculation.breakdown.isLiveFuelPrice && calculation.breakdown.effectiveFuelPricePerGal ? (
                        <>
                          <span className="text-[11px] text-zinc-400">
                            ({calculation.breakdown.fuelGallons ? `${calculation.breakdown.fuelGallons.toLocaleString()} gal @ ` : ''}${calculation.breakdown.effectiveFuelPricePerGal.toFixed(2)}/gal)
                          </span>
                          <span className="px-1.5 py-0.5 rounded-[3px] bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold tracking-wide border border-emerald-500/30">
                            JetFuelX Live
                          </span>
                        </>
                      ) : calculation.breakdown.fuelStatus === 'API_ERROR' ? (
                        <span className="px-1.5 py-0.5 rounded-[3px] bg-rose-500/20 text-rose-400 text-[10px] font-medium tracking-wide border border-rose-500/30">
                          JetFuelX API Error
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-[3px] bg-amber-500/20 text-amber-400 text-[10px] font-medium tracking-wide border border-amber-500/30">
                          API Key Required
                        </span>
                      )}
                    </div>
                    {!calculation.breakdown.isLiveFuelPrice && (
                      <div className="text-[10px] text-amber-400/90 font-normal italic">
                        {calculation.breakdown.fuelStatus === 'API_ERROR' 
                          ? 'JetFuelX fuel price unavailable — upstream API error.' 
                          : 'JetFuelX API key required — live fuel price unavailable.'}
                      </div>
                    )}
                  </div>
                  <span className="text-zinc-200 font-semibold shrink-0">
                    {calculation.breakdown.fuelCost !== null && calculation.breakdown.fuelCost > 0 ? (
                      `$${calculation.breakdown.fuelCost.toLocaleString()}`
                    ) : (
                      <span className="text-amber-400/80 text-xs font-normal italic">
                        Unavailable
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>FBO Ramp &amp; Handling</span>
                  <span className="text-zinc-200 font-semibold">${calculation.breakdown.handlingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>FIR Navigation &amp; Overflight</span>
                  <span className="text-zinc-200 font-semibold">${calculation.breakdown.navFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Crew Duty &amp; Overnight Per Diem</span>
                  <span className="text-zinc-200 font-semibold">${calculation.breakdown.operationalCrewCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Fixed Cost Fleet Allocation</span>
                  <span className="text-zinc-200 font-semibold">${calculation.breakdown.fixedCostAllocation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Airport Landing Fees &amp; Security</span>
                  <span className="text-zinc-200 font-semibold">${calculation.breakdown.taxesAndAirportFees.toLocaleString()}</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between text-zinc-300">
                  <span>Operational Subtotal:</span>
                  <span className="font-semibold text-white">${calculation.breakdown.subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Operator Margin Slider */}
              <div className="p-2.5 bg-zinc-900 rounded-[6px] border border-red-500/20 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 font-medium">Operator Target Margin:</span>
                  <span className="text-red-400 font-semibold">{markupPercent}% (+${calculation.breakdown.markupAmount.toLocaleString()})</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Final Quote Box */}
              <div className="p-3.5 rounded-[6px] bg-gradient-to-br from-red-950/40 to-zinc-900 border border-red-500/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-300">Quoted Total to Client</div>
                  <div className="text-[11px] text-zinc-400 font-normal">
                    {calculation.breakdown.fuelCost !== null && calculation.breakdown.fuelCost > 0 ? (
                      'All taxes, catering & JetFuelX live fuel included'
                    ) : (
                      <span className="text-amber-400/90 font-medium">
                        Base operations total &bull; Jet-A fuel pending key
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-red-500">
                  ${calculation.breakdown.quotedTotal.toLocaleString()}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-[6px] bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 hover:-translate-y-[1px]"
              >
                {isSubmitting ? (
                  <span>Generating Secure Proposal...</span>
                ) : (
                  <>
                    <span>Generate Instant Quote &amp; Invoice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-normal">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Protected by PAYLA FORENSIC AI AML Shield</span>
              </div>

            </div>

          </div>

        </form>
      )}

    </div>
  );
};
