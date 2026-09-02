import { JetFuelXService } from './integrations/jetfuelx.service';
import { AirportModel } from '../models/Airport';
import { AircraftModel } from '../models/Aircraft';
import { PricingRuleModel } from '../models/PricingRule';
import { isMongoConnected } from '../config/database';

export interface FlightLegInput {
  departureIcao: string;
  destinationIcao: string;
  distanceNm?: number;
  flightTimeHours?: number;
  passengersCount?: number;
}

export interface PricingCalculationInput {
  aircraftCategory?: string;
  aircraftId?: string;
  legs: FlightLegInput[];
  customFuelPricePerGal?: number;
  customMarkupPercent?: number;
  cateringTier?: string;
  groundTransport?: boolean;
}

export interface ItemizedPricingResult {
  baseFlightCost: number;
  fuelCost: number | null;
  fuelGallons: number;
  effectiveFuelPricePerGal: number | null;
  fuelPriceSource: string;
  isLiveFuelPrice: boolean;
  fuelStatus: 'CONNECTED' | 'NOT_CONFIGURED' | 'API_ERROR';
  fuelPricingStatus: 'COMPLETE' | 'FUEL_PRICE_UNAVAILABLE';
  fuelPriceMessage?: string;
  handlingCost: number;
  navFees: number;
  operationalCrewCost: number;
  taxesAndAirportFees: number;
  subtotal: number;
  markupPercent: number;
  markupAmount: number;
  discount: number;
  quotedTotal: number;
  estimatedFlightHours: number;
  totalDistanceNm: number;
  aiPricingAdjustment?: {
    factor: number;
    reason: string;
  };
}

