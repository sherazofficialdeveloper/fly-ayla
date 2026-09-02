import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { AdminController } from '../controllers/admin.controller';

const router = Router();

// Strict security: All admin routes require valid authentication and real admin role from database
router.use(authenticate, requireRole('admin'));

// Dashboard Telemetry
router.get('/dashboard', AdminController.getDashboard);

// Customer Directory
router.get('/customers', AdminController.getCustomers);
router.get('/customers/:id', AdminController.getCustomerById);
router.patch('/customers/:id/status', AdminController.updateCustomerStatus);

// Flight Requests
router.get('/flight-requests', AdminController.getFlightRequests);
router.get('/flight-requests/:id', AdminController.getFlightRequestById);
router.post('/flight-requests', AdminController.createFlightRequest);
router.patch('/flight-requests/:id/status', AdminController.updateFlightRequestStatus);

// Quotations
router.get('/quotes', AdminController.getQuotes);
router.post('/quotes', AdminController.createQuote);
router.get('/quotes/:id', AdminController.getQuoteById);
router.put('/quotes/:id', AdminController.updateQuote);
router.patch('/quotes/:id/status', AdminController.updateQuoteStatus);

// Bookings & Dispatch
router.get('/bookings', AdminController.getBookings);
router.get('/bookings/:id', AdminController.getBookingById);
router.post('/bookings', AdminController.createBooking);
router.patch('/bookings/:id/status', AdminController.updateBookingStatus);

// Invoices
router.get('/invoices', AdminController.getInvoices);
router.post('/invoices', AdminController.createInvoice);
router.get('/invoices/:id', AdminController.getInvoiceById);
router.patch('/invoices/:id/status', AdminController.updateInvoiceStatus);

// Payments
router.get('/payments', AdminController.getPayments);
router.get('/payments/:id', AdminController.getPaymentById);
router.post('/payments', AdminController.createPayment);

// Aircraft Fleet
router.get('/aircraft', AdminController.getAircraft);
router.post('/aircraft', AdminController.createAircraft);
router.put('/aircraft/:id', AdminController.updateAircraft);
router.delete('/aircraft/:id', AdminController.deleteAircraft);

// Airports Directory & Tariffs
router.get('/airports', AdminController.getAirports);
router.post('/airports', AdminController.createAirport);
router.put('/airports/:id', AdminController.updateAirport);
router.delete('/airports/:id', AdminController.deleteAirport);

// Dynamic Pricing Matrix
router.get('/pricing', AdminController.getPricing);
router.put('/pricing', AdminController.updatePricing);

// PAYLA FORENSIC AML Sentinel
router.get('/payla-forensic', AdminController.getForensicCases);
router.patch('/payla-forensic/:id', AdminController.updateForensicCase);

// Notifications & Operations Dispatch
router.get('/notifications', AdminController.getNotifications);
router.patch('/notifications/:id/read', AdminController.markNotificationRead);
router.post('/notifications/mark-all-read', AdminController.markAllNotificationsRead);

// Analytics & Reports
router.get('/reports', AdminController.getReports);

// Immutable Audit Logs
router.get('/audit-logs', AdminController.getAuditLogs);

// System Settings
router.get('/settings', AdminController.getSettings);
router.put('/settings', AdminController.updateSettings);

// Admin Profile & Security
router.get('/profile', AdminController.getProfile);
router.put('/profile', AdminController.updateProfile);
router.put('/profile/password', AdminController.changePassword);

export const adminRoutes = router;
