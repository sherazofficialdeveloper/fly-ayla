import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Receipt, 
  Plane, 
  CreditCard, 
  History, 
  User, 
  Settings, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  Download, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  Sparkles, 
  FileCheck, 
  Eye, 
  Compass, 
  Send, 
  Lock,
  ChevronRight,
  Printer
} from 'lucide-react';
import { 
  FlightRequest, 
  Quote, 
  Invoice, 
  Booking, 
  UserProfile 
} from '../../types/aviation';
import { StatusBadge } from '../common/StatusBadge';
import { StatCard } from '../common/StatCard';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { ProfileService } from '../../services/customer/profile.service';

interface CustomerPortalProps {
  user: UserProfile;
  requests: FlightRequest[];
  quotes: Quote[];
  invoices: Invoice[];
  bookings: Booking[];
  onRequestNewFlight: () => void;
  onApproveQuote: (quoteId: string) => void;
  onPayInvoice: (invoiceId: string, method: string) => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  user,
  requests,
  quotes,
  invoices,
  bookings,
  onRequestNewFlight,
  onApproveQuote,
  onPayInvoice
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'requests' | 'quotes' | 'bookings' | 'invoices' | 'payments' | 'history' | 'profile' | 'settings'
  >('overview');

  const [selectedQuoteForDetail, setSelectedQuoteForDetail] = useState<Quote | null>(quotes[0] || null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('Bank Wire / Swift MT103');
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);
  const [showProfileSuccess, setShowProfileSuccess] = useState<boolean>(false);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Editable Profile State (derived cleanly from authenticated user)
  const [profileData, setProfileData] = useState({
    name: user.name || 'Private VIP Client',
    email: user.email || '',
    phone: user.phone || '',
    company: user.company || 'Private Principal',
    passportNumber: user.passportNumber || '',
    nationality: user.nationality || '',
    preferredAircraftCategory: user.preferredAircraftCategory || 'Heavy Jets & Ultra Long Range',
    dietaryRestrictions: user.dietaryRestrictions || '',
    emergencyContact: ''
  });

  // Derived calculations
  const pendingInvoices = invoices.filter(i => i.status === 'Pending');
  const pendingAmount = pendingInvoices.reduce((acc, curr) => acc + curr.total, 0);
  const paidInvoices = invoices.filter(i => i.status === 'Paid');
  const totalSettled = paidInvoices.reduce((acc, curr) => acc + curr.total, 0);
  const activeQuotes = quotes.filter(q => q.status === 'Sent');

