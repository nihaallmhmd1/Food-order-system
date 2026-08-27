import { Link, useLocation } from "react-router-dom";

type OrderItem = {
  foodItemId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type OrderData = {
  _id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt?: string;
};

function OrderConfirmation() {
  const location = useLocation();

  const order = location.state?.order as OrderData | undefined;

  // If the page is refreshed or opened directly
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">

        <main className="flex min-h-[80vh] items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
              📦
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Order information not found
            </h1>

            <p className="mt-3 text-gray-500">
              This confirmation page was opened without an order.
              You can check your previous orders from your Orders page.
            </p>

            <Link
              to="/orders"
              className="mt-7 block rounded-xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700"
            >
              View My Orders
            </Link>

            <Link
              to="/"
              className="mt-3 block py-2 font-medium text-gray-600 transition hover:text-emerald-600"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            to="/"
            className="text-2xl font-bold text-emerald-600"
          >
            Foodie
          </Link>
        </div>
      </nav>

      {/* Confirmation */}
      <main className="flex px-6 py-10">
        <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm md:p-10">
          {/* Success */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Order Confirmed!
            </h1>

            <p className="mt-3 text-gray-500">
              Your delicious food is being prepared.
            </p>
          </div>

          {/* Real Order ID */}
          <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-center">
            <p className="text-sm font-medium text-emerald-700">
              Order ID
            </p>

            <p className="mt-1 break-all text-lg font-bold text-emerald-900">
              #{order._id}
            </p>
          </div>

          {/* Customer Details */}
          <div className="mt-6 rounded-2xl border border-gray-100 p-5">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Delivery Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Customer
                </span>

                <span className="text-right font-semibold text-gray-800">
                  {order.customerName}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Phone
                </span>

                <span className="font-semibold text-gray-800">
                  {order.customerPhone}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Address
                </span>

                <span className="max-w-[65%] text-right font-semibold text-gray-800">
                  {order.deliveryAddress}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Payment
                </span>

                <span className="font-semibold uppercase text-gray-800">
                  {order.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="mt-6 rounded-2xl border border-gray-100 p-5">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Your Order
            </h2>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={`${item.foodItemId || item.name}-${index}`}
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
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                        🍽️
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-800">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-400">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="shrink-0 font-semibold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-5 space-y-2 border-t border-gray-100 pt-5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>

                <span>
                  ₹{order.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>

                <span>
                  {order.deliveryFee === 0
                    ? "FREE"
                    : `₹${order.deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-3 text-lg font-bold text-gray-900">
                <span>Total</span>

                <span className="text-emerald-600">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-center">
            <p className="font-semibold text-emerald-700">
              🛵 Estimated delivery
            </p>

            <p className="mt-1 text-sm text-emerald-600">
              25–35 minutes
            </p>
          </div>

          {/* Actions */}
          <div className="mt-7 space-y-3">
            <Link
              to="/orders"
              className="block rounded-xl bg-emerald-600 py-3 text-center font-bold text-white transition hover:bg-emerald-700"
            >
              View My Orders
            </Link>

            <Link
              to="/restaurants"
              className="block rounded-xl border border-gray-200 py-3 text-center font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Order More Food
            </Link>

            <Link
              to="/"
              className="block py-2 text-center font-medium text-gray-500 transition hover:text-emerald-600"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderConfirmation;