import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
  admin: mongoose.Schema.Types.ObjectId;
  users: mongoose.Schema.Types.ObjectId[];
  plan: mongoose.Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    status: string;
  };
}

const SubscriptionSchema = new Schema<ISubscription>({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
  // users: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    startDate: { type: Date, required: true },
  endDate: { 
    type: Date, 
    required: true, 
    validate: {
      validator: function (this: ISubscription, value: Date) {
        return value > this.startDate;
      },
      message: "End date must be after the start date.",
    }
  },
  isActive: { 
    type: Boolean, 
    default: true,
    get: function (this: ISubscription) {
      return this.endDate > new Date();
    }
  },
  paymentDetails: {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    status: { type: String, required: true, default: "pending" }, 
  },
});

export const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
