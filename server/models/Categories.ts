import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  type: "income" | "expense";
  createdBy: Types.ObjectId | null; 
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, 
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
