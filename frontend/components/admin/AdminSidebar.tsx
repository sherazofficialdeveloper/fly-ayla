import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Compass, 
  FileSpreadsheet, 
  CalendarCheck, 
  Receipt, 
  CreditCard, 
  Plane, 
  MapPin, 
  DollarSign, 
  ShieldAlert, 
  Bell, 
  BarChart3, 
  ScrollText, 
  Settings, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Radio
} from 'lucide-react';
import { FlyAylaLogo } from '../common/FlyAylaLogo';

export type AdminTab = 
  | 'dashboard'
  | 'customers'
  | 'flight-requests'
  | 'quotes'
  | 'bookings'
  | 'invoices'
  | 'payments'
  | 'aircraft'
  | 'airports'
  | 'pricing'
  | 'payla-forensic'
  | 'notifications'
  | 'cms'
  | 'reports'
  | 'audit-logs'
  | 'settings'
  | 'profile';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  unreadNotifsCount?: number;
  onLogout: () => void;
  onExitAdmin: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  unreadNotifsCount = 0,
  onLogout,
  onExitAdmin
}) => {
  const mainNavItems: { id: AdminTab; label: string; icon: any; badge?: number | string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'flight-requests', label: 'Flight Requests', icon: Compass },
    { id: 'quotes', label: 'Quotes', icon: FileSpreadsheet },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'aircraft', label: 'Aircraft Fleet', icon: Plane },
    { id: 'airports', label: 'Airports Matrix', icon: MapPin },
    { id: 'pricing', label: 'Pricing Engine', icon: DollarSign },
    { id: 'payla-forensic', label: 'PAYLA FORENSIC', icon: ShieldAlert, badge: 'AML' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined },
    { id: 'cms', label: 'CMS Content', icon: ScrollText },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-[#09090D] border-r border-white/10 select-none">
      
      {/* Header / Brand Logo */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[72px]">
        <div className="flex items-center gap-3 overflow-hidden">
          {!isCollapsed ? (
            <div>
              <FlyAylaLogo size="sm" />
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                  OPS COMMAND v2.6
                </span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm mx-auto shadow-md shadow-red-950">
              A
            </div>
          )}
        </div>

        {/* Mobile close or desktop collapse */}
        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Nav items list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left group cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white font-semibold shadow-lg shadow-red-950/80'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
              
              {!isCollapsed && (
                <span className="flex-1 truncate tracking-normal text-sm font-medium">
                  {item.label}
                </span>
              )}

              {!isCollapsed && item.badge && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                  isActive ? 'bg-black/40 text-white' : 'bg-red-950/80 text-red-400 border border-red-800/40'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Ops Status & Exit Actions */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-[#0C0C12]/60">
        {!isCollapsed && (
          <div className="px-2 py-1.5 rounded-lg bg-zinc-900/90 border border-white/5 flex items-center justify-between text-xs text-zinc-400 font-normal">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-300">ICAO SECURE NET</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">LIVE</span>
          </div>
        )}

        <button
          onClick={onExitAdmin}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Return to Public Website"
        >
          <Compass className="w-4 h-4 text-zinc-400" />
          {!isCollapsed && <span>Public Website</span>}
        </button>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-900/30 transition-all cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="sticky top-0 h-screen">
          {renderNavContent()}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
};
