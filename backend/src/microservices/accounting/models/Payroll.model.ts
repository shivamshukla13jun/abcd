import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  carrierId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  basePay: number;
  overtimePay: number;
  bonuses: number;
  deductions: number;
  totalPay: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema: Schema = new Schema({
  carrierId: { type: Schema.Types.ObjectId, ref: 'Carrier', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  payPeriodStart: { type: Date, required: true },
  payPeriodEnd: { type: Date, required: true },
  basePay: { type: Number, required: true },
  overtimePay: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  totalPay: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processed', 'paid'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model<IPayroll>('Payroll', PayrollSchema);
