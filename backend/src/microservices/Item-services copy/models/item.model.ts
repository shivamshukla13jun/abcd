import mongoose, { Schema, Document } from 'mongoose';

export interface ItemService extends Document {
  label: string; 
  value: number; 
  createdAt: Date;
  updatedAt: Date;
}

const ItemServiceSchema: Schema = new Schema({
  
  label: { type: String, required: true }, 
  value: { 
    type: Schema.Types.Number, 
    required: true ,
    min:0,
    max:100
  }
}, {
  timestamps: true ,
  _versionKey: false
});
// create by default one data in the database
// create one default data


export default mongoose.model<ItemService>('taxservices', ItemServiceSchema);
