import mongoose, { Schema } from 'mongoose';

export interface IAircraft {
  name: string;
  category: 'Super Light Jet' | 'Midsize Jet' | 'Super Midsize' | 'Heavy Jet' | 'Ultra Long Range' | 'VIP Airliner';
  manufacturer: string;
  model: string;
  tailNumber: string;
  registration: string;
  passengerCapacity: number;
  maxRangeNm: number;
  cruiseSpeedKts: number;
  hourlyRate: number;
  hourlyFuelBurnGal: number;
  baggageCapacityCuFt: number;
  cabinDimensions: {
    heightM: number;
    widthM: number;
    lengthM: number;
  };
  amenities: string[];
  images: string[];
  status: 'available' | 'unavailable' | 'maintenance' | 'Available' | 'Unavailable' | 'Maintenance' | string;
  description: string;
  baseAirportIcao: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AircraftSchema = new Schema<IAircraft>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Super Light Jet', 'Midsize Jet', 'Super Midsize', 'Heavy Jet', 'Ultra Long Range', 'VIP Airliner'],
    },
    manufacturer: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    tailNumber: { type: String, required: true, trim: true, unique: true },
    registration: { type: String, default: '' },
    passengerCapacity: { type: Number, required: true, min: 1 },
    maxRangeNm: { type: Number, required: true, min: 100 },
    cruiseSpeedKts: { type: Number, required: true, min: 100 },
    hourlyRate: { type: Number, required: true, min: 0 },
    hourlyFuelBurnGal: { type: Number, required: true, min: 0 },
    baggageCapacityCuFt: { type: Number, default: 100 },
    cabinDimensions: {
      heightM: { type: Number, default: 1.88 },
      widthM: { type: Number, default: 2.41 },
      lengthM: { type: Number, default: 14.27 },
    },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['available', 'unavailable', 'maintenance', 'Available', 'Unavailable', 'Maintenance'],
      default: 'Available',
      index: true,
    },
    description: { type: String, default: '' },
    baseAirportIcao: { type: String, default: 'LSGG' },
  },
  { timestamps: true }
);

export const AircraftModel =
  mongoose.models.Aircraft || mongoose.model<IAircraft>('Aircraft', AircraftSchema);
