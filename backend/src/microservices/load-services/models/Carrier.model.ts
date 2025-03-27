import mongoose, { Schema, Document } from 'mongoose';



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
