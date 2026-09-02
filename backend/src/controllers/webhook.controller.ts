import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { PaymentModel } from '../models/Payment';
import { InvoiceModel } from '../models/Invoice';
import { BookingModel } from '../models/Booking';
import { NotificationModel } from '../models/Notification';
import { PaymentGatewayService } from '../services/integrations/paymentGateway.service';
import { AdminDataService } from '../services/adminData.service';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';
import { isMongoConnected } from '../config/database';

export class WebhookController {
  static async handlePaymentWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = (
        req.headers['stripe-signature'] ||
        req.headers['x-gateway-signature'] ||
        req.headers['x-webhook-signature'] ||
        req.headers['x-signature']
      ) as string | undefined;

      const timestamp = (
        req.headers['x-timestamp'] ||
        req.headers['stripe-timestamp']
      ) as string | undefined;

      const body = req.body;

      if (!body) {
        ApiResponse.error(res, 'Missing webhook payload.', 400);
        return;
      }

      const isValid = PaymentGatewayService.verifyWebhookSignature(body, signature, undefined, timestamp);
      if (!isValid) {
        ApiResponse.error(res, 'Invalid webhook signature.', 400);
        return;
      }

      // Normalize webhook payload fields across Stripe standard and direct gateway schemas
      let invoiceId = body.invoiceId;
      let transactionId = body.transactionId || body.id;
      let status = body.status;
      let amount = body.amount;
      let currency = body.currency || 'USD';
      let paymentMethod = body.paymentMethod || 'Credit Card / Gateway';

      // Stripe event parsing support
      if (body.type && body.data?.object) {
        const obj = body.data.object;
        transactionId = obj.id;
        invoiceId = obj.metadata?.invoiceId || obj.client_reference_id || obj.description?.match(/INV-[A-Za-z0-9-]+/)?.[0];
        amount = obj.amount ? obj.amount / (obj.currency?.toLowerCase() === 'usd' ? 100 : 1) : undefined;
        currency = obj.currency?.toUpperCase() || 'USD';
        paymentMethod = obj.payment_method_types?.[0] ? `Stripe (${obj.payment_method_types[0]})` : 'Stripe Online Checkout';
        
        if (body.type === 'payment_intent.succeeded' || body.type === 'checkout.session.completed' || body.type === 'charge.succeeded') {
          status = 'succeeded';
        } else if (body.type === 'payment_intent.payment_failed' || body.type === 'charge.failed') {
          status = 'failed';
        }
      }

      if (!invoiceId) {
        ApiResponse.error(res, 'Webhook payload missing invoice identifier.', 400);
        return;
      }

      let invoice = null;
      if (isMongoConnected()) {
        const query: any[] = [{ invoiceNumber: invoiceId }];
        if (mongoose.isValidObjectId(invoiceId)) {
          query.push({ _id: invoiceId });
        }
        invoice = await (InvoiceModel as any).findOne({ $or: query });
      }

      if (!invoice) {
        ApiResponse.error(res, 'Invoice not found for webhook settlement.', 404);
        return;
      }

      // Idempotency: If invoice is already paid, return early to prevent duplicate processing
      if (invoice.status === 'Paid') {
        Logger.info(`Webhook event ignored: Invoice ${invoice.invoiceNumber} is already marked as Paid.`);
        ApiResponse.success(res, { processed: false, reason: 'ALREADY_SETTLED' }, 'Invoice is already settled.');
        return;
      }

      let isSuccessful =
        status === 'succeeded' ||
        status === 'paid' ||
        status === 'COMPLETED' ||
        status === 'Paid' ||
        status === 'SUCCESS';

      // Currency mismatch validation guard
      if (currency && invoice.currency && currency.toUpperCase() !== invoice.currency.toUpperCase()) {
        Logger.warn(
          `Currency mismatch detected for invoice ${invoice.invoiceNumber}: received ${currency}, required ${invoice.currency}`
        );
        isSuccessful = false;
      }

      // Underpayment validation guard
      if (amount !== undefined && Number(amount) < Number(invoice.total)) {
        Logger.warn(
          `Underpayment detected for invoice ${invoice.invoiceNumber}: received ${amount} ${currency}, required ${invoice.total} ${invoice.currency}`
        );
        isSuccessful = false;
      }

      const finalPaymentStatus = isSuccessful ? 'Paid' : 'Failed';
      const resolvedTxId = transactionId || `TX-WH-${Date.now()}`;
      const finalAmount = amount || invoice.total;

      // 1. Update or Create Payment record in MongoDB
      let payment = await (PaymentModel as any).findOne({
        $or: [{ transactionId: resolvedTxId }, { invoiceId: invoice._id, status: 'Pending' }],
      });

