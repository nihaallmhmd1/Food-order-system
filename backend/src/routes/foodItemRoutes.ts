import { Router } from "express";

import {
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "../controllers/foodItemController";

import {
  authenticate,
  optionalAuthenticate,
  requirePermission,
  requireTenantAssignment,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/", optionalAuthenticate, getFoodItems);
router.get("/:id", optionalAuthenticate, getFoodItemById);
// Admin only manage food items
router.post("/", authenticate, requirePermission("food-items"), requireTenantAssignment, createFoodItem);
router.put("/:id", authenticate, requirePermission("food-items"), requireTenantAssignment, updateFoodItem);
router.delete("/:id", authenticate, requirePermission("food-items"), requireTenantAssignment, deleteFoodItem);

export default router;