const API_URL = "http://localhost:5000/api";

export const getMyOrders = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
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

export const createOrder = async (payload: CreateOrderPayload) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to place order");
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
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/orders/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to cancel order"
    );
  }

  return result.data;
};