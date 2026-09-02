import React, { useState, useEffect } from 'react';
import { 
  AdminSidebar, 
  AdminTab 
} from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminService } from '../../services/admin/admin.service';

// Specialized Views
import { DashboardHomeView } from './views/DashboardHomeView';
import { CustomersView } from './views/CustomersView';
import { FlightRequestsView } from './views/FlightRequestsView';
import { QuotesView } from './views/QuotesView';
import { BookingsView } from './views/BookingsView';
import { InvoicesView } from './views/InvoicesView';
import { PaymentsView } from './views/PaymentsView';
import { AircraftView } from './views/AircraftView';
import { AirportsView } from './views/AirportsView';
import { PricingView } from './views/PricingView';
import { ForensicView } from './views/ForensicView';
import { NotificationsView } from './views/NotificationsView';
import { ReportsView } from './views/ReportsView';
import { AuditLogsView } from './views/AuditLogsView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';
import { CmsContentManager } from './CmsContentManager';

// Specialized Modals
import { ConfirmModal } from './modals/ConfirmModal';
import { PdfQuoteModal } from './modals/PdfQuoteModal';
import { CustomerDetailModal } from './modals/CustomerDetailModal';
import { AircraftModal } from './modals/AircraftModal';
import { AirportModal } from './modals/AirportModal';

// Types
import { 
  FlightRequest, 
  Quote, 
  Invoice, 
  Booking, 
  ForensicCase, 
  AuditLog, 
  Aircraft, 
  Airport 
} from '../../types/aviation';
import { GlobalCmsStore } from '../../types/cms';
import { FLEET_AIRCRAFT, GLOBAL_AIRPORTS } from '../../data/mockData';