      if (payment) {
        payment.status = finalPaymentStatus;
        payment.amount = finalAmount;
        payment.paymentMethod = paymentMethod || payment.paymentMethod || 'Credit Card / Wire';
        payment.updatedAt = new Date();
        await payment.save();
      } else {
        payment = await (PaymentModel as any).create({
          transactionId: resolvedTxId,
          invoiceId: invoice._id,
          userId: invoice.userId,
          customerName: invoice.customerName,
          customerEmail: invoice.customerEmail,
          amount: finalAmount,
          currency: currency || invoice.currency || 'USD',
          status: finalPaymentStatus,
          paymentMethod: paymentMethod || 'Direct Settlement',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      if (isSuccessful) {
        // 2. Settle Invoice in MongoDB
        invoice.status = 'Paid';
        invoice.paidAt = new Date();
        invoice.paymentMethod = payment.paymentMethod;
        invoice.updatedAt = new Date();
        await invoice.save();

        // 3. Confirm Booking Record in MongoDB (Lookup by invoiceId or quoteId, or create if missing)
        let booking = await (BookingModel as any).findOne({
          $or: [{ invoiceId: invoice._id }, ...(invoice.quoteId ? [{ quoteId: invoice.quoteId }] : [])],
        });

        if (booking) {
          booking.status = 'Confirmed';
          booking.paymentStatus = 'Paid';
          booking.invoiceId = invoice._id;
          booking.updatedAt = new Date();
          await booking.save();
        } else {
          const bookingReference = `AYLA-BK-${Date.now().toString().slice(-4)}`;
          const pnr = `AY${Date.now().toString().slice(-4)}VIP`;
          booking = await (BookingModel as any).create({
            bookingReference,
            pnr,
            invoiceId: invoice._id,
            quoteId: invoice.quoteId,
            userId: invoice.userId,
            customerName: invoice.customerName,
            customerEmail: invoice.customerEmail,
            customerPhone: invoice.customerPhone || '+1 (555) 019-2831',
            routeSummary: invoice.routeSummary,
            departureDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
            departureTime: '11:00 UTC',
            aircraftName: invoice.aircraftName,
            aircraftCategory: 'Heavy Jet',
            passengersCount: 6,
            captainName: 'Capt. Tariq Vance',
            firstOfficerName: 'FO Claire Bennet',
            fboTerminal: 'Executive VIP Aviation Terminal Gate 1',
            cateringDetails: 'Michelin Star Gourmet Service & Vintage Champagne',
            status: 'Confirmed',
            paymentStatus: 'Paid',
            totalAmount: invoice.total,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // 4. Create Notification for Customer
        await (NotificationModel as any).create({
          userId: invoice.userId,
          recipientEmail: invoice.customerEmail,
          type: 'booking',
          title: 'Charter Settlement Confirmed',
          message: `Your payment of $${invoice.total.toLocaleString()} for Invoice ${invoice.invoiceNumber} has settled. Flight itinerary is confirmed.`,
          read: false,
          createdAt: new Date(),
        });

        // 5. Create Notification for Flight Ops Admin
        await (NotificationModel as any).create({
          recipientRole: 'admin',
          type: 'payment',
          title: 'Charter Escrow Settlement Cleared',
          message: `Invoice ${invoice.invoiceNumber} ($${invoice.total.toLocaleString()}) paid by ${invoice.customerName}. Booking ${booking?.bookingReference || 'confirmed'} ready for dispatch.`,
          read: false,
          createdAt: new Date(),
        });

        // 6. Record Audit Log in MongoDB
        await AdminDataService.logAction({
          action: `Settled invoice ${invoice.invoiceNumber} ($${invoice.total.toLocaleString()}) via verified payment gateway webhook (${resolvedTxId})`,
          user: 'Payment Gateway Webhook',
          role: 'SYSTEM',
          category: 'PAYMENT',
          recordRef: invoice.invoiceNumber,
          status: 'SUCCESS',
          ipAddress: req.ip,
        });

        Logger.info(`Payment webhook succeeded for invoice ${invoice.invoiceNumber}`);
      } else {
        // Payment failed notification & audit log
        await (NotificationModel as any).create({
          userId: invoice.userId,
          recipientEmail: invoice.customerEmail,
          type: 'payment',
          title: 'Payment Settlement Failed',
          message: `Payment attempt for Invoice ${invoice.invoiceNumber} could not be completed. Please retry or contact dispatch.`,
          read: false,
          createdAt: new Date(),
        });

        await AdminDataService.logAction({
          action: `Payment failed for invoice ${invoice.invoiceNumber} via webhook (${resolvedTxId})`,
          user: 'Payment Gateway Webhook',
          role: 'SYSTEM',
          category: 'PAYMENT',
          recordRef: invoice.invoiceNumber,
          status: 'FAILURE',
          ipAddress: req.ip,
        });
      }

      ApiResponse.success(res, { processed: true, status: finalPaymentStatus, transactionId: resolvedTxId }, 'Payment webhook processed.');
    } catch (error: any) {
      Logger.error('Payment Webhook Error', error);
      ApiResponse.error(res, 'Webhook processing error.', 500);
    }
  }
}

