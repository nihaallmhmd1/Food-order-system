import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User";
import Role from "../models/Role";

dotenv.config();

const createAdmin = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(mongoURI);

    const email = "admin@gmail.com";
    const password = "admin123";
    const name = "Admin";

    const adminRole = await Role.findOneAndUpdate(
      { name: "admin" },
      { name: "admin", description: "Full access to the administration dashboard." },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      await User.updateOne(
        { _id: existingAdmin._id },
        { $set: { role: adminRole._id as any } }
      );
      console.log("Admin already exists; admin role reference repaired");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: adminRole._id as any,
    });

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();