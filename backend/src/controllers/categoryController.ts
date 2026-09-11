import { Response } from "express";
import mongoose from "mongoose";
import Category from "../models/Category";
import { AuthRequest, getRoleName } from "../middleware/authMiddleware";

// GET /api/categories
// Optional query: /api/categories?restaurantId=xyz
export const getCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { restaurantId } = req.query as { restaurantId?: string };

    const filter: any = {
      isActive: true,
    };

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

    if (restaurantId && !tenantId) {
      if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        res.status(400).json({
          success: false,
          message: "Invalid restaurant ID",
        });
        return;
      }

      filter.restaurantId = restaurantId;
    }
    if (tenantId) filter.restaurantId = tenantId;

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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const roleName = getRoleName(req);
    const tenantId = roleName === "restaurantadmin" ? req.user?.restaurantId : null;
    if (roleName === "restaurantadmin" && !tenantId) {
      res.status(403).json({ success: false, message: "A restaurant assignment is required" });
      return;
    }
    const category = await Category.findOne({
      _id: id,
      isActive: true,
      ...(tenantId ? { restaurantId: tenantId } : {}),
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
  req: AuthRequest,
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

    const roleName = getRoleName(req);
    const tenantId = roleName === "restaurantadmin" ? req.user?.restaurantId : null;
    if (!name || (!restaurantId && !tenantId)) {
      res.status(400).json({
        success: false,
        message: "Name and restaurantId are required",
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
        message: "Invalid restaurant ID",
      });
      return;
    }

    const category = await Category.create({
      name,
      description,
      restaurantId: targetRestaurantId,
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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
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
    const category = await Category.findOneAndUpdate(
      { _id: id, ...(tenantId ? { restaurantId: tenantId } : {}) },
      updates,
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
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const roleName = getRoleName(req);
    const tenantId = roleName === "restaurantadmin" ? req.user?.restaurantId : null;
    const category = await Category.findOneAndUpdate(
      { _id: id, ...(tenantId ? { restaurantId: tenantId } : {}) },
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