import { Request, Response } from "express";
import mongoose from "mongoose";
import FoodItem from "../models/FoodItem";
import Restaurant from "../models/Restaurant";
import Category from "../models/Category";

// GET /api/food-items
export const getFoodItems = async (
  req: Request<{}, {}, {}, { restaurantId?: string; categoryId?: string }>,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId, categoryId } = req.query;

    const filter: any = {
      isActive: true,
    };

    if (restaurantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        res.status(400).json({
          success: false,
          message: "Invalid restaurantId",
        });
        return;
      }

      filter.restaurantId = restaurantId;
    }

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        res.status(400).json({
          success: false,
          message: "Invalid categoryId",
        });
        return;
      }

      filter.categoryId = categoryId;
    }

    const foodItems = await FoodItem.find(filter)
      .populate("restaurantId", "name")
      .populate("categoryId", "name")
      .sort({ sortOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foodItems.length,
      data: foodItems,
    });
  } catch (error) {
    console.error("Get food items error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch food items",
    });
  }
};

// GET /api/food-items/:id
export const getFoodItemById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
      return;
    }

    const foodItem = await FoodItem.findOne({
      _id: id,
      isActive: true,
    })
      .populate("restaurantId", "name")
      .populate("categoryId", "name");

    if (!foodItem) {
      res.status(404).json({
        success: false,
        message: "Food item not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: foodItem,
    });
  } catch (error) {
    console.error("Get food item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch food item",
    });
  }
};

// POST /api/food-items
export const createFoodItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      restaurantId,
      categoryId,
      name,
      description,
      price,
      image,
      isVeg,
      isAvailable,
      sortOrder,
    } = req.body;

    if (
      !restaurantId ||
      !categoryId ||
      !name ||
      !description ||
      price === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          "restaurantId, categoryId, name, description and price are required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({
        success: false,
        message: "Invalid restaurantId",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({
        success: false,
        message: "Invalid categoryId",
      });
      return;
    }

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      isActive: true,
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    const category = await Category.findOne({
      _id: categoryId,
      restaurantId,
      isActive: true,
    });

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found for this restaurant",
      });
      return;
    }

    const foodItem = await FoodItem.create({
      restaurantId,
      categoryId,
      name,
      description,
      price,
      image: image || "",
      isVeg: isVeg ?? true,
      isAvailable: isAvailable ?? true,
      sortOrder: sortOrder ?? 0,
    });

    res.status(201).json({
      success: true,
      message: "Food item created successfully",
      data: foodItem,
    });
  } catch (error) {
    console.error("Create food item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create food item",
    });
  }
};

// PUT /api/food-items/:id
export const updateFoodItem = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
      return;
    }

    const foodItem = await FoodItem.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!foodItem) {
      res.status(404).json({
        success: false,
        message: "Food item not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      data: foodItem,
    });
  } catch (error) {
    console.error("Update food item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update food item",
    });
  }
};

// DELETE /api/food-items/:id
export const deleteFoodItem = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
      return;
    }

    const foodItem = await FoodItem.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
      },
      {
        isActive: false,
      },
      {
        new: true,
      }
    );

    if (!foodItem) {
      res.status(404).json({
        success: false,
        message: "Food item not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    console.error("Delete food item error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete food item",
    });
  }
};