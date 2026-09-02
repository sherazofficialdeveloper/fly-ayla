import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { InvoiceModel } from '../models/Invoice';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';
import { isMongoConnected } from '../config/database';

export class InvoiceController {
  static async getMy(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      if (!isMongoConnected()) {
        ApiResponse.success(res, { invoices: [], total: 0 }, 'Invoices retrieved.');
        return;
      }

      const invoices = await (InvoiceModel as any)
        .find({
          $or: [{ userId: user.id }, { customerEmail: user.email.toLowerCase() }],
        })
        .sort({ createdAt: -1 });

      ApiResponse.success(res, { invoices, total: invoices.length }, 'Invoices retrieved.');
    } catch (error: any) {
      Logger.error('Get Invoices Error', error);
      ApiResponse.error(res, 'Failed to retrieve invoices.', 500);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      const invoice = await (InvoiceModel as any).findById(id);

      if (!invoice) {
        ApiResponse.error(res, 'Invoice not found.', 404);
        return;
      }

      const isOwner =
        invoice.userId?.toString() === user.id ||
        invoice.customerEmail?.toLowerCase() === user.email.toLowerCase();
      const isAdmin = user.role === 'admin';

      if (!isOwner && !isAdmin) {
        ApiResponse.error(res, 'Unauthorized: You do not have permission to view this invoice.', 403);
        return;
      }

      ApiResponse.success(res, { invoice }, 'Invoice retrieved.');
    } catch (error: any) {
      Logger.error('Get Invoice By ID Error', error);
      ApiResponse.error(res, 'Failed to retrieve invoice.', 500);
    }
  }
}
