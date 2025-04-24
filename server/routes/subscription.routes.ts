import express from "express";
import { adminProtected, protectedRoute } from "../utils/protected";
import * as subscriptionController from "../controllers/subscription.controller";

const subscriptionRouter = express.Router();

// 🚀 Subscription Management Routes
subscriptionRouter
                  .get("/my-plan", protectedRoute, subscriptionController.getMyPlan)
                  .post("/cancel", protectedRoute, subscriptionController.cancelSubscription)
                  // ✅ Subscription Plan Management
                  .post("/buy-free-plan", protectedRoute, subscriptionController.freePlanBuy)
                  .post("/add-plan", adminProtected, subscriptionController.addSubscriptionPlan)
                  .get("/plans", protectedRoute, subscriptionController.getSubscriptionPlans)
                  .put("/update-plan/:id", adminProtected, subscriptionController.updateSubscriptionPlan)
                  .delete("/delete-plan/:id", adminProtected, subscriptionController.deleteSubscriptionPlan)
                  // 💳 Razorpay Payment Integration
                  .post("/create-order", protectedRoute, subscriptionController.createOrder)
                  .post("/verify-payment", protectedRoute, subscriptionController.verifyPayment)
                  // 🔒 Middleware to Check Active Subscription
                  .get("/check-subscription", protectedRoute, subscriptionController.checkSubscription)
.get("/get-all-premium-members", adminProtected, subscriptionController.getAllPremiumUsers)

                  .post("/add-person", protectedRoute, subscriptionController.addPersonToMyAccount)

export default subscriptionRouter;
