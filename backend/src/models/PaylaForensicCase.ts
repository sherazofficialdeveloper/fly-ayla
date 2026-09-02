import mongoose, { Schema, Document } from 'mongoose';

export interface IPaylaForensicCase extends Document {
  caseNumber: string;
  transactionId: string;
  invoiceNumber?: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sanctionsCheck: 'PASSED' | 'REVIEW REQUIRED' | 'BLOCKED';
  amlStatus: 'CLEARED' | 'MONITORED' | 'BLOCKED';
  flags: string[];
  geoIpLocation: string;
  ipAddress?: string;
  notes: string;
  assignedAnalyst: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaylaForensicCaseSchema: Schema<IPaylaForensicCase> = new Schema(
  {
    caseNumber: { type: String, required: true, unique: true, index: true },
    transactionId: { type: String, required: true, index: true },
    invoiceNumber: { type: String, default: '' },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentMethod: { type: String, default: 'Wire Transfer / Swift MT103' },
    riskScore: { type: Number, default: 12 },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
    },
    sanctionsCheck: {
      type: String,
      enum: ['PASSED', 'REVIEW REQUIRED', 'BLOCKED'],
      default: 'PASSED',
    },
    amlStatus: {
      type: String,
      enum: ['CLEARED', 'MONITORED', 'BLOCKED'],
      default: 'CLEARED',
    },
    flags: { type: [String], default: [] },
    geoIpLocation: { type: String, default: 'Geneva, Switzerland (Verified Tier-1 ASN)' },
    ipAddress: { type: String, default: '194.230.14.88' },
    notes: { type: String, default: '' },
    assignedAnalyst: { type: String, default: 'A. Chen (Compliance Lead)' },
  },
  { timestamps: true }
);

export const PaylaForensicCaseModel =
  mongoose.models.PaylaForensicCase ||
  mongoose.model<IPaylaForensicCase>('PaylaForensicCase', PaylaForensicCaseSchema);
