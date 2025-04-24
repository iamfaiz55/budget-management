import express from "express"
import * as userController from "../controllers/user.controller"
import { adminProtected } from "../utils/protected";
// import multerMiddleware from "../utils/upload"

// const upload = multerMiddleware()

const userRouter = express.Router()

userRouter
    .get("/all-users",adminProtected, userController.getAllUsers)
    .get("/:id", userController.getUserById)
    .post("/add-user",   userController.createUser)
    .put("/update-user/:id", userController.updateUser)
    .put("/update-status/:id",  userController.updateUserStatus)
    .put("/delete-user/:id",  userController.deleteUser)


export default userRouter