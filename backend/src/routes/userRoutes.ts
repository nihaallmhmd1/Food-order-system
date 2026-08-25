import { Router } from "express";

import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/userController";

import {
  authenticate,
  requireAdmin,
} from "../middleware/authMiddleware";

const router = Router();

// All user management routes require authentication + admin access
router.use(authenticate);
router.use(requireAdmin);

// Get all users
router.get("/", getAllUsers);

// Update user role
router.put("/:id/role", updateUserRole);

// Delete user
router.delete("/:id", deleteUser);

export default router;