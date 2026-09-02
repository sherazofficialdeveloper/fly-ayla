import { Router } from 'express';
import { PricingController } from '../controllers/pricing.controller';

const router = Router();

/**
 * @route   GET /api/pricing/fuel
 * @desc    Get live Jet-A index pricing and integration status
 * @access  Public
 */
router.get('/fuel', PricingController.getFuel);
router.get('/fuel-index', PricingController.getFuel);
router.get('/fuel/diagnostics', PricingController.getFuelDiagnostics);
router.get('/rules', PricingController.getRules);

/**
 * @route   POST /api/pricing/calculate & POST /api/pricing/estimate
 * @desc    Calculate trip price breakdown deterministically on backend
 * @access  Public / Private
 */
router.post('/calculate', PricingController.calculate);
router.post('/estimate', PricingController.calculate);

export const pricingRoutes = router;
