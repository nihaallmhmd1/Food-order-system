import { Request, Response } from "express";
import mongoose from "mongoose";

import Order from "../models/Order";
import FoodItem from "../models/FoodItem";
import Restaurant from "../models/Restaurant";

import { AuthRequest } from "../middleware/authMiddleware";

// POST /api/orders
export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Make sure authentication exists
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const userId = req.user.userId;

    const {
      restaurantId,
      customerName,
      customerPhone,
      deliveryAddress,
      items,
      paymentMethod,
    } = req.body;

    if (
      !restaurantId ||
      !customerName ||
      !customerPhone ||
      !deliveryAddress ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "restaurantId, customerName, customerPhone, deliveryAddress and items are required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      res.status(400).json({
        success: false,
        message: "Invalid restaurantId",
      });
      return;
    }

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      isActive: true,
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    let subtotal = 0;

    const orderItems = [];

    for (const item of items) {
      if (
        !item.foodItemId ||
        !mongoose.Types.ObjectId.isValid(item.foodItemId) ||
        !item.quantity ||
        item.quantity < 1
      ) {
        res.status(400).json({
          success: false,
          message: "Invalid food item or quantity",
        });
        return;
      }

      const foodItem = await FoodItem.findOne({
        _id: item.foodItemId,
        restaurantId,
        isActive: true,
        isAvailable: true,
      });

      if (!foodItem) {
        res.status(404).json({
          success: false,
          message: `Food item ${item.foodItemId} not found or unavailable`,
        });
        return;
      }

      const itemTotal = foodItem.price * item.quantity;

      subtotal += itemTotal;

      orderItems.push({
        foodItemId: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        quantity: item.quantity,
        image: foodItem.image,
      });
    }

    const deliveryFee = subtotal >= 500 ? 0 : 40;

    const totalAmount = subtotal + deliveryFee;

    const order = await Order.create({
      userId,
      restaurantId,
      customerName,
      customerPhone,
      deliveryAddress,
      items: orderItems,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "PENDING",
      orderStatus: "PLACED",
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};

// GET /api/orders
// Admin only
export const getOrders = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("restaurantId", "name")
      .populate("items.foodItemId", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// GET /api/orders/:id
// Customer can view own order
// Admin can view any order
export const getOrderById = async (
  req: AuthRequest & Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate("restaurantId", "name")
      .populate("items.foodItemId", "name price image");

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    console.log("JWT userId:", req.user.userId);
    console.log("Order userId:", order.userId);
    console.log("Order userId string:", order.userId.toString());
    console.log("Role:", req.user.role);

    // Customers can only access their own orders
    if (req.user.role !== "admin") {
      if (order.userId.toString() !== req.user.userId) {
        res.status(403).json({
          success: false,
          message: "You are not allowed to view this order",
        });
        return;
      }
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// PUT /api/orders/:id/status
// Admin only
export const updateOrderStatus = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const { orderStatus, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    const validOrderStatuses = [
      "PLACED",
      "CONFIRMED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    const validPaymentStatuses = [
      "PENDING",
      "PAID",
      "FAILED",
    ];

    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
      return;
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
      return;
    }

    const updateData: {
      orderStatus?: string;
      paymentStatus?: string;
    } = {};

    if (orderStatus) {
      updateData.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// DELETE /api/orders/:id
// Admin only
export const deleteOrder = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
      return;
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: "CANCELLED",
      },
      {
        new: true,
      }
    );

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};