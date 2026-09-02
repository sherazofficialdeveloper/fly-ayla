import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { BookingModel } from '../models/Booking';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';
import { isMongoConnected } from '../config/database';

export class BookingController {
  static async getMy(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      if (!isMongoConnected()) {
        ApiResponse.success(res, { bookings: [], total: 0 }, 'Bookings retrieved.');
        return;
      }

      const bookings = await (BookingModel as any)
        .find({
          $or: [{ userId: user.id }, { customerEmail: user.email.toLowerCase() }],
        })
        .sort({ createdAt: -1 });

      ApiResponse.success(res, { bookings, total: bookings.length }, 'Bookings retrieved.');
    } catch (error: any) {
      Logger.error('Get Bookings Error', error);
      ApiResponse.error(res, 'Failed to retrieve bookings.', 500);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      const booking = await (BookingModel as any).findById(id);

      if (!booking) {
        ApiResponse.error(res, 'Booking not found.', 404);
        return;
      }

      const isOwner =
        booking.userId?.toString() === user.id ||
        booking.customerEmail?.toLowerCase() === user.email.toLowerCase();
      const isAdmin = user.role === 'admin';

      if (!isOwner && !isAdmin) {
        ApiResponse.error(res, 'Unauthorized: You do not have permission to view this booking.', 403);
        return;
      }

      ApiResponse.success(res, { booking }, 'Booking details retrieved.');
    } catch (error: any) {
      Logger.error('Get Booking By ID Error', error);
      ApiResponse.error(res, 'Failed to retrieve booking.', 500);
    }
  }
}
