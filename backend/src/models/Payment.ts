import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  transactionId: string;
  invoiceId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Processing' | 'Paid' | 'Failed' | 'Refunded' | 'Cancelled';
  paymentMethod: string;
  gatewayReference?: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Paid', 'Failed', 'Refunded', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    paymentMethod: { type: String, required: true, index: true },
    gatewayReference: { type: String, default: '', index: true },
    receiptUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
