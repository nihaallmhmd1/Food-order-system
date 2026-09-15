import API_BASE_URL from "./api";

export const getFoodItems = async (restaurantId?: string) => {
  const url = restaurantId
    ? `${API_BASE_URL}/food-items?restaurantId=${restaurantId}`
    : `${API_BASE_URL}/food-items`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch food items");
  }

  const result = await response.json();

  return result.data;
};

export interface CreateFoodItemData {
  restaurantId?: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isVeg?: boolean;
  isAvailable?: boolean;
  sortOrder?: number;
}

export const createFoodItem = async (
  data: CreateFoodItemData
) => {
  const response = await fetch(`${API_BASE_URL}/food-items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create food item"
    );
  }

  return result.data;
};

export const updateFoodItem = async (
  id: string,
  data: Partial<CreateFoodItemData>
) => {
  const response = await fetch(`${API_BASE_URL}/food-items/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update food item"
    );
  }

  return result.data;
};

export const deleteFoodItem = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/food-items/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete food item"
    );
  }

  return result;
};

export interface FoodItem {
  _id: string;
  restaurantId:
    | string
    | {
        _id: string;
        name: string;
      };
  categoryId:
    | string
    | {
        _id: string;
        name: string;
      };
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}