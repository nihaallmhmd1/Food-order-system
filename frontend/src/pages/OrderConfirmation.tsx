import { Link, useLocation } from "react-router-dom";

function OrderConfirmation() {
  const location = useLocation();

  const order = location.state;

  const orderId = `FD${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">

          <Link
            to="/"
            className="text-2xl font-bold text-orange-500"
          >
            Foodie
          </Link>

        </div>
      </nav>

      {/* Confirmation */}
      <main className="flex min-h-[80vh] items-center justify-center px-6">

        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm md:p-10">

          {/* Success */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Order Confirmed!
          </h1>

          <p className="mt-3 text-gray-500">
            Your delicious food is on its way.
          </p>

          {/* Order ID */}
          <div className="mt-8 rounded-xl bg-gray-50 p-5">

            <p className="text-sm text-gray-500">
              Order ID
            </p>

            <p className="mt-1 text-xl font-bold">
              #{orderId}
            </p>

          </div>

          {/* Order details */}
          {order && (
            <div className="mt-5 space-y-3 text-left">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Customer
                </span>

                <span className="font-semibold">
                  {order.customer.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Payment
                </span>

                <span className="font-semibold uppercase">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Total
                </span>

                <span className="font-bold">
                  ₹{order.total}
                </span>
              </div>

            </div>
          )}

          {/* Delivery */}
          <div className="mt-6 rounded-xl bg-orange-50 p-4">

            <p className="font-semibold text-orange-700">
              🛵 Estimated delivery
            </p>

            <p className="mt-1 text-sm text-orange-600">
              25-35 minutes
            </p>

          </div>

          <Link
            to="/restaurants"
            className="mt-7 block rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600"
          >
            Order More Food
          </Link>

          <Link
            to="/"
            className="mt-3 block py-2 font-medium text-gray-600 hover:text-orange-500"
          >
            Back to Home
          </Link>

        </div>

      </main>

    </div>
  );
}

export default OrderConfirmation;