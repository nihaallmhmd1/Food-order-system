import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const deliveryFee = cartTotal > 0 ? 40 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">

        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b bg-white">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

            <Link
              to="/"
              className="text-3xl font-extrabold tracking-tight text-orange-500"
            >
              Foodie
            </Link>

            <Link
              to="/restaurants"
              className="font-medium text-gray-600 hover:text-orange-500"
            >
              Restaurants
            </Link>

          </div>
        </nav>

        {/* Empty cart */}
        <div className="flex min-h-[70vh] items-center justify-center px-6">

          <div className="text-center">

            <div className="text-7xl">🛒</div>

            <h1 className="mt-5 text-3xl font-bold">
              Your cart is empty
            </h1>

            <p className="mt-2 text-gray-500">
              Add some delicious food to get started.
            </p>

            <Link
              to="/restaurants"
              className="mt-7 inline-block rounded-xl bg-orange-500 px-7 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Browse Restaurants
            </Link>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight text-orange-500"
          >
            Foodie
          </Link>

          <Link
            to="/restaurants"
            className="font-medium text-gray-600 hover:text-orange-500"
          >
            ← Continue Shopping
          </Link>

        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        <h1 className="text-3xl font-bold">
          Your Cart
        </h1>

        <p className="mt-2 text-gray-500">
          Review your items before checkout.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">

            {cartItems.map((item) => (

              <div
                key={item.id}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >

                <div className="flex gap-4">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">

                    <div className="flex justify-between gap-3">

                      <div>
                        <h3 className="font-bold">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-gray-500">
                          ₹{item.price}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        className="text-sm font-medium text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>

                    </div>

                    <div className="mt-3 flex items-center justify-between">

                      {/* Quantity */}
                      <div className="flex items-center rounded-lg border">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          className="px-3 py-1.5 text-lg hover:bg-gray-100"
                        >
                          −
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          className="px-3 py-1.5 text-lg hover:bg-gray-100"
                        >
                          +
                        </button>

                      </div>

                      <p className="font-bold">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-gray-600">
                <span>Item total</span>
                <span>₹{cartTotal}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Taxes</span>
                <span>₹{tax}</span>
              </div>

              <div className="border-t pt-4">

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>

              </div>

            </div>

            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-xl bg-orange-500 py-3 text-center font-bold text-white hover:bg-orange-600"
            >
              Proceed to Checkout
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Cart;