  const navItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'requests', label: 'Flight Requests', icon: Send, count: requests.length },
    { id: 'quotes', label: 'Proposals & Quotes', icon: FileText, count: activeQuotes.length, highlight: activeQuotes.length > 0 },
    { id: 'bookings', label: 'Confirmed Trips', icon: Plane, count: bookings.length },
    { id: 'invoices', label: 'Invoices & Escrow', icon: Receipt, count: pendingInvoices.length, alert: pendingInvoices.length > 0 },
    { id: 'payments', label: 'Payment Receipts', icon: CreditCard },
    { id: 'history', label: 'Trip History', icon: History },
    { id: 'profile', label: 'Principal Profile', icon: User },
    { id: 'settings', label: 'Security & Settings', icon: Settings }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-left">
      
      {/* Top Welcome Bar */}
      <div className="bg-[#0C0C10] rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-red-400 uppercase">
              FLY AYLA VIP PORTAL &bull; CLIENT COMMAND
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Welcome, {profileData.name}
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-normal">
            {profileData.email} {profileData.company ? `• ${profileData.company}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={onRequestNewFlight}
          >
            New Flight Request
          </Button>
        </div>
      </div>

      {/* Main Layout Grid (Sidebar + Content View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-3 bg-[#0A0A0E] rounded-2xl border border-white/10 p-3 space-y-1.5 sticky top-24">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Navigation Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-950/60'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    item.alert
                      ? 'bg-rose-500 text-white animate-pulse'
                      : item.highlight
                      ? 'bg-amber-400 text-black'
                      : isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Top Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <StatCard
                  label="Active Charter Pipeline"
                  value={requests.length + bookings.length}
                  subtext={`${requests.length} Requests • ${bookings.length} Confirmed Flights`}
                  icon={Plane}
                  accent="red"
                />
                <StatCard
                  label="Pending Settlement"
                  value={`$${pendingAmount.toLocaleString()}`}
                  subtext={pendingInvoices.length > 0 ? `${pendingInvoices.length} invoices awaiting payment` : 'All invoices settled'}
                  icon={Receipt}
                  accent="amber"
                />
                <StatCard
                  label="Total Cleared Spend"
                  value={`$${totalSettled.toLocaleString()}`}
                  subtext="Secure escrow & swift MT103 cleared"
                  icon={ShieldCheck}
                  accent="emerald"
                />
              </div>

              {/* Action Alert: Quotes Waiting */}
              {activeQuotes.length > 0 && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-black to-zinc-950 border border-red-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-red-400" />
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Charter Proposals Ready for Digital Signature
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-red-400 bg-red-950 px-2.5 py-1 rounded-md border border-red-500/30 tracking-wide">
                      ACTION REQUIRED
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 font-normal">
                    Fly Ayla Flight Operations has compiled formal quotations with direct fuel and airport charges calculated for your review.
                  </p>
                  <div className="space-y-3">
                    {activeQuotes.map((q) => (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-red-400">{q.quoteNumber}</span>
                            <span className="text-xs text-zinc-400">&bull; {q.aircraft.name}</span>
                          </div>
                          <div className="text-sm sm:text-base font-semibold text-white">
                            {q.request.legs.map(l => `${l.departure.city} (${l.departure.icao})`).join(' ➔ ')} ➔ {q.request.legs[q.request.legs.length - 1].destination.city} ({q.request.legs[q.request.legs.length - 1].destination.icao})
                          </div>
                          <div className="text-xs text-zinc-400 font-normal">
                            Valid until {new Date(q.validUntil).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-zinc-400 font-normal">Total Price</div>
                            <div className="text-xl font-bold text-white">
                              ${q.costBreakdown.quotedTotal.toLocaleString()}
                            </div>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setSelectedQuoteForDetail(q);
                              setActiveTab('quotes');
                            }}
                          >
                            Review &amp; Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming Trip Card (If any) */}
              {bookings.length > 0 ? (
                <div className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Plane className="w-5 h-5 text-red-500" />
                      <span>Next Confirmed Flight</span>
                    </h3>
                    <StatusBadge status={bookings[0].status} />
                  </div>
                  
                  <div className="p-5 rounded-xl bg-zinc-900/80 border border-white/10 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                      <div>
                        <div className="text-xs text-zinc-400 font-semibold tracking-wide">BOOKING REF: {bookings[0].bookingReference}</div>
                        <div className="text-lg sm:text-xl font-bold text-white mt-0.5">{bookings[0].routeSummary}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-400 font-medium">SCHEDULED DEPARTURE</div>
                        <div className="text-base font-semibold text-white">{bookings[0].departureDate} @ {bookings[0].departureTime}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-1">
                        <span className="text-zinc-400 font-medium">Aircraft Assigned</span>
                        <div className="text-white font-semibold text-sm">{bookings[0].aircraft.name}</div>
                        <div className="text-red-400 font-medium">{bookings[0].aircraft.tailNumber || '9K-AYL'}</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-1">
                        <span className="text-zinc-400 font-medium">Flight Crew</span>
                        <div className="text-white font-semibold text-sm">{bookings[0].captainName}</div>
                        <div className="text-zinc-300 font-normal">{bookings[0].firstOfficerName}</div>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-1">
                        <span className="text-zinc-400 font-medium">VIP Terminal</span>
                        <div className="text-white font-semibold text-sm">{bookings[0].fboTerminal}</div>
                        <div className="text-emerald-400 font-normal">Direct Ramp Access</div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedBookingForPass(bookings[0])}
                      >
                        View Boarding Pass &amp; Briefing
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={Plane}
                  title="No active bookings yet"
                  description="When your flight quote is approved and invoice settled, your confirmed itinerary and captain credentials will appear here."
                  actionLabel="Request a Flight"
                  onAction={onRequestNewFlight}
                />
              )}

              {/* Recent Requests Table */}
              {requests.length > 0 && (
                <div className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-bold text-white">Recent Flight Requests</h3>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="text-xs sm:text-sm text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                    >
                      View All &rarr;
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-zinc-400 text-xs font-semibold uppercase tracking-wide">
                          <th className="py-3 px-3">Req ID</th>
                          <th className="py-3 px-3">Routing</th>
                          <th className="py-3 px-3">Aircraft</th>
                          <th className="py-3 px-3">Date</th>
                          <th className="py-3 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {requests.slice(0, 5).map((r) => (
                          <tr key={r.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3.5 px-3 font-semibold text-red-400">{r.requestNumber}</td>
                            <td className="py-3.5 px-3 font-semibold text-white">
                              {r.legs.map(l => l.departure.icao).join(' ➔ ')} ➔ {r.legs[r.legs.length - 1].destination.icao}
                            </td>
                            <td className="py-3.5 px-3 text-zinc-300 font-normal">{r.aircraftCategory}</td>
                            <td className="py-3.5 px-3 text-zinc-400 font-normal">{r.legs[0]?.departureDate}</td>
                            <td className="py-3.5 px-3">
                              <StatusBadge status={r.status} size="sm" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: FLIGHT REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Flight Requests</h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-normal">All submitted charter inquiries and dispatch calculations.</p>
                </div>
                <Button variant="primary" size="md" icon={Plus} onClick={onRequestNewFlight}>
                  New Request
                </Button>
              </div>

              {requests.length === 0 ? (
                <EmptyState
                  icon={Send}
                  title="No flight requests yet"
                  description="Submit your bespoke private charter requirements to calculate direct flight time, distance, and itemized quotations."
                  actionLabel="Request a Flight"
                  onAction={onRequestNewFlight}
                />
              ) : (
                <div className="space-y-4">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-4 hover:border-white/20 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-red-400">{req.requestNumber}</span>
                            <StatusBadge status={req.status} />
                          </div>
                          <div className="text-lg font-bold text-white">
                            {req.legs.map(l => `${l.departure.city} (${l.departure.icao})`).join(' ➔ ')} ➔ {req.legs[req.legs.length - 1].destination.city} ({req.legs[req.legs.length - 1].destination.icao})
                          </div>
                        </div>
                        <div className="text-xs text-zinc-400 font-normal">
                          Submitted: {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-normal">
                        <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/5">
                          <span className="text-zinc-400">Category</span>
                          <div className="text-white font-bold text-sm mt-0.5">{req.aircraftCategory}</div>
                        </div>
                        <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/5">
                          <span className="text-zinc-400">Total Distance</span>
                          <div className="text-white font-bold text-sm mt-0.5">
                            {req.legs.reduce((acc, l) => acc + l.distanceNm, 0).toLocaleString()} NM
                          </div>
                        </div>
                        <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/5">
                          <span className="text-zinc-400">Passengers</span>
                          <div className="text-white font-bold text-sm mt-0.5">{req.legs[0]?.passengers || 4} Guests</div>
                        </div>
                        <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/5">
                          <span className="text-zinc-400">Ground Transport</span>
                          <div className="text-emerald-400 font-bold text-sm mt-0.5">{req.groundTransport ? 'Requested' : 'None'}</div>
                        </div>
                      </div>

                      {req.specialRequests && (
                        <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/5 text-xs text-zinc-300">
                          <span className="text-zinc-400 font-semibold">Special Instructions: </span>
                          {req.specialRequests}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QUOTES & PROPOSALS */}
          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Charter Proposals &amp; Quotations</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Inspect itemized operational tariffs, approve quotes, and initiate invoice generation.</p>
              </div>

              {quotes.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No quotations on file"
                  description="When flight operations processes your flight inquiries, itemized quotes with fuel, navigation, and landing tariffs will be displayed here."
                  actionLabel="Request a Flight"
                  onAction={onRequestNewFlight}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Quotes List on Left */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      Proposals ({quotes.length})
                    </div>
                    {quotes.map((q) => {
                      const isSelected = selectedQuoteForDetail?.id === q.id;
                      return (
                        <div
                          key={q.id}
                          onClick={() => setSelectedQuoteForDetail(q)}
                          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-zinc-900 border-red-500 shadow-xl shadow-red-950/40'
                              : 'bg-[#0D0D12] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-red-400 text-xs">{q.quoteNumber}</span>
                            <StatusBadge status={q.status} size="sm" />
                          </div>
                          <div className="text-sm font-bold text-white">
                            {q.request.legs.map(l => l.departure.icao).join(' ➔ ')} ➔ {q.request.legs[q.request.legs.length - 1].destination.icao}
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-xs">
                            <span className="text-zinc-400 font-medium">{q.aircraft.name}</span>
                            <span className="font-bold text-white text-sm">
                              ${q.costBreakdown.quotedTotal.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed Quote Spec on Right */}
                  <div className="lg:col-span-7">
                    {selectedQuoteForDetail ? (
                      <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0D12] border border-white/15 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wide text-red-400">
                              OFFICIAL CHARTER PROPOSAL
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-white">{selectedQuoteForDetail.quoteNumber}</h3>
                          </div>
                          <StatusBadge status={selectedQuoteForDetail.status} />
                        </div>

                        {/* Aircraft Card */}
                        <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-2">
                          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Allocated Aircraft</div>
                          <div className="text-base font-bold text-white">
                            {selectedQuoteForDetail.aircraft.name} ({selectedQuoteForDetail.aircraft.category})
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                            {selectedQuoteForDetail.aircraft.description}
                          </p>
                        </div>

                        {/* Itemized Cost Breakdown Table */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                            Itemized Operational Tariffs
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2.5 text-xs sm:text-sm font-normal">
                            <div className="flex justify-between text-zinc-300">
                              <span>Direct Jet-A Fuel Burn:</span>
                              <span className="text-white font-medium">
                                {selectedQuoteForDetail.costBreakdown.fuelCost !== null && selectedQuoteForDetail.costBreakdown.fuelCost > 0 ? (
                                  `$${selectedQuoteForDetail.costBreakdown.fuelCost.toLocaleString()}`
                                ) : (
                                  <span className="text-amber-400/90 text-xs italic">Pending Live JetFuelX Key</span>
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                              <span>Airport Landing &amp; FBO Handling:</span>
                              <span className="text-white font-medium">${selectedQuoteForDetail.costBreakdown.handlingCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                              <span>En-Route Navigation (Eurocontrol/FAA):</span>
                              <span className="text-white font-medium">${selectedQuoteForDetail.costBreakdown.navFees.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                              <span>Flight Crew &amp; Per-Diem Allocation:</span>
                              <span className="text-white font-medium">${selectedQuoteForDetail.costBreakdown.operationalCrewCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-zinc-300">
                              <span>Taxes &amp; Passenger Security Fees:</span>
                              <span className="text-white font-medium">${selectedQuoteForDetail.costBreakdown.taxesAndAirportFees.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-white/10 text-base sm:text-lg font-bold text-white">
                              <span>Total Charter Price:</span>
                              <span className="text-red-400 font-bold">${selectedQuoteForDetail.costBreakdown.quotedTotal.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                          {selectedQuoteForDetail.status === 'Sent' && (
                            <Button
                              variant="primary"
                              size="md"
                              icon={CheckCircle2}
                              onClick={() => onApproveQuote(selectedQuoteForDetail.id)}
                            >
                              Approve &amp; Issue Commercial Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-zinc-400 bg-[#0D0D12] rounded-2xl border border-white/10 font-normal">
                        Select a proposal from the left to inspect details.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONFIRMED TRIPS & BOARDING PASSES */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Confirmed Itineraries &amp; Dispatches</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Flight manifests, Captain introductions, and VIP FBO Gate credentials.</p>
              </div>

              {bookings.length === 0 ? (
                <EmptyState
                  icon={Plane}
                  title="No confirmed bookings"
                  description="When you accept a quote and settle the invoice, your flight manifest and crew assignments will appear here."
                  actionLabel="Request a Flight"
                  onAction={onRequestNewFlight}
                />
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
                        <div className="space-y-1">
                          <span className="text-sm font-semibold text-red-400">{b.bookingReference}</span>
                          <h3 className="text-lg font-bold text-white">{b.routeSummary}</h3>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-normal">
                        <div className="p-3 bg-zinc-900 rounded-xl">
                          <span className="text-zinc-400 font-medium">Aircraft &amp; Tail</span>
                          <div className="text-white font-bold text-sm">{b.aircraft.name} ({b.aircraft.tailNumber || '9K-AYL'})</div>
                        </div>
                        <div className="p-3 bg-zinc-900 rounded-xl">
                          <span className="text-zinc-400 font-medium">Departure</span>
                          <div className="text-white font-bold text-sm">{b.departureDate} @ {b.departureTime}</div>
                        </div>
                        <div className="p-3 bg-zinc-900 rounded-xl">
                          <span className="text-zinc-400 font-medium">Assigned Captain</span>
                          <div className="text-white font-bold text-sm">{b.captainName}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INVOICES & ESCROW */}
          {activeTab === 'invoices' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Commercial Invoices &amp; Escrow</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Accounts receivable, swift MT103 settlement instructions, and payment receipts.</p>
              </div>

              {invoices.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="No invoices on record"
                  description="Invoices will be generated automatically upon proposal approval."
                />
              ) : (
                <div className="space-y-4">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-red-400">{inv.invoiceNumber}</span>
                          <StatusBadge status={inv.status} size="sm" />
                        </div>
                        <h4 className="text-base font-bold text-white">{inv.routeSummary}</h4>
                        <div className="text-xs text-zinc-400 font-normal">Due Date: {inv.dueDate} &bull; Aircraft: {inv.aircraftName}</div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xs text-zinc-400 font-normal">AMOUNT</div>
                          <div className="text-xl font-bold text-white">${inv.total.toLocaleString()}</div>
                        </div>

                        {inv.status === 'Pending' && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={CreditCard}
                            onClick={() => onPayInvoice(inv.id, 'Wire Transfer / Swift MT103')}
                          >
                            Settle Invoice
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Payment Receipts</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Settlement logs and escrow deposit certificates.</p>
              </div>

              {paidInvoices.length === 0 ? (
                <EmptyState
                  icon={CreditCard}
                  title="No payment receipts"
                  description="When invoices are settled via wire or card, your receipts will be archived here."
                />
              ) : (
                <div className="space-y-4">
                  {paidInvoices.map((inv) => (
                    <div key={inv.id} className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-emerald-400 font-semibold">SETTLED: {inv.invoiceNumber}</span>
                        <div className="text-base font-bold text-white mt-0.5">{inv.routeSummary}</div>
                        <div className="text-xs text-zinc-400 font-normal">Method: {inv.paymentMethod || 'Wire Transfer'} &bull; Date: {inv.paidAt || 'Cleared'}</div>
                      </div>
                      <div className="text-right font-bold text-lg text-emerald-400">
                        ${inv.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: TRIP HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Trip History</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Archived flight legs, block hours flown, and passenger manifests.</p>
              </div>

              {bookings.length === 0 ? (
                <EmptyState
                  icon={History}
                  title="No past flights recorded"
                  description="Your completed private charter itineraries will be archived here for record-keeping."
                />
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-red-400 font-semibold">{b.bookingReference}</span>
                        <div className="text-base font-bold text-white mt-0.5">{b.routeSummary}</div>
                        <div className="text-xs text-zinc-400 font-normal">Flown: {b.departureDate} &bull; Aircraft: {b.aircraft.name}</div>
                      </div>
                      <StatusBadge status={b.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: PRINCIPAL PROFILE */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Principal &amp; Executive Profile</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Manage VIP passenger manifests, catering preferences, and emergency contacts.</p>
              </div>

              {showProfileSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profile updated successfully in system records.</span>
                </div>
              )}

              {profileError && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>{profileError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 font-normal"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-400">Corporate Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-sm text-zinc-400 cursor-not-allowed font-normal"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-400">Company / Family Office</label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    placeholder="E.g. Sterling Holdings"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 font-normal"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-400">Direct Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 font-normal"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  disabled={savingProfile}
                  onClick={async () => {
                    setSavingProfile(true);
                    setProfileError(null);
                    try {
                      const nameParts = profileData.name.trim().split(' ');
                      const firstName = nameParts[0] || '';
                      const lastName = nameParts.slice(1).join(' ') || '';
                      const res = await ProfileService.updateProfile({
                        firstName,
                        lastName,
                        companyName: profileData.company,
                        phone: profileData.phone,
                      });
                      if (res?.success) {
                        setShowProfileSuccess(true);
                        setTimeout(() => setShowProfileSuccess(false), 3500);
                      } else {
                        setProfileError(res?.message || 'Failed to update profile.');
                      }
                    } catch (err: any) {
                      setProfileError(err?.message || 'Network error updating profile.');
                    } finally {
                      setSavingProfile(false);
                    }
                  }}
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Settings'}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 9: SECURITY & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Security &amp; Account Settings</h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">Two-Factor Authentication, active sessions, and data privacy.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">JWT Access &amp; Refresh Token Rotation</h4>
                      <p className="text-xs text-zinc-400 font-normal">Active session cryptographically secured.</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-500/30">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
