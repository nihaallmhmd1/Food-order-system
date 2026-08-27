import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getDashboardStats,
  type DashboardStats,
} from "../../api/dashboardApi";

const STATUS_LABELS: Record<string, string> = {
  PLACED: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  PLACED: "#94a3b8",
  CONFIRMED: "#3b82f6",
  PREPARING: "#f59e0b",
  OUT_FOR_DELIVERY: "#8b5cf6",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">{error || "No data available"}</p>
      </div>
    );
  }

  const summaryCards = [
    { title: "Total Users", value: stats.summary.totalUsers, icon: "👥" },
    {
      title: "Restaurants",
      value: stats.summary.totalRestaurants,
      icon: "🍽️",
    },
    { title: "Food Items", value: stats.summary.totalFoodItems, icon: "🍔" },
    { title: "Total Orders", value: stats.summary.totalOrders, icon: "🛒" },
    {
      title: "Total Revenue",
      value: currency.format(stats.summary.totalRevenue),
      icon: "💰",
    },
  ];

  const pieData = Object.entries(stats.orderStatusCounts).map(
    ([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      status,
    })
  );

  // Only show labels for statuses that actually have orders — prevents
  // overlapping labels when multiple statuses are at 0
  const pieDataWithOrders = pieData.filter((d) => d.value > 0);

  const chartData = stats.dailySeries.map((d) => ({
    ...d,
    label: shortDate(d.date),
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to the Foodie administration panel.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Statistics */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Order Statistics
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(stats.orderStatusCounts).map(([status, count]) => (
            <div
              key={status}
              className="rounded-lg bg-gray-50 p-4 text-center"
            >
              <p
                className="text-2xl font-bold"
                style={{ color: STATUS_COLORS[status] }}
              >
                {count}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-500">
                {STATUS_LABELS[status]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Revenue (Last 14 Days)
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
                tickFormatter={(v: number) => `₹${v}`}
              />
              <Tooltip
                formatter={(value: any) => currency.format(Number(value))}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Order Status Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieDataWithOrders}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(props: any) => `${props.name}: ${props.value}`}
              >
                {pieDataWithOrders.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Overview Bar */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Orders Overview (Last 14 Days)
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Recent Orders
        </h2>
        {stats.recentOrders.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500">No recent orders available.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Restaurant</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 text-gray-900">{order.customerName}</td>
                    <td className="py-3 text-gray-600">
                      {order.restaurantName || "—"}
                    </td>
                    <td className="py-3 font-medium text-gray-900">
                      {currency.format(order.totalAmount)}
                    </td>
                    <td className="py-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${STATUS_COLORS[order.orderStatus]}1a`,
                          color: STATUS_COLORS[order.orderStatus],
                        }}
                      >
                        {STATUS_LABELS[order.orderStatus]}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">
                      {shortDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Restaurants + Popular Food Items */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Top Restaurants
          </h2>
          {stats.topRestaurants.length === 0 ? (
            <p className="text-sm text-gray-500">No data yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topRestaurants.map((r, i) => (
                <li
                  key={r.restaurantId}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {r.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.orderCount} orders
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">
                    {currency.format(r.revenue)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Popular Food Items
          </h2>
          {stats.popularFoodItems.length === 0 ? (
            <p className="text-sm text-gray-500">No data yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.popularFoodItems.map((item, i) => (
                <li
                  key={item._id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantitySold} sold
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">
                    {currency.format(item.revenue)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;