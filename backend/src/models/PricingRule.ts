import mongoose, { Schema, Document } from 'mongoose';

export interface IPricingRule extends Document {
  jetFuelPricePerGal: number;
  jetFuelSource: string;
  defaultMarkupPercent: number;
  navigationFeePerNm: number;
  crewDailyRate: number;
  overnightFee: number;
  cateringStandardFee: number;
  internationalPermitFee: number;
  taxesPercent: number;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PricingRuleSchema: Schema<IPricingRule> = new Schema(
  {
    jetFuelPricePerGal: { type: Number, default: 0 },
    jetFuelSource: { type: String, default: 'JetFuelX Contract Fuel Pricing API' },
    defaultMarkupPercent: { type: Number, default: 14 },
    navigationFeePerNm: { type: Number, default: 1.45 },
    crewDailyRate: { type: Number, default: 1800 },
    overnightFee: { type: Number, default: 1200 },
    cateringStandardFee: { type: Number, default: 850 },
    internationalPermitFee: { type: Number, default: 950 },
    taxesPercent: { type: Number, default: 7.5 },
    updatedBy: { type: String, default: 'Flight Operations Desk' },
  },
  { timestamps: true }
);

export const PricingRuleModel = mongoose.models.PricingRule || mongoose.model<IPricingRule>('PricingRule', PricingRuleSchema);
