import { apiClient } from '../api/client';

export class PricingService {
  static async getFuelPrice(icao?: string) {
    const query = icao ? `?icao=${encodeURIComponent(icao)}` : '';
    return apiClient(`/api/pricing/fuel${query}`);
  }

  static async calculatePrice(data: {
    aircraftCategory?: string;
    aircraftId?: string;
    legs: any[];
    customFuelPricePerGal?: number;
    customMarkupPercent?: number;
    cateringTier?: string;
    groundTransport?: boolean;
  }) {
    return apiClient('/api/pricing/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
