import mongoose, { Schema, Document, model, Types } from 'mongoose';
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

export interface itemsProps {
  id: number;
  itemDetails: string;
  description: string;
  qty: number;
  rate?: number;
  tax?: number;
  amount?: number;
}

export interface IExpenseItem {
  value: number | string;
  service: Types.ObjectId;
  desc: string;
  positive: boolean;
}

export interface ICarrierAssignment {
  carrier: Types.ObjectId;
  assignDrivers: Types.ObjectId[];
  carrierExpense: IExpenseItem[];
  dispatchRate: number;
}

export interface ICustomerExpense extends IExpenseItem {
  customerId: Types.ObjectId;
}

export interface ILoad extends Document {
  loadNumber: string;
  status: LoadStatus;
  invoiceId: Types.ObjectId;
  commodity: string;
  loadSize: LoadSize;
  customerExpense: ICustomerExpense[];
  declaredValue?: number;
  weight?: number;
  temperature?: number;
  equipmentType: EquipmentType;
  equipmentLength: '20' | '28' | '40' | '45' | '48' | '53';
  notes?: string;
  loadAmount: number;
  userId: Types.ObjectId;
  customerId: Types.ObjectId;
  carrierIds: ICarrierAssignment[];
  pickupLocationId: Types.ObjectId[];
  deliveryLocationId: Types.ObjectId[];
  files: any[];
  items: itemsProps[];
  freightCharge: 'Prepaid' | 'Collect' | '3rd Party';
}

const CustomerExpenseSchema = new Schema({
  value: { type: Schema.Types.Mixed, required: true },
  desc: { type: Schema.Types.String },
  positive: { type: Boolean, default: false },
  service: { type: Schema.Types.ObjectId, ref: 'ItemService', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true }
}, { _id: false });

const CarrierExpenseSchema = new Schema({
  value: { type: Schema.Types.Mixed, required: true },
  desc: { type: Schema.Types.String },
  positive: { type: Boolean, default: false },
  service: { type: Schema.Types.ObjectId, ref: 'ItemService', required: true }
}, { _id: false });

const CarrierAssignmentSchema = new Schema({
  carrier: { type: Schema.Types.ObjectId, ref: 'Carrier', required: true },
  assignDrivers: [{ type: Schema.Types.ObjectId, ref: 'Driver' }],
  carrierExpense: [CarrierExpenseSchema],
  dispatchRate: { type: Number, min: 0, max: 100, default: 0 },
}, { _id: false });

const LoadItemSchema = new Schema({
  id: { type: Number, required: true },
  itemDetails: { type: String, required: true },
  description: { type: String },
  qty: { type: Number, required: true },
  rate: { type: Number },
  tax: { type: Number },
  amount: { type: Number }
});

const LoadSchema = new Schema({
  loadNumber: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  status: { 
    type: String, 
    enum: Object.values(LoadStatus), 
    default: LoadStatus.PENDING 
  },
  invoiceId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Invoice' 
  },
  commodity: { 
    type: String, 
    required: true 
  },
  loadSize: { 
    type: String, 
    enum: Object.values(LoadSize), 
    required: true 
  },
  customerExpense: [CustomerExpenseSchema],
  declaredValue: { type: Number },
  weight: { type: Number },
  temperature: { type: Number },
  equipmentType: { 
    type: String, 
    enum: Object.values(EquipmentType), 
    required: true 
  },
  equipmentLength: { 
    type: String, 
    enum: ['20', '28', '40', '45', '48', '53'], 
    required: true 
  },
  notes: { type: String },
  loadAmount: { 
    type: Number, 
    required: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  carrierIds: [CarrierAssignmentSchema],
  pickupLocationId: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Location' 
  }],
  deliveryLocationId: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Location' 
  }],
  files: [Schema.Types.Mixed],
  items: [LoadItemSchema],
  freightCharge: { 
    type: String, 
    enum: ['Prepaid', 'Collect', '3rd Party'], 
    default: 'Prepaid' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

LoadSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const existingLoad = await Load.findOne({ loadNumber: this.loadNumber });
      if (existingLoad) {
        throw new AppError('Load number already exists', 400);
      }
      next();
    } catch (error:any) {
      next(error);
    }
  } else {
    next();
  }
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

LoadSchema.index({ loadNumber: 1 });
LoadSchema.index({ status: 1 });
LoadSchema.index({ customerId: 1 });
LoadSchema.index({ 'carrierIds.carrier': 1 });

const Load = model<ILoad>('Load', LoadSchema);
export default Load;
