import express from "express"
import * as authController from "../controllers/auth.controller"
import { protectedRoute } from "../utils/protected"
import multerMiddleware from "../utils/upload"
const upload = multerMiddleware()


const authRouter = express.Router()

authRouter
    .post("/send-otp-register", authController.requestRegistrationOTP)
    .post("/verify-register", authController.verifyRegistrationOTP)
    .post("/register", authController.registerUser)
    .post("/sign-out",  authController.signOut)
    .post("/send-otp", authController.sendOTPForLogin)
    .post("/verify-otp", authController.verifyOTP)
    .post("/google-login", authController.googleLoginMobile)


export default authRouter