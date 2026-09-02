import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenMobileSidebar: () => void;
  adminUser: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    companyName?: string;
  } | null;
  notifications: any[];
  onMarkAllNotificationsRead: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenMobileSidebar,
  adminUser,
  notifications,
  onMarkAllNotificationsRead,
  onLogout,
  searchQuery,
  onSearchChange
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabTitles: Record<AdminTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive Operations Command', subtitle: 'Real-time charter pipeline, fleet telemetry and global dispatch' },
    customers: { title: 'VIP & Corporate Customers', subtitle: 'Customer registry, flight records and account status controls' },
    'flight-requests': { title: 'Charter Flight Requests', subtitle: 'Incoming flight requests, itinerary calculation and quote conversion' },
    quotes: { title: 'Charter Quotes Management', subtitle: 'Itemized quotation engine, margins, taxes and PDF delivery' },
    bookings: { title: 'Confirmed Flight Bookings', subtitle: 'Flight crew assignments, PNR dispatch, FBO terminal manifests' },
    invoices: { title: 'Commercial Aviation Invoices', subtitle: 'Billing statements, Swift MT103 tracking and tax documentation' },
    payments: { title: 'Payments & Escrow Transactions', subtitle: 'Verified bank transfers, card settlements and escrow audit trails' },
    aircraft: { title: 'Global Aircraft Fleet', subtitle: 'Fleet registry, category specifications and maintenance schedules' },
    airports: { title: 'Global Airport Database', subtitle: '4,200+ executive airports, runway specs, FBOs and landing tariffs' },
    pricing: { title: 'Direct Operating Cost & Pricing Engine', subtitle: 'Jet-A fuel benchmark, airspace navigation fees and profit margins' },
    'payla-forensic': { title: 'PAYLA FORENSIC™ AML Sentinel', subtitle: 'Real-time anti-money laundering, OFAC sanctions and transaction risk analysis' },
    notifications: { title: 'Operations Notifications', subtitle: 'Live alerts for charter quotes, payments and flight status updates' },
    cms: { title: 'Global Website Content & Copywriting', subtitle: 'Live CMS editor for hero copy, pricing calculators, fleet and testimonials' },
    reports: { title: 'Reports & Business Intelligence', subtitle: 'Revenue aggregation, route analytics and CSV/PDF financial export' },
    'audit-logs': { title: 'Immutable Security Audit Trail', subtitle: 'SHA-256 verified action logs of all admin and customer transactions' },
    settings: { title: 'Platform & Security Settings', subtitle: 'Global dispatch contact, AOC licensing, email and payment gateway configuration' },
    profile: { title: 'Admin Account & Security Profile', subtitle: 'Manage authorized personnel credentials and contact info' },
  };

  const currentInfo = tabTitles[currentTab] || { title: 'Administration', subtitle: 'Fly Ayla Operations' };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#08080C]/95 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-zinc-400">
              <span>FLY AYLA OPS</span>
              <span>/</span>
              <span className="text-red-400 font-bold">{currentTab.replace('-', ' ')}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {currentInfo.title}
            </h1>
          </div>
        </div>

        {/* Right Side: Global Search, Notifications, Admin Profile */}
        <div className="flex items-center gap-3">
          
          {/* Global Search Bar */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search across ops..."
              className="w-full bg-[#0E0E14] text-xs text-zinc-100 pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-red-500/60 transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-zinc-300 hover:text-white bg-[#0E0E14] border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0F0F16] border border-white/15 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-black/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">Ops Alerts</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800/40">
                      {unreadCount} new
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-400">
                      No new operational alerts.
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id || n._id}
                        className={`p-3 text-xs transition-colors hover:bg-white/5 ${
                          !n.read ? 'bg-red-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-zinc-200">{n.title}</span>
                          <span className="text-xs text-zinc-400 shrink-0 font-normal">
                            {n.timestamp ? new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                          </span>
                        </div>
                        <p className="text-zinc-400 mt-1 text-xs line-clamp-2 leading-relaxed font-normal">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-white/10 bg-black/40 text-center">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      onSelectTab('notifications');
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all notifications</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Chip & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#0E0E14] border border-white/10 hover:border-white/25 transition-all text-left cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-red-950">
                {adminUser?.firstName ? adminUser.firstName.charAt(0).toUpperCase() : 'A'}
              </div>

              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors flex items-center gap-1">
                  <span>{adminUser?.firstName ? `${adminUser.firstName} ${adminUser.lastName || ''}`.trim() : 'Flight Ops Admin'}</span>
                  <ShieldCheck className="w-3 h-3 text-red-500" />
                </div>
                <div className="text-xs text-zinc-400 truncate max-w-[120px] font-normal">
                  {adminUser?.email || 'admin@flyayla.com'}
                </div>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F0F16] border border-white/15 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                
                {/* User info banner */}
                <div className="p-4 border-b border-white/10 bg-gradient-to-b from-red-950/40 to-transparent">
                  <div className="text-xs font-bold text-white">
                    {adminUser?.firstName ? `${adminUser.firstName} ${adminUser.lastName || ''}`.trim() : 'Flight Ops Administrator'}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 truncate font-normal">
                    {adminUser?.email || 'admin@flyayla.com'}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-600/20 border border-red-500/40 text-xs font-semibold text-red-300 uppercase tracking-wide">
                    <ShieldCheck className="w-3 h-3 text-red-400" />
                    <span>Database Role: Admin</span>
                  </div>
                </div>

                {/* Dropdown actions */}
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSelectTab('profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-zinc-400" />
                    <span>Admin Profile & Credentials</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSelectTab('settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    <span>System Settings & AOC</span>
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSelectTab('audit-logs');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-zinc-400" />
                    <span>Audit Trail</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-white/10 bg-black/30">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-all text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out from Ops</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
