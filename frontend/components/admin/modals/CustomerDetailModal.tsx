import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Shield, 
  CreditCard, 
  Compass, 
  FileSpreadsheet, 
  CalendarCheck, 
  Receipt, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: any;
  onUpdateStatus: (customerId: string, status: 'active' | 'inactive' | 'suspended') => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  isOpen,
  onClose,
  customerData,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'quotes' | 'bookings' | 'invoices'>('overview');

  if (!isOpen || !customerData) return null;

  const { customer, requests = [], quotes = [], bookings = [], invoices = [], payments = [] } = customerData;

  const totalSpent = invoices
    .filter((inv: any) => inv.status === 'Paid')
    .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0F0F16] border border-white/20 shadow-2xl z-10 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-black/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-950/80">
              {customer?.firstName ? customer.firstName.charAt(0) : 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{customer?.fullName}</h2>
                <StatusBadge status={customer?.status || 'active'} size="sm" />
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                {customer?.email} &bull; Member since {new Date(customer?.createdAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Quick Account Status Actions */}
          <div className="flex items-center gap-2">
            <select
              value={customer?.status || 'active'}
              onChange={(e) => onUpdateStatus(customer?.id || customer?._id, e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="active">Status: Active</option>
              <option value="inactive">Status: Inactive</option>
              <option value="suspended">Status: Suspended</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="px-6 border-b border-white/10 flex items-center gap-2 bg-[#09090D] overflow-x-auto shrink-0">
          {[
            { id: 'overview', label: 'VIP Profile & Summary', icon: User },
            { id: 'requests', label: `Flight Requests (${requests.length})`, icon: Compass },
            { id: 'quotes', label: `Quotes (${quotes.length})`, icon: FileSpreadsheet },
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: CalendarCheck },
            { id: 'invoices', label: `Invoices (${invoices.length})`, icon: Receipt },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'border-red-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Canvas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Lifetime Charter Spend</div>
                  <div className="text-xl font-bold text-emerald-400">${totalSpent.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Confirmed Flights</div>
                  <div className="text-xl font-bold text-white">{bookings.length}</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Active Requests</div>
                  <div className="text-xl font-bold text-blue-400">{requests.length}</div>
                </div>
              </div>

              {/* Contact and KYC Information */}
              <div className="p-5 rounded-2xl bg-[#14141E] border border-white/10 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Client Profile & Account Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Mail className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">Email Address</div>
                      <div className="font-medium text-white">{customer?.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-300">
                    <Phone className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">Phone Contact</div>
                      <div className="font-medium text-white">{customer?.phone || 'Not provided'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-300">
                    <Building className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">Company / Organization</div>
                      <div className="font-medium text-white">{customer?.companyName || 'Private Individual'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-zinc-300">
                    <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">KYC / AML Clearance</div>
                      <div className="font-medium text-emerald-400">PASSED (Sentinel Tier 1)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400">No charter flight requests logged.</div>
              ) : (
                requests.map((r: any) => (
                  <div key={r.id || r._id} className="p-4 rounded-xl bg-zinc-900/70 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{r.requestNumber || 'REQ-AUTO'}</span>
                        <StatusBadge status={r.status || 'Pending'} size="sm" />
                      </div>
                      <div className="text-zinc-400 mt-1">
                        {r.itinerarySummary || `${r.departureAirport} → ${r.arrivalAirport}`} &bull; {r.passengers} pax
                      </div>
                    </div>
                    <div className="text-right text-xs text-zinc-400">
                      {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* QUOTES TAB */}
          {activeTab === 'quotes' && (
            <div className="space-y-3">
              {quotes.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400">No quotes issued for this customer.</div>
              ) : (
                quotes.map((q: any) => (
                  <div key={q.id || q._id} className="p-4 rounded-xl bg-zinc-900/70 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{q.quoteNumber}</span>
                        <StatusBadge status={q.status || 'Draft'} size="sm" />
                      </div>
                      <div className="text-zinc-400 mt-1">
                        {q.aircraftName} &bull; {q.routeSummary}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400 text-sm">
                        ${q.costBreakdown?.quotedTotal?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-zinc-400">
                        Valid until: {q.validUntil}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400">No confirmed bookings on record.</div>
              ) : (
                bookings.map((b: any) => (
                  <div key={b.id || b._id} className="p-4 rounded-xl bg-zinc-900/70 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{b.bookingReference} (PNR: {b.pnr})</span>
                        <StatusBadge status={b.status || 'Confirmed'} size="sm" />
                      </div>
                      <div className="text-zinc-400 mt-1">
                        {b.aircraftName} ({b.tailNumber}) &bull; {b.routeSummary}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white text-sm">
                        ${b.totalAmount?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-emerald-400 font-medium">
                        Payment: {b.paymentStatus}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* INVOICES TAB */}
          {activeTab === 'invoices' && (
            <div className="space-y-3">
              {invoices.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-400">No commercial invoices generated.</div>
              ) : (
                invoices.map((inv: any) => (
                  <div key={inv.id || inv._id} className="p-4 rounded-xl bg-zinc-900/70 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{inv.invoiceNumber}</span>
                        <StatusBadge status={inv.status || 'Issued'} size="sm" />
                      </div>
                      <div className="text-zinc-400 mt-1">
                        Due: {inv.dueDate} &bull; Ref: {inv.bookingReference || 'Charter Invoice'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400 text-sm">
                        ${inv.total?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-zinc-400">
                        Issued: {new Date(inv.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
