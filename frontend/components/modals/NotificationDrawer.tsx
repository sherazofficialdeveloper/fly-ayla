import React from 'react';
import { X, Bell, Check, Plane, Receipt, ShieldAlert, FileText } from 'lucide-react';
import { NotificationItem } from '../../types/aviation';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (item: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 border border-white/20 rounded-2xl shadow-2xl overflow-hidden mt-14 space-y-4 p-5 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-semibold text-white">Platform Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-zinc-400 hover:text-white font-medium"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500 font-normal">
              No new alerts.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectNotification(n);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-zinc-900/50 border-white/5 opacity-70'
                    : 'bg-zinc-900 border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-semibold text-white">{n.title}</div>
                  <span className="text-xs text-zinc-500 font-normal shrink-0">{n.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-normal">{n.message}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
