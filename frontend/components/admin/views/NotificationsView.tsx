import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Compass, 
  DollarSign, 
  FileSpreadsheet, 
  ShieldAlert, 
  CalendarCheck, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface NotificationsViewProps {
  notifications: any[];
  onMarkRead: (id: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filterType === 'UNREAD') return !n.read;
    if (filterType === 'QUOTE') return n.type?.includes('QUOTE') || n.title?.includes('Quote');
    if (filterType === 'PAYMENT') return n.type?.includes('PAYMENT') || n.title?.includes('Payment');
    if (filterType === 'AML') return n.type?.includes('AML') || n.type?.includes('FORENSIC');
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Flight Operations Alerts & Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 text-xs font-semibold border border-red-800/40">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Mission requests, customer quote approvals, swift wire confirmations, and AML alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/15 hover:border-white/30 text-zinc-200 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'ALL', label: `All Alerts (${notifications.length})` },
          { id: 'UNREAD', label: `Unread (${unreadCount})` },
          { id: 'QUOTE', label: 'Quotes & Bookings' },
          { id: 'PAYMENT', label: 'Payments & Escrow' },
          { id: 'AML', label: 'PAYLA FORENSIC' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-red-600 border-red-500 text-white font-semibold shadow-lg shadow-red-950/60'
                : 'bg-[#0F0F16] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl bg-[#0F0F16] border border-white/10 overflow-hidden shadow-2xl divide-y divide-white/5">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-400">
            No notifications found under this filter category.
          </div>
        ) : (
          filtered.map((n) => {
            const isRead = n.read;
            return (
              <div
                key={n.id || n._id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  !isRead ? 'bg-red-950/15 hover:bg-red-950/25' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                    !isRead
                      ? 'bg-red-950 text-red-400 border-red-800/50'
                      : 'bg-zinc-900 text-zinc-400 border-white/10'
                  }`}>
                    {n.type?.includes('PAYMENT') ? (
                      <DollarSign className="w-4 h-4" />
                    ) : n.type?.includes('AML') ? (
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    ) : n.type?.includes('BOOKING') ? (
                      <CalendarCheck className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white tracking-tight">{n.title}</h4>
                      {!isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">{n.message}</p>
                    <div className="text-xs text-zinc-400 pt-1 font-normal">
                      {n.timestamp ? new Date(n.timestamp).toLocaleString() : 'Just now'}
                    </div>
                  </div>
                </div>

                {!isRead && (
                  <button
                    onClick={() => onMarkRead(n.id || n._id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 shrink-0 cursor-pointer"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
