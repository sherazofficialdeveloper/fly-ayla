import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Shield,
  ArrowRight
} from 'lucide-react';
import { ContactCmsContent } from '../../types/cms';

interface ContactSectionProps {
  content: ContactCmsContent;
  onRequestFlight?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ content, onRequestFlight }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    inquiryType: 'Charter Flight Request',
    message: ''
  });

  const tag = content?.tag ?? 'GLOBAL CONTACT';
  const title = content?.title ?? '24/7 Global Flight Operations Desks';
  const description = content?.description ?? 'Contact our dispatch operations directly in Kuwait or London, or submit an urgent flight inquiry below.';
  const hqCity = content?.hqCity ?? 'Kuwait City, State of Kuwait';
  const hqAddress = content?.hqAddress ?? 'Kuwait International Airport (KWI / OKKK), VIP Terminal Gate 4';
  const hqPhone = content?.hqPhone ?? '+965 2200 4800';
  const opsCity = content?.opsCity ?? 'London Operations Desk, United Kingdom';
  const opsAddress = content?.opsAddress ?? 'London Luton Airport (LTN / EGGW), Signature Flight Support FBO';
  const opsPhone = content?.opsPhone ?? '+44 20 7946 0880';
  const generalEmail = content?.generalEmail ?? 'ops@flyayla.com';
  const charterEmail = content?.charterEmail ?? 'charter@flyayla.com';
  const whatsappSupport = content?.whatsappSupport ?? '+965 9988 1234';
  const officeHours = content?.officeHours ?? '24 Hours / 7 Days a Week / 365 Days a Year';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <section id="section-contact" className="py-24 bg-[#09090B] text-white border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 mb-16 text-left">
          <span className="text-red-500 font-semibold tracking-[0.2em] text-xs uppercase">
            {tag}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Office Details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-red-500 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>{hqCity}</span>
              </div>
              <p className="text-sm text-zinc-300 font-normal">
                {hqAddress}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>{hqPhone}</span>
              </div>
            </div>

            {/* Operations Desk Card */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-red-500 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>{opsCity}</span>
              </div>
              <p className="text-sm text-zinc-300 font-normal">
                {opsAddress}
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span>{opsPhone}</span>
              </div>
            </div>

            {/* Direct Email & WhatsApp */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500 font-normal">Flight Operations:</span>
                <span className="text-red-400 font-semibold">{generalEmail}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500 font-normal">Charter Concierge:</span>
                <span className="text-white font-semibold">{charterEmail}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300">
                <span className="text-zinc-500 font-normal">WhatsApp Dispatch:</span>
                <span className="text-emerald-400 font-semibold">{whatsappSupport}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-300 pt-2 border-t border-white/5">
                <span className="text-zinc-500 font-normal">Operating Hours:</span>
                <span className="text-zinc-300 font-medium">{officeHours}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Dispatch Ingestion Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl relative">
              {formSubmitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Direct Dispatch Inquiry Dispatched</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto font-normal">
                    Thank you, {formData.fullName || 'Valued Client'}. Our flight dispatch coordinator will contact your team in under 15 minutes.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    Send Another Dispatch Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-base font-semibold text-white">Direct Flight Desk Transmission</h3>
                    <span className="text-[11px] font-medium text-red-500">ENCRYPTED // PART 135 READY</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Capt. Alexander Vance"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-red-500 transition-colors font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Corporate / Fleet Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="a.vance@executiveaviation.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-red-500 transition-colors font-normal"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2831"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-red-500 transition-colors font-normal"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1 font-medium">Inquiry Type</label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-red-500 transition-colors font-normal"
                      >
                        <option>Charter Flight Request</option>
                        <option>Operator Platform Demo</option>
                        <option>Fleet Cost Intelligence Integration</option>
                        <option>Aircraft Management Advisory</option>
                        <option>Aero-Medical Transport</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-400 mb-1 font-medium">Message / Mission Requirements</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please specify aircraft preference, passenger manifest count, departure airport (ICAO/IATA), and target departure window..."
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-red-500 transition-colors font-normal"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-sm font-semibold uppercase tracking-wide shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer leading-tight"
                  >
                    <span>Transmit Flight Request to Dispatch Desk</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
