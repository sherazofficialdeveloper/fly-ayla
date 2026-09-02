import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { PaymentController } from '../controllers/payment.controller';

const router = Router();

/**
 * @route   GET /api/payments & /api/payments/my
 * @desc    Get all payments for authenticated customer from MongoDB
 * @access  Private
 */
router.get('/', authenticate, PaymentController.getMy);
router.get('/my', authenticate, PaymentController.getMy);

/**
 * @route   GET /api/payments/invoice/:invoiceId/status
 * @desc    Check payment and settlement status for an invoice
 * @access  Private
 */
router.get('/invoice/:invoiceId/status', authenticate, PaymentController.getInvoicePaymentStatus);

/**
 * @route   POST /api/payments/:id/refund
 * @desc    Process refund for a settled payment (Admin only)
 * @access  Private (Admin)
 */
router.post('/:id/refund', authenticate, requireRole('admin'), PaymentController.refundPayment);

/**
 * @route   POST /api/payments/checkout & /api/payments/checkout-session
 * @desc    Initiate a settlement session for an invoice
 * @access  Private
 */
router.post('/checkout', authenticate, PaymentController.createCheckoutSession);
router.post('/checkout-session', authenticate, PaymentController.createCheckoutSession);

/**
 * @route   GET /api/payments/:id
 * @desc    Get single payment record with IDOR verification
 * @access  Private
 */
router.get('/:id', authenticate, PaymentController.getById);

export const paymentRoutes = router;
