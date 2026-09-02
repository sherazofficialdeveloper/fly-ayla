import React from 'react';
import { 
  Compass, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  Eye, 
  Plane, 
  User, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface FlightRequestsViewProps {
  requests: any[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  onConvertToQuote: (request: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export const FlightRequestsView: React.FC<FlightRequestsViewProps> = ({
  requests,
  total,
  page,
  limit,
  onPageChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onConvertToQuote,
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
            placeholder="Search request #, customer, route..."
            className="w-full bg-[#14141E] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#14141E] border border-white/10 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="">All Requests ({total})</option>
            <option value="Pending">Pending</option>
            <option value="Quoted">Quoted</option>
            <option value="Approved">Approved</option>
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
                <th className="py-3.5 px-4 font-semibold">Request Number</th>
                <th className="py-3.5 px-4 font-semibold">Client Name</th>
                <th className="py-3.5 px-4 font-semibold">Routing & Schedule</th>
                <th className="py-3.5 px-4 font-semibold">Aircraft / Pax</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    No flight requests found matching the search criteria.
                  </td>
                </tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id || r._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">
                      {r.requestNumber || 'REQ-AUTO'}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{r.customerName}</div>
                      <div className="text-xs text-zinc-400 font-normal">{r.customerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-zinc-200 font-medium flex items-center gap-1.5">
                        <span>{r.departureAirport || r.legs?.[0]?.departureAirport || r.legs?.[0]?.departure?.icao || 'TBD'}</span>
                        <ArrowRight className="w-3 h-3 text-red-500" />
                        <span>{r.arrivalAirport || r.destinationAirport || r.legs?.[r.legs?.length - 1]?.destinationAirport || r.legs?.[r.legs?.length - 1]?.destination?.icao || 'TBD'}</span>
                      </div>
                      <div className="text-xs text-zinc-400 font-normal">
                        Departure: {r.departureDate || r.legs?.[0]?.departureDate || r.legs?.[0]?.date || 'As specified'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-zinc-300 font-medium">
                        {r.preferredAircraftCategory || r.aircraftPreference || r.aircraftCategory || 'Ultra Long Range'}
                      </div>
                      <div className="text-xs text-zinc-400 font-normal">
                        {r.passengers || r.passengersCount || r.legs?.[0]?.passengersCount || r.legs?.[0]?.passengers || 4} Passengers
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={r.status || 'Pending'} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onConvertToQuote(r)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-950/60 transition-all"
                          title="Generate quotation from this flight request"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          <span>Quote</span>
                        </button>

                        <select
                          value={r.status || 'Pending'}
                          onChange={(e) => onUpdateStatus(r.id || r._id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-red-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Quoted">Quoted</option>
                          <option value="Approved">Approved</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
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
            Showing {Math.min(total, (page - 1) * limit + 1)} - {Math.min(total, page * limit)} of {total} requests
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
