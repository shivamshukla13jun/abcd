import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  mcNumber: string;
  usdot: string;
  paymentMethod: string;
  paymentTerms: mongoose.Types.ObjectId[];
  vatNumber: string;
  utrNumber: string;
  status: string;
  rating: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  mcNumber: { type: String, required: true },
  usdot: { type: String, required: true },
  paymentMethod: { 
    type: String,
    enum: ['card', 'bank transfer', 'cash', 'check'],
    required: true 
  },
  paymentTerms: [{ 
    type: Schema.Types.ObjectId,
    ref: 'PaymentTerms',
    required: true 
  }],
  vatNumber: { type: String, required: true },
  utrNumber: { type: String, required: true },
  status: { 
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  rating: { 
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F'],
    default: 'A'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false
});



export default mongoose.model<ICustomer>('Customer', CustomerSchema);
