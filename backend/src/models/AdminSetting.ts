import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSetting extends Document {
  key: string;
  value: any;
  category: 'general' | 'company' | 'contact' | 'email' | 'notifications' | 'security' | 'api' | 'payment' | 'pricing' | 'system';
  description?: string;
  updatedBy?: string;
  updatedAt: Date;
}

const AdminSettingSchema: Schema<IAdminSetting> = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    category: {
      type: String,
      enum: ['general', 'company', 'contact', 'email', 'notifications', 'security', 'api', 'payment', 'pricing', 'system'],
      default: 'general',
      index: true,
    },
    description: { type: String, default: '' },
    updatedBy: { type: String, default: 'Flight Ops Admin' },
  },
  { timestamps: true }
);

export const AdminSettingModel =
  mongoose.models.AdminSetting || mongoose.model<IAdminSetting>('AdminSetting', AdminSettingSchema);
