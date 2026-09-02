import mongoose, { Schema, Document } from 'mongoose';

export interface IPassenger {
  fullName: string;
  passportNumber?: string;
  nationality?: string;
  specialNeeds?: string;
}

export interface IBooking extends Document {
  bookingReference: string;
  pnr: string;
  quoteId?: mongoose.Types.ObjectId;
  invoiceId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  routeSummary: string;
  departureDate: string;
  departureTime: string;
  arrivalDate?: string;
  arrivalTime?: string;
  aircraftName: string;
  aircraftTailNumber?: string;
  aircraftCategory: string;
  passengersCount: number;
  passengerList: IPassenger[];
  captainName: string;
  firstOfficerName: string;
  flightAttendant?: string;
  fboTerminal: string;
  fboAddress?: string;
  cateringDetails: string;
  groundTransportNotes?: string;
  status: 'Pending' | 'Confirmed' | 'In Flight' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Deposit Paid' | 'Paid' | 'Refunded';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PassengerSchema = new Schema(
  {
    fullName: { type: String, required: true },
    passportNumber: { type: String, default: '' },
    nationality: { type: String, default: '' },
    specialNeeds: { type: String, default: '' },
  },
  { _id: false }
);

const BookingSchema: Schema<IBooking> = new Schema(
  {
    bookingReference: { type: String, required: true, unique: true, index: true },
    pnr: { type: String, required: true, index: true },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', index: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerPhone: { type: String, required: true },
    routeSummary: { type: String, required: true },
    departureDate: { type: String, required: true },
    departureTime: { type: String, default: '10:00 UTC' },
    arrivalDate: { type: String, default: '' },
    arrivalTime: { type: String, default: '' },
    aircraftName: { type: String, required: true },
    aircraftTailNumber: { type: String, default: 'N900AY' },
    aircraftCategory: { type: String, default: 'Heavy Jet' },
    passengersCount: { type: Number, default: 4 },
    passengerList: [PassengerSchema],
    captainName: { type: String, default: 'Capt. Tariq Vance' },
    firstOfficerName: { type: String, default: 'FO Claire Bennet' },
    flightAttendant: { type: String, default: 'Lead Purser Layla H.' },
    fboTerminal: { type: String, default: 'Signature Flight Support VIP' },
    fboAddress: { type: String, default: '' },
    cateringDetails: { type: String, default: 'Michelin Star Gourmet Service & Vintage Champagne' },
    groundTransportNotes: { type: String, default: 'Mercedes-Maybach tarmac transfer on arrival' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Flight', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Deposit Paid', 'Paid', 'Refunded'],
      default: 'Pending',
    },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
