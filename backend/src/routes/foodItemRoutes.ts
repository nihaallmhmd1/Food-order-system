import { Router } from "express";

import {
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "../controllers/foodItemController";

const router = Router();

router.get("/", getFoodItems);
router.get("/:id", getFoodItemById);
router.post("/", createFoodItem);
router.put("/:id", updateFoodItem);
router.delete("/:id", deleteFoodItem);

export default router;