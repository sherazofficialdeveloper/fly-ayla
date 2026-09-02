import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';
import { AdminDataService } from '../services/adminData.service';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';
import bcrypt from 'bcryptjs';

export class AdminController {
  static async getDashboard(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await AdminDataService.getDashboardMetrics();
      ApiResponse.success(res, data, 'Dashboard telemetry aggregated.');
    } catch (error: any) {
      Logger.error('Admin Dashboard Error', error);
      ApiResponse.error(res, 'Failed to aggregate flight operations dashboard telemetry.', 500);
    }
  }

  static async getCustomers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      let customers = await UserService.getAllCustomers();

      if (status && status !== 'all') {
        customers = customers.filter((c) => c.status === status);
      }

      if (search) {
        const q = search.toLowerCase();
        customers = customers.filter(
          (c) =>
            c.fullName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            (c.companyName && c.companyName.toLowerCase().includes(q)) ||
            c.phone.toLowerCase().includes(q)
        );
      }

      const total = customers.length;
      const paginated = customers.slice((page - 1) * limit, page * limit);

      ApiResponse.success(
        res,
        {
          customers: paginated,
          total,
          page,
          limit,
          pages: Math.ceil(total / limit) || 1,
        },
        'Customer directory retrieved.'
      );
    } catch (error: any) {
      Logger.error('Get Customers Error', error);
      ApiResponse.error(res, 'Failed to fetch customer directory.', 500);
    }
  }

  static async getCustomerById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const customer = await UserService.findById(id);

      if (!customer) {
        ApiResponse.error(res, 'Customer account not found.', 404);
        return;
      }

      const [requestsRes, quotesRes, bookingsRes, invoicesRes, paymentsRes] = await Promise.all([
        AdminDataService.getFlightRequests(1, 50, customer.email),
        AdminDataService.getQuotes(1, 50, customer.email),
        AdminDataService.getBookings(1, 50, customer.email),
        AdminDataService.getInvoices(1, 50, customer.email),
        AdminDataService.getPayments(1, 50, customer.email),
      ]);

      ApiResponse.success(
        res,
        {
          customer,
          requests: requestsRes.items,
          quotes: quotesRes.items,
          bookings: bookingsRes.items,
          invoices: invoicesRes.items,
          payments: paymentsRes.items,
        },
        'Customer details retrieved.'
      );
    } catch (error: any) {
      Logger.error('Get Customer By ID Error', error);
      ApiResponse.error(res, 'Failed to fetch customer details.', 500);
    }
  }

  static async updateCustomerStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'inactive', 'suspended'].includes(status)) {
        ApiResponse.error(res, 'Invalid status. Must be active, inactive, or suspended.', 400);
        return;
      }

      const updated = await UserService.updateCustomerStatus(id, status);
      if (!updated) {
        ApiResponse.error(res, 'Customer not found.', 404);
        return;
      }

      await AdminDataService.logAction({
        action: `Changed customer ${updated.email} account status to ${status.toUpperCase()}`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'CUSTOMER',
        recordRef: updated.email,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { customer: updated }, `Customer account status updated to ${status}.`);
    } catch (error: any) {
      Logger.error('Update Customer Status Error', error);
      ApiResponse.error(res, 'Failed to update customer status.', 500);
    }
  }

  static async getFlightRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      const result = await AdminDataService.getFlightRequests(page, limit, search, status);
      ApiResponse.success(res, result, 'Flight requests fetched.');
    } catch (error: any) {
      Logger.error('Admin Get Flight Requests Error', error);
      ApiResponse.error(res, 'Failed to fetch flight requests.', 500);
    }
  }

  static async getFlightRequestById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const item = await AdminDataService.getFlightRequestById(req.params.id);
      if (!item) {
        ApiResponse.error(res, 'Flight request not found.', 404);
        return;
      }
      ApiResponse.success(res, { request: item }, 'Flight request retrieved.');
    } catch (error: any) {
      Logger.error('Admin Get Flight Request By ID Error', error);
      ApiResponse.error(res, 'Failed to fetch flight request.', 500);
    }
  }

  static async createFlightRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const newReq = await AdminDataService.createFlightRequest(req.body);

      await AdminDataService.logAction({
        action: `Created charter request ${newReq.requestNumber} for ${newReq.customerName}`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'FLIGHT_REQUEST',
        recordRef: newReq.requestNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.created(res, { request: newReq }, 'Flight request created successfully.');
    } catch (error: any) {
      Logger.error('Admin Create Flight Request Error', error);
      ApiResponse.error(res, 'Failed to create flight request.', 500);
    }
  }

  static async updateFlightRequestStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await AdminDataService.updateFlightRequestStatus(req.params.id, status);
      if (!updated) {
        ApiResponse.error(res, 'Flight request not found.', 404);
        return;
      }

      await AdminDataService.logAction({
        action: `Updated flight request ${updated.requestNumber || req.params.id} status to ${status}`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'FLIGHT_REQUEST',
        recordRef: updated.requestNumber || req.params.id,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { request: updated }, `Flight request updated to ${status}.`);
    } catch (error: any) {
      Logger.error('Admin Update Flight Request Status Error', error);
      ApiResponse.error(res, 'Failed to update flight request status.', 500);
    }
  }

  static async getQuotes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      const result = await AdminDataService.getQuotes(page, limit, search, status);
      ApiResponse.success(res, result, 'Quotes fetched.');
    } catch (error: any) {
      Logger.error('Admin Get Quotes Error', error);
      ApiResponse.error(res, 'Failed to fetch quotes.', 500);
    }
  }

  static async createQuote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const newQuote = await AdminDataService.createQuote(req.body);

      await AdminDataService.logAction({
        action: `Generated quote ${newQuote.quoteNumber} ($${newQuote.costBreakdown?.quotedTotal?.toLocaleString()}) for ${newQuote.customerName}`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'QUOTE',
        recordRef: newQuote.quoteNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.created(res, { quote: newQuote }, 'Charter quote generated successfully.');
    } catch (error: any) {
      Logger.error('Admin Create Quote Error', error);
      ApiResponse.error(res, 'Failed to create quote.', 500);
    }
  }

  static async getQuoteById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const quote = await AdminDataService.getQuoteById(req.params.id);
      if (!quote) {
        ApiResponse.error(res, 'Quote not found.', 404);
        return;
      }
      ApiResponse.success(res, { quote }, 'Quote details retrieved.');
    } catch (error: any) {
      Logger.error('Admin Get Quote By ID Error', error);
      ApiResponse.error(res, 'Failed to fetch quote.', 500);
    }
  }

  static async updateQuote(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminDataService.updateQuote(req.params.id, req.body);
      if (!updated) {
        ApiResponse.error(res, 'Quote not found.', 404);
        return;
      }
      ApiResponse.success(res, { quote: updated }, 'Quote updated successfully.');
    } catch (error: any) {
      Logger.error('Admin Update Quote Error', error);
      ApiResponse.error(res, 'Failed to update quote.', 500);
    }
  }

  static async updateQuoteStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await AdminDataService.updateQuoteStatus(req.params.id, status);
      if (!updated) {
        ApiResponse.error(res, 'Quote not found.', 404);
        return;
      }

      await AdminDataService.logAction({
        action: `Changed quote ${updated.quoteNumber} status to ${status}`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'QUOTE',
        recordRef: updated.quoteNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { quote: updated }, `Quote status updated to ${status}.`);
    } catch (error: any) {
      Logger.error('Admin Update Quote Status Error', error);
      ApiResponse.error(res, 'Failed to update quote status.', 500);
    }
  }

  static async getBookings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      const result = await AdminDataService.getBookings(page, limit, search, status);
      ApiResponse.success(res, result, 'Bookings fetched.');
    } catch (error: any) {
      Logger.error('Admin Get Bookings Error', error);
      ApiResponse.error(res, 'Failed to fetch bookings.', 500);
    }
  }

  static async getBookingById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const booking = await AdminDataService.getBookingById(req.params.id);
      if (!booking) {
        ApiResponse.error(res, 'Booking not found.', 404);
        return;
      }
      ApiResponse.success(res, { booking }, 'Booking details retrieved.');
    } catch (error: any) {
      Logger.error('Admin Get Booking By ID Error', error);
      ApiResponse.error(res, 'Failed to fetch booking.', 500);
    }
  }

  static async createBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const newBk = await AdminDataService.createBooking(req.body);

      await AdminDataService.logAction({
        action: `Confirmed flight booking ${newBk.bookingReference} (PNR: ${newBk.pnr}) for ${newBk.customerName}`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'BOOKING',
        recordRef: newBk.bookingReference,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.created(res, { booking: newBk }, 'Booking created successfully.');
    } catch (error: any) {
      Logger.error('Admin Create Booking Error', error);
      ApiResponse.error(res, 'Failed to create booking.', 500);
    }
  }

  static async updateBookingStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminDataService.updateBookingStatus(req.params.id, req.body);
      if (!updated) {
        ApiResponse.error(res, 'Booking not found.', 404);
        return;
      }

      await AdminDataService.logAction({
        action: `Updated booking ${updated.bookingReference} flight dispatch status`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'BOOKING',
        recordRef: updated.bookingReference,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { booking: updated }, 'Booking updated successfully.');
    } catch (error: any) {
      Logger.error('Admin Update Booking Status Error', error);
      ApiResponse.error(res, 'Failed to update booking status.', 500);
    }
  }

  static async getInvoices(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      const result = await AdminDataService.getInvoices(page, limit, search, status);
      ApiResponse.success(res, result, 'Invoices fetched.');
    } catch (error: any) {
      Logger.error('Admin Get Invoices Error', error);
      ApiResponse.error(res, 'Failed to fetch invoices.', 500);
    }
  }

  static async createInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const newInv = await AdminDataService.createInvoice(req.body);

      await AdminDataService.logAction({
        action: `Issued commercial invoice ${newInv.invoiceNumber} ($${newInv.total?.toLocaleString()}) to ${newInv.customerName}`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'INVOICE',
        recordRef: newInv.invoiceNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.created(res, { invoice: newInv }, 'Invoice issued successfully.');
    } catch (error: any) {
      Logger.error('Admin Create Invoice Error', error);
      ApiResponse.error(res, 'Failed to create invoice.', 500);
    }
  }

  static async getInvoiceById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const inv = await AdminDataService.getInvoiceById(req.params.id);
      if (!inv) {
        ApiResponse.error(res, 'Invoice not found.', 404);
        return;
      }
      ApiResponse.success(res, { invoice: inv }, 'Invoice retrieved.');
    } catch (error: any) {
      Logger.error('Admin Get Invoice By ID Error', error);
      ApiResponse.error(res, 'Failed to fetch invoice.', 500);
    }
  }

  static async updateInvoiceStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminDataService.updateInvoiceStatus(req.params.id, req.body);
      if (!updated) {
        ApiResponse.error(res, 'Invoice not found.', 404);
        return;
      }

      ApiResponse.success(res, { invoice: updated }, 'Invoice status updated.');
    } catch (error: any) {
      Logger.error('Admin Update Invoice Status Error', error);
      ApiResponse.error(res, 'Failed to update invoice status.', 500);
    }
  }

  static async getPayments(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';

      const result = await AdminDataService.getPayments(page, limit, search, status);
      ApiResponse.success(res, result, 'Payments directory fetched.');
    } catch (error: any) {
      Logger.error('Admin Get Payments Error', error);
      ApiResponse.error(res, 'Failed to fetch payments.', 500);
    }
  }

  static async getPaymentById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const p = await AdminDataService.getPaymentById(req.params.id);
      if (!p) {
        ApiResponse.error(res, 'Payment record not found.', 404);
        return;
      }
      ApiResponse.success(res, { payment: p }, 'Payment details retrieved.');
    } catch (error: any) {
      Logger.error('Admin Get Payment By ID Error', error);
      ApiResponse.error(res, 'Failed to fetch payment.', 500);
    }
  }

  static async createPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const newPay = await AdminDataService.createPayment(req.body);

      await AdminDataService.logAction({
        action: `Recorded payment ${newPay.transactionId} ($${newPay.amount?.toLocaleString()} ${newPay.currency}) via ${newPay.paymentMethod}`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'PAYMENT',
        recordRef: newPay.transactionId,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.created(res, { payment: newPay }, 'Payment recorded successfully.');
    } catch (error: any) {
      Logger.error('Admin Create Payment Error', error);
      ApiResponse.error(res, 'Failed to record payment.', 500);
    }
  }

  static async getAircraft(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const list = await AdminDataService.getAircraftList();
      ApiResponse.success(res, { aircraft: list, total: list.length }, 'Fleet retrieved.');
    } catch (error: any) {
      Logger.error('Admin Get Aircraft Error', error);
      ApiResponse.error(res, 'Failed to fetch fleet.', 500);
    }
  }

  static async createAircraft(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const newAc = await AdminDataService.createAircraft(req.body);

      await AdminDataService.logAction({
        action: `Added aircraft ${newAc.name} (${newAc.tailNumber}) to fleet registry`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'AIRCRAFT',
        recordRef: newAc.tailNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.created(res, { aircraft: newAc }, 'Aircraft added to fleet successfully.');
    } catch (error: any) {
      Logger.error('Admin Create Aircraft Error', error);
      ApiResponse.error(res, 'Failed to add aircraft.', 500);
    }
  }

  static async updateAircraft(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminDataService.updateAircraft(req.params.id, req.body);
      if (!updated) {
        ApiResponse.error(res, 'Aircraft not found.', 404);
        return;
      }

      await AdminDataService.logAction({
        action: `Updated aircraft ${updated.name} (${updated.tailNumber}) specifications`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'AIRCRAFT',
        recordRef: updated.tailNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { aircraft: updated }, 'Aircraft updated successfully.');
    } catch (error: any) {
      Logger.error('Admin Update Aircraft Error', error);
      ApiResponse.error(res, 'Failed to update aircraft.', 500);
    }
  }

  static async deleteAircraft(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await AdminDataService.deleteAircraft(req.params.id);

      await AdminDataService.logAction({
        action: `Removed aircraft ID ${req.params.id} from fleet`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'AIRCRAFT',
        recordRef: req.params.id,
        status: 'WARNING',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, null, 'Aircraft removed from fleet.');
    } catch (error: any) {
      Logger.error('Admin Delete Aircraft Error', error);
      ApiResponse.error(res, 'Failed to delete aircraft.', 500);
    }
  }

  static async getAirports(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const search = (req.query.search as string) || '';
      const status = (req.query.status as string) || '';
      const list = await AdminDataService.getAirportsList(search, status);
      ApiResponse.success(res, { airports: list, total: list.length }, 'Airports fetched.');
    } catch (error: any) {
      Logger.error('Admin Get Airports Error', error);
      ApiResponse.error(res, 'Failed to fetch airports.', 500);
    }
  }

  static async createAirport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const newApt = await AdminDataService.createAirport(req.body);

      await AdminDataService.logAction({
        action: `Added airport ${newApt.icao} / ${newApt.iata} (${newApt.name}, ${newApt.city})`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'AIRPORT',
        recordRef: newApt.icao,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.created(res, { airport: newApt }, 'Airport added successfully.');
    } catch (error: any) {
      Logger.error('Admin Create Airport Error', error);
      ApiResponse.error(res, 'Failed to add airport.', 500);
    }
  }

  static async updateAirport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminDataService.updateAirport(req.params.id, req.body);
      if (!updated) {
        ApiResponse.error(res, 'Airport not found.', 404);
        return;
      }
      ApiResponse.success(res, { airport: updated }, 'Airport updated successfully.');
    } catch (error: any) {
      Logger.error('Admin Update Airport Error', error);
      ApiResponse.error(res, 'Failed to update airport.', 500);
    }
  }

  static async deleteAirport(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await AdminDataService.deleteAirport(req.params.id);
      ApiResponse.success(res, null, 'Airport removed.');
    } catch (error: any) {
      Logger.error('Admin Delete Airport Error', error);
      ApiResponse.error(res, 'Failed to delete airport.', 500);
    }
  }

  static async getPricing(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const rules = await AdminDataService.getPricingRules();
      ApiResponse.success(res, { pricing: rules }, 'Pricing rules retrieved.');
    } catch (error: any) {
      Logger.error('Admin Get Pricing Error', error);
      ApiResponse.error(res, 'Failed to fetch pricing rules.', 500);
    }
  }

  static async updatePricing(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminDataService.updatePricingRules({
        ...req.body,
        updatedBy: req.user?.fullName || 'Flight Ops Admin',
      });

      await AdminDataService.logAction({
        action: `Updated pricing engine parameters (Jet Fuel: $${updated.jetFuelPricePerGal}/gal, Target Margin: ${updated.defaultMarkupPercent}%)`,
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'PRICING',
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { pricing: updated }, 'Pricing engine parameters updated.');
    } catch (error: any) {
      Logger.error('Admin Update Pricing Error', error);
      ApiResponse.error(res, 'Failed to update pricing rules.', 500);
    }
  }

  static async getForensicCases(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const cases = await AdminDataService.getForensicCases();
      ApiResponse.success(
        res,
        {
          cases,
          total: cases.length,
          amlStatus: 'ACTIVE_MONITORING',
          integrationStatus: 'CONNECTED_SANDBOX',
          ofacSanctionsWatchlistVersion: '2026.08-Q3',
        },
        'Forensic telemetry retrieved.'
      );
    } catch (error: any) {
      Logger.error('Admin Get Forensic Cases Error', error);
      ApiResponse.error(res, 'Failed to fetch forensic cases.', 500);
    }
  }

  static async updateForensicCase(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminDataService.updateForensicCase(req.params.id, req.body);
      if (!updated) {
        ApiResponse.error(res, 'Forensic case not found.', 404);
        return;
      }

      await AdminDataService.logAction({
        action: `Updated PAYLA FORENSIC case ${updated.caseNumber} AML status to ${updated.amlStatus}`,
        user: req.user?.fullName || 'Compliance Lead',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'FORENSIC',
        recordRef: updated.caseNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { case: updated }, 'Forensic case updated.');
    } catch (error: any) {
      Logger.error('Admin Update Forensic Case Error', error);
      ApiResponse.error(res, 'Failed to update forensic case.', 500);
    }
  }

  static async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const notifs = await AdminDataService.getNotifications('admin');
      ApiResponse.success(res, { notifications: notifs, total: notifs.length }, 'Notifications fetched.');
    } catch (error: any) {
      Logger.error('Admin Get Notifications Error', error);
      ApiResponse.error(res, 'Failed to fetch notifications.', 500);
    }
  }

  static async markNotificationRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminDataService.markNotificationRead(req.params.id);
      ApiResponse.success(res, { notification: updated }, 'Notification marked as read.');
    } catch (error: any) {
      Logger.error('Admin Mark Notification Read Error', error);
      ApiResponse.error(res, 'Failed to mark notification read.', 500);
    }
  }

  static async markAllNotificationsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await AdminDataService.markAllNotificationsRead();
      ApiResponse.success(res, null, 'All notifications marked as read.');
    } catch (error: any) {
      Logger.error('Admin Mark All Notifications Read Error', error);
      ApiResponse.error(res, 'Failed to mark all read.', 500);
    }
  }

  static async getReports(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const metrics = await AdminDataService.getDashboardMetrics();
      const payments = await AdminDataService.getPayments(1, 100);
      const bookings = await AdminDataService.getBookings(1, 100);

      // Dynamically group payments & bookings into monthly metrics
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonthIdx = new Date().getMonth();
      const recent6Months = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(currentMonthIdx - i);
        const mName = months[d.getMonth()];
        const year = d.getFullYear();
        const monthNum = d.getMonth();

        // Calculate revenue for this month from real payments in DB
        const monthRevenue = (payments.items || [])
          .filter((p: any) => {
            const pDate = new Date(p.createdAt || p.paidAt || Date.now());
            return (
              pDate.getMonth() === monthNum &&
              pDate.getFullYear() === year &&
              (p.status === 'Paid' || p.status === 'Completed' || p.status === 'Succeeded')
            );
          })
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

        const monthBookings = (bookings.items || []).filter((b: any) => {
          const bDate = new Date(b.createdAt || Date.now());
          return bDate.getMonth() === monthNum && bDate.getFullYear() === year;
        }).length;

        recent6Months.push({
          month: `${mName}`,
          revenue: monthRevenue,
          bookings: monthBookings,
        });
      }

      ApiResponse.success(
        res,
        {
          summary: metrics.metrics,
          revenueByMonth: recent6Months,
          payments: payments.items,
          bookings: bookings.items,
        },
        'Report metrics aggregated from database.'
      );
    } catch (error: any) {
      Logger.error('Admin Get Reports Error', error);
      ApiResponse.error(res, 'Failed to aggregate report metrics.', 500);
    }
  }

  static async getAuditLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 50;
      const category = (req.query.category as string) || '';
      const search = (req.query.search as string) || '';

      const result = await AdminDataService.getAuditLogs(page, limit, category, search);
      ApiResponse.success(res, result, 'Audit logs fetched.');
    } catch (error: any) {
      Logger.error('Admin Get Audit Logs Error', error);
      ApiResponse.error(res, 'Failed to fetch audit logs.', 500);
    }
  }

  static async getSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const settings = await AdminDataService.getSettings();
      ApiResponse.success(
        res,
        {
          settings: {
            companyName: 'Fly Ayla Global Private Aviation LLC',
            contactEmail: 'ops@flyayla.com',
            contactPhone: '+1 (800) 555-AYLA',
            hqLocation: 'Geneva / Kuwait / New York',
            aocLicenseNumber: 'AOC-EASA-CH.AOC.4088',
            defaultCurrency: 'USD',
            enableTwoFactor: true,
            requireKycVerification: true,
            amlSentinelThreshold: 10000,
            ...settings,
          },
        },
        'Settings retrieved.'
      );
    } catch (error: any) {
      Logger.error('Admin Get Settings Error', error);
      ApiResponse.error(res, 'Failed to fetch settings.', 500);
    }
  }

  static async updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const updated = await AdminDataService.updateSettings(req.body, req.user?.fullName || 'Flight Ops Admin');

      await AdminDataService.logAction({
        action: 'Updated global system operations settings',
        user: req.user?.fullName || 'Flight Ops Admin',
        userEmail: req.user?.email,
        userId: req.user?.id,
        category: 'SETTINGS',
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { settings: updated }, 'Settings saved successfully.');
    } catch (error: any) {
      Logger.error('Admin Update Settings Error', error);
      ApiResponse.error(res, 'Failed to save settings.', 500);
    }
  }

  static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Not authenticated.', 401);
        return;
      }
      ApiResponse.success(res, { admin: req.user }, 'Admin profile retrieved.');
    } catch (error: any) {
      Logger.error('Admin Get Profile Error', error);
      ApiResponse.error(res, 'Failed to fetch admin profile.', 500);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Not authenticated.', 401);
        return;
      }

      const { firstName, lastName, phone, companyName } = req.body;
      const updated = await UserService.updateProfile(req.user.id, {
        firstName,
        lastName,
        phone,
        companyName,
      });

      await AdminDataService.logAction({
        action: `Admin ${req.user.email} updated their profile info`,
        user: req.user.fullName,
        userEmail: req.user.email,
        userId: req.user.id,
        category: 'AUTH',
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { admin: updated }, 'Profile updated successfully.');
    } catch (error: any) {
      Logger.error('Admin Update Profile Error', error);
      ApiResponse.error(res, 'Failed to update admin profile.', 500);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ApiResponse.error(res, 'Not authenticated.', 401);
        return;
      }

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        ApiResponse.error(res, 'Current password and new password are required.', 400);
        return;
      }

      if (newPassword.length < 8) {
        ApiResponse.error(res, 'New password must be at least 8 characters long.', 400);
        return;
      }

      const userWithPw = await UserService.findByEmailWithPassword(req.user.email);
      if (!userWithPw) {
        ApiResponse.error(res, 'Admin account not found.', 404);
        return;
      }

      const isMatch = await bcrypt.compare(currentPassword, userWithPw.passwordHash);
      if (!isMatch) {
        ApiResponse.error(res, 'Incorrect current password.', 400);
        return;
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await UserService.updatePassword(req.user.id, newHash);

      await AdminDataService.logAction({
        action: `Admin ${req.user.email} changed their password`,
        user: req.user.fullName,
        userEmail: req.user.email,
        userId: req.user.id,
        category: 'AUTH',
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, null, 'Password changed successfully.');
    } catch (error: any) {
      Logger.error('Admin Change Password Error', error);
      ApiResponse.error(res, 'Failed to change password.', 500);
    }
  }
}
