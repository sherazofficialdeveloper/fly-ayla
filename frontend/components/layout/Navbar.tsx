import React, { useState } from 'react';
import { FlyAylaLogo } from '../common/FlyAylaLogo';
import { 
  User, 
  ShieldCheck, 
  Menu, 
  X, 
  Bell, 
  ArrowUpRight, 
  ChevronRight,
  LogOut,
  PhoneCall
} from 'lucide-react';
import { NotificationItem, UserProfile } from '../../types/aviation';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  activeRole: 'guest' | 'customer' | 'admin';
  onChangeRole: (role: 'guest' | 'customer' | 'admin') => void;
  currentUser: UserProfile;
  notifications: NotificationItem[];
  onOpenAuthModal: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeRole,
  onChangeRole,
  currentUser,
  notifications,
  onOpenAuthModal,
  onOpenNotifications
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user: authUser, logout, isAuthenticated } = useAuth();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavClick = (page: string) => {
    setMobileMenuOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutClick = async () => {
    await logout();
    onChangeRole('guest');
    onNavigate('home');
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08080A]/95 backdrop-blur-xl transition-all">
      
      {/* Top subtle operational status bar */}
      <div className="w-full bg-[#0c0d11] border-b border-white/5 px-4 sm:px-6 py-1 text-[11px] text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="font-medium tracking-wider uppercase text-zinc-300">
              GLOBAL FLIGHT OPERATIONS 24/7 &bull; 4,500+ EXECUTIVE AIRFIELDS
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span className="hidden sm:inline text-zinc-300">
              ops@flyayla.com
            </span>
            <span className="text-zinc-600 hidden sm:inline">&bull;</span>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <PhoneCall className="w-3 h-3 text-red-500" />
              <span className="font-medium">+1 (800) 555-AYLA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 focus:outline-none group text-left cursor-pointer"
          >
            <FlyAylaLogo size="md" />
          </button>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-[13px] font-medium tracking-wide text-zinc-300">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-colors py-1 relative cursor-pointer ${
                    isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-600 rounded-[1px]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center space-x-2.5">
            
            {/* Notification Bell */}
            {isAuthenticated && (
              <button
                id="btn-notifications-toggle"
                onClick={onOpenNotifications}
                className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-[6px] border border-transparent hover:border-white/10 transition-all cursor-pointer"
                title="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-600 rounded-full" />
                )}
              </button>
            )}

            {/* Authenticated User Portal Links / Log In */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {authUser?.role === 'admin' ? (
                  <button
                    id="btn-nav-admin-active"
                    onClick={() => onNavigate('admin')}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentView === 'admin'
                        ? 'bg-red-950/80 border-red-500/60 text-white'
                        : 'bg-zinc-900 border-white/10 text-zinc-200 hover:border-white/30'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                    <span>Ops Command</span>
                  </button>
                ) : (
                  <button
                    id="btn-nav-portal-active"
                    onClick={() => onNavigate('customer')}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      currentView === 'customer'
                        ? 'bg-zinc-800 border-zinc-600 text-white'
                        : 'bg-zinc-900 border-white/10 text-zinc-200 hover:border-white/30'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-red-500" />
                    <span>{authUser?.firstName || 'VIP'} Portal</span>
                  </button>
                )}
                
                <button
                  id="btn-nav-logout"
                  onClick={handleLogoutClick}
                  title="Sign Out"
                  className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-[6px] border border-transparent hover:border-white/10 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-nav-login"
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 rounded-[6px] text-xs font-semibold tracking-wider uppercase text-zinc-300 hover:text-white border border-white/15 bg-black/40 hover:bg-white/5 transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Primary Action Button (Red CTA) */}
            <button
              id="btn-request-flight-cta"
              onClick={() => onNavigate('flight-request')}
              className="group px-4 py-2 rounded-[6px] text-xs font-semibold tracking-wider uppercase text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-md shadow-red-950/60 hover:-translate-y-[1px] active:translate-y-0 transition-all flex items-center gap-1.5 cursor-pointer leading-tight"
            >
              <span>Request Flight</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('flight-request')}
              className="px-2.5 py-1.5 rounded-[4px] text-xs font-semibold text-white bg-red-600 cursor-pointer"
            >
              Request
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-300 hover:text-white bg-white/5 rounded-[4px] border border-white/10 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#0c0d12] px-4 py-5 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-[6px] text-xs font-medium transition-colors cursor-pointer ${
                  currentView === item.id
                    ? 'bg-red-950/60 text-white border border-red-500/30 font-semibold'
                    : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('flight-request');
              }}
              className="w-full py-2.5 rounded-[6px] bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md leading-tight"
            >
              <span>Request a Flight</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {isAuthenticated ? (
              <div className="space-y-1.5">
                {authUser?.role === 'admin' ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    className="w-full py-2 rounded-[6px] bg-red-950 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-red-800"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                    <span>Admin Ops Command</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('customer');
                    }}
                    className="w-full py-2 rounded-[6px] bg-zinc-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700"
                  >
                    <User className="w-3.5 h-3.5 text-red-500" />
                    <span>VIP Customer Portal</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogoutClick();
                  }}
                  className="w-full py-2 rounded-[6px] bg-white/5 text-zinc-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('login');
                }}
                className="w-full py-2 rounded-[6px] bg-white/5 text-zinc-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
              >
                <span>Sign In to Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
