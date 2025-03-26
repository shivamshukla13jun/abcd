import mongoose, { Schema, Document } from 'mongoose';

export interface ItemService extends Document {
  label: string; 
  value: string | number; 
  createdAt: Date;
  updatedAt: Date;
}

const ItemServiceSchema: Schema = new Schema({
  label: { type: String, required: true }, 
  value: { 
    type: Schema.Types.Mixed, 
    enum: ["string", "number"], 
    required: true 
  }
}, {
  timestamps: true 
});

export default mongoose.model<ItemService>('itemservice', ItemServiceSchema);
