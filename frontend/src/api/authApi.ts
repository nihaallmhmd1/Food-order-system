const API_URL = "http://localhost:5000/api";

export interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: Role | string;
  restaurantId?: string | { _id: string; name: string } | null;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

// Register user
export const registerUser = async (
  data: RegisterData
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
};

// Login user
export const loginUser = async (
  data: LoginData
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
};

// Get currently logged-in user
export const getMe = async (): Promise<{
  success: boolean;
  user: User;
}> => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Authentication failed");
  }

  return result;
};

// Logout user
export const logoutUser = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Logout failed");
  }

  return result;
};