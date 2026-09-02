import React, { useRef } from 'react';
import { X, Download, Printer, Send, ShieldCheck, Plane, CheckCircle2 } from 'lucide-react';
import { FlyAylaLogo } from '../../common/FlyAylaLogo';

interface PdfQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
  onSendToCustomer?: (quoteId: string) => void;
}

export const PdfQuoteModal: React.FC<PdfQuoteModalProps> = ({
  isOpen,
  onClose,
  quote,
  onSendToCustomer,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !quote) return null;

  const cost = quote.costBreakdown || {
    baseFlightCost: 0,
    fuelCost: 0,
    handlingCost: 0,
    navFees: 0,
    operationalCrewCost: 0,
    taxesAndAirportFees: 0,
    markupAmount: 0,
    subtotal: 0,
    discount: 0,
    quotedTotal: 0,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0F0F16] border border-white/20 shadow-2xl z-10 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Top Control Bar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-300">
              OFFICIAL QUOTE PDF GENERATOR — {quote.quoteNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/15 text-xs text-zinc-200 hover:text-white flex items-center gap-1.5 cursor-pointer hover:border-white/30"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>

            {onSendToCustomer && (
              <button
                onClick={() => onSendToCustomer(quote.id || quote._id)}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-950/80"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Customer</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable PDF Canvas (A4 Aspect Ratio Container) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-zinc-950 custom-scrollbar">
          <div
            ref={printRef}
            className="w-full max-w-3xl mx-auto bg-white text-zinc-900 p-8 sm:p-12 rounded-xl shadow-2xl space-y-8 font-sans"
            style={{ colorScheme: 'light' }}
          >
            {/* PDF Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-zinc-200 pb-8">
              <div>
                <div className="text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
                  <span className="text-red-600">FLY</span> AYLA
                </div>
                <div className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mt-1">
                  Global Flight Operations & Charter Management
                </div>
                <div className="text-xs text-zinc-500 mt-2 space-y-0.5">
                  <div>AOC: EASA-CH.AOC.4088</div>
                  <div>HQ: Geneva Airport / Kuwait / New York</div>
                  <div>Direct: +1 (800) 555-AYLA &bull; ops@flyayla.com</div>
                </div>
              </div>

              <div className="sm:text-right space-y-1">
                <div className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                  CHARTER QUOTATION
                </div>
                <div className="text-xl font-bold text-zinc-900">
                  {quote.quoteNumber}
                </div>
                <div className="text-xs text-zinc-500">
                  Date: {new Date(quote.createdAt || Date.now()).toLocaleDateString()}
                </div>
                <div className="text-xs text-zinc-500">
                  Valid Until: {quote.validUntil || '7 Days from issuance'}
                </div>
              </div>
            </div>

            {/* Client & Flight Routing Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-50 p-5 rounded-xl border border-zinc-200 text-xs">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  PREPARED EXCLUSIVELY FOR
                </div>
                <div className="text-sm font-bold text-zinc-900">{quote.customerName}</div>
                <div className="text-zinc-600">{quote.customerEmail}</div>
                {quote.companyName && <div className="text-zinc-700 font-semibold">{quote.companyName}</div>}
              </div>

              <div className="space-y-1">
                <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  AIRCRAFT & MISSION PROFILE
                </div>
                <div className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-red-600" />
                  <span>{quote.aircraftName || 'Gulfstream G650ER'}</span>
                </div>
                <div className="text-zinc-700 font-medium">Category: {quote.aircraftCategory || 'Ultra Long Range'}</div>
                <div className="text-zinc-600">Routing: {quote.routeSummary}</div>
              </div>
            </div>

            {/* Itemized Cost Breakdown Table */}
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-2">
                Itemized Operating Breakdown & Tariffs
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 uppercase text-xs font-semibold">
                    <th className="py-2">Operational Component</th>
                    <th className="py-2 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="py-2.5 text-zinc-800">Direct Flight Operating Cost (Airframe, Flight Hours)</td>
                    <td className="py-2.5 text-right font-medium">${cost.baseFlightCost?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-zinc-800">Jet-A Fuel Burn & Market Surcharge</td>
                    <td className="py-2.5 text-right font-medium">
                      {cost.fuelCost !== null && cost.fuelCost !== undefined && cost.fuelCost > 0 
                        ? `$${cost.fuelCost.toLocaleString()}` 
                        : 'Pending JetFuelX Feed'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-zinc-800">Executive FBO Handling & Ramp Services</td>
                    <td className="py-2.5 text-right font-medium">${cost.handlingCost?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-zinc-800">Airspace Navigation Permits & Overflight Fees</td>
                    <td className="py-2.5 text-right font-medium">${cost.navFees?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-zinc-800">Crew Per Diem, Overnight Allowance & Operations</td>
                    <td className="py-2.5 text-right font-medium">${cost.operationalCrewCost?.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-zinc-800">International Taxes, Customs & Airport Landing Tariffs</td>
                    <td className="py-2.5 text-right font-medium">${cost.taxesAndAirportFees?.toLocaleString()}</td>
                  </tr>
                  {cost.discount > 0 && (
                    <tr className="text-emerald-700">
                      <td className="py-2.5">Preferred VIP Client Incentive Discount</td>
                      <td className="py-2.5 text-right">-${cost.discount?.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-zinc-900 text-zinc-900 font-bold text-sm">
                    <td className="py-4 font-sans">GUARANTEED TOTAL CHARTER PRICE (USD)</td>
                    <td className="py-4 text-right text-base font-bold text-red-600">
                      ${cost.quotedTotal?.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Terms and Conditions */}
            <div className="text-xs text-zinc-500 space-y-2 border-t border-zinc-200 pt-6 leading-relaxed">
              <div className="font-semibold text-zinc-700 uppercase tracking-wider text-xs">
                Charter Terms & Operational Guarantees
              </div>
              <p>
                1. <strong>Inclusions</strong>: Price is all-inclusive of standard VIP gourmet catering, bar, Ka-Band satellite connectivity, landing fees, and standard ground transport dispatch.
              </p>
              <p>
                2. <strong>De-icing & War Risk</strong>: De-icing and hangarage costs due to weather, if required, will be billed at actual cost.
              </p>
              <p>
                3. <strong>Validity</strong>: Aircraft and crew are subject to availability and airport slot confirmation at the time of contract execution.
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-6 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
              <div className="space-y-1">
                <div className="font-bold text-zinc-900">Fly Ayla Flight Operations</div>
                <div className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Digitally Authorized Document</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">AUTHORIZED CLIENT SIGNATURE</div>
                <div className="w-44 border-b border-zinc-400 h-6"></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
