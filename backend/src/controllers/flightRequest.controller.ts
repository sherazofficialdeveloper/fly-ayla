import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { FlightRequestModel } from '../models/FlightRequest';
import { NotificationModel } from '../models/Notification';
import { PricingService } from '../services/pricing.service';
import { AdminDataService } from '../services/adminData.service';
import { validateFlightRequest } from '../validators/flightRequest.validator';
import { ApiResponse } from '../utils/response.util';
import { Logger } from '../utils/logger.util';
import { isMongoConnected } from '../config/database';

export class FlightRequestController {
  static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const validation = validateFlightRequest(req.body);
      if (!validation.isValid) {
        ApiResponse.error(res, validation.message || 'Invalid flight request payload.', 400);
        return;
      }

      const {
        tripType,
        aircraftCategory,
        legs,
        groundTransport,
        cateringPreference,
        specialRequests,
        contactPhone,
        companyName,
      } = req.body;

      const requestNumber = `AY-REQ-${Date.now().toString().slice(-6)}`;
      const user = req.user!;

      // Calculate distance & time on backend
      const pricingEstimate = await PricingService.calculateTripPrice({
        aircraftCategory: aircraftCategory || 'Heavy Jet',
        legs: legs.map((l: any) => ({
          departureIcao: l.departureIcao || l.departure?.icao || l.departureAirport || (typeof l.departure === 'string' ? l.departure : 'KTEB'),
          destinationIcao: l.destinationIcao || l.destination?.icao || l.destinationAirport || l.arrivalAirport || l.arrivalIcao || (typeof l.destination === 'string' ? l.destination : (typeof l.arrival === 'string' ? l.arrival : 'EGLL')),
          distanceNm: l.distanceNm || 1200,
          flightTimeHours: l.flightTimeHours || 3.0,
        })),
        groundTransport: Boolean(groundTransport),
      });

      const newRequestData: any = {
        requestNumber,
        userId: user?.id && mongoose.isValidObjectId(user.id) ? new mongoose.Types.ObjectId(user.id) : undefined,
        customerName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'VIP Client',
        customerEmail: user.email.toLowerCase(),
        customerPhone: contactPhone || user.phone || '+1 555-0199',
        companyName: companyName || user.companyName || '',
        aircraftCategory: aircraftCategory || 'Heavy Jet',
        tripType: tripType || 'one-way',
        legs: legs.map((l: any) => ({
          departureIcao: l.departureIcao || l.departure?.icao || l.departureAirport || (typeof l.departure === 'string' ? l.departure : 'KTEB'),
          departureName: l.departureName || l.departure?.name || l.departureAirportName || 'Teterboro Airport',
          departureCity: l.departureCity || l.departure?.city || 'New York / Teterboro',
          destinationIcao: l.destinationIcao || l.destination?.icao || l.destinationAirport || l.arrivalAirport || l.arrivalIcao || (typeof l.destination === 'string' ? l.destination : (typeof l.arrival === 'string' ? l.arrival : 'EGLL')),
          destinationName: l.destinationName || l.destination?.name || l.destinationAirportName || 'London Heathrow',
          destinationCity: l.destinationCity || l.destination?.city || 'London',
          departureDate: l.departureDate || new Date().toISOString().split('T')[0],
          departureTime: l.departureTime || '12:00 UTC',
          passengersCount: Number(l.passengersCount || l.passengers || 4),
          flightTimeHours: Number(l.flightTimeHours || 3.0),
          distanceNm: Number(l.distanceNm || 1200),
        })),
        groundTransport: Boolean(groundTransport),
        cateringPreference: cateringPreference || 'Standard VIP Catering',
        specialRequests: specialRequests || '',
        status: 'Pending',
        estimatedCost: pricingEstimate.quotedTotal,
      };

      let createdRequest: any;
      if (isMongoConnected()) {
        createdRequest = await (FlightRequestModel as any).create(newRequestData);

        // Create Admin Notification for new charter request
        await (NotificationModel as any).create({
          recipientRole: 'admin',
          type: 'flight_request',
          title: 'New Flight Request Submitted',
          message: `${createdRequest.customerName} requested ${createdRequest.tripType} charter (${requestNumber}) for ${createdRequest.aircraftCategory}.`,
          read: false,
        });
      } else {
        const reqId = `req_${Date.now()}`;
        createdRequest = {
          _id: reqId,
          id: reqId,
          ...newRequestData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      await AdminDataService.logAction({
        action: `Created flight request ${requestNumber} (${createdRequest.legs.length} legs)`,
        user: createdRequest.customerName,
        userEmail: createdRequest.customerEmail,
        userId: user.id,
        role: 'Customer',
        category: 'FLIGHT_REQUEST',
        recordRef: requestNumber,
        status: 'SUCCESS',
        ipAddress: req.ip,
      });

      Logger.info(`Flight request created ${requestNumber}`);

      ApiResponse.success(
        res,
        {
          flightRequest: createdRequest,
          pricingEstimate,
        },
        'Flight request submitted successfully. Operations desk will review and dispatch quote.',
        201
      );
    } catch (error: any) {
      Logger.error('Create Flight Request Error', error);
      ApiResponse.error(res, 'Failed to submit flight request.', 500);
    }
  }

  static async getMy(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      if (!isMongoConnected()) {
        ApiResponse.success(res, { requests: [], total: 0 }, 'Flight requests fetched.');
        return;
      }

      const requests = await (FlightRequestModel as any)
        .find({
          $or: [{ userId: user.id }, { customerEmail: user.email.toLowerCase() }],
        })
        .sort({ createdAt: -1 });

      ApiResponse.success(res, { requests, total: requests.length }, 'Flight requests fetched.');
    } catch (error: any) {
      Logger.error('Get Customer Requests Error', error);
      ApiResponse.error(res, 'Failed to retrieve flight requests.', 500);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = req.user!;

      if (!isMongoConnected()) {
        ApiResponse.error(res, 'Flight request not found.', 404);
        return;
      }

      const request = await (FlightRequestModel as any).findById(id);

      if (!request) {
        ApiResponse.error(res, 'Flight request not found.', 404);
        return;
      }

      const isOwner =
        request.userId?.toString() === user.id ||
        request.customerEmail?.toLowerCase() === user.email.toLowerCase();
      const isAdmin = user.role === 'admin';

      if (!isOwner && !isAdmin) {
        ApiResponse.error(res, 'Unauthorized: You do not have permission to view this flight request.', 403);
        return;
      }

      ApiResponse.success(res, { flightRequest: request }, 'Flight request details fetched.');
    } catch (error: any) {
      Logger.error('Get Flight Request By ID Error', error);
      ApiResponse.error(res, 'Failed to retrieve flight request.', 500);
    }
  }
}
