import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { BookingController } from '../controllers/booking.controller';

const router = Router();

/**
 * @route   GET /api/bookings & /api/bookings/my
 * @desc    Get all bookings for authenticated customer from MongoDB
 * @access  Private
 */
router.get('/', authenticate, BookingController.getMy);
router.get('/my', authenticate, BookingController.getMy);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get booking details with ownership check from MongoDB
 * @access  Private
 */
router.get('/:id', authenticate, BookingController.getById);

export const bookingRoutes = router;
