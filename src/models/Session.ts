import mongoose, { Schema, Model } from "mongoose"

export interface ISession {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  title: string
  createdAt: Date
  updatedAt: Date
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Prevent model recompilation in development
export const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema)
