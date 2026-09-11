import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ restaurantId: 1, createdAt: -1 });
categorySchema.index({ restaurantId: 1, name: 1 });

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;