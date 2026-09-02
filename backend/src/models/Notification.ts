import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId?: mongoose.Types.ObjectId;
  recipientRole: 'admin' | 'customer' | 'all';
  recipientEmail?: string;
  type: 'request' | 'quote' | 'booking' | 'invoice' | 'payment' | 'forensic' | 'system';
  title: string;
  message: string;
  read: boolean;
  isRead?: boolean;
  linkTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    recipientRole: {
      type: String,
      enum: ['admin', 'customer', 'all'],
      default: 'admin',
      index: true,
    },
    recipientEmail: { type: String, lowercase: true, trim: true, default: '', index: true },
    type: {
      type: String,
      enum: ['request', 'quote', 'booking', 'invoice', 'payment', 'forensic', 'system'],
      default: 'system',
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    isRead: { type: Boolean, default: false },
    linkTo: { type: String, default: '' },
  },
  { timestamps: true }
);

export const NotificationModel =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
