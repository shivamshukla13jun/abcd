import mongoose, { Schema, Document, model } from 'mongoose';
import { AppError } from '../../../middlewares/error';
import { FileService, MulterFile } from '../services/file.service';

export enum LoadStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  DISPATCHED = 'Dispatched',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  INVOICE_GENERATED = 'Invoice Generated',
  INVOICE_PAID = 'Invoice Paid',
  INVOICE_OVERDUE = 'Invoice Overdue',
  INVOICE_PARTIALLY_PAID = 'Invoice Partially Paid', 
}

export enum LoadSize {
  FULL = 'full',
  PARTIAL = 'partial',
}

export enum EquipmentType {
  VAN = 'Van',
  VAN_AIR_RIDE = 'Van - Air-Ride',
  VAN_HAZARDOUS = 'Van - Hazardous',
  VAN_VENTED = 'Van - Vented',
  VAN_CURTAINS = 'Van w/ Curtains',
  VAN_PALLET_EXCHANGE = 'Van w/ Pallet Exchange',
  REEFER = 'Reefer',
  REEFER_HAZARDOUS = 'Reefer - Hazardous',
  REEFER_PALLET_EXCHANGE = 'Reefer w/ Pallet Exchange',
  DOUBLE_DROP = 'Double Drop',
  FLATBED = 'Flatbed',
  FLATBED_HAZARDOUS = 'Flatbed - Hazardous',
  FLATBED_PALLET_EXCHANGE = 'Flatbed w/ Pallet Exchange',
  FLATBED_SIDES = 'Flatbed w/ Sides',
  LOWBOY = 'Lowboy',
  MAXI = 'Maxi',
  REMOVABLE_GOOSENECK = 'Removable Gooseneck',
  STEP_DECK = 'Step Deck',
  AUTO_CARRIER = 'Auto Carrier',
  DUMP_TRAILER = 'Dump Trailer',
  HOPPER_BOTTOM = 'Hopper Bottom',
  HOTSHOT = 'Hotshot',
  TANKER = 'Tanker',
  FLATBED_STEP_DECK = 'Flatbed/Step Deck',
  FLATBED_VAN = 'Flatbed/Van',
  FLATBED_REEFER = 'Flatbed/Reefer',
  REEFER_VAN = 'Reefer/Van',
  FLATBED_REEFER_VAN = 'Flatbed/Reefer/Van',
  POWER_ONLY = 'Power Only',
}
export interface itemsProps{
  id: number;
  itemDetails: string;
  description: string;
  qty: number;
  rate?: number;
  // discount?: number;
  tax?: number;
  amount?: number;
}

export interface ILoad extends Document {
  loadNumber: string;
  status: LoadStatus;
  invoiceId: mongoose.Types.ObjectId;
  commodity: string;
  loadSize: LoadSize;
  declaredValue?: number;
  weight?: number;
  temperature?: number;
  equipmentType: EquipmentType;
  equipmentLength: '20' | '28' | '40' | '45' | '48' | '53';
  notes?: string;
  loadAmount: number;
  userId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  carrierIds: mongoose.Types.ObjectId[];
  pickupLocationId: mongoose.Types.ObjectId[];
  deliveryLocationId: mongoose.Types.ObjectId[];
  files: any[];
  items: itemsProps[];
  freightCharge: 'Prepaid' | 'Collect' | '3rd Party';
}

const LoadSchema: Schema = new Schema({
  loadNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: Object.values(LoadStatus), default: LoadStatus.PENDING },
  commodity: { type: String, required: true },
  loadSize: { type: String, enum: Object.values(LoadSize), required: true },
  declaredValue: { type: Number },
  invoiceId: { type: mongoose.Types.ObjectId, ref: 'Invoice' },
  weight: { type: Number },
  temperature: { type: Number },
  equipmentType: { type: String, enum: Object.values(EquipmentType), required: true },
  equipmentLength: { type: String, enum: ['20', '28', '40', '45', '48', '53'], required: true },
  notes: { type: String },
  loadAmount: { type: Number, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  customerId: { type: mongoose.Types.ObjectId, ref: 'Customer', required: true },
  carrierIds: [{ type: mongoose.Types.ObjectId, ref: 'Carrier' }],
  pickupLocationId: [{ type: mongoose.Types.ObjectId, ref: 'Location' }],
  deliveryLocationId: [{ type: mongoose.Types.ObjectId, ref: 'Location' }],
  // documentUpload: {
    files: [Schema.Types.Mixed],
    items: [{
      id: Number,
      itemDetails: String,
      description: String,
      qty: Number,
      rate: Number,
      // discount: Number,
      tax: Number,
      amount: Number,
    }],
    freightCharge: { type: String, enum: ['Prepaid', 'Collect', '3rd Party'], default: 'Prepaid' },
  // },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
LoadSchema.pre('save', async function (next) {
  const load = this;
  if (load.isNew) {
    const existingLoad = await Load.findOne({ loadNumber: load.loadNumber });
    if (existingLoad) {
       throw new AppError('Load number already exists', 400);
    }
  }
  next();
});
LoadSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    if (ret.files && Array.isArray(ret.files)) {
      ret.files = ret.files.map((file: MulterFile) => ({
        ...file,
        url: FileService.getFileUrl(file.filename),
      }));
    }
    return ret;
  }
});


const Load = model<ILoad>('Load', LoadSchema);
export default Load;
