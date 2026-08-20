import { Router } from "express";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController";

import {
  authenticate,
  requireAdmin,
} from "../middleware/authMiddleware";

const router = Router();

// Customer/Admin - Create order
router.post("/", authenticate, createOrder);

// Admin only - Get all orders
router.get("/", authenticate, requireAdmin, getOrders);

// Customer - Own order
// Admin - Any order
router.get("/:id", authenticate, getOrderById);

// Admin only - Update order status
router.put(
  "/:id/status",
  authenticate,
  requireAdmin,
  updateOrderStatus
);

// Admin only - Cancel order
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  deleteOrder
);

export default router;