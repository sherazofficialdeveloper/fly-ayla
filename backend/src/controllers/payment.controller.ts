import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { PaymentModel } from '../models/Payment';
import { InvoiceModel } from '../models/Invoice';
import { BookingModel } from '../models/Booking';
import { PaymentGatewayService } from '../services/integrations/paymentGateway.service';
import { AdminDataService } from '../services/adminData.service';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';
import { isMongoConnected } from '../config/database';

export class PaymentController {
  static async getMy(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      if (!isMongoConnected()) {
        ApiResponse.success(res, { payments: [], total: 0 }, 'Payments retrieved.');
        return;
      }

      const payments = await (PaymentModel as any)
        .find({
          $or: [{ userId: user.id }, { customerEmail: user.email.toLowerCase() }],
        })
        .sort({ createdAt: -1 });

      ApiResponse.success(res, { payments, total: payments.length }, 'Payments retrieved.');
    } catch (error: any) {
      Logger.error('Get Payments Error', error);
      ApiResponse.error(res, 'Failed to retrieve payment records.', 500);
    }
  }

  static async createCheckoutSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { invoiceId, paymentMethod } = req.body;
      const user = req.user!;

      if (!invoiceId) {
        ApiResponse.error(res, 'Invoice ID is required.', 400);
        return;
      }

      let invoice: any = null;
      if (isMongoConnected()) {
        const query: any[] = [{ invoiceNumber: invoiceId }];
        if (mongoose.isValidObjectId(invoiceId)) {
          query.push({ _id: invoiceId });
        }
        invoice = await (InvoiceModel as any).findOne({ $or: query });
      }

      if (!invoice) {
        ApiResponse.error(res, 'Invoice record not found.', 404);
        return;
      }

      // IDOR validation: user must own the invoice or be an admin
      const isOwner =
        invoice.userId?.toString() === user.id ||
        invoice.customerEmail?.toLowerCase() === user.email.toLowerCase();
      const isAdmin = user.role === 'admin';

      if (!isOwner && !isAdmin) {
        ApiResponse.error(res, 'Unauthorized: You do not have permission to pay this invoice.', 403);
        return;
      }

      // Prevent paying already settled invoices
      if (invoice.status === 'Paid') {
        ApiResponse.error(res, 'This commercial invoice has already been settled.', 400);
        return;
      }

      const booking = await (BookingModel as any).findOne({ invoiceId: invoice._id });

      const session = await PaymentGatewayService.createPaymentSession({
        amount: invoice.total,
        currency: invoice.currency || 'USD',
        invoiceId: invoice._id.toString(),
        bookingId: booking?._id?.toString(),
        customerEmail: invoice.customerEmail,
        customerName: invoice.customerName,
      });

      // Record / track pending payment initiation in MongoDB
      const existingPending = await (PaymentModel as any).findOne({
        invoiceId: invoice._id,
        status: 'Pending',
      });

      if (!existingPending) {
        await (PaymentModel as any).create({
          transactionId: session.transactionId,
          invoiceId: invoice._id,
          bookingId: booking?._id,
          userId: invoice.userId || user.id,
          customerName: invoice.customerName,
          customerEmail: invoice.customerEmail,
          amount: invoice.total,
          currency: invoice.currency || 'USD',
          status: 'Pending',
          paymentMethod: paymentMethod || (session.gateway === 'STRIPE' ? 'Credit Card / Stripe' : 'Swift Bank Wire / Escrow'),
          gatewayReference: session.clientSecret || session.transactionId,
          notes: session.instructions || '',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await AdminDataService.logAction({
        action: `Initiated checkout session for Invoice ${invoice.invoiceNumber} ($${invoice.total.toLocaleString()})`,
        user: user.fullName,
        userEmail: user.email,
        userId: user.id,
        role: user.role === 'admin' ? 'Admin' : 'Customer',
        category: 'PAYMENT',
        recordRef: invoice.invoiceNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      ApiResponse.success(res, session, 'Payment checkout session initialized.');
    } catch (error: any) {
      Logger.error('Create Checkout Session Error', error);
      ApiResponse.error(res, 'Failed to initialize payment checkout session.', 500);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      if (!isMongoConnected()) {
        ApiResponse.error(res, 'Payment record not found.', 404);
        return;
      }

      const query: any[] = [{ transactionId: id }];
      if (mongoose.isValidObjectId(id)) {
        query.push({ _id: id });
      }
      const payment = await (PaymentModel as any).findOne({ $or: query });
      if (!payment) {
        ApiResponse.error(res, 'Payment record not found.', 404);
        return;
      }

      const isOwner =
        payment.userId?.toString() === user.id ||
        payment.customerEmail?.toLowerCase() === user.email.toLowerCase();
      const isAdmin = user.role === 'admin';

      if (!isOwner && !isAdmin) {
        ApiResponse.error(res, 'Unauthorized: You do not have permission to view this payment record.', 403);
        return;
      }

      ApiResponse.success(res, { payment }, 'Payment record retrieved.');
    } catch (error: any) {
      Logger.error('Get Payment By ID Error', error);
      ApiResponse.error(res, 'Failed to retrieve payment record.', 500);
    }
  }

  static async getInvoicePaymentStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { invoiceId } = req.params;
      const user = req.user!;

      if (!isMongoConnected()) {
        ApiResponse.error(res, 'Invoice not found.', 404);
        return;
      }

      const query: any[] = [{ invoiceNumber: invoiceId }];
      if (mongoose.isValidObjectId(invoiceId)) {
        query.push({ _id: invoiceId });
      }
      const invoice = await (InvoiceModel as any).findOne({ $or: query });

      if (!invoice) {
        ApiResponse.error(res, 'Invoice not found.', 404);
        return;
      }

      const isOwner =
        invoice.userId?.toString() === user.id ||
        invoice.customerEmail?.toLowerCase() === user.email.toLowerCase();
      const isAdmin = user.role === 'admin';

      if (!isOwner && !isAdmin) {
        ApiResponse.error(res, 'Unauthorized: Access denied.', 403);
        return;
      }

      const payment = await (PaymentModel as any)
        .findOne({ invoiceId: invoice._id })
        .sort({ createdAt: -1 });

      const booking = await (BookingModel as any).findOne({ invoiceId: invoice._id });

      ApiResponse.success(
        res,
        {
          invoiceId: invoice._id,
          invoiceNumber: invoice.invoiceNumber,
          invoiceStatus: invoice.status,
          total: invoice.total,
          currency: invoice.currency,
          payment: payment || null,
          booking: booking || null,
          isSettled: invoice.status === 'Paid',
        },
        'Payment status retrieved.'
      );
    } catch (error: any) {
      Logger.error('Get Invoice Payment Status Error', error);
      ApiResponse.error(res, 'Failed to fetch payment status.', 500);
    }
  }

  static async refundPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason, amount } = req.body;
      const user = req.user!;

      if (user.role !== 'admin') {
        ApiResponse.error(res, 'Unauthorized: Only flight operations administrators can initiate refunds.', 403);
        return;
      }

      const payment = await (PaymentModel as any).findById(id);
      if (!payment) {
        ApiResponse.error(res, 'Payment record not found.', 404);
        return;
      }

      if (payment.status !== 'Paid') {
        ApiResponse.error(res, 'Only settled payments can be refunded.', 400);
        return;
      }

      const refundResult = await PaymentGatewayService.refundPayment(
        payment.transactionId,
        amount || payment.amount,
        reason
      );

      if (!refundResult.success) {
        ApiResponse.error(res, refundResult.message || 'Refund processing failed.', 400);
        return;
      }

      payment.status = 'Refunded';
      payment.notes = `Refunded: ${reason || 'Customer requested settlement reversal'} (Refund Ref: ${refundResult.refundId})`;
      payment.updatedAt = new Date();
      await payment.save();

      if (payment.invoiceId) {
        await (InvoiceModel as any).findByIdAndUpdate(payment.invoiceId, {
          status: 'Cancelled',
          notes: `Settlement refunded: ${reason || 'Escrow refunded'}`,
          updatedAt: new Date(),
        });
      }

      if (payment.bookingId) {
        await (BookingModel as any).findByIdAndUpdate(payment.bookingId, {
          status: 'Cancelled',
          paymentStatus: 'Refunded',
          updatedAt: new Date(),
        });
      }

      await AdminDataService.logAction({
        action: `Processed refund of $${(amount || payment.amount).toLocaleString()} for payment ${payment.transactionId}`,
        user: user.fullName,
        userEmail: user.email,
        userId: user.id,
        role: 'Admin',
        category: 'PAYMENT',
        recordRef: payment.transactionId,
        status: 'WARNING',
        ipAddress: req.ip,
      });

      ApiResponse.success(
        res,
        { payment, refund: refundResult },
        'Payment refunded and itinerary records updated.'
      );
    } catch (error: any) {
      Logger.error('Refund Payment Error', error);
      ApiResponse.error(res, 'Failed to process refund.', 500);
    }
  }
}