interface AdminDashboardProps {
  requests?: FlightRequest[];
  quotes?: Quote[];
  invoices?: Invoice[];
  bookings?: Booking[];
  forensicCases?: ForensicCase[];
  auditLogs?: AuditLog[];
  cmsContent?: GlobalCmsStore;
  onUpdateForensicCase?: (caseId: string, status: 'PASSED' | 'REVIEW REQUIRED' | 'BLOCKED', notes: string) => void;
  onUpdateQuoteMargin?: (quoteId: string, newMarginPercent: number) => void;
  onUpdateCmsContent?: (updatedContent: GlobalCmsStore) => void;
  onResetCmsContent?: () => void;
  onLogout?: () => void;
  onExitAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  requests: initialRequests = [],
  quotes: initialQuotes = [],
  invoices: initialInvoices = [],
  bookings: initialBookings = [],
  forensicCases: initialForensicCases = [],
  auditLogs: initialAuditLogs = [],
  cmsContent,
  onUpdateForensicCase,
  onUpdateQuoteMargin,
  onUpdateCmsContent,
  onResetCmsContent,
  onLogout,
  onExitAdmin,
}) => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Notifications drawer/menu
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Core Data States
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  
  // Customers State
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersTotal, setCustomersTotal] = useState<number>(0);
  const [customersPage, setCustomersPage] = useState<number>(1);
  const [customersSearch, setCustomersSearch] = useState<string>('');
  const [customersStatus, setCustomersStatus] = useState<string>('');

  // Flight Requests State
  const [requests, setRequests] = useState<any[]>(initialRequests);
  const [requestsTotal, setRequestsTotal] = useState<number>(initialRequests.length);
  const [requestsPage, setRequestsPage] = useState<number>(1);
  const [requestsSearch, setRequestsSearch] = useState<string>('');
  const [requestsStatus, setRequestsStatus] = useState<string>('');

  // Quotes State
  const [quotes, setQuotes] = useState<any[]>(initialQuotes);
  const [quotesTotal, setQuotesTotal] = useState<number>(initialQuotes.length);
  const [quotesPage, setQuotesPage] = useState<number>(1);
  const [quotesSearch, setQuotesSearch] = useState<string>('');
  const [quotesStatus, setQuotesStatus] = useState<string>('');

  // Bookings State
  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [bookingsTotal, setBookingsTotal] = useState<number>(initialBookings.length);
  const [bookingsPage, setBookingsPage] = useState<number>(1);
  const [bookingsSearch, setBookingsSearch] = useState<string>('');
  const [bookingsStatus, setBookingsStatus] = useState<string>('');

  // Invoices & Payments State
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);
  const [invoicesTotal, setInvoicesTotal] = useState<number>(initialInvoices.length);
  const [invoicesPage, setInvoicesPage] = useState<number>(1);
  const [invoicesSearch, setInvoicesSearch] = useState<string>('');
  const [invoicesStatus, setInvoicesStatus] = useState<string>('');

  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsTotal, setPaymentsTotal] = useState<number>(0);
  const [paymentsPage, setPaymentsPage] = useState<number>(1);
  const [paymentsSearch, setPaymentsSearch] = useState<string>('');
  const [paymentsStatus, setPaymentsStatus] = useState<string>('');

  // Fleet & Airports State
  const [aircraftList, setAircraftList] = useState<any[]>(FLEET_AIRCRAFT);
  const [airportsList, setAirportsList] = useState<any[]>(GLOBAL_AIRPORTS);
  const [airportsSearch, setAirportsSearch] = useState<string>('');

  // Pricing, Forensic, Reports, Audit, Settings, Profile
  const [pricingRules, setPricingRules] = useState<any>(null);
  const [forensicCases, setForensicCases] = useState<any[]>(initialForensicCases);
  const [reportsData, setReportsData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>(initialAuditLogs);
  const [settingsData, setSettingsData] = useState<any>(null);
  const [adminProfile, setAdminProfile] = useState<any>({
    fullName: 'Chief Dispatch Officer',
    email: 'admin@flyayla.com',
    role: 'SUPER_ADMIN',
  });

  // Modal States
  const [selectedCustomerForModal, setSelectedCustomerForModal] = useState<string | null>(null);
  const [selectedQuoteForPdf, setSelectedQuoteForPdf] = useState<any | null>(null);
  const [isAircraftModalOpen, setIsAircraftModalOpen] = useState(false);
  const [selectedAircraftForEdit, setSelectedAircraftForEdit] = useState<any | null>(null);
  const [isAirportModalOpen, setIsAirportModalOpen] = useState(false);
  const [selectedAirportForEdit, setSelectedAirportForEdit] = useState<any | null>(null);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });

  // Load Dashboard & Global Data
  const loadDashboardData = async () => {
    try {
      const res = await AdminService.getDashboardMetrics();
      if (res.success && res.data) {
        setDashboardMetrics(res.data);
      }
    } catch (err) {
      console.warn('Using local fallback for dashboard metrics', err);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await AdminService.getNotifications();
      if (res.success && res.data) {
        const notifs = res.data.notifications || [];
        setNotifications(notifs);
        setUnreadNotificationsCount(res.data.unreadCount || notifs.filter((n: any) => !n.read).length);
      }
    } catch (err) {
      console.warn('Notifications fetch fallback', err);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await AdminService.getCustomers({
        page: customersPage,
        limit: 10,
        search: customersSearch,
        status: customersStatus,
      });
      if (res.success && res.data) {
        setCustomers(res.data.customers || []);
        setCustomersTotal(res.data.total || 0);
      }
    } catch (err) {
      console.warn('Customers fetch fallback', err);
    }
  };

  const loadFlightRequests = async () => {
    try {
      const res = await AdminService.getFlightRequests({
        page: requestsPage,
        limit: 10,
        search: requestsSearch,
        status: requestsStatus,
      });
      if (res.success && res.data) {
        setRequests(res.data.requests || []);
        setRequestsTotal(res.data.total || 0);
      }
    } catch (err) {
      console.warn('Flight requests fetch fallback', err);
    }
  };

  const loadQuotes = async () => {
    try {
      const res = await AdminService.getQuotes({
        page: quotesPage,
        limit: 10,
        search: quotesSearch,
        status: quotesStatus,
      });
      if (res.success && res.data) {
        setQuotes(res.data.quotes || []);
        setQuotesTotal(res.data.total || 0);
      }
    } catch (err) {
      console.warn('Quotes fetch fallback', err);
    }
  };

  const loadBookings = async () => {
    try {
      const res = await AdminService.getBookings({
        page: bookingsPage,
        limit: 10,
        search: bookingsSearch,
        status: bookingsStatus,
      });
      if (res.success && res.data) {
        setBookings(res.data.bookings || []);
        setBookingsTotal(res.data.total || 0);
      }
    } catch (err) {
      console.warn('Bookings fetch fallback', err);
    }
  };

  const loadInvoices = async () => {
    try {
      const res = await AdminService.getInvoices({
        page: invoicesPage,
        limit: 10,
        search: invoicesSearch,
        status: invoicesStatus,
      });
      if (res.success && res.data) {
        setInvoices(res.data.invoices || []);
        setInvoicesTotal(res.data.total || 0);
      }
    } catch (err) {
      console.warn('Invoices fetch fallback', err);
    }
  };

  const loadPayments = async () => {
    try {
      const res = await AdminService.getPayments({
        page: paymentsPage,
        limit: 10,
        search: paymentsSearch,
        status: paymentsStatus,
      });
      if (res.success && res.data) {
        setPayments(res.data.payments || []);
        setPaymentsTotal(res.data.total || 0);
      }
    } catch (err) {
      console.warn('Payments fetch fallback', err);
    }
  };

  const loadAircraft = async () => {
    try {
      const res = await AdminService.getAircraft();
      if (res.success && res.data) {
        setAircraftList(res.data.aircraft || []);
      }
    } catch (err) {
      console.warn('Aircraft fetch fallback', err);
    }
  };

  const loadAirports = async () => {
    try {
      const res = await AdminService.getAirports({ search: airportsSearch });
      if (res.success && res.data) {
        setAirportsList(res.data.airports || []);
      }
    } catch (err) {
      console.warn('Airports fetch fallback', err);
    }
  };

  const loadPricingRules = async () => {
    try {
      const res = await AdminService.getPricingRules();
      if (res.success && res.data) {
        setPricingRules(res.data.pricingRules || res.data);
      }
    } catch (err) {
      console.warn('Pricing rules fetch fallback', err);
    }
  };

  const loadForensicCases = async () => {
    try {
      const res = await AdminService.getForensicCases();
      if (res.success && res.data) {
        setForensicCases(res.data.cases || []);
      }
    } catch (err) {
      console.warn('Forensic cases fetch fallback', err);
    }
  };

  const loadReports = async () => {
    try {
      const res = await AdminService.getFinancialReports();
      if (res.success && res.data) {
        setReportsData(res.data);
      }
    } catch (err) {
      console.warn('Reports fetch fallback', err);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const res = await AdminService.getAuditLogs({ limit: 50 });
      if (res.success && res.data) {
        setAuditLogs(res.data.logs || []);
      }
    } catch (err) {
      console.warn('Audit logs fetch fallback', err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await AdminService.getSettings();
      if (res.success && res.data) {
        setSettingsData(res.data.settings || res.data);
      }
    } catch (err) {
      console.warn('Settings fetch fallback', err);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await AdminService.getProfile();
      if (res.success && res.data) {
        setAdminProfile(res.data.user || res.data);
      }
    } catch (err) {
      console.warn('Profile fetch fallback', err);
    }
  };

  // Initial Load
  useEffect(() => {
    loadDashboardData();
    loadNotifications();
    loadCustomers();
    loadFlightRequests();
    loadQuotes();
    loadBookings();
    loadInvoices();
    loadPayments();
    loadAircraft();
    loadAirports();
    loadPricingRules();
    loadForensicCases();
    loadReports();
    loadAuditLogs();
    loadSettings();
    loadProfile();
  }, []);

  // Sync tab specific loads
  useEffect(() => {
    if (currentTab === 'customers') loadCustomers();
    if (currentTab === 'flight-requests') loadFlightRequests();
    if (currentTab === 'quotes') loadQuotes();
    if (currentTab === 'bookings') loadBookings();
    if (currentTab === 'invoices') loadInvoices();
    if (currentTab === 'payments') loadPayments();
    if (currentTab === 'aircraft') loadAircraft();
    if (currentTab === 'airports') loadAirports();
    if (currentTab === 'pricing') loadPricingRules();
    if (currentTab === 'payla-forensic') loadForensicCases();
    if (currentTab === 'reports') loadReports();
    if (currentTab === 'audit-logs') loadAuditLogs();
    if (currentTab === 'settings') loadSettings();
    if (currentTab === 'profile') loadProfile();
  }, [
    currentTab,
    customersPage, customersSearch, customersStatus,
    requestsPage, requestsSearch, requestsStatus,
    quotesPage, quotesSearch, quotesStatus,
    bookingsPage, bookingsSearch, bookingsStatus,
    invoicesPage, invoicesSearch, invoicesStatus,
    paymentsPage, paymentsSearch, paymentsStatus,
    airportsSearch
  ]);

  // Actions
  const handleUpdateCustomerStatus = async (customerId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      await AdminService.updateCustomerStatus(customerId, status);
      loadCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateFlightRequestStatus = async (id: string, status: string) => {
    try {
      await AdminService.updateFlightRequest(id, { status });
      loadFlightRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuoteStatus = async (id: string, status: string) => {
    try {
      await AdminService.updateQuote(id, { status });
      loadQuotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBookingStatus = async (id: string, data: any) => {
    try {
      await AdminService.updateBooking(id, data);
      loadBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInvoiceStatus = async (id: string, data: any) => {
    try {
      await AdminService.updateInvoice(id, data);
      loadInvoices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateOrUpdateAircraft = async (aircraftData: any) => {
    if (selectedAircraftForEdit) {
      await AdminService.updateAircraft(selectedAircraftForEdit.id || selectedAircraftForEdit._id, aircraftData);
    } else {
      await AdminService.createAircraft(aircraftData);
    }
    loadAircraft();
  };

  const handleDeleteAircraft = (id: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Remove Aircraft from Fleet',
      message: 'Are you sure you want to decommission this aircraft? It will no longer be available for dispatch and quote calculations.',
      confirmText: 'Decommission Aircraft',
      onConfirm: async () => {
        await AdminService.deleteAircraft(id);
        loadAircraft();
      },
    });
  };

  const handleCreateOrUpdateAirport = async (airportData: any) => {
    if (selectedAirportForEdit) {
      await AdminService.updateAirport(selectedAirportForEdit.id || selectedAirportForEdit._id, airportData);
    } else {
      await AdminService.createAirport(airportData);
    }
    loadAirports();
  };

  const handleDeleteAirport = (id: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Remove Executive Airport',
      message: 'Are you sure you want to remove this airport from the global matrix? Any associated tariff data will be removed.',
      confirmText: 'Remove Airport',
      onConfirm: async () => {
        await AdminService.deleteAirport(id);
        loadAirports();
      },
    });
  };

  const handleSavePricingRules = async (rules: any) => {
    await AdminService.updatePricingRules(rules);
    loadPricingRules();
  };

  const handleUpdateForensicCase = async (id: string, data: any) => {
    await AdminService.updateForensicCase(id, data);
    if (onUpdateForensicCase) {
      onUpdateForensicCase(id, data.amlStatus === 'CLEARED' ? 'PASSED' : data.amlStatus === 'BLOCKED' ? 'BLOCKED' : 'REVIEW REQUIRED', data.notes || '');
    }
    loadForensicCases();
  };

  const handleMarkNotificationRead = async (id: string) => {
    await AdminService.markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllNotificationsRead = async () => {
    await AdminService.markAllNotificationsRead();
    loadNotifications();
  };

  const handleSaveSettings = async (settings: any) => {
    await AdminService.updateSettings(settings);
    loadSettings();
  };

  const handleSaveProfile = async (profile: any) => {
    await AdminService.updateProfile(profile);
    loadProfile();
  };

  const handleChangePassword = async (passwords: any) => {
    await AdminService.changePassword(passwords.currentPassword, passwords.newPassword);
  };

  // Convert flight request to quote modal or action
  const handleConvertToQuote = (request: any) => {
    const docQuote = {
      id: `QT-${Date.now()}`,
      quoteNumber: `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      requestId: request.id || request._id,
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      aircraftName: request.preferredAircraftCategory || 'Bombardier Global 7500',
      routeSummary: `${request.departureAirport} → ${request.arrivalAirport}`,
      departureDate: request.departureDate || 'Scheduled',
      departureAirportIcao: request.departureAirport || 'LSGG',
      arrivalAirportIcao: request.arrivalAirport || 'KTEB',
      passengers: request.passengers || 6,
      costBreakdown: {
        flightHours: 7.8,
        hourlyRate: 15500,
        flightHoursTotal: 120900,
        fuelGallons: 3800,
        fuelPricePerGal: null,
        fuelTotal: 0,
        handlingOrigin: 3200,
        handlingDestination: 4100,
        handlingTotal: 7300,
        navigationOverflight: 4800,
        crewAllowances: 2600,
        landingAndAirportFees: 3500,
        subtotal: 139100,
        markupPercent: 18,
        markupAmount: 25038,
        quotedTotal: 164138,
      },
      validUntil: '7 days',
      status: 'Sent',
    };
    setSelectedQuoteForPdf(docQuote);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          unreadNotifsCount={unreadNotificationsCount}
          onLogout={onLogout || (() => {})}
          onExitAdmin={onExitAdmin || (() => {})}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
          
          {/* Top Header */}
          <AdminHeader
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            adminUser={adminProfile}
            notifications={notifications}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            onLogout={onLogout || (() => {})}
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
          />

          {/* Tab View Container */}
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
            
            {/* TAB: DASHBOARD */}
            {currentTab === 'dashboard' && (
              <DashboardHomeView
                metricsData={dashboardMetrics}
                onNavigateTab={setCurrentTab}
                onOpenCreateQuote={() => {
                  handleConvertToQuote({
                    customerName: 'VIP Charter Client',
                    customerEmail: 'vip@client.com',
                    departureAirport: 'LSGG',
                    arrivalAirport: 'KTEB',
                    passengers: 6,
                    preferredAircraftCategory: 'Gulfstream G650ER',
                  });
                }}
              />
            )}

            {/* TAB: CUSTOMERS */}
            {currentTab === 'customers' && (
              <CustomersView
                customers={customers}
                total={customersTotal}
                page={customersPage}
                limit={10}
                onPageChange={setCustomersPage}
                searchQuery={customersSearch}
                onSearchChange={setCustomersSearch}
                statusFilter={customersStatus}
                onStatusFilterChange={setCustomersStatus}
                onViewCustomer={(id) => setSelectedCustomerForModal(id)}
                onUpdateStatus={handleUpdateCustomerStatus}
              />
            )}

            {/* TAB: FLIGHT REQUESTS */}
            {currentTab === 'flight-requests' && (
              <FlightRequestsView
                requests={requests}
                total={requestsTotal}
                page={requestsPage}
                limit={10}
                onPageChange={setRequestsPage}
                searchQuery={requestsSearch}
                onSearchChange={setRequestsSearch}
                statusFilter={requestsStatus}
                onStatusFilterChange={setRequestsStatus}
                onConvertToQuote={handleConvertToQuote}
                onUpdateStatus={handleUpdateFlightRequestStatus}
              />
            )}

            {/* TAB: QUOTES */}
            {currentTab === 'quotes' && (
              <QuotesView
                quotes={quotes}
                total={quotesTotal}
                page={quotesPage}
                limit={10}
                onPageChange={setQuotesPage}
                searchQuery={quotesSearch}
                onSearchChange={setQuotesSearch}
                statusFilter={quotesStatus}
                onStatusFilterChange={setQuotesStatus}
                onOpenCreateQuote={() => {
                  handleConvertToQuote({
                    customerName: 'Executive VIP Lead',
                    customerEmail: 'exec@flyayla.com',
                    departureAirport: 'LSGG',
                    arrivalAirport: 'KTEB',
                    passengers: 8,
                    preferredAircraftCategory: 'Bombardier Global 7500',
                  });
                }}
                onViewPdf={(q) => setSelectedQuoteForPdf(q)}
                onUpdateStatus={handleUpdateQuoteStatus}
              />
            )}

            {/* TAB: BOOKINGS */}
            {currentTab === 'bookings' && (
              <BookingsView
                bookings={bookings}
                total={bookingsTotal}
                page={bookingsPage}
                limit={10}
                onPageChange={setBookingsPage}
                searchQuery={bookingsSearch}
                onSearchChange={setBookingsSearch}
                statusFilter={bookingsStatus}
                onStatusFilterChange={setBookingsStatus}
                onUpdateStatus={handleUpdateBookingStatus}
              />
            )}

            {/* TAB: INVOICES */}
            {currentTab === 'invoices' && (
              <InvoicesView
                invoices={invoices}
                total={invoicesTotal}
                page={invoicesPage}
                limit={10}
                onPageChange={setInvoicesPage}
                searchQuery={invoicesSearch}
                onSearchChange={setInvoicesSearch}
                statusFilter={invoicesStatus}
                onStatusFilterChange={setInvoicesStatus}
                onUpdateStatus={handleUpdateInvoiceStatus}
              />
            )}

            {/* TAB: PAYMENTS */}
            {currentTab === 'payments' && (
              <PaymentsView
                payments={payments}
                total={paymentsTotal}
                page={paymentsPage}
                limit={10}
                onPageChange={setPaymentsPage}
                searchQuery={paymentsSearch}
                onSearchChange={setPaymentsSearch}
                statusFilter={paymentsStatus}
                onStatusFilterChange={setPaymentsStatus}
              />
            )}

            {/* TAB: AIRCRAFT FLEET */}
            {currentTab === 'aircraft' && (
              <AircraftView
                aircraft={aircraftList}
                onOpenAddModal={() => {
                  setSelectedAircraftForEdit(null);
                  setIsAircraftModalOpen(true);
                }}
                onOpenEditModal={(ac) => {
                  setSelectedAircraftForEdit(ac);
                  setIsAircraftModalOpen(true);
                }}
                onDeleteAircraft={handleDeleteAircraft}
              />
            )}

            {/* TAB: AIRPORTS */}
            {currentTab === 'airports' && (
              <AirportsView
                airports={airportsList}
                searchQuery={airportsSearch}
                onSearchChange={setAirportsSearch}
                onOpenAddModal={() => {
                  setSelectedAirportForEdit(null);
                  setIsAirportModalOpen(true);
                }}
                onOpenEditModal={(apt) => {
                  setSelectedAirportForEdit(apt);
                  setIsAirportModalOpen(true);
                }}
                onDeleteAirport={handleDeleteAirport}
              />
            )}

            {/* TAB: PRICING ENGINE */}
            {currentTab === 'pricing' && (
              <PricingView
                pricingRules={pricingRules}
                onSavePricingRules={handleSavePricingRules}
              />
            )}

            {/* TAB: PAYLA FORENSIC AML */}
            {currentTab === 'payla-forensic' && (
              <ForensicView
                cases={forensicCases}
                onUpdateCase={handleUpdateForensicCase}
              />
            )}

            {/* TAB: NOTIFICATIONS */}
            {currentTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                onMarkRead={handleMarkNotificationRead}
                onMarkAllRead={handleMarkAllNotificationsRead}
              />
            )}

            {/* TAB: CMS */}
            {currentTab === 'cms' && cmsContent && (
              <CmsContentManager
                content={cmsContent}
                onSaveContent={onUpdateCmsContent || (() => {})}
                onResetToDefaults={onResetCmsContent || (() => {})}
              />
            )}

            {/* TAB: REPORTS */}
            {currentTab === 'reports' && (
              <ReportsView reportsData={reportsData} />
            )}

            {/* TAB: AUDIT LOGS */}
            {currentTab === 'audit-logs' && (
              <AuditLogsView logs={auditLogs} total={auditLogs.length} />
            )}

            {/* TAB: SETTINGS */}
            {currentTab === 'settings' && (
              <SettingsView
                settingsData={settingsData}
                onSaveSettings={handleSaveSettings}
              />
            )}

            {/* TAB: PROFILE */}
            {currentTab === 'profile' && (
              <ProfileView
                profileData={adminProfile}
                onSaveProfile={handleSaveProfile}
                onChangePassword={handleChangePassword}
              />
            )}

          </main>

        </div>

      </div>

      {/* MODALS */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig({ ...confirmModalConfig, isOpen: false })}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmLabel={confirmModalConfig.confirmText}
        onConfirm={confirmModalConfig.onConfirm}
      />

      <PdfQuoteModal
        isOpen={!!selectedQuoteForPdf}
        onClose={() => setSelectedQuoteForPdf(null)}
        quote={selectedQuoteForPdf}
      />

      <CustomerDetailModal
        isOpen={!!selectedCustomerForModal}
        onClose={() => setSelectedCustomerForModal(null)}
        customerData={
          customers.find((c) => (c.id || c._id) === selectedCustomerForModal) || {
            customer: { id: selectedCustomerForModal, firstName: 'Client', lastName: '', email: 'client@flyayla.com' },
            requests: requests.filter((r) => r.customerId === selectedCustomerForModal),
            quotes: quotes.filter((q) => q.customerId === selectedCustomerForModal),
            bookings: bookings.filter((b) => b.customerId === selectedCustomerForModal),
            invoices: invoices.filter((i) => i.customerId === selectedCustomerForModal),
            payments: payments.filter((p) => p.customerId === selectedCustomerForModal),
          }
        }
        onUpdateStatus={handleUpdateCustomerStatus}
      />

      <AircraftModal
        isOpen={isAircraftModalOpen}
        onClose={() => {
          setIsAircraftModalOpen(false);
          setSelectedAircraftForEdit(null);
        }}
        onSubmit={handleCreateOrUpdateAircraft}
        initialData={selectedAircraftForEdit}
      />

      <AirportModal
        isOpen={isAirportModalOpen}
        onClose={() => {
          setIsAirportModalOpen(false);
          setSelectedAirportForEdit(null);
        }}
        onSubmit={handleCreateOrUpdateAirport}
        initialData={selectedAirportForEdit}
      />

    </div>
  );
};
