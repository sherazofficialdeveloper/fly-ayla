import mongoose, { Schema, Document } from 'mongoose';

export interface ICostBreakdown {
  baseFlightCost: number;
  fuelCost: number;
  handlingCost: number;
  navFees: number;
  operationalCrewCost: number;
  taxesAndAirportFees: number;
  markupPercent: number;
  markupAmount: number;
  subtotal: number;
  discount: number;
  quotedTotal: number;
}

export interface IQuote extends Document {
  quoteNumber: string;
  requestId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  aircraftName: string;
  aircraftCategory: string;
  aircraftTailNumber?: string;
  routeSummary: string;
  validUntil: string;
  status: 'Draft' | 'Pending Approval' | 'Sent' | 'Approved' | 'Rejected' | 'Expired';
  costBreakdown: ICostBreakdown;
  terms: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CostBreakdownSchema = new Schema(
  {
    baseFlightCost: { type: Number, default: 0 },
    fuelCost: { type: Number, default: 0 },
    handlingCost: { type: Number, default: 0 },
    navFees: { type: Number, default: 0 },
    operationalCrewCost: { type: Number, default: 0 },
    taxesAndAirportFees: { type: Number, default: 0 },
    markupPercent: { type: Number, default: 14 },
    markupAmount: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    quotedTotal: { type: Number, default: 0 },
  },
  { _id: false }
);

const QuoteSchema: Schema<IQuote> = new Schema(
  {
    quoteNumber: { type: String, required: true, unique: true, index: true },
    requestId: { type: Schema.Types.ObjectId, ref: 'FlightRequest', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerPhone: { type: String, default: '' },
    companyName: { type: String, default: '' },
    aircraftName: { type: String, required: true },
    aircraftCategory: { type: String, default: 'Heavy Jet' },
    aircraftTailNumber: { type: String, default: '' },
    routeSummary: { type: String, required: true },
    validUntil: { type: String, required: true },
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Sent', 'Approved', 'Rejected', 'Expired'],
      default: 'Sent',
      index: true,
    },
    costBreakdown: { type: CostBreakdownSchema, required: true },
    terms: {
      type: String,
      default: 'Includes all direct operating costs, fuel surcharges, handling fees, navigation permits, and in-flight VIP catering. Subject to aircraft availability and airport slot confirmation at time of signing.',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const QuoteModel = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);
