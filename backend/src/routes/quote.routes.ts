import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { QuoteController } from '../controllers/quote.controller';

const router = Router();

/**
 * @route   GET /api/quotes & /api/quotes/my
 * @desc    Get all quotes for authenticated customer from MongoDB
 * @access  Private
 */
router.get('/', authenticate, QuoteController.getMy);
router.get('/my', authenticate, QuoteController.getMy);

/**
 * @route   GET /api/quotes/:id
 * @desc    Get quote by ID with strict ownership validation from MongoDB
 * @access  Private
 */
router.get('/:id', authenticate, QuoteController.getById);

/**
 * @route   PATCH /api/quotes/:id/approve & POST /api/quotes/:id/approve
 * @desc    Customer approves quotation -> Generates commercial invoice and booking workflow in MongoDB
 * @access  Private
 */
router.patch('/:id/approve', authenticate, QuoteController.approve);
router.post('/:id/approve', authenticate, QuoteController.approve);

/**
 * @route   PATCH /api/quotes/:id/reject & POST /api/quotes/:id/reject
 * @desc    Customer rejects quotation in MongoDB
 * @access  Private
 */
router.patch('/:id/reject', authenticate, QuoteController.reject);
router.post('/:id/reject', authenticate, QuoteController.reject);

export const quoteRoutes = router;
