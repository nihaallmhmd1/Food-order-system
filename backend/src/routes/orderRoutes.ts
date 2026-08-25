import { Router } from "express";

import {
  createOrder,
  getOrders,
  getMyOrders,
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

// Customer - Get own orders
router.get("/my-orders", authenticate, getMyOrders);

// Admin / General - Get orders (Returns all orders for admin, user orders for customer)
router.get("/", authenticate, getOrders);

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