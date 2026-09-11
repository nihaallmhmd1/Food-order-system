import { Router } from "express";

import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController";

import {
  authenticate,
  requirePermission,
} from "../middleware/authMiddleware";

const router = Router();

// Customer/Admin - Create order
router.post("/", authenticate, createOrder);

// Customer - Get own orders
router.get("/my-orders", authenticate, getMyOrders);

// Admin / General - Get orders (Returns all orders for admin, user orders for customer)
router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrderById);

// Admin only - Update order status
router.put(
  "/:id/status",
  authenticate,
  requirePermission("orders"),
  updateOrderStatus
);

// Admin only - Cancel order
router.delete(
  "/:id",
  authenticate,
  requirePermission("orders"),
  deleteOrder
);

export default router;