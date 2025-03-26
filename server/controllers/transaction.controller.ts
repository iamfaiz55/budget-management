import {  Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { customValidator, validationRulesSchema } from "../utils/validator"
import { Transactions } from "../models/Transaction"


const transactionRules: validationRulesSchema = {
    date:{required:true},
      category:{required:true},
       amount:{required:true},
        account:{required:true},
         type:{required:true}
} 

export const addTransaction = asyncHandler(async(req:Request, res:Response):Promise<any>=>{
    const { date, note, category, amount, account, type}=req.body
    const { isError, error } = customValidator(
         {date, note, category, amount, account, type},
          transactionRules)
    
     if (isError) {
         console.log("result", error);
         return res.status(422).json({ message: "Validation errors", error });
     }
     let loggedUser:any = req.user 
     console.log("loggedUser Check :",loggedUser);
     
if(loggedUser){
    await Transactions.create({...req.body, user: loggedUser.userId})

    res.status(200).json({message:"Transaction Added Succcess"})
}

})

export const getAllTransactions = asyncHandler(async(req:Request, res:Response):Promise<any>=>{
  
    let loggedUser:any = req.user
    // console.log("loggedUser Check :",loggedUser);

    const result = await Transactions.find({user:loggedUser.userId})
    // console.log("result Check :", result);


     res.status(200).json({message:"Transaction Fetch Succcess", result})

})



export const transactionsByDate = asyncHandler(async (req: Request, res: Response): Promise<any> => {

        const { fromDate, toDate } = req.body;
        // console.log("req.body : ", req.body);
        
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

        const result = await Transactions.find({
            user: loggedUser.userId,
            createdAt: { $gte: start, $lte: end },
        }).sort({ createdAt: -1 });
        // console.log("result : ", result);
         

        return res.status(200).json({ message: "Transaction Fetch Success", result });
  
});

