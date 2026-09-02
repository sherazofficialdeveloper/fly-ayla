import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceNumber: string;
  bookingId?: mongoose.Types.ObjectId;
  quoteId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  routeSummary: string;
  aircraftName: string;
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  currency: string;
  dueDate: string;
  status: 'Draft' | 'Issued' | 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentMethod?: string;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema<IInvoice> = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    customerPhone: { type: String, default: '' },
    companyName: { type: String, default: '' },
    routeSummary: { type: String, required: true },
    aircraftName: { type: String, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    dueDate: { type: String, required: true },
    status: {
      type: String,
      enum: ['Draft', 'Issued', 'Pending', 'Paid', 'Overdue', 'Cancelled'],
      default: 'Issued',
      index: true,
    },
    paymentMethod: { type: String, default: '' },
    paidAt: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const InvoiceModel = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
