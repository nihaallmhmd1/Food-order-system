import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const deliveryFee = cartTotal > 0 ? 40 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + tax;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    navigate("/order-confirmation", {
      state: {
        customer: formData,
        paymentMethod,
        total: grandTotal,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">

          <div className="text-6xl">🛒</div>

          <h1 className="mt-4 text-2xl font-bold">
            Your cart is empty
          </h1>

          <Link
            to="/restaurants"
            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white"
          >
            Browse Restaurants
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/"
            className="text-2xl font-bold text-orange-500"
          >
            Foodie
          </Link>

          <Link
            to="/cart"
            className="font-medium text-gray-600 hover:text-orange-500"
          >
            ← Back to Cart
          </Link>

        </div>
      </nav>

      {/* Checkout */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        <h1 className="text-3xl font-bold">
          Checkout
        </h1>

        <p className="mt-2 text-gray-500">
          Enter your delivery details and choose your payment method.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-8 lg:grid-cols-3"
        >

          {/* Delivery Details */}
          <div className="space-y-6 lg:col-span-2">

            <section className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold">
                📍 Delivery Address
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    type="tel"
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Address
                  </label>

                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="House no, street, area"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    City
                  </label>

                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="City"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Pincode
                  </label>

                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    placeholder="Pincode"
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>

              </div>

            </section>

            {/* Payment */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold">
                💳 Payment Method
              </h2>

              <div className="mt-5 space-y-3">

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "cod"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "upi"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      UPI
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay securely using UPI
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                    paymentMethod === "card"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                  />

                  <div>
                    <p className="font-semibold">
                      Credit / Debit Card
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay using your card
                    </p>
                  </div>
                </label>

              </div>

            </section>

          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p className="font-medium">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      × {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4">

                <div className="flex justify-between text-gray-600">
                  <span>Item total</span>
                  <span>₹{cartTotal}</span>
                </div>

                <div className="mt-3 flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>

                <div className="mt-3 flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>₹{tax}</span>
                </div>

              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-orange-500 py-3.5 font-bold text-white transition hover:bg-orange-600"
            >
              Place Order • ₹{grandTotal}
            </button>

          </aside>

        </form>

      </main>

    </div>
  );
}

export default Checkout;