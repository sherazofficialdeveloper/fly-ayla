import { Request, Response } from 'express';
import { AirportModel } from '../models/Airport';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';
import { isMongoConnected } from '../config/database';

const FALLBACK_AIRPORTS = [
  { icao: 'KTEB', iata: 'TEB', name: 'Teterboro Airport', city: 'Teterboro', country: 'United States', latitude: 40.8501, longitude: -74.0608 },
  { icao: 'EGLL', iata: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543 },
  { icao: 'EGGW', iata: 'LTN', name: 'London Luton Airport', city: 'London', country: 'United Kingdom', latitude: 51.8747, longitude: -0.3683 },
  { icao: 'LFMN', iata: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France', latitude: 43.6653, longitude: 7.2150 },
  { icao: 'LSGG', iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', latitude: 46.2381, longitude: 6.1089 },
  { icao: 'OMDB', iata: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', latitude: 25.2528, longitude: 55.3644 },
  { icao: 'OMDW', iata: 'DWC', name: 'Al Maktoum International Airport', city: 'Dubai', country: 'United Arab Emirates', latitude: 24.8960, longitude: 55.1614 },
  { icao: 'KJFK', iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', latitude: 40.6398, longitude: -73.7789 },
  { icao: 'KLAX', iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', latitude: 33.9425, longitude: -118.4081 },
  { icao: 'KVNY', iata: 'VNY', name: 'Van Nuys Airport', city: 'Van Nuys', country: 'United States', latitude: 34.2098, longitude: -118.4900 },
  { icao: 'VMMC', iata: 'MFM', name: 'Macau International Airport', city: 'Macau', country: 'Macau', latitude: 22.1496, longitude: 113.5916 },
  { icao: 'VHHH', iata: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', latitude: 22.3089, longitude: 113.9147 },
];

export class AirportController {
  static async search(req: Request, res: Response): Promise<void> {
    try {
      const query = String(req.query.q || '').trim();

      if (!query || query.length < 2) {
        ApiResponse.success(res, { airports: [] }, 'Empty search query.');
        return;
      }

      if (!isMongoConnected()) {
        const q = query.toLowerCase();
        const matches = FALLBACK_AIRPORTS.filter(
          (a) =>
            a.icao.toLowerCase().includes(q) ||
            a.iata.toLowerCase().includes(q) ||
            a.name.toLowerCase().includes(q) ||
            a.city.toLowerCase().includes(q) ||
            a.country.toLowerCase().includes(q)
        );
        ApiResponse.success(res, { airports: matches }, 'Airports retrieved.');
        return;
      }

      const regex = new RegExp(query, 'i');
      const airports = await (AirportModel as any)
        .find({
          status: { $ne: 'closed' },
          $or: [
            { icao: regex },
            { iata: regex },
            { name: regex },
            { city: regex },
            { country: regex },
          ],
        })
        .limit(15);

      ApiResponse.success(res, { airports: airports || [] }, 'Airports retrieved.');
    } catch (error: any) {
      Logger.error('Search Airports Error', error);
      ApiResponse.error(res, 'Failed to search airports in database.', 500);
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      if (!isMongoConnected()) {
        ApiResponse.success(res, { airports: FALLBACK_AIRPORTS }, 'Airport list loaded.');
        return;
      }

      const airports = await (AirportModel as any).find({ status: 'active' }).limit(50);
      ApiResponse.success(res, { airports: airports || [] }, 'Airport list loaded.');
    } catch (error: any) {
      Logger.error('Get All Airports Error', error);
      ApiResponse.error(res, 'Failed to load airport list from database.', 500);
    }
  }

  static async getPopular(req: Request, res: Response): Promise<void> {
    try {
      if (!isMongoConnected()) {
        ApiResponse.success(res, { airports: FALLBACK_AIRPORTS.slice(0, 8) }, 'Popular airports loaded.');
        return;
      }
      const airports = await (AirportModel as any).find({ status: 'active' }).limit(8);
      ApiResponse.success(res, { airports: airports.length > 0 ? airports : FALLBACK_AIRPORTS.slice(0, 8) }, 'Popular airports loaded.');
    } catch (error: any) {
      Logger.error('Get Popular Airports Error', error);
      ApiResponse.error(res, 'Failed to load popular airports.', 500);
    }
  }

  static async getByIcao(req: Request, res: Response): Promise<void> {
    try {
      const icao = String(req.params.icao || '').toUpperCase();
      if (!isMongoConnected()) {
        const found = FALLBACK_AIRPORTS.find((a) => a.icao === icao || a.iata === icao);
        if (found) {
          ApiResponse.success(res, { airport: found }, 'Airport found.');
        } else {
          ApiResponse.error(res, 'Airport not found.', 404);
        }
        return;
      }
      const airport = await (AirportModel as any).findOne({
        $or: [{ icao }, { iata: icao }],
      });
      if (!airport) {
        ApiResponse.error(res, 'Airport not found.', 404);
        return;
      }
      ApiResponse.success(res, { airport }, 'Airport retrieved.');
    } catch (error: any) {
      Logger.error('Get Airport By ICAO Error', error);
      ApiResponse.error(res, 'Failed to retrieve airport.', 500);
    }
  }
}
