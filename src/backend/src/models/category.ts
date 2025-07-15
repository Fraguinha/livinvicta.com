import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  }
});

export interface CategoryDoc extends mongoose.Document {
  name: string;
}

export default mongoose.model<CategoryDoc>('Category', categorySchema);
