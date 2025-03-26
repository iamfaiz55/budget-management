import { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import bcryptjs from "bcryptjs"
import jwt, { JwtPayload } from "jsonwebtoken"
import crypto from "crypto"
import {  IUser,  User } from "../models/User"
import { sendEmail } from "../utils/email"
import { customValidator } from "../utils/validator"
import { forgotPasswordRules, registerRules, resetPasswordRules, sendOTPRules, signInRules, verifyOTPRules } from "../rules/auth.rules"
import { generateResetToken, generateToken } from "../utils/generateToken"
import { otpVerificationTemplate } from "../templates/otpVerificationTemplate"
import { resetPasswordTemplate } from "../templates/resetPasswordTemplate"
import dotenv from "dotenv";
import { IUserProtected } from "../utils/protected"
import cloudinary from "../utils/uploadConfig"
import { log } from "console"
dotenv.config({})

// Sign In
export const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email, password }: IUser = req.body

    const { isError, error } = customValidator(req.body, signInRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    const user = await User.findOne({ email }).select("-password, -__v, -updatedAt, -createdAt").lean()

    if (!user) {
        return res.status(401).json({ message: "Invalid Credential - Email not found" })
    }


    const verifyPassword = await bcryptjs.compare(password, user.password)
    if (!verifyPassword) {
        return res.status(401).json({ message: "Invalid Credential - Password do not match" })
    }

    if (user.status === "inactive") {
        return res.status(403).json({ message: "Your account has been deactivated. Contact support." });
    }

    const token = generateToken({ userId: user._id, role: user.role })

    // await User.findByIdAndUpdate(user._id, { sessionToken: token })

    const result = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
         token
    }
    res.status(200).json({ message: "Logged in successfully", result })
})

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { name, email, phone, role, password } = req.body
    const user = await User.findOne({ $or: [{ email }, { phone }] })
    // log("userrr", user);

    if (user) {
        if (user.email == email) {
            return res.status(409).json({ message: "Email already exist" })
        }
        if (user.phone == phone) {
            return res.status(409).json({ message: "Phone number already exist" })
        }
    }

 


        // let data = {name, email, phone, role, password}

   
        const { isError, error } = customValidator( {name, email, phone, role, password}, registerRules)

        if (isError) {
            console.log("result", error);
            return res.status(422).json({ message: "Validation errors", error });
        }
        const hashPassword = await bcryptjs.hash(password, 10)

try {
    const result = await User.create({  name, email, phone, role,  password: hashPassword })

} catch (error) {
console.log("error", error);
    
}    



    res.status(200).json({ message: "User registered and email sent successfully" })
})
// Sign Out
export const signOut = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const token = req.headers.authorization?.split(" ")[1];
console.log("token", token);


   

    res.status(200).json({ message: "Logged out successfully" });
});

// Send OTP
export const sendOTP = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    // const { username }: IOTP = req.body
    // const { isError, error } = customValidator(req.body, sendOTPRules)

    // if (isError) {
    //     return res.status(422).json({ message: "Validation errors", error });
    // }

    // const otp = crypto.randomInt(100000, 999999).toString();
    // const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    // await OTP.create({ username, otp, expiry: otpExpiry })

    // const otpVerificationTemp = otpVerificationTemplate(otp)

    // await sendEmail({
    //     to: username,
    //     subject: 'Your OTP Code',
    //     text: otpVerificationTemp,
    // });

    // res.status(200).json({ message: "OTP sent successfully" })
})

// Verify OTP
export const verifyOTP = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    // const { username, otp }: IOTP = req.body

    // const { isError, error } = customValidator(req.body, verifyOTPRules)

    // if (isError) {
    //     return res.status(422).json({ message: "Validation errors", error });
    // }

    // const result = await OTP.findOne({ username, otp })

    // if (!result) {
    //     return res.status(400).json({ message: "Invalid OTP or expired" })
    // }

    // if (result) {
    //     if (new Date() > result?.expiry) {
    //         return res.status(400).json({ message: "OTP expired" })
    //     }

    //     if (result?.otp !== otp) {
    //         return res.status(400).json({ message: "Invalid OTP" })
    //     }
    // }

    // await OTP.deleteOne({ username, otp });
    // res.status(200).json({ message: "OTP verified successfully" })

})


export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { email } = req.body

    const { isError, error } = customValidator(req.body, forgotPasswordRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    const user = await User.findOne({ email }).lean()

    if (!user) {
        return res.status(404).json({ message: "User not found with given email" })
    }

    const resetToken = await generateResetToken({ email })
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const resetPasswordTemp = resetPasswordTemplate(resetLink)

    await sendEmail({
        to: email,
        subject: "Password Reset Request",
        text: resetPasswordTemp
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
})

// Reset Password
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { password, confirmPassword, token } = req.body

    const { isError, error } = customValidator(req.body, resetPasswordRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password do not match" })
    }

    const secretKey = process.env.JWT_KEY

    let decodedToken: string | JwtPayload | null = null

    try {
        if (secretKey) {
            decodedToken = jwt.verify(token, secretKey);
        }
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    if (!decodedToken) {
        return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    const email = (decodedToken as JwtPayload).email
    if (!email) {
        return res.status(422).json({ message: "Email not verified" })
    }

    const user = await User.findOne({ email }).lean()

    const hashPass = await bcryptjs.hash(password, 10)

    await User.findByIdAndUpdate(user?._id, { password: hashPass })

    res.status(200).json({ message: "Password reset success" })
})

