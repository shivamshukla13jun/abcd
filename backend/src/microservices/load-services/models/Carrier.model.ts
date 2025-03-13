import mongoose, { Schema, Document } from 'mongoose';

export interface IDriverInfo {
  driver1Name: string;
  driver2Name?: string;
  driver1Phone: string;
  driver2Phone?: string;
  driver1CDL: string;
  driver2CDL?: string;
  driver1CDLExpiration: Date;
  driver2CDLExpiration?: Date;
  powerunit: string;
  trailer: string;
}

export interface ICarrier extends Document {
  userId: mongoose.Types.ObjectId;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  mcNumber: string;
  usdot: string;
  primaryContact: string;
  contactEmail: string;
  driverInfo: IDriverInfo;
  paymentMethods: string[];
  balance: number;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CarrierSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: false },
  contactPerson: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  address: { type: String, required: true },
  mcNumber: { type: String, required: true },
  usdot: { type: String, required: true },
  primaryContact: { type: String, required: true },
  contactEmail: { type: String, required: true },
  driverInfo: {
    driver1Name: { type: String, required: true },
    driver2Name: { type: String },
    driver1Phone: { type: String, required: true },
    driver2Phone: { type: String },
    driver1CDL: { type: String, required: true },
    driver2CDL: { type: String },
    driver1CDLExpiration: { type: Date, required: true },
    driver2CDLExpiration: { type: Date },
    powerunit: { type: String, required: true },
    trailer: { type: String, required: true }
    
  },
  paymentMethods: [{
    type: String,
    enum: ['Credit Card', 'PayPal', 'Stripe'],
    default: ['Credit Card']
  }],
  balance: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<ICarrier>('Carrier', CarrierSchema);
