import mongoose, { Model, mongo, Schema } from "mongoose";

export interface ITransaction extends Document {
    _id?: string;
    date: string;
    note?:string;
    category: string;
    amount:number;
    isTransfered:boolean;
    account: string
    type:string;
    // status: 'active' | 'inactive';
    user:mongoose.Schema.Types.ObjectId
}


const transactionSchema = new Schema<ITransaction>({
    date: { type: String, required: true },
    note: { type: String },
    type: { type: String, required:true },
    category: { type: String },
    amount: { type: Number, required: true, },
    isTransfered: { type:Boolean, default:false, },
    account: { type: String, required: true },
  user:{type:mongoose.Schema.ObjectId, ref:"Users"}
}, { timestamps: true });



export const Transactions = mongoose.model<ITransaction>("Transactions", transactionSchema);

