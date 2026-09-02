import React from 'react';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Plane, 
  User, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface BookingsViewProps {
  bookings: any[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  onUpdateStatus: (id: string, data: any) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  total,
  page,
  limit,
  onPageChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onUpdateStatus,
}) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search booking ref, PNR, client, tail #..."
            className="w-full bg-[#14141E] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#14141E] border border-white/10 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="">All Bookings ({total})</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In-Flight">In-Flight</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0F0F16] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-zinc-400 font-semibold uppercase text-xs tracking-wide">
                <th className="py-3.5 px-4 font-semibold">Booking Ref / PNR</th>
                <th className="py-3.5 px-4 font-semibold">Client Name</th>
                <th className="py-3.5 px-4 font-semibold">Aircraft (Tail #)</th>
                <th className="py-3.5 px-4 font-semibold">Routing & Schedule</th>
                <th className="py-3.5 px-4 font-semibold">Amount (USD)</th>
                <th className="py-3.5 px-4 font-semibold">Flight Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Dispatch Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No confirmed charter bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id || b._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{b.bookingReference}</div>
                      <div className="text-xs text-red-400 font-medium">PNR: {b.pnr}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{b.customerName}</div>
                      <div className="text-xs text-zinc-400 font-normal">{b.customerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-zinc-200 font-medium">{b.aircraftName}</div>
                      <div className="text-xs text-zinc-400 font-normal">{b.tailNumber || 'Assigned'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-zinc-200 font-medium">{b.routeSummary}</div>
                      <div className="text-xs text-zinc-400 font-normal">{b.departureDate || 'Scheduled'}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400 text-sm">
                        ${b.totalAmount?.toLocaleString() || '0'}
                      </div>
                      <div className="text-xs text-zinc-400 font-normal">
                        Pay: {b.paymentStatus || 'Paid'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status || 'Confirmed'} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={b.status || 'Confirmed'}
                        onChange={(e) => onUpdateStatus(b.id || b._id, { status: e.target.value })}
                        className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="In-Flight">In-Flight</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-zinc-400">
          <div>
            Showing {Math.min(total, (page - 1) * limit + 1)} - {Math.min(total, page * limit)} of {total} bookings
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-zinc-200 px-2 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
