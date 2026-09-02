import React from 'react';
import { FlyAylaLogo } from '../common/FlyAylaLogo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight, 
  Lock,
  Globe
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLogin }) => {
  return (
    <footer className="bg-[#050507] border-t border-white/10 text-zinc-300 text-sm font-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <button onClick={() => onNavigate('home')} className="cursor-pointer focus:outline-none">
              <FlyAylaLogo size="lg" />
            </button>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              The operational cost intelligence platform and luxury private charter network. Transforming complex flight economics into client-ready quotes in seconds.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-zinc-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-red-500 shrink-0" />
              <span>ARG/US Platinum &bull; Wyvern Wingman &bull; IS-BAO Stage 3</span>
            </div>
          </div>

          {/* Column 1: Navigation */}
          <div className="space-y-3 text-left">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Explore
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Fly Ayla
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('fleet')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Charter Fleet
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Smart Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Portals & Actions */}
          <div className="space-y-3 text-left">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Portals &amp; Actions
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('flight-request')}
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Request a Flight</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('customer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  VIP Customer Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin Ops Command
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLogin}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Client Sign In
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Operations
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: 24/7 Global Ops Desk */}
          <div className="space-y-3 text-left">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              24/7 Flight Operations
            </div>
            <div className="space-y-2.5 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-white font-medium">+1 (800) 892-AYLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-white font-medium">+44 20 7946 0912</span> (London)
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-white font-normal">ops@flyayla.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-zinc-400 font-normal">Executive Terminal &bull; Mayfair / Geneva / Dubai</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright and legal */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} FLY AYLA &bull; Private Aviation Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Charter Terms &amp; Conditions</button>
            <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Tariff Transparency</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
