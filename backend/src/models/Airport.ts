import mongoose, { Schema, Document } from 'mongoose';

export interface IAirport extends Document {
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  elevationFt: number;
  timezone: string;
  runwayLengthFt: number;
  handlingFeeBase: number;
  landingFeeRate: number;
  parkingFeeDaily: number;
  fuelPricePerGal: number;
  customsAvailable: boolean;
  slotsRequired: boolean;
  status: 'active' | 'restricted' | 'closed';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const AirportSchema: Schema<IAirport> = new Schema(
  {
    icao: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    iata: { type: String, required: true, uppercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    country: { type: String, required: true, trim: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    elevationFt: { type: Number, default: 0 },
    timezone: { type: String, default: 'UTC' },
    runwayLengthFt: { type: Number, default: 7000 },
    handlingFeeBase: { type: Number, default: 450 },
    landingFeeRate: { type: Number, default: 18 },
    parkingFeeDaily: { type: Number, default: 250 },
    fuelPricePerGal: { type: Number, default: 0 },
    customsAvailable: { type: Boolean, default: true },
    slotsRequired: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['active', 'restricted', 'closed'],
      default: 'active',
      index: true,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const AirportModel = mongoose.models.Airport || mongoose.model<IAirport>('Airport', AirportSchema);
