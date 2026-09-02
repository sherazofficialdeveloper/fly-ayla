import mongoose, { Schema, Document } from 'mongoose';

export interface IFlightLeg {
  departureIcao: string;
  departureName: string;
  departureCity: string;
  destinationIcao: string;
  destinationName: string;
  destinationCity: string;
  departureDate: string;
  departureTime: string;
  passengersCount: number;
  flightTimeHours?: number;
  distanceNm?: number;
}

export interface IFlightRequest extends Document {
  requestNumber: string;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  aircraftCategory: string;
  tripType: 'one-way' | 'round-trip' | 'multi-leg';
  legs: IFlightLeg[];
  groundTransport: boolean;
  cateringPreference: string;
  specialRequests?: string;
  status: 'Pending' | 'Processing' | 'Quoted' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';
  estimatedCost?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FlightLegSchema = new Schema(
  {
    departureIcao: { type: String, required: true },
    departureName: { type: String, required: true },
    departureCity: { type: String, required: true },
    destinationIcao: { type: String, required: true },
    destinationName: { type: String, required: true },
    destinationCity: { type: String, required: true },
    departureDate: { type: String, required: true },
    departureTime: { type: String, default: '12:00 UTC' },
    passengersCount: { type: Number, default: 4 },
    flightTimeHours: { type: Number, default: 2.5 },
    distanceNm: { type: Number, default: 1100 },
  },
  { _id: false }
);

const FlightRequestSchema: Schema<IFlightRequest> = new Schema(
  {
    requestNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerPhone: { type: String, required: true, trim: true },
    companyName: { type: String, default: '' },
    aircraftCategory: { type: String, default: 'Heavy Jet' },
    tripType: {
      type: String,
      enum: ['one-way', 'round-trip', 'multi-leg'],
      default: 'one-way',
    },
    legs: [FlightLegSchema],
    groundTransport: { type: Boolean, default: false },
    cateringPreference: { type: String, default: 'Standard VIP Catering' },
    specialRequests: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Quoted', 'Approved', 'Rejected', 'Cancelled', 'Completed'],
      default: 'Pending',
      index: true,
    },
    estimatedCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const FlightRequestModel = mongoose.models.FlightRequest || mongoose.model<IFlightRequest>('FlightRequest', FlightRequestSchema);
