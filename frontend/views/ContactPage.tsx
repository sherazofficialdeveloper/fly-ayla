'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  MessageSquare,
  Globe
} from 'lucide-react';
import { GlobalCmsStore } from '../types/cms';

interface ContactPageProps {
  cmsContent: GlobalCmsStore;
  onRequestFlight: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  cmsContent,
  onRequestFlight
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Charter Flight Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Charter Flight Inquiry',
        message: ''
      });
    }, 4000);
  };

  const hubs = [
    {
      city: 'London Mayfair',
      address: '25 Berkeley Square, London W1J 6HN, United Kingdom',
      phone: '+44 20 7946 0912',
      email: 'london.ops@flyayla.com',
      fbo: 'London Luton (EGGW) & Farnborough (EGLF)'
    },
    {
      city: 'Geneva Cointrin',
      address: 'Chemin des Papillons 18, 1215 Geneva, Switzerland',
      phone: '+41 22 717 7100',
      email: 'geneva.ops@flyayla.com',
      fbo: 'Geneva International VIP Terminal (LSGG)'
    },
    {
      city: 'Dubai DIFC',
      address: 'Gate Precinct 4, Level 5, DIFC, Dubai, UAE',
      phone: '+971 4 362 7000',
      email: 'dubai.ops@flyayla.com',
      fbo: 'Dubai Al Maktoum Jet Aviation (OMDW)'
    },
    {
      city: 'New York Teterboro',
      address: '485 Industrial Ave, Teterboro, NJ 07608, USA',
      phone: '+1 201 288 1775',
      email: 'newyork.ops@flyayla.com',
      fbo: 'Teterboro Signature Flight Support (KTEB)'
    }
  ];

  return (
    <div className="w-full flex flex-col bg-[#08080A] text-white">
      {/* 1. HERO */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80" 
            alt="Contact Operations" 
            className="w-full h-full object-cover filter grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/80 to-[#08080A]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600"></span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500 font-mono">
              FLIGHT OPERATIONS 24/7
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase leading-tight max-w-4xl">
            ALWAYS ON CALL FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">YOUR NEXT JOURNEY.</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
            Our global dispatch centers in London, Geneva, Dubai, and New York operate 24 hours a day, 365 days a year to coordinate immediate flight requests, slots, and bespoke passenger requirements.
          </p>
        </div>
      </section>

      {/* 2. CONTACT HUBS & FORM */}
      <section className="py-20 bg-white text-zinc-900 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: 4 Global Flight Operations Centers */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 font-mono">
                  GLOBAL DISPATCH NETWORK
                </span>
                <h2 className="text-3xl font-black text-zinc-950 uppercase mt-1">
                  FLIGHT OPERATIONS DESKS
                </h2>
                <p className="text-sm text-zinc-600 mt-2">
                  Contact our regional operations managers directly for rapid charter dispatch, slot approvals, or corporate flight programs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {hubs.map((hub) => (
                  <div key={hub.city} className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 red-accent-card">
                    <h3 className="text-base font-bold text-zinc-950">{hub.city}</h3>
                    <div className="text-xs sm:text-sm text-zinc-600 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{hub.address}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-900 font-mono font-semibold flex items-center gap-1.5 pt-1">
                      <Phone className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{hub.phone}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-600 font-mono flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{hub.email}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Hotline Banner */}
              <div className="p-5 rounded-2xl bg-zinc-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">Emergency Urgent Dispatch (24/7)</div>
                  <div className="text-xl sm:text-2xl font-black font-mono mt-0.5">+1 (800) 892-AYLA</div>
                </div>
                <button
                  onClick={onRequestFlight}
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap shadow-lg shadow-red-950/40"
                >
                  Instant Flight Request
                </button>
              </div>
            </div>

            {/* Right: Message / Inquiry Form */}
            <div className="lg:col-span-6 bg-zinc-50 border border-zinc-200 rounded-3xl p-8 text-left space-y-6 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-600 font-mono">
                  DIRECT MESSAGE
                </span>
                <h2 className="text-2xl font-black text-zinc-950 uppercase mt-1">
                  SEND AN INQUIRY
                </h2>
                <p className="text-sm text-zinc-600 mt-1">
                  Have a specific itinerary question or corporate fleet requirement? We respond within 15 minutes.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-950">Inquiry Received</h3>
                  <p className="text-sm text-emerald-800">
                    Thank you. Our 24/7 flight operations desk has received your message and will contact you immediately.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Lord John Smith"
                        className="w-full p-3.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                        Corporate / Personal Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john.smith@familyoffice.com"
                        className="w-full p-3.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+44 20 7946 0912"
                        className="w-full p-3.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full p-3.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-red-600"
                      >
                        <option value="Charter Flight Inquiry">Charter Flight Inquiry</option>
                        <option value="Corporate Account Management">Corporate Account Management</option>
                        <option value="Medical Air Ambulance">Medical Air Ambulance</option>
                        <option value="FBO & Handling Partner Inquiry">FBO &amp; Handling Partner Inquiry</option>
                        <option value="Other Assistance">Other Assistance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-1.5">
                      Message / Itinerary Notes
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please include details such as departure airport, destination, dates, passengers, and special requests..."
                      className="w-full p-3.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-900 focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-zinc-950 hover:bg-red-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-zinc-950/20"
                  >
                    <span>Send Message to Flight Operations</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
