import mongoose, { Schema, Model } from "mongoose"

export interface IUser {
  _id: mongoose.Types.ObjectId
  email: string
  name: string
  image?: string
  githubId: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model recompilation in development
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema)
