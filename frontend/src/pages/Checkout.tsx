import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orderApi";

const paymentOptions = [
  {
    value: "cod",
    icon: "💵",
    label: "Cash on Delivery",
    hint: "Pay when your order arrives",
    available: true,
  },
  {
    value: "upi",
    icon: "📲",
    label: "UPI",
    hint: "Currently unavailable",
    available: false,
  },
  {
    value: "card",
    icon: "💳",
    label: "Credit / Debit Card",
    hint: "Currently unavailable",
    available: false,
  },
];

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = cartTotal > 0 ? 40 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const restaurantId = cartItems[0]?.restaurantId;

    if (!restaurantId) {
      setError("Restaurant information is missing from your cart.");
      return;
    }

    const invalidItem = cartItems.find(
      (item: any) => !(item.foodItemId || item._id || item.id)
    );

    if (invalidItem) {
      setError("One or more food items are missing their ID.");
      return;
    }

    if (paymentMethod !== "cod") {
      const methodLabel =
        paymentOptions.find((option) => option.value === paymentMethod)
          ?.label ?? "This payment method";
      setError(
        `${methodLabel} payments are currently unavailable. Please select Cash on Delivery to continue.`
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const fullAddress = `${formData.address}, ${formData.city} - ${formData.pincode}`;

      const payload = {
        restaurantId,
        customerName: formData.name,
        customerPhone: formData.phone,
        deliveryAddress: fullAddress,
        paymentMethod: paymentMethod.toUpperCase(),
        items: cartItems.map((item: any) => ({
          foodItemId: item.foodItemId || item._id || item.id,
          quantity: item.quantity,
        })),
      };

      const placedOrder = await createOrder(payload);

      clearCart();

      navigate("/order-confirmation", {
        state: {
          order: placedOrder,
          customer: formData,
          paymentMethod,
          total: grandTotal,
        },
      });
    } catch (err: any) {
      console.error("Order creation failed:", err);
      setError(
        err?.message || "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

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
            Add some items before checking out.
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
              Checkout
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter your delivery details and choose your payment method.
            </p>
          </div>

          <Link
            to="/cart"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Back to Cart
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-8 lg:grid-cols-3"
        >
          {/* Delivery Details */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span>📍</span> Delivery Address
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Address
                  </label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="House no, street, area"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    City
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Pincode
                  </label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    placeholder="Pincode"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span>💳</span> Payment Method
              </h2>

              <div className="mt-5 space-y-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                      !option.available
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-60"
                        : paymentMethod === option.value
                        ? "cursor-pointer border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/30"
                        : "cursor-pointer border-gray-200 hover:border-emerald-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      disabled={!option.available}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 accent-emerald-600 disabled:cursor-not-allowed"
                    />

                    <span className="text-xl">{option.icon}</span>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {option.label}
                      </p>
                      <p
                        className={`text-xs ${
                          option.available ? "text-gray-500" : "text-amber-600"
                        }`}
                      >
                        {option.hint}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            <div className="mt-5 max-h-56 space-y-4 overflow-y-auto pr-1">
              {cartItems.map((item: any) => (
                <div
                  key={item.id || item._id || item.foodItemId}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">× {item.quantity}</p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Item total</span>
                <span className="font-medium text-gray-900">₹{cartTotal}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-medium text-gray-900">₹{deliveryFee}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Taxes</span>
                <span className="font-medium text-gray-900">₹{tax}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-base font-extrabold text-gray-900">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Placing Order..." : `Place Order • ₹${grandTotal}`}
            </button>
          </aside>
        </form>
      </main>
    </div>
  );
}

export default Checkout;
