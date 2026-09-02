import React, { useState, useEffect } from 'react';
import { X, Calculator, Plane, ShieldCheck, DollarSign } from 'lucide-react';

interface CreateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quoteData: any) => Promise<void>;
  prefilledRequest?: any;
  aircraftList: any[];
  airportsList: any[];
}

export const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  prefilledRequest,
  aircraftList,
  airportsList,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [aircraftId, setAircraftId] = useState('');
  const [routeSummary, setRouteSummary] = useState('LSGG (Geneva) → OKKK (Kuwait)');
  const [flightHours, setFlightHours] = useState<number>(5.5);
  const [hourlyRate, setHourlyRate] = useState<number>(14500);
  const [fuelCost, setFuelCost] = useState<number>(0);
  const [handlingCost, setHandlingCost] = useState<number>(4500);
  const [navFees, setNavFees] = useState<number>(3200);
  const [crewCost, setCrewCost] = useState<number>(2800);
  const [taxes, setTaxes] = useState<number>(4100);
  const [markupPercent, setMarkupPercent] = useState<number>(18);
  const [discount, setDiscount] = useState<number>(0);
  const [validDays, setValidDays] = useState<number>(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prefilledRequest) {
      setCustomerName(prefilledRequest.customerName || '');
      setCustomerEmail(prefilledRequest.customerEmail || '');
      setCompanyName(prefilledRequest.companyName || '');
      if (prefilledRequest.departureAirport && prefilledRequest.arrivalAirport) {
        setRouteSummary(`${prefilledRequest.departureAirport} → ${prefilledRequest.arrivalAirport}`);
      }
    }
    if (aircraftList.length > 0 && !aircraftId) {
      const defaultAc = aircraftList[0];
      setAircraftId(defaultAc.id || defaultAc._id);
      setHourlyRate(defaultAc.hourlyRate || 14500);
    }
  }, [prefilledRequest, aircraftList]);

  if (!isOpen) return null;

  // Live calculation
  const baseFlightCost = flightHours * hourlyRate;
  const docTotal = baseFlightCost + fuelCost + handlingCost + navFees + crewCost + taxes;
  const markupAmount = Math.round((docTotal * markupPercent) / 100);
  const subtotal = docTotal + markupAmount;
  const quotedTotal = Math.max(0, subtotal - discount);

  const handleAircraftChange = (id: string) => {
    setAircraftId(id);
    const selected = aircraftList.find((a) => (a.id || a._id) === id);
    if (selected) {
      if (selected.hourlyRate) setHourlyRate(selected.hourlyRate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) return;

    setIsSubmitting(true);
    try {
      const selectedAc = aircraftList.find((a) => (a.id || a._id) === aircraftId);
      const validUntilDate = new Date();
      validUntilDate.setDate(validUntilDate.getDate() + validDays);

      await onSubmit({
        requestId: prefilledRequest?.id || prefilledRequest?._id,
        customerName,
        customerEmail,
        companyName,
        aircraftId,
        aircraftName: selectedAc?.name || 'Selected Charter Jet',
        aircraftCategory: selectedAc?.category || 'Ultra Long Range',
        routeSummary,
        validUntil: validUntilDate.toISOString().split('T')[0],
        costBreakdown: {
          baseFlightCost,
          fuelCost,
          handlingCost,
          navFees,
          operationalCrewCost: crewCost,
          taxesAndAirportFees: taxes,
          markupPercent,
          markupAmount,
          subtotal,
          discount,
          quotedTotal,
        },
        status: 'Sent',
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0F0F16] border border-white/20 shadow-2xl z-10 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-black/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Generate Official Charter Quotation</h3>
              <p className="text-xs text-zinc-400">Direct Operating Cost Engine & Precision Pricing Matrix</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Section 1: Customer Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              1. Customer & Mission Routing
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sheikh Nasser Al-Ahmad"
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Customer Email *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. client@vipaviation.com"
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Company / Organization (Optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Al-Ahmad Royal Holding"
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Mission Routing Summary *</label>
                <input
                  type="text"
                  required
                  value={routeSummary}
                  onChange={(e) => setRouteSummary(e.target.value)}
                  placeholder="e.g. LSGG (Geneva) → OKKK (Kuwait)"
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Aircraft Selection & Mission Parameters */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              2. Aircraft & Mission Parameters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Select Aircraft</label>
                <select
                  value={aircraftId}
                  onChange={(e) => handleAircraftChange(e.target.value)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {aircraftList.map((a) => (
                    <option key={a.id || a._id} value={a.id || a._id}>
                      {a.name} ({a.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Estimated Flight Hours (Block)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={flightHours}
                  onChange={(e) => setFlightHours(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Hourly Airframe Rate ($/hr)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Cost Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              3. Operational Line Items (Direct Operating Cost)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Jet-A Fuel ($ - 0 if pending live JetFuelX)</label>
                <input
                  type="number"
                  value={fuelCost}
                  onChange={(e) => setFuelCost(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">FBO & Handling ($)</label>
                <input
                  type="number"
                  value={handlingCost}
                  onChange={(e) => setHandlingCost(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Airspace Nav Fees ($)</label>
                <input
                  type="number"
                  value={navFees}
                  onChange={(e) => setNavFees(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Crew Per Diem ($)</label>
                <input
                  type="number"
                  value={crewCost}
                  onChange={(e) => setCrewCost(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Airport Landing Taxes ($)</label>
                <input
                  type="number"
                  value={taxes}
                  onChange={(e) => setTaxes(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Target Margin Markup (%)</label>
                <input
                  type="number"
                  value={markupPercent}
                  onChange={(e) => setMarkupPercent(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#14141E] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Live Breakdown Calculation Card */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/15 space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span>Direct Flight Operating Cost (Base):</span>
              <span className="font-semibold text-white">${baseFlightCost.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span>Ancillary Mission Costs (Fuel, Handling, Nav, Crew, Taxes):</span>
              <span className="font-semibold text-white">${(fuelCost + handlingCost + navFees + crewCost + taxes).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span>Operating Profit Margin ({markupPercent}%):</span>
              <span className="font-semibold text-emerald-400">+${markupAmount.toLocaleString()}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-white uppercase tracking-wider">Final Quoted Price (USD):</span>
              <span className="text-xl font-bold text-red-500">
                ${quotedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-950/80 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Generating Quote...' : 'Create & Deliver Quote'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
