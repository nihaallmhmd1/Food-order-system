import API_BASE_URL from "./api";

export const getMyOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch orders");
  }

  return result.data;
};

export interface CreateOrderPayload {
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{
    foodItemId: string;
    quantity: number;
  }>;
  paymentMethod: string;
}

export const createOrder = async (
  payload: CreateOrderPayload
) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to place order"
    );
  }

  return result.data;
};

export interface AdminOrder {
  _id: string;

  userId?: {
    _id: string;
    name: string;
    email: string;
  };

  restaurantId?: {
    _id: string;
    name: string;
  };

  customerName: string;
  customerPhone: string;
  deliveryAddress: string;

  items: Array<{
    foodItemId?: {
      _id: string;
      name: string;
      price: number;
      image?: string;
    };
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;

  subtotal: number;
  deliveryFee: number;
  totalAmount: number;

  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED";

  orderStatus:
    | "PLACED"
    | "CONFIRMED"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";

  createdAt: string;
  updatedAt: string;
}

export const getAllOrders = async (): Promise<AdminOrder[]> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch orders"
    );
  }

  return result.data;
};

export const updateOrderStatus = async (
  id: string,
  data: {
    orderStatus?: AdminOrder["orderStatus"];
    paymentStatus?: AdminOrder["paymentStatus"];
  }
) => {
  const response = await fetch(
    `${API_BASE_URL}/orders/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update order status"
    );
  }

  return result.data;
};

export const cancelOrder = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to cancel order"
    );
  }

  return result.data;
};