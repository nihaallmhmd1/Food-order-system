const API_URL = "http://localhost:5000/api";

export interface Category {
  _id: string;
  name: string;
  image?: string;
  imageUrl?: string;
  restaurantId?: string;
}

export interface CreateCategoryData {
  name: string;
  image?: string;
  restaurantId?: string;
}

export interface UpdateCategoryData {
  name: string;
  image?: string;
  restaurantId?: string;
}

// GET categories
export const getCategories = async (restaurantId?: string) => {
  const url = restaurantId
    ? `${API_URL}/categories?restaurantId=${restaurantId}`
    : `${API_URL}/categories`;

  const token = localStorage.getItem("token");
  const response = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const result = await response.json();

  return result.data;
};

// CREATE category
export const createCategory = async (data: CreateCategoryData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create category");
  }

  return result.data;
};

// UPDATE category
export const updateCategory = async (
  id: string,
  data: UpdateCategoryData
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update category");
  }

  return result.data;
};

// DELETE category
export const deleteCategory = async (id: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete category");
  }

  return result;
};