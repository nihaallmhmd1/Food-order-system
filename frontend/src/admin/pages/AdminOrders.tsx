import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  type AdminOrder,
} from "../../api/orderApi";

function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(
    null
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllOrders();

      setOrders(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    id: string,
    orderStatus: AdminOrder["orderStatus"]
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      const updatedOrder = await updateOrderStatus(id, {
        orderStatus,
      });

      setOrders((previous) =>
        previous.map((order) =>
          order._id === id
            ? {
                ...order,
                ...updatedOrder,
              }
            : order
        )
      );

      if (selectedOrder?._id === id) {
        setSelectedOrder({
          ...selectedOrder,
          ...updatedOrder,
        });
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (
    id: string,
    paymentStatus: AdminOrder["paymentStatus"]
  ) => {
    try {
      setUpdatingId(id);
      setError("");

      const updatedOrder = await updateOrderStatus(id, {
        paymentStatus,
      });

      setOrders((previous) =>
        previous.map((order) =>
          order._id === id
            ? {
                ...order,
                ...updatedOrder,
              }
            : order
        )
      );

      if (selectedOrder?._id === id) {
        setSelectedOrder({
          ...selectedOrder,
          ...updatedOrder,
        });
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update payment status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setUpdatingId(id);
      setError("");

      const updatedOrder = await cancelOrder(id);

      setOrders((previous) =>
        previous.map((order) =>
          order._id === id
            ? {
                ...order,
                ...updatedOrder,
                orderStatus: "CANCELLED",
              }
            : order
        )
      );

      if (selectedOrder?._id === id) {
        setSelectedOrder({
          ...selectedOrder,
          ...updatedOrder,
          orderStatus: "CANCELLED",
        });
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to cancel order"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (
    status: AdminOrder["orderStatus"]
  ) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-50 text-blue-700";

      case "CONFIRMED":
        return "bg-indigo-50 text-indigo-700";

      case "PREPARING":
        return "bg-yellow-50 text-yellow-700";

      case "OUT_FOR_DELIVERY":
        return "bg-purple-50 text-purple-700";

      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage all customer orders.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />

          <p className="text-sm text-gray-500">
            Loading orders...
          </p>
        </div>
      ) : (
        <>
          {/* Orders Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Order
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Customer
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Restaurant
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Total
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Payment
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50"
                      >
                        {/* Order */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="font-medium text-emerald-600 hover:underline"
                          >
                            #{order._id.slice(-6).toUpperCase()}
                          </button>

                          <p className="mt-1 text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {order.customerName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {order.userId?.email || "—"}
                          </p>
                        </td>

                        {/* Restaurant */}
                        <td className="px-6 py-4 text-gray-600">
                          {order.restaurantId?.name || "—"}
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ₹{order.totalAmount.toFixed(2)}
                        </td>

                        {/* Payment */}
                        <td className="px-6 py-4">
                          <select
                            value={order.paymentStatus}
                            disabled={updatingId === order._id}
                            onChange={(e) =>
                              handlePaymentStatusChange(
                                order._id,
                                e.target
                                  .value as AdminOrder["paymentStatus"]
                              )
                            }
                            className="rounded-md border border-gray-300 px-2 py-1 text-xs outline-none focus:border-emerald-500"
                          >
                            <option value="PENDING">
                              Pending
                            </option>

                            <option value="PAID">
                              Paid
                            </option>

                            <option value="FAILED">
                              Failed
                            </option>
                          </select>
                        </td>

                        {/* Order Status */}
                        <td className="px-6 py-4">
                          <select
                            value={order.orderStatus}
                            disabled={updatingId === order._id}
                            onChange={(e) =>
                              handleStatusChange(
                                order._id,
                                e.target
                                  .value as AdminOrder["orderStatus"]
                              )
                            }
                            className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                              order.orderStatus
                            )}`}
                          >
                            <option value="PLACED">
                              Placed
                            </option>

                            <option value="CONFIRMED">
                              Confirmed
                            </option>

                            <option value="PREPARING">
                              Preparing
                            </option>

                            <option value="OUT_FOR_DELIVERY">
                              Out for Delivery
                            </option>

                            <option value="DELIVERED">
                              Delivered
                            </option>

                            <option value="CANCELLED">
                              Cancelled
                            </option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setSelectedOrder(order)
                              }
                              className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                            >
                              View
                            </button>

                            {order.orderStatus !==
                              "CANCELLED" &&
                              order.orderStatus !==
                                "DELIVERED" && (
                                <button
                                  onClick={() =>
                                    handleCancel(order._id)
                                  }
                                  disabled={
                                    updatingId === order._id
                                  }
                                  className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Count */}
            <div className="border-t border-gray-200 px-6 py-4">
              <p className="text-sm text-gray-500">
                Total orders:{" "}
                <span className="font-semibold text-gray-800">
                  {orders.length}
                </span>
              </p>
            </div>
          </div>
        </>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Order #
                  {selectedOrder._id
                    .slice(-6)
                    .toUpperCase()}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Customer */}
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Customer
                </h3>

                <div className="rounded-lg bg-gray-50 p-4 text-sm">
                  <p>
                    <span className="font-medium">
                      Name:
                    </span>{" "}
                    {selectedOrder.customerName}
                  </p>

                  <p className="mt-1">
                    <span className="font-medium">
                      Phone:
                    </span>{" "}
                    {selectedOrder.customerPhone}
                  </p>

                  <p className="mt-1">
                    <span className="font-medium">
                      Email:
                    </span>{" "}
                    {selectedOrder.userId?.email || "—"}
                  </p>

                  <p className="mt-1">
                    <span className="font-medium">
                      Address:
                    </span>{" "}
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>
              </div>

              {/* Restaurant */}
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Restaurant
                </h3>

                <p className="rounded-lg bg-gray-50 p-4 text-sm">
                  {selectedOrder.restaurantId?.name ||
                    "Unknown restaurant"}
                </p>
              </div>

              {/* Items */}
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Ordered Items
                </h3>

                <div className="divide-y rounded-lg border border-gray-200">
                  {selectedOrder.items.map(
                    (item, index) => (
                      <div
                        key={`${item.foodItemId?._id || item.name}-${index}`}
                        className="flex items-center justify-between p-4"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            ₹{item.price} ×{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Order Summary
                </h3>

                <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      ₹{selectedOrder.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      ₹
                      {selectedOrder.deliveryFee.toFixed(
                        2
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
                    <span>Total</span>
                    <span>
                      ₹
                      {selectedOrder.totalAmount.toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  Payment
                </h3>

                <div className="flex justify-between rounded-lg bg-gray-50 p-4 text-sm">
                  <span>
                    Method:{" "}
                    <strong>
                      {selectedOrder.paymentMethod}
                    </strong>
                  </span>

                  <span>
                    Status:{" "}
                    <strong>
                      {selectedOrder.paymentStatus}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-200 p-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;