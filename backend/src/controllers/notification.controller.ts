import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { NotificationModel } from '../models/Notification';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';
import { isMongoConnected } from '../config/database';

export class NotificationController {
  static async getMy(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      if (!isMongoConnected()) {
        ApiResponse.success(
          res,
          {
            notifications: [],
            unreadCount: 0,
          },
          'Notifications retrieved.'
        );
        return;
      }

      const notifications = await (NotificationModel as any)
        .find({
          $or: [{ userId: user.id }, { recipientEmail: user.email.toLowerCase() }],
        })
        .sort({ createdAt: -1 })
        .limit(50);

      ApiResponse.success(
        res,
        {
          notifications,
          unreadCount: notifications.filter((n: any) => !n.read && !n.isRead).length,
        },
        'Notifications retrieved.'
      );
    } catch (error: any) {
      Logger.error('Get Notifications Error', error);
      ApiResponse.error(res, 'Failed to retrieve notifications.', 500);
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      await (NotificationModel as any).findOneAndUpdate(
        {
          _id: id,
          $or: [{ userId: user.id }, { recipientEmail: user.email.toLowerCase() }],
        },
        { read: true, isRead: true }
      );

      ApiResponse.success(res, null, 'Notification marked as read.');
    } catch (error: any) {
      Logger.error('Mark Read Error', error);
      ApiResponse.error(res, 'Failed to update notification.', 500);
    }
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;

      await (NotificationModel as any).updateMany(
        {
          $or: [{ userId: user.id }, { recipientEmail: user.email.toLowerCase() }],
        },
        { read: true, isRead: true }
      );

      ApiResponse.success(res, null, 'All notifications marked as read.');
    } catch (error: any) {
      Logger.error('Mark All Read Error', error);
      ApiResponse.error(res, 'Failed to mark notifications as read.', 500);
    }
  }
}
