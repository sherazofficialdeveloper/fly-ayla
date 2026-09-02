import { Request, Response } from 'express';
import { PricingService } from '../services/pricing.service';
import { JetFuelXService } from '../services/integrations/jetfuelx.service';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';

export class PricingController {
  static async getFuel(req: Request, res: Response): Promise<void> {
    try {
      const icao = req.query.icao as string | undefined;
      const fuelData = await JetFuelXService.getFuelPrice(icao);
      ApiResponse.success(res, fuelData, 'Fuel pricing fetched.');
    } catch (error: any) {
      Logger.error('Get Fuel Error', error);
      ApiResponse.error(res, 'Failed to retrieve fuel pricing data.', 500);
    }
  }

  static async getFuelDiagnostics(req: Request, res: Response): Promise<void> {
    try {
      const icao = req.query.icao as string | undefined;
      const diagData = await JetFuelXService.testLiveConnection(icao);
      ApiResponse.success(res, diagData, 'JetFuelX diagnostics completed.');
    } catch (error: any) {
      Logger.error('JetFuelX Diagnostics Error', error);
      ApiResponse.error(res, 'Failed to run JetFuelX diagnostics.', 500);
    }
  }

  static async getRules(req: Request, res: Response): Promise<void> {
    try {
      const { AdminDataService } = await import('../services/adminData.service');
      const rules = await AdminDataService.getPricingRules();
      ApiResponse.success(res, { pricing: rules }, 'Pricing rules fetched.');
    } catch (error: any) {
      Logger.error('Get Pricing Rules Error', error);
      ApiResponse.error(res, 'Failed to retrieve pricing rules.', 500);
    }
  }

  static async calculate(req: Request, res: Response): Promise<void> {
    try {
      const {
        aircraftCategory,
        aircraftId,
        legs,
        customFuelPricePerGal,
        customMarkupPercent,
        cateringTier,
        groundTransport,
      } = req.body;

      if (!legs || !Array.isArray(legs) || legs.length === 0) {
        ApiResponse.error(res, 'Calculation requires at least one route leg.', 400);
        return;
      }

      const breakdown = await PricingService.calculateTripPrice({
        aircraftCategory,
        aircraftId,
        legs,
        customFuelPricePerGal: Number(customFuelPricePerGal),
        customMarkupPercent: Number(customMarkupPercent),
        cateringTier,
        groundTransport: Boolean(groundTransport),
      });

      ApiResponse.success(res, { breakdown }, 'Quotation pricing calculated.');
    } catch (error: any) {
      Logger.error('Pricing Calculation Error', error);
      ApiResponse.error(res, 'Failed to compute flight quotation pricing.', 500);
    }
  }
}
