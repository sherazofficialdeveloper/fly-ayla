import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { flightRequestRoutes } from './flightRequest.routes';
import { quoteRoutes } from './quote.routes';
import { bookingRoutes } from './booking.routes';
import { invoiceRoutes } from './invoice.routes';
import { paymentRoutes } from './payment.routes';
import { notificationRoutes } from './notification.routes';
import { airportRoutes } from './airport.routes';
import { pricingRoutes } from './pricing.routes';
import { userRoutes } from './user.routes';
import { webhookRoutes } from './webhook.routes';
import { adminRoutes } from './admin.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/flight-requests', flightRequestRoutes);
apiRouter.use('/quotes', quoteRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/invoices', invoiceRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/airports', airportRoutes);
apiRouter.use('/pricing', pricingRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/webhooks', webhookRoutes);
apiRouter.use('/admin', adminRoutes);

export { apiRouter };
