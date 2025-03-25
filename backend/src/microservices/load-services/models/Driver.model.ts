
import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  carrierId: mongoose.Types.ObjectId;
  driverId: string;
  driverName: string;
  phoneNumber: string;
  cdlNumber: string;
  cdlExpiration: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema: Schema = new Schema({
  carrierId: { type: Schema.Types.ObjectId, ref: 'Carrier', required: true },
  driverId: { type: String, required: true },
  driverName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  cdlNumber: { type: String, required: true },
  cdlExpiration: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IDriver>('Driver', DriverSchema);
