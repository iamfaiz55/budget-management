import express from "express"
import * as transactionController from "../controllers/transaction.controller"
import { protectedRoute } from "../utils/protected"
import multerMiddleware from "../utils/upload"
const upload = multerMiddleware()


const transactionRoutes = express.Router()

transactionRoutes

    .post("/add-transaction", protectedRoute, transactionController.addTransaction)
    .post("/transaction-by-date", protectedRoute, transactionController.transactionsByDate)
    .get("/get-transactions", protectedRoute, transactionController.getAllTransactions)
    .post("/add-amount-to-member", protectedRoute, transactionController.addAmountToMember)
 

export default transactionRoutes