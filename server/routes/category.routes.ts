import express from "express";
import * as categoryController from "../controllers/category.controller";
import { protectedRoute } from "../utils/protected";
import multerMiddleware from "../utils/upload";


const categoryRoutes = express.Router();

categoryRoutes
    .get("/", protectedRoute, categoryController.getCategories)

    .post("/", protectedRoute, categoryController.addCategory)

    .put("/:id", protectedRoute, categoryController.updateCategory)

    .delete("/:id", protectedRoute, categoryController.deleteCategory);

export default categoryRoutes;
