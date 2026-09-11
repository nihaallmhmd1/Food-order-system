import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../models/Category";
import FoodItem from "../models/FoodItem";
import Order from "../models/Order";

dotenv.config();

const checkTenantData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error("MONGO_URI is not defined in .env");
    await mongoose.connect(mongoURI);

    const [categories, foodItems, orders] = await Promise.all([
      Category.countDocuments({ restaurantId: { $exists: false } }),
      FoodItem.countDocuments({ restaurantId: { $exists: false } }),
      Order.countDocuments({ restaurantId: { $exists: false } }),
    ]);

    console.log(JSON.stringify({ categoriesMissingRestaurantId: categories, foodItemsMissingRestaurantId: foodItems, ordersMissingRestaurantId: orders }, null, 2));
    if (categories || foodItems || orders) process.exitCode = 1;
  } catch (error) {
    console.error("Tenant data check failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

checkTenantData();