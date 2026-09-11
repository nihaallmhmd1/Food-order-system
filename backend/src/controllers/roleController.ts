import { Response } from "express";
import mongoose from "mongoose";
import Role from "../models/Role";
import { AuthRequest } from "../middleware/authMiddleware";

const validPermissions = new Set([
  "dashboard",
  "restaurants",
  "categories",
  "food-items",
  "orders",
  "users",
  "roles",
]);

const cleanPermissions = (permissions: unknown): string[] =>
  Array.isArray(permissions)
    ? permissions.filter(
        (permission): permission is string =>
          typeof permission === "string" && validPermissions.has(permission)
      )
    : [];

const defaultPermissionsForRole = (name: string): string[] =>
  name.toLowerCase() === "restaurantadmin"
    ? ["dashboard", "categories", "food-items", "orders"]
    : [];

export const getAllRoles = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Get all roles error:", error);
    res.status(500).json({ success: false, message: "Server error while fetching roles" });
  }
};

export const createRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, permissions } = req.body;
    if (!name?.trim() || !description?.trim()) {
      res.status(400).json({ success: false, message: "Name and description are required" });
      return;
    }
    const normalizedName = name.trim().toLowerCase();
    const role = await Role.create({
      name: normalizedName,
      description: description.trim(),
      permissions: Array.isArray(permissions)
        ? cleanPermissions(permissions)
        : defaultPermissionsForRole(normalizedName),
    });
    res.status(201).json({ success: true, role });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      res.status(409).json({ success: false, message: "A role with this name already exists" });
      return;
    }
    console.error("Create role error:", error);
    res.status(500).json({ success: false, message: "Server error while creating role" });
  }
};

export const updateRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({ success: false, message: "Invalid role ID" });
      return;
    }

    const { name, description, permissions } = req.body;
    if (!name?.trim() || !description?.trim()) {
      res.status(400).json({ success: false, message: "Name and description are required" });
      return;
    }
    const updateData: { name: string; description: string; permissions?: string[] } = {
      name: name.trim(),
      description: description.trim(),
    };
    if (Array.isArray(permissions)) updateData.permissions = cleanPermissions(permissions);

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!role) {
      res.status(404).json({ success: false, message: "Role not found" });
      return;
    }
    res.status(200).json({ success: true, role });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      res.status(409).json({ success: false, message: "A role with this name already exists" });
      return;
    }
    console.error("Update role error:", error);
    res.status(500).json({ success: false, message: "Server error while updating role" });
  }
};

export const deleteRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      res.status(404).json({ success: false, message: "Role not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    console.error("Delete role error:", error);
    res.status(500).json({ success: false, message: "Server error while deleting role" });
  }
};