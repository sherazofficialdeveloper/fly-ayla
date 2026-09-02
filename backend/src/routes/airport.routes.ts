import { Router } from 'express';
import { AirportController } from '../controllers/airport.controller';

const router = Router();

/**
 * @route   GET /api/airports/search
 * @desc    Fast real airport search by ICAO, IATA, name, city, or country from MongoDB
 * @access  Public
 */
router.get('/search', AirportController.search);
router.get('/popular', AirportController.getPopular);
router.get('/:icao', AirportController.getByIcao);
router.get('/', AirportController.getAll);

export const airportRoutes = router;
