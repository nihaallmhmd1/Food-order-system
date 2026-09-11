import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role, { IRole } from "../models/Role"; // Import IRole interface
import { AuthRequest } from "../middleware/authMiddleware";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    // Find default "customer" role from database with explicit type casting
    const customerRole = (await Role.findOne({ name: "customer" })) as IRole | null;

    if (!customerRole) {
      res.status(500).json({
        success: false,
        message: "Default 'customer' role is not configured in database",
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with customer role ObjectId
    // Create user with customer role ObjectId
const user = await User.create({
  name,
  email: email.toLowerCase(),
  password: hashedPassword,
  role: customerRole._id as any,
  restaurantId: null,
});

// Get JWT secret
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  res.status(500).json({
    success: false,
    message: "JWT_SECRET is not configured",
  });
  return;
}

// Extract ID safely as string
const roleIdStr = (customerRole._id as unknown as string).toString();
const roleNameStr = String(customerRole.name);

// Include role ObjectId and role name in token
const token = jwt.sign(
  {
    userId: user._id,
    roleId: roleIdStr,
    role: roleNameStr,
    restaurantId: null,
  },
  jwtSecret,
  {
    expiresIn: "7d",
  }
);

res.status(201).json({
  success: true,
  message: "Registration successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: customerRole,
    restaurantId: null,
  },
});
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while registering user",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user and populate full Role document
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).populate<{ role: IRole }>("role", "_id name description permissions");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Get JWT secret
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
      return;
    }

    const roleObj = user.role as unknown as IRole;

    // Create JWT containing role details
    const token = jwt.sign(
      {
        userId: user._id,
        roleId: roleObj?._id,
        role: roleObj?.name,
        restaurantId: user.restaurantId ? String(user.restaurantId) : null,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while logging in",
    });
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const user = await User.findById(req.user.userId)
      .select("-password")
      .populate<{ role: IRole }>("role", "_id name description permissions");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};