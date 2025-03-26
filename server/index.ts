import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cron from "node-cron";
import redisClient from "./services/redisClient";
import authRouter from "./routes/auth.routes";
import passport from "./services/passport"
import userRouter from "./routes/user.routes";
import { protectedRoute } from "./utils/protected";
import transactionRoutes from "./routes/transaction.routes";

dotenv.config()
const app = express()
app.use(express.json())
app.use(express.static("invoices"))
app.use(morgan("dev"))


app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: true,
    credentials: true
}))

app.use(passport.initialize())
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/transaction", transactionRoutes)
app.use("/api/v1/user", protectedRoute, userRouter)


redisClient.on("connect", () => {
    console.log('Connected to Redis');
})

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Resource not found", });
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: "Something went wrong ", error: err.message });
})

mongoose.connect(process.env.MONGO_URL || "").catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});


const PORT = process.env.PORT || 5000
mongoose.connection.once("open", async () => {
    console.log("MongoDb Connected")
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    });
});

