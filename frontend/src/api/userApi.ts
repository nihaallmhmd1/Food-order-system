const API_URL = "http://localhost:5000/api";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt: string;
  updatedAt: string;
}

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch users");
  }

  return result.users;
};

export const updateUserRole = async (
  userId: string,
  role: "customer" | "admin"
): Promise<AdminUser> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user role");
  }

  return result.user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete user");
  }
};