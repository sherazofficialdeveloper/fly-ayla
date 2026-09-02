import React from 'react';
import { 
  Compass, 
  FileSpreadsheet, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  Plane, 
  Users, 
  ArrowUpRight, 
  Radio, 
  Clock, 
  ShieldAlert, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';
import { AdminTab } from '../AdminSidebar';

interface DashboardHomeViewProps {
  metricsData: any;
  onNavigateTab: (tab: AdminTab) => void;
  onOpenCreateQuote: () => void;
}

export const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({
  metricsData,
  onNavigateTab,
  onOpenCreateQuote,
}) => {
  const metrics = metricsData?.metrics || {
    totalRevenue: 0,
    activeFlightRequests: 0,
    pendingQuotes: 0,
    confirmedBookings: 0,
    totalCustomers: 0,
    activeFleetCount: 0,
    amlAlertsCount: 0,
    unpaidInvoicesCount: 0,
  };

  const recentRequests = metricsData?.recentRequests || [];
  const recentBookings = metricsData?.recentBookings || [];
  const recentQuotes = metricsData?.recentQuotes || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner / Quick Actions */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0F0F16] to-[#0A0A10] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
              GLOBAL FLIGHT DISPATCH ACTIVE
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Global Executive Operations Command
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Real-time flight radar tracking, live charter quotation pipeline, and automated direct operating cost calculation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreateQuote}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Quote</span>
          </button>

          <button
            onClick={() => onNavigateTab('payla-forensic')}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 hover:border-white/30 text-zinc-200 hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>AML Sentinel</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div 
          onClick={() => onNavigateTab('reports')}
          className="p-5 rounded-2xl bg-[#0F0F16] border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Total Charter Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              ${metrics.totalRevenue?.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-0.5 font-medium">
              <TrendingUp className="w-3 h-3" /> +18.4%
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-2 font-normal">
            Settled via Swift & Escrow
          </div>
        </div>

        {/* Confirmed Bookings */}
        <div 
          onClick={() => onNavigateTab('bookings')}
          className="p-5 rounded-2xl bg-[#0F0F16] border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Confirmed Missions
            </span>
            <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/40">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {metrics.confirmedBookings}
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Active Flights
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-2 font-normal">
            PNR & flight crews assigned
          </div>
        </div>

        {/* Pending Requests & Quotes */}
        <div 
          onClick={() => onNavigateTab('flight-requests')}
          className="p-5 rounded-2xl bg-[#0F0F16] border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Charter Requests
            </span>
            <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/40">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
              {metrics.activeFlightRequests}
            </span>
            <span className="text-xs text-amber-400 font-medium">
              {metrics.pendingQuotes} Quotes Ready
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-2 font-normal">
            Awaiting customer review
          </div>
        </div>

        {/* Fleet & AML Status */}
        <div 
          onClick={() => onNavigateTab('aircraft')}
          className="p-5 rounded-2xl bg-[#0F0F16] border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Available Fleet
            </span>
            <div className="p-2 rounded-xl bg-red-950/80 text-red-400 border border-red-800/40">
              <Plane className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
              {metrics.activeFleetCount} Jets
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              100% Ready
            </span>
          </div>
          <div className="text-xs text-zinc-400 mt-2 font-normal">
            Airworthiness verified
          </div>
        </div>

      </div>

      {/* Two Column Layout: Recent Flight Requests & Active Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Flight Requests */}
        <div className="p-6 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Incoming Charter Requests
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('flight-requests')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {recentRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                No new flight requests received.
              </div>
            ) : (
              recentRequests.slice(0, 5).map((r: any) => (
                <div key={r.id || r._id} className="py-3 flex items-center justify-between text-xs hover:bg-white/5 px-2 rounded-xl transition-colors">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{r.customerName}</span>
                      <StatusBadge status={r.status || 'Pending'} size="sm" />
                    </div>
                    <div className="text-zinc-400 mt-0.5 text-xs font-normal">
                      {r.itinerarySummary || `${r.departureAirport} → ${r.arrivalAirport}`} &bull; {r.passengers} pax
                    </div>
                  </div>
                  <div className="text-right text-zinc-400 text-xs font-normal">
                    {r.preferredAircraftCategory || 'Ultra Long Range'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Confirmed Bookings */}
        <div className="p-6 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Active Flight Dispatches
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {recentBookings.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                No active flight dispatches today.
              </div>
            ) : (
              recentBookings.slice(0, 5).map((b: any) => (
                <div key={b.id || b._id} className="py-3 flex items-center justify-between text-xs hover:bg-white/5 px-2 rounded-xl transition-colors">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{b.bookingReference}</span>
                      <StatusBadge status={b.status || 'Confirmed'} size="sm" />
                    </div>
                    <div className="text-zinc-400 mt-0.5 text-xs font-normal">
                      {b.aircraftName} ({b.tailNumber}) &bull; {b.customerName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white text-xs">
                      ${b.totalAmount?.toLocaleString()}
                    </div>
                    <div className="text-xs text-emerald-400 font-medium">
                      {b.pnr}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
