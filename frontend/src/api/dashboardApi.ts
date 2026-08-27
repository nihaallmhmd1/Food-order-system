const API_URL = "http://localhost:5000/api";

export interface DashboardSummary {
  totalUsers: number;
  totalRestaurants: number;
  totalFoodItems: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface DailyPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopRestaurant {
  restaurantId: string;
  name: string;
  image?: string;
  orderCount: number;
  revenue: number;
}

export interface PopularFoodItem {
  _id: string;
  name: string;
  image?: string;
  quantitySold: number;
  revenue: number;
}

export interface RecentOrder {
  _id: string;
  customerName: string;
  restaurantName?: string;
  totalAmount: number;
  orderStatus:
    | "PLACED"
    | "CONFIRMED"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
}

export interface DashboardStats {
  summary: DashboardSummary;
  orderStatusCounts: Record<string, number>;
  dailySeries: DailyPoint[];
  topRestaurants: TopRestaurant[];
  popularFoodItems: PopularFoodItem[];
  recentOrders: RecentOrder[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch dashboard stats");
  }

  return result.data;
};