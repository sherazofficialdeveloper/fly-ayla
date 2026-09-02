import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router = Router();

/**
 * @route   POST /api/webhooks/payment
 * @desc    Receive and process asynchronous payment gateway webhook events in MongoDB
 * @access  Public (Signature-Verified)
 */
router.post('/payment', WebhookController.handlePaymentWebhook);

export const webhookRoutes = router;
