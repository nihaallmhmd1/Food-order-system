import { Router } from "express";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

import {
  authenticate,
  optionalAuthenticate,
  requirePermission,
  requireTenantAssignment,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/", optionalAuthenticate, getCategories);
router.get("/:id", optionalAuthenticate, getCategoryById);
// Admin only manage caregories
router.post("/", authenticate, requirePermission("categories"), requireTenantAssignment, createCategory);
router.put("/:id", authenticate, requirePermission("categories"), requireTenantAssignment, updateCategory);
router.delete("/:id", authenticate, requirePermission("categories"), requireTenantAssignment, deleteCategory);

export default router;