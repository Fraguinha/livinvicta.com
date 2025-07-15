import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  data: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  beforeImage: {
    type: imageSchema,
    required: false,
  },
  afterImage: {
    type: imageSchema,
    required: false,
  },
  gallery: {
    type: [imageSchema],
    required: true,
    default: [],
  },
  features: {
    type: [String],
    required: true,
    default: [],
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    required: true,
    default: false,
  },
})

export interface ImageDoc {
  data: Buffer
  contentType: string
}

export interface ProjectDoc extends mongoose.Document {
  id: string
  title: string
  description: string
  category: string
  beforeImage: ImageDoc
  afterImage: ImageDoc
  gallery: ImageDoc[]
  features: string[]
  location: string
  price: string
  availability: string
  featured: boolean
}

export default mongoose.model<ProjectDoc>('Project', projectSchema)
