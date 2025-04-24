import mongoose, { Schema, Document } from "mongoose";

export interface ICurrency extends Document {
  code: string;      
  symbol: string;    
  name: string;      
}

const CurrencySchema = new Schema<ICurrency>({
  code: { type: String, required: true, unique: true, uppercase: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
});

export const Currency = mongoose.model<ICurrency>("Currency", CurrencySchema);
