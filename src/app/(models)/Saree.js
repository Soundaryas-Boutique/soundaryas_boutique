import mongoose from "mongoose";

const sareeSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Silk", "Cotton", "Designer", "Banarasi", "Casual", "Other"],
    },
    tags: [String],
    colors: [String],
    sizes: [String],
    material: {
      type: String,
    },
    // ✅ FIX: The 'images' array is now optional by adding a default empty array.
    images: {
      type: [
        {
          url: { type: String, required: true },
          alt: { type: String },
        },
      ],
      default: [],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Saree ||
  mongoose.model("Saree", sareeSchema, "sarees");