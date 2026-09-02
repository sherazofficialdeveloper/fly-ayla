import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { InvoiceController } from '../controllers/invoice.controller';

const router = Router();

/**
 * @route   GET /api/invoices & /api/invoices/my
 * @desc    Get all invoices for authenticated customer from MongoDB
 * @access  Private
 */
router.get('/', authenticate, InvoiceController.getMy);
router.get('/my', authenticate, InvoiceController.getMy);

/**
 * @route   GET /api/invoices/:id
 * @desc    Get invoice details with ownership check from MongoDB
 * @access  Private
 */
router.get('/:id', authenticate, InvoiceController.getById);

export const invoiceRoutes = router;
