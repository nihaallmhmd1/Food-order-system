import { Request, Response } from "express";
import mongoose from "mongoose";
import Restaurant from "../models/Restaurant";

// GET /api/restaurants
export const getRestaurants = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurants = await Restaurant.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    console.error("Get restaurants error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurants",
    });
  }
};

// GET /api/restaurants/:id
export const getRestaurantById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
      return;
    }

    const restaurant = await Restaurant.findOne({
      _id: id,
      isActive: true,
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    console.error("Get restaurant error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant",
    });
  }
};

// POST /api/restaurants
// Admin only
export const createRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      cuisine,
      rating,
      deliveryTime,
      deliveryFee,
      minimumOrder,
      image,
      bannerImage,
      address,
      phone,
      isOpen,
      isActive,
    } = req.body;

    if (!name || !description || !cuisine || !deliveryTime || !address) {
      res.status(400).json({
        success: false,
        message:
          "Name, description, cuisine, delivery time and address are required",
      });
      return;
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      cuisine,
      rating,
      deliveryTime,
      deliveryFee,
      minimumOrder,
      image,
      bannerImage,
      address,
      phone,
      isOpen,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
    });
  }
};

// PUT /api/restaurants/:id
export const updateRestaurant = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
      return;
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update restaurant",
    });
  }
};

// DELETE /api/restaurants/:id
export const deleteRestaurant = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
      return;
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Delete restaurant error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete restaurant",
    });
  }
};