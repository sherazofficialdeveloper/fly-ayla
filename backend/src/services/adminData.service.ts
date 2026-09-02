import { AircraftModel } from '../models/Aircraft';
import { AirportModel } from '../models/Airport';
import { FlightRequestModel } from '../models/FlightRequest';
import { QuoteModel } from '../models/Quote';
import { BookingModel } from '../models/Booking';
import { InvoiceModel } from '../models/Invoice';
import { PaymentModel } from '../models/Payment';
import { PricingRuleModel } from '../models/PricingRule';
import { PaylaForensicCaseModel } from '../models/PaylaForensicCase';
import { NotificationModel } from '../models/Notification';
import { AuditLogModel } from '../models/AuditLog';
import { AdminSettingModel } from '../models/AdminSetting';
import { UserModel } from '../models/User';
import { isMongoConnected } from '../config/database';

export class AdminDataService {
  // ==========================================
  // AUDIT LOGGING HELPER
  // ==========================================
  static async logAction(payload: {
    action: string;
    user: string;
    userEmail?: string;
    userId?: any;
    role?: string;
    category: 'AUTH' | 'CUSTOMER' | 'FLIGHT_REQUEST' | 'QUOTE' | 'BOOKING' | 'INVOICE' | 'PAYMENT' | 'AIRCRAFT' | 'AIRPORT' | 'PRICING' | 'SETTINGS' | 'FORENSIC';
    recordRef?: string;
    status?: 'SUCCESS' | 'WARNING' | 'FAILURE';
    ipAddress?: string;
    details?: string;
  }): Promise<void> {
    try {
      if (!isMongoConnected()) return;
      const record = {
        ...payload,
        role: payload.role || 'Admin',
        status: payload.status || 'SUCCESS',
        ipAddress: payload.ipAddress || '127.0.0.1',
        timestamp: new Date(),
      };

      await (AuditLogModel as any).create(record);
    } catch (err) {
      console.error('[AuditLog Error]:', err);
    }
  }

  // ==========================================
  // DASHBOARD AGGREGATION
  // ==========================================
  static async getDashboardMetrics() {
    if (!isMongoConnected()) {
      return {
        metrics: {
          totalRevenue: 0,
          activeFlightRequests: 0,
          pendingQuotes: 0,
          confirmedBookings: 0,
          totalCustomers: 0,
          activeFleetCount: 0,
          amlAlertsCount: 0,
          unpaidInvoicesCount: 0,
          totalPayments: 0,
          successfulPayments: 0,
          pendingPayments: 0,
          failedPayments: 0,
        },
        recentRequests: [],
        recentBookings: [],
        recentPayments: [],
      };
    }

    const [
      totalCustomers,
      totalRequests,
      totalQuotes,
      totalBookings,
      pendingInvoicesCount,
      paidPayments,
      pendingPaymentsCount,
      failedPaymentsCount,
      totalPaymentsCount,
      recentRequests,
      recentBookings,
      recentPayments,
      fleetCount,
      amlAlertsCount,
    ] = await Promise.all([
      (UserModel as any).countDocuments({ role: 'customer' }),
      (FlightRequestModel as any).countDocuments(),
      (QuoteModel as any).countDocuments(),
      (BookingModel as any).countDocuments(),
      (InvoiceModel as any).countDocuments({ status: { $in: ['Pending', 'Issued', 'Overdue'] } }),
      (PaymentModel as any).find({ status: { $in: ['Paid', 'Completed', 'Succeeded'] } }),
      (PaymentModel as any).countDocuments({ status: { $in: ['Pending', 'Processing'] } }),
      (PaymentModel as any).countDocuments({ status: 'Failed' }),
      (PaymentModel as any).countDocuments(),
      (FlightRequestModel as any).find().sort({ createdAt: -1 }).limit(5),
      (BookingModel as any).find().sort({ createdAt: -1 }).limit(5),
      (PaymentModel as any).find().sort({ createdAt: -1 }).limit(5),
      (AircraftModel as any).countDocuments({ status: 'Available' }),
      (PaylaForensicCaseModel as any).countDocuments({ amlStatus: { $in: ['FLAGGED', 'BLOCKED', 'REVIEW REQUIRED'] } }),
    ]);

    const totalRevenue = paidPayments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);

