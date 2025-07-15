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
    required: true,
  },
  afterImage: {
    type: imageSchema,
    required: true,
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
  client: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: true,
  },
  duration: {
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
  client: string
  budget: string
  duration: string
  featured: boolean
}

export default mongoose.model<ProjectDoc>('Project', projectSchema)
