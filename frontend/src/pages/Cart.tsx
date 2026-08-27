import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const deliveryFee = cartTotal > 0 ? 40 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-5xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add some delicious food to get started.
          </p>

          <Link
            to="/restaurants"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
          >
            Browse Restaurants →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Your Cart
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review your items before checkout.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-sm font-semibold text-red-500 transition hover:text-red-600"
          >
            Clear cart
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 shrink-0 rounded-xl object-cover"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        ₹{item.price} each
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="h-fit rounded-lg px-2 py-1 text-xs font-semibold text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      ✕ Remove
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-xl border border-gray-200">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-3 py-1.5 text-lg font-bold text-emerald-700 transition hover:bg-emerald-50 rounded-l-xl"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-extrabold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="px-3 py-1.5 text-lg font-bold text-emerald-700 transition hover:bg-emerald-50 rounded-r-xl"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-extrabold text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Item total</span>
                <span className="font-medium text-gray-900">₹{cartTotal}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span className="font-medium text-gray-900">₹{deliveryFee}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Taxes</span>
                <span className="font-medium text-gray-900">₹{tax}</span>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-base font-extrabold text-gray-900">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-xl bg-emerald-600 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/restaurants"
              className="mt-3 block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Cart;
