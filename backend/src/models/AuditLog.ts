import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  user: string;
  userEmail?: string;
  userId?: mongoose.Types.ObjectId;
  role: string;
  category: 'AUTH' | 'CUSTOMER' | 'FLIGHT_REQUEST' | 'QUOTE' | 'BOOKING' | 'INVOICE' | 'PAYMENT' | 'AIRCRAFT' | 'AIRPORT' | 'PRICING' | 'SETTINGS' | 'FORENSIC';
  recordRef?: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE';
  ipAddress?: string;
  details?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema(
  {
    action: { type: String, required: true },
    user: { type: String, required: true },
    userEmail: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'Admin' },
    category: {
      type: String,
      enum: [
        'AUTH',
        'CUSTOMER',
        'FLIGHT_REQUEST',
        'QUOTE',
        'BOOKING',
        'INVOICE',
        'PAYMENT',
        'AIRCRAFT',
        'AIRPORT',
        'PRICING',
        'SETTINGS',
        'FORENSIC',
      ],
      default: 'AUTH',
      index: true,
    },
    recordRef: { type: String, default: '' },
    status: {
      type: String,
      enum: ['SUCCESS', 'WARNING', 'FAILURE'],
      default: 'SUCCESS',
      index: true,
    },
    ipAddress: { type: String, default: '127.0.0.1' },
    details: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const AuditLogModel =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