    return {
      metrics: {
        totalRevenue,
        activeFlightRequests: totalRequests,
        pendingQuotes: totalQuotes,
        confirmedBookings: totalBookings,
        totalCustomers,
        activeFleetCount: fleetCount,
        amlAlertsCount,
        unpaidInvoicesCount: pendingInvoicesCount,
        totalPayments: totalPaymentsCount,
        successfulPayments: paidPayments.length,
        pendingPayments: pendingPaymentsCount,
        failedPayments: failedPaymentsCount,
      },
      recentRequests,
      recentBookings,
      recentPayments,
    };
  }

  // ==========================================
  // CUSTOMERS (CRM)
  // ==========================================
  static async getCustomers(page = 1, limit = 20, search?: string, status?: string) {
    if (!isMongoConnected()) {
      return { customers: [], total: 0, page, limit, pages: 1 };
    }
    const query: any = { role: 'customer' };
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ firstName: regex }, { lastName: regex }, { email: regex }, { companyName: regex }, { phone: regex }];
    }

    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      (UserModel as any).find(query).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit),
      (UserModel as any).countDocuments(query),
    ]);

    return {
      customers: customers.map((c: any) => ({
        id: c._id.toString(),
        _id: c._id.toString(),
        firstName: c.firstName,
        lastName: c.lastName,
        fullName: `${c.firstName} ${c.lastName}`.trim(),
        email: c.email,
        phone: c.phone,
        companyName: c.companyName,
        role: c.role,
        status: c.status || 'active',
        avatarUrl: c.profileImage,
        createdAt: c.createdAt,
      })),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  static async getCustomerById(id: string) {
    if (!isMongoConnected()) return null;
    const user = await (UserModel as any).findById(id).select('-passwordHash');
    if (!user) return null;

    const [requests, quotes, bookings, invoices] = await Promise.all([
      (FlightRequestModel as any).find({ customerEmail: user.email }).sort({ createdAt: -1 }),
      (QuoteModel as any).find({ customerEmail: user.email }).sort({ createdAt: -1 }),
      (BookingModel as any).find({ customerEmail: user.email }).sort({ createdAt: -1 }),
      (InvoiceModel as any).find({ customerEmail: user.email }).sort({ createdAt: -1 }),
    ]);

    return {
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phone,
        companyName: user.companyName,
        role: user.role,
        status: user.status || 'active',
        avatarUrl: user.profileImage,
        createdAt: user.createdAt,
      },
      requests,
      quotes,
      bookings,
      invoices,
    };
  }

  static async updateCustomerStatus(id: string, status: 'active' | 'inactive' | 'suspended') {
    if (!isMongoConnected()) return null;
    const user = await (UserModel as any).findByIdAndUpdate(id, { status }, { new: true }).select('-passwordHash');
    return user;
  }

  // ==========================================
  // FLIGHT REQUESTS
  // ==========================================
  static async getFlightRequests(page = 1, limit = 20, search?: string, status?: string) {
    if (!isMongoConnected()) {
      return { items: [], total: 0, page, limit, pages: 1 };
    }
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { customerName: regex },
        { customerEmail: regex },
        { departureAirport: regex },
        { arrivalAirport: regex },
        { requestNumber: regex },
      ];
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      (FlightRequestModel as any).find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      (FlightRequestModel as any).countDocuments(query),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async getFlightRequestById(id: string) {
    if (!isMongoConnected()) return null;
    return await (FlightRequestModel as any).findById(id);
  }

  static async createFlightRequest(data: any) {
    if (!isMongoConnected()) return data;
    const requestNumber = `AY-REQ-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const fullData = { ...data, requestNumber };
    return await (FlightRequestModel as any).create(fullData);
  }

  static async updateFlightRequestStatus(id: string, status: string, notes?: string) {
    if (!isMongoConnected()) return null;
    return await (FlightRequestModel as any).findByIdAndUpdate(
      id,
      { status, ...(notes ? { internalNotes: notes } : {}) },
      { new: true }
    );
  }

  // ==========================================
  // QUOTES & MARGIN ENGINE
  // ==========================================
  static async getQuotes(page = 1, limit = 20, search?: string, status?: string) {
    if (!isMongoConnected()) {
      return { items: [], total: 0, page, limit, pages: 1 };
    }
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { customerName: regex },
        { customerEmail: regex },
        { aircraftName: regex },
        { quoteNumber: regex },
        { routeSummary: regex },
      ];
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      (QuoteModel as any).find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      (QuoteModel as any).countDocuments(query),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async getQuoteById(id: string) {
    if (!isMongoConnected()) return null;
    return await (QuoteModel as any).findById(id);
  }

  static async createQuote(data: any) {
    if (!isMongoConnected()) return data;
    const quoteNumber = `AY-QT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const fullData = { ...data, quoteNumber };
    return await (QuoteModel as any).create(fullData);
  }

  static async updateQuote(id: string, data: any) {
    if (!isMongoConnected()) return null;
    return await (QuoteModel as any).findByIdAndUpdate(id, data, { new: true });
  }

  static async updateQuoteStatus(id: string, status: string) {
    if (!isMongoConnected()) return null;
    return await (QuoteModel as any).findByIdAndUpdate(id, { status }, { new: true });
  }

  // ==========================================
  // BOOKINGS MANAGEMENT
  // ==========================================
  static async getBookings(page = 1, limit = 20, search?: string, status?: string) {
    if (!isMongoConnected()) {
      return { items: [], total: 0, page, limit, pages: 1 };
    }
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { customerName: regex },
        { customerEmail: regex },
        { bookingReference: regex },
        { pnr: regex },
        { routeSummary: regex },
      ];
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      (BookingModel as any).find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      (BookingModel as any).countDocuments(query),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async getBookingById(id: string) {
    if (!isMongoConnected()) return null;
    return await (BookingModel as any).findById(id);
  }

  static async createBooking(data: any) {
    if (!isMongoConnected()) return data;
    const bookingReference = `AY-BK-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const pnr = `AY${Date.now().toString().slice(-4)}VIP`;
    const fullData = { ...data, bookingReference, pnr };
    return await (BookingModel as any).create(fullData);
  }

  static async updateBookingStatus(id: string, data: any) {
    if (!isMongoConnected()) return null;
    return await (BookingModel as any).findByIdAndUpdate(id, data, { new: true });
  }

  // ==========================================
  // INVOICES MANAGEMENT
  // ==========================================
  static async getInvoices(page = 1, limit = 20, search?: string, status?: string) {
    if (!isMongoConnected()) {
      return { items: [], total: 0, page, limit, pages: 1 };
    }
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ customerName: regex }, { customerEmail: regex }, { invoiceNumber: regex }, { routeSummary: regex }];
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      (InvoiceModel as any).find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      (InvoiceModel as any).countDocuments(query),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async getInvoiceById(id: string) {
    if (!isMongoConnected()) return null;
    return await (InvoiceModel as any).findById(id);
  }

  static async createInvoice(data: any) {
    if (!isMongoConnected()) return data;
    const invoiceNumber = `AY-INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const fullData = { ...data, invoiceNumber };
    return await (InvoiceModel as any).create(fullData);
  }

  static async updateInvoiceStatus(id: string, data: any) {
    if (!isMongoConnected()) return null;
    const updatePayload: any = { ...data, updatedAt: new Date() };
    if (data.status === 'Paid' && !data.paidAt) {
      updatePayload.paidAt = new Date();
    }

    const invoice = await (InvoiceModel as any).findByIdAndUpdate(id, updatePayload, { new: true });
    if (!invoice) return null;

    if (data.status === 'Paid') {
      // 1. Ensure Payment record exists and is marked Paid
      const existingPay = await (PaymentModel as any).findOne({ invoiceId: invoice._id });
      if (existingPay) {
        existingPay.status = 'Paid';
        existingPay.amount = invoice.total;
        existingPay.paymentMethod = data.paymentMethod || existingPay.paymentMethod || 'Direct Escrow Settlement';
        existingPay.updatedAt = new Date();
        await existingPay.save();
      } else {
        await (PaymentModel as any).create({
          transactionId: `TX-SETTLE-${Date.now().toString().slice(-6)}`,
          invoiceId: invoice._id,
          userId: invoice.userId,
          customerName: invoice.customerName,
          customerEmail: invoice.customerEmail,
          amount: invoice.total,
          currency: invoice.currency || 'USD',
          status: 'Paid',
          paymentMethod: data.paymentMethod || 'Direct Escrow Settlement',
          notes: 'Settled by Flight Operations Admin in Mission Control',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 2. Confirm Booking
      await (BookingModel as any).findOneAndUpdate(
        { invoiceId: invoice._id },
        { status: 'Confirmed', paymentStatus: 'Paid', updatedAt: new Date() }
      );

      // 3. Notify Customer
      await (NotificationModel as any).create({
        userId: invoice.userId,
        recipientEmail: invoice.customerEmail,
        type: 'payment',
        title: 'Invoice Settlement Cleared',
        message: `Invoice ${invoice.invoiceNumber} ($${invoice.total.toLocaleString()}) has been marked as settled. Flight itinerary is confirmed.`,
        read: false,
        createdAt: new Date(),
      });
    }

    return invoice;
  }

  // ==========================================
  // PAYMENTS MANAGEMENT
  // ==========================================
  static async getPayments(page = 1, limit = 20, search?: string, status?: string) {
    if (!isMongoConnected()) {
      return { items: [], total: 0, page, limit, pages: 1 };
    }
    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ customerName: regex }, { customerEmail: regex }, { transactionId: regex }, { paymentMethod: regex }];
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      (PaymentModel as any).find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      (PaymentModel as any).countDocuments(query),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  static async getPaymentById(id: string) {
    if (!isMongoConnected()) return null;
    return await (PaymentModel as any).findById(id);
  }

  static async createPayment(data: any) {
    if (!isMongoConnected()) return data;
    const transactionId = `TX-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
    const fullData = { ...data, transactionId };
    const payment = await (PaymentModel as any).create(fullData);

    if (payment.status === 'Paid' && payment.invoiceId) {
      // Sync invoice
      await (InvoiceModel as any).findByIdAndUpdate(payment.invoiceId, {
        status: 'Paid',
        paidAt: new Date(),
        paymentMethod: payment.paymentMethod,
        updatedAt: new Date(),
      });

      // Sync booking
      await (BookingModel as any).findOneAndUpdate(
        { invoiceId: payment.invoiceId },
        { status: 'Confirmed', paymentStatus: 'Paid', updatedAt: new Date() }
      );
    }

    return payment;
  }

  // ==========================================
  // FLEET AIRCRAFT MANAGEMENT
  // ==========================================
  static async getAircraftList(category?: string, status?: string) {
    if (!isMongoConnected()) return [];
    const query: any = {};
    if (category && category !== 'ALL') query.category = category;
    if (status && status !== 'ALL') query.status = status;
    return await (AircraftModel as any).find(query).sort({ hourlyRate: -1 });
  }

  static async getAircraftById(id: string) {
    if (!isMongoConnected()) return null;
    return await (AircraftModel as any).findById(id);
  }

  static async createAircraft(data: any) {
    if (!isMongoConnected()) return data;
    return await (AircraftModel as any).create(data);
  }

  static async updateAircraft(id: string, data: any) {
    if (!isMongoConnected()) return null;
    return await (AircraftModel as any).findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteAircraft(id: string) {
    if (!isMongoConnected()) return null;
    return await (AircraftModel as any).findByIdAndDelete(id);
  }

  // ==========================================
  // AIRPORTS MANAGEMENT
  // ==========================================
  static async getAirportsList(search?: string, status?: string) {
    if (!isMongoConnected()) return [];
    const query: any = {};
    if (status && status !== 'ALL') query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ icao: regex }, { iata: regex }, { name: regex }, { city: regex }, { country: regex }];
    }
    return await (AirportModel as any).find(query).sort({ icao: 1 });
  }

  static async getAirportById(id: string) {
    if (!isMongoConnected()) return null;
    return await (AirportModel as any).findById(id);
  }

  static async createAirport(data: any) {
    if (!isMongoConnected()) return data;
    return await (AirportModel as any).create(data);
  }

  static async updateAirport(id: string, data: any) {
    if (!isMongoConnected()) return null;
    return await (AirportModel as any).findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteAirport(id: string) {
    if (!isMongoConnected()) return null;
    return await (AirportModel as any).findByIdAndDelete(id);
  }

  // ==========================================
  // PRICING ENGINE & RULES
  // ==========================================
  static async getPricingRules() {
    if (!isMongoConnected()) {
      return {
        jetFuelPricePerGal: 0,
        fuelSurchargePercent: 12,
        jetFuelSource: 'JetFuelX Live Contract API',
        defaultMarkupPercent: 14,
        navigationFeePerNm: 1.45,
        crewDailyRate: 1800,
        overnightFee: 1200,
        cateringStandardFee: 850,
        internationalPermitFee: 950,
        taxesPercent: 7.5,
        updatedAt: new Date(),
      };
    }
    const rules = await (PricingRuleModel as any).findOne();
    if (rules) return rules;
    return {
      jetFuelPricePerGal: 0,
      fuelSurchargePercent: 12,
      jetFuelSource: 'JetFuelX Live Contract API',
      defaultMarkupPercent: 14,
      navigationFeePerNm: 1.45,
      crewDailyRate: 1800,
      overnightFee: 1200,
      cateringStandardFee: 850,
      internationalPermitFee: 950,
      taxesPercent: 7.5,
      updatedAt: new Date(),
    };
  }

  static async updatePricingRules(data: any) {
    if (!isMongoConnected()) return data;
    return await (PricingRuleModel as any).findOneAndUpdate({}, data, { new: true, upsert: true });
  }

  // ==========================================
  // PAYLA FORENSIC & AML SENTINEL
  // ==========================================
  static async getForensicCases() {
    if (!isMongoConnected()) return [];
    return await (PaylaForensicCaseModel as any).find().sort({ createdAt: -1 });
  }

  static async updateForensicCase(id: string, data: any) {
    if (!isMongoConnected()) return null;
    return await (PaylaForensicCaseModel as any).findByIdAndUpdate(id, data, { new: true });
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  static async getNotifications(role = 'admin') {
    if (!isMongoConnected()) return [];
    return await (NotificationModel as any).find({
      recipientRole: { $in: [role, 'all'] },
    }).sort({ createdAt: -1 }).limit(50);
  }

  static async markNotificationRead(id: string) {
    if (!isMongoConnected()) return null;
    return await (NotificationModel as any).findByIdAndUpdate(id, { read: true }, { new: true });
  }

  static async markAllNotificationsRead() {
    if (!isMongoConnected()) return { acknowledged: true };
    return await (NotificationModel as any).updateMany({ recipientRole: 'admin' }, { read: true });
  }

  // ==========================================
  // AUDIT LOGS
  // ==========================================
  static async getAuditLogs(page = 1, limit = 50, category?: string, search?: string) {
    if (!isMongoConnected()) {
      return { items: [], total: 0, page, limit, pages: 1 };
    }
    const query: any = {};
    if (category && category !== 'ALL') query.category = category;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ action: regex }, { user: regex }, { recordRef: regex }, { details: regex }];
    }
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      (AuditLogModel as any).find(query).sort({ timestamp: -1 }).skip(skip).limit(limit),
      (AuditLogModel as any).countDocuments(query),
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // ==========================================
  // SETTINGS
  // ==========================================
  static async getSettings() {
    if (!isMongoConnected()) {
      return {
        companyName: 'Fly Ayla Private Aviation',
        supportEmail: 'concierge@flyayla.com',
        primaryCurrency: 'USD',
        autoQuoteEnabled: true,
      };
    }
    const settings = await (AdminSettingModel as any).find();
    const mapped: Record<string, any> = {};
    settings.forEach((s: any) => {
      mapped[s.key] = s.value;
    });
    return mapped;
  }

  static async updateSettings(settingsObj: Record<string, any>, updatedBy = 'Admin') {
    if (!isMongoConnected()) return settingsObj;
    const promises = Object.entries(settingsObj).map(([key, value]) =>
      (AdminSettingModel as any).findOneAndUpdate({ key }, { key, value, updatedBy }, { upsert: true, new: true })
    );
    await Promise.all(promises);
    return settingsObj;
  }

  // Seed method to populate initial fleet and airports if empty
  static async seedFleetAndAirports(fleetList: any[], airportList: any[]) {
    try {
      if (!isMongoConnected()) return;
      const acCount = await (AircraftModel as any).countDocuments();
      if (acCount === 0 && fleetList.length > 0) {
        await (AircraftModel as any).insertMany(fleetList);
        console.log(`✈️ [Database] Seeded ${fleetList.length} Aircraft into MongoDB`);
      }

      const aptCount = await (AirportModel as any).countDocuments();
      if (aptCount === 0 && airportList.length > 0) {
        await (AirportModel as any).insertMany(airportList);
        console.log(`🌍 [Database] Seeded ${airportList.length} Global Airports into MongoDB`);
      }
    } catch (err: any) {
      console.error('Seed Fleet/Airports error:', err.message);
    }
  }
}
