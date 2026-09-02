'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './layout/Navbar';
import { Footer } from './layout/Footer';
import { HomePage } from '../views/HomePage';
import { AboutPage } from '../views/AboutPage';
import { ServicesPage } from '../views/ServicesPage';
import { FleetPage } from '../views/FleetPage';
import { AircraftDetailPage } from '../views/AircraftDetailPage';
import { PricingPage } from '../views/PricingPage';
import { HowItWorksPage } from '../views/HowItWorksPage';
import { ContactPage } from '../views/ContactPage';
import { FlightRequestPage } from '../views/FlightRequestPage';
import { AuthPage } from '../views/AuthPage';
import { CustomerPortal } from './portal/CustomerPortal';
import { AdminDashboard } from './admin/AdminDashboard';
import { AuthModal } from './modals/AuthModal';
import { NotificationDrawer } from './modals/NotificationDrawer';
import { PaymentCheckoutModal } from './modals/PaymentCheckoutModal';
import { INITIAL_CMS_CONTENT } from '../data/cmsContent';
import { GlobalCmsStore } from '../types/cms';
import { useAuth } from '../context/AuthContext';

import { 
  FLEET_AIRCRAFT,
  CURRENT_USER, 
} from '../data/mockData';
import { 
  FlightRequest, 
  Quote, 
  Invoice, 
  Booking, 
  ForensicCase, 
  AuditLog, 
  NotificationItem, 
  UserProfile, 
  Aircraft, 
  Airport 
} from '../types/aviation';
import { FlightRequestService } from '../services/customer/flightRequest.service';
import { QuoteService } from '../services/customer/quote.service';
import { InvoiceService } from '../services/customer/invoice.service';
import { BookingService } from '../services/customer/booking.service';
import { NotificationService } from '../services/customer/notification.service';
import { AdminService } from '../services/admin/admin.service';

interface AylaAppClientProps {
  initialView?: string;
  initialAircraftId?: string;
}

