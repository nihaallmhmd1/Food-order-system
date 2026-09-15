const API_URL = "http://localhost:5000/api";

export interface Role {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
}

export interface CreateRoleData {
  name: string;
  description: string;
  permissions?: string[];
}

// Fetch all roles
export const getAllRoles = async (): Promise<Role[]> => {
  const response = await fetch(`${API_URL}/roles`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch roles"
    );
  }

  return result.roles;
};

// Create role
export const createRole = async (
  data: CreateRoleData
): Promise<Role> => {
  const response = await fetch(`${API_URL}/roles`, {
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
      result.message || "Failed to create role"
    );
  }

  return result.role;
};

// Update role
export const updateRole = async (
  roleId: string,
  data: CreateRoleData
): Promise<Role> => {
  const response = await fetch(
    `${API_URL}/roles/${roleId}`,
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
      result.message || "Failed to update role"
    );
  }

  return result.role;
};

// Delete role
export const deleteRole = async (
  roleId: string
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/roles/${roleId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to delete role"
    );
  }
};