import { Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import Role from "../models/Role";
import Restaurant from "../models/Restaurant";
import { AuthRequest } from "../middleware/authMiddleware";

// Get all users
export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role", "_id name description permissions")
      .populate("restaurantId", "_id name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

// Update user role
export const updateUserRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { roleId, role, restaurantId } = req.body;
    const requestedRole = roleId || role;

    if (!requestedRole) {
      res.status(400).json({
        success: false,
        message: "Role ID is required",
      });
      return;
    }

    // Verify role document exists in DB by ID
    const roleExists = mongoose.Types.ObjectId.isValid(requestedRole)
      ? await Role.findById(requestedRole)
      : await Role.findOne({ name: String(requestedRole).toLowerCase() });
    if (!roleExists) {
      res.status(404).json({
        success: false,
        message: "Role not found",
      });
      return;
    }

    if (roleExists.name === "restaurantadmin") {
      if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
        res.status(400).json({ success: false, message: "restaurantId is required for restaurantadmin" });
        return;
      }
      const restaurant = await Restaurant.findOne({ _id: restaurantId, isActive: true });
      if (!restaurant) {
        res.status(404).json({ success: false, message: "Restaurant not found" });
        return;
      }
    }

    // Prevent admin from changing their own role
    if (req.user?.userId === id) {
      res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        role: roleExists._id,
        restaurantId: roleExists.name === "restaurantadmin" ? restaurantId : null,
      },
      { new: true }
    )
      .select("-password")
      .populate("role", "_id name description permissions")
      .populate("restaurantId", "_id name");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user role",
    });
  }
};

// Delete user
export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?.userId === id) {
      res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
      return;
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

export const createUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, roleId, restaurantId } = req.body;
    if (!name || !email || !password || !roleId) {
      res.status(400).json({ success: false, message: "Name, email, password, and roleId are required" });
      return;
    }

    const role = await Role.findById(roleId);
    if (!role) {
      res.status(404).json({ success: false, message: "Role not found" });
      return;
    }
    if (role.name === "restaurantadmin") {
      if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) {
        res.status(400).json({ success: false, message: "restaurantId is required for restaurantadmin" });
        return;
      }
      const restaurant = await Restaurant.findOne({ _id: restaurantId, isActive: true });
      if (!restaurant) {
        res.status(404).json({ success: false, message: "Restaurant not found" });
        return;
      }
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ success: false, message: "User with this email already exists" });
      return;
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: await bcrypt.hash(password, 10),
      role: role._id as any,
      restaurantId: role.name === "restaurantadmin" ? restaurantId : null,
    });

    const responseUser = await User.findById(user._id)
      .select("-password")
      .populate("role", "_id name description permissions")
      .populate("restaurantId", "_id name");
    res.status(201).json({ success: true, user: responseUser });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ success: false, message: "Server error while creating user" });
  }
};