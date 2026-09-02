import React from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  DollarSign, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface InvoicesViewProps {
  invoices: any[];
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

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
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
            placeholder="Search invoice #, customer, booking ref..."
            className="w-full bg-[#14141E] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#14141E] border border-white/10 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="">All Invoices ({total})</option>
            <option value="Paid">Paid</option>
            <option value="Issued">Issued</option>
            <option value="Draft">Draft</option>
            <option value="Overdue">Overdue</option>
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
                <th className="py-3.5 px-4 font-semibold">Invoice Number</th>
                <th className="py-3.5 px-4 font-semibold">Client / Company</th>
                <th className="py-3.5 px-4 font-semibold">Booking Reference</th>
                <th className="py-3.5 px-4 font-semibold">Due Date</th>
                <th className="py-3.5 px-4 font-semibold">Total (USD)</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No commercial invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id || inv._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{inv.customerName}</div>
                      <div className="text-xs text-zinc-400 font-normal">{inv.customerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300 font-medium">
                      {inv.bookingReference || 'CHARTER'}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 text-xs font-normal">
                      {inv.dueDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400 text-sm">
                        ${inv.total?.toLocaleString() || '0'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={inv.status || 'Issued'} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={inv.status || 'Issued'}
                        onChange={(e) => onUpdateStatus(inv.id || inv._id, { status: e.target.value })}
                        className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
                      >
                        <option value="Paid">Mark as Paid</option>
                        <option value="Issued">Issued</option>
                        <option value="Draft">Draft</option>
                        <option value="Overdue">Overdue</option>
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
            Showing {Math.min(total, (page - 1) * limit + 1)} - {Math.min(total, page * limit)} of {total} invoices
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
