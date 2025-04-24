import mongoose, {  Schema } from "mongoose";

export interface IUser extends Document {
    _id?: string;
    name: string;
     email:string;
    mobile: string
    profile: string
    balance: number
    role: 'admin' | 'user';
    myCurrency?: mongoose.Schema.Types.ObjectId;
    status: 'active' | 'inactive';
    sessionToken: string | null
}
export interface IOTP extends Document {
    email?: string;
    mobile?: string;
    otp: string;
    expiry: Date;
  }


const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    mobile: { type: String},
    profile: { type: String},
    email: { type: String, required: true},
    balance: { type:Number},
    myCurrency:{type:mongoose.Schema.ObjectId, ref:"Currency"},
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    },
    status: { type: String, default: "active", enum: ['active', 'inactive'] },
    sessionToken: { type: String, default: null },
}, { timestamps: true });


const otpSchema: Schema<IOTP> = new Schema(
    {
      mobile: {
        type: String,
        required: function (this: IOTP) {
          return !this.email;
        },
      },
      email: {
        type: String,
        required: function (this: IOTP) {
          return !this.mobile;
        },
      },
      otp: {
        type: String,
        required: true,
      },
      expiry: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
      strict: true,
    }
  );
  

export const User = mongoose.model<IUser>("Users", userSchema);
export const OTP = mongoose.model<IOTP>("Otp", otpSchema)


