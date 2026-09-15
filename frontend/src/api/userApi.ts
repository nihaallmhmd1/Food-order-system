import API_BASE_URL from "./api";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  restaurantId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminUserData {
  name: string;
  email: string;
  password: string;
  roleId: string;
  restaurantId?: string | null;
}

const roleName = (
  role: string | { name?: string } | null | undefined
): string =>
  typeof role === "string" ? role : role?.name || "";

const restaurantId = (
  restaurant: string | { _id?: string } | null | undefined
): string | null =>
  typeof restaurant === "string"
    ? restaurant
    : restaurant?._id || null;

export const getAllUsers = async (): Promise<AdminUser[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch users"
    );
  }

  return result.users.map(
    (
      user: AdminUser & {
        role: string | { name?: string } | null;
        restaurantId?: string | { _id?: string } | null;
      }
    ) => ({
      ...user,
      role: roleName(user.role),
      restaurantId: restaurantId(user.restaurantId),
    })
  );
};

export const updateUserRole = async (
  userId: string,
  roleId: string,
  assignedRestaurantId?: string | null
): Promise<AdminUser> => {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/role`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        roleId,
        restaurantId: assignedRestaurantId || null,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to update user role"
    );
  }

  return {
    ...result.user,
    role: roleName(result.user.role),
    restaurantId: restaurantId(result.user.restaurantId),
  };
};

export const deleteUser = async (
  userId: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete user"
    );
  }
};

export const createUser = async (
  data: CreateAdminUserData
): Promise<AdminUser> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
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
      result.message || "Failed to create user"
    );
  }

  return {
    ...result.user,
    role: roleName(result.user.role),
    restaurantId: restaurantId(result.user.restaurantId),
  };
};