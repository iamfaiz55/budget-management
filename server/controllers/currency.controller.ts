import Razorpay from "razorpay";
import crypto from "crypto";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
// import { SubscriptionPlan } from "../models/SubscriptionPlan";
import { ISubscription, Subscription } from "../models/Subscription";
import { v4 as uuidv4 } from "uuid";
import { SubscriptionPlan } from "../models/Plans";
import { customValidator, validationRulesSchema } from "../utils/validator";
import { Currency } from "../models/Currency";

const currencyRules: validationRulesSchema = {
    code:{required:true},
    name:{required:true},
    symbol:{required:true},
    
} 
export const createCurrency = asyncHandler(async (req: Request, res: Response):Promise<any> => {
  const {code, name, symbol } = req.body;
  
   const { isError, error } = customValidator(
      { code, name, symbol },
      currencyRules
    );
    if (isError) {
      return res.status(422).json({ message: "Validation errors", error });
    }

    await Currency.create({name, code, symbol})

    res.status(201).json({message:"currency added success"})
});
export const getAllCurrencies = asyncHandler(async (req: Request, res: Response):Promise<any> => {

    const result = await Currency.find()

    res.status(201).json({message:"currencies Fetch success", result})
});
export const makeMyCurrency = asyncHandler(async (req: Request, res: Response):Promise<any> => {

    const result = await Currency.find()

    res.status(201).json({message:"currencies Fetch success", result})
});