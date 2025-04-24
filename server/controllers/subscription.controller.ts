import Razorpay from "razorpay";
import crypto from "crypto";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
// import { SubscriptionPlan } from "../models/SubscriptionPlan";
import { ISubscription, Subscription } from "../models/Subscription";
import { v4 as uuidv4 } from "uuid";
// import { SubscriptionPlan } from "../models/Plans";
import mongoose from "mongoose";
import { SubscriptionPlan } from "../models/Plans";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY as string,
  key_secret: process.env.RAZORPAY_API_SECRET as string,
});


export const freePlanBuy = asyncHandler(async(req:Request, res:Response):Promise<any> => {
  const {planId}=req.body
  const loggedUser: any = req.user;
  if (!loggedUser || !loggedUser.userId) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }
  const plan = await SubscriptionPlan.findById(planId);
  // console.log("plan data", plan);
  
  if (!plan) {
    return res.status(400).json({ message: "Invalid subscription plan" });
  }
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + plan.duration);

  const newSubscription = await Subscription.create([
      {
        admin: loggedUser.userId,
        users: [],
        plan: plan._id,
        startDate,
        endDate,
        isActive: true,
      },
    ]);
     res.status(201).json({
      message: "Free Subscription successful",
      result: newSubscription[0], 
    });
})

export const createOrder = asyncHandler(async (req: Request, res: Response):Promise<any> => {
  const { planId } = req.body;
  const loggedUser: any = req.user;

  if (!loggedUser || !loggedUser.userId) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }
  // console.log("planId :",planId);
  

  const plan = await SubscriptionPlan.findById(planId);
  // console.log("plan data", plan);
  
  if (!plan) {
    return res.status(400).json({ message: "Invalid subscription plan" });
  }

  const amount = plan.price * 100;

  const options = {
    amount,
    currency: "INR",
    receipt: uuidv4(), 
    payment_capture: 1, 
  };

  const order = await razorpay.orders.create(options);

  res.status(201).json({message:"Amount Catured Success",result:{    
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    planId:plan._id,
    key_id: process.env.RAZORPAY_API_KEY,
  
  }

  });
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId} = req.body;
  const loggedUser: any = req.user;

  if (!loggedUser || !loggedUser.userId) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  const secret = process.env.RAZORPAY_API_SECRET as string;
  if (!secret) {
    return res.status(500).json({ message: "Payment configuration error: RAZORPAY_API_SECRET is missing" });
  }

  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) {
    return res.status(400).json({ message: "Invalid subscription plan" });
  }
// console.log("plan   : ", plan);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);


    await Subscription.updateMany(
      { admin: loggedUser.userId },
      { isActive: false },
      { session }
    );


    const newSubscription = await Subscription.create(
      [
        {
          admin: loggedUser.userId,
          users: [],
          plan: plan._id,
          startDate,
          endDate,
          isActive: true,
          paymentDetails: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            status: "paid",
          },
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // console.log("newSubscription : ", newSubscription);
    
    return res.status(201).json({
      message: "Subscription successful",
      result: newSubscription[0], 
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    return res.status(500).json({ message: "Payment verification failed, transaction aborted" });
  }
});

export const getMyPlan = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const loggedUser: any = req.user;

  if (!loggedUser || !loggedUser.userId) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  const subscription = await Subscription.findOne({
    admin: loggedUser.userId,

  }).populate("plan").populate("admin").populate("users");
// console.log("subscription : ", subscription);

  if (!subscription) {
    return res.status(404).json({ message: "No active subscription found" });
  }

  return res.status(200).json({message:"My Plan Fetch Successfully",result: subscription });
});

export const cancelSubscription = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const loggedUser: any = req.user;

  if (!loggedUser || !loggedUser.userId) {
    return res.status(401).json({ message: "Unauthorized: User not logged in" });
  }

  const subscription = await Subscription.findOne({
    user: loggedUser.userId,
    isActive: true,
  });

  if (!subscription) {
    return res.status(404).json({ message: "No active subscription to cancel" });
  }

  subscription.isActive = false;
  await subscription.save();

  return res.status(200).json({ message: "Subscription cancelled successfully" });
});

interface AuthenticatedRequest extends Request {
  user?: any; 
  subscription?: ISubscription;
}


export const checkSubscription = asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next): Promise<any> => {
      const loggedUser = req.user;
  
      if (!loggedUser || !loggedUser.userId) {
        return res.status(401).json({ message: "Unauthorized: User not logged in" });
      }
  
      const subscription = await Subscription.findOne({
        user: loggedUser.userId,
        isActive: true,
      });
  
      if (!subscription) {
        return res.status(403).json({ message: "Access denied: No active subscription" });
      }
  
      req.subscription = subscription; 
      next();
    }
  );
  

export const addSubscriptionPlan = asyncHandler(async (req: Request, res: Response) : Promise<any>=> {
    const { name, price, maxUsers, duration } = req.body;
  
    if (!name  || !maxUsers || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    const existingPlan = await SubscriptionPlan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({ message: "Plan name already exists" });
    }
  
    const plan = await SubscriptionPlan.create({ name, price, maxUsers, duration });
    res.status(201).json({ message: "Plan created successfully", plan });
  });
  
export const getSubscriptionPlans = asyncHandler(async (req: Request, res: Response) => {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({ message:"All Plans Fetch Success", result:plans });
  });
  
export const updateSubscriptionPlan = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { name, price, maxUsers, duration } = req.body;
  
    const plan = await SubscriptionPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
  
    plan.name = name || plan.name;
    plan.price = price || 0 
    plan.maxUsers = maxUsers || plan.maxUsers;
    plan.duration = duration || plan.duration;
  
    await plan.save();
    res.status(200).json({ message: "Plan updated successfully", plan });
});
  
export const deleteSubscriptionPlan = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
  
    const plan = await SubscriptionPlan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
  
    await plan.deleteOne();
    res.status(200).json({ message: "Plan deleted successfully" });
  });

  export const addPersonToMyAccount = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { personId } = req.body;
  
    let loggedUser: any = req.user;
  
    const plan = await Subscription.findOne({ admin: loggedUser.userId });
  
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
  
    // Avoid duplicate entries
    if (plan.users.includes(personId)) {
      return res.status(400).json({ message: "Person already added to your plan" });
    }
  
    plan.users.push(personId);
    await plan.save();
  
    res.status(200).json({ message: "Person added successfully" });
  });
  
  export const getAllPremiumUsers = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const subscriptions = await Subscription.find({ isActive: true })
      .populate("admin") 
      .populate("users") 
      .populate("plan");
  
    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({ message: "No active premium users found" });
    }
  
    res.status(200).json({
      message: "All premium users fetched successfully",
      result: subscriptions,
    });
  });
  