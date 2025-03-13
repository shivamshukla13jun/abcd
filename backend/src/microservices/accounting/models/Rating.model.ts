import mongoose, { Schema, Document } from 'mongoose';

export interface IRating extends Document {
  loadId: mongoose.Types.ObjectId;
  carrierId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  rating: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema: Schema = new Schema({
  loadId: { type: Schema.Types.ObjectId, ref: 'Load', required: true },
  carrierId: { type: Schema.Types.ObjectId, ref: 'Carrier', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  feedback: { type: String }
}, {
  timestamps: true
});

// Ensure one rating per load-carrier-driver combination
RatingSchema.index({ loadId: 1, carrierId: 1, driverId: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', RatingSchema);
