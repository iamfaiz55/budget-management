import {  Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { customValidator, validationRulesSchema } from "../utils/validator"
import { Transactions } from "../models/Transaction"
import { Subscription } from "../models/Subscription"
import { User } from "../models/User"
import redisClient from "../services/redisClient"
import { invalidateCache } from "../utils/redisMiddleware"


const transactionRules: validationRulesSchema = {
    date:{required:true},
      category:{required:true},
    //    amount:{required:true, number:true},
        account:{required:true},
         type:{required:true}
} 

export const addTransaction = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const { date, note, category, amount, account, type } = req.body;

  const { isError, error } = customValidator(
    { date, note, category, amount, account, type },
    transactionRules
  );
  
  
  if (isError) {
    return res.status(422).json({ message: "Validation errors", error });
  }
  
  const loggedUser: any = req.user;
  
  if (!loggedUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  
  const user = await User.findById(loggedUser.userId);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  

  const amount2 = Number(amount);
  if (isNaN(amount2) || amount2 <= 0) {
    return res.status(400).json({ message: "Invalid transaction amount" });
  }
  
  if (type === "expense" && amount > user.balance) {
    return res.status(400).json({ message: "Insufficient balance" });
  }
  
  const transaction = await Transactions.create({ ...req.body, user: loggedUser.userId, amount });
  
  if (type === "income") {
    user.balance += amount;
  } else if (type === "expense") {
    user.balance -= amount;
  }
  // console.log("transaction user saved ;",user.balance );

  await user.save();
  await invalidateCache("/api/v1/transaction/get-transactions")

  res.status(200).json({ message: "Transaction Added Success" });
});


export const getAllTransactions = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  const cacheKey = req.originalUrl;

  redisClient.get(cacheKey, async (err, cachedData) => {
      if (err) {
          console.error("Redis GET error:", err);
          // Fallback to DB query if Redis fails
      }

      if (cachedData) {
          const parsed = JSON.parse(cachedData);
          return res.status(200).json(parsed);
      }

      // Proceed with DB queries if cache miss
      let loggedUser: any = req.user;

      const planBuyed = await Subscription.findOne({ admin: loggedUser.userId }).populate("users");

      let userIds = [loggedUser.userId];

      if (planBuyed) {
          const planUserIds = planBuyed.users.map((user: any) => user._id.toString());
          userIds = [...new Set([...userIds, ...planUserIds])];
      }

      const transactions = await Transactions.find({ user: { $in: userIds } }).populate("user");
      const user = await User.findById(loggedUser.userId);
      const balance = user?.balance || 0;

      const response = {
          message: "Transaction Fetch success From Redis",
          result: transactions,
          balance,
      };

      redisClient.setex(cacheKey, 3600, JSON.stringify(response)); // Cache for 1 hour

      res.status(200).json({
          message: "Transaction Fetch Success",
          result: transactions,
          balance,
      });
  });
});






export const transactionsByDate = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { fromDate, toDate } = req.body;
    const loggedUser: any = req.user;

    if (!loggedUser || !loggedUser.userId) {
        return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    if (!fromDate || !toDate) {
        return res.status(400).json({ message: "Both fromDate and toDate are required" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
    }

    end.setHours(23, 59, 59, 999);

    // Get all userIds: loggedUser + users under the subscription
    let userIds = [loggedUser.userId];

    const planBuyed = await Subscription.findOne({ admin: loggedUser.userId }).populate("users");

    if (planBuyed) {
        const planUserIds = planBuyed.users.map((user: any) => user._id.toString());
        userIds = [...new Set([...userIds, ...planUserIds])];
    }

    const result = await Transactions.find({
        user: { $in: userIds },
        createdAt: { $gte: start, $lte: end },
    })
    .sort({ createdAt: -1 })
    .populate("user");
  
    await invalidateCache("/api/v1/transaction/get-transactions")

    return res.status(200).json({ message: "Transaction Fetch Success", result });
});

export const addAmountToMember = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    const { memberId, amount, date, account } = req.body;
    const loggedUser: any = req.user;
  
    if (!loggedUser || !loggedUser.userId) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }
  
    if (!memberId || !amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid input: memberId and amount required" });
    }
  
    try {
      const subscription = await Subscription.findOne({ admin: loggedUser.userId }).populate("users");
  
      if (!subscription) {
        return res.status(403).json({ message: "No active subscription found for this admin" });
      }
  
      const memberExists = subscription.users.some((user: any) => user._id.toString() === memberId);
  
      if (!memberExists) {
        return res.status(403).json({ message: "Member not part of your subscription" });
      }
  
      const member = await User.findById(memberId);
      const admin = await User.findById(loggedUser.userId);
  
      if (!member || !admin) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if admin has enough balance
      if (admin.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
  
      // Create expense transaction for admin
      const adminExpenseTxn = await Transactions.create({
        user: admin._id,
        amount: amount,
        type: "expense",
        category: "Transfer to member",
        isTransfered:true,
        note: `Sent to ${member.name}`,
        date,
        account
      });
  
      // Create income transaction for member
      const memberIncomeTxn = await Transactions.create({
        user: member._id,
        amount: amount,
        type: "income",
        category: "Received from admin",
        note: `Received from ${admin.name}`,
        date,
        isTransfered:true,
        account
      });
  
      // Update balances
      admin.balance -= amount;
      member.balance += amount;
  
      await admin.save();
      await member.save();
      await invalidateCache("/api/v1/transaction/get-transactions")

      return res.status(200).json({
        message: "Amount transferred successfully",
        result: {
          adminTransaction: adminExpenseTxn,
          memberTransaction: memberIncomeTxn,
          adminBalance: admin.balance,
          memberBalance: member.balance,
        },
      });
  
    } catch (error) {
      console.error("Error transferring amount:", error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  });
  

