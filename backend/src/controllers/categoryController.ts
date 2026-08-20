import { Request, Response } from "express";
import mongoose from "mongoose";
import Category from "../models/Category";

// GET /api/categories
// Optional query: /api/categories?restaurantId=xyz
export const getCategories = async (
  req: Request<{}, {}, {}, { restaurantId?: string }>,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId } = req.query;

    const filter: any = {
      isActive: true,
    };

    if (restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        res.status(400).json({
          success: false,
          message: "Invalid restaurant ID",
        });
        return;
      }

      filter.restaurantId = restaurantId;
    }

    const categories = await Category.find(filter).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// GET /api/categories/:id
export const getCategoryById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const category = await Category.findOne({
      _id: id,
      isActive: true,
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

// POST /api/categories
export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      restaurantId,
      image,
      isActive,
    } = req.body;

    if (!name || !restaurantId) {
      res.status(400).json({
        success: false,
        message: "Name and restaurantId are required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
      return;
    }

    const category = await Category.create({
      name,
      description,
      restaurantId,
      image,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// PUT /api/categories/:id
export const updateCategory = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// DELETE /api/categories/:id
export const deleteCategory = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};