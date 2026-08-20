import { Link } from "react-router-dom";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  restaurant: string;
  date: string;
  status: "Delivered" | "Preparing" | "On the way" | "Cancelled";
  items: OrderItem[];
  total: number;
};

const orders: Order[] = [
  {
    id: "FD10245",
    restaurant: "Burger House",
    date: "17 Aug 2026, 12:30 PM",
    status: "Delivered",
    items: [
      {
        name: "Classic Cheeseburger",
        quantity: 2,
        price: 180,
      },
      {
        name: "French Fries",
        quantity: 1,
        price: 90,
      },
    ],
    total: 450,
  },
  {
    id: "FD10244",
    restaurant: "Pizza Palace",
    date: "15 Aug 2026, 7:45 PM",
    status: "On the way",
    items: [
      {
        name: "Chicken Pizza",
        quantity: 1,
        price: 350,
      },
      {
        name: "Garlic Bread",
        quantity: 1,
        price: 120,
      },
    ],
    total: 493,
  },
  {
    id: "FD10243",
    restaurant: "Spice Kitchen",
    date: "12 Aug 2026, 1:15 PM",
    status: "Cancelled",
    items: [
      {
        name: "Chicken Biriyani",
        quantity: 2,
        price: 220,
      },
    ],
    total: 462,
  },
];

function Orders() {
  const getStatusStyle = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Preparing":
        return "bg-yellow-100 text-yellow-700";

      case "On the way":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Foodie
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            Track your recent orders and view your order history.
          </p>
        </div>
      </section>

      {/* Orders */}
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-10">
        {orders.length > 0 ? (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-900">
                        {order.restaurant}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      Order #{order.id}
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      {order.date}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-extrabold text-gray-900">
                      ₹{order.total}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-5 sm:p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-lg">
                            🍽️
                          </div>

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
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Bottom */}
                  <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>

                    <div className="flex gap-3">
                      {order.status === "Delivered" && (
                        <button className="rounded-full border border-orange-500 px-5 py-2 text-sm font-bold text-orange-500 transition hover:bg-orange-50">
                          Reorder
                        </button>
                      )}

                      {order.status === "On the way" && (
                        <button className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-600">
                          Track Order
                        </button>
                      )}

                      <button className="rounded-full bg-gray-100 px-5 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Orders */
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl bg-white px-6 text-center shadow-sm">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
              🛍️
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 max-w-md text-gray-500">
              You haven't placed any orders yet. Explore restaurants and order
              your favorite food.
            </p>

            <Link
              to="/restaurants"
              className="mt-6 rounded-full bg-orange-500 px-7 py-3 font-bold text-white transition hover:bg-orange-600"
            >
              Browse Restaurants
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;