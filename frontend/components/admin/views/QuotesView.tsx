import React from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Printer, 
  Eye, 
  Send, 
  Plane, 
  DollarSign 
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface QuotesViewProps {
  quotes: any[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  onOpenCreateQuote: () => void;
  onViewPdf: (quote: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

export const QuotesView: React.FC<QuotesViewProps> = ({
  quotes,
  total,
  page,
  limit,
  onPageChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenCreateQuote,
  onViewPdf,
  onUpdateStatus,
}) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header / Actions & Filters */}
      <div className="p-4 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search quote #, customer, aircraft..."
            className="w-full bg-[#14141E] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#14141E] border border-white/10 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="">All Quotes ({total})</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Expired">Expired</option>
          </select>

          <button
            onClick={onOpenCreateQuote}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quote</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0F0F16] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-zinc-400 font-semibold uppercase text-xs tracking-wide">
                <th className="py-3.5 px-4 font-semibold">Quote Reference</th>
                <th className="py-3.5 px-4 font-semibold">Client Name</th>
                <th className="py-3.5 px-4 font-semibold">Aircraft & Routing</th>
                <th className="py-3.5 px-4 font-semibold">Quoted Total (USD)</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    No quotes found matching the search criteria.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id || q._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">
                      {q.quoteNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{q.customerName || q.request?.customerName || 'VIP Client'}</div>
                      <div className="text-xs text-zinc-400 font-normal">{q.customerEmail || q.request?.customerEmail || ''}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-zinc-200 font-medium">{q.aircraftName || q.aircraft?.name || 'Private Jet'}</div>
                      <div className="text-xs text-zinc-400 font-normal">
                        {q.routeSummary || (q.request?.legs ? q.request.legs.map((l: any) => l.departureAirport || l.departure?.icao).join(' ➔ ') + ' ➔ ' + (q.request.legs[q.request.legs.length - 1]?.destinationAirport || q.request.legs[q.request.legs.length - 1]?.destination?.icao) : 'Charter Route')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400 text-sm">
                        ${(q.costBreakdown?.quotedTotal || q.totalAmount || q.amount || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-zinc-400 font-normal">
                        Valid: {q.validUntil ? (typeof q.validUntil === 'string' && q.validUntil.includes('T') ? new Date(q.validUntil).toLocaleDateString() : q.validUntil) : '7 days'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={q.status || 'Sent'} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewPdf(q)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/25 text-zinc-200 hover:text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                          title="Generate & View Official PDF Quote"
                        >
                          <Printer className="w-3.5 h-3.5 text-zinc-400" />
                          <span>PDF</span>
                        </button>

                        <select
                          value={q.status || 'Sent'}
                          onChange={(e) => onUpdateStatus(q.id || q._id, e.target.value)}
                          className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-red-500 cursor-pointer"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Expired">Expired</option>
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
            Showing {Math.min(total, (page - 1) * limit + 1)} - {Math.min(total, page * limit)} of {total} quotes
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
