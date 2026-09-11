import { Response } from "express";
import Order from "../models/Order";
import User from "../models/User";
import Restaurant from "../models/Restaurant";
import FoodItem from "../models/FoodItem";
import { AuthRequest, getRoleName } from "../middleware/authMiddleware";

const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const roleName = getRoleName(req);
    const tenantId = roleName === "restaurantadmin" ? req.user?.restaurantId : null;
    if (roleName === "restaurantadmin" && !tenantId) {
      res.status(403).json({ success: false, message: "A restaurant assignment is required" });
      return;
    }
    const tenantFilter = tenantId ? { restaurantId: tenantId } : {};
    const [userCount, restaurantCount, foodItemCount, orderCount] =
      await Promise.all([
        User.countDocuments(tenantFilter),
        tenantId ? Restaurant.countDocuments({ _id: tenantId, isActive: true }) : Restaurant.countDocuments({ isActive: true }),
        FoodItem.countDocuments({ ...tenantFilter, isActive: true }),
        Order.countDocuments(tenantFilter),
      ]);

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const [facetResult] = await Order.aggregate([
      ...(tenantId ? [{ $match: { restaurantId: tenantId } }] : []),
      {
        $facet: {
          // Total revenue — cancelled orders don't count as revenue
          revenue: [
            { $match: { orderStatus: { $ne: "CANCELLED" } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],

          // Count of orders per status
          statusCounts: [
            { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
          ],

          // Revenue + order count per day, last 14 days
          dailySeries: [
            { $match: { createdAt: { $gte: fourteenDaysAgo } } },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                revenue: {
                  $sum: {
                    $cond: [
                      { $ne: ["$orderStatus", "CANCELLED"] },
                      "$totalAmount",
                      0,
                    ],
                  },
                },
                orders: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],

          // Top 5 restaurants by revenue
          topRestaurants: [
            { $match: { orderStatus: { $ne: "CANCELLED" } } },
            {
              $group: {
                _id: "$restaurantId",
                orderCount: { $sum: 1 },
                revenue: { $sum: "$totalAmount" },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "restaurants",
                localField: "_id",
                foreignField: "_id",
                as: "restaurant",
              },
            },
            { $unwind: "$restaurant" },
            {
              $project: {
                _id: 0,
                restaurantId: "$_id",
                name: "$restaurant.name",
                image: "$restaurant.image",
                orderCount: 1,
                revenue: 1,
              },
            },
          ],

          // Top 5 popular food items by quantity sold
          popularFoodItems: [
            { $match: { orderStatus: { $ne: "CANCELLED" } } },
            { $unwind: "$items" },
            {
              $group: {
                _id: "$items.foodItemId",
                name: { $first: "$items.name" },
                image: { $first: "$items.image" },
                quantitySold: { $sum: "$items.quantity" },
                revenue: {
                  $sum: { $multiply: ["$items.price", "$items.quantity"] },
                },
              },
            },
            { $sort: { quantitySold: -1 } },
            { $limit: 5 },
          ],

          // 5 most recent orders
          recentOrders: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "restaurants",
                localField: "restaurantId",
                foreignField: "_id",
                as: "restaurant",
              },
            },
            {
              $unwind: {
                path: "$restaurant",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                customerName: 1,
                totalAmount: 1,
                orderStatus: 1,
                paymentStatus: 1,
                createdAt: 1,
                restaurantName: "$restaurant.name",
              },
            },
          ],
        },
      },
    ]);

    // Ensure every status shows up, even with 0 orders
    const statusCountMap: Record<string, number> = Object.fromEntries(
      ORDER_STATUSES.map((s) => [s, 0])
    );
    for (const row of facetResult.statusCounts) {
      statusCountMap[row._id] = row.count;
    }

    // Fill missing days in the 14-day range with zeros
    const dailyMap = new Map(
      facetResult.dailySeries.map((d: any) => [d._id, d])
    );
    const dailySeries = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(fourteenDaysAgo);
      date.setDate(date.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      const existing = dailyMap.get(key) as any;
      dailySeries.push({
        date: key,
        revenue: existing ? existing.revenue : 0,
        orders: existing ? existing.orders : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers: userCount,
          totalRestaurants: restaurantCount,
          totalFoodItems: foodItemCount,
          totalOrders: orderCount,
          totalRevenue: facetResult.revenue[0]?.total || 0,
        },
        orderStatusCounts: statusCountMap,
        dailySeries,
        topRestaurants: facetResult.topRestaurants,
        popularFoodItems: facetResult.popularFoodItems,
        recentOrders: facetResult.recentOrders,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};