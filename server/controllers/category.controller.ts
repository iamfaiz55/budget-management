import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
// import { Category } from "../models/Category"; // Adjust path as needed
import { IUserProtected } from "../utils/protected"; // User interface with role
// import { Category } from "../models/Plans";
import { User } from "../models/User";
import { Category } from "../models/Categories";
import { invalidateCache } from "../utils/redisMiddleware";
import redisClient from "../services/redisClient";

// ✅ GET: Fetch categories (admin + personal)
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUserProtected;
  const cacheKey = req.originalUrl;

  redisClient.get(cacheKey, async (err, cachedData) => {
    if (err) {
      console.error("Redis GET error:", err);
      // Fallback: proceed with DB fetch if Redis fails
    }

    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      return res.status(200).json(parsed); // Return cached response
    }

    // If cache miss, query MongoDB
    const categories = await Category.find({
      $or: [
        { createdBy: null },               // Global (admin-defined) categories
        { createdBy: user.userId },        // User-created categories
      ],
    }).lean();

    const response = {
      message: "Categories fetched successfully From Redis",
      result: categories,
    };

    // Cache the result for 1 hour
    redisClient.setex(cacheKey, 3600, JSON.stringify(response));

    res.status(200).json({
      message: "Categories fetched successfully",
      result: categories,
    });
  });
});

// ✅ POST: Add category
export const addCategory = asyncHandler(async (req: Request, res: Response) => {
  const user1 = req.user as IUserProtected;
  const { name, type } = req.body;

  if (!name || !type) {
    res.status(400);
    throw new Error("Name and type are required");
  }

  const user = await User.findById(user1.userId)

  const existing = await Category.findOne({ name, createdBy: user?.role === "admin" ? null : user?._id });
  if (existing) {
    res.status(409);
    throw new Error("Category already exists");
  }
// console.log("user id", user?._id);

  const category = await Category.create({
    name,
    type,
    createdBy: user?.role === "admin" ? null : user?._id,
  });
  await invalidateCache("/api/v1/category/get-categories")
// console.log("created category", category);

  res.status(201).json({ message: "Category added successfully", category });
});

// ✅ PUT: Update category
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const user1 = req.user as IUserProtected;
  const { id } = req.params;
  const { name, type } = req.body;
  const user = await User.findById(user1.userId)

  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const isOwner = category.createdBy?.toString() === user?._id.toString();
  const isAdmin = user?.role === "admin" && category.createdBy === null;

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Unauthorized to update this category");
  }

  category.name = name || category.name;
  category.type = type || category.type;
  await category.save();
  await invalidateCache("/api/v1/category/get-categories")

  res.status(200).json({ message: "Category updated successfully", category });
});

// ✅ DELETE: Delete category
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const user1 = req.user as IUserProtected;
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  const user = await User.findById(user1.userId)

  const isOwner = category.createdBy?.toString() === user?._id.toString();
  const isAdmin = user?.role === "admin" && category.createdBy === null;

  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Unauthorized to delete this category");
  }

  await category.deleteOne();
  await invalidateCache("/api/v1/category/get-categories")

  res.status(200).json({ message: "Category deleted successfully" });
});
