import dotenv from "dotenv";
import mongoose from "mongoose";
import Role from "../models/Role";
import User from "../models/User";

dotenv.config();

const migrateRoles = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(mongoURI);

    const adminRole = await Role.findOneAndUpdate(
      { name: "admin" },
      { name: "admin", description: "Full access to the administration dashboard." },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const customerRole = await Role.findOneAndUpdate(
      { name: "customer" },
      { name: "customer", description: "Default access to browse food items and place orders." },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const restaurantAdminRole = await Role.findOneAndUpdate(
      { name: "restaurantadmin" },
      {
        name: "restaurantadmin",
        description: "Manage assigned restaurant operations.",
        permissions: ["dashboard", "categories", "food-items", "orders"],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const users = await User.collection.find({ role: { $type: "string" } }).toArray();
    let migratedCount = 0;

    for (const user of users) {
      const roleName = String(user.role).toLowerCase();
      const roleId = roleName === "admin" ? adminRole._id : customerRole._id;
      await User.collection.updateOne(
        { _id: user._id },
        { $set: { role: roleId } }
      );
      migratedCount += 1;
    }

    await User.collection.updateMany(
      { role: adminRole._id },
      { $set: { restaurantId: null } }
    );
    await User.collection.updateMany(
      { role: customerRole._id },
      { $set: { restaurantId: null } }
    );
    const unassignedRestaurantAdmins = await User.collection.countDocuments({
      role: restaurantAdminRole._id,
      $or: [{ restaurantId: null }, { restaurantId: { $exists: false } }],
    });

    console.log(`Role migration complete. Migrated ${migratedCount} user(s). Unassigned restaurant admins: ${unassignedRestaurantAdmins}.`);
  } catch (error) {
    console.error("Role migration failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

migrateRoles();