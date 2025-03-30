
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;       // Reference to User model
  tax?: Types.ObjectId;                  // Reference to Tax model
  invoiceNumber: string;                 // Unique invoice identifier
  loadId: mongoose.Types.ObjectId;       // Reference to Load model
  status: string;                        // Invoice payment status
  invoiceDate: Date;                     // Date invoice was created
  dueDate: Date;                         // Payment due date
  location: string;                      // Invoice location/address
  terms: mongoose.Types.ObjectId;        // Reference to Terms model
  customerNotes: string;                 // Notes for customer
  terms_conditions: string;              // Terms and conditions
  discountPercent: number;              // Discount percentage
  deposit: number;                       // Initial deposit amount
  paymentOptions: string;               // Payment method options
  createdAt: Date;                      // Record creation timestamp
  updatedAt: Date;                      // Record update timestamp
}

const InvoiceSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  tax: {
    type: Schema.Types.ObjectId,
    ref: 'taxservices'
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
    type: mongoose.Types.ObjectId, 
    ref: 'Terms',
    required: true 
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
  paymentOptions: {
    type: String,
    required: true,
    enum: ['Credit Card', 'Cash', 'Check', 'Wire']
  }
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