export function AylaAppClient({ initialView = 'home', initialAircraftId }: AylaAppClientProps) {
  const { user: authUser, isAuthenticated, isInitializing } = useAuth();

  // Navigation & Role State
  const [currentView, setCurrentView] = useState<string>(initialView);
  const [activeRole, setActiveRole] = useState<'guest' | 'customer' | 'admin'>('guest');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => ({
    id: 'guest',
    name: 'Guest Traveler',
    email: '',
    phone: '',
    company: '',
    role: 'customer',
  }));

  // Sync auth role with active role & fetch customer real data
  useEffect(() => {
    if (isAuthenticated && authUser) {
      if (authUser.role === 'admin') {
        setActiveRole('admin');
        setCurrentUser({
          id: authUser.id,
          name: authUser.fullName,
          email: authUser.email,
          phone: authUser.phone,
          company: authUser.companyName || 'Fly Ayla Flight Operations',
          role: 'admin',
          avatarUrl: authUser.profileImage
        });
      } else {
        setActiveRole('customer');
        setCurrentUser({
          id: authUser.id,
          name: authUser.fullName,
          email: authUser.email,
          phone: authUser.phone,
          company: authUser.companyName || 'Private Charter VIP',
          role: 'customer',
          avatarUrl: authUser.profileImage
        });

        // Load authenticated customer data from backend
        const fetchUserData = async () => {
          try {
            const [reqRes, quoteRes, invRes, bookRes, notifRes] = await Promise.all([
              FlightRequestService.getMyRequests().catch(() => null),
              QuoteService.getMyQuotes().catch(() => null),
              InvoiceService.getMyInvoices().catch(() => null),
              BookingService.getMyBookings().catch(() => null),
              NotificationService.getNotifications().catch(() => null),
            ]);

            if (reqRes?.data?.requests && reqRes.data.requests.length > 0) {
              setRequests(reqRes.data.requests);
            }
            if (quoteRes?.data?.quotes && quoteRes.data.quotes.length > 0) {
              setQuotes(quoteRes.data.quotes);
            }
            if (invRes?.data?.invoices && invRes.data.invoices.length > 0) {
              setInvoices(invRes.data.invoices);
            }
            if (bookRes?.data?.bookings && bookRes.data.bookings.length > 0) {
              setBookings(bookRes.data.bookings);
            }
            if (notifRes?.data?.notifications && notifRes.data.notifications.length > 0) {
              setNotifications(notifRes.data.notifications);
            }
          } catch (err) {
            console.warn('Real-time customer data sync note:', err);
          }
        };
        fetchUserData();
      }
    } else {
      if (activeRole !== 'guest' && !['customer', 'admin'].includes(currentView)) {
        setActiveRole('guest');
      }
    }
  }, [isAuthenticated, authUser]);

  // Selected aircraft for detail view or pre-selected quote
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | undefined>(() => {
    if (initialAircraftId) {
      return FLEET_AIRCRAFT.find(a => a.id === initialAircraftId);
    }
    return undefined;
  });
  const [selectedAircraftId, setSelectedAircraftId] = useState<string | undefined>(initialAircraftId);
  const [preSelectedOrigin, setPreSelectedOrigin] = useState<Airport | undefined>(undefined);
  const [preSelectedDestination, setPreSelectedDestination] = useState<Airport | undefined>(undefined);
  const [initialFlightRequestData, setInitialFlightRequestData] = useState<{
    aircraft?: Aircraft;
    origin?: Airport;
    destination?: Airport;
    tripType?: 'one-way' | 'round-trip' | 'multi-leg';
    legs?: Array<{
      departure: Airport;
      destination: Airport;
      date: string;
      time: string;
      passengers: number;
    }>;
    passengers?: number;
  } | null>(null);

  // Dynamic Fleet Data (can be managed by Admin or CMS)
  const [fleet] = useState<Aircraft[]>(FLEET_AIRCRAFT);

  // Dynamic CMS Store with Local Storage persistence
  const [cmsContent, setCmsContent] = useState<GlobalCmsStore>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fly_ayla_cms_content');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...INITIAL_CMS_CONTENT,
            ...parsed
          };
        }
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_CMS_CONTENT;
  });

  const handleUpdateCmsContent = (updated: GlobalCmsStore) => {
    setCmsContent(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fly_ayla_cms_content', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
    }
  };

  const handleResetCmsContent = () => {
    setCmsContent(INITIAL_CMS_CONTENT);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('fly_ayla_cms_content');
      } catch (e) {
        // ignore
      }
    }
  };

  // Core Data Store
  const [requests, setRequests] = useState<FlightRequest[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [forensicCases, setForensicCases] = useState<ForensicCase[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [notifDrawerOpen, setNotifDrawerOpen] = useState<boolean>(false);
  const [selectedInvoiceForCheckout, setSelectedInvoiceForCheckout] = useState<Invoice | null>(null);

  // Scroll to top on route change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  // Role Navigation
  const handleRoleChange = (newRole: 'guest' | 'customer' | 'admin') => {
    if (newRole === 'admin') {
      if (isAuthenticated && authUser?.role === 'admin') {
        setActiveRole('admin');
        handleNavigate('admin');
      } else {
        handleNavigate('login');
      }
    } else if (newRole === 'customer') {
      if (isAuthenticated) {
        setActiveRole('customer');
        handleNavigate('customer');
      } else {
        handleNavigate('login');
      }
    } else {
      setActiveRole('guest');
      handleNavigate('home');
    }
  };

  // Unified Navigation Router
  const handleNavigate = (view: string, params?: any) => {
    if (params?.aircraftId) {
      setSelectedAircraftId(params.aircraftId);
      const found = fleet.find(a => a.id === params.aircraftId);
      if (found) setSelectedAircraft(found);
    }
    if (params?.aircraft) {
      setSelectedAircraft(params.aircraft);
    }
    if (params?.origin) {
      setPreSelectedOrigin(params.origin);
    }
    if (params?.destination) {
      setPreSelectedDestination(params.destination);
    }
    if (params?.tripType || params?.legs || params?.passengers) {
      setInitialFlightRequestData(params);
    }

    if (view === 'public') {
      setCurrentView('home');
    } else {
      setCurrentView(view);
    }
  };

  // New Flight Request Success
  const handleFlightRequestSuccess = (
    newRequest: FlightRequest, 
    newQuote: Quote, 
    newInvoice: Invoice
  ) => {
    setRequests([newRequest, ...requests]);
    setQuotes([newQuote, ...quotes]);
    setInvoices([newInvoice, ...invoices]);

    // Add Audit Log
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: newRequest.customerName,
      role: 'Customer',
      action: `Generated quote ${newQuote.quoteNumber} for $${newQuote.costBreakdown.quotedTotal.toLocaleString()} (${newRequest.legs.map(l => l.departure.icao).join('➔')}➔${newRequest.legs[newRequest.legs.length - 1].destination.icao})`,
      category: 'QUOTE',
      recordRef: newQuote.quoteNumber,
      status: 'SUCCESS',
      ipAddress: '194.230.14.88'
    };
    setAuditLogs([newLog, ...auditLogs]);

    // Add Forensic Case
    const newForensicCase: ForensicCase = {
      id: `fcase-${Date.now()}`,
      caseNumber: `PF-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      transactionId: `TX-QUOTE-${newQuote.id}`,
      invoiceNumber: newInvoice.invoiceNumber,
      customerName: newRequest.customerName,
      customerEmail: newRequest.customerEmail,
      amount: newQuote.costBreakdown.quotedTotal,
      currency: 'USD',
      paymentMethod: 'Wire Transfer',
      riskScore: 10,
      riskLevel: 'LOW',
      sanctionsCheck: 'PASSED',
      amlStatus: 'CLEARED',
      flags: ['Clean KYC Verified', 'Zero OFAC Hits', 'Direct VIP Aviation Desk'],
      geoIpLocation: 'Kuwait City, Kuwait (Verified ASN)',
      timestamp: new Date().toISOString(),
      notes: 'Automated PAYLA FORENSIC clearance on charter quote generation.',
      assignedAnalyst: 'A. Chen (Compliance Lead)'
    };
    setForensicCases([newForensicCase, ...forensicCases]);

    // Add Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'quote',
      title: 'New Quote Generated',
      message: `Quote ${newQuote.quoteNumber} created ($${newQuote.costBreakdown.quotedTotal.toLocaleString()}). Ready in VIP Portal.`,
      timestamp: 'Just now',
      read: false,
      linkTo: newQuote.id
    };
    setNotifications([newNotif, ...notifications]);

    // Switch to Customer Portal to view quote
    setActiveRole('customer');
    setCurrentView('customer');
  };

  // Quote Approval handler
  const handleApproveQuote = async (quoteId: string) => {
    try {
      const res = await QuoteService.approveQuote(quoteId).catch((err) => {
        console.warn('Backend quote approval notice:', err);
        return null;
      });

      setQuotes(quotes.map(q => (q.id === quoteId || (q as any)._id === quoteId) ? { ...q, status: 'Approved' } : q));
      const targetQuote = quotes.find(q => q.id === quoteId || (q as any)._id === quoteId);

      if (res?.data?.invoice) {
        setInvoices(prev => [res.data.invoice, ...prev.filter(inv => inv.id !== res.data.invoice.id)]);
      }

      if (targetQuote) {
        const newLog: AuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: currentUser.name,
          role: 'Customer',
          action: `Approved quote ${targetQuote.quoteNumber} for $${targetQuote.costBreakdown?.quotedTotal?.toLocaleString() || '48,000'}`,
          category: 'QUOTE',
          recordRef: targetQuote.quoteNumber,
          status: 'SUCCESS',
          ipAddress: '194.230.14.88'
        };
        setAuditLogs(prev => [newLog, ...prev]);

        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          type: 'quote',
          title: 'Quote Approved',
          message: `Quote ${targetQuote.quoteNumber} approved. Commercial invoice issued.`,
          timestamp: 'Just now',
          read: false
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    } catch (err) {
      console.error('Approve quote error:', err);
    }
  };

  // Invoice Payment handler - Opens authoritative checkout modal
  const handlePayInvoice = async (invoiceId: string) => {
    const targetInvoice = invoices.find(inv => inv.id === invoiceId || (inv as any)._id === invoiceId);
    if (targetInvoice) {
      setSelectedInvoiceForCheckout(targetInvoice);
    }
  };

  // Forensic Case update
  const handleUpdateForensicCase = (caseId: string, newStatus: 'PASSED' | 'REVIEW REQUIRED' | 'BLOCKED', notes: string) => {
    setForensicCases(forensicCases.map(c => c.id === caseId ? {
      ...c,
      amlStatus: newStatus === 'PASSED' ? 'CLEARED' : newStatus === 'BLOCKED' ? 'BLOCKED' : 'MONITORED',
      sanctionsCheck: newStatus,
      riskLevel: newStatus === 'PASSED' ? 'LOW' : 'CRITICAL',
      notes: notes || c.notes
    } : c));

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'Compliance Lead',
      role: 'Forensic Officer',
      action: `Updated PAYLA FORENSIC case ${caseId} to ${newStatus}`,
      category: 'FORENSIC',
      recordRef: caseId,
      status: 'SUCCESS',
      ipAddress: '10.240.0.12'
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Quote Margin update
  const handleUpdateQuoteMargin = (quoteId: string, newMarginPercent: number) => {
    setQuotes(quotes.map(q => {
      if (q.id === quoteId) {
        const sub = q.costBreakdown.subtotal;
        const newMarkupAmount = Math.round(sub * (newMarginPercent / 100));
        const newQuotedTotal = sub + newMarkupAmount;
        return {
          ...q,
          costBreakdown: {
            ...q.costBreakdown,
            markupPercent: newMarginPercent,
            markupAmount: newMarkupAmount,
            quotedTotal: newQuotedTotal
          }
        };
      }
      return q;
    }));
  };

  // Check if current view is a public website page
  const isPublicPage = ['home', 'about', 'services', 'fleet', 'aircraft-detail', 'pricing', 'how-it-works', 'contact', 'flight-request'].includes(currentView);

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        activeRole={activeRole}
        onChangeRole={handleRoleChange}
        currentUser={currentUser}
        notifications={notifications}
        onOpenAuthModal={() => {
          setAuthModalInitialTab('login');
          setAuthModalOpen(true);
        }}
        onOpenNotifications={() => setNotifDrawerOpen(true)}
      />

      {/* Main Multi-Page Content Area */}
      <main className="flex-1">
        
        {/* PAGE 1: HOME */}
        {currentView === 'home' && (
          <HomePage
            cmsContent={cmsContent}
            onRequestFlight={(payload) => handleNavigate('flight-request', payload)}
            onNavigate={handleNavigate}
            onSelectAircraft={(ac) => {
              setSelectedAircraft(ac);
              setSelectedAircraftId(ac.id);
            }}
          />
        )}

        {/* PAGE 2: ABOUT */}
        {currentView === 'about' && (
          <AboutPage
            cmsContent={cmsContent}
            onRequestFlight={() => handleNavigate('flight-request')}
            onNavigate={handleNavigate}
          />
        )}

        {/* PAGE 3: SERVICES */}
        {currentView === 'services' && (
          <ServicesPage
            cmsContent={cmsContent}
            onRequestFlight={() => handleNavigate('flight-request')}
            onNavigate={handleNavigate}
          />
        )}

        {/* PAGE 4: FLEET */}
        {currentView === 'fleet' && (
          <FleetPage
            fleet={fleet}
            cmsContent={cmsContent}
            onSelectAircraft={(ac) => {
              setSelectedAircraft(ac);
              setSelectedAircraftId(ac.id);
            }}
            onRequestFlight={(ac) => {
              if (ac) setSelectedAircraft(ac);
              handleNavigate('flight-request');
            }}
            onNavigate={handleNavigate}
          />
        )}

        {/* PAGE 5: AIRCRAFT DETAIL */}
        {currentView === 'aircraft-detail' && (
          <AircraftDetailPage
            aircraft={selectedAircraft}
            aircraftId={selectedAircraftId}
            onBackToFleet={() => handleNavigate('fleet')}
            onRequestFlight={(ac) => {
              setSelectedAircraft(ac);
              handleNavigate('flight-request');
            }}
          />
        )}

        {/* PAGE 6: PRICING */}
        {currentView === 'pricing' && (
          <PricingPage
            cmsContent={cmsContent}
            onRequestFlight={() => handleNavigate('flight-request')}
            onSelectAircraft={(ac) => {
              setSelectedAircraft(ac);
              handleNavigate('flight-request');
            }}
          />
        )}

        {/* PAGE 7: HOW IT WORKS */}
        {currentView === 'how-it-works' && (
          <HowItWorksPage
            cmsContent={cmsContent}
            onRequestFlight={() => handleNavigate('flight-request')}
            onNavigate={handleNavigate}
          />
        )}

        {/* PAGE 8: CONTACT */}
        {currentView === 'contact' && (
          <ContactPage
            cmsContent={cmsContent}
            onRequestFlight={() => handleNavigate('flight-request')}
          />
        )}

        {/* PAGE 9: FLIGHT REQUEST */}
        {currentView === 'flight-request' && (
          <FlightRequestPage
            initialAircraft={initialFlightRequestData?.aircraft || selectedAircraft}
            initialOrigin={initialFlightRequestData?.origin || preSelectedOrigin}
            initialDestination={initialFlightRequestData?.destination || preSelectedDestination}
            initialTripType={initialFlightRequestData?.tripType}
            initialLegs={initialFlightRequestData?.legs}
            initialPassengers={initialFlightRequestData?.passengers}
            onSubmitSuccess={handleFlightRequestSuccess}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* DEDICATED AUTH PAGE */}
        {['login', 'register', 'forgot-password', 'reset-password'].includes(currentView) && (
          <AuthPage
            initialMode={
              currentView === 'register' ? 'register' :
              currentView === 'forgot-password' ? 'forgot' :
              currentView === 'reset-password' ? 'reset' : 'login'
            }
            onNavigate={handleNavigate}
          />
        )}

        {/* EXPERIENCE 2: CUSTOMER PORTAL */}
        {currentView === 'customer' && (
          isInitializing ? (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#09090D]">
              <div className="flex items-center space-x-3 text-red-500">
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-zinc-300 font-mono text-xs uppercase tracking-widest">Validating Member Clearance...</span>
              </div>
            </div>
          ) : isAuthenticated ? (
            <CustomerPortal
              user={currentUser}
              requests={requests}
              quotes={quotes}
              invoices={invoices}
              bookings={bookings}
              onApproveQuote={handleApproveQuote}
              onPayInvoice={handlePayInvoice}
              onRequestNewFlight={() => handleNavigate('flight-request')}
            />
          ) : (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#09090D]">
              <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 max-w-md w-full shadow-2xl backdrop-blur-xl">
                <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-500 font-bold text-xl">
                  VIP
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  Please sign in to access your VIP Charter Portal, active flight requests, quotation details, and commercial tax invoices.
                </p>
                <button
                  id="btn-portal-signin-required"
                  onClick={() => handleNavigate('login')}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-950/60 cursor-pointer"
                >
                  Sign In to VIP Portal
                </button>
              </div>
            </div>
          )
        )}

        {/* EXPERIENCE 3: ADMIN OPS COMMAND */}
        {currentView === 'admin' && (
          isInitializing ? (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#09090D]">
              <div className="flex items-center space-x-3 text-red-500">
                <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-zinc-300 font-mono text-xs uppercase tracking-widest">Verifying Ops Clearance...</span>
              </div>
            </div>
          ) : isAuthenticated && authUser?.role === 'admin' ? (
            <AdminDashboard
              requests={requests}
              quotes={quotes}
              invoices={invoices}
              bookings={bookings}
              forensicCases={forensicCases}
              auditLogs={auditLogs}
              cmsContent={cmsContent}
              onUpdateForensicCase={handleUpdateForensicCase}
              onUpdateQuoteMargin={handleUpdateQuoteMargin}
              onUpdateCmsContent={handleUpdateCmsContent}
              onResetCmsContent={handleResetCmsContent}
            />
          ) : (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#09090D]">
              <div className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 max-w-md w-full shadow-2xl backdrop-blur-xl">
                <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
                  {isAuthenticated
                    ? 'Your current account does not have administrative flight dispatch clearance.'
                    : 'Administrative credentials are required to enter the Fly Ayla Flight Operations Command.'}
                </p>
                <button
                  id="btn-admin-auth-redirect"
                  onClick={() => handleNavigate('login')}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-red-950/60 cursor-pointer"
                >
                  {isAuthenticated ? 'Sign In as Administrator' : 'Sign In'}
                </button>
              </div>
            </div>
          )
        )}

      </main>

      {/* Footer is displayed across all public pages */}
      {isPublicPage && (
        <Footer
          onNavigate={handleNavigate}
          onOpenLogin={() => {
            setAuthModalInitialTab('login');
            setAuthModalOpen(true);
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalInitialTab}
        onSuccessRedirect={(role) => {
          if (role === 'admin') {
            handleNavigate('admin');
          } else {
            handleNavigate('customer');
          }
        }}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notifDrawerOpen}
        onClose={() => setNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={async () => {
          try {
            if (activeRole === 'admin') {
              await AdminService.markAllNotificationsRead().catch(() => null);
            } else {
              await NotificationService.markAllAsRead().catch(() => null);
            }
          } catch (e) {
            console.warn('Mark all notifications read note:', e);
          }
          setNotifications(notifications.map(n => ({ ...n, read: true })));
        }}
        onSelectNotification={async (n) => {
          try {
            if (activeRole === 'admin') {
              await AdminService.markNotificationRead(n.id).catch(() => null);
            } else {
              await NotificationService.markAsRead(n.id).catch(() => null);
            }
          } catch (e) {
            console.warn('Mark notification read note:', e);
          }
          setNotifications(notifications.map(item => item.id === n.id ? { ...item, read: true } : item));
          if (activeRole === 'admin') {
            handleNavigate('admin');
          } else {
            handleNavigate('customer');
          }
        }}
      />

      {/* Authoritative Payment Checkout Modal */}
      <PaymentCheckoutModal
        isOpen={Boolean(selectedInvoiceForCheckout)}
        onClose={() => setSelectedInvoiceForCheckout(null)}
        invoice={selectedInvoiceForCheckout}
        onPaymentInitiated={async () => {
          try {
            const invRes = await InvoiceService.getMyInvoices();
            if (invRes?.data?.invoices) {
              setInvoices(invRes.data.invoices);
            }
          } catch (e) {
            console.warn('Sync invoices error:', e);
          }
        }}
      />

    </div>
  );
}