export class PricingService {
  /**
   * Great-Circle Distance calculation between two lat/lon coordinates in Nautical Miles (NM)
   */
  static calculateDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3440.065; // Earth radius in Nautical Miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  /**
   * Complete deterministic calculation engine with JetFuelX live index integration
   */
  static async calculateTripPrice(input: PricingCalculationInput): Promise<ItemizedPricingResult> {
    // 1. Fetch Aircraft Specs from MongoDB
    let hourlyRate = 6800; // Heavy Jet default
    let hourlyFuelBurnGal = 340;
    let cruiseSpeedKts = 480;

    if (input.aircraftId && isMongoConnected()) {
      const ac = await (AircraftModel as any).findById(input.aircraftId);
      if (ac) {
        hourlyRate = ac.hourlyRate || hourlyRate;
        hourlyFuelBurnGal = ac.hourlyFuelBurnGal || hourlyFuelBurnGal;
        cruiseSpeedKts = ac.cruiseSpeedKts || cruiseSpeedKts;
      }
    } else if (input.aircraftCategory) {
      const cat = input.aircraftCategory.toLowerCase();
      if (cat.includes('light')) {
        hourlyRate = 3400;
        hourlyFuelBurnGal = 180;
        cruiseSpeedKts = 420;
      } else if (cat.includes('midsize') && !cat.includes('super')) {
        hourlyRate = 4800;
        hourlyFuelBurnGal = 240;
        cruiseSpeedKts = 450;
      } else if (cat.includes('super midsize')) {
        hourlyRate = 5800;
        hourlyFuelBurnGal = 290;
        cruiseSpeedKts = 470;
      } else if (cat.includes('heavy')) {
        hourlyRate = 7200;
        hourlyFuelBurnGal = 360;
        cruiseSpeedKts = 490;
      } else if (cat.includes('ultra')) {
        hourlyRate = 9600;
        hourlyFuelBurnGal = 440;
        cruiseSpeedKts = 510;
      } else if (cat.includes('airliner')) {
        hourlyRate = 14500;
        hourlyFuelBurnGal = 680;
        cruiseSpeedKts = 490;
      }
    }

    // 2. Resolve legs distance and flight duration with Database Airport Coordinates
    let totalDistanceNm = 0;
    let estimatedFlightHours = 0;
    let totalAirportHandlingFees = 0;
    let totalAirportLandingFees = 0;

    for (const leg of input.legs) {
      let dist = leg.distanceNm;

      // Try looking up actual airport coordinates if distance is missing
      let depAirport = null;
      let destAirport = null;

      if (leg.departureIcao && isMongoConnected()) {
        depAirport = await (AirportModel as any).findOne({
          $or: [
            { icao: leg.departureIcao.toUpperCase().trim() },
            { iata: leg.departureIcao.toUpperCase().trim() },
          ],
        });
      }

      if (leg.destinationIcao && isMongoConnected()) {
        destAirport = await (AirportModel as any).findOne({
          $or: [
            { icao: leg.destinationIcao.toUpperCase().trim() },
            { iata: leg.destinationIcao.toUpperCase().trim() },
          ],
        });
      }

      if ((!dist || dist <= 0) && depAirport?.lat && depAirport?.lon && destAirport?.lat && destAirport?.lon) {
        dist = PricingService.calculateDistanceNm(
          depAirport.lat,
          depAirport.lon,
          destAirport.lat,
          destAirport.lon
        );
      }

      if (!dist || dist <= 0) {
        dist = 1200; // Baseline standard international leg nautical miles
      }
      totalDistanceNm += dist;

      // Add actual airport handling & landing charges if available
      const depHandling = depAirport?.handlingFeeBase || 650;
      const destHandling = destAirport?.handlingFeeBase || 650;
      const destLanding = (destAirport?.landingFeeRate || 18) * 45; // ~45k lbs mtow baseline
      totalAirportHandlingFees += depHandling + destHandling;
      totalAirportLandingFees += destLanding;

      const legHours =
        leg.flightTimeHours && leg.flightTimeHours > 0
          ? leg.flightTimeHours
          : +(dist / cruiseSpeedKts + 0.35).toFixed(2);
      estimatedFlightHours += legHours;
    }

    // 3. Resolve Fuel Price with JetFuelX Integration
    let fuelPricePerGal: number | null = input.customFuelPricePerGal && input.customFuelPricePerGal > 0 ? input.customFuelPricePerGal : null;
    let fuelPriceSource = fuelPricePerGal ? 'Custom Manual Override' : 'JetFuelX API (Unconfigured)';
    let isLiveFuelPrice = false;
    let fuelStatus: 'CONNECTED' | 'NOT_CONFIGURED' | 'API_ERROR' = 'NOT_CONFIGURED';
    let fuelPriceMessage = '';

    if (fuelPricePerGal && fuelPricePerGal > 0) {
      fuelPriceSource = 'Custom Manual Dispatch Override';
      isLiveFuelPrice = false;
      fuelStatus = 'CONNECTED';
      fuelPriceMessage = `Manual dispatch override rate of $${fuelPricePerGal.toFixed(2)}/gal applied.`;
    } else {
      const departureIcao = input.legs[0]?.departureIcao || (input.legs[0] as any)?.departureAirport;
      const fuelIndex = await JetFuelXService.getFuelPrice(departureIcao);
      fuelPricePerGal = fuelIndex.pricePerGallon;
      fuelPriceSource = fuelIndex.source;
      isLiveFuelPrice = fuelIndex.isLive;
      fuelStatus = fuelIndex.status;
      fuelPriceMessage = fuelIndex.message;
    }

    // 4. Calculate Line Item Costs (NO FABRICATED FUEL PRICE)
    const baseFlightCost = Math.round(estimatedFlightHours * hourlyRate);
    const fuelGallons = Math.round(estimatedFlightHours * hourlyFuelBurnGal);
    const fuelCost = (fuelPricePerGal !== null && fuelPricePerGal > 0) 
      ? Math.round(fuelGallons * fuelPricePerGal) 
      : null;
    const isFuelAvailable = fuelCost !== null;
    const fuelPricingStatus: 'COMPLETE' | 'FUEL_PRICE_UNAVAILABLE' = isFuelAvailable ? 'COMPLETE' : 'FUEL_PRICE_UNAVAILABLE';

    // Landing & FBO Handling charges per airport leg
    const legsCount = Math.max(1, input.legs.length);
    const handlingCost = Math.round(
      (totalAirportHandlingFees > 0 ? totalAirportHandlingFees : legsCount * 1450) +
        (input.groundTransport ? 750 : 0)
    );

    // Navigation & Airway Permitting
    const navFees = Math.round(totalDistanceNm * 0.85);

    // Crew per-diem, repositioning & hotel allocation
    const operationalCrewCost = Math.round(estimatedFlightHours * 650 + legsCount * 400);

    // Taxes, customs & passenger security fees
    const taxesAndAirportFees = Math.round(
      (baseFlightCost + (fuelCost || 0)) * 0.045 + (totalAirportLandingFees > 0 ? totalAirportLandingFees : legsCount * 500)
    );

    // Subtotal before margin (base operational components + fuel if live rate available)
    const subtotal = baseFlightCost + (fuelCost || 0) + handlingCost + navFees + operationalCrewCost + taxesAndAirportFees;

    // Markup from rules or input
    const markupPercent = input.customMarkupPercent !== undefined ? input.customMarkupPercent : 14;
    const markupAmount = Math.round(subtotal * (markupPercent / 100));
    const quotedTotal = subtotal + markupAmount;

    return {
      baseFlightCost,
      fuelCost,
      fuelGallons,
      effectiveFuelPricePerGal: fuelPricePerGal,
      fuelPriceSource,
      isLiveFuelPrice,
      fuelStatus,
      fuelPricingStatus,
      fuelPriceMessage,
      handlingCost,
      navFees,
      operationalCrewCost,
      taxesAndAirportFees,
      subtotal,
      markupPercent,
      markupAmount,
      discount: 0,
      quotedTotal,
      estimatedFlightHours: +estimatedFlightHours.toFixed(2),
      totalDistanceNm,
    };
  }
}
