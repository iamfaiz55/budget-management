import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string;
  price: number;
  maxUsers: number;
  duration: number; 
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    maxUsers: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

export const SubscriptionPlan = mongoose.model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionPlanSchema
); 