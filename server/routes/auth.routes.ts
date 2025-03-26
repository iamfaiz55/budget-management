import express from "express"
import * as authController from "../controllers/auth.controller"
import { protectedRoute } from "../utils/protected"
import multerMiddleware from "../utils/upload"
const upload = multerMiddleware()


const authRouter = express.Router()

authRouter
    .post("/sign-in", authController.signIn)
    .post("/register", authController.register)
    .post("/sign-out",  authController.signOut)
    .post("/send-otp", authController.sendOTP)
    .post("/verify-otp", authController.verifyOTP)
    .post("/forgot-password", authController.forgotPassword)
    .put("/reset-password", authController.resetPassword)

export default authRouter