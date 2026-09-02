import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { FlightRequestController } from '../controllers/flightRequest.controller';

const router = Router();

/**
 * @route   POST /api/flight-requests
 * @desc    Create a new customer flight request in MongoDB
 * @access  Private / Authenticated
 */
router.post('/', authenticate, FlightRequestController.create);

/**
 * @route   GET /api/flight-requests & /api/flight-requests/my
 * @desc    Get all flight requests for authenticated customer (Strict Ownership)
 * @access  Private
 */
router.get('/', authenticate, FlightRequestController.getMy);
router.get('/my', authenticate, FlightRequestController.getMy);

/**
 * @route   GET /api/flight-requests/:id
 * @desc    Get flight request details with ownership check
 * @access  Private
 */
router.get('/:id', authenticate, FlightRequestController.getById);

export const flightRequestRoutes = router;
