import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Role from "../models/Role";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    roleId?: string;
    role: string | { name?: string };
    restaurantId: string | null;
    permissions?: string[];
  };
}

interface JWTPayload {
  userId: string;
  roleId?: string;
  role: string | { name?: string };
  restaurantId?: string | null;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
      return;
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
      return;
    }

    const token = parts[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    const user = await User.findById(decoded.userId)
      .select("role restaurantId")
      .populate<{ role: { _id: string; name: string; permissions: string[] } }>(
        "role",
        "_id name permissions"
      );

    if (!user || !user.role) {
      res.status(401).json({ success: false, message: "User account is invalid" });
      return;
    }

    req.user = {
      userId: decoded.userId,
      roleId: String(user.role._id),
      role: user.role.name,
      restaurantId: user.restaurantId ? String(user.restaurantId) : null,
      permissions: user.role.permissions || [],
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.headers.authorization) {
    next();
    return;
  }
  await authenticate(req, res, next);
};

export const getRoleName = (req: AuthRequest): string | undefined =>
  typeof req.user?.role === "object" && req.user.role !== null
    ? req.user.role.name
    : req.user?.role;

export const getTenantId = (req: AuthRequest): string | null =>
  getRoleName(req) === "restaurantadmin" ? req.user?.restaurantId || null : null;

export const requireTenantAssignment = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (getRoleName(req) === "restaurantadmin" && !req.user?.restaurantId) {
    res.status(403).json({
      success: false,
      message: "A restaurant assignment is required",
    });
    return;
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  // Extract role name whether it is stored as a direct string or an object
  const roleName =
    typeof req.user.role === "object" && req.user.role !== null
      ? req.user.role.name
      : req.user.role;

  if (roleName !== "admin") {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });
    return;
  }

  next();
};

export const requirePermission = (permission: string) => async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  const roleName =
    typeof req.user.role === "object" && req.user.role !== null
      ? req.user.role.name
      : req.user.role;

  if (roleName === "admin") {
    next();
    return;
  }

  try {
    const role = req.user.roleId
      ? await Role.findById(req.user.roleId).select("name permissions")
      : null;

    if (role?.name === "admin" || role?.permissions?.includes(permission)) {
      req.user.permissions = role?.permissions || [];
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: `Access denied for ${permission}`,
    });
  } catch (error) {
    console.error("Permission check error:", error);
    res.status(500).json({ success: false, message: "Unable to verify permissions" });
  }
};