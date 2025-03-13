import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  expenseNumber: string;
  carrierId: mongoose.Types.ObjectId;
  loadId?: mongoose.Types.ObjectId;
  expenseType: string;
  amount: number;
  date: Date;
  status: string;
  documentUpload?: {
    files: any[];
    description: string;
  };
  notes?: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  expenseNumber: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `EXP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  },
  carrierId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Carrier', 
    required: true 
  },
  loadId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Load' 
  },
  expenseType: { 
    type: String, 
    enum: ['fuel', 'toll', 'maintenance', 'insurance', 'driver_pay', 'other'],
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  documentUpload: {
    files: [Schema.Types.Mixed],
    description: String
  },
  notes: { 
    type: String 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
