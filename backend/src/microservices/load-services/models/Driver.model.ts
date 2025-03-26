
import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  carrierId: mongoose.Types.ObjectId;
  
  driverName: string;
  driverPhone: string;
  driverCDL: string;
  driverCDLExpiration: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema: Schema = new Schema({
  carrierId: { type: Schema.Types.ObjectId, ref: 'Carrier', required: true },

  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  driverCDL: { type: String, required: true },
  driverCDLExpiration: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IDriver>('Driver', DriverSchema);
