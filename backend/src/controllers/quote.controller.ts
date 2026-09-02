import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { QuoteModel } from '../models/Quote';
import { InvoiceModel } from '../models/Invoice';
import { BookingModel } from '../models/Booking';
import { NotificationModel } from '../models/Notification';
import { AdminDataService } from '../services/adminData.service';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';
import { isMongoConnected } from '../config/database';

export class QuoteController {
  static async getMy(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      if (!isMongoConnected()) {
        ApiResponse.success(res, { quotes: [], total: 0 }, 'Quotations fetched.');
        return;
      }

      const quotes = await (QuoteModel as any)
        .find({
          $or: [{ userId: user.id }, { customerEmail: user.email.toLowerCase() }],
        })
        .sort({ createdAt: -1 });

      ApiResponse.success(res, { quotes, total: quotes.length }, 'Quotations fetched.');
    } catch (error: any) {
      Logger.error('Get Quotes Error', error);
      ApiResponse.error(res, 'Failed to retrieve quotations.', 500);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      if (!isMongoConnected() || !mongoose.isValidObjectId(id)) {
        ApiResponse.error(res, 'Charter quotation not found.', 404);
        return;
      }

      const quote = await (QuoteModel as any).findById(id);

      if (!quote) {
        ApiResponse.error(res, 'Charter quotation not found.', 404);
        return;
      }

      const isOwner =
        quote.userId?.toString() === user.id ||
        quote.customerEmail?.toLowerCase() === user.email.toLowerCase();
      const isAdmin = user.role === 'admin';

      if (!isOwner && !isAdmin) {
        ApiResponse.error(res, 'Unauthorized: You do not have permission to view this quotation.', 403);
        return;
      }

      ApiResponse.success(res, { quote }, 'Quotation retrieved.');
    } catch (error: any) {
      Logger.error('Get Quote By ID Error', error);
      ApiResponse.error(res, 'Failed to fetch quotation details.', 500);
    }
  }

  static async approve(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      if (!isMongoConnected() || !mongoose.isValidObjectId(id)) {
        ApiResponse.error(res, 'Quotation not found.', 404);
        return;
      }

      const quote = await (QuoteModel as any).findById(id);

      if (!quote) {
        ApiResponse.error(res, 'Quotation not found.', 404);
        return;
      }

      const isOwner =
        quote.userId?.toString() === user.id ||
        quote.customerEmail?.toLowerCase() === user.email.toLowerCase();

      if (!isOwner && user.role !== 'admin') {
        ApiResponse.error(res, 'Unauthorized: You cannot approve this quotation.', 403);
        return;
      }

      // Check if quote has been rejected
      if (quote.status === 'Rejected') {
        ApiResponse.error(res, 'This quotation has been declined and cannot be approved.', 400);
        return;
      }

      // Check if quote has expired
      if (quote.expiresAt && new Date(quote.expiresAt).getTime() < Date.now()) {
        ApiResponse.error(
          res,
          'This quotation has expired. Please contact Flight Operations to request an updated quotation.',
          400
        );
        return;
      }

      // Check if quote was already approved and invoice/booking exists (Idempotency)
      if (quote.status === 'Approved') {
        const existingInvoice = await (InvoiceModel as any).findOne({ quoteId: quote._id });
        const existingBooking = await (BookingModel as any).findOne({ quoteId: quote._id });
        if (existingInvoice) {
          ApiResponse.success(
            res,
            {
              quote,
              invoice: existingInvoice,
              booking: existingBooking,
            },
            'Quotation has already been approved and invoice issued.'
          );
          return;
        }
      }

      // 1. Update Quote Status
      quote.status = 'Approved';
      quote.updatedAt = new Date();
      await quote.save();

      // 2. Generate Commercial Invoice in MongoDB
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      const invoiceTotal = quote.costBreakdown?.quotedTotal || 48000;
      const subtotal = quote.costBreakdown?.subtotal || Math.round(invoiceTotal * 0.9);
      const tax = Math.round(subtotal * 0.05);
      const fees = Math.round(subtotal * 0.03);

      const invoiceData = {
        invoiceNumber,
        quoteId: quote._id,
        userId: quote.userId || user.id,
        customerName: quote.customerName,
        customerEmail: quote.customerEmail,
        customerPhone: quote.customerPhone || user.phone,
        companyName: quote.companyName || user.companyName,
        routeSummary: quote.routeSummary,
        aircraftName: quote.aircraftName,
        subtotal,
        tax,
        fees,
        total: invoiceTotal,
        currency: 'USD',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        status: 'Issued',
        notes: 'Commercial charter escrow settlement. Swift MT103 / Fedwire transfer.',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const invoice = await (InvoiceModel as any).create(invoiceData);

      // 3. Generate Booking Record in MongoDB
      const bookingReference = `AYLA-BK-${Date.now().toString().slice(-4)}`;
      const pnr = `AY${Date.now().toString().slice(-4)}VIP`;

      const bookingData = {
        bookingReference,
        pnr,
        quoteId: quote._id,
        invoiceId: invoice._id,
        userId: quote.userId || user.id,
        customerName: quote.customerName,
        customerEmail: quote.customerEmail,
        customerPhone: quote.customerPhone || user.phone,
        routeSummary: quote.routeSummary,
        departureDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        departureTime: '11:00 UTC',
        aircraftName: quote.aircraftName,
        aircraftCategory: quote.aircraftCategory || 'Heavy Jet',
        passengersCount: 6,
        captainName: 'Capt. Tariq Vance',
        firstOfficerName: 'FO Claire Bennet',
        fboTerminal: 'Executive VIP Aviation Terminal Gate 1',
        cateringDetails: 'Michelin Star Gourmet Service & Vintage Champagne',
        status: 'Pending',
        paymentStatus: 'Pending',
        totalAmount: invoiceTotal,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const booking = await (BookingModel as any).create(bookingData);

      invoice.bookingId = booking._id;
      await invoice.save();

      // 4. Notifications for Customer and Admin
      await (NotificationModel as any).create({
        userId: quote.userId || user.id,
        recipientEmail: quote.customerEmail,
        type: 'quote',
        title: 'Quote Approved & Commercial Invoice Issued',
        message: `Quote ${quote.quoteNumber} approved. Commercial invoice ${invoiceNumber} ($${invoiceTotal.toLocaleString()}) has been generated.`,
        read: false,
        createdAt: new Date(),
      });

      await (NotificationModel as any).create({
        recipientRole: 'admin',
        type: 'quote',
        title: 'Customer Approved Quotation',
        message: `${quote.customerName} approved Quote ${quote.quoteNumber}. Invoice ${invoiceNumber} issued for $${invoiceTotal.toLocaleString()}.`,
        read: false,
        createdAt: new Date(),
      });

      // 5. Log Action
      await AdminDataService.logAction({
        action: `Approved quote ${quote.quoteNumber} and issued invoice ${invoiceNumber} ($${invoiceTotal.toLocaleString()})`,
        user: quote.customerName,
        userEmail: quote.customerEmail,
        userId: user.id,
        role: 'Customer',
        category: 'QUOTE',
        recordRef: quote.quoteNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      Logger.info(`Quote approved: ${quote.quoteNumber}`);

      ApiResponse.success(
        res,
        {
          quote,
          invoice,
          booking,
        },
        'Quotation approved successfully. Commercial invoice and itinerary booking created in database.'
      );
    } catch (error: any) {
      Logger.error('Approve Quote Error', error);
      ApiResponse.error(res, 'Failed to approve quotation.', 500);
    }
  }

  static async reject(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      if (!isMongoConnected() || !mongoose.isValidObjectId(id)) {
        ApiResponse.error(res, 'Quotation not found.', 404);
        return;
      }

      const quote = await (QuoteModel as any).findById(id);

      if (!quote) {
        ApiResponse.error(res, 'Quotation not found.', 404);
        return;
      }

      const isOwner =
        quote.userId?.toString() === user.id ||
        quote.customerEmail?.toLowerCase() === user.email.toLowerCase();

      if (!isOwner && user.role !== 'admin') {
        ApiResponse.error(res, 'Unauthorized: You cannot reject this quotation.', 403);
        return;
      }

      if (quote.status === 'Approved') {
        ApiResponse.error(res, 'An approved quotation with an active itinerary cannot be rejected.', 400);
        return;
      }

      quote.status = 'Rejected';
      quote.updatedAt = new Date();
      await quote.save();

      await (NotificationModel as any).create({
        recipientRole: 'admin',
        type: 'quote',
        title: 'Quotation Declined',
        message: `${quote.customerName} declined Quote ${quote.quoteNumber}.`,
        read: false,
        createdAt: new Date(),
      });

      await AdminDataService.logAction({
        action: `Rejected quotation ${quote.quoteNumber}`,
        user: quote.customerName,
        userEmail: quote.customerEmail,
        userId: user.id,
        role: user.role === 'admin' ? 'Admin' : 'Customer',
        category: 'QUOTE',
        recordRef: quote.quoteNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, { quote }, 'Quotation rejected.');
    } catch (error: any) {
      Logger.error('Reject Quote Error', error);
      ApiResponse.error(res, 'Failed to reject quotation.', 500);
    }
  }
}

