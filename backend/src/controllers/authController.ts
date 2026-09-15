import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role, { IRole } from "../models/Role";
import { AuthRequest } from "../middleware/authMiddleware";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Register user
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

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

    const customerRole = (await Role.findOne({
      name: "customer",
    })) as IRole | null;

    if (!customerRole) {
      res.status(500).json({
        success: false,
        message: "Default 'customer' role is not configured in database",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: customerRole._id as any,
      restaurantId: null,
    });

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
      return;
    }

    const roleIdStr = (customerRole._id as unknown as string).toString();
    const roleNameStr = String(customerRole.name);

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

    // Store JWT in HttpOnly cookie
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "Registration successful",
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

// Login user
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).populate<{ role: IRole }>(
      "role",
      "_id name description permissions"
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

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

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
      return;
    }

    const roleObj = user.role as unknown as IRole;

    const token = jwt.sign(
      {
        userId: user._id,
        roleId: roleObj?._id,
        role: roleObj?.name,
        restaurantId: user.restaurantId
          ? String(user.restaurantId)
          : null,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );

    // Store JWT in HttpOnly cookie
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
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

// Get currently logged-in user
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
      .populate<{ role: IRole }>(
        "role",
        "_id name description permissions"
      );

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

// Logout user
export const logout = (
  req: Request,
  res: Response
): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};