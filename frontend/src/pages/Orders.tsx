import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";

type OrderItem = {
  foodItemId?: string | { _id: string; name?: string };
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

type Restaurant = {
  _id: string;
  name: string;
};

type Order = {
  _id: string;
  userId?: string | { _id: string; name?: string; email?: string };
  restaurantId: string | Restaurant;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus:
    | "PLACED"
    | "CONFIRMED"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED"
    | string;
  createdAt?: string;
};

function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch order history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getRestaurantName = (restaurantId: Order["restaurantId"]) => {
    if (typeof restaurantId === "object" && restaurantId !== null) {
      return restaurantId.name;
    }
    return "Restaurant";
  };

  const getStatusLabel = (status: Order["orderStatus"]) => {
    switch (status) {
      case "PLACED":
        return "Order Placed";
      case "CONFIRMED":
        return "Confirmed";
      case "PREPARING":
        return "Preparing";
      case "OUT_FOR_DELIVERY":
        return "On the way";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusStyle = (status: Order["orderStatus"]) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-100 text-blue-700";
      case "CONFIRMED":
        return "bg-indigo-100 text-indigo-700";
      case "PREPARING":
        return "bg-yellow-100 text-yellow-700";
      case "OUT_FOR_DELIVERY":
        return "bg-purple-100 text-purple-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
          🔐
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Please Log In</h2>
        <p className="mt-2 text-gray-500">
          You need to be logged in to view your order history.
        </p>
        <Link
          to="/login"
          className="mt-5 rounded-full bg-emerald-600 px-6 py-2.5 font-bold text-white transition hover:bg-emerald-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="mb-4 text-5xl">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800">
          Unable to load orders
        </h2>
        <p className="mt-2 text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 rounded-full bg-emerald-600 px-6 py-2.5 font-bold text-white transition hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
            Foodie
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-gray-500">
            Track your active food orders and view your complete order history.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        {orders.length === 0 ? (
          /* Empty Orders View */
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl bg-white px-6 text-center shadow-sm">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-4xl">
              🛍️
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              No orders yet
            </h2>
            <p className="mt-2 max-w-md text-gray-500">
              You haven't placed any orders yet. Explore top restaurants near you and order your favorite meals.
            </p>
            <Link
              to="/restaurants"
              className="mt-6 rounded-full bg-emerald-600 px-7 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-900">
                        {getRestaurantName(order.restaurantId)}
                      </h2>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusLabel(order.orderStatus)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Order #{order._id}
                    </p>

                    {order.createdAt && (
                      <p className="mt-1 text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-extrabold text-gray-900">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-5 sm:p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                              🍽️
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 font-semibold text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-gray-500">
                        <span>Delivery Fee</span>
                        <span>
                          {order.deliveryFee === 0
                            ? "FREE"
                            : `₹${order.deliveryFee.toFixed(2)}`}
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-emerald-600">
                          ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </span>
                      <span>Payment: {order.paymentMethod}</span>
                    </div>

                    <button className="rounded-full bg-gray-100 px-5 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;