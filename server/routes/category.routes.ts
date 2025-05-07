import express from "express";
import * as categoryController from "../controllers/category.controller";
import { protectedRoute } from "../utils/protected";
import multerMiddleware from "../utils/upload";


const categoryRoutes = express.Router();

categoryRoutes
    .get("/get-categories", protectedRoute, categoryController.getCategories)

    .post("/add-category", protectedRoute, categoryController.addCategory)

    .put("/category/:id", protectedRoute, categoryController.updateCategory)

    .delete("/category/:id", protectedRoute, categoryController.deleteCategory);

export default categoryRoutes;
