import mongoose, { Schema, Document, model } from 'mongoose';

export enum LocationClass {
  WAREHOUSE = 'warehouse',
  PORT = 'port',
  TERMINAL = 'terminal',
  OTHER = 'other',
}
export enum LocationRequirement {
  // Dynamically Added from Array
  LIFTGATE_SERVICE_NEEDED = 'Liftgate Service Needed',
  INSIDE_PICKUP = 'Inside Pickup',
  APPOINTMENT_REQUIRED = 'Appointment Required',
  DRIVER_ASSIST_REQUIRED = 'Driver Assist Required',
}


interface ILocation extends Document {
  type: 'pickup' | 'delivery';
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country?: string;
  locationClass: LocationClass;
  date: Date;
  time: string;
  requirements: LocationRequirement[]; // Array of enum strings
  notes?: string;
  loadId?: mongoose.Types.ObjectId;
}

const LocationSchema: Schema = new Schema(
  {
    type: { type: String, enum: ['pickup', 'delivery'], required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String },
    locationClass: {
      type: String,
      enum: Object.values(LocationClass),
      required: true,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    requirements: [
      { type: String, enum: Object.values(LocationRequirement) }, // Array of enums
    ],
    notes: { type: String },
    loadId: { type: mongoose.Types.ObjectId, ref: 'Load' },
  },
  { timestamps: true }
);

export default model<ILocation>('Location', LocationSchema);
