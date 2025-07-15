import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
  },
})

export interface UserDoc extends mongoose.Document {
  email: string
  password?: string
  googleId?: string
  date: Date
  role: "admin" | "user"
}

export default mongoose.model<UserDoc>('User', userSchema)
