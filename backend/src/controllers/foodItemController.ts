import { Response } from "express";
import mongoose from "mongoose";
import FoodItem from "../models/FoodItem";
import Restaurant from "../models/Restaurant";
import Category from "../models/Category";
import { AuthRequest, getRoleName } from "../middleware/authMiddleware";

// GET /api/food-items
export const getFoodItems = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId, categoryId } = req.query as { restaurantId?: string; categoryId?: string };
    const roleName = getRoleName(req);
    const tenantId = roleName === "restaurantadmin" ? req.user?.restaurantId : null;
    if (roleName === "restaurantadmin" && !tenantId) {
      res.status(403).json({ success: false, message: "A restaurant assignment is required" });
      return;
    }
    if (tenantId && restaurantId && restaurantId !== tenantId) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }

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
    if (tenantId) filter.restaurantId = tenantId;

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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
      return;
    }

    const roleName = getRoleName(req);
    const tenantId = roleName === "restaurantadmin" ? req.user?.restaurantId : null;
    if (roleName === "restaurantadmin" && !tenantId) {
      res.status(403).json({ success: false, message: "A restaurant assignment is required" });
      return;
    }
    const foodItem = await FoodItem.findOne({
      _id: id,
      isActive: true,
      ...(tenantId ? { restaurantId: tenantId } : {}),
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
  req: AuthRequest,
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

    const roleName = getRoleName(req);
    const tenantId = roleName === "restaurantadmin" ? req.user?.restaurantId : null;
    if (
      (!restaurantId && !tenantId) ||
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

    const targetRestaurantId = tenantId || restaurantId;
    if (tenantId && restaurantId && restaurantId !== tenantId) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    if (!targetRestaurantId || !mongoose.Types.ObjectId.isValid(targetRestaurantId)) {
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
      _id: targetRestaurantId,
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
      restaurantId: targetRestaurantId,
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
      restaurantId: targetRestaurantId,
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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
      return;
    }

    const roleName = getRoleName(req);
    const tenantId = roleName === "restaurantadmin" ? req.user?.restaurantId : null;
    if (tenantId && req.body.restaurantId && req.body.restaurantId !== tenantId) {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
    const { restaurantId: _restaurantId, ...updates } = req.body;
    if (tenantId && updates.categoryId) {
      const category = await Category.findOne({ _id: updates.categoryId, restaurantId: tenantId, isActive: true });
      if (!category) {
        res.status(403).json({ success: false, message: "Category is outside your restaurant" });
        return;
      }
    }
    const foodItem = await FoodItem.findOneAndUpdate(
      { _id: id, ...(tenantId ? { restaurantId: tenantId } : {}) },
      updates,
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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid food item ID",
      });
      return;
    }

    const roleName = getRoleName(req);
    const tenantId = roleName === "restaurantadmin" ? req.user?.restaurantId : null;
    const foodItem = await FoodItem.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
        ...(tenantId ? { restaurantId: tenantId } : {}),
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