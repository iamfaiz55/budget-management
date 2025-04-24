

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import dotenv from "dotenv";
import { User, OTP } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

export const requestRegistrationOTP = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const {  mobile } = req.body;

    if ( !mobile) {
        return res.status(400).json({ message: "Name and Mobile are required" });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists. Please log in." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.findOneAndUpdate(
        { mobile },
        { mobile,  otp, expiry: otpExpiry },
        { upsert: true, new: true }
    );

    // await sendOTPMessage(mobile, otp);

    res.status(200).json({ message: "OTP sent. Please verify to complete registration.", result: { otp, mobile } });
});



export const verifyRegistrationOTP = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
        return res.status(400).json({ message: "Mobile and OTP are required" });
    }

    const storedOTP = await OTP.findOne({ mobile, otp });

    if (!storedOTP || new Date() > storedOTP.expiry) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const userExists = await User.findOne({ mobile });
    if (userExists) {
        return res.status(409).json({ message: "User already exists. Please log in." });
    }

    // const user = await User.create({ name: storedOTP.name, mobile, role: "user" });

    // const token = generateToken({ userId: user._id, role: user.role });

    await OTP.deleteOne({ mobile });

    res.status(201).json({
        message: "Mobile verified and user registered successfully",
        // result: { _id: user._id, name: user.name, mobile: user.mobile, token },
    });
});



export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { name, mobile, email } = req.body;

    if (!name || !mobile?.trim() || !email?.trim()) {
        return res.status(400).json({ message: "Name, Mobile, and Email are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

    if (existingUser) {
        return res.status(409).json({ message: "User with this email or mobile already exists" });
    }
    
    const mainUser = await User.create({ name, email, mobile, role: "user" });
    
    // console.log("-----run ----", mainUser);
    const token = generateToken({ userId: mainUser._id, role: mainUser.role });

    res.status(200).json({
        message: "User registered successfully.",
        result: {
            _id: mainUser._id,
            name: mainUser.name,
            mobile: mainUser.mobile,
            token,
        },
    });
});


export const verifyOTP = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { username, otp } = req.body;

  if (!username || !otp) {
    return res.status(400).json({ message: "Username (email or mobile) and OTP are required" });
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  const isMobile = /^[0-9]{10}$/.test(username);

  if (!isEmail && !isMobile) {
    return res.status(400).json({ message: "Invalid email or mobile format" });
  }

  const query = isEmail ? { email: username, otp } : { mobile: username, otp };
  const storedOTP = await OTP.findOne(query);

  if (!storedOTP) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (new Date() > storedOTP.expiry) {
    return res.status(400).json({ message: "OTP expired. Please request a new one." });
  }

  const userQuery = isEmail ? { email: username } : { mobile: username };
  let user = await User.findOne(userQuery);

  if (!user) {
     return res.status(409).json({message:"User Not Found Register Please"})
  }

  const token = generateToken({ userId: user._id, role: user.role });

  await OTP.deleteOne(query);

  res.status(201).json({
    message: "Verification successful",
    result: {
      _id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      token,
    },
  });
});

export const sendOTPForLogin = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { username } = req.body;
// console.log("username", username);

    if (!username) {
        return res.status(400).json({ message: "Username (email or mobile) is required" });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const isMobile = /^[0-9]{10}$/.test(username);

    if (!isEmail && !isMobile) {
        return res.status(400).json({ message: "Invalid email or mobile number format" });
    }

    const query = isEmail ? { email: username } : { mobile: username };

    const user = await User.findOne(query);
    if (!user) {
        return res.status(404).json({ message: "User not found with provided email or mobile number" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const payload = { ...query, otp, expiry: otpExpiry };

    await OTP.findOneAndUpdate(query, payload, { upsert: true, new: true });

    if (isEmail) {
        console.log(`OTP sent to email: ${username}`);
    } else {
        console.log(`OTP sent to mobile: ${username}`);
    }

    res.status(200).json({
        message: "OTP sent successfully",
        result: {
            userId: user._id,
            otp,
        },
    });
});


/**
 * Step 4: Sign Out
 */
export const signOut = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ message: "Logged out successfully" });
});


export const googleLoginMobile = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { idToken } = req.body
// console.log("idtoken", idToken);

    if (!idToken) {
        return res.status(400).json({ message: 'Missing Google ID token' });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
// console.log(" process.env.GOOGLE_CLIENT_ID :", process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
// console.log("ticket", ticket);

    const payload = ticket.getPayload();
    if (!payload) {
        return res.status(401).json({ message: 'Invalid token payload' });
    }
    
    const { name, email, picture } = payload
    const user = await User.findOne({ email }).lean()
    // console.log("user", user);

    if (user) {
        const token = generateToken({ userId: user._id, name: user.name, role: user.role })

      
        res.status(200).json({ message: "Sign In Successfully", result:{
            _id: user._id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            role: user.role,
            token,
        }  })

    } else {
        // console.log("newUser creating");
        const newUser = await User.create({
            name,
            email,
            profile: picture,
            role:"user"
        })
        console.log("newUser", newUser);
        const token = generateToken({ userId: newUser._id, role: newUser.role });

     

        return res.status(200).json({ message: "Sign Up Successfully", result:{
            _id: newUser._id,
            name: newUser.name,
            mobile: newUser.mobile,
            email: newUser.email,
            role: newUser.role,
            token,
        } })
    }

})
