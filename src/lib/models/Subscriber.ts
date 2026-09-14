import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export type SubscriberDocument = InferSchemaType<typeof subscriberSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Subscriber: Model<SubscriberDocument> =
  mongoose.models.Subscriber ??
  mongoose.model<SubscriberDocument>("Subscriber", subscriberSchema);
