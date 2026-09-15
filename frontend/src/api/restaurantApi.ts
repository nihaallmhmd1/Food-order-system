import API_BASE_URL from "./api";

export const getRestaurants = async () => {
  const response = await fetch(`${API_BASE_URL}/restaurants`);

  if (!response.ok) {
    throw new Error("Failed to fetch restaurants");
  }

  const result = await response.json();

  return result.data;
};

export const getRestaurantById = async (id: string) => {
  const response = await fetch(
    `${API_BASE_URL}/restaurants/${id}`
  );

  if (!response.ok) {
    throw new Error("Restaurant not found");
  }

  const result = await response.json();

  return result.data;
};

export interface CreateRestaurantData {
  name: string;
  description: string;
  cuisine: string;
  rating?: number;
  deliveryTime: string;
  deliveryFee?: number;
  minimumOrder?: number;
  image?: string;
  bannerImage?: string;
  address: string;
  phone?: string;
  isOpen?: boolean;
  isActive?: boolean;
}

export const createRestaurant = async (
  data: CreateRestaurantData
) => {
  const response = await fetch(`${API_BASE_URL}/restaurants`, {
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
      result.message || "Failed to create restaurant"
    );
  }

  return result.data;
};

export const updateRestaurant = async (
  id: string,
  data: Partial<CreateRestaurantData>
) => {
  const response = await fetch(
    `${API_BASE_URL}/restaurants/${id}`,
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
      result.message || "Failed to update restaurant"
    );
  }

  return result.data;
};

export const deleteRestaurant = async (id: string) => {
  const response = await fetch(
    `${API_BASE_URL}/restaurants/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete restaurant"
    );
  }

  return result;
};