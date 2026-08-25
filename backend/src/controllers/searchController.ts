import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
import FoodItem from "../models/FoodItem";
import Category from "../models/Category";

export const searchAll = async (
  req: Request<{}, {}, {}, { q?: string }>,
  res: Response
) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchRegex = new RegExp(query, "i");

    // Search restaurants
    const restaurants = await Restaurant.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { cuisine: searchRegex },
        { address: searchRegex },
      ],
    }).limit(10);

    // Search food items
    const foodItems = await FoodItem.find({
      isActive: true,
      isAvailable: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
      ],
    })
      .populate("restaurantId", "name image")
      .populate("categoryId", "name")
      .limit(10);

    // Search categories
    const categories = await Category.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
      ],
    })
      .populate("restaurantId", "name image")
      .limit(10);

    return res.status(200).json({
      success: true,
      query,
      data: {
        restaurants,
        foodItems,
        categories,
      },
    });
  } catch (error) {
    console.error("Search error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while searching",
    });
  }
};