import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentTerms extends Document {
  userId: mongoose.Types.ObjectId;
  days: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentTermsSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  days: { 
    type: Number,
    required: true,
    min: 0,
    max: 90
  },
  name: { 
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IPaymentTerms>('PaymentTerms', PaymentTermsSchema); 