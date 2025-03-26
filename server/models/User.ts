import mongoose, { Model, Schema } from "mongoose";

export interface IUser extends Document {
    _id?: string;
    name: string;
    
    email: string;
    password: string;
    phone: number
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    sessionToken: string | null
}


const userSchema = new Schema<IUser>({
     name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: Number, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    },
    status: { type: String, default: "active", enum: ['active', 'inactive'] },
    sessionToken: { type: String, default: null },
}, { timestamps: true });



export const User = mongoose.model<IUser>("User", userSchema);

