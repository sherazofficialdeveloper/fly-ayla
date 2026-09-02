import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building,
  UserCheck,
  UserX,
  ShieldAlert
} from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';

interface CustomersViewProps {
  customers: any[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  onViewCustomer: (customerId: string) => void;
  onUpdateStatus: (customerId: string, status: 'active' | 'inactive' | 'suspended') => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  total,
  page,
  limit,
  onPageChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onViewCustomer,
  onUpdateStatus,
}) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Search and Status Filters */}
      <div className="p-4 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, company..."
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
            <option value="">All Accounts ({total})</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="rounded-2xl bg-[#0F0F16] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-zinc-400 font-semibold uppercase text-xs tracking-wide">
                <th className="py-3.5 px-4 font-semibold">Customer / VIP Client</th>
                <th className="py-3.5 px-4 font-semibold">Email & Phone</th>
                <th className="py-3.5 px-4 font-semibold">Company / Holding</th>
                <th className="py-3.5 px-4 font-semibold">Account Status</th>
                <th className="py-3.5 px-4 font-semibold">Member Since</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id || c._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {c.firstName ? c.firstName.charAt(0) : 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-white tracking-tight">{c.fullName}</div>
                          <div className="text-xs text-zinc-400 font-normal">ID: {(c.id || c._id)?.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-zinc-200 font-medium">{c.email}</div>
                      <div className="text-xs text-zinc-400 font-normal">{c.phone || 'No phone'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      {c.companyName || 'Private Client'}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status || 'active'} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 text-xs font-normal">
                      {new Date(c.createdAt || Date.now()).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewCustomer(c.id || c._id)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-white/25 text-zinc-200 hover:text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                          title="View full flight profile & history"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Details</span>
                        </button>

                        <select
                          value={c.status || 'active'}
                          onChange={(e) => onUpdateStatus(c.id || c._id, e.target.value as any)}
                          className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-red-500 cursor-pointer"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspend</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-zinc-400">
          <div>
            Showing {Math.min(total, (page - 1) * limit + 1)} - {Math.min(total, page * limit)} of {total} customers
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
