import { Router } from "express";

import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantController";

import {
  authenticate,
  requireAdmin,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

// Admin only - Get manage restaurants
router.post("/", authenticate, requireAdmin, createRestaurant);
router.put("/:id",authenticate, requireAdmin, updateRestaurant);
router.delete("/:id",authenticate, requireAdmin, deleteRestaurant);

export default router;