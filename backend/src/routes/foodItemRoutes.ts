import { Router } from "express";

import {
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "../controllers/foodItemController";

import {authenticate,
        requireAdmin
}from "../middleware/authMiddleware";

const router = Router();

router.get("/", getFoodItems);
router.get("/:id", getFoodItemById);
// Admin only manage food items
router.post("/", authenticate, requireAdmin, createFoodItem);
router.put("/:id", authenticate, requireAdmin, updateFoodItem);
router.delete("/:id", authenticate, requireAdmin, deleteFoodItem);

export default router;