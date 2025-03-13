import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  loadId: mongoose.Types.ObjectId;
  status: string;
  invoiceDate: Date;
  dueDate: Date;
  location: string;
  terms: string;
  customerNotes: string;
  terms_conditions: string;
  discountPercent: number;
  deposit: number;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  invoiceNumber: { 
    type: String, 
    required: true, 
    ref: 'Load',
    unique: true 
  },
  loadId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Load', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'partially_paid', 'paid', 'overdue', 'cancelled'],
    default: 'pending'
  },
  invoiceDate: { 
    type: Date, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  location: { 
    type: String
  },
  terms: { 
    type: String
  },
  customerNotes: { 
    type: String 
  },
  terms_conditions: { 
    type: String 
  },
  discountPercent: { 
    type: Number, 
    default: 0 
  },
  deposit: { 
    type: Number, 
    default: 0 
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if invoice is overdue
InvoiceSchema.virtual('isOverdue').get(function(this: any) {
  return this.status !== 'paid' && this.dueDate < new Date();
});

// Pre-save middleware to update status based on payments
InvoiceSchema.pre('save', function(this: any, next) {
  if (this.paidAmount === 0) {
    this.status = 'pending';
  } else if (this.paidAmount < this.total) {
    this.status = 'partially_paid';
  } else if (this.paidAmount === this.total) {
    this.status = 'paid';
  }
  
  if (this.status !== 'paid' && this.dueDate < new Date()) {
    this.status = 'overdue';
  }
  
  next();
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
