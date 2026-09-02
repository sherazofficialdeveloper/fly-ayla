import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for authenticated user from MongoDB
 * @access  Private
 */
router.get('/', authenticate, NotificationController.getMy);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark specific notification as read in MongoDB
 * @access  Private
 */
router.patch('/:id/read', authenticate, NotificationController.markAsRead);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all user notifications as read in MongoDB
 * @access  Private
 */
router.patch('/read-all', authenticate, NotificationController.markAllAsRead);

export const notificationRoutes = router;
