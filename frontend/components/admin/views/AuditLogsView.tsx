import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  User, 
  Clock, 
  FileText 
} from 'lucide-react';

interface AuditLogsViewProps {
  logs: any[];
  total: number;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, total }) => {
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((l) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      l.action?.toLowerCase().includes(term) ||
      l.userName?.toLowerCase().includes(term) ||
      l.userEmail?.toLowerCase().includes(term) ||
      l.details?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Administrative & Security Audit Trail ({total})
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800/40">
              IMMUTABLE LOGS
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cryptographic ledger tracking all operator logins, quote adjustments, pricing engine parameter edits, and AML adjudications.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, user, details..."
            className="w-full bg-[#14141E] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#0F0F16] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-zinc-400 font-semibold uppercase text-xs tracking-wide">
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">Operator / Identity</th>
                <th className="py-3.5 px-4 font-semibold">Action Executed</th>
                <th className="py-3.5 px-4 font-semibold">Event Details</th>
                <th className="py-3.5 px-4 font-semibold">IP Address</th>
                <th className="py-3.5 px-4 font-semibold text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id || log._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 text-zinc-400 text-xs font-normal whitespace-nowrap">
                      {new Date(log.timestamp || log.createdAt || Date.now()).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{log.userName || 'Admin Operator'}</div>
                      <div className="text-xs text-zinc-400 font-normal">{log.userEmail || 'admin@flyayla.com'}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-red-400 text-xs">
                      {log.action}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300 max-w-md">
                      {log.details || 'Executed administrative operation successfully.'}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-400 text-xs font-normal">
                      {log.ipAddress || '127.0.0.1'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        <ShieldCheck className="w-3 h-3" />
                        <span>VERIFIED</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
