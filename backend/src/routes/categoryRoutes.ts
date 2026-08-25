import { Router } from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

import {authenticate,
        requireAdmin
}from "../middleware/authMiddleware";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
// Admin only manage caregories
router.post("/", authenticate, requireAdmin, createCategory);
router.put("/:id", authenticate, requireAdmin, updateCategory);
router.delete("/:id", authenticate, requireAdmin, deleteCategory);

export default router;